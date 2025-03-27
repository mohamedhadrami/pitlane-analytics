// @/app/telemetry/layout.tsx

import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Telemetry',
  description: 'Access Formula 1 telemetry'
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
