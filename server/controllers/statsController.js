const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

/**
 * Get admin statistics
 * @route GET /api/admin/stats
 * @access Private/Admin
 */
exports.getAdminStats = async (req, res) => {
    try {
        // Inventory Metrics
        const totalProducts = await Product.countDocuments();
        const inStockProducts = await Product.countDocuments({
            "stock.trackInventory": true,
            "stock.quantity": { $gt: 0 }
        });
        const outOfStockProducts = await Product.countDocuments({
            "stock.trackInventory": true,
            "stock.quantity": 0
        });
        const lowStockProducts = await Product.countDocuments({
            "stock.trackInventory": true,
            "stock.quantity": { $gt: 0, $lt: 10 }
        });

        // Purchase Metrics
        const orderStats = await Order.aggregate([
            {
                $match: { status: { $ne: "cancelled" } }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$total" },
                    uniqueCustomers: { $addToSet: "$user" }
                }
            }
        ]);

        const purchaseMetrics = orderStats[0] || {
            totalOrders: 0,
            totalRevenue: 0,
            uniqueCustomers: []
        };

        const avgOrderValue = purchaseMetrics.totalOrders > 0
            ? purchaseMetrics.totalRevenue / purchaseMetrics.totalOrders
            : 0;

        // Top Purchased Products
        const topPurchased = await Order.aggregate([
            { $match: { status: { $ne: "cancelled" } } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: {
                        $sum: {
                            $multiply: ["$items.price", "$items.quantity"]
                        }
                    }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $project: {
                    _id: 1,
                    name: "$product.name",
                    image: { $arrayElemAt: ["$product.images", 0] },
                    totalQuantity: 1,
                    totalRevenue: 1
                }
            }
        ]);

        // Top Reviewed Products
        const topReviewed = await Product.find()
            .sort({ reviewCount: -1 })
            .limit(5)
            .select("name images reviewCount averageRating");

        // Products by Category
        const categoryDistribution = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Products by Brand
        const brandDistribution = await Product.aggregate([
            {
                $group: {
                    _id: "$brand",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({
            inventory: {
                total: totalProducts,
                inStock: inStockProducts,
                outOfStock: outOfStockProducts,
                lowStock: lowStockProducts
            },
            purchases: {
                totalOrders: purchaseMetrics.totalOrders,
                totalRevenue: purchaseMetrics.totalRevenue,
                uniqueCustomers: purchaseMetrics.uniqueCustomers.length,
                avgOrderValue: avgOrderValue
            },
            products: {
                topPurchased: topPurchased,
                topReviewed: topReviewed,
                byCategory: categoryDistribution,
                byBrand: brandDistribution
            }
        });
    } catch (error) {
        console.error("Get admin stats error:", error);
        res.status(500).json({ message: "Failed to fetch statistics", error: error.message });
    }
};
