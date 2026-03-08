import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    // Get total counts
    const [
      totalEvents,
      totalRegistrations,
      activeEvents,
      completedEvents,
      totalUsers
    ] = await Promise.all([
      prisma.event.count(),
      prisma.registration.count(),
      prisma.event.count({ where: { status: 'PUBLISHED' } }),
      prisma.event.count({ where: { status: 'COMPLETED' } }),
      prisma.user.count()
    ])

    // Get registrations by month (last 6 months)
    const registrationsByMonth = await prisma.$queryRaw`
      SELECT 
        strftime('%m-%Y', registeredAt) as month,
        COUNT(*) as count
      FROM Registration
      WHERE registeredAt >= date('now', '-6 months')
      GROUP BY strftime('%m-%Y', registeredAt)
      ORDER BY month
    `

    // Get registrations by category
    const registrationsByCategory = await prisma.event.findMany({
      select: {
        category: true,
        _count: {
          select: {
            registrations: true
          }
        }
      }
    })

    // Format category data with colors
    const categoryData = registrationsByCategory.map((event, index) => ({
      category: event.category,
      count: event._count.registrations,
      color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'][index % 6]
    }))

    // Get events by status
    const eventsByStatus = await prisma.event.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    const statusData = eventsByStatus.map(item => ({
      status: item.status,
      count: item._count.id
    }))

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        totalEvents,
        totalRegistrations,
        activeEvents,
        completedEvents,
        totalUsers,
        registrationsByMonth,
        registrationsByCategory: categoryData,
        eventsByStatus: statusData
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ' },
      { status: 500 }
    )
  }
}
