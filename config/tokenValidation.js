const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const fs = require('fs');
const path = require('path');


const tokenValidation = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Token required' });
  }
  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, SECRET_KEY, (err, data) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const users = JSON.parse(fs.readFileSync('users.json'));
    const user = users.find((u) => u.email === data.email);
    if (user) {
      req.user = user;
      next();
    }
  });
};


module.exports = { tokenValidation };