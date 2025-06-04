import { PrismaClient } from '@prisma/client'

// Global type declaratie voor prisma
declare global {
  var prisma: PrismaClient | undefined
}

// Singleton pattern voor Prisma Client - specifiek voor Vercel
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

// In development gebruik global scope om hot reloading te vermijden
// In production maak altijd nieuwe instantie
const prisma = global.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export { prisma } 