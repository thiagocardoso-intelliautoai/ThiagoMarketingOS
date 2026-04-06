// linkedin-publish — Publishes content to LinkedIn
// Supports 3 post types: text, image (cover), and document (PDF carousel)
// Docs: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api

const LINKEDIN_VERSION = '202504';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ─── Get stored token ───
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

// ─── LinkedIn API Headers ───
function linkedInHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
    'Linkedin-Version': LINKEDIN_VERSION,
  };
}

// ─── Initialize Image Upload ───
// Docs: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/images-api
async function uploadImage(token: string, personUrn: string, imageData: Uint8Array): Promise<string> {
  // Step 1: Initialize
  const initRes = await fetch('https://api.linkedin.com/rest/images?action=initializeUpload', {
    method: 'POST',
    headers: linkedInHeaders(token),
    body: JSON.stringify({
      initializeUploadRequest: { owner: personUrn },
    }),
  });

  if (!initRes.ok) {
    const err = await initRes.text();
    throw new Error(`Image init failed: ${err}`);
  }

  const initData = await initRes.json();
  const uploadUrl = initData.value.uploadUrl;
  const imageUrn = initData.value.image;

  // Step 2: Upload binary
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: imageData,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error(`Image upload failed: ${err}`);
  }

  return imageUrn;
}

// ─── Initialize Document Upload (PDF for carousels) ───
// Docs: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/documents-api
async function uploadDocument(token: string, personUrn: string, docData: Uint8Array): Promise<string> {
  // Step 1: Initialize
  const initRes = await fetch('https://api.linkedin.com/rest/documents?action=initializeUpload', {
    method: 'POST',
    headers: linkedInHeaders(token),
    body: JSON.stringify({
      initializeUploadRequest: { owner: personUrn },
    }),
  });

  if (!initRes.ok) {
    const err = await initRes.text();
    throw new Error(`Document init failed: ${err}`);
  }

  const initData = await initRes.json();
  const uploadUrl = initData.value.uploadUrl;
  const docUrn = initData.value.document;

  // Step 2: Upload binary
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: docData,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error(`Document upload failed: ${err}`);
  }

  return docUrn;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // ── Get token ──
    const auth = await getAccessToken();
    if (!auth) {
      return new Response(
        JSON.stringify({ error: 'LinkedIn not connected. Please connect in Settings.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── Parse multipart form data ──
    const formData = await req.formData();
    const commentary = formData.get('commentary') as string;
    const postType = (formData.get('post_type') as string) || 'text';
    const mediaFile = formData.get('media') as File | null;
    const mediaTitle = (formData.get('media_title') as string) || '';

    if (!commentary?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Post text (commentary) is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── Build post body ──
    const postBody: Record<string, unknown> = {
      author: auth.personUrn,
      commentary: commentary.trim(),
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    };

    // ── Handle media uploads ──
    if (postType === 'image' && mediaFile) {
      const imageBytes = new Uint8Array(await mediaFile.arrayBuffer());
      const imageUrn = await uploadImage(auth.token, auth.personUrn, imageBytes);
      postBody.content = {
        media: {
          altText: mediaTitle || 'Cover image',
          id: imageUrn,
        },
      };
    } else if (postType === 'carousel' && mediaFile) {
      const docBytes = new Uint8Array(await mediaFile.arrayBuffer());
      const docUrn = await uploadDocument(auth.token, auth.personUrn, docBytes);
      postBody.content = {
        media: {
          title: mediaTitle || mediaFile.name || 'Carousel.pdf',
          id: docUrn,
        },
      };
    }

    // ── Create post ──
    const postRes = await fetch('https://api.linkedin.com/rest/posts', {
      method: 'POST',
      headers: linkedInHeaders(auth.token),
      body: JSON.stringify(postBody),
    });

    if (!postRes.ok) {
      const errBody = await postRes.text();
      console.error('[linkedin-publish] Post creation failed:', errBody);
      return new Response(
        JSON.stringify({ error: 'Failed to publish post', details: errBody }),
        { status: postRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Post ID is in x-restli-id header
    const postUrn = postRes.headers.get('x-restli-id') || '';

    return new Response(
      JSON.stringify({
        success: true,
        post_urn: postUrn,
        post_type: postType,
        message: 'Post published successfully!',
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('[linkedin-publish] Error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
