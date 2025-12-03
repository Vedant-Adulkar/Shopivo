const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// Generate unique order number
const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `ORD-${timestamp}-${random}`;
};

/**
 * Create a new order
 * POST /api/orders
 * Note: Transactions removed for standalone MongoDB compatibility
 */
exports.createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, pricing } = req.body;

        console.log("Creating order with data:", JSON.stringify({ items, shippingAddress, paymentMethod, pricing }, null, 2));

        // Validate required fields
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order must contain at least one item" });
        }

        if (!shippingAddress || !paymentMethod || !pricing) {
            return res.status(400).json({ message: "Missing required order information" });
        }

        // Validate stock and get product details
        const orderItems = [];
        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }

            // Check stock if tracking is enabled
            if (product.stock && product.stock.trackInventory) {
                if (product.stock.quantity < item.quantity) {
                    return res.status(400).json({
                        message: `Insufficient stock for ${product.name}. Available: ${product.stock.quantity}`,
                    });
                }

                // Reduce stock
                product.stock.quantity -= item.quantity;
                await product.save();
            }

            // Add item with product snapshot
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.images && product.images.length > 0 ? product.images[0].url : "https://via.placeholder.com/150",
            });
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            orderNumber: generateOrderNumber(),
            items: orderItems,
            shippingAddress,
            payment: {
                method: paymentMethod,
                status: "pending",
            },
            pricing,
            status: "pending",
            statusHistory: [
                {
                    status: "pending",
                    timestamp: new Date(),
                    note: "Order placed",
                },
            ],
        });

        console.log("Order created successfully:", order._id);

        res.status(201).json({
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        console.error("Create order error:", error);
        console.error("Error stack:", error.stack);

        // Return specific error messages
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                error: error.message,
                details: error.errors
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid ID format",
                error: error.message
            });
        }

        res.status(500).json({
            message: "Failed to create order",
            error: error.message
        });
    }
};

/**
 * Get user's orders
 * GET /api/orders
 */
exports.getUserOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Order.countDocuments({ user: req.user._id });

        res.json({
            orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get user orders error:", error);
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
};

/**
 * Get single order by ID
 * GET /api/orders/:id
 */
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("items.product", "name images").lean();

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Check authorization (user can only view their own orders, admin can view all)
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json({ order });
    } catch (error) {
        console.error("Get order by ID error:", error);
        res.status(500).json({ message: "Failed to fetch order", error: error.message });
    }
};

/**
 * Cancel order
 * PATCH /api/orders/:id/cancel
 * Note: Transactions removed for standalone MongoDB compatibility
 */
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Check authorization (user can only cancel their own orders, admin can cancel any)
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        // Check if order can be cancelled
        if (["shipped", "delivered", "cancelled"].includes(order.status)) {
            return res.status(400).json({ message: `Cannot cancel order with status: ${order.status}` });
        }

        // Restore stock
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product && product.stock && product.stock.trackInventory) {
                product.stock.quantity += item.quantity;
                await product.save();
            }
        }

        // Update order status
        order.status = "cancelled";
        order.statusHistory.push({
            status: "cancelled",
            timestamp: new Date(),
            note: "Cancelled by user",
        });

        await order.save();

        res.json({
            message: "Order cancelled successfully",
            order,
        });
    } catch (error) {
        console.error("Cancel order error:", error);
        res.status(500).json({ message: "Failed to cancel order", error: error.message });
    }
};

/**
 * Update order status (Admin only)
 * PATCH /api/orders/:id/status
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        order.status = status;
        order.statusHistory.push({
            status,
            timestamp: new Date(),
            note: note || `Status updated to ${status}`,
        });

        await order.save();

        res.json({
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        console.error("Update order status error:", error);
        res.status(500).json({ message: "Failed to update order status", error: error.message });
    }
};

/**
 * Get all orders (Admin only)
 * GET /api/orders/admin/all
 */
exports.getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status;

        const filter = {};
        if (status) {
            filter.status = status;
        }

        const orders = await Order.find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Order.countDocuments(filter);

        res.json({
            orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
};
