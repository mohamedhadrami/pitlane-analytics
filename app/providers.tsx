// app/providers.tsx
'use client'

import { FooterProvider } from '@/context/FooterContext'
import { NextUIProvider } from '@nextui-org/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <FooterProvider>
        {children}
      </FooterProvider>
    </NextUIProvider>
  )
}