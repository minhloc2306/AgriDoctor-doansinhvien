const Category = require('../models/Category');
const Disease = require('../models/Disease'); // Needed to check for dependencies
const { validationResult } = require('express-validator');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public (or Private if only needed by admin forms)
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 }); // Sort alphabetically
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Private/Admin
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Category not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Add a new category
// @route   POST /api/categories
// @access  Private/Admin
exports.addCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    try {
        // Check if category name already exists (case-insensitive check)
        let category = await Category.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
        if (category) {
            return res.status(400).json({ msg: 'Category with this name already exists' });
        }

        const newCategory = new Category({
            name,
            description,
            // createdBy: req.user.id // If tracking creator
        });

        category = await newCategory.save();
        res.status(201).json(category);

    } catch (err) {
        console.error(err.message);
        // Handle potential validation errors during save
        if (err.name === 'ValidationError') {
             // Extract messages from Mongoose validation errors
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ errors: messages });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
     const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    // Build category object
    const categoryFields = {};
    if (name) categoryFields.name = name;
    if (description !== undefined) categoryFields.description = description; // Allow empty description

    try {
        let category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        // Check if updated name conflicts with another existing category (case-insensitive)
        if (name && name.toLowerCase() !== category.name.toLowerCase()) {
            const existingCategory = await Category.findOne({
                 _id: { $ne: req.params.id }, // Exclude the current category
                 name: { $regex: `^${name}$`, $options: 'i' } 
            });
            if (existingCategory) {
                 return res.status(400).json({ msg: 'Another category with this name already exists' });
            }
        }

        category = await Category.findByIdAndUpdate(
            req.params.id,
            { $set: categoryFields },
            { new: true, runValidators: true } // Return updated doc, run schema validation
        );

        res.json(category);

    } catch (err) {
        console.error(err.message);
         if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Category not found' });
        }
        // Handle potential validation errors during update
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ errors: messages });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        // **Important Dependency Check:** Check if any diseases use this category
        const diseaseCount = await Disease.countDocuments({ category: req.params.id });
        if (diseaseCount > 0) {
            return res.status(400).json({ msg: `Không thể xóa danh mục. Danh mục này đang được gán cho ${diseaseCount} bệnh.` }); // Vietnamese error
        }

        await Category.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Category removed' });

    } catch (err) {
        console.error(err.message);
         if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Category not found' });
        }
        res.status(500).send('Server Error');
    }
}; 