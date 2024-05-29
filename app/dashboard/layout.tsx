// @/app/dashboard/layout.tsx

import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Live',
  description: 'Dashboard layout showing live data during session'
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
