"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentChip } from "@/components/agent-chip";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatRelative } from "@/lib/time";
import type { Agent } from "@/lib/types";

const agentDescriptions: Record<Agent, { description: string; capabilities: string[] }> = {
  planner: {
    description: "Organizes your study schedule and manages time allocation",
    capabilities: ["Create study blocks", "Replan schedule", "Detect conflicts", "Optimize study time"],
  },
  course: {
    description: "Helps with course materials and subject-specific questions",
    capabilities: ["Explain concepts", "Answer questions", "Summarize materials", "Provide context"],
  },
  assignment: {
    description: "Guides you through assignments without solving them directly",
    capabilities: ["Break down tasks", "Suggest approaches", "Create subtasks", "Track progress"],
  },
  exam: {
    description: "Prepares you for exams with practice and study strategies",
    capabilities: ["Generate practice questions", "Create study guides", "Identify weak areas", "Mock exams"],
  },
  notes: {
    description: "Enhances your notes with summaries and study aids",
    capabilities: ["Summarize notes", "Generate flashcards", "Create quizzes", "Organize content"],
  },
  research: {
    description: "Assists with research projects and academic writing",
    capabilities: ["Find sources", "Organize research", "Citation help", "Structure papers"],
  },
  campus: {
    description: "Provides information about campus resources and locations",
    capabilities: ["Find buildings", "Library hours", "Resource locations", "Campus services"],
  },
};

export default function AgentsPage() {
  const messages = useStore((state) => state.messages);

  const agents: Agent[] = ["planner", "course", "assignment", "exam", "notes", "research", "campus"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Agent Lab</h1>
          <p className="text-muted-foreground">
            Explore the specialized AI agents powering UNI-Agent
          </p>
        </div>

        {/* Neural Graph Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Network</CardTitle>
            <CardDescription>
              Visualization of the UNI-Agent system architecture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 800 250">
                {/* Central node */}
                <circle cx="400" cy="125" r="30" fill="currentColor" className="text-primary" />
                <text x="400" y="130" textAnchor="middle" className="text-xs fill-white font-semibold">
                  UNI
                </text>

                {/* Agent nodes */}
                {agents.map((agent, idx) => {
                  const angle = (idx / agents.length) * 2 * Math.PI - Math.PI / 2;
                  const x = 400 + Math.cos(angle) * 150;
                  const y = 125 + Math.sin(angle) * 80;

                  return (
                    <g key={agent}>
                      {/* Connection line with animation */}
                      <line
                        x1="400"
                        y1="125"
                        x2={x}
                        y2={y}
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary/30"
                        strokeDasharray="5,5"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="0"
                          to="10"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </line>

                      {/* Agent node */}
                      <circle cx={x} cy={y} r="20" fill="currentColor" className="text-primary/80" />
                      <text
                        x={x}
                        y={y + 4}
                        textAnchor="middle"
                        className="text-xs fill-white font-semibold"
                      >
                        {agent.substring(0, 3).toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Agent Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => {
            const agentMessages = messages.filter((m) => m.agent === agent);
            const lastAction = agentMessages[agentMessages.length - 1];
            const config = agentDescriptions[agent];

            return (
              <Card key={agent} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <AgentChip agent={agent} />
                    <Badge variant="secondary">{agentMessages.length} actions</Badge>
                  </div>
                  <CardDescription className="mt-2">
                    {config.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Capabilities */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Capabilities:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {config.capabilities.map((cap, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Last Action */}
                  {lastAction && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        Last action:
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {lastAction.prompt}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatRelative(lastAction.createdAt)}
                      </p>
                    </div>
                  )}

                  {!lastAction && (
                    <p className="text-xs text-muted-foreground italic">
                      No activity yet
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Activity Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-2xl font-bold">{messages.length}</p>
                <p className="text-xs text-muted-foreground">Total requests</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {messages.filter((m) => m.citations.length > 0).length}
                </p>
                <p className="text-xs text-muted-foreground">With citations</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(messages.map((m) => m.agent)).size}
                </p>
                <p className="text-xs text-muted-foreground">Active agents</p>
              </div>
              <div>
                <p className="text-2xl font-bold">7</p>
                <p className="text-xs text-muted-foreground">Available agents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

