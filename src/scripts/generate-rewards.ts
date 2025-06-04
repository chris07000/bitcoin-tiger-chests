import dotenv from 'dotenv';
import { generateMonthlyRakeback, generateWeeklyLossCompensation } from '../lib/ranking';

// Load environment variables
dotenv.config();

/**
 * Script to generate rewards via CRON job
 * Can be run with arguments:
 * - 'weekly' for weekly loss compensation
 * - 'monthly' for monthly rakeback and bonuses
 * - Or both to generate all
 */
async function generateRewards() {
  const args = process.argv.slice(2);
  const generateTypes = args.length > 0 ? args : ['weekly', 'monthly'];
  
  console.log(`Starting reward generation for: ${generateTypes.join(', ')}`);
  
  for (const type of generateTypes) {
    if (type === 'weekly') {
      console.log('Generating weekly loss compensation...');
      const result = await generateWeeklyLossCompensation();
      console.log('Weekly rewards result:', result);
    } else if (type === 'monthly') {
      console.log('Generating monthly rakeback and bonuses...');
      const result = await generateMonthlyRakeback();
      console.log('Monthly rewards result:', result);
    } else {
      console.warn(`Unknown reward type: ${type}, skipping`);
    }
  }
  
  console.log('Reward generation completed');
  process.exit(0);
}

// Run the script
generateRewards().catch(error => {
  console.error('Error generating rewards:', error);
  process.exit(1);
}); 