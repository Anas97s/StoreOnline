const pool = require('../base/db');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function createUser(name, email, password, isAdmin) {
    const query = `
        INSERT INTO users (name, email, password, isAdmin)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    if(isAdmin == null){
        isAdmin = false;
    }
    try {
        const res = await pool.query(query, [name, email, password, isAdmin]);
        console.log('User created:', res.rows[0]);

        const token = await generateAuthToken(res.rows[0].id, res.rows[0].name, res.rows[0].isadmin);
        console.log('JWT Token:', token);
        return { user: res.rows[0], token: token };
    } catch (err) {
        console.error('Error inserting user:', err);
    }
}

async function generateAuthToken(userId, name_, isAdmin) {
    const token = jwt.sign(
        { id: userId, name: name_, isAdmin: isAdmin },
        process.env.JWT_SECRET,
        {expiresIn: '2h'}
    );
    return token;
}

async function emailExists(email) {
    const query = 'SELECT 1 FROM users WHERE email = $1';
    try {
        const result = await pool.query(query, [email]);
        return result.rows.length > 0;
    } catch (err) {
        console.error('Error checking email:', err);
        throw err;
    }
}

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).required().messages({
            'string.base': 'Der Name muss eine Zeichenkette sein.',
            'string.min': 'Der Name muss mindestens 3 Zeichen lang sein.',
            'string.empty': 'Der Name darf nicht leer sein.',
            'any.required': 'Der Name ist erforderlich.'
        }),
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
                     }),
        isAdmin: Joi.boolean()
    });

    return schema.validate(user);
}


module.exports = {
    createUser,
    emailExists,
    validateUser,
    generateAuthToken
};

