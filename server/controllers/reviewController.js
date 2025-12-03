const Review = require("../models/Review");
const Product = require("../models/Product");
const mongoose = require("mongoose");

exports.createReview = async (req, res) => {
    try {
        const { product, rating, comment, title } = req.body;

        // Validation
        if (!product) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }
        if (!comment || comment.trim().length < 10) {
            return res.status(400).json({ message: "Comment must be at least 10 characters" });
        }

        console.log("Creating review:", { userId: req.user._id, product, rating, commentLength: comment.length });

        const existingReview = await Review.findOne({ user: req.user._id, product });

        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this product" });
        }

        const review = await Review.create({
            user: req.user._id,
            product,
            rating,
            comment,
            title: title || "",
            isApproved: true
        });

        await updateProductRating(product);
        await review.populate("user", "name email");

        console.log("Review created successfully:", review._id);

        res.status(201).json({ message: "Review created successfully", review });
    } catch (error) {
        console.error("Create review error:", error);
        console.error("Error details:", { name: error.name, message: error.message, stack: error.stack });
        res.status(500).json({ message: "Failed to create review", error: error.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { rating, comment, title } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only edit your own reviews" });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        review.title = title !== undefined ? title : review.title;
        await review.save();

        await updateProductRating(review.product);
        await review.populate("user", "name email");

        res.json({ message: "Review updated successfully", review });
    } catch (error) {
        console.error("Update review error:", error);
        res.status(500).json({ message: "Failed to update review", error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You can only delete your own reviews" });
        }

        const productId = review.product;
        await Review.findByIdAndDelete(req.params.id);
        await updateProductRating(productId);

        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Delete review error:", error);
        res.status(500).json({ message: "Failed to delete review", error: error.message });
    }
};

exports.getProductReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const productObjectId = new mongoose.Types.ObjectId(req.params.productId);

        const reviews = await Review.find({ product: productObjectId, isApproved: true })
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Review.countDocuments({ product: productObjectId, isApproved: true });

        const ratingDistribution = await Review.aggregate([
            { $match: { product: productObjectId, isApproved: true } },
            { $group: { _id: "$rating", count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);

        res.json({
            reviews,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            ratingDistribution
        });
    } catch (error) {
        console.error("Get product reviews error:", error);
        res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
    }
};

exports.getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate("product", "name images price")
            .sort({ createdAt: -1 })
            .lean();

        res.json({ reviews });
    } catch (error) {
        console.error("Get user reviews error:", error);
        res.status(500).json({ message: "Failed to fetch user reviews", error: error.message });
    }
};

exports.getUserProductReview = async (req, res) => {
    try {
        const review = await Review.findOne({
            user: req.user._id,
            product: req.params.productId
        }).populate("user", "name email");

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json({ review });
    } catch (error) {
        console.error("Get user product review error:", error);
        res.status(500).json({ message: "Failed to fetch review", error: error.message });
    }
};

async function updateProductRating(productId) {
    try {
        const productObjectId = mongoose.Types.ObjectId.isValid(productId)
            ? new mongoose.Types.ObjectId(productId)
            : productId;

        const stats = await Review.aggregate([
            { $match: { product: productObjectId, isApproved: true } },
            { $group: { _id: "$product", averageRating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } }
        ]);

        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                averageRating: Math.round(stats[0].averageRating * 10) / 10,
                reviewCount: stats[0].reviewCount
            });
        } else {
            await Product.findByIdAndUpdate(productId, { averageRating: 0, reviewCount: 0 });
        }
    } catch (error) {
        console.error("Update product rating error:", error);
    }
}
