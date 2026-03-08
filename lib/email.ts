import nodemailer from 'nodemailer'
import { Event, User, Registration } from '@prisma/client'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
})

export async function sendRegistrationConfirmation(registration: Registration & { event: Event & { organizer: User }, participant: User }) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: participant.email,
      subject: `ยืนยันการลงทะเบียน: ${registration.event.title}`,
      html: `
        <div style="font-family: 'Sarabun', 'Prompt', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white;">
            <h1 style="margin: 0 0 20px 0; font-size: 24px;">ยืนยันการลงทะเบียน</h1>
            <h2 style="margin: 0 0 15px 0; font-size: 20px;">${registration.event.title}</h2>
            <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.5;">
              ยินดีต้อนรับ ${participant.name},
            </p>
            <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.5;">
              เราได้รับการลงทะเบียนของคุณสำหรับงาน <strong>${registration.event.title}</strong> เรียบร้อยแล้ว
            </p>
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>รายละเอียดงาน:</strong></p>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                <li><strong>วันที่:</strong> ${new Date(registration.event.startDate).toLocaleDateString('th-TH')}</li>
                <li><strong>เวลา:</strong> ${new Date(registration.event.startDate).toLocaleTimeString('th-TH')}</li>
                <li><strong>สถานที่:</strong> ${registration.event.location}</li>
                <li><strong>จัดโดย:</strong> ${registration.event.organizer.name}</li>
              </ul>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.8);">
                หากมีข้อสงสัย กรุณาติดต่อเรา
              </p>
            </div>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Registration confirmation email sent to:', participant.email)
  } catch (error) {
    console.error('Error sending registration confirmation email:', error)
    throw error
  }
}

export async function sendEventReminder(registration: Registration & { event: Event & { organizer: User }, participant: User }) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: participant.email,
      subject: `เตือน: งาน ${registration.event.title} ใกล้งใกล้วัน`,
      html: `
        <div style="font-family: 'Sarabun', 'Prompt', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px; color: white;">
            <h1 style="margin: 0 0 20px 0; font-size: 24px;">เตือนงาน</h1>
            <h2 style="margin: 0 0 15px 0; font-size: 20px;">${registration.event.title}</h2>
            <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.5;">
              ยินดี ${participant.name},
            </p>
            <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.5;">
              ขอแจ้งเตือนว่างาน <strong>${registration.event.title}</strong> จะเริ่มใน <strong>${new Date(registration.event.startDate).toLocaleDateString('th-TH')}</strong>
            </p>
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>รายละเอียดงาน:</strong></p>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                <li><strong>วันที่:</strong> ${new Date(registration.event.startDate).toLocaleDateString('th-TH')}</li>
                <li><strong>เวลา:</strong> ${new Date(registration.event.startDate).toLocaleTimeString('th-TH')}</li>
                <li><strong>สถานที่:</strong> ${registration.event.location}</li>
                <li><strong>จัดโดย:</strong> ${registration.event.organizer.name}</li>
              </ul>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.8);">
                หากมีข้อสงสัย กรุณาติดต่อเรา
              </p>
            </div>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Event reminder email sent to:', participant.email)
  } catch (error) {
    console.error('Error sending event reminder email:', error)
    throw error
  }
}
