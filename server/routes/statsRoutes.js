const express = require("express");
const router = express.Router();
const { authenticate, authorizeAdmin } = require("../middleware/authMiddleware");
const { getAdminStats } = require("../controllers/statsController");

// Admin statistics route
router.get("/stats", authenticate, authorizeAdmin, getAdminStats);

module.exports = router;
