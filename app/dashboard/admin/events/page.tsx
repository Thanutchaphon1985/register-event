'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, Clock, Edit, Trash2, Plus, Search, Filter } from 'lucide-react'
import { useAuth } from '../../../../hooks/useAuth'

interface Event {
  id: string
  title: string
  description: string
  category: string
  startDate: string
  endDate: string
  location: string
  capacity: number
  registrationDeadline: string
  status: string
  createdAt: string
  organizer: {
    name: string
  }
  _count: {
    registrations: number
  }
}

export default function EventsPage() {
  const { user, loading } = useAuth()
  
  const [events, setEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    'สัมมนาธุรกิจ',
    'อบรม',
    'เวิร์คช็อป',
    'งานเครือข่าย',
    'สังคม',
    'งานสังคม'
  ]

  const statusColors = {
    'DRAFT': 'bg-gray-100 text-gray-800',
    'PUBLISHED': 'bg-green-100 text-green-800',
    'ONGOING': 'bg-blue-100 text-blue-800',
    'COMPLETED': 'bg-purple-100 text-purple-800',
    'CANCELLED': 'bg-red-100 text-red-800'
  }

  const statusLabels = {
    'DRAFT': 'ฉบับร่าง',
    'PUBLISHED': 'เผยแพร่',
    'ONGOING': 'กำลังดำเนินการ',
    'COMPLETED': 'เสร็จสิ้น',
    'CANCELLED': 'ยกเลิก'
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      const category = selectedCategory ? `&category=${selectedCategory}` : ''
      const search = searchTerm ? `&search=${searchTerm}` : ''
      
      const response = await fetch(`/api/events?page=${currentPage}&limit=10${category}${search}`)
      const data = await response.json()
      
      if (data.success) {
        setEvents(data.data.events)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('คุณต้องการลบงานนี้ใช่หรือไม่?')) {
      return
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setEvents(events.filter(event => event.id !== eventId))
        alert('ลบงานสำเร็จ')
      } else {
        alert('เกิดข้อผิดพลาดในการลบงาน')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    }
  }

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
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">จัดการงาน</h1>
          <p className="text-gray-600">จัดการและจัดการงานทั้งหมด</p>
        </div>

        {/* ปุ่มค้นหาและกรอง */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ค้นหางาน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">ทุกหมวดหมู่</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <a
                href="/dashboard/admin/events/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                สร้างงานใหม่
              </a>
            </div>
          </div>
        </div>

        {/* รายการงาน */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-r-2 border-b-primary-600"></div>
              <p className="mt-2 text-gray-600">กำลังโหลด...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-600">ไม่พบงานที่ค้นหา</p>
              <p className="text-sm text-gray-500">ลองสร้างงานแรกเพื่อดูข้อมูล</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ชื่องาน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      หมวดหมู่
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานที่
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ความ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ผู้จัด
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จำนวน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การกระทำ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[event.status as keyof typeof statusColors]}`}>
                          {statusLabels[event.status as keyof typeof statusLabels]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(event.startDate).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event._count.registrations}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.organizer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(event.createdAt).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <a
                            href={`/dashboard/admin/events/${event.id}/edit`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {events.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 lg:px-8">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ก่อนหน้า
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                หน้าถัดไป
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
