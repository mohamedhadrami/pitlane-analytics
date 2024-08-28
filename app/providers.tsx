// app/providers.tsx
'use client'

import { FooterProvider } from '@/context/FooterContext'
import SignalRProvider from '@/context/SignalRProvider'
import { NextUIProvider } from '@nextui-org/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>

      <SignalRProvider>

        <FooterProvider>
          {children}
        </FooterProvider>

      </SignalRProvider>

    </NextUIProvider>
  )
}