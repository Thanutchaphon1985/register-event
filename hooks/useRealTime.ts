'use client'

import { useState, useEffect, useCallback } from 'react'

interface RealTimeData {
  type: string
  data: any
  timestamp: string
}

export function useRealTime(endpoint: string) {
  const [data, setData] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(() => {
    try {
      const eventSource = new EventSource(endpoint)

      eventSource.onopen = () => {
        setIsConnected(true)
        setError(null)
        console.log('🔗 Real-time connection established')
      }

      eventSource.onmessage = (event) => {
        try {
          const parsedData: RealTimeData = JSON.parse(event.data)
          
          if (parsedData.type === 'registrations_update') {
            setData(parsedData.data)
            console.log('📊 Real-time registration update:', parsedData.data)
          }
        } catch (parseError) {
          console.error('Error parsing real-time data:', parseError)
        }
      }

      eventSource.onerror = (error) => {
        setIsConnected(false)
        setError('การเชื่อมต่อแบบ real-time ล้มเหลว')
        console.error('Real-time connection error:', error)
      }

      eventSource.addEventListener('close', () => {
        setIsConnected(false)
        console.log('🔌 Real-time connection closed')
      })

      return eventSource
    } catch (error) {
      setError('ไม่สามารถเชื่อมต่อแบบ real-time ได้')
      console.error('Error creating EventSource:', error)
      return null
    }
  }, [endpoint])

  useEffect(() => {
    const eventSource = connect()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [connect])

  const reconnect = useCallback(() => {
    setError(null)
    connect()
  }, [connect])

  return {
    data,
    isConnected,
    error,
    reconnect
  }
}
