import { PrismaClient } from '@prisma/client'

// Global type declaratie voor prisma
declare global {
  var prisma: PrismaClient | undefined
}

// Edge-case safe Prisma client creation voor Vercel builds
const createPrismaClient = () => {
  try {
    // Check if we're in build time (Vercel build process)
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      console.warn('No DATABASE_URL in production build, returning mock client')
      return null
    }
    
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      datasources: process.env.DATABASE_URL ? {
        db: {
          url: process.env.DATABASE_URL,
        },
      } : undefined,
    })
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    return null
  }
}

// Initialize with error handling
let prismaInstance: PrismaClient | null = null

try {
  prismaInstance = global.prisma ?? createPrismaClient()
  
  if (process.env.NODE_ENV !== 'production' && prismaInstance) {
    global.prisma = prismaInstance
  }
} catch (error) {
  console.error('Prisma initialization error:', error)
  prismaInstance = null
}

// Export with fallback
export const prisma = prismaInstance 