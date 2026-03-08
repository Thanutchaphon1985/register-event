async function testLoginAPI() {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@event-system.com',
        password: 'admin123'
      })
    })

    const data = await response.json()
    console.log('🔍 Login API Response:', data)
    console.log('📊 Status:', response.status)
    
  } catch (error) {
    console.error('❌ Error testing login API:', error)
  }
}

testLoginAPI()
