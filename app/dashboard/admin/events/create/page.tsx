'use client'

import { useState } from 'react'
import { Calendar, MapPin, Users, Clock, Save, X } from 'lucide-react'
import { useAuth } from '../../../../../hooks/useAuth'

export default function CreateEventPage() {
  const { user, loading } = useAuth()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'สัมมนาธุรกิจ',
    startDate: '',
    endDate: '',
    location: '',
    capacity: '',
    registrationDeadline: ''
  })

  const [customFields, setCustomFields] = useState([
    { id: '1', name: 'บริษัท', type: 'TEXT', required: true },
    { id: '2', name: 'อีเมล', type: 'EMAIL', required: true },
    { id: '3', name: 'เบอร์โทรศัพท์', type: 'PHONE', required: false }
  ])

  const categories = [
    'สัมมนาธุรกิจ',
    'อบรม',
    'เวิร์คช็อป',
    'งานเครือข่าย',
    'สังคม',
    'งานสังคม'
  ]

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          organizerId: user.id,
          customFields
        }),
      })

      if (response.ok) {
        alert('สร้างงานสำเร็จ')
        window.location.href = '/dashboard/admin/events'
      } else {
        alert('เกิดข้อผิดพลาดในการสร้างงาน')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    }
  }

  const addCustomField = () => {
    const newField = {
      id: Date.now().toString(),
      name: '',
      type: 'TEXT',
      required: false
    }
    setCustomFields([...customFields, newField])
  }

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id))
  }

  const updateCustomField = (id: string, updates: any) => {
    setCustomFields(customFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">สร้างงานใหม่</h1>
            <p className="text-gray-600">กรอกข้อมูลรายละเอียดของงานที่ต้องการจัด</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ข้อมูลพื้นฐาน */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่องาน <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="กรอกชื่องาน"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  หมวดหมู่ <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  รายละเอียดงาน <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="กรอกรายละเอียดของงาน"
                  required
                />
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  วันที่เริ่ม <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  วันที่สิ้นสุด <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  สถานที่ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="กรอกสถานที่จัดงาน"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                  ความผู้เข้าร่วม <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="capacity"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="กรอกจำนวนผู้เข้าร่วม"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                วันหมดอายุธิการลงทะเบียน <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

            {/* ฟอร์มลงทะเบียนแบบกำหนดเอง */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">ฟอร์มลงทะเบียนเพิ่มเติม</h3>
                <button
                  type="button"
                  onClick={addCustomField}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  เพิ่มฟิลด์
                </button>
              </div>

              <div className="space-y-4">
                {customFields.map((field) => (
                  <div key={field.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateCustomField(field.id, { name: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="ชื่อฟิลด์"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => updateCustomField(field.id, { type: e.target.value })}
                        className="ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="TEXT">ข้อความ</option>
                        <option value="EMAIL">อีเมล</option>
                        <option value="PHONE">เบอร์โทรศัพท์</option>
                        <option value="NUMBER">ตัวเลข</option>
                        <option value="DATE">วันที่</option>
                      </select>
                      <div className="flex items-center ml-2">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateCustomField(field.id, { required: e.target.checked })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">จำเป็นต้อง</label>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCustomField(field.id)}
                        className="ml-2 p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ปุ่ม */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <div className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  สร้างงาน
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
