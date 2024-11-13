import { Registry } from "@/registry/schema";

export const ui: Registry = [
  {
    name: "chatbot",
    type: "registry:ui",
    dependencies: [
      "react-timeago",
      "@types/react-timeago",
      "@ai-sdk/anthropic",
      "@upstash/ratelimit",
      "@upstash/redis",
      "lucide-react",
      "ai",
    ],
    files: [
      {
        path: "ui/chatbot.tsx",
        type: "registry:ui",
      },
      {
        path: "api/chat/route.ts",
        target: "app/api/chat/route.ts",
        type: "registry:page",
      },
      {
        path: "hooks/use-mobile.tsx",
        type: "registry:hook",
      },
    ],
  },
];
