const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {createParfum, ParfumExists} = require('../base/createParfum');
const {isAuthenticated} = require('../middleware/auth');
const {isAdmin} = require('../middleware/admin');
const pool = require('../base/db');
router.use(bodyParser.json())
const cookieParser = require('cookie-parser');
router.use(cookieParser());


// General route to fetch all parfums
router.get('/', async (req, res) => {
    try {
        const parfums = await pool.query('SELECT * FROM parfums');
        res.json(parfums.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error fetching data');
    }
});

// Parameterized route to fetch a parfum by ID
router.get('/id/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const parfums = await pool.query('SELECT * FROM parfums WHERE id = $1', [id]);
        if (parfums.rows.length > 0) {
            res.json(parfums.rows);
        } else {
            res.status(404).send('Parfum not found');
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error fetching data');
    }
});

// Parameterized route to fetch parfums by genre
router.get('/genre/:genre', async (req, res) => {
    try {
        const genre = req.params.genre;
        const parfums = await pool.query('SELECT * FROM parfums WHERE genre = $1', [genre]);
        if (parfums.rows.length > 0) {
            res.json(parfums.rows);
        } else {
            res.status(404).send('No parfums found for this genre');
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error fetching data');
    }
});

// Parameterized route to fetch parfums by genre and the given ID
router.get('/product/:genre/:id', async (req, res) => {
    try {
        const genre = req.params.genre;
        const id = req.params.id;
        const parfums = await pool.query('SELECT * FROM parfums WHERE genre = $1 AND id = $2', [genre, id]);
        if (parfums.rows.length > 0) {
            res.json(parfums.rows);
        } else {
            res.status(404).send('No parfums found for this genre');
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error fetching data');
    }
});




router.post('/', [isAuthenticated, isAdmin], async (req, res) =>{
    const { name, price, old_price, details, rest, genre } = req.body; 

    try {
        const check = await ParfumExists(name);
        if (check) {
            return res.status(409).json({message: 'Duft existiert bereits!'});
        }

        await createParfum(name, price, old_price, details, rest, genre);
        res.status(201).json({message:'Duft wurde erfolgreich erstellt'});
    } catch (err) {
        console.error('Error in /parfum POST:', err);
        res.status(500).send('Internal server error');
    }
});


router.put('/:id', [isAuthenticated, isAdmin], async (req, res) => {
    const { id } = req.params;
    const { name, genre, price, old_price, rest, details } = req.body;
    let query = 'UPDATE parfums SET ';
    const params = [];
    let setParts = [];

    if (name !== undefined) {
        setParts.push(`name = $${setParts.length + 1}`);
        params.push(name);
    }

    if (genre !== undefined) {
        setParts.push(`genre = $${setParts.length + 1}`);
        params.push(genre);
    }

    if (price !== undefined) {
        setParts.push(`price = $${setParts.length + 1}`);
        params.push(price);
    }
    
    if (old_price !== undefined) {
        setParts.push(`old_price = $${setParts.length + 1}`);
        params.push(old_price);
    }

    if (rest !== undefined) {
        setParts.push(`rest = $${setParts.length + 1}`);
        params.push(rest);
    }

    if (details !== undefined) {
        setParts.push(`details = $${setParts.length + 1}`);
        params.push(details);
    }

    if (setParts.length === 0) {
        return res.status(400).send('No valid fields provided for update');
    }

    query += setParts.join(', ') + ` WHERE id = $${setParts.length + 1}`;
    params.push(id);

    try {
        const result = await pool.query(query, params);
        if (result.rowCount === 0) {
            return res.status(404).json({message:'Parfüm mit der angegebenen ID nicht gefunden.'});
        }

        res.json({message: 'Parfum erfolgreich aktualisiert'});
    } catch (err) {
        console.error('Error updating parfum:', err);
        res.status(500).send('Error updating parfum');
    }
});


router.delete('/:id', [isAuthenticated, isAdmin], async (req, res) =>{
    const {id} = req.params;
    try {
        
        const result = await pool.query('DELETE FROM parfums WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({message:'Mit der angegebenen ID wurde kein Parfüm gefunden.'});
        }

        
        res.json({message: 'Parfum erfolgreich gelöscht'});
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error deleting data');
    }
});


router.get('/total/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.query; 
    try {
        const result = await pool.query('SELECT * FROM parfums WHERE id = $1', [id]);

        if (result.rowCount === 0) { 
            return res.status(404).send('No parfum found with the given ID.');
        }

        const price = result.rows[0].price;
        const x = await calculateTotal(quantity, price);
        res.json({ price: x });
        
    } catch (error) {
        console.error('Error fetching total:', error);
        res.status(500).send('Server error');
    }
});


async function calculateTotal(quantity, price){
    return quantity * price;
}


module.exports = router;