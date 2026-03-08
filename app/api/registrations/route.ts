import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, participantId } = body

    // Validate required fields
    if (!eventId || !participantId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Check if event exists and is published
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ไม่พบงานที่ต้องการ' },
        { status: 404 }
      )
    }

    if (event.status !== 'PUBLISHED') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'งานนี้ยังไม่เปิดให้ลงทะเบียน' },
        { status: 400 }
      )
    }

    // Check if registration deadline has passed
    if (new Date() > new Date(event.registrationDeadline)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'หมดเขตระยุธิการลงทะเบียนแล้ว' },
        { status: 400 }
      )
    }

    // Check if event is at capacity
    const currentRegistrations = await prisma.registration.count({
      where: { eventId }
    })

    if (currentRegistrations >= event.capacity) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'งานนี้เต็มแล้ว' },
        { status: 400 }
      )
    }

    // Check if user is already registered
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        eventId,
        participantId
      }
    })

    if (existingRegistration) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'คุณลงทะเบียนงานนี้แล้ว' },
        { status: 400 }
      )
    }

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        eventId,
        participantId,
        status: 'REGISTERED'
      }
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: registration,
      message: 'ลงทะเบียนสำเร็จ'
    })
  } catch (error) {
    console.error('Error creating registration:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'เกิดข้อผิดพลาดในการลงทะเบียน' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const participantId = searchParams.get('participantId')
    const eventId = searchParams.get('eventId')

    let where: any = {}

    if (participantId) {
      where.participantId = participantId
    }

    if (eventId) {
      where.eventId = eventId
    }

    const registrations = await prisma.registration.findMany({
      where,
      include: {
        event: {
          include: {
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
      },
      orderBy: {
        registeredAt: 'desc'
      }
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: registrations
    })
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการลงทะเบียน' },
      { status: 500 }
    )
  }
}
