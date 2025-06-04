import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const { walletAddress, betAmount, selectedSide } = await request.json()
    
    if (!walletAddress || !betAmount || !selectedSide) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if prisma is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    })

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      )
    }

    // Check if enough balance
    if (wallet.balance < betAmount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    // Generate result with house edge (house wins 55%)
    const roll = Math.random() * 100
    const houseWins = roll < 55 // House heeft 55% kans om te winnen
    
    // Als speler HEADS kiest:
    // - Bij houseWins = true -> result moet TAILS zijn (speler verliest)
    // - Bij houseWins = false -> result moet HEADS zijn (speler wint)
    // Als speler TAILS kiest gebeurt het omgekeerde
    const result = selectedSide === 'heads' 
      ? (houseWins ? 'tails' : 'heads')
      : (houseWins ? 'heads' : 'tails')
    
    const won = selectedSide === result
    
    // Calculate reward with 3% fee on wins
    const baseReward = won ? betAmount * 2 : 0
    const reward = won ? Math.floor(baseReward * 0.97) : 0

    // Start een database transactie voor alle updates
    const updatedWallet = await prisma.$transaction(async (tx) => {
      // Voeg de bet transactie toe
      await tx.transaction.create({
        data: {
          id: uuidv4(),
          type: 'COINFLIP',
          amount: -betAmount,
          paymentHash: `coinflip-bet-${Date.now()}`,
          walletId: wallet.id,
        },
      })

      // Als de speler wint, voeg de winst transactie toe
      if (won) {
        await tx.transaction.create({
          data: {
            id: uuidv4(),
            type: 'COINFLIP',
            amount: reward,
            paymentHash: `coinflip-win-${Date.now()}`,
            walletId: wallet.id,
          },
        })
      }

      // Update het saldo
      return await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            increment: won ? reward - betAmount : -betAmount
          },
          updatedAt: new Date()
        },
      })
    })

    return NextResponse.json({
      success: true,
      result,
      won,
      newBalance: updatedWallet.balance,
      message: won ? 'You won!' : 'You lost!'
    })
  } catch (error) {
    console.error('Error processing coinflip:', error)
    return NextResponse.json(
      { error: 'Failed to process bet' },
      { status: 500 }
    )
  }
} 