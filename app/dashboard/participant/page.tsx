'use client'

import { useAuth } from '@/hooks/useAuth'
import { Calendar, User, Ticket, Clock } from 'lucide-react'

export default function ParticipantDashboard() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">กำลังโหลด...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">กรุณาเข้าสู่ระบบ</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">เมนู</h2>
            <nav className="space-y-2">
              <a href="/dashboard/participant/events" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <Calendar className="w-5 h-5 mr-3" />
                <span>ค้นหางาน</span>
              </a>
              <a href="/dashboard/participant/my-registrations" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <Ticket className="w-5 h-5 mr-3" />
                <span>การลงทะเบียนของฉัน</span>
              </a>
              <a href="/dashboard/participant/profile" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                <User className="w-5 h-5 mr-3" />
                <span>โปรไฟล์</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ยินดีต้อนรับ, {user.name}</h1>
            <p className="text-gray-600">ค้นหาและลงทะเบียนงานที่คุณสนใจ</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Ticket className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">การลงทะเบียนทั้งหมด</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">งานที่จะเข้าร่วม</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">ชั่วโมงที่เหลือ</p>
                  <p className="text-2xl font-bold text-gray-900">15</p>
                </div>
              </div>
            </div>
          </div>

          {/* My Registrations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">การลงทะเบียนล่าสุด</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">สัมมนาดิจิฉัท</h3>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">ยืนยันแล้ว</span>
                </div>
                <p className="text-gray-600 mb-2">วันที่ 15 มีนาคม 2567 เวลา 09:00</p>
                <p className="text-gray-600 mb-2">สถานที่: ศูนย์วิทย์ คอนเวนชั่น</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>15 วันที่เหลือ</span>
                </div>
              </div>
              <div className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">เวิร์คช็อป React พื้นฐาน</h3>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">รอดำเนินการ</span>
                </div>
                <p className="text-gray-600 mb-2">วันที่ 20 มีนาคม 2567 เวลา 13:00</p>
                <p className="text-gray-600 mb-2">สถานที่: ออนไลน์</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>20 วันที่เหลือ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Events */}
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">งานที่แนะนำ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">สัมมนาการลงทุนทรัพย์</h3>
                <p className="text-gray-600 mb-2">เรียนรู้เกี่ยวกับการลงทุนทรัพย์ในยุคปัจจุล</p>
                <p className="text-sm text-gray-500">25 มีนาคม 2567</p>
              </div>
              <div className="border rounded-lg p-4 hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">เทคโนโลยี AI ในธุรกิจ</h3>
                <p className="text-gray-600 mb-2">สำรวจแนวโนโนโลยีและการประยุกต์ในอุตสาหรับ</p>
                <p className="text-sm text-gray-500">28 มีนาคม 2567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
