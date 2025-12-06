const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣  Testing health endpoint...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('   ✅ Health check:', health.data);
    console.log('   Status:', health.data.status);
    console.log('   Message:', health.data.message);
    console.log('   Timestamp:', health.data.timestamp);
    console.log();

    // Test 2: Registration
    console.log('2️⃣  Testing registration...');
    const testEmail = `test${Date.now()}@example.com`;
    const register = await axios.post(`${API_URL}/register`, {
      username: 'testuser',
      email: testEmail,
      password: 'test123456'
    });
    console.log('   ✅ Registration successful!');
    console.log('   User ID:', register.data.user.id);
    console.log('   Username:', register.data.user.username);
    console.log('   Email:', register.data.user.email);
    console.log('   Token received:', register.data.token ? 'Yes' : 'No');
    const token = register.data.token;
    console.log();

    // Test 3: Get projects (should be empty for new user)
    console.log('3️⃣  Testing get projects (authenticated)...');
    const projects = await axios.get(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Projects retrieved successfully!');
    console.log('   Number of projects:', projects.data.length);
    console.log();

    // Test 4: Create project
    console.log('4️⃣  Testing create project...');
    const newProject = await axios.post(`${API_URL}/projects`, {
      name: 'Test Website',
      pages: [{ id: 'page-1', name: 'Home', components: [] }]
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Project created successfully!');
    console.log('   Project ID:', newProject.data.id);
    console.log('   Project Name:', newProject.data.name);
    console.log('   Number of pages:', newProject.data.pages?.length || 0);
    const projectId = newProject.data.id;
    console.log();

    // Test 5: Get specific project
    console.log('5️⃣  Testing get specific project...');
    const project = await axios.get(`${API_URL}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Project retrieved successfully!');
    console.log('   Project Name:', project.data.name);
    console.log('   Pages:', project.data.pages?.length || 0);
    console.log();

    // Test 6: Update project
    console.log('6️⃣  Testing update project...');
    const updatedProject = await axios.put(`${API_URL}/projects/${projectId}`, {
      name: 'Updated Test Website'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Project updated successfully!');
    console.log('   Updated Name:', updatedProject.data.name);
    console.log();

    // Test 7: Login
    console.log('7️⃣  Testing login...');
    const login = await axios.post(`${API_URL}/login`, {
      email: testEmail,
      password: 'test123456'
    });
    console.log('   ✅ Login successful!');
    console.log('   User:', login.data.user.username);
    console.log('   Token received:', login.data.token ? 'Yes' : 'No');
    console.log();

    // Test 8: Delete project
    console.log('8️⃣  Testing delete project...');
    const deleteResponse = await axios.delete(`${API_URL}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Project deleted successfully!');
    console.log('   Message:', deleteResponse.data.message);
    console.log();

    // Test 9: Error handling - Invalid token
    console.log('9️⃣  Testing error handling (invalid token)...');
    try {
      await axios.get(`${API_URL}/projects`, {
        headers: { Authorization: 'Bearer invalid-token' }
      });
      console.log('   ❌ Should have failed!');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('   ✅ Correctly rejected invalid token (403)');
      } else {
        console.log('   ⚠️  Unexpected error:', error.response?.status);
      }
    }
    console.log();

    // Test 10: Error handling - Missing fields
    console.log('🔟 Testing error handling (missing fields)...');
    try {
      await axios.post(`${API_URL}/register`, {
        username: 'test'
        // Missing email and password
      });
      console.log('   ❌ Should have failed!');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('   ✅ Correctly rejected invalid request (400)');
        console.log('   Error message:', error.response.data.error);
      } else {
        console.log('   ⚠️  Unexpected error:', error.response?.status);
      }
    }
    console.log();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All API tests passed successfully! 🎉');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('\n❌ Test failed!');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Error:', error.response.data);
    } else if (error.request) {
      console.error('   No response received. Is the server running?');
      console.error('   Make sure to run: npm run server');
    } else {
      console.error('   Error:', error.message);
    }
    process.exit(1);
  }
}

// Run tests
testAPI();

