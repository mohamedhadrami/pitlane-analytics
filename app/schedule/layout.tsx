// @/app/schedule/layout.tsx

import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Schedule',
  description: 'Current Formula 1 schedule'
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
