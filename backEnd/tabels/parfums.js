const pool = require('../base/db');

async function createParfumsTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS parfums (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            old_price DECIMAL(10, 2),
            details VARCHAR(500),
            rest INTEGER NOT NULL,
            genre VARCHAR(50)
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
module.exports = createParfumsTable;