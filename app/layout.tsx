import './globals.css'
import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'
import { AuthProvider } from '../hooks/useAuth'

const sarabun = Sarabun({ 
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'ระบบลงทะเบียนงานอีเวนต์',
  description: 'ระบบลงทะเบียนงานอีเวนต์ภาษาไทยด้วย Next.js และ Tailwind CSS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={sarabun.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
