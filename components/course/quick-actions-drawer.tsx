"use client";

import { useState } from "react";
import { useCourse } from "@/components/course-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Calendar,
  StickyNote,
  GraduationCap,
  Plus,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { generateId } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export function QuickActionsDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { courseId } = useCourse();
  const { toast } = useToast();
  const addMaterial = useStore((state) => state.addMaterial);
  const addAssignment = useStore((state) => state.addAssignment);
  const addStudyBlock = useStore((state) => state.addStudyBlock);
  const addNote = useStore((state) => state.addNote);
  const addExam = useStore((state) => state.addExam);

  const [action, setAction] = useState<"material" | "assignment" | "block" | "note" | "exam" | null>(
    null
  );

  // Material form state
  const [matTitle, setMatTitle] = useState("");
  const [matUrl, setMatUrl] = useState("");

  // Assignment form state
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDue, setAssignDue] = useState("");

  // Block form state
  const [blockTitle, setBlockTitle] = useState("");
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");

  // Note form state
  const [noteTitle, setNoteTitle] = useState("");

  // Exam form state
  const [examTitle, setExamTitle] = useState("");
  const [examStart, setExamStart] = useState("");
  const [examEnd, setExamEnd] = useState("");
  const [examType, setExamType] = useState<"quiz" | "midterm" | "final">("quiz");

  const handleClose = () => {
    resetForms();
    setAction(null);
    onOpenChange(false);
  };

  const resetForms = () => {
    setMatTitle("");
    setMatUrl("");
    setAssignTitle("");
    setAssignDue("");
    setBlockTitle("");
    setBlockStart("");
    setBlockEnd("");
    setNoteTitle("");
    setExamTitle("");
    setExamStart("");
    setExamEnd("");
    setExamType("quiz");
  };

  const handleAddMaterial = () => {
    if (matTitle && matUrl && courseId) {
      addMaterial({
        id: generateId(),
        courseId,
        title: matTitle,
        type: "url",
        source: matUrl,
      });
      resetForms();
      onOpenChange(false);
      setAction(null);
      // Show success feedback
      toast({
        title: "Success",
        description: "Material added successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    }
  };

  const handleAddAssignment = () => {
    if (assignTitle && assignDue && courseId) {
      addAssignment({
        id: generateId(),
        courseId,
        title: assignTitle,
        dueAt: new Date(assignDue).toISOString(),
        status: "planned",
      });
      resetForms();
      onOpenChange(false);
      setAction(null);
      // Show success feedback
      toast({
        title: "Success",
        description: "Assignment added successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    }
  };

  const handleAddBlock = () => {
    if (blockTitle && blockStart && blockEnd && courseId) {
      addStudyBlock({
        id: generateId(),
        userId: useStore.getState().getCurrentUser()?.id || "user-1",
        courseId,
        title: blockTitle,
        startAt: new Date(blockStart).toISOString(),
        endAt: new Date(blockEnd).toISOString(),
        status: "planned",
      });
      resetForms();
      onOpenChange(false);
      setAction(null);
      // Show success feedback
      toast({
        title: "Success",
        description: "Study block added successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    }
  };

  const handleAddNote = () => {
    if (noteTitle && courseId) {
      addNote({
        id: generateId(),
        userId: useStore.getState().getCurrentUser()?.id || "user-1",
        courseId,
        title: noteTitle,
        body: "",
        updatedAt: new Date().toISOString(),
      });
      resetForms();
      onOpenChange(false);
      setAction(null);
      // Show success feedback
      toast({
        title: "Success",
        description: "Note added successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    }
  };

  const handleAddExam = () => {
    if (examTitle && examStart && examEnd && examType && courseId) {
      addExam({
        id: generateId(),
        courseId,
        title: examTitle,
        startAt: new Date(examStart).toISOString(),
        endAt: new Date(examEnd).toISOString(),
        type: examType,
      });
      resetForms();
      onOpenChange(false);
      setAction(null);
      // Show success feedback
      toast({
        title: "Success",
        description: "Exam added successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Add</DialogTitle>
          <DialogDescription>Create a new item for this course</DialogDescription>
        </DialogHeader>

        {!action ? (
          <div className="grid gap-2">
            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => setAction("material")}
            >
              <FileText className="mr-2 h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Add Material</p>
                <p className="text-xs text-muted-foreground">PDF, link, or video</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => setAction("assignment")}
            >
              <FileText className="mr-2 h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Add Assignment</p>
                <p className="text-xs text-muted-foreground">Task with due date</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => setAction("block")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Schedule Study Block</p>
                <p className="text-xs text-muted-foreground">Time slot for studying</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => setAction("note")}
            >
              <StickyNote className="mr-2 h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">New Note</p>
                <p className="text-xs text-muted-foreground">Markdown note</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => setAction("exam")}
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Add Exam</p>
                <p className="text-xs text-muted-foreground">Test or quiz</p>
              </div>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold capitalize">{action}</h3>
              <Button variant="ghost" size="sm" onClick={() => setAction(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {action === "material" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={matTitle}
                    onChange={(e) => setMatTitle(e.target.value)}
                    placeholder="Material title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    value={matUrl}
                    onChange={(e) => setMatUrl(e.target.value)}
                    type="url"
                    placeholder="https://..."
                  />
                </div>
                <Button
                  onClick={handleAddMaterial}
                  className="w-full"
                  disabled={!matTitle || !matUrl}
                >
                  Add Material
                </Button>
              </div>
            )}

            {action === "assignment" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={assignTitle}
                    onChange={(e) => setAssignTitle(e.target.value)}
                    placeholder="Assignment title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    value={assignDue}
                    onChange={(e) => setAssignDue(e.target.value)}
                    type="datetime-local"
                  />
                </div>
                <Button
                  onClick={handleAddAssignment}
                  className="w-full"
                  disabled={!assignTitle || !assignDue}
                >
                  Add Assignment
                </Button>
              </div>
            )}

            {action === "block" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={blockTitle}
                    onChange={(e) => setBlockTitle(e.target.value)}
                    placeholder="Study block title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Start</Label>
                    <Input
                      value={blockStart}
                      onChange={(e) => setBlockStart(e.target.value)}
                      type="datetime-local"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End</Label>
                    <Input
                      value={blockEnd}
                      onChange={(e) => setBlockEnd(e.target.value)}
                      type="datetime-local"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddBlock}
                  className="w-full"
                  disabled={!blockTitle || !blockStart || !blockEnd}
                >
                  Schedule Block
                </Button>
              </div>
            )}

            {action === "note" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Note title"
                  />
                </div>
                <Button onClick={handleAddNote} className="w-full" disabled={!noteTitle}>
                  Create Note
                </Button>
              </div>
            )}

            {action === "exam" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    placeholder="Exam title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Start</Label>
                    <Input
                      value={examStart}
                      onChange={(e) => setExamStart(e.target.value)}
                      type="datetime-local"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End</Label>
                    <Input
                      value={examEnd}
                      onChange={(e) => setExamEnd(e.target.value)}
                      type="datetime-local"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as "quiz" | "midterm" | "final")}
                    className="w-full h-10 rounded-lg border px-3"
                  >
                    <option value="quiz">Quiz</option>
                    <option value="midterm">Midterm</option>
                    <option value="final">Final</option>
                  </select>
                </div>
                <Button
                  onClick={handleAddExam}
                  className="w-full"
                  disabled={!examTitle || !examStart || !examEnd}
                >
                  Add Exam
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

