const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id, role: 'STUDENT' }, process.env.JWT_SECRET, {
    // expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = generateToken;