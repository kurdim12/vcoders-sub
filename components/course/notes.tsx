"use client";

import { useState } from "react";
import { useCourse } from "@/components/course-context";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, FileText, Trash2 } from "lucide-react";
import { formatRelative } from "@/lib/time";
import { generateId } from "@/lib/utils";

export function CourseNotes() {
  const { courseId } = useCourse();
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const notes = useStore((state) =>
    state.notes.filter((n) => n.courseId === courseId)
  );
  const addNote = useStore((state) => state.addNote);
  const updateNote = useStore((state) => state.updateNote);
  const deleteNote = useStore((state) => state.deleteNote);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentNote = selectedNote ? notes.find((n) => n.id === selectedNote) : null;

  const handleNewNote = () => {
    const newNote = {
      id: generateId(),
      userId: "user-1",
      courseId: courseId!,
      title: "Untitled Note",
      body: "",
      updatedAt: new Date().toISOString(),
    };
    addNote(newNote);
    setSelectedNote(newNote.id);
    setTitle(newNote.title);
    setBody(newNote.body);
  };

  const handleSave = () => {
    if (selectedNote) {
      updateNote(selectedNote, {
        title,
        body,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleSelectNote = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      setSelectedNote(noteId);
      setTitle(note.title);
      setBody(note.body);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Notes List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-base">Notes</CardTitle>
            <Button size="sm" onClick={handleNewNote}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No notes found</p>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = selectedNote === note.id;
              return (
                <div
                  key={note.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-accent/50 hover:bg-accent"
                  }`}
                  onClick={() => handleSelectNote(note.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{note.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {note.body.substring(0, 100) || "Empty note"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatRelative(note.updatedAt)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this note?")) {
                          deleteNote(note.id);
                          if (selectedNote === note.id) {
                            setSelectedNote(null);
                            setTitle("");
                            setBody("");
                          }
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Editor */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{currentNote ? "Edit Note" : "Select or create a note"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentNote ? (
            <>
              <Input
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-semibold"
              />
              <Textarea
                placeholder="Start writing... (Markdown supported)"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[400px] font-mono"
              />
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No note selected</p>
              <p className="text-sm text-muted-foreground mb-4">
                Select a note from the list or create a new one
              </p>
              <Button onClick={handleNewNote}>
                <Plus className="mr-2 h-4 w-4" />
                Create Note
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

