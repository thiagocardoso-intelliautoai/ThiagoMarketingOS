import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const postId = url.searchParams.get('post_id');
    
    if (!postId) {
      return new Response(JSON.stringify({ error: 'post_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get post with post_urn
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, post_urn, status')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!post.post_urn) {
      return new Response(JSON.stringify({ error: 'Post has no LinkedIn URN. Publish it first.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check cache — skip API call if fetched within last hour
    const { data: cachedAnalytics } = await supabase
      .from('post_analytics')
      .select('*')
      .eq('post_id', postId)
      .single();

    const cacheMaxAge = 60 * 60 * 1000; // 1 hour
    if (cachedAnalytics && (Date.now() - new Date(cachedAnalytics.last_fetched_at).getTime()) < cacheMaxAge) {
      return new Response(JSON.stringify({
        source: 'cache',
        data: {
          impressions: cachedAnalytics.impressions,
          reactions: cachedAnalytics.reactions,
          comments: cachedAnalytics.comments,
          reshares: cachedAnalytics.reshares,
          members_reached: cachedAnalytics.members_reached,
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch from LinkedIn API
    const linkedinToken = Deno.env.get('LINKEDIN_ACCESS_TOKEN');
    if (!linkedinToken) {
      return new Response(JSON.stringify({ error: 'LinkedIn access token not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const analyticsUrl = `https://api.linkedin.com/rest/memberCreatorPostAnalytics?q=analytics&posts=List(${encodeURIComponent(post.post_urn)})&startDate.month=1&startDate.year=2024&endDate.month=12&endDate.year=2030&aggregation=CUMULATIVE`;
    
    const liResponse = await fetch(analyticsUrl, {
      headers: {
        'Authorization': `Bearer ${linkedinToken}`,
        'LinkedIn-Version': '202401',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!liResponse.ok) {
      const errorBody = await liResponse.text();
      console.error('LinkedIn API error:', liResponse.status, errorBody);
      
      // Return cached data if available, even if stale
      if (cachedAnalytics) {
        return new Response(JSON.stringify({
          source: 'stale_cache',
          data: {
            impressions: cachedAnalytics.impressions,
            reactions: cachedAnalytics.reactions,
            comments: cachedAnalytics.comments,
            reshares: cachedAnalytics.reshares,
            members_reached: cachedAnalytics.members_reached,
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ error: 'LinkedIn API error', status: liResponse.status }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const liData = await liResponse.json();
    
    // Parse LinkedIn response
    const element = liData.elements?.[0];
    const metrics = {
      impressions: element?.totalImpressions || 0,
      reactions: element?.totalReactions || 0,
      comments: element?.totalComments || 0,
      reshares: element?.totalReshares || 0,
      members_reached: element?.totalUniqueImpressions || 0,
    };

    // Upsert to post_analytics
    await supabase
      .from('post_analytics')
      .upsert({
        post_id: postId,
        post_urn: post.post_urn,
        ...metrics,
        last_fetched_at: new Date().toISOString(),
      }, {
        onConflict: 'post_id',
      });

    return new Response(JSON.stringify({
      source: 'linkedin_api',
      data: metrics,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error in linkedin-post-analytics:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
