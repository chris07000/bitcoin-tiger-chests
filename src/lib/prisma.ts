import { PrismaClient } from '@prisma/client'

// Global type declaratie voor prisma
declare global {
  var prisma: PrismaClient | undefined
}

// Simple Prisma client creation
const createPrismaClient = () => {
  try {
    const client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder'
        }
      }
    })
    
    console.log('Prisma client created successfully')
    return client
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    throw error
  }
}

// Simple singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create or reuse the client
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// In development, store on global to avoid re-creating
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
} 