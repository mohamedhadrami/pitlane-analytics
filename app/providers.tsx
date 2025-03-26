// app/providers.tsx

'use client'

import { FooterProvider } from '@/context/FooterContext'
import { HeroUIProvider } from '@heroui/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <FooterProvider>
        {children}
      </FooterProvider>
    </HeroUIProvider>
  )
}