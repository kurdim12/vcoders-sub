"use client";

import { useState, useEffect } from "react";
import { useCourse } from "@/components/course-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, AlertTriangle, Lightbulb, Bell, CheckCircle2 } from "lucide-react";
import { detectAutoActions, executeAutoAction, type AutoAction } from "@/lib/automation/auto-actions";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AutoActionsPanel() {
  const { courseId } = useCourse();
  const [actions, setActions] = useState<AutoAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const user = useStore((state) => state.getCurrentUser());

  useEffect(() => {
    if (courseId && user) {
      loadActions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user]);

  const loadActions = async () => {
    if (!courseId || !user) return;
    try {
      const detected = await detectAutoActions(user.id, courseId);
      setActions(detected);
    } catch (error) {
      console.error("Failed to load auto actions:", error);
    }
  };

  const handleAction = async (action: AutoAction) => {
    if (!courseId || !user) return;
    setLoading(true);
    try {
      await executeAutoAction(action, user.id, courseId);
      // Remove action after execution
      setActions(prev => prev.filter(a => a.id !== action.id));
    } catch (error) {
      console.error("Failed to execute action:", error);
    } finally {
      setLoading(false);
    }
  };

  const dismissAction = (actionId: string) => {
    setActions(prev => prev.filter(a => a.id !== actionId));
  };

  if (actions.length === 0) return null;

  const getIcon = (type: AutoAction["type"]) => {
    switch (type) {
      case "warning":
        return AlertTriangle;
      case "opportunity":
        return Lightbulb;
      case "suggestion":
        return Sparkles;
      case "reminder":
        return Bell;
      default:
        return CheckCircle2;
    }
  };

  const getColor = (priority: AutoAction["priority"]) => {
    switch (priority) {
      case "urgent":
        return "border-red-500/50 bg-red-50 dark:bg-red-950/20";
      case "high":
        return "border-orange-500/50 bg-orange-50 dark:bg-orange-950/20";
      case "medium":
        return "border-blue-500/50 bg-blue-50 dark:bg-blue-950/20";
      case "low":
        return "border-gray-500/50 bg-gray-50 dark:bg-gray-950/20";
    }
  };

  return (
    <div className="space-y-3">
      {actions.slice(0, 5).map((action) => {
        const Icon = getIcon(action.type);
        return (
          <Card
            key={action.id}
            className={cn(
              "border-2 transition-all hover:shadow-md",
              getColor(action.priority)
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className={cn(
                    "w-5 h-5",
                    action.priority === "urgent" ? "text-red-600" :
                    action.priority === "high" ? "text-orange-600" :
                    action.priority === "medium" ? "text-blue-600" :
                    "text-gray-600"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{action.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {action.agent}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(action.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAction(action.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() => handleAction(action)}
                      disabled={loading}
                      className="text-xs h-8"
                    >
                      {action.action.type === "analyze" ? "Analyze" : "Take Action"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

