import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 d"), // 10 messages or 1 d
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

  // Check if the IP is blocked
  const isBlocked = await redis.get(ip);
  if (isBlocked) {
    return new Response(
      "You have reached the message limit for today. Install me, use your own API key, and enjoy!",
      { status: 429 }
    );
  }

  try {
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      await redis.set(ip, "blocked", { ex: 86400 }); // 1 d

      return new Response(
        "You have reached the message limit for today. Install me, use your own API key, and enjoy!",
        { status: 429 }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response("An error occurred while processing your request.", {
      status: 500,
    });
  }

  const { messages, systemPrompt, model } = await req.json();

  const botResponse = await streamText({
    model: model ? anthropic(model) : anthropic("claude-3-5-haiku-20241022"),
    system:
      systemPrompt ||
      `You are a chatbot AI assistant. You must:
- Politely decline to discuss any topics outside of our services.
- Maintain a friendly, professional tone.
- Keep responses concise and focused on solving customer inquiries.
- Keep responses to 20 words or less, but go to up to a maximum of 50 words if you are explaining something or need to in order to answer a query.`,
    messages,
  });

  return botResponse.toDataStreamResponse();
}
