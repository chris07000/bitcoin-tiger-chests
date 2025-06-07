import './globals.css'
import type { Metadata } from 'next'
import { Inter, Roboto, Press_Start_2P } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const roboto = Roboto({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
})
const pressStart2P = Press_Start_2P({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-press-start-2p',
})

export const metadata: Metadata = {
  title: 'Bitcoin Tiger Chests - Ultimate Bitcoin Gaming',
  description: 'Open mystery chests, win Bitcoin prizes, and stake your Bitcoin Tigers NFTs in the ultimate Bitcoin gaming experience.',
  icons: {
    icon: '/tiger-pixel.png',
    shortcut: '/tiger-pixel.png',
    apple: '/tiger-pixel.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/tiger-pixel.png" type="image/png" />
        <link rel="shortcut icon" href="/tiger-pixel.png" type="image/png" />
        <link rel="apple-touch-icon" href="/tiger-pixel.png" />
      </head>
      <body className={`${inter.variable} ${roboto.variable} ${pressStart2P.variable} antialiased`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
