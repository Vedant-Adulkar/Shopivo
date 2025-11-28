const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} = require("../controllers/cartController");

// All cart routes require authentication
router.use(authenticate);

// Cart routes
router.route("/").get(getCart).post(addToCart).delete(clearCart);

router.route("/:itemId").put(updateCartItem).delete(removeFromCart);

module.exports = router;
