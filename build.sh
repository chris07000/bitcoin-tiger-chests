#!/bin/bash

echo "Starting Vercel build with Prisma generation..."

# Clean up old builds
rm -rf .next

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Verify Prisma client exists
if [ ! -d "node_modules/@prisma/client" ]; then
  echo "ERROR: Prisma client not found after generation!"
  exit 1
fi

echo "Prisma client generated successfully"

# Run the Next.js build
echo "Building Next.js application..."
npm run build

echo "Build completed successfully" 