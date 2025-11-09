// Test script for authentication APIs
const API_BASE = 'http://localhost:3000/api/auth';

async function testRegistration() {
  console.log('Testing user registration...');
  
  const testUser = {
    email: 'test@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    phone: '+1234567890'
  };

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response text:', responseText.substring(0, 200) + '...');
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.log('Failed to parse JSON, response was HTML or other format');
      return false;
    }
    
    console.log('Registration response:', response.status, data);
    
    return response.ok;
  } catch (error) {
    console.error('Registration error:', error);
    return false;
  }
}

async function testLogin() {
  console.log('Testing user login...');
  
  const credentials = {
    email: 'test@example.com',
    password: 'TestPassword123!'
  };

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // Important for cookies
    });

    const data = await response.json();
    console.log('Login response:', response.status, data);
    
    return response.ok;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

async function testGetUser() {
  console.log('Testing get current user...');
  
  try {
    const response = await fetch(`${API_BASE}/me`, {
      method: 'GET',
      credentials: 'include', // Important for cookies
    });

    const data = await response.json();
    console.log('Get user response:', response.status, data);
    
    return response.ok;
  } catch (error) {
    console.error('Get user error:', error);
    return false;
  }
}

async function testLogout() {
  console.log('Testing user logout...');
  
  try {
    const response = await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      credentials: 'include', // Important for cookies
    });

    const data = await response.json();
    console.log('Logout response:', response.status, data);
    
    return response.ok;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

// Run the tests
async function runAuthTests() {
  console.log('=== Authentication API Tests ===\n');
  
  // Test registration
  const registrationSuccess = await testRegistration();
  console.log(`Registration: ${registrationSuccess ? '✅ PASSED' : '❌ FAILED'}\n`);
  
  if (registrationSuccess) {
    // Test login
    const loginSuccess = await testLogin();
    console.log(`Login: ${loginSuccess ? '✅ PASSED' : '❌ FAILED'}\n`);
    
    if (loginSuccess) {
      // Test get user
      const getUserSuccess = await testGetUser();
      console.log(`Get User: ${getUserSuccess ? '✅ PASSED' : '❌ FAILED'}\n`);
      
      // Test logout
      const logoutSuccess = await testLogout();
      console.log(`Logout: ${logoutSuccess ? '✅ PASSED' : '❌ FAILED'}\n`);
    }
  }
  
  console.log('=== Tests Complete ===');
}

// Run tests when script is executed directly
runAuthTests().catch(console.error);