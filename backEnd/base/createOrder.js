const pool = require('../base/db');


async function createOrder(userId, totalCost) {
    const query = `
        INSERT INTO orders (user_id, total_cost)
        VALUES ($1, $2)
        RETURNING *;
    `;
    try {
        const res = await pool.query(query, [userId, totalCost]);
        console.log('Order created:', res.rows[0]);
        return res.rows[0].order_id;  // Return the order ID for further processing
    } catch (err) {
        console.error('Error inserting order:', err);
        return null;
    }
}


async function addItemToOrder(orderId, parfumId, quantity) {
    const query = `
        INSERT INTO order_items (order_id, parfum_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    try {
        const res = await pool.query(query, [orderId, parfumId, quantity]);
        console.log('Item added to order:', res.rows[0]);
        return res.rows[0];
    } catch (err) {
        console.error('Error adding item to order:', err);
    }
}


module.exports = {
    createOrder,
    addItemToOrder
};