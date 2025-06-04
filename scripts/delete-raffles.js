// Import de PrismaClient uit de gegenereerde client directory
const { PrismaClient } = require('../prisma/generated-client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Eerst alle raffle tickets verwijderen
    const deletedTickets = await prisma.raffleTicket.deleteMany({});
    console.log(`Deleted ${deletedTickets.count} raffle tickets from the database`);

    // Dan alle raffles verwijderen
    const deletedRaffles = await prisma.raffle.deleteMany({});
    console.log(`Deleted ${deletedRaffles.count} raffles from the database`);

    console.log('Database cleanup completed successfully');
  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 