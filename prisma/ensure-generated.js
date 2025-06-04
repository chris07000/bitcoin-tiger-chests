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

// Check the database connection while we're at it
try {
  // Try to connect to the database
  execSync('npx prisma db pull --force', { stdio: 'inherit' });
  console.log('Database connection successful!');
} catch (error) {
  console.warn('Warning: Could not connect to database:', error.message);
  console.warn('The application may not function correctly without a database connection.');
  // Don't exit - let the app try to start anyway
} 