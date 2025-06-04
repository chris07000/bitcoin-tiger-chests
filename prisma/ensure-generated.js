const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if we need to generate Prisma client
const prismaClientDir = path.join(__dirname, '../node_modules/.prisma');
const generatedClientDir = path.join(__dirname, '../src/generated/prisma-client');

// Check if the directories exist
const prismaClientExists = fs.existsSync(prismaClientDir);
const generatedClientExists = fs.existsSync(generatedClientDir);

// If either directory doesn't exist, generate the Prisma client
if (!prismaClientExists || !generatedClientExists) {
  console.log('Prisma client not found. Generating...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('Prisma client generated successfully!');
  } catch (error) {
    console.error('Failed to generate Prisma client:', error);
    process.exit(1);
  }
} else {
  console.log('Prisma client already generated. Skipping.');
}

// Database connection check is removed for production builds
// This will be handled by the application at runtime instead
console.log('Skipping database connection check during build process.'); 