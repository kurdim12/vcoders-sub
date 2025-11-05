"use client";

import { useState, useRef } from "react";
import { useCourse } from "@/components/course-context";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AgentChip } from "@/components/agent-chip";
import { logLearningEvent, awardXP } from "@/lib/hooks/xp";
import { Loader2, Send, StopCircle } from "lucide-react";
import type { AIResponse } from "@/lib/types";
import { WorkflowVisualization } from "@/components/workflow-visualization";
import { VoiceInput } from "@/components/voice-input";
import { retrieveRelevantDocuments, extractSnippet } from "@/lib/retrieval";

export function CourseTutor() {
  const { courseId } = useCourse();
  const [messages, setMessages] = useState<Array<{
    role: "user" | "assistant";
    content: string;
    agent?: AIResponse["agent"];
    citations?: AIResponse["citations"];
    workflow?: any;
    reasoning?: string;
    agentCalls?: any[];
    toolsUsed?: any[];
  }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useStore((state) => state.getCurrentUser());

  const materials = useStore((state) =>
    state.materials.filter((m) => m.courseId === courseId)
  );
  const notes = useStore((state) =>
    state.notes.filter((n) => n.courseId === courseId)
  );

  const handleSend = async () => {
    if (!input.trim() || loading || !user || !courseId) return;

    const startTime = Date.now();
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    const question = input;
    setInput("");
    setLoading(true);

    try {
      // Prepare documents for retrieval
      const documents = [
        ...materials.map((m) => ({
          id: m.id,
          text: m.textPreview || m.title,
          metadata: { type: "material", courseId: m.courseId, title: m.title },
        })),
        ...notes.map((n) => ({
          id: n.id,
          text: n.body,
          metadata: { type: "note", courseId: n.courseId, title: n.title },
        })),
      ];

      // Retrieve relevant documents
      const relevantDocs = retrieveRelevantDocuments(question, documents, 3);

      // Prepare context snippets
      const snippets = relevantDocs.map((doc) => ({
        text: extractSnippet(doc.text, question, 200),
        sourceId: doc.id,
        sourceType: doc.metadata?.type || "material",
        title: doc.metadata?.title || doc.id,
      }));

      // Call API (non-streaming to show workflow)
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: question,
          courseId,
          context: { snippets },
          userId: user.id,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const data = await response.json();
      const duration = Math.round((Date.now() - startTime) / 1000);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          agent: data.agent,
          citations: data.citations,
          workflow: data.workflow,
          reasoning: data.reasoning,
          agentCalls: data.agentCalls,
          toolsUsed: data.toolsUsed,
        },
      ]);

      // Log learning event and award XP
      if (user && courseId) {
        await logLearningEvent(
          user.id,
          courseId,
          "tutor",
          {
            question,
            materialRefs: data.citations?.map((c: any) => c.sourceId).filter(Boolean) || [],
          },
          duration,
          "completed"
        );

        await awardXP(user.id, courseId, "tutor_session", 15, {
          qLen: question.length,
          agent: data.agent,
        });
      }
    } catch (error: any) {
      console.error("Failed to get response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
      {/* Chat */}
      <div className="lg:col-span-2">
        <Card className="min-h-[500px] md:min-h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>Ask Course Tutor</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto mb-4 max-h-[450px]">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <p className="text-lg font-medium mb-2">Start a conversation</p>
                  <p className="text-sm text-muted-foreground">
                    Ask questions about this course's materials and concepts
                  </p>
                </div>
              ) : (
                messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent"
                      }`}
                    >
                      {message.agent && (
                        <div className="mb-2">
                          <AgentChip agent={message.agent} />
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.citations && message.citations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                          <p className="text-xs font-semibold mb-1">Sources:</p>
                          {message.citations.map((citation, i) => (
                            <div key={i} className="text-xs opacity-75">
                              <span className="font-mono">{citation.label}</span>{" "}
                              {citation.snippet && (
                                <span className="italic">{citation.snippet.substring(0, 60)}...</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Workflow Visualization */}
                      {message.workflow && (
                        <WorkflowVisualization
                          workflow={message.workflow}
                          agentCalls={message.agentCalls}
                          toolsUsed={message.toolsUsed}
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-3 bg-accent">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Ask a question about this course..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleSend();
                  }
                }}
                className="min-h-[80px]"
              />
              <div className="flex items-center gap-2">
                <VoiceInput
                  onTranscript={(text) => setInput(text)}
                  disabled={loading}
                />
                <Button onClick={handleSend} disabled={!input.trim() || loading} className="flex-1">
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
      </div>

      {/* Citations Sidebar */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Course Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {materials.length === 0 ? (
                <p className="text-sm text-muted-foreground">No materials available</p>
              ) : (
                materials.map((material) => (
                  <div key={material.id} className="p-2 rounded-lg bg-accent/50">
                    <p className="text-sm font-medium">{material.title}</p>
                    <p className="text-xs text-muted-foreground">{material.type}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
