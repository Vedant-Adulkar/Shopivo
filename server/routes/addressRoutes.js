const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const addressController = require("../controllers/addressController");

// All routes require authentication
router.post("/", authenticate, addressController.createAddress);
router.get("/", authenticate, addressController.getUserAddresses);
router.patch("/:id", authenticate, addressController.updateAddress);
router.delete("/:id", authenticate, addressController.deleteAddress);
router.patch("/:id/default", authenticate, addressController.setDefaultAddress);

module.exports = router;
