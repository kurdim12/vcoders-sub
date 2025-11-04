"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkflowStep } from "@/lib/orchestrator/types";
import { Clock, CheckCircle, XCircle, Loader2, ArrowRight, Wrench, Brain, Users } from "lucide-react";
import { useState } from "react";

interface WorkflowVisualizationProps {
  workflow: any;
  agentCalls?: Array<{ from: string; to: string; purpose: string; result: string }>;
  toolsUsed?: Array<{ agent: string; tool: string; result: any }>;
}

export function WorkflowVisualization({ workflow, agentCalls = [], toolsUsed = [] }: WorkflowVisualizationProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  if (!workflow || !workflow.steps) return null;

  const steps = workflow.steps.filter((s: WorkflowStep) => s.agent !== "orchestrator");

  return (
    <Card className="mt-4 border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {workflow.status === "completed" ? (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          ) : (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          )}
          Agent Workflow
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {workflow.status === "completed" ? "Completed" : "Executing..."} • {steps.length} agent step{steps.length !== 1 ? "s" : ""}
          {workflow.completedAt && workflow.startedAt && (
            <span> • {Math.round((workflow.completedAt - workflow.startedAt) / 1000)}s total</span>
          )}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Workflow Steps */}
        <div className="space-y-3">
          {steps.map((step: WorkflowStep, index: number) => (
            <div key={step.id} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-14 w-0.5 h-8 bg-border" />
              )}

              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  step.status === "completed" ? "bg-green-100 dark:bg-green-900" :
                  step.status === "running" ? "bg-blue-100 dark:bg-blue-900" :
                  step.status === "error" ? "bg-red-100 dark:bg-red-900" :
                  "bg-muted"
                }`}>
                  {step.status === "completed" ? (
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  ) : step.status === "running" ? (
                    <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
                  ) : step.status === "error" ? (
                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  ) : (
                    <Clock className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-sm">
                      {step.agent}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {step.action}
                    </span>
                    {step.completedAt && step.startedAt && (
                      <span className="text-xs text-muted-foreground">
                        ({Math.round((step.completedAt - step.startedAt) / 1000)}s)
                      </span>
                    )}
                  </div>

                  {/* Reasoning - Enhanced */}
                  {step.reasoning && (
                    <div 
                      className="text-sm text-muted-foreground bg-muted/50 p-3 rounded cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                    >
                      <div className="flex items-start gap-2">
                        <Brain className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold mb-1">Reasoning:</p>
                          <p className={expandedStep === step.id ? "" : "line-clamp-2"}>
                            {step.reasoning}
                          </p>
                          {step.reasoning.length > 100 && (
                            <button className="text-xs text-primary mt-1">
                              {expandedStep === step.id ? "Show less" : "Show more"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tool Calls - Enhanced */}
                  {step.toolCalls && step.toolCalls.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <Wrench className="w-3 h-3" />
                        <span>Tools Used ({step.toolCalls.length})</span>
                      </div>
                      {step.toolCalls.map((toolCall, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs bg-muted/30 p-2 rounded">
                          <Wrench className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary" />
                          <div className="flex-1">
                            <span className="font-mono font-semibold">{toolCall.tool}</span>
                            {toolCall.tool === "call_agent" && (
                              <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                                <ArrowRight className="w-3 h-3" />
                                <span>Delegating to {toolCall.arguments.agent} agent</span>
                              </div>
                            )}
                            <div className="text-muted-foreground/70 mt-1">
                              {toolCall.arguments.query || toolCall.arguments.task || JSON.stringify(toolCall.arguments).substring(0, 50)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Agent Collaboration - Enhanced */}
        {agentCalls.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold">Agent Collaboration</h4>
            </div>
            <div className="space-y-2">
              {agentCalls.map((call, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-3 rounded-lg border border-primary/10">
                  <Badge variant="secondary" className="font-mono">{call.from}</Badge>
                  <ArrowRight className="w-4 h-4 text-primary" />
                  <Badge variant="secondary" className="font-mono">{call.to}</Badge>
                  <div className="flex-1 ml-2">
                    <p className="text-xs text-muted-foreground">{call.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tools Used Summary - Enhanced */}
        {toolsUsed.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold">All Tools Used</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {toolsUsed.map((tool, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  <Wrench className="w-3 h-3 mr-1" />
                  {tool.agent}:{tool.tool}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
