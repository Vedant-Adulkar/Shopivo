const Cart = require("../models/Cart");
const Product = require("../models/Product");

/**
 * Get user's cart
 * @route GET /api/cart
 * @access Private
 */
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate({
            path: "items.product",
            select: "name price images stock brand",
        });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        // Calculate totals
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        res.status(200).json({
            success: true,
            cart: {
                ...cart.toObject(),
                totalItems,
                totalPrice,
            },
        });
    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart",
            error: error.message,
        });
    }
};

/**
 * Add item to cart
 * @route POST /api/cart
 * @access Private
 */
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        
        if (!product.isActive) {
            return res.status(400).json({
                success: false,
                message: "Product is not available",
            });
        }

        
        if (product.stock.trackInventory && product.stock.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock.quantity} items available in stock`,
            });
        }

        
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        
        const existingItemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
        
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;

            
            if (product.stock.trackInventory && product.stock.quantity < newQuantity) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot add more items. Only ${product.stock.quantity} available in stock`,
                });
            }

            cart.items[existingItemIndex].quantity = newQuantity;
            cart.items[existingItemIndex].price = product.price;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity,
                price: product.price,
            });
        }

        await cart.save();

        // Populate and return updated cart
        cart = await Cart.findById(cart._id).populate({
            path: "items.product",
            select: "name price images stock brand",
        });

        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        res.status(200).json({
            success: true,
            message: "Item added to cart",
            cart: {
                ...cart.toObject(),
                totalItems,
                totalPrice,
            },
        });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add item to cart",
            error: error.message,
        });
    }
};

/**
 * Update cart item quantity
 * @route PUT /api/cart/:itemId
 * @access Private
 */
exports.updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1",
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart",
            });
        }

        // Validate stock
        const product = await Product.findById(cart.items[itemIndex].product);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (product.stock.trackInventory && product.stock.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock.quantity} items available in stock`,
            });
        }

        // Update quantity and price
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = product.price;

        await cart.save();

        // Populate and return updated cart
        const updatedCart = await Cart.findById(cart._id).populate({
            path: "items.product",
            select: "name price images stock brand",
        });

        const totalItems = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: {
                ...updatedCart.toObject(),
                totalItems,
                totalPrice,
            },
        });
    } catch (error) {
        console.error("Update cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update cart",
            error: error.message,
        });
    }
};

/**
 * Remove item from cart
 * @route DELETE /api/cart/:itemId
 * @access Private
 */
exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
        await cart.save();

        // Populate and return updated cart
        const updatedCart = await Cart.findById(cart._id).populate({
            path: "items.product",
            select: "name price images stock brand",
        });

        const totalItems = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart: {
                ...updatedCart.toObject(),
                totalItems,
                totalPrice,
            },
        });
    } catch (error) {
        console.error("Remove from cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove item from cart",
            error: error.message,
        });
    }
};

/**
 * Clear cart
 * @route DELETE /api/cart
 * @access Private
 */
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared",
            cart: {
                ...cart.toObject(),
                totalItems: 0,
                totalPrice: 0,
            },
        });
    } catch (error) {
        console.error("Clear cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to clear cart",
            error: error.message,
        });
    }
};
