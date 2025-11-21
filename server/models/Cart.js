const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Quantity must be at least 1"],
                    default: 1,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                variant: {
                    type: Map,
                    of: String,
                    default: null,
                },
                addedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        coupon: {
            code: {
                type: String,
                trim: true,
                uppercase: true,
            },
            discount: {
                type: Number,
                min: 0,
                default: 0,
            },
            discountType: {
                type: String,
                enum: ["percentage", "fixed"],
                default: "percentage",
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Cart", cartSchema);
