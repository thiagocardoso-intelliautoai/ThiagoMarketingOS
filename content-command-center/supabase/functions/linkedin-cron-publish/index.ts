// linkedin-cron-publish — Publishes scheduled posts when their time arrives
// Trigger: Supabase pg_cron every minute, or external cron calling this endpoint
// Checks scheduled_posts with status='pending' and scheduled_at <= now()

const LINKEDIN_VERSION = '202504';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function getAccessToken(): Promise<{ token: string; personUrn: string } | null> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const res = await fetch(
    `${supabaseUrl}/rest/v1/linkedin_tokens?user_id=eq.default&select=access_token,person_urn,expires_at&limit=1`,
    {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
    }
  );

  const tokens = await res.json();
  if (!Array.isArray(tokens) || tokens.length === 0) return null;
  const t = tokens[0];
  if (new Date(t.expires_at) < new Date()) return null;
  return { token: t.access_token, personUrn: t.person_urn };
}

function linkedInHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
    'Linkedin-Version': LINKEDIN_VERSION,
  };
}

async function supabaseRequest(path: string, options: RequestInit = {}) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  return fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers,
    },
  });
}

async function publishToLinkedIn(auth: { token: string; personUrn: string }, post: Record<string, unknown>) {
  const postBody: Record<string, unknown> = {
    author: auth.personUrn,
    commentary: (post.post_content as string).trim(),
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false,
  };

  // Note: For scheduled posts with media, the media would need to be
  // uploaded at publish time. For now, text-only posts are fully supported.
  // Image/carousel media_url can be fetched and uploaded in a future iteration.

  const postRes = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: linkedInHeaders(auth.token),
    body: JSON.stringify(postBody),
  });

  if (!postRes.ok) {
    const errBody = await postRes.text();
    throw new Error(`LinkedIn API error: ${errBody}`);
  }

  return postRes.headers.get('x-restli-id') || '';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get pending posts that are due
    const pendingRes = await supabaseRequest(
      'scheduled_posts?status=eq.pending&scheduled_at=lte.' + new Date().toISOString() + '&order=scheduled_at.asc&limit=10'
    );
    const pendingPosts = await pendingRes.json();

    if (!Array.isArray(pendingPosts) || pendingPosts.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No posts due for publishing', processed: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get LinkedIn auth
    const auth = await getAccessToken();
    if (!auth) {
      return new Response(
        JSON.stringify({ error: 'LinkedIn not connected', processed: 0 }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    for (const post of pendingPosts) {
      try {
        // Mark as publishing
        await supabaseRequest(`scheduled_posts?id=eq.${post.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'publishing' }),
        });

        // Publish
        const postUrn = await publishToLinkedIn(auth, post);

        // Mark as published
        await supabaseRequest(`scheduled_posts?id=eq.${post.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: 'published',
            linkedin_post_urn: postUrn,
            published_at: new Date().toISOString(),
          }),
        });

        results.push({ id: post.id, status: 'published', post_urn: postUrn });
      } catch (err) {
        console.error(`[cron-publish] Failed for post ${post.id}:`, err);

        // Mark as failed
        await supabaseRequest(`scheduled_posts?id=eq.${post.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: 'failed',
            error_message: String(err),
          }),
        });

        results.push({ id: post.id, status: 'failed', error: String(err) });
      }
    }

    return new Response(
      JSON.stringify({ processed: results.length, results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[cron-publish] Error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal error', details: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
