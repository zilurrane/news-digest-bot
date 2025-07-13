// src/scheduler.ts
import cron from "node-cron";
import { fetchTrendingTopics } from "./scrapers/fetchTrends";
import { generateSummary } from "./summarizer/generateSummary";
import { sendDigestEmail } from "./email/sendDigestEmail";

async function runDigestJob(): Promise<void> {
  console.log("[X Digest Bot] Running digest job...");

  let topicsWithArticleTitles = await fetchTrendingTopics();

  for (const topicWithArticleTitles of topicsWithArticleTitles) {
    const articleTitles = (topicWithArticleTitles.articleTitles || []).join("\n");
    const summary = await generateSummary(articleTitles);
    const summaryContent = JSON.parse(summary);
    topicWithArticleTitles.summary = summaryContent?.Summary || summaryContent?.summary || summaryContent;
  }
  // console.log(topicsWithArticleTitles);
  await sendDigestEmail(topicsWithArticleTitles);
  // console.log("[X Digest Bot] Email sent successfully.");
}

runDigestJob();

// Schedule to run at 7 AM and 7 PM
cron.schedule("0 7,19 * * *", runDigestJob);
