"use client";

import React, { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import TimeAgo from "react-timeago";
import {
  MessageCircle,
  ChevronDown,
  Send,
  ChevronLeft,
  Sparkles,
  Bot,
  LucideIcon,
} from "lucide-react";

import { Button } from "./button";
import { Card } from "./card";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";
import { Avatar, AvatarFallback } from "./avatar";

import { useIsMobile } from "@/hooks/use-mobile";

interface ChatMessage {
  id: string;
  role: "function" | "assistant" | "system" | "user" | "data" | "tool";
  content: string;
  createdAt: Date;
}

interface ChatBotProps {
  initialMessage?: string;
  title?: string;
  description?: string;
  descriptionIcon?: LucideIcon;
  botIcon?: LucideIcon;
  chatIcon?: LucideIcon;
  placeholderText?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  width?: string;
  height?: string;
  mobileFullScreen?: boolean;
  showTimestamp?: boolean;
  showAvatar?: boolean;
  roundedCorners?:
    | "rounded-none"
    | "rounded-sm"
    | "rounded-md"
    | "rounded-lg"
    | "rounded-xl"
    | "rounded-full";
  buttonRoundedCorners?:
    | "rounded-none"
    | "rounded-sm"
    | "rounded-md"
    | "rounded-lg"
    | "rounded-xl"
    | "rounded-full";
  animated?: boolean;
  customStyles?: React.CSSProperties;
  onSendMessage?: (message: string) => void;
  onReceiveMessage?: (message: string) => void;
}

export default function ChatBot({
  initialMessage = "👋 Hey there! I'm an AI Chatbot.\n\nFeel free to ask me anything!",
  title = "AI Chatbot",
  description = "By druid/ui",
  descriptionIcon: DescriptionIcon = Sparkles,
  botIcon: BotIcon = Bot,
  chatIcon: ChatIcon = MessageCircle,
  placeholderText = "Ask a question...",
  position = "bottom-right",
  width = "400px",
  height = "600px",
  mobileFullScreen = true,
  showTimestamp = true,
  showAvatar = true,
  roundedCorners = "rounded-md",
  buttonRoundedCorners = "rounded-full",
  animated = true,
  customStyles = {},
  onSendMessage,
  onReceiveMessage,
}: ChatBotProps = {}) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages: rawChatMessages,
    input,
    handleInputChange,
    handleSubmit: handleChatSubmit,
  } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: initialMessage,
        createdAt: new Date(),
      },
    ],
    keepLastMessageOnError: true,
  });

  const chatMessages = rawChatMessages.map((message) => ({
    ...message,
    createdAt: message.createdAt || new Date(),
  }));

  const scrollRef = useRef<HTMLDivElement>(null);
  const userScrollRef = useRef(false);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollArea = event.currentTarget.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (!scrollArea) return;
    const isScrolledToBottom =
      Math.abs(
        scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight
      ) < 25;
    userScrollRef.current = !isScrolledToBottom;
  };

  const isNearBottom = () => {
    const scrollArea =
      scrollRef.current?.parentElement?.parentElement?.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
    if (!scrollArea) return true;
    return (
      Math.abs(
        scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight
      ) < 25
    );
  };

  useEffect(() => {
    if (scrollRef.current && (!userScrollRef.current || isNearBottom())) {
      const timeoutId = setTimeout(() => {
        scrollRef.current?.scrollIntoView({
          behavior: animated ? "smooth" : "auto",
          block: "end",
        });
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [chatMessages, animated]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSendMessage) {
      onSendMessage(input);
    }
    handleChatSubmit(e);
  };

  useEffect(() => {
    if (onReceiveMessage && chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1];
      if (lastMessage.role === "assistant") {
        onReceiveMessage(lastMessage.content);
      }
    }
  }, [chatMessages, onReceiveMessage]);

  const positionClass = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  }[position];

  return (
    <div
      className={`fixed ${
        isMobile ? "bottom-0 right-0 left-0 m-0" : positionClass
      } z-50 flex justify-end`}
      style={customStyles}
    >
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className={`${buttonRoundedCorners} h-12 w-12 p-0 shadow-lg bg-primary ${
            animated ? "hover:scale-110 transition-all duration-300" : ""
          } ${isMobile ? "mr-4 mb-4" : ""}`}
        >
          <ChatIcon
            style={{ width: "22px", height: "22px", fill: "currentColor" }}
            className={`text-primary-foreground ${
              animated
                ? "transition-transform duration-300 rotate-45 scale-[0.15] animate-out [animation-fill-mode:forwards]"
                : ""
            }`}
            data-state={isOpen ? "open" : "closed"}
          />
        </Button>
      )}

      {isOpen && (
        <>
          <Button
            onClick={() => setIsOpen(false)}
            className={`${buttonRoundedCorners} h-12 w-12 p-0 shadow-lg bg-primary ${
              animated ? "hover:scale-110 transition-all duration-300" : ""
            } ${isMobile ? "mx-4 mb-4" : ""}`}
          >
            <ChevronDown
              style={{ width: "22px", height: "22px", fill: "currentColor" }}
              className={`text-primary-foreground ${
                animated
                  ? "transition-transform duration-300 -rotate-45 animate-out [animation-fill-mode:forwards]"
                  : ""
              }`}
            />
          </Button>
          <Card
            className={`absolute ${
              isMobile && mobileFullScreen
                ? "bottom-0 right-0 left-0 w-full h-[100dvh] rounded-none"
                : `bottom-16 right-0 ${roundedCorners}`
            } flex flex-col shadow-xl overflow-hidden ${
              animated ? "animate-in slide-in-from-bottom-2 duration-200" : ""
            }`}
            style={{
              width: !isMobile || !mobileFullScreen ? width : undefined,
              height: !isMobile || !mobileFullScreen ? height : undefined,
            }}
          >
            <div
              className={`flex bg-background items-center p-4 border-b relative z-20`}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="mr-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              {showAvatar && (
                <Avatar className={`h-8 w-8 bg-accent ${roundedCorners}`}>
                  <AvatarFallback className={roundedCorners}>
                    <BotIcon className="h-6 w-6 text-accent-foreground" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col ml-4">
                <h3 className="font-semibold text-base leading-none">
                  {title}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <DescriptionIcon className="h-3 w-3" />
                  <span className="text-xs text-muted-foreground">
                    {description}
                  </span>
                </div>
              </div>
            </div>

            <ScrollArea
              className="flex-1 px-4 relative z-0 overflow-hidden"
              onScroll={handleScroll}
            >
              <div className="flex flex-col justify-start h-full space-y-4 mt-4 -mb-4">
                {chatMessages.map((message: ChatMessage, index) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      message.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`flex relative ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start items-start gap-3"
                      }`}
                    >
                      {showAvatar && message.role !== "user" && (
                        <Avatar
                          className={`h-8 w-8 bg-accent ${roundedCorners}`}
                        >
                          <AvatarFallback className={roundedCorners}>
                            <BotIcon className="h-6 w-6 text-accent-foreground" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className="group relative">
                        <div
                          className={`p-4 max-w-auto whitespace-pre-wrap ${roundedCorners} ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground ml-8"
                              : "bg-accent mr-8"
                          }`}
                        >
                          {message.content}
                        </div>

                        {showTimestamp && (
                          <Card
                            className={`absolute -top-10 left-0 ${
                              animated
                                ? "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                : ""
                            } p-2 text-xs`}
                          >
                            {(() => {
                              const date = message.createdAt;
                              const now = new Date();
                              const isToday =
                                date.toDateString() === now.toDateString();
                              const isThisYear =
                                date.getFullYear() === now.getFullYear();

                              if (isToday) {
                                return date.toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                });
                              } else if (isThisYear) {
                                return date.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                });
                              } else {
                                return date.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "2-digit",
                                });
                              }
                            })()}
                          </Card>
                        )}
                      </div>
                    </div>
                    {showTimestamp &&
                      index === chatMessages.length - 1 &&
                      message.role === "assistant" && (
                        <div className="text-xs text-muted-foreground mt-1 text-left ml-11">
                          Bot ·{" "}
                          <TimeAgo
                            date={message.createdAt}
                            formatter={(value, unit) => {
                              if (unit === "second" && value < 60) {
                                return "Just now";
                              }
                              return `${value} ${unit}${
                                value !== 1 ? "s" : ""
                              } ago`;
                            }}
                          />
                          .
                        </div>
                      )}
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            <form
              onSubmit={handleSubmit}
              className={`p-4 border-t flex gap-4 bg-background`}
            >
              <Input
                placeholder={placeholderText}
                name="prompt"
                value={input}
                onChange={handleInputChange}
                className={`text-md ${roundedCorners}`}
              />
              <Button
                type="submit"
                className={`${roundedCorners} h-10 w-10 min-w-[40px] p-0 flex items-center justify-center`}
              >
                <Send className={`h-4 w-4`} />
              </Button>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}
