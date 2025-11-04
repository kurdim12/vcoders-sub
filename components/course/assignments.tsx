"use client";

import { useState } from "react";
import { useCourse } from "@/components/course-context";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GripVertical, Plus } from "lucide-react";
import { formatRelative } from "@/lib/time";
import type { AssignStatus } from "@/lib/types";
import { QuickActionsDrawer } from "./quick-actions-drawer";

const columns: { id: AssignStatus; title: string }[] = [
  { id: "planned", title: "To Do" },
  { id: "in_progress", title: "Doing" },
  { id: "submitted", title: "Done" },
];

export function CourseAssignments() {
  const { courseId } = useCourse();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const assignments = useStore((state) =>
    state.assignments.filter((a) => a.courseId === courseId)
  );
  const updateAssignment = useStore((state) => state.updateAssignment);

  const handleStatusChange = (assignmentId: string, newStatus: AssignStatus) => {
    updateAssignment(assignmentId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Assignments</CardTitle>
            <Button onClick={() => setDrawerOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Assignment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {columns.map((column) => {
              const columnAssignments = assignments.filter((a) => a.status === column.id);
              return (
                <div key={column.id}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{column.title}</h3>
                    <Badge variant="secondary">{columnAssignments.length}</Badge>
                  </div>
                  <div className="space-y-3">
                    {columnAssignments.map((assignment) => (
                      <Card
                        key={assignment.id}
                        className="cursor-move hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-2">
                            <GripVertical className="w-4 h-4 text-muted-foreground mt-1" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{assignment.title}</p>
                              {assignment.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {assignment.description}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-2">
                                Due {formatRelative(assignment.dueAt)}
                              </p>
                              {assignment.subtasks && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {assignment.subtasks.filter((t) => t.done).length}/
                                  {assignment.subtasks.length} subtasks
                                </p>
                              )}
                              <div className="flex gap-1 mt-2">
                                {column.id !== "planned" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs h-7"
                                    onClick={() => {
                                      const prevIndex = columns.findIndex(
                                        (c) => c.id === column.id
                                      );
                                      if (prevIndex > 0) {
                                        handleStatusChange(assignment.id, columns[prevIndex - 1].id);
                                      }
                                    }}
                                  >
                                    ←
                                  </Button>
                                )}
                                {column.id !== "submitted" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs h-7"
                                    onClick={() => {
                                      const nextIndex = columns.findIndex(
                                        (c) => c.id === column.id
                                      );
                                      if (nextIndex < columns.length - 1) {
                                        handleStatusChange(assignment.id, columns[nextIndex + 1].id);
                                      }
                                    }}
                                  >
                                    →
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <QuickActionsDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}

