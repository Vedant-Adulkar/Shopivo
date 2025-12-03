const User = require("../models/User");

/**
 * Get current user profile
 * GET /api/users/profile
 */
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Failed to fetch profile", error: error.message });
    }
};

/**
 * Update user profile
 * PUT /api/users/profile
 */
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, avatar } = req.body;

        // Validate inputs
        if (name && (name.trim().length < 2 || name.trim().length > 100)) {
            return res.status(400).json({ message: "Name must be between 2 and 100 characters" });
        }

        // Validate Indian phone number format
        if (phone) {
            // Check if it starts with +91 and has exactly 10 digits after
            const indianPhoneRegex = /^\+91[0-9]{10}$/;
            if (!indianPhoneRegex.test(phone.trim())) {
                return res.status(400).json({
                    message: "Invalid phone number. Must be in format: +91XXXXXXXXXX (10 digits)"
                });
            }
        }

        // Build update object
        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (phone !== undefined) updateData.phone = phone.trim();
        if (avatar !== undefined) updateData.avatar = avatar;

        // Update user
        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
};

/**
 * Upload user avatar
 * POST /api/users/profile/avatar
 */
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // File is already uploaded to Cloudinary by multer middleware
        const avatarUrl = req.file.path;

        // Update user avatar
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: avatarUrl },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Avatar uploaded successfully",
            avatar: avatarUrl,
            user
        });
    } catch (error) {
        console.error("Upload avatar error:", error);
        res.status(500).json({ message: "Failed to upload avatar", error: error.message });
    }
};
