import { PrismaClient } from '@prisma/client'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Global type declaratie voor prisma
declare global {
  var prisma: PrismaClient | undefined
}

// Vercel-safe Prisma client creation with auto-generation
const createPrismaClient = async (retryGeneration = false) => {
  try {
    // If we're on Vercel and retryGeneration is true, try to regenerate
    if (retryGeneration && process.env.VERCEL) {
      console.log('Attempting to regenerate Prisma client on Vercel...')
      try {
        await execAsync('npx prisma generate')
        console.log('Prisma client regenerated successfully')
      } catch (genError) {
        console.error('Failed to regenerate Prisma client:', genError)
      }
    }
    
    const client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder'
        }
      }
    })
    
    // Test the connection
    await client.$connect()
    console.log('Prisma client created and connected successfully')
    return client
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    
    // If this is the first attempt and we're on Vercel, try regenerating
    if (!retryGeneration && process.env.VERCEL) {
      console.log('First attempt failed on Vercel, trying with regeneration...')
      return await createPrismaClient(true)
    }
    
    throw error
  }
}

// Initialize with retry capability for Vercel
const initializePrisma = async () => {
  if (global.prisma) {
    return global.prisma
  }
  
  try {
    const client = await createPrismaClient()
    
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
const getPrismaClient = async () => {
  if (!prismaInstance) {
    console.log('Initializing Prisma client on demand...')
    prismaInstance = await initializePrisma()
  }
  return prismaInstance
}

// Initialize with async capability
let prismaInstance: PrismaClient | null = null

// Initialize immediately but don't block
initializePrisma().then(client => {
  prismaInstance = client
}).catch(error => {
  console.error('Initial Prisma setup failed:', error)
})

// Export as async getter for safety
export const getPrisma = async (): Promise<PrismaClient> => {
  const client = await getPrismaClient()
  if (!client) {
    throw new Error('Prisma client could not be initialized. Check your DATABASE_URL environment variable.')
  }
  return client
}

// Synchronous export for backward compatibility (with automatic retry)
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    // For async operations, return a promise that resolves to the method
    if (typeof prop === 'string' && ['$connect', '$disconnect', '$transaction', '$queryRaw', '$executeRaw'].includes(prop)) {
      return async (...args: any[]) => {
        const client = await getPrismaClient()
        if (!client) {
          throw new Error('Prisma client could not be initialized. Check your DATABASE_URL environment variable.')
        }
        return (client as any)[prop](...args)
      }
    }
    
    // For model operations, also return async functions
    return new Proxy(() => {}, {
      get(_, modelProp) {
        return async (...args: any[]) => {
          const client = await getPrismaClient()
          if (!client) {
            throw new Error('Prisma client could not be initialized. Check your DATABASE_URL environment variable.')
          }
          return (client as any)[prop][modelProp](...args)
        }
      },
      apply: async (_, __, args) => {
        const client = await getPrismaClient()
        if (!client) {
          throw new Error('Prisma client could not be initialized. Check your DATABASE_URL environment variable.')
        }
        return (client as any)[prop](...args)
      }
    })
  }
}) 