import { PrismaClient } from '@prisma/client'

// Global type declaratie voor prisma
declare global {
  var prisma: PrismaClient | undefined
}

// Controleer of we in een browser-omgeving zijn (waardoor Prisma niet werkt)
const isBrowser = typeof window !== 'undefined'

// Maak een nieuwe PrismaClient instantie
function initPrismaClient() {
  if (isBrowser) {
    console.warn('Attempting to initialize PrismaClient in browser environment. This will not work.')
    return null
  }
  
  try {
    console.log('Initializing PrismaClient...')
    return new PrismaClient()
  } catch (error) {
    console.error('Failed to initialize PrismaClient:', error)
    return null
  }
}

// In development bewaren we de instantie in de global scope om hot reloading te vermijden
// In production maken we altijd een nieuwe instantie
const prismaClient = global.prisma || initPrismaClient()

// Bewaar alleen in development mode en server-side
if (process.env.NODE_ENV !== 'production' && prismaClient && !isBrowser) {
  global.prisma = prismaClient
}

export const prisma = prismaClient

// Zorg ervoor dat we een verbinding hebben voor we queries uitvoeren
// Dit wordt alleen uitgevoerd in server-side context
if (prisma && !isBrowser) {
  prisma.$connect()
    .then(() => console.log('Database connection established'))
    .catch((error: Error) => console.error('Unable to connect to the database:', error))

  // Handle common Prisma errors
  prisma.$use(async (params: any, next: any) => {
    try {
      return await next(params)
    } catch (error: any) {
      console.error(`Prisma Error in ${params.model}.${params.action}:`, error)
      throw error
    }
  })
} else if (isBrowser) {
  console.warn('Prisma client is not available in browser environment. API calls should be used instead.')
} 