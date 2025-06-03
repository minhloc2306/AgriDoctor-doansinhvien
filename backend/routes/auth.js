const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { check } = require('express-validator');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
        // Add role validation if needed, e.g., only admin can create admin
    ],
    authController.registerUser
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    authController.loginUser
);

// @route   GET api/auth
// @desc    Get logged in user data (using token)
// @access  Private
router.get('/', authMiddleware, authController.getLoggedInUser);

module.exports = router; 