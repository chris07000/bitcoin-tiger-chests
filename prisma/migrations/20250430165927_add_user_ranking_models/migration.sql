-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'RAFFLE';

-- CreateTable
CREATE TABLE "UserRanking" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "totalWagered" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentRank" TEXT NOT NULL DEFAULT 'No Rank',
    "rankProgress" INTEGER NOT NULL DEFAULT 0,
    "dailyWager" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weeklyWager" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyWager" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRanking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameStats" (
    "id" TEXT NOT NULL,
    "userRankingId" TEXT NOT NULL,
    "chestsPlayed" INTEGER NOT NULL DEFAULT 0,
    "chestsWon" INTEGER NOT NULL DEFAULT 0,
    "chestsWagered" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "coinflipPlayed" INTEGER NOT NULL DEFAULT 0,
    "coinflipWon" INTEGER NOT NULL DEFAULT 0,
    "coinflipWagered" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rafflesEntered" INTEGER NOT NULL DEFAULT 0,
    "rafflesWon" INTEGER NOT NULL DEFAULT 0,
    "rafflesWagered" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRanking_walletId_key" ON "UserRanking"("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "GameStats_userRankingId_key" ON "GameStats"("userRankingId");

-- AddForeignKey
ALTER TABLE "UserRanking" ADD CONSTRAINT "UserRanking_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStats" ADD CONSTRAINT "GameStats_userRankingId_fkey" FOREIGN KEY ("userRankingId") REFERENCES "UserRanking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
