const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {createUser, emailExists, validateUser, generateAuthToken} = require('../base/createUser');
const pool = require('../base/db');
const bcrypt = require('bcrypt');
const {isAuthenticated} = require('../middleware/auth');
router.use(bodyParser.json())
const Joi = require('joi');
const cookieParser = require('cookie-parser');
const { isAdmin } = require('../middleware/admin');
router.use(cookieParser());


// Middleware to log incoming requests
router.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.body);
    next();
  });

router.get('/', async (req, res) =>{
    try{
        const users = await pool.query('SELECT * FROM users');
        res.json(users.rows);
    }catch (err){
        console.error('Error executing query', err.stack);
        res.status(500).send('Error fetching data');
    }
});

router.get('/me', isAuthenticated, async (req, res) =>{
    const me = req.user.id;
    try{
        const users = await pool.query('SELECT * FROM users WHERE id = $1', [me]);
        res.json({id: users.rows[0].id, name: users.rows[0].name, email: users.rows[0].email, password: users.rows[0].password, isadmin: users.rows[0].isadmin});
    }catch (err){
        res.status(500).send('Error fetching data');
    }
});

router.post('/', async (req, res) =>{
    const { error } = validateUser(req.body);

    if (error){
        return res.status(400).json({message: error.details[0].message});
    } 

    const { name, email, password, isAdmin } = req.body; 

    //hashing password 
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);


    try {
        const check = await emailExists(email);
        if (check) {
            return res.status(409).json({message: 'Die E-Mail ist bereits registriert'});
        }

        await createUser(name, email, hashedPassword, isAdmin);
        res.status(201).json({message: 'Registrierung erfolgreich. Willkommen ' + name + '!'});
    } catch (err) {
        console.error('Error in /users POST:', err);
        res.status(500).json({message: 'Internal server error'});
    }
});


router.post('/login', async(req, res) =>{
    const { error } = validateReq(req.body);

    if (error){
        return res.status(400).json({message: error.details[0].message});
    } 

    const { email, password } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await pool.query(query, [email]);

        if (rows.length === 0) return res.status(400).json({message: 'Ungültige E-Mail oder Passwort.'});

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({message: 'Ungültige E-Mail oder Passwort.'});

        const token = await generateAuthToken(user.id, user.name, user.isadmin);
        // Set the JWT as a cookie in the response
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, 
            sameSite: 'Strict' 
        });

        res.status(200).json({message: "Willkommen " + user.name + "!", token: token});
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

router.post('/logout', isAuthenticated, (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        expires: new Date(0)
    });
    res.status(200).json({ message: "Du hast sich erfolgreich abgemeldet." });
});



router.delete('/:id', async (req, res) =>{
    const {id} = req.params;
    try {
        
        const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('No user found with the given ID.');
        }

        
        res.send('User deleted successfully');
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error deleting data');
    }
});


router.get('/auth/status', isAuthenticated, (req, res)=>{
    res.json({isAuthenticated: true });
});

router.get('/auth/admin/status', [isAuthenticated, isAdmin], (req, res)=>{
    res.json({isAuthenticated: true, isAdmin: true });
});

function validateReq(req){
    const schema = Joi.object({
        email: Joi.string().required().email().messages({
            'string.email': 'Geben Sie eine gültige E-Mail-Adresse ein.',
            'string.empty': 'E-Mail darf nicht leer sein.',
            'any.required': 'E-Mail ist erforderlich.'
        }),
        password: Joi.string().min(8).max(255)
                     .pattern(new RegExp('(?=.*[a-z])(?=.*[A-Z])'))
                     .required()
                     .messages({
                        'string.min': 'Das Passwort muss mindestens 8 Zeichen lang sein.',
                        'string.pattern.base': 'Das Passwort muss mindestens einen Großbuchstaben und einen Kleinbuchstaben enthalten.',
                        'string.empty': 'Passwort kann nicht leer sein.',
                        'any.required': 'Passwort ist erforderlich.'
                    })
      });

    return schema.validate(req);
}
module.exports = router;



