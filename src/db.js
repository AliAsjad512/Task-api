const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'task_api',
});

async function init() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id UUID PRIMARY KEY,
            title TEXT NOT NULL,
            done BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
    `);
}

async function reset() {
    await pool.query('TRUNCATE TABLE tasks');
}

module.exports = { pool, init, reset };
