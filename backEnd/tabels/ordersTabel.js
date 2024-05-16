const pool = require('../base/db');

async function createOrdersTable() {
    const alterTableQuery = `
        ALTER TABLE orders
        DROP COLUMN IF EXISTS status;
    `;
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS orders (
            order_id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            total_cost DECIMAL(10, 2),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `;

    try {
        const client = await pool.connect();
        //await client.query(alterTableQuery);  // update
        await client.query(createTableQuery);
        client.release();
        console.log('Table created successfully');
      } catch (err) {
        console.error('Error creating table:', err);
      }
}

module.exports = createOrdersTable;