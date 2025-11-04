/**
 * SAMPLE IMAGE GENERATOR
 * Creates realistic homework/study images for multi-modal AI demo
 * 
 * Note: Requires 'canvas' package. Install with: npm install canvas
 */

import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'sample-images');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Try to import canvas, but provide fallback if not available
let Canvas: any;
try {
  Canvas = require('canvas');
} catch (error) {
  console.error('⚠️  Canvas package not found. Installing...');
  console.error('Run: npm install canvas');
  console.error('Or create images manually in:', OUTPUT_DIR);
  process.exit(1);
}

// IMAGE 1: Python Code with Syntax Error
function generateCodeError() {
  const { createCanvas } = Canvas;
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  // Background (code editor style)
  ctx.fillStyle = '#1e1e1e';
  ctx.fillRect(0, 0, 800, 600);
  
  // Code with error
  ctx.font = '16px "Courier New"';
  ctx.fillStyle = '#d4d4d4';
  
  const code = [
    'def fibonacci(n):',
    '    if n = 1:  # ERROR: should be ==',
    '        return 1',
    '    elif n = 0:  # ERROR: should be ==',
    '        return 0',
    '    else:',
    '        return fibonacci(n-1) + fibonacci(n-2)',
    '',
    'print(fibonacci(10))'
  ];
  
  let y = 50;
  code.forEach((line: string, i: number) => {
    // Highlight error lines
    if (line.includes('ERROR')) {
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(0, y - 20, 800, 30);
      ctx.fillStyle = '#ffffff';
    } else {
      ctx.fillStyle = '#d4d4d4';
    }
    
    ctx.fillText(line, 20, y);
    y += 30;
  });
  
  // Error message at bottom
  ctx.fillStyle = '#ff4444';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('SyntaxError: invalid syntax (line 2)', 20, 500);
  ctx.fillStyle = '#ffcccc';
  ctx.font = '12px Arial';
  ctx.fillText('Tip: Use == for comparison, not =', 20, 530);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'homework_error.png'), buffer);
  console.log('✅ Generated: homework_error.png');
}

// IMAGE 2: Math Problem (Calculus)
function generateMathProblem() {
  const { createCanvas } = Canvas;
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  // Background (notebook paper style)
  ctx.fillStyle = '#fffef0';
  ctx.fillRect(0, 0, 800, 600);
  
  // Blue lines (ruled paper)
  ctx.strokeStyle = '#cce5ff';
  ctx.lineWidth = 1;
  for (let y = 50; y < 600; y += 30) {
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(750, y);
    ctx.stroke();
  }
  
  // Red margin line
  ctx.strokeStyle = '#ffcccc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 0);
  ctx.lineTo(80, 600);
  ctx.stroke();
  
  // Handwritten-style text (simulated)
  ctx.font = '24px "Comic Sans MS"';
  ctx.fillStyle = '#0066cc';
  ctx.fillText('Problem 3:', 100, 80);
  
  ctx.font = '20px "Comic Sans MS"';
  ctx.fillStyle = '#000000';
  
  const problem = [
    'Find the derivative of:',
    '',
    'f(x) = x³ + 2x² - 5x + 3',
    '',
    'Show all steps!'
  ];
  
  let y = 130;
  problem.forEach((line: string) => {
    ctx.fillText(line, 100, y);
    y += 40;
  });
  
  // Underline the function
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 210);
  ctx.lineTo(400, 210);
  ctx.stroke();
  
  // Save
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'math_problem.jpg'), buffer);
  console.log('✅ Generated: math_problem.jpg');
}

// IMAGE 3: Algorithm Diagram (Binary Search Tree)
function generateAlgorithmDiagram() {
  const { createCanvas } = Canvas;
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 800, 600);
  
  // Title
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = '#000000';
  ctx.fillText('Binary Search Tree', 250, 40);
  
  // Draw tree nodes
  function drawNode(x: number, y: number, value: number, isHighlight = false) {
    // Circle
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fillStyle = isHighlight ? '#4CAF50' : '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Value
    ctx.fillStyle = isHighlight ? '#ffffff' : '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(value.toString(), x, y);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
  
  function drawEdge(x1: number, y1: number, x2: number, y2: number) {
    ctx.beginPath();
    ctx.moveTo(x1, y1 + 30);
    ctx.lineTo(x2, y2 - 30);
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // Tree structure: Root = 50
  const root = { x: 400, y: 120, val: 50 };
  const left = { x: 250, y: 220, val: 30 };
  const right = { x: 550, y: 220, val: 70 };
  const ll = { x: 150, y: 320, val: 20 };
  const lr = { x: 350, y: 320, val: 40 };
  const rl = { x: 450, y: 320, val: 60 };
  const rr = { x: 650, y: 320, val: 80 };
  
  // Draw edges first
  drawEdge(root.x, root.y, left.x, left.y);
  drawEdge(root.x, root.y, right.x, right.y);
  drawEdge(left.x, left.y, ll.x, ll.y);
  drawEdge(left.x, left.y, lr.x, lr.y);
  drawEdge(right.x, right.y, rl.x, rl.y);
  drawEdge(right.x, right.y, rr.x, rr.y);
  
  // Draw nodes
  drawNode(root.x, root.y, root.val, true); // Highlight root
  drawNode(left.x, left.y, left.val);
  drawNode(right.x, right.y, right.val);
  drawNode(ll.x, ll.y, ll.val);
  drawNode(lr.x, lr.y, lr.val);
  drawNode(rl.x, rl.y, rl.val);
  drawNode(rr.x, rr.y, rr.val);
  
  // Labels
  ctx.font = '14px Arial';
  ctx.fillStyle = '#666666';
  ctx.fillText('Root', root.x + 40, root.y);
  ctx.fillText('Left < Root', 50, 480);
  ctx.fillText('Right > Root', 600, 480);
  
  // Question at bottom
  ctx.font = 'italic 16px Arial';
  ctx.fillStyle = '#0066cc';
  ctx.fillText('Question: What is the height of this tree?', 50, 550);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'algorithm_diagram.png'), buffer);
  console.log('✅ Generated: algorithm_diagram.png');
}

// IMAGE 4: Lecture Notes (Handwritten style)
function generateLectureNotes() {
  const { createCanvas } = Canvas;
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  // Background (notebook)
  ctx.fillStyle = '#fffef0';
  ctx.fillRect(0, 0, 800, 600);
  
  // Spiral binding holes
  ctx.fillStyle = '#000000';
  for (let y = 30; y < 600; y += 60) {
    ctx.beginPath();
    ctx.arc(30, y, 8, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // Title
  ctx.font = 'bold 28px "Comic Sans MS"';
  ctx.fillStyle = '#cc0000';
  ctx.fillText('Recursion Notes', 80, 60);
  
  // Date
  ctx.font = '14px "Comic Sans MS"';
  ctx.fillStyle = '#666666';
  ctx.fillText('Nov 1, 2025', 650, 60);
  
  // Handwritten notes
  ctx.font = '18px "Comic Sans MS"';
  ctx.fillStyle = '#000000';
  
  const notes = [
    'Definition:',
    '• A function that calls itself',
    '• Must have BASE CASE (stops recursion)',
    '• Must have RECURSIVE CASE (calls itself)',
    '',
    'Example: Factorial',
    'def factorial(n):',
    '    if n <= 1:  ← Base case',
    '        return 1',
    '    return n * factorial(n-1)  ← Recursive',
    '',
    'Key Points:',
    '✓ Base case prevents infinite loop',
    '✓ Each call should move toward base case',
    '✓ Stack space is limited!'
  ];
  
  let y = 110;
  notes.forEach((line: string) => {
    if (line.includes('←')) {
      ctx.fillStyle = '#0066cc';
    } else if (line.startsWith('✓')) {
      ctx.fillStyle = '#00aa00';
    } else {
      ctx.fillStyle = '#000000';
    }
    
    ctx.fillText(line, 80, y);
    y += 30;
  });
  
  // Highlight box around key concept
  ctx.strokeStyle = '#ffcc00';
  ctx.lineWidth = 3;
  ctx.strokeRect(70, 340, 660, 120);
  
  // Save
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'lecture_notes.jpg'), buffer);
  console.log('✅ Generated: lecture_notes.jpg');
}

// Generate all images
console.log('🎨 Generating sample images for multi-modal AI demo...\n');
generateCodeError();
generateMathProblem();
generateAlgorithmDiagram();
generateLectureNotes();
console.log('\n✅ All sample images generated!');
console.log(`📁 Location: ${OUTPUT_DIR}`);

