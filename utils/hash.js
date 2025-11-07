const bcrypt = require('bcrypt');

exports.hashPassword = async (plainText) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainText, salt);
};

exports.comparePasswords = async (plainText, hashed) => {
  return await bcrypt.compare(plainText, hashed);
};
