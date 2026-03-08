import { NextRequest, NextResponse } from 'next/server'
import { generateRegistrationQR, generateCheckInQR } from '@/lib/qr'
import { ApiResponse } from '@/types'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }) {
  try {
    const { id } = params

    const registration = await prisma.registration.findUnique({
      where: { id },
      include: {
        event: {
          select: {
            title: true,
            startDate: true,
            location: true,
            organizer: {
              select: {
                name: true
              }
            }
          }
        },
        participant: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!registration) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ไม่พบข้อมูลการลงทะเบียน' },
        { status: 404 }
      )
    }

    // Generate QR code for registration
    const qrCodeDataURL = await generateRegistrationQR(registration)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        registration: {
          id: registration.id,
          status: registration.status,
          registeredAt: registration.registeredAt,
          event: registration.event,
          participant: registration.participant
        }
      }
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'เกิดข้อผิดพลาดในการสร้าง QR Code' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }) {
  try {
    const { id } = params
    const { action } = await request.json()

    const registration = await prisma.registration.findUnique({
      where: { id }
    })

    if (!registration) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ไม่พบข้อมูลการลงทะเบียน' },
        { status: 404 }
      )
    }

    if (action === 'checkin') {
      // Update registration status to CHECKED_IN
      await prisma.registration.update({
        where: { id },
        data: {
          status: 'CHECKED_IN',
          checkedInAt: new Date()
        }
      })

      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'เช็คอินสำเร็จ'
      })
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'การกระทำไม่ถูกต้อง' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing QR code action:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'เกิดข้อผิดพลาดในการดำเนินการ' },
      { status: 500 }
    )
  }
}
