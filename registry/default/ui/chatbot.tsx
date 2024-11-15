"use client";

import React, { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import {
  MessageSquare,
  ChevronDown,
  Sparkles,
  Bot,
  LucideIcon,
} from "lucide-react";

import {
  FaArrowUp as ArrowUp,
  FaChevronLeft as ChevronLeft,
} from "react-icons/fa6";

import { Button } from "./button";
import { Card } from "./card";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";
import { Avatar } from "./avatar";

import { useIsMobile } from "@/hooks/use-mobile";
import dynamic from "next/dynamic";

interface ChatMessage {
  id: string;
  role: "function" | "assistant" | "system" | "user" | "data" | "tool";
  content: string;
  createdAt: Date;
  isTyping?: boolean;
}

interface ChatBotProps {
  fixed?: boolean;
  open?: boolean;
  initialMessage?: string;
  title?: string;
  description?: string;
  descriptionIcon?: LucideIcon;
  botIcon?: LucideIcon | string;
  chatIcon?: LucideIcon | string;
  placeholderText?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  width?: string;
  height?: string;
  mobileFullScreen?: boolean;
  showTimestamp?: boolean;
  showAvatar?: boolean;
  buttonRoundedCorners?: string;
  animated?: boolean;
  customStyles?: React.CSSProperties;
  model?: string;
  systemPrompt?: string;
  onSendMessage?: (message: string) => void;
  onReceiveMessage?: (message: string) => void;
  onOpenChange?: (open: boolean) => void;
}

const ClientTimeAgo = dynamic(() => import("react-timeago"), {
  ssr: false,
});

const IconOrImage = ({
  icon: IconOrUrl,
  className = "",
  imgClassName = "",
}: {
  icon: LucideIcon | string;
  className?: string;
  imgClassName?: string;
}) => {
  if (typeof IconOrUrl === "string") {
    return <img src={IconOrUrl} alt="Icon" className={imgClassName} />;
  }
  const Icon = IconOrUrl;
  return <Icon className={className} />;
};

export default function ChatBot({
  fixed = true,
  open = false,
  initialMessage = "👋 Hey there! I'm an AI Chatbot.\n\nFeel free to ask me anything!",
  title = "AI Chatbot",
  description = "By druid/ui",
  descriptionIcon: DescriptionIcon = Sparkles,
  botIcon: BotIcon = Bot,
  chatIcon: ChatIcon = MessageSquare,
  placeholderText = "Ask a question...",
  position = "bottom-right",
  width = "400px",
  height = "704px",
  mobileFullScreen = true,
  showTimestamp = true,
  showAvatar = true,
  buttonRoundedCorners = "rounded-full",
  animated = true,
  customStyles = {},
  model,
  systemPrompt,
  onSendMessage,
  onReceiveMessage,
  onOpenChange,
}: ChatBotProps = {}) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(open);
  const {
    messages: rawChatMessages,
    input,
    handleInputChange,
    handleSubmit: handleChatSubmit,
    isLoading,
  } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: initialMessage,
        createdAt: new Date(Date.now()),
      },
    ],
    keepLastMessageOnError: true,
    api: "/api/chat",
    body: {
      systemPrompt,
      model,
    },
  });

  const chatMessages = rawChatMessages.map((message) => ({
    ...message,
    createdAt: message.createdAt || new Date(),
  }));

  const scrollRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(chatMessages.length);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isScrolledTop, setIsScrolledTop] = useState(true);

  useEffect(() => {
    if (
      scrollRef.current &&
      prevMessagesLength.current !== chatMessages.length
    ) {
      const scrollArea = scrollRef.current.closest(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollArea) {
        scrollArea.scrollTo({
          top: scrollArea.scrollHeight,
          behavior: "smooth",
        });
      }
      prevMessagesLength.current = chatMessages.length;
    }
  }, [chatMessages]);

  useEffect(() => {
    const scrollArea = scrollRef.current?.closest(
      "[data-radix-scroll-area-viewport]"
    );
    if (scrollArea) {
      setHasOverflow(scrollArea.scrollHeight > scrollArea.clientHeight);

      const handleScroll = () => {
        setIsScrolledTop(scrollArea.scrollTop === 0);
      };

      scrollArea.addEventListener("scroll", handleScroll);
      return () => scrollArea.removeEventListener("scroll", handleScroll);
    }
  }, [chatMessages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSendMessage) {
      onSendMessage(input);
    }

    await handleChatSubmit(e);
  };

  useEffect(() => {
    if (onReceiveMessage && chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1];
      if (lastMessage.role === "assistant") {
        onReceiveMessage(lastMessage.content);
      }
    }
  }, [chatMessages, onReceiveMessage]);

  const positionClasses = {
    "bottom-right": {
      button: "bottom-4 right-4",
      chatbot: "bottom-12 right-4",
    },
    "bottom-left": {
      button: "bottom-4 left-4",
      chatbot: "bottom-12 left-4",
    },
    "top-right": {
      button: "top-4 right-4",
      chatbot: "top-20 right-4",
    },
    "top-left": {
      button: "top-4 left-4",
      chatbot: "top-20 left-4",
    },
  };

  const buttonPositionClass = fixed ? positionClasses[position].button : "";

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const TypingAnimation = () => (
    <div className="flex space-x-1 p-4 bg-border/60 max-w-auto whitespace-pre-wrap rounded-md mr-8">
      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
    </div>
  );

  useEffect(() => {
    if (isMobile && mobileFullScreen && isOpen && fixed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, mobileFullScreen, isOpen]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        fixed ? "fixed" : "flex flex-col items-center"
      } ${fixed ? buttonPositionClass : ""} z-50`}
      style={customStyles}
    >
      {!isOpen ? (
        <Button
          onClick={handleToggle}
          className={`${buttonRoundedCorners} h-12 w-12 p-0 shadow-[0_0_30px_rgba(0,0,0,0.1)] bg-primary ${
            animated ? "hover:scale-110 transition-all duration-300" : ""
          } ${!fixed ? buttonPositionClass : ""}`}
        >
          <IconOrImage
            icon={ChatIcon}
            className="h-[22px] w-[22px] text-primary-foreground fill-primary-foreground"
            imgClassName="h-[22px] w-[22px] object-contain"
          />
        </Button>
      ) : (
        <>
          <Card
            className={`border-none ${fixed ? "fixed mb-8" : "mb-4"} ${
              isMobile && mobileFullScreen && fixed
                ? "bottom-0 right-0 w-full h-[100dvh] rounded-none mb-0"
                : `rounded-md ${
                    !isMobile ? positionClasses[position].chatbot : ""
                  } max-h-[calc(100vh-6rem)]` // equivalent of pt-4
            } flex flex-col shadow-[0_0_45px_rgba(0,0,0,0.15)] overflow-hidden ${
              animated ? "animate-in slide-in-from-bottom-2 duration-200" : ""
            }`}
            style={{
              ...(fixed
                ? {
                    width: !isMobile || !mobileFullScreen ? width : undefined,
                  }
                : { maxWidth: width }),
              height:
                !isMobile || !mobileFullScreen || !fixed
                  ? isMobile && !fixed
                    ? "550px"
                    : height
                  : undefined,
            }}
          >
            <div
              className={`flex bg-background items-center p-4 relative z-20 ${
                hasOverflow && !isScrolledTop ? "border-b" : ""
              }`}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggle}
                className="mr-2 z-20"
              >
                <ChevronLeft className="h-12 w-12" />
              </Button>
              <div className="flex-1">
                <div
                  className={`absolute inset-0 flex justify-center items-center transition-all duration-200 ${
                    isScrolledTop
                      ? "opacity-100 visible delay-200"
                      : "opacity-0 invisible delay-0 pointer-events-none"
                  }`}
                >
                  <span className="font-semibold">chatbot</span>
                </div>
                <div
                  className={`flex items-center transition-all duration-200 ${
                    isScrolledTop
                      ? "opacity-0 invisible delay-0 pointer-events-none"
                      : "opacity-100 visible delay-200"
                  }`}
                >
                  {showAvatar && (
                    <Avatar
                      className={`h-8 w-8 bg-border/60 rounded-md flex items-center justify-center`}
                    >
                      <IconOrImage
                        icon={BotIcon}
                        className="h-6 w-6 text-accent-foreground"
                        imgClassName="h-6 w-6 object-contain"
                      />
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
              </div>
            </div>

            <ScrollArea className="flex-1 px-4 relative z-0 overflow-hidden">
              <div className="flex flex-col justify-start space-y-4 mt-4 -pb-4 -mb-8">
                <div className="flex flex-col items-center justify-center mb-6">
                  <Avatar
                    className={`h-20 w-20 rounded-md bg-border/60 flex items-center justify-center`}
                  >
                    <IconOrImage
                      icon={BotIcon}
                      className="h-16 w-16 text-accent-foreground"
                      imgClassName="h-16 w-16 object-contain"
                    />
                  </Avatar>
                  <p className="font-normal my-2">AI Agent answers instantly</p>
                  <p className="font-light text-muted-foreground">
                    Ask for the team if needed
                  </p>
                </div>

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
                          : "justify-start items-end gap-3"
                      }`}
                    >
                      {showAvatar && message.role !== "user" && (
                        <Avatar
                          className={`h-8 w-8 bg-border/60 rounded-md flex items-center justify-center`}
                        >
                          <IconOrImage
                            icon={BotIcon}
                            className="h-6 w-6 text-accent-foreground"
                            imgClassName="h-6 w-6 object-contain"
                          />
                        </Avatar>
                      )}

                      <div className="group relative">
                        <div
                          className={`p-4 max-w-auto whitespace-pre-wrap rounded-md ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground ml-8"
                              : "bg-border/70 mr-8 font-light font-inter text-md"
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
                        <div className="text-xs text-muted-foreground mt-1 text-left ml-11 mb-4">
                          Bot ·{" "}
                          <ClientTimeAgo
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
                {isLoading &&
                  (!chatMessages.length ||
                    chatMessages[chatMessages.length - 1].role !==
                      "assistant") && (
                    <div className="flex flex-col items-start">
                      <div className="flex items-start gap-3">
                        {showAvatar && (
                          <Avatar
                            className={`h-8 w-8 bg-border/60 rounded-md flex items-center justify-center`}
                          >
                            <IconOrImage
                              icon={BotIcon}
                              className="h-6 w-6 text-accent-foreground"
                              imgClassName="h-6 w-6 object-contain"
                            />
                          </Avatar>
                        )}
                        <div className="group relative">
                          <TypingAnimation />
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 text-left ml-11 mb-4">
                        Bot · thinking...
                      </div>
                    </div>
                  )}
              </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="px-4 pb-4 bg-background">
              <div className="relative flex items-center w-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.075)]">
                <Input
                  placeholder={placeholderText}
                  name="prompt"
                  value={input}
                  onChange={handleInputChange}
                  className="w-full rounded-full pr-14 py-6 text-base leading-normal"
                />
                <div className="absolute right-2 flex items-center">
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </Card>
          <Button
            onClick={handleToggle}
            className={`${buttonRoundedCorners} h-12 w-12 p-0 shadow-lg bg-primary ${
              animated ? "hover:scale-110 transition-all duration-300" : ""
            } ${isMobile ? "m-4" : ""} ${!fixed ? buttonPositionClass : ""}`}
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
        </>
      )}
    </div>
  );
}
