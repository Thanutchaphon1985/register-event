'use client'

import { useAuth } from '@/hooks/useAuth'
import { Calendar, Users, TrendingUp, FileText } from 'lucide-react'

export default function AdminDashboard() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">กำลังโหลด...</div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">ไม่มีสิทธิเข้าถึงหน้านี้</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">แดชบอร์ดผู้ดูแล</h2>
            <nav className="space-y-2">
              <a href="/dashboard/admin/events" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <Calendar className="w-5 h-5 mr-3" />
                <span>จัดการงาน</span>
              </a>
              <a href="/dashboard/admin/registrations" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <Users className="w-5 h-5 mr-3" />
                <span>ผู้ลงทะเบียน</span>
              </a>
              <a href="/dashboard/admin/analytics" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <TrendingUp className="w-5 h-5 mr-3" />
                <span>สถิติ</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ยินดีต้อนรับ, {user.name}</h1>
            <p className="text-gray-600">จัดการระบบงานอีเวนต์ของคุณ</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">งานทั้งหมด</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">ผู้ลงทะเบียนทั้งหมด</p>
                  <p className="text-2xl font-bold text-gray-900">248</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">งานที่กำลังดำเนินการ</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">รายงานใหม่</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">งานล่าสุด</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">ชื่องาน</th>
                    <th className="text-left p-3">วันที่</th>
                    <th className="text-left p-3">ผู้ลงทะเบียน</th>
                    <th className="text-left p-3">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">สัมมนาดิจิฉัท</td>
                    <td className="p-3">15 มี.ค. 2567</td>
                    <td className="p-3">45</td>
                    <td className="p-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">เผยแพร่</span>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">เวิร์คช็อปการตลาดแบบ</td>
                    <td className="p-3">20 มี.ค. 2567</td>
                    <td className="p-3">28</td>
                    <td className="p-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">กำลังดำเนินการ</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
