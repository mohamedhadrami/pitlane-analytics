// @/app/archive/layout.tsx

import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Archive',
  description: 'Access to historical F1 data'
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
