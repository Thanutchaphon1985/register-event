'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../../hooks/useAuth'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis as RechartsXAxis, YAxis as RechartsYAxis, CartesianGrid as RechartsCartesianGrid } from 'recharts'

interface AnalyticsData {
  totalEvents: number
  totalRegistrations: number
  activeEvents: number
  completedEvents: number
  totalUsers: number
  registrationsByMonth: { month: string; count: number }[]
  registrationsByCategory: { category: string; count: number; color: string }[]
  eventsByStatus: { status: string; count: number }[]
}

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/analytics')
      const data = await response.json()
      
      if (data.success) {
        setAnalyticsData(data.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
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

  if (!analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">กำลังโหลด...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">สถิติและรายงาน</h1>
          <p className="text-gray-600">ดูข้อมูลสถิติและรายงานการลงทะเบียน</p>
        </div>

        {/* สถิติหลัก */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-full p-3">
                <span className="text-white text-2xl font-bold">{analyticsData.totalEvents}</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">งานทั้งหมด</h3>
                <p className="text-3xl font-bold text-blue-600">{analyticsData.totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-full p-3">
                <span className="text-white text-2xl font-bold">{analyticsData.totalRegistrations}</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">การลงทะเบียนทั้งหมด</h3>
                <p className="text-3xl font-bold text-green-600">{analyticsData.totalRegistrations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-full p-3">
                <span className="text-white text-2xl font-bold">{analyticsData.activeEvents}</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">งานที่กำลังอยู่</h3>
                <p className="text-3xl font-bold text-yellow-600">{analyticsData.activeEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-full p-3">
                <span className="text-white text-2xl font-bold">{analyticsData.completedEvents}</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">งานที่เสร็จสิ้น</h3>
                <p className="text-3xl font-bold text-purple-600">{analyticsData.completedEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-full p-3">
                <span className="text-white text-2xl font-bold">{analyticsData.totalUsers}</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">ผู้ใช้งานทั้งหมด</h3>
                <p className="text-3xl font-bold text-red-600">{analyticsData.totalUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* กราฟแสดงการลงทะเบียนรายเดือน */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">การลงทะเบียนรายเดือน</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.registrationsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">การลงทะเบียนตามหมวดหมู่</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.registrationsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.category}: ${entry.count}`}
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {analyticsData.registrationsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">สถานะงานตามสถานะ</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.eventsByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
