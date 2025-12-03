const express = require("express");
const router = express.Router();
const { authenticate, authorizeAdmin } = require("../middleware/authMiddleware");
const orderController = require("../controllers/orderController");

// User routes
router.post("/", authenticate, orderController.createOrder);
router.get("/", authenticate, orderController.getUserOrders);
router.get("/:id", authenticate, orderController.getOrderById);
router.patch("/:id/cancel", authenticate, orderController.cancelOrder);

// Admin routes
router.get("/admin/all", authenticate, authorizeAdmin, orderController.getAllOrders);
router.patch("/:id/status", authenticate, authorizeAdmin, orderController.updateOrderStatus);

module.exports = router;
