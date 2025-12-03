const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const {
    createReview,
    updateReview,
    deleteReview,
    getProductReviews,
    getUserReviews,
    getUserProductReview
} = require("../controllers/reviewController");

router.get("/product/:productId", getProductReviews);
router.post("/", authenticate, createReview);
router.put("/:id", authenticate, updateReview);
router.delete("/:id", authenticate, deleteReview);
router.get("/user", authenticate, getUserReviews);
router.get("/user/product/:productId", authenticate, getUserProductReview);

module.exports = router;
