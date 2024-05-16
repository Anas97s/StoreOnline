const pool = require('../base/db');

async function createOrderItemJoinTable() {
    //DROP COLUMN IF EXISTS parfum_name;
    //ADD COLUMN quantity INTEGER NOT NULL
    const alterTableQuery = `
        ALTER TABLE order_items
        ADD COLUMN quantity INTEGER;
    `;
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS order_items (
            order_id INTEGER NOT NULL,
            parfum_id INTEGER NOT NULL,
            quantity INTEGER,
            FOREIGN KEY (order_id) REFERENCES orders(order_id),
            FOREIGN KEY (parfum_id) REFERENCES parfums(id),
            PRIMARY KEY (order_id, parfum_id)
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

module.exports = createOrderItemJoinTable;