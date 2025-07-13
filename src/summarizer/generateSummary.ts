// src/summarizer/generateSummary.ts
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.3,
});

const prompt = new PromptTemplate({
  inputVariables: ["content"],
  template: `
Summarize the following content in exactly 5 lines. Each line should be a clear, standalone sentence capturing one key point. Focus on names, events, and important details. Use neutral and respectful tone.
Format as a JSON Array
Content:
{content}

Summary:
`
});

export async function generateSummary(content: string): Promise<any> {
  const formattedPrompt = await prompt.format({ content });
  const result = await model.invoke(formattedPrompt);
  return result.content;
}
