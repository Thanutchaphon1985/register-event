'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, Clock, Search, Filter, ExternalLink } from 'lucide-react'
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

  const handleRegister = async (eventId: string) => {
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          participantId: user.id
        })
      })

      if (response.ok) {
        alert('ลงทะเบียนสำเร็จ')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'เกิดข้อผิดพลาดในการลงทะเบียน')
      }
    } catch (error) {
      console.error('Error registering for event:', error)
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">กรุณาเข้าสู่ระบบ</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ค้นหางาน</h1>
          <p className="text-gray-600">ค้นหาและลงทะเบียนงานที่คุณสนใจ</p>
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
              <p className="text-sm text-gray-500">ลองลองปรับเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[event.status as keyof typeof statusColors]}`}>
                      {statusLabels[event.status as keyof typeof statusLabels]}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(event.startDate).toLocaleDateString('th-TH')}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>ความ {event._count.registrations}/{event.capacity}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>ปิดรับสมัคร: {new Date(event.registrationDeadline).toLocaleDateString('th-TH')}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      จัดโดย {event.organizer?.name || 'ไม่ระบุ'}
                    </span>
                    <button
                      onClick={() => handleRegister(event.id)}
                      className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      ลงทะเบียน
                    </button>
                  </div>
                </div>
              ))}
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
