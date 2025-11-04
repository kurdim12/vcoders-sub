"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatRelative } from "@/lib/time";
import { generateId } from "@/lib/utils";
import { Plus, Search, FileText, Sparkles, Edit3, Trash2 } from "lucide-react";

export default function NotesPage() {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const notes = useStore((state) => state.notes);
  const courses = useStore((state) => state.courses);
  const addNote = useStore((state) => state.addNote);
  const updateNote = useStore((state) => state.updateNote);
  const deleteNote = useStore((state) => state.deleteNote);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentNote = selectedNote
    ? notes.find((n) => n.id === selectedNote)
    : null;

  const handleNewNote = () => {
    const newNote = {
      id: generateId(),
      userId: "user-1",
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

  const handleDelete = (noteId: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote(noteId);
      if (selectedNote === noteId) {
        setSelectedNote(null);
        setTitle("");
        setBody("");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Notes</h1>
            <p className="text-muted-foreground">
              Create and organize your study notes
            </p>
          </div>
          <Button onClick={handleNewNote}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        {/* Two-pane layout */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Notes List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredNotes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No notes found
                </p>
              ) : (
                filteredNotes.map((note) => {
                  const course = courses.find((c) => c.id === note.courseId);
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
                          <p className="font-medium text-sm truncate">
                            {note.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {note.body.substring(0, 100) || "Empty note"}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {course && (
                              <Badge variant="outline" className="text-xs">
                                {course.code}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatRelative(note.updatedAt)}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(note.id);
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
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                {currentNote ? "Edit Note" : "Select or create a note"}
              </CardTitle>
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
                    placeholder="Start writing your notes... (Markdown supported)"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="min-h-[400px] font-mono"
                  />

                  <div className="flex gap-2">
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="outline">
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Summarize
                    </Button>
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Flashcards
                    </Button>
                  </div>
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

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{notes.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">CS101 Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {notes.filter((n) => n.courseId === "course-1").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">MATH241 Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {notes.filter((n) => n.courseId === "course-2").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">HIST210 Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {notes.filter((n) => n.courseId === "course-3").length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

