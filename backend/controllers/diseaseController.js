const Disease = require('../models/Disease');
const Category = require('../models/Category'); // Import Category model
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Add a new disease (Admin only)
exports.addDisease = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If validation fails, remove uploaded files
        if (req.files) {
            req.files.forEach(file => fs.unlinkSync(file.path));
        }
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        name, description, symptoms, causes, prevention, treatment, categoryId
    } = req.body;

    // --- Start: New Category Validation ---
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
         if (req.files) req.files.forEach(file => fs.unlinkSync(file.path));
         return res.status(400).json({ msg: 'Invalid Category ID format' });
    }
    try {
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            if (req.files) req.files.forEach(file => fs.unlinkSync(file.path));
            return res.status(400).json({ msg: 'Category not found' });
        }
     // --- End: New Category Validation ---

        // Check if disease name already exists
        let disease = await Disease.findOne({ name });
        if (disease) {
            if (req.files) {
                req.files.forEach(file => fs.unlinkSync(file.path));
            }
            return res.status(400).json({ msg: 'Disease with this name already exists' });
        }

        const newDisease = new Disease({
            name,
            description,
            symptoms,
            causes,
            prevention,
            treatment,
            category: categoryId, // Assign the ObjectId
            createdBy: req.user.id, // Get user ID from auth middleware
            images: req.files ? req.files.map(file => `/uploads/${file.filename}`) : [] // Store relative paths
        });

        disease = await newDisease.save();
        // Populate category info before sending response
        disease = await disease.populate('category', 'name description'); 
        res.status(201).json(disease);

    } catch (err) {
        console.error(err.message);
        // Clean up uploaded files on error
        if (req.files) {
            req.files.forEach(file => fs.unlinkSync(file.path));
        }
        res.status(500).send('Server Error');
    }
};

// Get all diseases (Public)
exports.getAllDiseases = async (req, res) => {
    try {
        // Populate the category field to include name
        const diseases = await Disease.find()
                                    .populate('category', 'name') // Select only name from Category
                                    .sort({ createdAt: -1 });
        res.json(diseases);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get disease by ID (Public)
exports.getDiseaseById = async (req, res) => {
    try {
        const disease = await Disease.findById(req.params.id)
                                    .populate('category', 'name description') // Populate full category details
                                    .populate('createdBy', 'name'); // Optionally populate creator name

        if (!disease) {
            return res.status(404).json({ msg: 'Disease not found' });
        }
        res.json(disease);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Disease not found' });
        }
        res.status(500).send('Server Error');
    }
};

// Search diseases (Public)
exports.searchDiseases = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ msg: 'Search query is required' });
        }

        // Find matching category IDs first
        const matchingCategories = await Category.find({ name: { $regex: query, $options: 'i' } }).select('_id');
        const matchingCategoryIds = matchingCategories.map(cat => cat._id);

        // Case-insensitive search across multiple fields, including populated category name
        const diseases = await Disease.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { symptoms: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $in: matchingCategoryIds } } // Search by category ID
            ]
        }).populate('category', 'name'); // Populate category name for results

        res.json(diseases);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Update disease (Admin only)
exports.updateDisease = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If validation fails, remove uploaded files
        if (req.files) {
            req.files.forEach(file => fs.unlinkSync(file.path));
        }
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, symptoms, causes, prevention, treatment, categoryId, existingImages } = req.body;
    const newImageFiles = req.files;

    // Build disease object
    const diseaseFields = {};
    if (name) diseaseFields.name = name;
    if (description) diseaseFields.description = description;
    if (symptoms) diseaseFields.symptoms = symptoms;
    if (causes) diseaseFields.causes = causes;
    if (prevention) diseaseFields.prevention = prevention;
    if (treatment) diseaseFields.treatment = treatment;
    if (categoryId) diseaseFields.category = categoryId; // Update category reference
    diseaseFields.updatedAt = Date.now();

    try {
        let disease = await Disease.findById(req.params.id);
        if (!disease) {
            if (newImageFiles) newImageFiles.forEach(file => fs.unlinkSync(file.path));
            return res.status(404).json({ msg: 'Disease not found' });
        }

        // --- Start: New Category Validation (only if categoryId is provided) ---
        if (categoryId) {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                if (newImageFiles) newImageFiles.forEach(file => fs.unlinkSync(file.path));
                return res.status(400).json({ msg: 'Invalid Category ID format' });
            }
            const categoryExists = await Category.findById(categoryId);
            if (!categoryExists) {
                 if (newImageFiles) newImageFiles.forEach(file => fs.unlinkSync(file.path));
                return res.status(400).json({ msg: 'Category not found' });
            }
        }
        // --- End: New Category Validation ---

        // --- Image Handling --- 
        let finalImages = disease.images || [];

        // 1. Filter existing images based on what client sent back
        if (existingImages) {
            const imagesToKeep = Array.isArray(existingImages) ? existingImages : [existingImages]; 
            // Identify images to remove
            const imagesToRemove = finalImages.filter(img => !imagesToKeep.includes(img));
            // Delete removed images from filesystem
            imagesToRemove.forEach(imgPath => {
                const fullPath = path.join(__dirname, '..', imgPath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
            // Update finalImages array
            finalImages = finalImages.filter(img => imagesToKeep.includes(img));
        } else {
            // If existingImages not provided, assume all old images are removed
             disease.images.forEach(imgPath => {
                const fullPath = path.join(__dirname, '..', imgPath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
            finalImages = [];
        }

        // 2. Add new images
        if (newImageFiles && newImageFiles.length > 0) {
            const newImagePaths = newImageFiles.map(file => `/uploads/${file.filename}`);
            finalImages = [...finalImages, ...newImagePaths];
        }

        diseaseFields.images = finalImages;
        // --- End Image Handling ---

        // Check for name uniqueness if it's being changed
        if (name && name !== disease.name) {
            const existingDisease = await Disease.findOne({ name: name, _id: { $ne: req.params.id } });
            if (existingDisease) {
                 if (newImageFiles) newImageFiles.forEach(file => fs.unlinkSync(file.path));
                 return res.status(400).json({ msg: 'Disease with this name already exists' });
            }
        }

        let updatedDisease = await Disease.findByIdAndUpdate(
            req.params.id,
            { $set: diseaseFields },
            { new: true, runValidators: true } // Return the updated document and run validators
        );

         // Populate category info before sending response
        updatedDisease = await updatedDisease.populate('category', 'name description');

        res.json(updatedDisease);

    } catch (err) {
        console.error(err.message);
         // Clean up newly uploaded files on error
        if (newImageFiles) {
            newImageFiles.forEach(file => fs.unlinkSync(file.path));
        }
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Disease not found' });
        }
        // Handle potential validation errors during update
         if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ errors: messages });
        }
        res.status(500).send('Server Error');
    }
};

// Delete disease (Admin only)
exports.deleteDisease = async (req, res) => {
    try {
        const disease = await Disease.findById(req.params.id);

        if (!disease) {
            return res.status(404).json({ msg: 'Disease not found' });
        }

        // Delete associated images from filesystem
        if (disease.images && disease.images.length > 0) {
            disease.images.forEach(imgPath => {
                const fullPath = path.join(__dirname, '..', imgPath);
                // Check if file exists before trying to delete
                if (fs.existsSync(fullPath)) {
                    try {
                        fs.unlinkSync(fullPath);
                    } catch (unlinkErr) {
                        // Log error but continue deletion process
                        console.error(`Failed to delete image ${fullPath}:`, unlinkErr.message);
                    }
                }
            });
        }

        await Disease.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Disease removed' });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Disease not found' });
        }
        res.status(500).send('Server Error');
    }
}; 