import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: anthropic("claude-3-5-haiku-20241022"),
    system: `You are a chatbot AI assistant. You must:
- Politely decline to discuss any topics outside of our services.
- Maintain a friendly, professional tone.
- Keep responses concise and focused on solving customer inquiries.
- Keep responses to 20 words or less, but go to up to a maximum of 50 words if you are explaining something or need to in order to answer a query.`,
    messages,
  });

  return result.toDataStreamResponse();
}
