const Category = require("../models/Category");
const generateSlug = require("../utils/generateSlug");

/**
 * Get all categories
 */
exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ isActive: true })
            .populate("parent", "name slug")
            .sort({ displayOrder: 1, name: 1 });

        res.status(200).json({
            message: "Categories fetched successfully.",
            categories,
            count: categories.length,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single category by ID
 */
exports.getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id).populate("parent", "name slug");

        if (!category) {
            return res.status(404).json({ message: "Category not found." });
        }

        res.status(200).json({
            message: "Category fetched successfully.",
            category,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create new category (Admin only)
 */
exports.createCategory = async (req, res, next) => {
    try {
        const { name, description, parent, image, displayOrder } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required." });
        }

        const slug = generateSlug(name);

        // Check if category already exists
        const existingCategory = await Category.findOne({ slug });
        if (existingCategory) {
            return res.status(409).json({
                message: "A category with this name already exists.",
            });
        }

        const category = await Category.create({
            name,
            slug,
            description,
            parent: parent || null,
            image,
            displayOrder: displayOrder || 0,
        });

        const populatedCategory = await Category.findById(category._id).populate(
            "parent",
            "name slug"
        );

        res.status(201).json({
            message: "Category created successfully.",
            category: populatedCategory,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Category with this name already exists.",
            });
        }
        next(error);
    }
};

/**
 * Update category (Admin only)
 */
exports.updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // If name is being updated, regenerate slug
        if (updateData.name) {
            updateData.slug = generateSlug(updateData.name);
        }

        // Remove fields that shouldn't be updated directly
        delete updateData._id;
        delete updateData.createdAt;

        const category = await Category.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).populate("parent", "name slug");

        if (!category) {
            return res.status(404).json({ message: "Category not found." });
        }

        res.status(200).json({
            message: "Category updated successfully.",
            category,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Category with this name already exists.",
            });
        }
        next(error);
    }
};

/**
 * Delete category (Admin only) - Soft delete
 */
exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: "Category not found." });
        }

        res.status(200).json({
            message: "Category deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};
