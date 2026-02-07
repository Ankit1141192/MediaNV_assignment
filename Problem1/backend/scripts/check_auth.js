const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('--- Database Authentication Check ---');
console.log(`Loading .env from: ${path.join(__dirname, '../.env')}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_PORT: ${process.env.DB_PORT}`);
const pass = process.env.DB_PASSWORD || '';
console.log(`DB_PASSWORD: ${pass.length > 0 ? pass.slice(0, 2) + '***' + pass.slice(-2) : '(empty)'} (Length: ${pass.length})`);

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

(async () => {
  try {
      console.log('Attempting to connect...');
      const client = await pool.connect();
      console.log('✅ Connection SUCCESSFUL!');
      const res = await client.query('SELECT NOW()');
      console.log('Server Time:', res.rows[0].now);
      client.release();
      process.exit(0);
  } catch (err) {
      console.error('❌ Connection FAILED');
      console.error('Error Name:', err.name);
      console.error('Error Message:', err.message);
      if (err.code === '28P01') {
          console.error('Reason: Invalid Password or Username.');
      }
      process.exit(1);
  }
})();
