const pool = require('../base/db');

async function createGenre(name) {
    const query = `
        INSERT INTO genre (name)
        VALUES ($1)
        RETURNING *;
    `;

    try {
        const res = await pool.query(query, [name]);
        console.log('Genre created:', res.rows[0]);
    } catch (err) {
        console.error('Error inserting user:', err);
    }
}

async function GenreExists(genre) {
    const query = 'SELECT 1 FROM genre WHERE name = $1';
    try {
        const result = await pool.query(query, [genre]);
        return result.rows.length > 0;
    } catch (err) {
        console.error('Error checking parfum:', err);
        throw err;
    }
}

module.exports = {
    createGenre,
    GenreExists
};