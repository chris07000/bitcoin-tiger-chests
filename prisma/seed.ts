import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Seed raffles
  await seedRaffles()
  
  console.log('Database seeded successfully!')
}

async function seedRaffles() {
  // Clear existing raffles
  await prisma.raffleTicket.deleteMany({})
  await prisma.raffle.deleteMany({})
  
  // Create new raffles
  await prisma.raffle.create({
    data: {
      name: "Bitcoin Tiger #123",
      description: "Rare Bitcoin Tiger Ordinal with unique traits",
      image: "/tiger-logo.png",
      ticketPrice: 5000,
      totalTickets: 100,
      soldTickets: 38,
      endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      winner: null,
      updatedAt: new Date()
    }
  })
  
  await prisma.raffle.create({
    data: {
      name: "Gold Tiger Artifact",
      description: "Legendary Gold Tiger Artifact - only 10 in existence",
      image: "/tiger-logo.png",
      ticketPrice: 10000,
      totalTickets: 50,
      soldTickets: 12,
      endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      winner: null,
      updatedAt: new Date()
    }
  })
  
  await prisma.raffle.create({
    data: {
      name: "Bitcoin Tiger #456",
      description: "Unique Bitcoin Tiger Ordinal - Special Edition",
      image: "/tiger-logo.png",
      ticketPrice: 7500,
      totalTickets: 75,
      soldTickets: 25,
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      winner: null,
      updatedAt: new Date()
    }
  })
  
  console.log('Raffles seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 