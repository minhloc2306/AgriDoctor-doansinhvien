const express = require('express');
const router = express.Router();
const diseaseController = require('../controllers/diseaseController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Image upload middleware
const { check } = require('express-validator');

// @route   POST api/diseases
// @desc    Add a new disease (Admin only)
// @access  Private (Admin)
router.post('/',
    [
        authMiddleware,         // Must be logged in
        authMiddleware.isAdmin, // Must be admin
        upload.array('images', 5), // Handle image uploads (field name 'images', max 5 files)
        [
            // Validation checks
            check('name', 'Name is required').not().isEmpty(),
            check('description', 'Description is required').not().isEmpty(),
            check('symptoms', 'Symptoms are required').not().isEmpty(),
            check('prevention', 'Prevention steps are required').not().isEmpty(),
            check('treatment', 'Treatment steps are required').not().isEmpty(),
            check('categoryId', 'Category ID is required').isMongoId()
        ]
    ],
    diseaseController.addDisease
);

// @route   GET api/diseases
// @desc    Get all diseases (publicly accessible)
// @access  Public
router.get('/', diseaseController.getAllDiseases);

// @route   GET api/diseases/search
// @desc    Search diseases by name, symptoms, category (publicly accessible)
// @access  Public
router.get('/search', diseaseController.searchDiseases);

// @route   GET api/diseases/:id
// @desc    Get disease by ID (publicly accessible)
// @access  Public
router.get('/:id', diseaseController.getDiseaseById);

// @route   PUT api/diseases/:id
// @desc    Update disease (Admin only)
// @access  Private (Admin)
router.put('/:id',
    [
        authMiddleware,
        authMiddleware.isAdmin,
        upload.array('images', 5), // Allow updating images
        check('categoryId', 'Invalid Category ID format').optional().isMongoId()
    ],
    diseaseController.updateDisease
);

// @route   DELETE api/diseases/:id
// @desc    Delete disease (Admin only)
// @access  Private (Admin)
router.delete('/:id',
    [authMiddleware, authMiddleware.isAdmin],
    diseaseController.deleteDisease
);

module.exports = router; 