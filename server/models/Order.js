const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                image: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                variant: {
                    type: Map,
                    of: String,
                },
                seller: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    default: null,
                },
            },
        ],
        shippingAddress: {
            fullName: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
            addressLine1: {
                type: String,
                required: true,
            },
            addressLine2: {
                type: String,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            postalCode: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
                default: "India",
            },
        },
        billingAddress: {
            fullName: String,
            phone: String,
            addressLine1: String,
            addressLine2: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        },
        payment: {
            method: {
                type: String,
                required: true,
                enum: ["card", "upi", "netbanking", "wallet", "cod"],
            },
            status: {
                type: String,
                required: true,
                enum: ["pending", "completed", "failed", "refunded"],
                default: "pending",
            },
            transactionId: {
                type: String,
            },
            paidAt: {
                type: Date,
            },
        },
        pricing: {
            subtotal: {
                type: Number,
                required: true,
                min: 0,
            },
            discount: {
                type: Number,
                default: 0,
                min: 0,
            },
            shipping: {
                type: Number,
                default: 0,
                min: 0,
            },
            tax: {
                type: Number,
                default: 0,
                min: 0,
            },
            total: {
                type: Number,
                required: true,
                min: 0,
            },
        },
        coupon: {
            code: {
                type: String,
                uppercase: true,
            },
            discount: {
                type: Number,
                min: 0,
            },
        },
        status: {
            type: String,
            required: true,
            enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "out_for_delivery",
                "delivered",
                "cancelled",
                "returned",
                "refunded",
            ],
            default: "pending",
        },
        tracking: {
            carrier: {
                type: String,
            },
            trackingNumber: {
                type: String,
            },
            trackingUrl: {
                type: String,
            },
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    required: true,
                },
                note: {
                    type: String,
                },
                updatedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        notes: {
            customer: {
                type: String,
                maxlength: 500,
            },
            admin: {
                type: String,
                maxlength: 1000,
            },
        },
        deliveredAt: {
            type: Date,
        },
        cancelledAt: {
            type: Date,
        },
        cancellationReason: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);
