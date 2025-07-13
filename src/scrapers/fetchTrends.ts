// src/scrapers/fetchTrends.ts
import GoogleTrendsApi from '@alkalisummer/google-trends-js';

const fetchTrendingTopics = async () => {
  try {
    console.log('[X Digest Bot] Fetching trending topics...');
    const result = await GoogleTrendsApi.dailyTrends({
      geo: 'IN', // India trends
      hl: 'en', // English language
    });

    console.log('Result:', result.data);
    
    if (result && result.data && result.data.length > 0) {
      const topics = result.data
        .slice(0, 5)
        .map((trend: any) => trend.keyword);
      
      console.log(`[X Digest Bot] Found ${topics.length} trending topics:`, topics);
      return topics;
    }
    
    return ["AI News", "Tech Updates", "Breaking News", "Crypto", "Sports"];
  } catch (error) {
    console.error('[X Digest Bot] Error fetching trending topics:', error);
    return ["AI News", "Tech Updates", "Breaking News", "Crypto", "Sports"];
  }
};

export { fetchTrendingTopics };