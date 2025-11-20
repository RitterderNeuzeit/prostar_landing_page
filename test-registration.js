const fetch = require('node-fetch');

async function testRegistration() {
  console.log('🧪 Teste echte Registrierung über tRPC...\n');
  
  try {
    const response = await fetch('http://localhost:3003/api/trpc/course.register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        json: {
          name: 'Jonas Friedrich',
          email: 'jonfriedrichspsm@gmail.com',
          courseName: 'free-mini-course'
        }
      })
    });

    const result = await response.json();
    
    if (result.error) {
      console.log('❌ FEHLER:', result.error.json.message);
      console.log('Details:', result.error.json);
      return;
    }

    console.log('✅ REGISTRIERUNG ERFOLGREICH!');
    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Fehler:', error.message);
  }
}

testRegistration();
