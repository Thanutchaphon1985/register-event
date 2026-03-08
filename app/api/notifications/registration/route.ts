import { NextRequest, NextResponse } from 'next/server'
import { sendRegistrationConfirmation } from '@/lib/email'
import { ApiResponse } from '@/types'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { registrationId } = await request.json()

    if (!registrationId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ไม่พบข้อมูลการลงทะเบียน' },
        { status: 400 }
      )
    }

    // Get registration with event and participant details
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        event: {
          include: {
            organizer: true
          }
        },
        participant: true
      }
    })

    if (!registration) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ไม่พบข้อมูลการลงทะเบียน' },
        { status: 404 }
      )
    }

    // Send registration confirmation email
    await sendRegistrationConfirmation(registration as any)

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'ส่งอีเมลยืนยันการลงทะเบียนสำเร็จ'
    })
  } catch (error) {
    console.error('Error sending registration confirmation:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'เกิดข้อผิดพลาดในการส่งอีเมล' },
      { status: 500 }
    )
  }
}
