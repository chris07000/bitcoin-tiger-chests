const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

try {
  console.log('Starting Prisma repair script...');
  
  // 1. Stop running processes
  console.log('Stopping any running Next.js processes...');
  try {
    execSync('taskkill /f /im node.exe', { stdio: 'inherit' });
  } catch (error) {
    // Ignore if no processes found
    console.log('No Node processes found or could not stop them.');
  }
  
  // 2. Clean the .next directory
  console.log('Cleaning .next directory...');
  const nextDir = path.join(__dirname, '.next');
  if (fs.existsSync(nextDir)) {
    execSync('powershell -Command "Remove-Item -Recurse -Force .next"', { stdio: 'inherit' });
  }
  
  // 3. Delete node_modules/.prisma
  console.log('Cleaning Prisma cache...');
  const prismaCacheDir = path.join(__dirname, 'node_modules', '.prisma');
  if (fs.existsSync(prismaCacheDir)) {
    execSync('powershell -Command "Remove-Item -Recurse -Force node_modules\\.prisma"', { stdio: 'inherit' });
  }
  
  // 4. Regenerate Prisma client
  console.log('Regenerating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('Repair completed successfully!');
  console.log('Now run: npm run dev');
} catch (error) {
  console.error('Error during repair:', error);
  process.exit(1);
} 