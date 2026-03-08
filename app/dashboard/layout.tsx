'use client'

import { useAuth } from '../../hooks/useAuth'
import { LogOut, Settings } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10">
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary-600 mb-2">ระบบงานอีเวนต์</h2>
            <p className="text-sm text-gray-600">ยินดีต้อนรับ, {user?.name}</p>
          </div>
          
          <nav className="space-y-2">
            {user?.role === 'ADMIN' ? (
              <>
                <a href="/dashboard/admin" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  <span>แดชบอร์ดผู้ดูแล</span>
                </a>
                <a href="/dashboard/admin/events" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  <span>จัดการงาน</span>
                </a>
                <a href="/dashboard/admin/registrations" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></span>
                  <span>การลงทะเบียน</span>
                </a>
                <a href="/dashboard/admin/analytics" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                  <span>สถิติ</span>
                </a>
              </>
            ) : (
              <>
                <a href="/dashboard/participant" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  <span>แดชบอร์ดของฉัน</span>
                </a>
                <a href="/dashboard/participant/events" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  <span>ค้นหางาน</span>
                </a>
                <a href="/dashboard/participant/my-registrations" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></span>
                  <span>การลงทะเบียน</span>
                </a>
                <a href="/dashboard/participant/profile" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                  <span>โปรไฟล์</span>
                </a>
              </>
            )}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
            <button
              onClick={logout}
              className="flex items-center w-full text-gray-700 hover:text-red-600 transition"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  )
}
