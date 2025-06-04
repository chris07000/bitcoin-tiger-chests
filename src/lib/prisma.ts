import { PrismaClient } from '@prisma/client'

// Global type declaratie voor prisma
declare global {
  var prisma: PrismaClient | undefined
}

// Runtime-safe Prisma client creation
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

// Dynamic initialization with retries for Vercel runtime
const initializePrisma = () => {
  if (global.prisma) {
    return global.prisma
  }
  
  try {
    const client = createPrismaClient()
    
    if (process.env.NODE_ENV !== 'production') {
      global.prisma = client
    }
    
    return client
  } catch (error) {
    console.error('Prisma initialization failed:', error)
    return null
  }
}

// Lazy getter function that ensures client is available when needed
const getPrismaClient = () => {
  if (!prismaInstance) {
    console.log('Initializing Prisma client on demand...')
    prismaInstance = initializePrisma()
  }
  return prismaInstance
}

// Initialize with retry capability
let prismaInstance = initializePrisma()

// Export as getter function for runtime safety
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getPrismaClient()
    if (!client) {
      throw new Error('Prisma client could not be initialized. Check your DATABASE_URL environment variable.')
    }
    return client[prop as keyof PrismaClient]
  }
}) 