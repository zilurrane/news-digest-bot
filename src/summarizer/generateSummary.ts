// src/summarizer/generateSummary.ts
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const model = new OpenAI({
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

const chain = new LLMChain({ llm: model, prompt });

export async function generateSummary(tweets: string): Promise<string> {
  const result = await chain.call({ tweets });
  return result.text;
}
