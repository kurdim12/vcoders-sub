// Comprehensive Data Generator System
// Generates realistic academic data for Sarah Chen and Marcus Johnson

import type { StoreSnapshot } from "@/lib/types";
import { generateSarahData } from "./generators/sarah";
import { generateMarcusData } from "./generators/marcus";

export async function generateAllData() {
  console.log("🚀 Starting comprehensive data generation...");
  
  console.log("\n📚 Generating Sarah Chen's data (CS Major)...");
  const sarahData = await generateSarahData();
  
  console.log("\n📚 Generating Marcus Johnson's data (Business/Psych Major)...");
  const marcusData = await generateMarcusData();
  
  console.log("\n✅ Data generation complete!");
  console.log(`\nSarah Chen:`);
  console.log(`  - Courses: ${sarahData.courses.length}`);
  console.log(`  - Materials: ${sarahData.materials.length}`);
  console.log(`  - Flashcards: ${sarahData.flashcards.length}`);
  console.log(`  - Assignments: ${sarahData.assignments.length}`);
  console.log(`  - Conversations: ${sarahData.messages.length}`);
  
  console.log(`\nMarcus Johnson:`);
  console.log(`  - Courses: ${marcusData.courses.length}`);
  console.log(`  - Materials: ${marcusData.materials.length}`);
  console.log(`  - Flashcards: ${marcusData.flashcards.length}`);
  console.log(`  - Assignments: ${marcusData.assignments.length}`);
  console.log(`  - Conversations: ${marcusData.messages.length}`);
  
  return {
    sarah: sarahData,
    marcus: marcusData,
  };
}

// For CLI usage
if (require.main === module) {
  generateAllData()
    .then(() => {
      console.log("\n✨ All done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error:", error);
      process.exit(1);
    });
}

