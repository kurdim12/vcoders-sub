"use client";

import { useState, useEffect } from "react";
import { useCourse } from "@/components/course-context";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  createFlashcard, 
  calculateNextReview, 
  getDueCards, 
  getStudyStats,
  type Flashcard,
} from "@/lib/spaced-repetition";
import { Plus, Sparkles, FileText } from "lucide-react";

export function CourseFlashcards() {
  const { courseId } = useCourse();
  const user = useStore((state) => state.getCurrentUser());
  const flashcards = useStore((state) => 
    state.flashcards?.filter((f) => f.courseId === courseId) || []
  );
  const notes = useStore((state) => 
    state.notes.filter((n) => n.courseId === courseId)
  );
  const addFlashcard = useStore((state) => state.addFlashcard);
  
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewedToday, setReviewedToday] = useState<Set<string>>(new Set());
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  
  // Create form state
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [selectedNote, setSelectedNote] = useState<string>("");

  // Get due cards for review
  const dueCards = getDueCards(flashcards);
  const stats = getStudyStats(flashcards);

  useEffect(() => {
    if (dueCards.length > 0 && !currentCard) {
      // Prioritize new cards or cards due today
      const newCard = dueCards.find(c => !c.lastReviewed) || dueCards[0];
      setCurrentCard(newCard);
    }
  }, [dueCards, currentCard]);

  const handleReview = async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!currentCard || !user || !courseId) return;

    const result = calculateNextReview(currentCard, quality);
    
    // Update flashcard in store
    const store = useStore.getState();
    const updatedCard: Flashcard = {
      ...currentCard,
      easeFactor: result.newEaseFactor,
      interval: result.newInterval,
      repetitions: result.newInterval === 0 ? 0 : currentCard.repetitions + 1,
      nextReview: result.nextReview,
      lastReviewed: new Date().toISOString(),
    };

    store.updateFlashcard(currentCard.id, updatedCard);
    
    // Award XP based on quality
    if (quality >= 3) {
      await import("@/lib/hooks/xp").then(({ awardXP }) => 
        awardXP(user.id, courseId, "tutor_session", Math.max(5, quality * 2))
      );
    }

    const newReviewed = new Set(reviewedToday);
    newReviewed.add(currentCard.id);
    setReviewedToday(newReviewed);
    setShowAnswer(false);

    // Move to next card
    const remaining = dueCards.filter(c => c.id !== currentCard.id && !reviewedToday.has(c.id));
    if (remaining.length > 0) {
      setCurrentCard(remaining[0]);
    } else {
      setCurrentCard(null);
    }
  };

  const handleNext = () => {
    const remaining = dueCards.filter(c => c.id !== currentCard?.id && !reviewedToday.has(c.id));
    if (remaining.length > 0) {
      setCurrentCard(remaining[0]);
      setShowAnswer(false);
    }
  };

  const handleCreateFlashcard = () => {
    if (!front.trim() || !back.trim() || !courseId) return;

    const newCard = createFlashcard(courseId, front.trim(), back.trim(), difficulty);
    addFlashcard(newCard);
    
    setFront("");
    setBack("");
    setDifficulty("medium");
    setCreateDialogOpen(false);
    
    // Set as current card if no card is showing
    if (!currentCard) {
      setCurrentCard(newCard);
    }
  };

  const handleGenerateFromNote = () => {
    if (!selectedNote || !courseId) return;

    const note = notes.find((n) => n.id === selectedNote);
    if (!note) return;

    // Simple extraction: split by lines and create Q&A pairs
    const lines = note.body.split(/\n+/).filter(line => line.trim().length > 10);
    const generated: Flashcard[] = [];

    lines.slice(0, 10).forEach((line) => {
      // Try to extract concept and definition
      const parts = line.split(/[:—\-]/);
      if (parts.length >= 2) {
        const front = parts[0]?.trim().replace(/^#+\s*/, "") || "";
        const back = parts.slice(1).join(" ").trim() || "";
        
        if (front.length > 3 && back.length > 5) {
          generated.push(createFlashcard(
            courseId,
            front.length > 50 ? front.substring(0, 50) + "?" : front,
            back.length > 200 ? back.substring(0, 200) : back,
            "medium"
          ));
        }
      }
    });

    // Add generated flashcards
    generated.forEach(card => addFlashcard(card));
    setGenerateDialogOpen(false);
    setSelectedNote("");

    // Set first card as current if available
    if (generated.length > 0 && !currentCard) {
      setCurrentCard(generated[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Flashcards</CardTitle>
            <div className="flex gap-2">
              <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate from Notes
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate Flashcards from Notes</DialogTitle>
                    <DialogDescription>
                      Select a note to automatically generate flashcards
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Select Note</Label>
                      <Select value={selectedNote} onValueChange={setSelectedNote}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a note..." />
                        </SelectTrigger>
                        <SelectContent>
                          {notes.map((note) => (
                            <SelectItem key={note.id} value={note.id}>
                              {note.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleGenerateFromNote} disabled={!selectedNote} className="w-full">
                      Generate Flashcards
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Flashcard
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Flashcard</DialogTitle>
                    <DialogDescription>
                      Add a new flashcard to study
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="front">Question</Label>
                      <Input
                        id="front"
                        placeholder="What is..."
                        value={front}
                        onChange={(e) => setFront(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="back">Answer</Label>
                      <Textarea
                        id="back"
                        placeholder="Answer..."
                        value={back}
                        onChange={(e) => setBack(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select value={difficulty} onValueChange={(v: "easy" | "medium" | "hard") => setDifficulty(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleCreateFlashcard} disabled={!front.trim() || !back.trim()} className="w-full">
                      Create Flashcard
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.due}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Mastery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mastery}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Mastered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mastered}</div>
          </CardContent>
        </Card>
      </div>

      {/* Flashcard */}
      {currentCard ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
              {/* Flashcard Display */}
              <div
                className="w-full max-w-2xl"
                onClick={() => {
                  if (!showAnswer) {
                    setShowAnswer(true);
                  }
                }}
              >
                <div className="bg-card border-2 border-border rounded-xl p-8 shadow-lg min-h-[280px] flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="text-center w-full">
                    {!showAnswer ? (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-4">Question</p>
                        <p className="text-2xl font-semibold leading-relaxed">{currentCard.front}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-4">Answer</p>
                        <p className="text-xl leading-relaxed">{currentCard.back}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {!showAnswer ? (
                <Button
                  onClick={() => {
                    setShowAnswer(true);
                  }}
                  size="lg"
                  className="w-full max-w-md"
                >
                  Show Answer
                </Button>
              ) : (
                <div className="w-full max-w-2xl space-y-4">
                  <p className="text-sm text-muted-foreground text-center font-medium">
                    How well did you know this?
                  </p>
                  <div className="grid grid-cols-6 gap-2">
                    {[0, 1, 2, 3, 4, 5].map((quality) => (
                      <Button
                        key={quality}
                        variant={quality >= 3 ? "default" : "outline"}
                        onClick={() => handleReview(quality as 0 | 1 | 2 | 3 | 4 | 5)}
                        className="h-12 text-sm font-medium"
                        size="sm"
                      >
                        {quality}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={handleNext}
                    className="w-full"
                  >
                    Skip Card
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : flashcards.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No flashcards yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create flashcards manually or generate them from your notes
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Flashcard
                </Button>
                {notes.length > 0 && (
                  <Button variant="outline" onClick={() => setGenerateDialogOpen(true)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate from Notes
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">All caught up!</p>
              <p className="text-sm text-muted-foreground">
                No flashcards due for review. Great job! 🎉
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
