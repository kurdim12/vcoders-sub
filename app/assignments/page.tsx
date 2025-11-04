"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { formatDate, formatRelative } from "@/lib/time";
import { GripVertical, Plus } from "lucide-react";
import type { AssignStatus } from "@/lib/types";

export default function AssignmentsPage() {
  const assignments = useStore((state) => state.assignments);
  const courses = useStore((state) => state.courses);
  const updateAssignment = useStore((state) => state.updateAssignment);

  const columns: { id: AssignStatus; title: string }[] = [
    { id: "planned", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "submitted", title: "Submitted" },
  ];

  const handleStatusChange = (assignmentId: string, newStatus: AssignStatus) => {
    updateAssignment(assignmentId, { status: newStatus });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Assignments</h1>
            <p className="text-muted-foreground">
              Track and manage your assignments
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Assignment (Demo)
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="grid gap-6 md:grid-cols-3">
          {columns.map((column) => {
            const columnAssignments = assignments.filter(
              (a) => a.status === column.id
            );

            return (
              <Card key={column.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{column.title}</span>
                    <Badge variant="secondary">{columnAssignments.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {columnAssignments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No assignments
                    </p>
                  ) : (
                    columnAssignments.map((assignment) => {
                      const course = courses.find(
                        (c) => c.id === assignment.courseId
                      );

                      return (
                        <Card
                          key={assignment.id}
                          className="cursor-move hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start gap-2">
                              <GripVertical className="w-4 h-4 text-muted-foreground mt-1" />
                              <div className="flex-1 space-y-2">
                                <div>
                                  <p className="font-medium text-sm">
                                    {assignment.title}
                                  </p>
                                  {course && (
                                    <Badge
                                      variant="outline"
                                      className="mt-1 text-xs"
                                    >
                                      {course.code}
                                    </Badge>
                                  )}
                                </div>

                                {assignment.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {assignment.description}
                                  </p>
                                )}

                                <div className="text-xs text-muted-foreground">
                                  Due {formatRelative(assignment.dueAt)}
                                </div>

                                {assignment.subtasks && assignment.subtasks.length > 0 && (
                                  <div className="text-xs text-muted-foreground">
                                    {assignment.subtasks.filter((t) => t.done).length}/{assignment.subtasks.length} subtasks complete
                                  </div>
                                )}

                                {/* Move buttons */}
                                <div className="flex gap-1 pt-2">
                                  {column.id !== "planned" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        const prevIndex = columns.findIndex(
                                          (c) => c.id === column.id
                                        );
                                        if (prevIndex > 0) {
                                          handleStatusChange(
                                            assignment.id,
                                            columns[prevIndex - 1].id
                                          );
                                        }
                                      }}
                                      className="text-xs h-7"
                                    >
                                      ← Move Left
                                    </Button>
                                  )}
                                  {column.id !== "submitted" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        const nextIndex = columns.findIndex(
                                          (c) => c.id === column.id
                                        );
                                        if (nextIndex < columns.length - 1) {
                                          handleStatusChange(
                                            assignment.id,
                                            columns[nextIndex + 1].id
                                          );
                                        }
                                      }}
                                      className="text-xs h-7"
                                    >
                                      Move Right →
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{assignments.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">To Do</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {assignments.filter((a) => a.status === "planned").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {assignments.filter((a) => a.status === "in_progress").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {assignments.filter((a) => a.status === "submitted").length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

