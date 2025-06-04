/**
 * DEPRECATED: This file is kept for backward compatibility.
 * Please use Prisma client instead of MongoDB/Mongoose.
 * 
 * Example:
 * import { prisma } from '@/lib/prisma';
 */

console.warn('mongodb.ts is deprecated. Please use Prisma client instead.');

// Stub function that does nothing but logs a warning
async function connectDB() {
  console.warn('connectDB() is deprecated. Please use Prisma client instead.');
  return null;
}

export default connectDB; 