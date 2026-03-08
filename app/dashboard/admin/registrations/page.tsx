'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../../hooks/useAuth'
import { useRealTime } from '../../../../hooks/useRealTime'
import { Download, RefreshCw, Users, Calendar, FileSpreadsheet } from 'lucide-react'

export default function AdminRegistrationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { data: realTimeData, isConnected, error: realTimeError, reconnect } = useRealTime('/api/realtime/registrations')
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
  const [filter, setFilter] = useState({
    eventId: '',
    format: 'csv'
  })

  useEffect(() => {
    if (realTimeData) {
      setRegistrations(realTimeData)
      setLoading(false)
    }
  }, [realTimeData])

  const handleExport = async (format: string) => {
    try {
      setExportLoading(true)
      
      const response = await fetch('/api/export/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: filter.eventId || null,
          format
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `registrations-${format}-${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('การส่งออกข้อมูลล้มเหลว')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('เกิดข้อผิดพลาดในการส่งออกข้อมูล')
    } finally {
      setExportLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">กรุณาเข้าสู่ระบบก่อน</div>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    )
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            กลับไป
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">จัดการการลงทะเบียน</h1>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">ดูและจัดการการลงทะเบียนทั้งหมด</p>
              
              {/* Real-time Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'เชื่อมต่อแบบ real-time' : 'ขาดการเชื่อมต่อ'}
                </span>
                {!isConnected && (
                  <button
                    onClick={reconnect}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filters and Export */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                กรองตามงาน
              </label>
              <select
                value={filter.eventId}
                onChange={(e) => setFilter({ ...filter, eventId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">ทุกงาน</option>
                {/* Will be populated with events */}
              </select>
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={() => handleExport('csv')}
                disabled={exportLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                {exportLoading ? 'กำลังส่งออก...' : 'ส่งออก CSV'}
              </button>
              
              <button
                onClick={() => handleExport('excel')}
                disabled={exportLoading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                {exportLoading ? 'กำลังส่งออก...' : 'ส่งออก Excel'}
              </button>
            </div>
          </div>

          {/* Real-time Error */}
          {realTimeError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-red-800">{realTimeError}</span>
                <button
                  onClick={reconnect}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  เชื่อมต่อใหม่
                </button>
              </div>
            </div>
          )}

          {/* Registrations Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ผู้ลงทะเบียน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    งาน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่จัดงาน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่ลงทะเบียน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {registration.participant.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {registration.participant.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {registration.event.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(registration.event.startDate).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        registration.status === 'REGISTERED' 
                          ? 'bg-green-100 text-green-800'
                          : registration.status === 'CHECKED_IN'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {registration.status === 'REGISTERED' ? 'ลงทะเบียนแล้ว' :
                         registration.status === 'CHECKED_IN' ? 'เช็คอินแล้ว' : registration.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(registration.registeredAt).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/dashboard/participant/qr-code/${registration.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          ดู QR Code
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          )}

          {!loading && registrations.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีข้อมูลการลงทะเบียน</h3>
              <p className="mt-1 text-sm text-gray-500">ยังไม่มีการลงทะเบียนในระบบ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
