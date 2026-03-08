import QRCode from 'qrcode'
import { Registration } from '@prisma/client'

export async function generateRegistrationQR(registration: Registration): Promise<string> {
  try {
    const qrData = {
      registrationId: registration.id,
      eventId: registration.eventId,
      participantId: registration.participantId,
      status: registration.status,
      registeredAt: registration.registeredAt,
      checksum: generateChecksum(registration.id)
    }

    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300
    })

    return qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
}

export async function generateCheckInQR(registration: Registration): Promise<string> {
  try {
    const qrData = {
      type: 'CHECKIN',
      registrationId: registration.id,
      eventId: registration.eventId,
      participantId: registration.participantId,
      participantName: '', // Will be populated from database
      participantEmail: '', // Will be populated from database
      eventTitle: '', // Will be populated from database
      checkInTime: new Date().toISOString(),
      checksum: generateChecksum(registration.id)
    }

    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300
    })

    return qrCodeDataURL
  } catch (error) {
    console.error('Error generating check-in QR code:', error)
    throw error
  }
}

function generateChecksum(registrationId: string): string {
  const crypto = require('crypto')
  return crypto.createHash('md5').update(registrationId + 'secret-key').digest('hex')
}

export function verifyQRChecksum(qrData: any, registrationId: string): boolean {
  const crypto = require('crypto')
  const expectedChecksum = crypto.createHash('md5').update(registrationId + 'secret-key').digest('hex')
  return qrData.checksum === expectedChecksum
}
