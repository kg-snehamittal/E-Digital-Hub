const User = require('../models/User');

/**
 * @desc    Get all users (Admin only, password hashes excluded)
 * @route   GET /api/users
 * @access  Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ date: -1 });
    const formattedUsers = users.map((u) => ({
      uid: String(u._id),
      name: u.name,
      email: u.email,
      role: u.role,
      date: u.date,
    }));
    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message || 'Server error fetching users' });
  }
};

module.exports = {
  getAllUsers,
};
