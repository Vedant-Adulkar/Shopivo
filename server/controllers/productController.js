const Product = require("../models/Product");

/**
 * Generate slug from product name
 */
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

/**
 * Generate SKU if not provided
 */
const generateSKU = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SKU-${timestamp}-${random}`;
};

/**
 * Get all products with optional search
 */
exports.getAllProducts = async (req, res, next) => {
    try {
        const { search } = req.query;
        const query = { isActive: true };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } },
            ];
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Products fetched successfully.",
            products,
            count: products.length,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single product by ID
 */
exports.getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json({
            message: "Product fetched successfully.",
            product,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create new product (Admin only)
 */
exports.createProduct = async (req, res, next) => {
    try {
        const {
            name,
            description,
            shortDescription,
            price,
            comparePrice,
            category,
            brand,
            sku,
            images,
            stock,
            tags,
            isFeatured,
            isNewArrival,
        } = req.body;

        // Validate required fields
        if (!name || !description || !price || !category) {
            return res.status(400).json({
                message: "Name, description, price, and category are required.",
            });
        }

        // Generate slug and SKU
        const slug = generateSlug(name);
        const productSKU = sku || generateSKU();

        // Check if slug already exists
        const existingProduct = await Product.findOne({ slug });
        if (existingProduct) {
            return res.status(409).json({
                message: "A product with this name already exists.",
            });
        }

        // Create product
        const product = await Product.create({
            name,
            slug,
            description,
            shortDescription,
            price,
            comparePrice,
            category,
            brand,
            sku: productSKU,
            images: images || [],
            stock: {
                quantity: stock?.quantity || 0,
                lowStockThreshold: stock?.lowStockThreshold || 10,
                trackInventory: stock?.trackInventory !== false,
            },
            tags: tags || [],
            isFeatured: isFeatured || false,
            isNewArrival: isNewArrival || false,
            seller: req.user._id,
        });

        res.status(201).json({
            message: "Product created successfully.",
            product,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Product with this SKU already exists.",
            });
        }
        next(error);
    }
};

/**
 * Update product (Admin only)
 */
exports.updateProduct = async (req, res, next) => {
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
        delete updateData.seller;

        const product = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json({
            message: "Product updated successfully.",
            product,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Product with this name or SKU already exists.",
            });
        }
        next(error);
    }
};

/**
 * Delete product (Admin only) - Soft delete
 */
exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json({
            message: "Product deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};
