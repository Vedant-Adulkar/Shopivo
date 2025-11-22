const express = require("express");
const { uploadImages } = require("../controllers/uploadController");
const { authenticate, authorizeAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Upload multiple images (admin only)
router.post(
    "/images",
    authenticate,
    authorizeAdmin,
    upload.array("images", 10), // Max 10 images
    uploadImages
);

module.exports = router;
