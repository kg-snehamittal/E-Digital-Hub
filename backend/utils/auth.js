const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const TOKEN_EXPIRY = '7d';

/**
 * Hash password with bcrypt
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Synchronous hash password helper for seeding
 */
const hashPasswordSync = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

/**
 * Compare plaintext password with stored bcrypt hash
 */
const verifyPassword = async (password, storedHash) => {
  if (!password || !storedHash) return false;
  return bcrypt.compare(password, storedHash);
};

/**
 * Synchronous password verification helper
 */
const verifyPasswordSync = (password, storedHash) => {
  if (!password || !storedHash) return false;
  return bcrypt.compareSync(password, storedHash);
};

/**
 * Generate a signed JWT token
 */
const signToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: TOKEN_EXPIRY });
};

/**
 * Verify and decode a JWT token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = {
  hashPassword,
  hashPasswordSync,
  verifyPassword,
  verifyPasswordSync,
  signToken,
  verifyToken,
};
