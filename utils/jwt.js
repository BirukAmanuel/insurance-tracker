const jwt = require('jsonwebtoken');

const secret = 'your_jwt_secret'; // use env var in production

exports.signToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: '1d' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, secret);
};
