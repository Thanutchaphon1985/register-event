import { Registration, Event, User } from '@prisma/client'
import * as XLSX from 'xlsx'

export async function exportRegistrationsToCSV(registrations: (Registration & { 
  event: Event & { organizer: User }, 
  participant: User 
})[]): Promise<string> {
  try {
    // Define CSV headers with Thai language
    const headers = [
      'รหัสการลงทะเบียน',
      'ชื่อผู้ลงทะเบียน',
      'อีเมล',
      'ชื่องาน',
      'วันที่จัดงาน',
      'เวลาจัดงาน',
      'สถานที่',
      'จัดโดย',
      'สถานะการลงทะเบียน',
      'วันที่ลงทะเบียน',
      'วันที่เช็คอิน'
    ]

    // Convert data to CSV rows
    const rows = registrations.map(reg => [
      reg.id,
      reg.participant.name,
      reg.participant.email,
      reg.event.title,
      new Date(reg.event.startDate).toLocaleDateString('th-TH'),
      new Date(reg.event.startDate).toLocaleTimeString('th-TH'),
      reg.event.location,
      reg.event.organizer.name,
      reg.status,
      new Date(reg.registeredAt).toLocaleDateString('th-TH'),
      reg.checkedInAt ? new Date(reg.checkedInAt).toLocaleDateString('th-TH') : '-'
    ])

    // Create CSV content
    const csvContent = [
      '\ufeff' + headers.join(','), // UTF-8 BOM for Thai characters
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    return csvContent
  } catch (error) {
    console.error('Error exporting to CSV:', error)
    throw error
  }
}

export async function exportRegistrationsToExcel(registrations: (Registration & { 
  event: Event & { organizer: User }, 
  participant: User 
})[]): Promise<Buffer> {
  try {
    // Create worksheet data
    const worksheetData = [
      ['รายงานการลงทะเบียน', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', ''],
      [
        'รหัสการลงทะเบียน',
        'ชื่อผู้ลงทะเบียน',
        'อีเมล',
        'ชื่องาน',
        'วันที่จัดงาน',
        'เวลาจัดงาน',
        'สถานที่',
        'จัดโดย',
        'สถานะการลงทะเบียน',
        'วันที่ลงทะเบียน',
        'วันที่เช็คอิน'
      ],
      ...registrations.map(reg => [
        reg.id,
        reg.participant.name,
        reg.participant.email,
        reg.event.title,
        new Date(reg.event.startDate).toLocaleDateString('th-TH'),
        new Date(reg.event.startDate).toLocaleTimeString('th-TH'),
        reg.event.location,
        reg.event.organizer.name,
        reg.status,
        new Date(reg.registeredAt).toLocaleDateString('th-TH'),
        reg.checkedInAt ? new Date(reg.checkedInAt).toLocaleDateString('th-TH') : '-'
      ])
    ]

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(worksheetData)

    // Set column widths
    const colWidths = [
      { wch: 20 }, // รหัสการลงทะเบียน
      { wch: 25 }, // ชื่อผู้ลงทะเบียน
      { wch: 30 }, // อีเมล
      { wch: 30 }, // ชื่องาน
      { wch: 15 }, // วันที่จัดงาน
      { wch: 15 }, // เวลาจัดงาน
      { wch: 25 }, // สถานที่
      { wch: 20 }, // จัดโดย
      { wch: 15 }, // สถานะการลงทะเบียน
      { wch: 15 }, // วันที่ลงทะเบียน
      { wch: 15 }  // วันที่เช็คอิน
    ]
    ws['!cols'] = colWidths

    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'รายงานการลงทะเบียน')

    // Generate buffer
    const excelBuffer = XLSX.write(wb, { 
      type: 'buffer',
      bookType: 'xlsx',
      bookSST: false 
    })

    return excelBuffer
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    throw error
  }
}

export async function exportEventsToCSV(events: (Event & { 
  organizer: User,
  _count: { registrations: number }
})[]): Promise<string> {
  try {
    // Define CSV headers with Thai language
    const headers = [
      'รหัสงาน',
      'ชื่องาน',
      'คำอธิบาย',
      'หมวดหมู่',
      'วันที่จัดงาน',
      'เวลาจัดงาน',
      'สถานที่',
      'จำนวนที่นั่ง',
      'จำนวนคนลงทะเบียน',
      'สถานะงาน',
      'จัดโดย',
      'วันที่สร้าง'
    ]

    // Convert data to CSV rows
    const rows = events.map(event => [
      event.id,
      event.title,
      event.description || '-',
      event.category || '-',
      new Date(event.startDate).toLocaleDateString('th-TH'),
      new Date(event.startDate).toLocaleTimeString('th-TH'),
      event.location,
      event.capacity || '-',
      event._count.registrations,
      event.status,
      event.organizer.name,
      new Date(event.createdAt).toLocaleDateString('th-TH')
    ])

    // Create CSV content
    const csvContent = [
      '\ufeff' + headers.join(','), // UTF-8 BOM for Thai characters
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    return csvContent
  } catch (error) {
    console.error('Error exporting events to CSV:', error)
    throw error
  }
}

export async function exportEventsToExcel(events: (Event & { 
  organizer: User,
  _count: { registrations: number }
})[]): Promise<Buffer> {
  try {
    // Create worksheet data
    const worksheetData = [
      ['รายงานงาน', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      [
        'รหัสงาน',
        'ชื่องาน',
        'คำอธิบาย',
        'หมวดหมู่',
        'วันที่จัดงาน',
        'เวลาจัดงาน',
        'สถานที่',
        'จำนวนที่นั่ง',
        'จำนวนคนลงทะเบียน',
        'สถานะงาน',
        'จัดโดย',
        'วันที่สร้าง'
      ],
      ...events.map(event => [
        event.id,
        event.title,
        event.description || '-',
        event.category || '-',
        new Date(event.startDate).toLocaleDateString('th-TH'),
        new Date(event.startDate).toLocaleTimeString('th-TH'),
        event.location,
        event.capacity || '-',
        event._count.registrations,
        event.status,
        event.organizer.name,
        new Date(event.createdAt).toLocaleDateString('th-TH')
      ])
    ]

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(worksheetData)

    // Set column widths
    const colWidths = [
      { wch: 20 }, // รหัสงาน
      { wch: 30 }, // ชื่องาน
      { wch: 40 }, // คำอธิบาย
      { wch: 15 }, // หมวดหมู่
      { wch: 15 }, // วันที่จัดงาน
      { wch: 15 }, // เวลาจัดงาน
      { wch: 25 }, // สถานที่
      { wch: 15 }, // จำนวนที่นั่ง
      { wch: 20 }, // จำนวนคนลงทะเบียน
      { wch: 15 }, // สถานะงาน
      { wch: 20 }, // จัดโดย
      { wch: 15 }  // วันที่สร้าง
    ]
    ws['!cols'] = colWidths

    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'รายงานงาน')

    // Generate buffer
    const excelBuffer = XLSX.write(wb, { 
      type: 'buffer',
      bookType: 'xlsx',
      bookSST: false 
    })

    return excelBuffer
  } catch (error) {
    console.error('Error exporting events to Excel:', error)
    throw error
  }
}
