const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', [authMiddleware, authMiddleware.isAdmin], userController.getAllUsers);

// @route   GET api/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private (Admin)
router.get('/:id', [authMiddleware, authMiddleware.isAdmin], userController.getUserById);

// @route   PUT api/users/:id
// @desc    Update user role or details (Admin only)
// @access  Private (Admin)
router.put('/:id', [authMiddleware, authMiddleware.isAdmin], userController.updateUser);

// @route   DELETE api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete('/:id', [authMiddleware, authMiddleware.isAdmin], userController.deleteUser);


module.exports = router; 