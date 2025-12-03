const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: [200, "Product name cannot exceed 200 characters"],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
            maxlength: [5000, "Description cannot exceed 5000 characters"],
        },
        shortDescription: {
            type: String,
            trim: true,
            maxlength: [500, "Short description cannot exceed 500 characters"],
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"],
        },
        comparePrice: {
            type: Number,
            min: [0, "Compare price cannot be negative"],
            default: null,
        },
        categories: [
            {
                type: String,
                trim: true,
            },
        ],
        brand: {
            type: String,
            trim: true,
            maxlength: [100, "Brand name cannot exceed 100 characters"],
        },
        sku: {
            type: String,
            required: [true, "SKU is required"],
            unique: true,
            trim: true,
            uppercase: true,
        },
        images: [
            {
                url: {
                    type: String,
                    required: true,
                },
                alt: {
                    type: String,
                    default: "",
                },
                isPrimary: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        stock: {
            quantity: {
                type: Number,
                required: true,
                min: [0, "Stock quantity cannot be negative"],
                default: 0,
            },
            lowStockThreshold: {
                type: Number,
                default: 10,
            },
            trackInventory: {
                type: Boolean,
                default: true,
            },
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isNewArrival: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Create text index for efficient search
productSchema.index({
    name: "text",
    description: "text",
    tags: "text",
});

module.exports = mongoose.model("Product", productSchema);
