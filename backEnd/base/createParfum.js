const pool = require('../base/db');

async function createParfum(name, price, old_price, details, rest, genre) {
    const query = `
        INSERT INTO parfums (name, price, old_price, details, rest, genre)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    try {
        const res = await pool.query(query, [name, price, old_price, details, rest, genre]);
        console.log('Parfum created:', res.rows[0]);
    } catch (err) {
        console.error('Error inserting user:', err);
    }
}

async function ParfumExists(parfum) {
    const query = 'SELECT 1 FROM parfums WHERE name = $1';
    try {
        const result = await pool.query(query, [parfum]);
        return result.rows.length > 0;
    } catch (err) {
        console.error('Error checking parfum:', err);
        throw err;
    }
}

module.exports = {
    createParfum,
    ParfumExists
};