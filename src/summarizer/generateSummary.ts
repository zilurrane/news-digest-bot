// src/summarizer/generateSummary.ts
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.3,
});

const prompt = new PromptTemplate({
  inputVariables: ["tweets"],
  template: `
You are an AI summarizer. Summarize these tweets into a 10-15 line digest:

{tweets}

Summary:
`
});

export async function generateSummary(tweets: string): Promise<string> {
  const formattedPrompt = await prompt.format({ tweets });
  const result = await model.invoke(formattedPrompt);
  return result.content as string;
}
