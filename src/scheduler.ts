// src/scheduler.ts
import cron from "node-cron";
import { fetchTrendingTopics } from "./scrapers/fetchTrends";
import { scrapeTweetsForTopic } from "./scrapers/scrapeTweets";
import { generateSummary } from "./summarizer/generateSummary";
import { sendDigestEmail } from "./email/sendDigestEmail";

async function runDigestJob(): Promise<void> {
  console.log("[X Digest Bot] Running digest job...");

  const topics = await fetchTrendingTopics();
  console.log(topics);
  return;
  let fullDigest = "";

  for (const topic of topics) {
    const tweets = await scrapeTweetsForTopic("topic");
    const summary = await generateSummary(tweets);
    fullDigest += `📌 ${topic}\n${summary}\n\n`;
  }

  await sendDigestEmail(fullDigest);
  console.log("[X Digest Bot] Email sent successfully.");
}

runDigestJob();

// Schedule to run at 7 AM and 7 PM
cron.schedule("0 7,19 * * *", runDigestJob);
