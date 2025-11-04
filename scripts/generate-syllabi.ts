/**
 * SYLLABUS PDF GENERATOR
 * Creates realistic, parse-ready syllabi for demo
 * 
 * Note: Requires 'pdf-lib' package. Install with: npm install pdf-lib
 */

import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'sample-syllabi');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Try to import pdf-lib
let PDFDocument: any;
try {
  PDFDocument = require('pdf-lib').PDFDocument;
} catch (error) {
  console.error('⚠️  pdf-lib package not found. Installing...');
  console.error('Run: npm install pdf-lib');
  process.exit(1);
}

const { rgb, StandardFonts } = require('pdf-lib');

// SYLLABUS 1: CS305 Database Systems (for Sarah)
async function generateCS305Syllabus() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { width, height } = page.getSize();
  let y = height - 50;
  
  // Header
  page.drawText('CS305: DATABASE SYSTEMS', {
    x: 50,
    y,
    size: 20,
    font: boldFont,
    color: rgb(0, 0, 0)
  });
  
  y -= 30;
  page.drawText('Fall 2025 | Prof. Anderson | 4 Credits', {
    x: 50,
    y,
    size: 12,
    font
  });
  
  y -= 40;
  
  // Course Info
  page.drawText('COURSE INFORMATION', {
    x: 50,
    y,
    size: 14,
    font: boldFont
  });
  
  y -= 25;
  const courseInfo = [
    'Meeting Times: Monday/Wednesday 2:00-3:30 PM',
    'Location: Engineering Building, Room 302',
    'Office Hours: Wednesday 4:00-6:00 PM or by appointment',
    'Email: anderson@university.edu'
  ];
  
  courseInfo.forEach(line => {
    page.drawText(line, { x: 60, y, size: 10, font });
    y -= 18;
  });
  
  y -= 20;
  
  // Grading Breakdown
  page.drawText('GRADING BREAKDOWN', {
    x: 50,
    y,
    size: 14,
    font: boldFont
  });
  
  y -= 25;
  const grading = [
    'Assignments (6): 40%',
    'Midterm Exam: 20%',
    'Final Project: 25%',
    'Class Participation: 15%'
  ];
  
  grading.forEach(line => {
    page.drawText(line, { x: 60, y, size: 10, font });
    y -= 18;
  });
  
  y -= 20;
  
  // Assignments
  page.drawText('ASSIGNMENTS', {
    x: 50,
    y,
    size: 14,
    font: boldFont
  });
  
  y -= 25;
  const assignments = [
    '1. SQL Basics - Due October 15, 2025 (50 points)',
    '   Introduction to SQL queries, SELECT, WHERE, JOIN',
    '',
    '2. Database Design - Due October 29, 2025 (75 points)',
    '   ER diagrams, schema design, create tables',
    '',
    '3. Normalization - Due November 12, 2025 (75 points)',
    '   1NF, 2NF, 3NF, BCNF exercises',
    '',
    '4. Query Optimization - Due November 26, 2025 (100 points)',
    '   Indexes, query plans, performance tuning',
    '',
    '5. Transactions & Concurrency - Due December 3, 2025 (75 points)',
    '   ACID properties, isolation levels, deadlocks',
    '',
    '6. NoSQL Databases - Due December 10, 2025 (75 points)',
    '   MongoDB, document stores, comparison with SQL'
  ];
  
  let currentPage = page;
  assignments.forEach((line, idx) => {
    if (y < 100 && idx < assignments.length - 1) {
      // Add new page if needed
      currentPage = pdfDoc.addPage([612, 792]);
      y = height - 50;
    }
    
    const isTitle = line.match(/^\d\./);
    currentPage.drawText(line, {
      x: isTitle ? 60 : 70,
      y,
      size: 10,
      font: isTitle ? boldFont : font
    });
    y -= line ? 15 : 8;
  });
  
  // Exams on new page
  if (y < 150) {
    currentPage = pdfDoc.addPage([612, 792]);
    y = height - 50;
  } else {
    y -= 20;
  }
  
  // Exams
  currentPage.drawText('EXAMINATIONS', {
    x: 50,
    y,
    size: 14,
    font: boldFont
  });
  
  y -= 25;
  const exams = [
    'Midterm Exam: November 6, 2025 (100 points)',
    '  Coverage: SQL, database design, normalization',
    '  Format: Written exam + practical SQL queries',
    '',
    'Final Project: Due December 15, 2025 (125 points)',
    '  Design and implement a complete database system',
    '  Must include: ER diagram, schema, sample queries, documentation'
  ];
  
  exams.forEach(line => {
    currentPage.drawText(line, {
      x: line.startsWith(' ') ? 70 : 60,
      y,
      size: 10,
      font: line.includes(':') ? boldFont : font
    });
    y -= line ? 15 : 8;
  });
  
  // Save PDF
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'CS305_Database_Systems_Syllabus.pdf'),
    pdfBytes
  );
  console.log('✅ Generated: CS305_Database_Systems_Syllabus.pdf');
}

// SYLLABUS 2: BUS301 Marketing Fundamentals (for Marcus)
async function generateBUS301Syllabus() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { width, height } = page.getSize();
  let y = height - 50;
  
  // Header
  page.drawText('BUS301: MARKETING FUNDAMENTALS', {
    x: 50,
    y,
    size: 20,
    font: boldFont
  });
  
  y -= 30;
  page.drawText('Fall 2025 | Prof. Thompson | 3 Credits', {
    x: 50,
    y,
    size: 12,
    font
  });
  
  y -= 40;
  
  // Course Info
  page.drawText('COURSE INFORMATION', {
    x: 50,
    y,
    size: 14,
    font: boldFont
  });
  
  y -= 25;
  const courseInfo = [
    'Meeting Times: Tuesday/Thursday 10:00-11:30 AM',
    'Location: Business Hall, Room 205',
    'Office Hours: Thursday 2:00-4:00 PM',
    'Email: thompson@university.edu'
  ];
  
  courseInfo.forEach(line => {
    page.drawText(line, { x: 60, y, size: 10, font });
    y -= 18;
  });
  
  y -= 20;
  
  // Grading
  page.drawText('GRADING BREAKDOWN', {
    x: 50,
    y,
    size: 14,
    font: boldFont
  });
  
  y -= 25;
  const grading = [
    'Marketing Plan Project: 30%',
    'Case Study Analyses (3): 30%',
    'Midterm Exam: 20%',
    'Final Presentation: 15%',
    'Participation & Discussions: 5%'
  ];
  
  grading.forEach(line => {
    page.drawText(line, { x: 60, y, size: 10, font });
    y -= 18;
  });
  
  y -= 20;
  
  // Assignments
  page.drawText('MAJOR ASSIGNMENTS', {
    x: 50,
    y,
    size: 14,
    font: boldFont
  });
  
  y -= 25;
  const assignments = [
    '1. Consumer Behavior Analysis - Due October 20, 2025',
    '   Analyze target market demographics and psychographics',
    '',
    '2. Brand Strategy Case Study - Due November 3, 2025',
    '   Evaluate real company\'s branding decisions',
    '',
    '3. Digital Marketing Plan - Due November 17, 2025',
    '   Create social media and content marketing strategy',
    '',
    '4. Pricing Strategy Analysis - Due December 1, 2025',
    '   Competitive pricing analysis and recommendations',
    '',
    '5. Final Marketing Plan - Due December 15, 2025',
    '   Comprehensive marketing plan for new product launch'
  ];
  
  let currentPage = page;
  assignments.forEach((line, idx) => {
    if (y < 100 && idx < assignments.length - 1) {
      currentPage = pdfDoc.addPage([612, 792]);
      y = height - 50;
    }
    
    const isTitle = line.match(/^\d\./);
    currentPage.drawText(line, {
      x: isTitle ? 60 : 70,
      y,
      size: 10,
      font: isTitle ? boldFont : font
    });
    y -= line ? 15 : 8;
  });
  
  // Exams
  if (y < 150) {
    currentPage = pdfDoc.addPage([612, 792]);
    y = height - 50;
  } else {
    y -= 20;
  }
  
  currentPage.drawText('EXAMINATIONS', {
    x: 50,
    y,
    size: 14,
    font: boldFont
  });
  
  y -= 25;
  const exams = [
    'Midterm Exam: November 10, 2025',
    '  Multiple choice and short answer',
    '  Covers: Marketing mix, consumer behavior, segmentation',
    '',
    'Final Presentation: December 15, 2025',
    '  Team presentation of marketing plan',
    '  15 minutes + Q&A'
  ];
  
  exams.forEach(line => {
    currentPage.drawText(line, {
      x: line.startsWith(' ') ? 70 : 60,
      y,
      size: 10,
      font: line.includes(':') ? boldFont : font
    });
    y -= line ? 15 : 8;
  });
  
  // Save
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'BUS301_Marketing_Fundamentals_Syllabus.pdf'),
    pdfBytes
  );
  console.log('✅ Generated: BUS301_Marketing_Fundamentals_Syllabus.pdf');
}

// Generate both syllabi
console.log('📄 Generating syllabus PDFs...\n');
Promise.all([
  generateCS305Syllabus(),
  generateBUS301Syllabus()
]).then(() => {
  console.log('\n✅ All syllabi generated!');
  console.log(`📁 Location: ${OUTPUT_DIR}`);
}).catch((error) => {
  console.error('Error generating syllabi:', error);
  process.exit(1);
});

