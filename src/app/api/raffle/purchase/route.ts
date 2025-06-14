import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Controleer of prisma beschikbaar is
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }
    
    const data = await request.json()
    const { walletAddress, raffleId, ticketAmount } = data
    
    if (!walletAddress || !raffleId || !ticketAmount || ticketAmount < 1) {
      return NextResponse.json(
        { error: 'Invalid request data', status: 400 }
      )
    }
    
    // Zoek naar de raffle
    const raffle = await prisma.raffle.findUnique({
      where: { id: parseInt(raffleId.toString()) }
    })
    
    if (!raffle) {
      return NextResponse.json(
        { error: 'Raffle not found' },
        { status: 404 }
      )
    }
    
    // Controleer of de raffle nog actief is
    if (raffle.winner || new Date(raffle.endsAt) < new Date()) {
      return NextResponse.json(
        { error: 'Raffle has ended or has already been completed' },
        { status: 400 }
      )
    }
    
    // Controleer of er nog tickets beschikbaar zijn
    const availableTickets = raffle.totalTickets - raffle.soldTickets
    if (availableTickets < ticketAmount) {
      return NextResponse.json(
        { error: `Only ${availableTickets} tickets available` },
        { status: 400 }
      )
    }
    
    // Zoek eerst de wallet op basis van het adres
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    })
    
    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      )
    }
    
    // Bereken de totale kosten (sats of points)
    const totalCost = raffle.ticketPrice * ticketAmount
    // Ensure pointCost handles null values properly for TypeScript
    const pointCost = raffle.isFree ? (raffle.pointCost || 100) * ticketAmount : 0

    // Controleer of de gebruiker voldoende balans/points heeft
    if (raffle.isFree) {
      // Voor free raffles: controleer points
      const userPoints = await prisma.userPoints.findUnique({
        where: { walletId: wallet.id }
      })
      
      if (!userPoints || userPoints.totalPoints < pointCost) {
        return NextResponse.json(
          { error: 'Insufficient Tiger Points' },
          { status: 400 }
        )
      }
    } else {
      // Voor betaalde raffles: controleer sats balance
      if (wallet.balance < totalCost) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        )
      }
    }
    
    // Begin een database transactie
    try {
      // Bereken points te verdienen: 1 point per 100 sats (alleen voor betaalde raffles)
      const pointsToAward = raffle.isFree ? 0 : Math.floor(totalCost / 100)
      
      // Gebruik een transactie om ervoor te zorgen dat alle updates slagen of allemaal falen
      await prisma.$transaction(async (tx) => {
        
        if (raffle.isFree) {
          // FREE RAFFLE: Trek points af
          const existingPoints = await tx.userPoints.findUnique({
            where: { walletId: wallet.id }
          })
          
          if (!existingPoints) {
            throw new Error('User points record not found')
          }
          
          // Update points (subtract)
          await tx.userPoints.update({
            where: { walletId: wallet.id },
            data: { 
              totalPoints: existingPoints.totalPoints - pointCost,
              updatedAt: new Date()
            }
          })
          
          // Record the points transaction (negative)
          await tx.pointTransaction.create({
            data: {
              walletId: wallet.id,
              points: -pointCost,
              reason: 'free_raffle_entry',
              raffleId: parseInt(raffleId.toString())
            }
          })
          
        } else {
          // PAID RAFFLE: Trek sats af en ken points toe
          
          // 1. Update de balans van de gebruiker
          await tx.wallet.update({
            where: { id: wallet.id },
            data: { 
              balance: wallet.balance - totalCost,
              updatedAt: new Date()
            }
          })
          
          // 2. Registreer de transactie
          await tx.transaction.create({
            data: {
              id: `raffle_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              amount: -totalCost, // Negatief bedrag omdat dit een uitgave is
              walletId: wallet.id,
              type: 'RAFFLE',
              status: 'COMPLETED',
              createdAt: new Date()
            }
          })
          
          // 3. Award Tiger Points (1 point per 100 sats)
          if (pointsToAward > 0) {
            // Get or create UserPoints record
            const existingPoints = await tx.userPoints.findUnique({
              where: { walletId: wallet.id }
            })
            
            if (existingPoints) {
              // Update existing points
              await tx.userPoints.update({
                where: { walletId: wallet.id },
                data: { 
                  totalPoints: existingPoints.totalPoints + pointsToAward,
                  updatedAt: new Date()
                }
              })
            } else {
              // Create new points record
              await tx.userPoints.create({
                data: {
                  walletId: wallet.id,
                  totalPoints: pointsToAward
                }
              })
            }
            
            // Record the points transaction
            await tx.pointTransaction.create({
              data: {
                walletId: wallet.id,
                points: pointsToAward,
                reason: 'raffle_entry',
                raffleId: parseInt(raffleId.toString())
              }
            })
          }
        }
        
        // 4. Update bestaande tickets of maak nieuwe aan (voor beide types raffles)
        const existingTicket = await tx.raffleTicket.findFirst({
          where: {
            raffleId: parseInt(raffleId.toString()),
            walletId: wallet.id
          }
        })
        
        if (existingTicket) {
          // Update bestaande tickets
          await tx.raffleTicket.update({
            where: { id: existingTicket.id },
            data: { 
              quantity: existingTicket.quantity + ticketAmount,
            }
          })
        } else {
          // Maak nieuwe ticket aan
          await tx.raffleTicket.create({
            data: {
              raffleId: parseInt(raffleId.toString()),
              walletId: wallet.id,
              quantity: ticketAmount,
              purchaseDate: new Date()
            }
          })
        }
        
        // 5. Update de raffle met het nieuwe aantal verkochte tickets
        await tx.raffle.update({
          where: { id: parseInt(raffleId.toString()) },
          data: { 
            soldTickets: raffle.soldTickets + ticketAmount,
            updatedAt: new Date()
          }
        })
      })
      
      // Haal de bijgewerkte balans op om terug te sturen
      const updatedWallet = await prisma.wallet.findUnique({
        where: { id: wallet.id },
        select: { balance: true }
      })

      // Haal de bijgewerkte points op
      const updatedPoints = await prisma.userPoints.findUnique({
        where: { walletId: wallet.id },
        select: { totalPoints: true }
      })
      
      return NextResponse.json({
        success: true,
        message: `Successfully purchased ${ticketAmount} ticket(s) for raffle ${raffle.name}`,
        newBalance: updatedWallet?.balance || wallet.balance,
        pointsEarned: pointsToAward,
        pointsSpent: raffle.isFree ? pointCost : 0,
        newPointsBalance: updatedPoints?.totalPoints || 0
      })
    } catch (dbError) {
      console.error('Database error purchasing tickets:', dbError)
      return NextResponse.json(
        { error: 'Failed to update tickets in database', details: String(dbError) },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in ticket purchase:', error)
    return NextResponse.json(
      { error: 'Failed to process ticket purchase', details: String(error) },
      { status: 500 }
    )
  }
} 