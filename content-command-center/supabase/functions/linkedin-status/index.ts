// linkedin-status — Returns current LinkedIn connection status
// Used by the frontend Settings page to show connected/disconnected state

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/linkedin_tokens?user_id=eq.default&select=person_urn,display_name,profile_picture_url,expires_at&limit=1`,
      {
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    const tokens = await res.json();

    if (!Array.isArray(tokens) || tokens.length === 0) {
      return new Response(
        JSON.stringify({ connected: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = tokens[0];
    const isExpired = new Date(token.expires_at) < new Date();

    return new Response(
      JSON.stringify({
        connected: !isExpired,
        expired: isExpired,
        person_urn: token.person_urn,
        display_name: token.display_name,
        profile_picture_url: token.profile_picture_url,
        expires_at: token.expires_at,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('[linkedin-status] Error:', err);
    return new Response(
      JSON.stringify({ connected: false, error: 'Failed to check status' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
