const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { getUserDetails } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', authenticateToken, getUserDetails);

module.exports = router;
                                                                                                                