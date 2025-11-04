"use client";

import { useCourse } from "@/components/course-context";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentChip } from "@/components/agent-chip";
import { MessageSquare, Calendar, BookOpen, FileText, GraduationCap, StickyNote, Search, MapPin, Sparkles } from "lucide-react";
import type { Agent } from "@/lib/types";

const agents: {
  id: Agent;
  name: string;
  description: string;
  icon: React.ElementType;
  capabilities: string[];
  examplePrompts: string[];
}[] = [
  {
    id: "planner",
    name: "Planner Agent",
    description: "Organizes your study schedule and creates optimal time blocks",
    icon: Calendar,
    capabilities: ["Create study blocks", "Replan schedule", "Detect conflicts", "Optimize time"],
    examplePrompts: [
      "Plan study time for my CS101 exam",
      "I only have 60 minutes today, help me prioritize",
      "Reorganize my week based on new assignments",
    ],
  },
  {
    id: "course",
    name: "Course Agent",
    description: "Answers questions about course content and concepts",
    icon: BookOpen,
    capabilities: ["Explain concepts", "Answer questions", "Summarize materials", "Provide context"],
    examplePrompts: [
      "Explain Big-O notation from CS101",
      "What is the main theme of Chapter 5?",
      "Summarize the key points from the lecture notes",
    ],
  },
  {
    id: "assignment",
    name: "Assignment Agent",
    description: "Helps break down assignments and suggests approaches",
    icon: FileText,
    capabilities: ["Break down tasks", "Suggest approaches", "Create subtasks", "Track progress"],
    examplePrompts: [
      "Help me plan my essay on WWI causes",
      "Break down this problem set into steps",
      "What's the best approach for this assignment?",
    ],
  },
  {
    id: "exam",
    name: "Exam Agent",
    description: "Prepares you for exams with practice questions and study guides",
    icon: GraduationCap,
    capabilities: ["Generate practice questions", "Create study guides", "Identify weak areas", "Mock exams"],
    examplePrompts: [
      "Create a study guide for the midterm",
      "Generate practice questions on calculus",
      "What topics should I focus on for the exam?",
    ],
  },
  {
    id: "notes",
    name: "Notes Agent",
    description: "Enhances your notes with summaries and flashcards",
    icon: StickyNote,
    capabilities: ["Summarize notes", "Generate flashcards", "Create quizzes", "Organize content"],
    examplePrompts: [
      "Summarize my notes on Big-O notation",
      "Generate flashcards from this material",
      "Create a quiz from my notes",
    ],
  },
  {
    id: "research",
    name: "Research Agent",
    description: "Helps with academic writing and finding sources",
    icon: Search,
    capabilities: ["Find sources", "Organize research", "Citation help", "Structure papers"],
    examplePrompts: [
      "Find sources for my research paper",
      "Help me organize my literature review",
      "Format citations in APA style",
    ],
  },
  {
    id: "campus",
    name: "Campus Agent",
    description: "Provides location information and campus resources",
    icon: MapPin,
    capabilities: ["Find buildings", "Library hours", "Resource locations", "Campus services"],
    examplePrompts: [
      "Where is the library?",
      "What are the library hours today?",
      "Find study spaces near me",
    ],
  },
];

export function CourseAgents() {
  const { courseId } = useCourse();
  const messages = useStore((state) =>
    state.messages.filter((m) => m.userId === (state.getCurrentUser()?.id || "user-1"))
  );

  const courseMessages = messages.filter((m) => {
    // In demo mode, we'll show all messages, but ideally filter by course context
    return true;
  });

  const agentUsage = new Map<Agent, number>();
  courseMessages.forEach((m) => {
    agentUsage.set(m.agent, (agentUsage.get(m.agent) || 0) + 1);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">AI Agents</h2>
        </div>
        <p className="text-muted-foreground">
          Seven specialized AI agents work together to help you succeed. Each agent handles specific tasks and learns from your interactions.
        </p>
      </div>

      {/* Agent Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const usageCount = agentUsage.get(agent.id) || 0;
          return (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                  </div>
                  <AgentChip agent={agent.id} />
                </div>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-2">Capabilities:</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map((cap, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {cap}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">Try asking:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {agent.examplePrompts.slice(0, 2).map((prompt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="italic">"{prompt}"</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {usageCount > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Used <span className="font-semibold">{usageCount}</span> time{usageCount !== 1 ? "s" : ""} in this course
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* How It Works */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            How AI Agents Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold">Ask a Question</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-10">
                Type your question in the Tutor tab or anywhere you see the AI input
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-semibold">Agent Routes</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-10">
                Our system analyzes your question and routes it to the best agent for the task
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-semibold">Get Response</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-10">
                The agent searches your course materials and provides an answer with citations
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-muted/50">
            <p className="text-sm">
              <strong>Behind the scenes:</strong> Agents use RAG (Retrieval Augmented Generation) to find relevant information from your course materials, notes, and resources. They cite sources so you know where information comes from.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

