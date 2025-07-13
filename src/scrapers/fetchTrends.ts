// src/scrapers/fetchTrends.ts
import GoogleTrendsApi from '@alkalisummer/google-trends-js';

// Interface for trend data
interface TrendData {
  title?: string;
  query?: string;
  traffic?: string;
  [key: string]: any;
}

// Interface for API response
interface TrendsResponse {
  data?: TrendData[];
  [key: string]: any;
}

// Configuration for trending topics
const TRENDS_CONFIG = {
  geo: 'IN', // India trends
  hl: 'en', // English language
  maxTopics: 5
};

// Function to fetch trending topics from Google Trends
async function fetchGoogleTrends(): Promise<TrendData[]> {
  try {
    console.log('[X Digest Bot] Fetching Google Trends...');

    const result: TrendsResponse = await GoogleTrendsApi.dailyTrends(TRENDS_CONFIG);

    if (result?.data && Array.isArray(result.data)) {
      console.log(`[X Digest Bot] Raw trends data:`, result.data.length, 'items');
      return result.data;
    }

    console.log('[X Digest Bot] No valid trends data found');
    return [];

  } catch (error) {
    console.error('[X Digest Bot] Error fetching Google Trends:', error);
    return [];
  }
}

// Main function to fetch trending topics for the digest
export async function fetchTrendingTopics(): Promise<TrendData[]> {
  try {
    console.log('[X Digest Bot] Starting trending topics fetch...');

    const trends = await fetchGoogleTrends();

    if (trends.length === 0) {
      console.log('[X Digest Bot] No trending topics found, using fallback data');
      return [];
    }

    // Extract and process topic names
    let selectedTopics = trends.slice(0, 1);//TRENDS_CONFIG.maxTopics);

    for (let topicIndex = 0; topicIndex < selectedTopics.length; topicIndex++) {
      const topic = selectedTopics[topicIndex];
      const articlesResponse = await GoogleTrendsApi.trendingArticles({
        articleCount: 20,
        articleKeys: topic.articleKeys,
      });
      const articles = articlesResponse.data || [];
      const articleTitles = articles.map((article: any) => article.title); // Remove HTML tags from titles
      console.log(`[X Digest Bot] Cleaned article titles for topic ${topicIndex + 1}:`);
      selectedTopics[topicIndex].articleTittles = articleTitles;
    }

    console.log(`[X Digest Bot] Found ${selectedTopics.length} trending topics`);
    return selectedTopics;

  } catch (error) {
    console.error('[X Digest Bot] Error in fetchTrendingTopics:', error);
    return [];
  }
}