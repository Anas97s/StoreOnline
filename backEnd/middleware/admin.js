
function isAdmin(req, res, next) { 
  // 401 Unauthorized
  // 403 Forbidden 
  
  if (!req.user.isAdmin) return res.status(403).json({message: 'Access denied.', isAdmin: false});

  next();
}

module.exports={
  isAdmin
}