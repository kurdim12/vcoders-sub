"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AgentChip } from "@/components/agent-chip";
import { useStore } from "@/lib/store";
import { aiAsk } from "@/lib/ai";
import { Loader2, Send, Paperclip } from "lucide-react";
import type { AIResponse } from "@/lib/types";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: AIResponse["agent"];
  citations?: AIResponse["citations"];
  timestamp: Date;
}

export default function TutorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const materials = useStore((state) => state.materials);
  const notes = useStore((state) => state.notes);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await aiAsk(input, { materials, notes });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
        agent: response.agent,
        citations: response.citations,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to get response:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">AI Tutor Chat</h1>
          <p className="text-muted-foreground">
            Get personalized help with your coursework
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="min-h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>Chat with UNI-Agent</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto mb-4 max-h-[450px]">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                    <span className="text-2xl text-white">🤖</span>
                  </div>
                  <p className="text-lg font-medium mb-2">Start a conversation</p>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Ask me anything about your courses, assignments, or study materials.
                    I'm here to help you learn!
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent"
                      }`}
                    >
                      {message.role === "assistant" && message.agent && (
                        <div className="mb-2">
                          <AgentChip agent={message.agent} />
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                      {message.citations && message.citations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                          <p className="text-xs font-semibold mb-1">Sources:</p>
                          {message.citations.map((citation, idx) => (
                            <div
                              key={idx}
                              className="text-xs opacity-75 mb-1"
                            >
                              <span className="font-mono">{citation.label}</span>
                              {citation.snippet && (
                                <span className="ml-1 italic">
                                  {citation.snippet.substring(0, 80)}...
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-xs opacity-60 mt-2">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-accent">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="space-y-2">
              <Textarea
                placeholder="Ask a question or request help..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleSend();
                  }
                }}
                className="min-h-[80px]"
              />
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm">
                  <Paperclip className="mr-2 h-4 w-4" />
                  Attach Context (Demo)
                </Button>
                <Button onClick={handleSend} disabled={!input.trim() || loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tips for better responses</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Be specific about what you need help with</li>
              <li>• Mention the course or topic when relevant</li>
              <li>• Ask for explanations, not just answers</li>
              <li>• Use the context attach feature for targeted help</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

