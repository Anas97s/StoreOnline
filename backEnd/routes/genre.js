const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {createGenre, GenreExists} = require('../base/createGenre');
const pool = require('../base/db');
router.use(bodyParser.json())

router.get('/', async (req, res) =>{
    try{
        const genres = await pool.query('SELECT * FROM genre');
        res.json(genres.rows);
    }catch (err){
        console.error('Error executing query', err.stack);
        res.status(500).send('Error fetching data');
    }
});

router.post('/', async (req, res) =>{
    const { name } = req.body; 

    try {
        const check = await GenreExists(name);
        if (check) {
            return res.status(409).send('Genre is already exists');
        }

        await createGenre(name);
        res.status(201).send('Genre created successfully');
    } catch (err) {
        console.error('Error in /genre POST:', err);
        res.status(500).send('Internal server error');
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name} = req.body;
    let query = 'UPDATE genre SET ';
    const params = [];
    let setParts = [];

    if (name !== undefined) {
        setParts.push(`name = $${setParts.length + 1}`);
        params.push(name);
    }

   
    if (setParts.length === 0) {
        return res.status(400).send('No valid fields provided for update');
    }

    query += setParts.join(', ') + ` WHERE id = $${setParts.length + 1}`;
    params.push(id);

    try {
        const result = await pool.query(query, params);
        if (result.rowCount === 0) {
            return res.status(404).send('Genre not found with the given ID.');
        }

        res.send('Genre updated successfully');
    } catch (err) {
        console.error('Error updating Genre:', err);
        res.status(500).send('Error updating Genre');
    }
});

router.delete('/:id', async (req, res) =>{
    const {id} = req.params;
    try {
        
        const result = await pool.query('DELETE FROM genre WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('No genre found with the given ID.');
        }

        
        res.send('genre deleted successfully');
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error deleting data');
    }
});

module.exports = router;