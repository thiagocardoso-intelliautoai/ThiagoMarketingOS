// linkedin-auth — Initiates LinkedIn OAuth 2.0 Authorization Code Flow
// Redirects user to LinkedIn authorization page

const LINKEDIN_CLIENT_ID = Deno.env.get('LINKEDIN_CLIENT_ID')!;
const REDIRECT_URI = Deno.env.get('LINKEDIN_REDIRECT_URI')!;
const FRONTEND_URL = Deno.env.get('FRONTEND_URL')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Generate CSRF state token
    const state = crypto.randomUUID();

    // Store state in Supabase for validation on callback
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    await fetch(`${supabaseUrl}/rest/v1/oauth_states`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        state,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 min TTL
      }),
    });

    // Build LinkedIn authorization URL
    // Docs: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow
    const scopes = ['openid', 'profile', 'w_member_social'];
    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', LINKEDIN_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('scope', scopes.join(' '));

    // Redirect user to LinkedIn
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': authUrl.toString(),
      },
    });
  } catch (error) {
    console.error('[linkedin-auth] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to initiate OAuth flow' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
