const jwt = require('jsonwebtoken');
require('dotenv').config();

function isAuthenticated(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({message: 'Access denied.', isAuthenticated: false});
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 
      next();
    }
    catch (ex) {
      res.status(400).json({message: 'Melde dich wieder an!', isAuthenticated: false});
    }
}

module.exports ={
  isAuthenticated
}