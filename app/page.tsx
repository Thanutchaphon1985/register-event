'use client'

import { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    window.location.href = '/login'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">กำลังนำทาง...</h1>
        <p className="text-gray-600">หากไม่ถูกนำทางโดยอัตโนมัติ <a href="/login" className="text-blue-600 hover:underline">คลิกที่นี่</a></p>
      </div>
    </div>
  )
}
