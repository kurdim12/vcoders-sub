// Spaced Repetition Algorithm (SM-2)
// Based on SuperMemo 2 algorithm

export interface Flashcard {
  id: string;
  courseId: string;
  front: string;
  back: string;
  easeFactor: number; // Default: 2.5
  interval: number; // Days until next review
  repetitions: number; // Number of successful reviews
  nextReview: string; // ISO date string
  lastReviewed?: string; // ISO date string
  difficulty: "easy" | "medium" | "hard";
}

export interface ReviewResult {
  quality: 0 | 1 | 2 | 3 | 4 | 5; // 0=fail, 5=perfect
  newInterval: number;
  newEaseFactor: number;
  nextReview: string;
}

/**
 * Calculate next review interval using SM-2 algorithm
 */
export function calculateNextReview(
  flashcard: Flashcard,
  quality: 0 | 1 | 2 | 3 | 4 | 5
): ReviewResult {
  let { easeFactor, interval, repetitions } = flashcard;

  // Quality should be 0-5 (0 = complete blackout, 5 = perfect response)
  if (quality < 0 || quality > 5) {
    quality = quality < 0 ? 0 : 5;
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Minimum ease factor
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  let newInterval: number;

  if (quality < 3) {
    // If quality < 3, start over
    repetitions = 0;
    newInterval = 0; // Review again today
  } else {
    // Successful review
    repetitions += 1;

    if (repetitions === 1) {
      newInterval = 1; // 1 day
    } else if (repetitions === 2) {
      newInterval = 6; // 6 days
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    quality,
    newInterval,
    newEaseFactor: easeFactor,
    nextReview: nextReviewDate.toISOString(),
  };
}

/**
 * Get flashcards due for review
 */
export function getDueCards(
  flashcards: Flashcard[],
  date: Date = new Date()
): Flashcard[] {
  return flashcards.filter((card) => {
    const nextReview = new Date(card.nextReview);
    return nextReview <= date;
  });
}

/**
 * Get new cards (never reviewed)
 */
export function getNewCards(flashcards: Flashcard[]): Flashcard[] {
  return flashcards.filter((card) => !card.lastReviewed);
}

/**
 * Get cards by difficulty
 */
export function getCardsByDifficulty(
  flashcards: Flashcard[],
  difficulty: "easy" | "medium" | "hard"
): Flashcard[] {
  return flashcards.filter((card) => card.difficulty === difficulty);
}

/**
 * Calculate mastery percentage
 */
export function calculateMastery(flashcards: Flashcard[]): number {
  if (flashcards.length === 0) return 0;

  const mastered = flashcards.filter((card) => {
    const nextReview = new Date(card.nextReview);
    const now = new Date();
    const daysUntilReview = Math.floor(
      (nextReview.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Consider mastered if interval > 30 days and easeFactor > 2.0
    return daysUntilReview > 30 && card.easeFactor > 2.0;
  }).length;

  return Math.round((mastered / flashcards.length) * 100);
}

/**
 * Generate initial flashcard from content
 */
export function createFlashcard(
  courseId: string,
  front: string,
  back: string,
  difficulty: "easy" | "medium" | "hard" = "medium"
): Flashcard {
  return {
    id: `flashcard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    courseId,
    front,
    back,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date().toISOString(), // Review immediately
    difficulty,
  };
}

/**
 * Get study statistics
 */
export function getStudyStats(flashcards: Flashcard[]) {
  const due = getDueCards(flashcards);
  const newCards = getNewCards(flashcards);
  const mastered = flashcards.filter(
    (card) => card.easeFactor > 2.5 && card.interval > 30
  ).length;

  return {
    total: flashcards.length,
    due: due.length,
    new: newCards.length,
    mastered,
    mastery: calculateMastery(flashcards),
    averageEaseFactor:
      flashcards.length > 0
        ? flashcards.reduce((sum, card) => sum + card.easeFactor, 0) /
          flashcards.length
        : 0,
  };
}

