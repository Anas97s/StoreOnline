const pool = require('../base/db');

async function createGenreTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS genre (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL
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

module.exports = createGenreTable;