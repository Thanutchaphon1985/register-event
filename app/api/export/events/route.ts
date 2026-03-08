import { NextRequest, NextResponse } from 'next/server'
import { exportEventsToCSV, exportEventsToExcel } from '@/lib/export'
import { ApiResponse } from '@/types'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { format, category, status, startDate, endDate } = await request.json()

    if (!format || !['csv', 'excel'].includes(format)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'รูปแบบไฟล์ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    // Build where clause
    const whereClause: any = {}
    
    if (category) whereClause.category = category
    if (status) whereClause.status = status
    if (startDate || endDate) {
      whereClause.startDate = {}
      if (startDate) whereClause.startDate.gte = new Date(startDate)
      if (endDate) whereClause.startDate.lte = new Date(endDate)
    }

    // Get events with related data
    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        organizer: true,
        _count: {
          select: {
            registrations: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    let exportData: string | Buffer
    let contentType: string
    let fileName: string

    if (format === 'csv') {
      exportData = await exportEventsToCSV(events as any)
      contentType = 'text/csv; charset=utf-8'
      fileName = `events-${new Date().toISOString().split('T')[0]}.csv`
    } else {
      exportData = await exportEventsToExcel(events as any)
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      fileName = `events-${new Date().toISOString().split('T')[0]}.xlsx`
    }

    return new NextResponse(exportData as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    })
  } catch (error) {
    console.error('Error exporting events:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'เกิดข้อผิดพลาดในการส่งออกข้อมูล' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!['csv', 'excel'].includes(format)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'รูปแบบไฟล์ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    // Build where clause
    const whereClause: any = {}
    
    if (category) whereClause.category = category
    if (status) whereClause.status = status
    if (startDate || endDate) {
      whereClause.startDate = {}
      if (startDate) whereClause.startDate.gte = new Date(startDate)
      if (endDate) whereClause.startDate.lte = new Date(endDate)
    }

    // Get events with related data
    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        organizer: true,
        _count: {
          select: {
            registrations: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    let exportData: string | Buffer
    let contentType: string
    let fileName: string

    if (format === 'csv') {
      exportData = await exportEventsToCSV(events as any)
      contentType = 'text/csv; charset=utf-8'
      fileName = `events-${new Date().toISOString().split('T')[0]}.csv`
    } else {
      exportData = await exportEventsToExcel(events as any)
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      fileName = `events-${new Date().toISOString().split('T')[0]}.xlsx`
    }

    return new NextResponse(exportData as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    })
  } catch (error) {
    console.error('Error exporting events:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'เกิดข้อผิดพลาดในการส่งออกข้อมูล' },
      { status: 500 }
    )
  }
}
