import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    start(controller) {
      // Send initial data
      const sendUpdate = async () => {
        try {
          const registrations = await prisma.registration.findMany({
            include: {
              event: {
                select: {
                  id: true,
                  title: true,
                  startDate: true,
                  status: true
                }
              },
              participant: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            },
            orderBy: {
              registeredAt: 'desc'
            },
            take: 10
          })

          const data = {
            type: 'registrations_update',
            data: registrations,
            timestamp: new Date().toISOString()
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        } catch (error) {
          console.error('Error sending real-time update:', error)
        }
      }

      // Send initial data
      sendUpdate()

      // Set up interval for real-time updates
      const interval = setInterval(sendUpdate, 5000) // Update every 5 seconds

      // Clean up on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
