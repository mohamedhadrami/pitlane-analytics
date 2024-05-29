// @/app/championship/layout.tsx

import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Championship',
  description: 'Current driver and contructor standings'
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
