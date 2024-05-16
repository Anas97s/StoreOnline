const express = require('express');
const user = require('../routes/user');
const parfums = require('../routes/parfums');
const genre = require('../routes/genre');
const stripe = require('../routes/stripe');
const order = require('../routes/orders');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/user', user);
    app.use('/api/parfums', parfums);
    app.use('/api/genre', genre);
    app.use('/api/stripe', stripe);
    app.use('/api/orders', order);
}