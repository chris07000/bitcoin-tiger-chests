import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('wallet')

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    // Get wallet
    const wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      include: {
        CryptoAddress: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!wallet) {
      return NextResponse.json([])
    }

    return NextResponse.json(wallet.CryptoAddress)
  } catch (error) {
    console.error('Error fetching crypto addresses:', error)
    return NextResponse.json({ error: 'Failed to fetch crypto addresses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, addressType, address, label } = body

    if (!walletAddress || !addressType || !address) {
      return NextResponse.json({ 
        error: 'Wallet address, address type, and address are required' 
      }, { status: 400 })
    }

    // Validate address type
    const validTypes = ['ETH', 'SOL', 'BC1P', 'BC1Q', 'SUI', 'LEGACY', 'LTC', 'DOGE']
    if (!validTypes.includes(addressType)) {
      return NextResponse.json({ error: 'Invalid address type' }, { status: 400 })
    }

    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { address: walletAddress }
    })

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          id: walletAddress,
          address: walletAddress,
          balance: 0
        }
      })
    }

    // Check if address type already exists for this wallet
    const existingAddress = await prisma.cryptoAddress.findUnique({
      where: {
        walletId_addressType: {
          walletId: wallet.id,
          addressType: addressType
        }
      }
    })

    if (existingAddress) {
      return NextResponse.json({ 
        error: `You already have a ${addressType} address added` 
      }, { status: 400 })
    }

    // Create new crypto address
    const cryptoAddress = await prisma.cryptoAddress.create({
      data: {
        walletId: wallet.id,
        addressType,
        address,
        label,
        isVerified: false,
        isPrimary: false
      }
    })

    return NextResponse.json(cryptoAddress)
  } catch (error) {
    console.error('Error adding crypto address:', error)
    return NextResponse.json({ error: 'Failed to add crypto address' }, { status: 500 })
  }
} 