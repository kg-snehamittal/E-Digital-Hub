const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', requireAdmin, getAllUsers);

module.exports = router;
