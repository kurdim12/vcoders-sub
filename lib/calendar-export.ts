// Calendar Export (iCal format)
// Generates .ics files for study blocks, assignments, and exams

export function generateICalendar(
  studyBlocks: any[],
  assignments: any[],
  exams: any[],
  courseName: string = "UNI-Agent"
): string {
  const lines: string[] = [];
  
  // iCal header
  lines.push("BEGIN:VCALENDAR");
  lines.push("VERSION:2.0");
  lines.push("PRODID:-//UNI-Agent//Academic Calendar//EN");
  lines.push("CALSCALE:GREGORIAN");
  lines.push("METHOD:PUBLISH");
  
  // Study Blocks
  studyBlocks.forEach((block) => {
    const start = formatICSDate(new Date(block.startAt));
    const end = formatICSDate(new Date(block.endAt));
    
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:study-${block.id}@uni-agent`);
    lines.push(`DTSTART:${start}`);
    lines.push(`DTEND:${end}`);
    lines.push(`SUMMARY:${escapeICS(block.title)}`);
    lines.push(`DESCRIPTION:Study Block - ${courseName}`);
    lines.push(`STATUS:CONFIRMED`);
    lines.push("END:VEVENT");
  });
  
  // Assignments (due dates)
  assignments.forEach((assignment) => {
    const due = formatICSDate(new Date(assignment.dueAt));
    
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:assignment-${assignment.id}@uni-agent`);
    lines.push(`DTSTART:${due}`);
    lines.push(`DTEND:${due}`);
    lines.push(`SUMMARY:${escapeICS(assignment.title)} - Due`);
    lines.push(`DESCRIPTION:Assignment due - ${courseName}\\nStatus: ${assignment.status}`);
    lines.push(`STATUS:CONFIRMED`);
    lines.push(`PRIORITY:${assignment.status === "overdue" ? "1" : "5"}`);
    lines.push("END:VEVENT");
  });
  
  // Exams
  exams.forEach((exam) => {
    const start = formatICSDate(new Date(exam.startAt));
    const end = formatICSDate(new Date(exam.endAt));
    
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:exam-${exam.id}@uni-agent`);
    lines.push(`DTSTART:${start}`);
    lines.push(`DTEND:${end}`);
    lines.push(`SUMMARY:${escapeICS(exam.title)} - ${exam.type.toUpperCase()}`);
    lines.push(`DESCRIPTION:Exam - ${courseName}`);
    lines.push(`STATUS:CONFIRMED`);
    lines.push(`PRIORITY:1`);
    lines.push("END:VEVENT");
  });
  
  // iCal footer
  lines.push("END:VCALENDAR");
  
  return lines.join("\r\n");
}

function formatICSDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Download calendar as .ics file
 */
export function downloadCalendar(
  studyBlocks: any[],
  assignments: any[],
  exams: any[],
  filename: string = "uni-agent-calendar.ics"
) {
  const ical = generateICalendar(studyBlocks, assignments, exams);
  const blob = new Blob([ical], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

