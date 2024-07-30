const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.email = decoded.email;
    req.roles = decoded.roles;
    req.group = decoded.group;
    next();
  } catch (error) {
    res.status(400).send({ error: 'Invalid token' });
  }
};

module.exports = auth;
