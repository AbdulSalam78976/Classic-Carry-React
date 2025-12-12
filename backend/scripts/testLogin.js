import fetch from 'node-fetch';

const testLogin = async () => {
  try {
    console.log('🧪 Testing admin login API...');
    
    const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@classiccarrry.com',
        password: 'admin123'
      })
    });

    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log(`Token: ${data.token ? 'Present' : 'Missing'}`);
      console.log(`User Role: ${data.user?.role}`);
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing login:', error.message);
  }
};

testLogin();