const pool = require('../base/db');

async function createUserTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            isAdmin BOOLEAN DEFAULT FALSE
        )
    `;

    try {
        const client = await pool.connect();
        await client.query(createTableQuery);
        client.release();
        console.log('Table created successfully');
      } catch (err) {
        console.error('Error creating table:', err);
      }
}

module.exports = createUserTable;