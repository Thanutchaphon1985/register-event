import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

const prismaClient = new PrismaClient()

async function main() {
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prismaClient.user.upsert({
      where: { email: 'admin@event-system.com' },
      update: {
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN'
      },
      create: {
        id: 'admin-user-id',
        email: 'admin@event-system.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    // Create user profile
    await prismaClient.userProfile.upsert({
      where: { userId: admin.id },
      update: {
        phone: '+66 123 456 789',
        company: 'Event Management System',
        bio: 'ผู้ดูแลระบบจัดการงาน'
      },
      create: {
        userId: admin.id,
        phone: '+66 123 456 789',
        company: 'Event Management System',
        bio: 'ผู้ดูแลระบบจัดการงาน'
      }
    })

    console.log('✅ Admin user created/updated:', admin)
    console.log('📧 Email: admin@event-system.com')
    console.log('🔑 Password: admin123')
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prismaClient.$disconnect()
  }
}

main()
