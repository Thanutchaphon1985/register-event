'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Download, QrCode, CheckCircle } from 'lucide-react'
import { useAuth } from '../../../../../hooks/useAuth'

export default function QRCodePage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [qrData, setQrData] = useState<any>(null)
  const [qrLoading, setQrLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user && params.id) {
      fetchQRCode()
    }
  }, [user, params.id])

  const fetchQRCode = async () => {
    try {
      setQrLoading(true)
      const response = await fetch(`/api/qr/registration/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setQrData(data.data)
      } else {
        setError(data.error || 'เกิดข้อผิดพลาดในการดึงข้อมูล')
      }
    } catch (error) {
      console.error('Error fetching QR code:', error)
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    } finally {
      setQrLoading(false)
    }
  }

  if (qrLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  const downloadQRCode = () => {
    if (qrData?.qrCode) {
      const link = document.createElement('a')
      link.download = `qr-code-${qrData.registration.id}.png`
      link.href = qrData.qrCode
      link.click()
    }
  }

  if (qrLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            กลับไป
          </button>
        </div>
      </div>
    )
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Code สำหรับการเข้าร่วมงาน</h1>
            <p className="text-gray-600">แสดง QR Code สำหรับการเข้าร่วมงาน</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Code Display */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-md border-2 border-gray-200">
                {qrData?.qrCode && (
                  <img 
                    src={qrData.qrCode} 
                    alt="QR Code" 
                    className="w-64 h-64"
                  />
                )}
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={downloadQRCode}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  ดาวน์โหลด QR Code
                </button>
              </div>
            </div>

            {/* Registration Details */}
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-900 mb-3">ข้อมูลการลงทะเบียน</h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">รหัสการลงทะเบียน:</span>
                    <span className="font-medium">{qrData?.registration?.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">สถานะ:</span>
                    <span className="font-medium">{qrData?.registration?.status}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">วันที่ลงทะเบียน:</span>
                    <span className="font-medium">
                      {qrData?.registration?.registeredAt && new Date(qrData.registration.registeredAt).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-green-900 mb-3">ข้อมูลงาน</h2>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">ชื่องาน:</span>
                    <span className="font-medium">{qrData?.registration?.event?.title}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">วันที่จัด:</span>
                    <span className="font-medium">
                      {qrData?.registration?.event?.startDate && new Date(qrData.registration.event.startDate).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">สถานที่:</span>
                    <span className="font-medium">{qrData?.registration?.event?.location}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">จัดโดย:</span>
                    <span className="font-medium">{qrData?.registration?.event?.organizer?.name}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-yellow-900 mb-3">ข้อมูลผู้ลงทะเบียน</h2>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">ชื่อ:</span>
                    <span className="font-medium">{qrData?.registration?.participant?.name}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">อีเมล:</span>
                    <span className="font-medium">{qrData?.registration?.participant?.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.push('/dashboard/participant/events')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              กลับไปหน้างาน
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
