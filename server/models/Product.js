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
        costPrice: {
            type: Number,
            min: [0, "Cost price cannot be negative"],
            default: null,
        },
        categories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
            },
        ],
        subcategory: {
            type: String,
            default: null,
            trim: true,
        },
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
        barcode: {
            type: String,
            trim: true,
            default: null,
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
        variants: [
            {
                name: {
                    type: String,
                    required: true,
                },
                options: [
                    {
                        value: String,
                        priceAdjustment: {
                            type: Number,
                            default: 0,
                        },
                        sku: String,
                        stock: {
                            type: Number,
                            default: 0,
                        },
                    },
                ],
            },
        ],
        specifications: [
            {
                name: {
                    type: String,
                    required: true,
                },
                value: {
                    type: String,
                    required: true,
                },
            },
        ],
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        ratings: {
            average: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },
            count: {
                type: Number,
                default: 0,
            },
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
        weight: {
            value: {
                type: Number,
                min: 0,
            },
            unit: {
                type: String,
                enum: ["kg", "g", "lb", "oz"],
                default: "kg",
            },
        },
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
            unit: {
                type: String,
                enum: ["cm", "m", "in", "ft"],
                default: "cm",
            },
        },
        seo: {
            metaTitle: {
                type: String,
                maxlength: [60, "Meta title cannot exceed 60 characters"],
            },
            metaDescription: {
                type: String,
                maxlength: [160, "Meta description cannot exceed 160 characters"],
            },
            keywords: [String],
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        views: {
            type: Number,
            default: 0,
        },
        soldCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);
