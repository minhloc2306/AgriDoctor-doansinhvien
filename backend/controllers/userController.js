const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get user by ID (Admin only)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
};

// Update user (Admin only - e.g., change role)
exports.updateUser = async (req, res) => {
    const { name, email, role, password } = req.body; // Allow updating name, email, role, potentially password

    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email; // Add validation for email uniqueness if changed
    if (role) userFields.role = role;

    try {
        let user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Optional: Handle password update separately if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            userFields.password = await bcrypt.hash(password, salt);
        }

        user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: userFields },
            { new: true } // Return the updated document
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        // Add specific error handling e.g., for duplicate email if updated
        res.status(500).send('Server Error');
    }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Add checks here if you need to prevent deletion of certain users (e.g., the last admin)

        await User.findByIdAndDelete(req.params.id);

        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
}; 