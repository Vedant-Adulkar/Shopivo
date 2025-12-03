const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Profile routes
router.get("/profile", authenticate, userController.getProfile);
router.put("/profile", authenticate, userController.updateProfile);
router.post("/profile/avatar", authenticate, upload.single("avatar"), userController.uploadAvatar);

module.exports = router;
