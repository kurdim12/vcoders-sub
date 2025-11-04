/**
 * DEMO READINESS VALIDATION SCRIPT
 * 
 * Checks that all generated data is optimized for feature demos
 */

import type { Message, Flashcard, CourseAnalytics, Assignment } from "../lib/types";
import { generateSeedData } from "../lib/seed";
import { getCurrentAccountId } from "../lib/accounts";

interface ValidationResult {
  feature: string;
  status: 'READY' | 'NEEDS_WORK' | 'MISSING';
  issues: string[];
  suggestions: string[];
}

function isDueToday(dateString: string): boolean {
  const today = new Date();
  const date = new Date(dateString);
  return date.toDateString() === today.toDateString();
}

async function validateDemoData() {
  const results: ValidationResult[] = [];
  
  console.log('🔍 Starting demo readiness validation...\n');
  
  // Load data for both accounts
  const sarahData = await generateSeedData('sarah-chen');
  const marcusData = await generateSeedData('marcus-johnson');
  
  // FEATURE 1: STREAMING AI RESPONSES
  console.log('📡 Validating Streaming AI data...');
  const streamingCheck: ValidationResult = {
    feature: 'Streaming AI Responses',
    status: 'READY',
    issues: [],
    suggestions: []
  };
  
  const sarahConversations = sarahData.messages || [];
  const longResponses = sarahConversations.filter(m => 
    m.answer && m.answer.length > 500
  );
  
  if (longResponses.length < 3) {
    streamingCheck.status = 'NEEDS_WORK';
    streamingCheck.issues.push(`Only ${longResponses.length} long responses found. Need at least 3.`);
    streamingCheck.suggestions.push('Generate more detailed explanations (800-1500 chars)');
  }
  
  const citedResponses = sarahConversations.filter(m =>
    m.citations && m.citations.length > 0
  );
  
  if (citedResponses.length < 5) {
    streamingCheck.status = 'NEEDS_WORK';
    streamingCheck.issues.push(`Only ${citedResponses.length} responses with citations`);
    streamingCheck.suggestions.push('Add more material references in AI responses');
  }
  
  results.push(streamingCheck);
  
  // FEATURE 2: VOICE OUTPUT
  console.log('🎤 Validating Voice Output data...');
  const voiceCheck: ValidationResult = {
    feature: 'Voice Output (TTS)',
    status: 'READY',
    issues: [],
    suggestions: []
  };
  
  const speakableResponses = sarahConversations.filter(m =>
    m.answer &&
    m.answer.length > 200 &&
    m.answer.length < 1000 &&
    !m.answer.includes('```')
  );
  
  if (speakableResponses.length < 3) {
    voiceCheck.status = 'NEEDS_WORK';
    voiceCheck.issues.push('Need more speech-friendly responses');
    voiceCheck.suggestions.push('Add 3-5 clear concept explanations (200-800 chars, no code)');
  }
  
  results.push(voiceCheck);
  
  // FEATURE 3: AGENT WORKFLOW VISUALIZATION
  console.log('🤖 Validating Agent Routing data...');
  const agentCheck: ValidationResult = {
    feature: 'Agent Workflow Visualization',
    status: 'READY',
    issues: [],
    suggestions: []
  };
  
  const agentTypes: Array<Message['agent']> = ['planner', 'course', 'assignment', 'exam', 'notes', 'research', 'campus'];
  const allConversations = [...sarahData.messages || [], ...marcusData.messages || []];
  
  const agentCoverage = agentTypes.map(agent => ({
    agent,
    count: allConversations.filter(m => m.agent === agent).length
  }));
  
  const missingAgents = agentCoverage.filter(a => a.count === 0);
  if (missingAgents.length > 0) {
    agentCheck.status = 'NEEDS_WORK';
    agentCheck.issues.push(`Missing conversations for: ${missingAgents.map(a => a.agent).join(', ')}`);
    agentCheck.suggestions.push('Create at least 2 conversations per agent type');
  }
  
  const lowCoverageAgents = agentCoverage.filter(a => a.count < 2 && a.count > 0);
  if (lowCoverageAgents.length > 0) {
    agentCheck.status = 'NEEDS_WORK';
    agentCheck.issues.push(`Low coverage for: ${lowCoverageAgents.map(a => `${a.agent} (${a.count})`).join(', ')}`);
  }
  
  results.push(agentCheck);
  
  // FEATURE 4: SYLLABUS PARSER
  console.log('📄 Validating Syllabus Parser data...');
  const syllabusCheck: ValidationResult = {
    feature: 'Syllabus Parser',
    status: 'READY',
    issues: [],
    suggestions: []
  };
  
  // Check if syllabus files exist
  const fs = require('fs');
  const path = require('path');
  const syllabiDir = path.join(process.cwd(), 'public', 'sample-syllabi');
  
  let syllabiFiles: string[] = [];
  if (fs.existsSync(syllabiDir)) {
    syllabiFiles = fs.readdirSync(syllabiDir).filter((f: string) => f.endsWith('.pdf'));
  }
  
  if (syllabiFiles.length < 2) {
    syllabusCheck.status = 'MISSING';
    syllabusCheck.issues.push(`Found ${syllabiFiles.length} syllabus files. Need at least 2.`);
    syllabusCheck.suggestions.push('Run: npm run generate:syllabi');
  } else {
    // Check file sizes (should be substantial)
    syllabiFiles.forEach((file: string) => {
      const filePath = path.join(syllabiDir, file);
      const stats = fs.statSync(filePath);
      if (stats.size < 10000) { // Less than 10KB
        syllabusCheck.status = 'NEEDS_WORK';
        syllabusCheck.issues.push(`${file}: File too small (${stats.size} bytes)`);
      }
    });
  }
  
  results.push(syllabusCheck);
  
  // FEATURE 5: MULTI-MODAL AI
  console.log('📸 Validating Multi-Modal data...');
  const multimodalCheck: ValidationResult = {
    feature: 'Multi-Modal AI (Image Upload)',
    status: 'READY',
    issues: [],
    suggestions: []
  };
  
  const imagesDir = path.join(process.cwd(), 'public', 'sample-images');
  let imageFiles: string[] = [];
  if (fs.existsSync(imagesDir)) {
    imageFiles = fs.readdirSync(imagesDir);
  }
  
  const requiredImages = [
    'homework_error.png',
    'math_problem.jpg',
    'algorithm_diagram.png',
    'lecture_notes.jpg'
  ];
  
  const missingImages = requiredImages.filter(img =>
    !imageFiles.includes(img)
  );
  
  if (missingImages.length > 0) {
    multimodalCheck.status = 'MISSING';
    multimodalCheck.issues.push(`Missing images: ${missingImages.join(', ')}`);
    multimodalCheck.suggestions.push('Run: npm run generate:images');
  }
  
  // Check for image conversations
  const imageConversations = allConversations.filter(m =>
    (m as any).hasImage || (m as any).imageType
  );
  
  if (imageConversations.length < 2) {
    multimodalCheck.status = 'NEEDS_WORK';
    multimodalCheck.issues.push('Need conversations showing image-based help');
    multimodalCheck.suggestions.push('Add 2-3 conversations with image uploads');
  }
  
  results.push(multimodalCheck);
  
  // FLASHCARDS
  console.log('🎴 Validating Flashcards data...');
  const flashcardsCheck: ValidationResult = {
    feature: 'Spaced Repetition Flashcards',
    status: 'READY',
    issues: [],
    suggestions: []
  };
  
  const flashcards = sarahData.flashcards || [];
  
  const dueToday = flashcards.filter(card =>
    card.nextReview && isDueToday(card.nextReview)
  );
  
  if (dueToday.length < 15) {
    flashcardsCheck.status = 'NEEDS_WORK';
    flashcardsCheck.issues.push(`Only ${dueToday.length} cards due today. Need 15-20 for demo.`);
    flashcardsCheck.suggestions.push('Adjust nextReview dates to have more cards due today');
  }
  
  const cardsWithHistory = flashcards.filter(card =>
    card.repetitions && card.repetitions >= 3
  );
  
  if (cardsWithHistory.length < 30) {
    flashcardsCheck.status = 'NEEDS_WORK';
    flashcardsCheck.issues.push(`Only ${cardsWithHistory.length} cards with review history. Need 30+.`);
    flashcardsCheck.suggestions.push('Add review history to more cards (showing improvement)');
  }
  
  results.push(flashcardsCheck);
  
  // ANALYTICS
  console.log('📊 Validating Analytics data...');
  const analyticsCheck: ValidationResult = {
    feature: 'Analytics Dashboard',
    status: 'READY',
    issues: [],
    suggestions: []
  };
  
  const analytics = sarahData.courseAnalytics || [];
  
  if (analytics.length < 30) {
    analyticsCheck.status = 'NEEDS_WORK';
    analyticsCheck.issues.push(`Only ${analytics.length} days of analytics data. Need 30.`);
    analyticsCheck.suggestions.push('Generate full 30-day history');
  }
  
  // Check for improvement trend
  const assignments = sarahData.assignments || [];
  const completedAssignments = assignments.filter(a => a.status === 'completed' && a.grade);
  if (completedAssignments.length >= 3) {
    const grades = completedAssignments
      .sort((a, b) => new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime())
      .map(a => a.grade || 0);
    
    const isImproving = grades.length >= 3 && grades[grades.length - 1] > grades[0];
    
    if (!isImproving) {
      analyticsCheck.status = 'NEEDS_WORK';
      analyticsCheck.issues.push('Grades not showing clear improvement trend');
      analyticsCheck.suggestions.push('Ensure grades increase over time (78% → 85% → 92%)');
    }
  }
  
  // Check XP/streak (if available)
  const xpEvents = sarahData.xpEvents || [];
  const totalXP = xpEvents.reduce((sum, event) => sum + (event.xp || 0), 0);
  
  if (totalXP < 2000) {
    analyticsCheck.status = 'NEEDS_WORK';
    analyticsCheck.issues.push(`Total XP: ${totalXP}. Need 2000+ for impact.`);
    analyticsCheck.suggestions.push('Increase XP events to show impressive gamification');
  }
  
  results.push(analyticsCheck);
  
  // MATERIALS CHECK
  console.log('📚 Validating Materials data...');
  const materialsCheck: ValidationResult = {
    feature: 'Course Materials',
    status: 'READY',
    issues: [],
    suggestions: []
  };
  
  const materials = sarahData.materials || [];
  
  if (materials.length < 4) {
    materialsCheck.status = 'NEEDS_WORK';
    materialsCheck.issues.push(`Only ${materials.length} materials. Need 4+ for good citations.`);
    materialsCheck.suggestions.push('Generate more course materials with rich content');
  }
  
  const materialsWithContent = materials.filter(m =>
    m.textPreview && m.textPreview.length > 500
  );
  
  if (materialsWithContent.length < 3) {
    materialsCheck.status = 'NEEDS_WORK';
    materialsCheck.issues.push('Need materials with substantial text previews (500+ chars)');
    materialsCheck.suggestions.push('Add longer textPreview to materials for better AI citations');
  }
  
  results.push(materialsCheck);
  
  // GENERATE REPORT
  console.log('\n' + '='.repeat(80));
  console.log('DEMO READINESS REPORT');
  console.log('='.repeat(80) + '\n');
  
  const ready = results.filter(r => r.status === 'READY').length;
  const needsWork = results.filter(r => r.status === 'NEEDS_WORK').length;
  const missing = results.filter(r => r.status === 'MISSING').length;
  
  console.log(`✅ READY: ${ready}`);
  console.log(`⚠️  NEEDS WORK: ${needsWork}`);
  console.log(`❌ MISSING: ${missing}\n`);
  
  results.forEach(result => {
    const icon = result.status === 'READY' ? '✅' : result.status === 'NEEDS_WORK' ? '⚠️' : '❌';
    console.log(`${icon} ${result.feature}: ${result.status}`);
    
    if (result.issues.length > 0) {
      console.log('   Issues:');
      result.issues.forEach(issue => console.log(`   - ${issue}`));
    }
    
    if (result.suggestions.length > 0) {
      console.log('   Suggestions:');
      result.suggestions.forEach(suggestion => console.log(`   💡 ${suggestion}`));
    }
    
    console.log();
  });
  
  console.log('='.repeat(80));
  const overallStatus = missing > 0 ? 'NOT READY' : needsWork > 0 ? 'NEEDS IMPROVEMENT' : 'DEMO READY';
  console.log(`OVERALL STATUS: ${overallStatus}`);
  console.log('='.repeat(80));
  
  return results;
}

// Run validation
if (require.main === module) {
  validateDemoData().catch(console.error);
}

export { validateDemoData };

