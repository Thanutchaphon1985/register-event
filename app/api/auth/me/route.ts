import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { ApiResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    console.log('🔍 /api/auth/me - Token from cookies:', token)

    if (!token) {
      console.log('🔍 /api/auth/me - No token found')
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ไม่พบข้อมูลการยืนยันตัวตน' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    console.log('🔍 /api/auth/me - Verified user:', user)
    
    if (!user) {
      console.log('🔍 /api/auth/me - User verification failed')
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'โทเคนหระยุบต้วง' },
        { status: 401 }
      )
    }

    console.log('🔍 /api/auth/me - Success, returning user')
    return NextResponse.json<ApiResponse>({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('🔍 /api/auth/me - Auth verification error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ' },
      { status: 500 }
    )
  }
}
