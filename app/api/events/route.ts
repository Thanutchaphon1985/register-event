import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      title,
      description,
      category,
      startDate,
      endDate,
      location,
      capacity,
      registrationDeadline,
      organizerId,
      customFields
    } = body

    // Validate required fields
    if (!title || !description || !category || !startDate || !endDate || !location || !capacity || !registrationDeadline || !organizerId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Create event in database
    const event = await prisma.event.create({
      data: {
        title,
        description,
        category,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        capacity: parseInt(capacity),
        registrationDeadline: new Date(registrationDeadline),
        status: 'DRAFT',
        organizerId
      }
    })

    // Create custom fields if provided
    if (customFields && customFields.length > 0) {
      await prisma.customField.createMany({
        data: customFields.map((field: any) => ({
          eventId: event.id,
          name: field.name,
          type: field.type,
          required: field.required,
          order: customFields.indexOf(field)
        }))
      })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: event,
      message: 'สร้างงานสำเร็จ'
    })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'เกิดข้อผิดพลาดในการสร้างงาน' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where = category ? { category } : {}

    const events = await prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            registrations: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prisma.event.count({ where })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        events,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลงาน' },
      { status: 500 }
    )
  }
}
