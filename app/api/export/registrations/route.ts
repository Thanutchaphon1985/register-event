import { NextRequest, NextResponse } from 'next/server'
import { exportRegistrationsToCSV, exportRegistrationsToExcel } from '@/lib/export'
import { ApiResponse } from '@/types'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { eventId, format } = await request.json()

    if (!format || !['csv', 'excel'].includes(format)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'รูปแบบไฟล์ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    // Build where clause
    const whereClause = eventId ? { eventId } : {}

    // Get registrations with related data
    const registrations = await prisma.registration.findMany({
      where: whereClause,
      include: {
        event: {
          include: {
            organizer: true
          }
        },
        participant: true
      },
      orderBy: {
        registeredAt: 'desc'
      }
    })

    let exportData: string | Buffer
    let contentType: string
    let fileName: string

    if (format === 'csv') {
      exportData = await exportRegistrationsToCSV(registrations as any)
      contentType = 'text/csv; charset=utf-8'
      fileName = `registrations-${eventId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`
    } else {
      exportData = await exportRegistrationsToExcel(registrations as any)
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      fileName = `registrations-${eventId || 'all'}-${new Date().toISOString().split('T')[0]}.xlsx`
    }

    return new NextResponse(exportData as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    })
  } catch (error) {
    console.error('Error exporting registrations:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'เกิดข้อผิดพลาดในการส่งออกข้อมูล' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const format = searchParams.get('format') || 'csv'

    if (!['csv', 'excel'].includes(format)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'รูปแบบไฟล์ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    // Build where clause
    const whereClause = eventId ? { eventId } : {}

    // Get registrations with related data
    const registrations = await prisma.registration.findMany({
      where: whereClause,
      include: {
        event: {
          include: {
            organizer: true
          }
        },
        participant: true
      },
      orderBy: {
        registeredAt: 'desc'
      }
    })

    let exportData: string | Buffer
    let contentType: string
    let fileName: string

    if (format === 'csv') {
      exportData = await exportRegistrationsToCSV(registrations as any)
      contentType = 'text/csv; charset=utf-8'
      fileName = `registrations-${eventId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`
    } else {
      exportData = await exportRegistrationsToExcel(registrations as any)
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      fileName = `registrations-${eventId || 'all'}-${new Date().toISOString().split('T')[0]}.xlsx`
    }

    return new NextResponse(exportData as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    })
  } catch (error) {
    console.error('Error exporting registrations:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'เกิดข้อผิดพลาดในการส่งออกข้อมูล' },
      { status: 500 }
    )
  }
}
