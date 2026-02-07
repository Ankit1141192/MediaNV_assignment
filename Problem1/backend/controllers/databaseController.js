const pool = require('../db');
const { exec } = require('child_process');

exports.createDatabase = async (req, res) => {
  const { dbName } = req.body;

  if (!dbName || !/^[a-zA-Z0-9_]+$/.test(dbName)) {
    return res.status(400).json({ error: 'Invalid database name. Use only alphanumeric characters and underscores.' });
  }

  try {
    // Check if database exists
    const checkResult = await pool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (checkResult.rowCount > 0) {
      return res.status(409).json({ error: 'Database already exists' });
    }

    // Create database
    // Note: CREATE DATABASE cannot run inside a transaction block
    // We must use a separate client or non-transactional query
    // But node-postgres pool query is auto-commit unless we start a transaction explicitly.
    // Parameterized queries for identifiers are not supported directly in SQL, but we validated input.
    await pool.query(`CREATE DATABASE "${dbName}"`);

    res.status(201).json({ message: `Database "${dbName}" created successfully` });
  } catch (error) {
    console.error('Error creating database:', error);
    res.status(500).json({ error: 'Failed to create database', details: error.message });
  }
};

exports.checkDatabase = async (req, res) => {
  const { dbName } = req.body;

  if (!dbName) {
    return res.status(400).json({ error: 'Database name is required' });
  }

    // Basic validation to prevent command injection
  if (!/^[a-zA-Z0-9_]+$/.test(dbName)) {
      return res.status(400).json({ error: 'Invalid database name.' });
  }

  try {
    const result = await pool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rowCount > 0) {
      res.json({ exists: true, message: `Database "${dbName}" exists` });
    } else {
      res.status(404).json({ exists: false, message: `Database "${dbName}" not found` });
    }
  } catch (error) {
    console.error('Error checking database:', error);
    res.status(500).json({ error: 'Failed to check database', details: error.message });
  }
};

exports.migrateDatabase = async (req, res) => {
  const { sourceDb, targetDb } = req.body;

  if (!sourceDb || !targetDb) {
    return res.status(400).json({ error: 'Source and target database names are required' });
  }

  // Basic validation to prevent command injection
  if (!/^[a-zA-Z0-9_]+$/.test(sourceDb) || !/^[a-zA-Z0-9_]+$/.test(targetDb)) {
      return res.status(400).json({ error: 'Invalid database name(s)' });
  }

  try {
      // 1. Check if source exists
      const sourceCheck = await pool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [sourceDb]);
      if (sourceCheck.rowCount === 0) {
          return res.status(404).json({ error: `Source database "${sourceDb}" not found` });
      }

      // 2. Check if target exists.
      const targetCheck = await pool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [targetDb]);
      
      // If target doesn't exist, create it
      if (targetCheck.rowCount === 0) {
           await pool.query(`CREATE DATABASE "${targetDb}"`);
      }

      // 3. Perform Migration using pg_dump and psql
      // This requires pg_dump and psql to be in the system PATH
      // Use environment variables for credentials if needed.
      const env = { 
          ...process.env, 
          PGPASSWORD: process.env.DB_PASSWORD || 'password',
          PGUSER: process.env.DB_USER || 'postgres',
          PGHOST: process.env.DB_HOST || 'localhost',
          PGPORT: process.env.DB_PORT || '5432',
          PG_BIN_PATH: process.env.PG_BIN_PATH || ''
      };
      
      // Using exec for simplicity. For production, consider spawn or more robust tooling.
      // Important: On Windows, use "set PGPASSWORD=..." or pass via env to child_process (which we do).
      // The pipe command structure: pg_dump ... | psql ...
      
      // Constructing command. Note: We validated db names so they are safe to put in command line.
      const pgDumpPath = env.PG_BIN_PATH ? `"${env.PG_BIN_PATH}\\pg_dump"` : 'pg_dump';
      const psqlPath = env.PG_BIN_PATH ? `"${env.PG_BIN_PATH}\\psql"` : 'psql';

      const dumpCmd = `${pgDumpPath} -U ${env.PGUSER} -h ${env.PGHOST} -p ${env.PGPORT} "${sourceDb}"`;
      const restoreCmd = `${psqlPath} -U ${env.PGUSER} -h ${env.PGHOST} -p ${env.PGPORT} "${targetDb}"`;
      
      const fullCommand = `${dumpCmd} | ${restoreCmd}`;

      console.log(`Executing migration: ${fullCommand}`);

      exec(fullCommand, { env }, (error, stdout, stderr) => {
          if (error) {
              console.error(`Migration error: ${error.message}`);
              return res.status(500).json({ error: 'Migration failed', details: stderr || error.message });
          }
           // pg_dump often outputs notices to stderr, so we don't necessarily fail on stderr unless error is present.
           console.log(`Migration stdout: ${stdout}`);
           if (stderr) console.warn(`Migration stderr: ${stderr}`);

          res.json({ message: `Migration from "${sourceDb}" to "${targetDb}" completed successfully` });
      });

  } catch (error) {
    console.error('Error preparing migration:', error);
    res.status(500).json({ error: 'Failed to prepare migration', details: error.message });
  }
};
