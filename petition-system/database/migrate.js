#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
let pg;
try {
  pg = require('pg');
} catch (e) {
  // Fallback to backend workspace dependency
  pg = require(path.join(__dirname, '..', 'backend', 'node_modules', 'pg'));
}
const { Client } = pg;

// Always load dotenv from backend workspace
require(path.join(__dirname, '..', 'backend', 'node_modules', 'dotenv')).config({
  path: path.join(__dirname, '..', 'backend', '.env')
});

async function run() {
  const sqlPath = path.join(__dirname, 'migrations', '001_create_tables.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Migrations applied successfully.');
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch (_) {}
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

run();