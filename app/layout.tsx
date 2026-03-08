import './globals.css'
import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'

const sarabun = Sarabun({ 
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'หน้าเข้าสู่ระบบ',
  description: 'หน้าเข้าสู่ระบบ Next.js ด้วย Tailwind CSS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={sarabun.className}>{children}</body>
    </html>
  )
}
