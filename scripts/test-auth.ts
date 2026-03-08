import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prismaClient = new PrismaClient()

async function testAuth() {
  try {
    // Find admin user
    const user = await prismaClient.user.findUnique({
      where: { email: 'admin@event-system.com' },
      include: {
        profile: true
      }
    })

    console.log('🔍 Found user:', user)

    if (user) {
      // Test password verification
      const isValid = await bcrypt.compare('admin123', user.password)
      console.log('🔐 Password verification:', isValid)
      
      // Test with wrong password
      const isInvalid = await bcrypt.compare('wrongpassword', user.password)
      console.log('❌ Wrong password verification:', isInvalid)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prismaClient.$disconnect()
  }
}

testAuth()
