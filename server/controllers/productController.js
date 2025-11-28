const Product = require("../models/Product");
const generateSlug = require("../utils/generateSlug");

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
            query.$text = { $search: search };
        }

        const products = await Product.find(query)
            .sort(search ? { score: { $meta: "textScore" }, createdAt: -1 } : { createdAt: -1 })
            .select(search ? { score: { $meta: "textScore" } } : {});

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

        // Filter out internal/admin-only fields for customer-facing response
        const customerVisibleProduct = {
            _id: product._id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            shortDescription: product.shortDescription,
            price: product.price,
            comparePrice: product.comparePrice,
            categories: product.categories,
            brand: product.brand,
            sku: product.sku,
            images: product.images,
            stock: product.stock,
            tags: product.tags,
            isFeatured: product.isFeatured,
            isNewArrival: product.isNewArrival,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };

        res.status(200).json({
            message: "Product fetched successfully.",
            product: customerVisibleProduct,
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
            categories,
            brand,
            sku,
            images,
            stock,
            tags,
            isFeatured,
            isNewArrival,
        } = req.body;

        // Validate required fields
        if (!name || !description || !price) {
            return res.status(400).json({
                message: "Name, description, and price are required.",
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
            categories: categories || [],
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
