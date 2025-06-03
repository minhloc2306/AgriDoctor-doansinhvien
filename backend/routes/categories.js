const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const { check, body } = require('express-validator');

// Validation middleware for category name
const validateCategoryName = [
    check('name', 'Tên danh mục là bắt buộc').not().isEmpty().trim()
];

// @route   GET api/categories
// @desc    Get all categories
// @access  Public (Adjust if needed)
router.get('/', categoryController.getAllCategories);

// @route   GET api/categories/:id
// @desc    Get category by ID
// @access  Private/Admin
router.get('/:id', [authMiddleware, authMiddleware.isAdmin], categoryController.getCategoryById);

// @route   POST api/categories
// @desc    Add a new category
// @access  Private/Admin
router.post('/',
    [
        authMiddleware,
        authMiddleware.isAdmin,
        validateCategoryName
    ],
    categoryController.addCategory
);

// @route   PUT api/categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put('/:id',
    [
        authMiddleware,
        authMiddleware.isAdmin,
        validateCategoryName // Also validate name on update
        // Optional: validation for description if needed
    ],
    categoryController.updateCategory
);

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete('/:id', [authMiddleware, authMiddleware.isAdmin], categoryController.deleteCategory);


module.exports = router; 