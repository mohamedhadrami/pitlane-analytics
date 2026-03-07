// app/providers.tsx

'use client'

import { FooterProvider } from '@/context/FooterContext'
import SignalRProvider from '@/context/SignalRProvider'
import { HeroUIProvider } from '@heroui/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>

      <SignalRProvider>

        <FooterProvider>
          {children}
        </FooterProvider>

      </SignalRProvider>

    </HeroUIProvider>
  )
}