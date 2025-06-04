-- AlterTable
ALTER TABLE "Jackpot" ADD COLUMN     "walletId" TEXT;

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "TigerChestClaim" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "tigerId" TEXT NOT NULL,
    "stakedId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "rewardType" TEXT NOT NULL DEFAULT 'LOW_ROLL',
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TigerChestClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TigerStaking" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "tigerId" TEXT NOT NULL,
    "stakedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextChestAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tigerLevel" INTEGER NOT NULL DEFAULT 1,
    "tigerName" TEXT,
    "tigerImage" TEXT,
    "isGuardian" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TigerStaking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChestProgress" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "bronzeOpened" INTEGER NOT NULL DEFAULT 0,
    "silverOpened" INTEGER NOT NULL DEFAULT 0,
    "goldOpened" INTEGER NOT NULL DEFAULT 0,
    "nextBronzeReward" INTEGER NOT NULL DEFAULT 50,
    "nextSilverReward" INTEGER NOT NULL DEFAULT 50,
    "nextGoldReward" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChestProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TigerChestClaim_tigerId_idx" ON "TigerChestClaim"("tigerId");

-- CreateIndex
CREATE INDEX "TigerChestClaim_walletId_idx" ON "TigerChestClaim"("walletId");

-- CreateIndex
CREATE INDEX "TigerStaking_isActive_idx" ON "TigerStaking"("isActive");

-- CreateIndex
CREATE INDEX "TigerStaking_walletId_idx" ON "TigerStaking"("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "TigerStaking_walletId_tigerId_key" ON "TigerStaking"("walletId", "tigerId");

-- CreateIndex
CREATE UNIQUE INDEX "ChestProgress_walletId_key" ON "ChestProgress"("walletId");

-- AddForeignKey
ALTER TABLE "Jackpot" ADD CONSTRAINT "Jackpot_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TigerChestClaim" ADD CONSTRAINT "TigerChestClaim_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TigerStaking" ADD CONSTRAINT "TigerStaking_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChestProgress" ADD CONSTRAINT "ChestProgress_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
