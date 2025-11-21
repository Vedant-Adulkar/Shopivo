const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot exceed 5"],
        },
        title: {
            type: String,
            trim: true,
            maxlength: [100, "Review title cannot exceed 100 characters"],
        },
        comment: {
            type: String,
            required: [true, "Review comment is required"],
            trim: true,
            minlength: [10, "Review must be at least 10 characters"],
            maxlength: [1000, "Review cannot exceed 1000 characters"],
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
            },
        ],
        verified: {
            type: Boolean,
            default: false,
        },
        helpful: {
            count: {
                type: Number,
                default: 0,
            },
            users: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
        },
        response: {
            comment: {
                type: String,
                maxlength: 500,
            },
            respondedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            respondedAt: {
                type: Date,
            },
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Review", reviewSchema);
