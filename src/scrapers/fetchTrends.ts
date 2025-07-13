// src/scrapers/fetchTrends.ts
import puppeteer from 'puppeteer';

// Interface for trend data
interface Trend {
  topic: string;
  category?: string;
}

// Function to delay execution
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to scrape trending topics from X
async function scrapeTrendingTopics(): Promise<Trend[]> {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ],
    timeout: 60000, // Increase timeout to 60 seconds
    protocolTimeout: 60000
  });

  try {
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 720 });

    console.log('[X Digest Bot] Navigating to X trending page...');
    
    // Navigate to X trending page
    await page.goto('https://twitter.com/explore/tabs/trending', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for content to load
    await delay(3000);

    // Debug: Take a screenshot to see what's on the page
    await page.screenshot({ path: 'debug-screenshot.png' });
    console.log('[X Digest Bot] Screenshot saved as debug-screenshot.png');

    // Debug: Log page title and URL
    const pageTitle = await page.title();
    const pageUrl = page.url();
    console.log(`[X Digest Bot] Page title: ${pageTitle}`);
    console.log(`[X Digest Bot] Page URL: ${pageUrl}`);

    // Try multiple selectors for trending topics
    const trendingTopics = await page.evaluate(() => {
      const topics: string[] = [];
      
      // Method 1: Look for trending topic elements with various selectors
      const selectors = [
        '[data-testid="trend"]',
        '[data-testid="trending"]',
        '[role="listitem"]',
        'div[dir="ltr"]',
        'span[dir="ltr"]'
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          const text = element.textContent?.trim();
          if (text && text.length > 0 && text.length < 50) {
            // Filter out common UI text
            const skipWords = ['Trending', 'Show more', 'Follow', 'Tweet', 'Retweet', 'Like', 'Reply'];
            if (!skipWords.some(word => text.includes(word))) {
              topics.push(text);
            }
          }
        });
      });

      // Method 2: Look for hashtags anywhere on the page
      const allText = document.body.textContent || '';
      const hashtags = allText.match(/#\w+/g) || [];
      hashtags.forEach((hashtag: string) => {
        if (!topics.includes(hashtag) && hashtag.length > 1) {
          topics.push(hashtag);
        }
      });

      // Method 3: Look for trending words (common trending terms)
      const trendingWords = ['AI', 'Crypto', 'Bitcoin', 'Ethereum', 'Tech', 'News', 'Breaking', 'Update'];
      trendingWords.forEach(word => {
        if (allText.includes(word) && !topics.includes(word)) {
          topics.push(word);
        }
      });

      // Remove duplicates and return top topics
      const uniqueTopics = [...new Set(topics)];
      return uniqueTopics.slice(0, 10);
    });

    console.log(`[X Digest Bot] Scraped ${trendingTopics.length} trending topics`);
    return trendingTopics.map(topic => ({ topic }));

  } catch (error) {
    console.error('[X Digest Bot] Error scraping trending topics:', error);
    return [];
  } finally {
    await browser.close();
  }
}

// Main function to fetch trending topics for the digest
export async function fetchTrendingTopics(): Promise<string[]> {
  try {
    console.log('[X Digest Bot] Fetching trending topics from X...');
    
    const trends = await scrapeTrendingTopics();
    
    if (trends.length === 0) {
      console.log('[X Digest Bot] No trending topics found, using fallback data');
      return ["AI News", "Tech Updates", "Breaking News", "Crypto", "Sports"];
    }

    // Extract topics from trends
    const topics = trends
      .slice(0, 5) // Get top 5 trending topics
      .map(trend => trend.topic);

    console.log(`[X Digest Bot] Found ${topics.length} trending topics:`, topics);
    return topics;

  } catch (error) {
    console.error('[X Digest Bot] Error in fetchTrendingTopics:', error);
    
    // If Puppeteer fails, try a simpler approach or use fallback
    if (error instanceof Error && error.message.includes('TimeoutError')) {
      console.log('[X Digest Bot] Puppeteer timeout, using fallback data');
    }
    
    // Fallback to mock data if scraping fails
    return ["AI News", "Tech Updates", "Breaking News", "Crypto", "Sports"];
  }
}
  