// linkedin-callback — Handles OAuth callback from LinkedIn
// Exchanges authorization code for access token and saves to DB

const LINKEDIN_CLIENT_ID = Deno.env.get('LINKEDIN_CLIENT_ID')!;
const LINKEDIN_CLIENT_SECRET = Deno.env.get('LINKEDIN_CLIENT_SECRET')!;
const REDIRECT_URI = Deno.env.get('LINKEDIN_REDIRECT_URI')!;
const FRONTEND_URL = Deno.env.get('FRONTEND_URL')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const errorDesc = url.searchParams.get('error_description');

  // Handle user denial or errors
  if (error) {
    console.error(`[linkedin-callback] OAuth error: ${error} — ${errorDesc}`);
    return new Response(null, {
      status: 302,
      headers: { Location: `${FRONTEND_URL}#settings?linkedin=error&reason=${encodeURIComponent(errorDesc || error)}` },
    });
  }

  if (!code || !state) {
    return new Response(null, {
      status: 302,
      headers: { Location: `${FRONTEND_URL}#settings?linkedin=error&reason=missing_params` },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  try {
    // ── 1. Validate CSRF state ──
    const stateCheck = await fetch(
      `${supabaseUrl}/rest/v1/oauth_states?state=eq.${state}&expires_at=gte.${new Date().toISOString()}&select=id`,
      {
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
      }
    );
    const states = await stateCheck.json();

    if (!Array.isArray(states) || states.length === 0) {
      console.error('[linkedin-callback] Invalid or expired state');
      return new Response(null, {
        status: 302,
        headers: { Location: `${FRONTEND_URL}#settings?linkedin=error&reason=invalid_state` },
      });
    }

    // Delete used state
    await fetch(`${supabaseUrl}/rest/v1/oauth_states?state=eq.${state}`, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
    });

    // ── 2. Exchange code for access token ──
    // Docs: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow#step-3-exchange-authorization-code-for-an-access-token
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error('[linkedin-callback] Token exchange failed:', errBody);
      return new Response(null, {
        status: 302,
        headers: { Location: `${FRONTEND_URL}#settings?linkedin=error&reason=token_exchange_failed` },
      });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in; // seconds (usually 5184000 = 60 days)

    // ── 3. Get user profile (OpenID Connect userinfo) ──
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    let personUrn = '';
    let displayName = '';
    let profilePicture = '';

    if (profileRes.ok) {
      const profile = await profileRes.json();
      personUrn = `urn:li:person:${profile.sub}`;
      displayName = profile.name || '';
      profilePicture = profile.picture || '';
    }

    // ── 4. Upsert token in database ──
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    const upsertRes = await fetch(`${supabaseUrl}/rest/v1/linkedin_tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        user_id: 'default',
        access_token: accessToken,
        person_urn: personUrn,
        display_name: displayName,
        profile_picture_url: profilePicture,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!upsertRes.ok) {
      const errBody = await upsertRes.text();
      console.error('[linkedin-callback] Token upsert failed:', errBody);
    }

    // ── 5. Redirect to frontend with success ──
    return new Response(null, {
      status: 302,
      headers: { Location: `${FRONTEND_URL}#settings?linkedin=connected` },
    });

  } catch (err) {
    console.error('[linkedin-callback] Unexpected error:', err);
    return new Response(null, {
      status: 302,
      headers: { Location: `${FRONTEND_URL}#settings?linkedin=error&reason=server_error` },
    });
  }
});
