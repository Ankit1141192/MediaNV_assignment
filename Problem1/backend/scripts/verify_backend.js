const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function runTests() {
  console.log('Starting Backend Verification...');

  try {
    console.log('\n[TEST 1] Creating database "test_api_db"...');
    try {
        const createRes = await axios.post(`${API_URL}/create-database`, { dbName: 'test_api_db' });
        console.log('SUCCESS:', createRes.data);
    } catch (e) {
        if (e.response && e.response.status === 409) {
            console.log('SKIPPED: Database already exists.');
        } else {
            throw e;
        }
    }

    console.log('\n[TEST 2] Checking existing database "test_api_db"...');
    const checkRes = await axios.post(`${API_URL}/check-database`, { dbName: 'test_api_db' });
    console.log('SUCCESS:', checkRes.data);

    console.log('\n[TEST 3] Checking non-existent database "test_fake_db"...');
    try {
      await axios.post(`${API_URL}/check-database`, { dbName: 'test_fake_db' });
      console.error('FAILURE: Should have returned 404');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('SUCCESS: Got 404 as expected:', error.response.data);
      } else {
        throw error;
      }
    }

    console.log('\n[TEST 4] Migrating "test_api_db" to "test_migrated_db"...');
    const migrateRes = await axios.post(`${API_URL}/migrate-database`, { 
        sourceDb: 'test_api_db', 
        targetDb: 'test_migrated_db' 
    });
    console.log('SUCCESS:', migrateRes.data);

    console.log('\nALL TESTS PASSED!');
  } catch (error) {
    console.error('\nTEST FAILED:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
}

runTests();
