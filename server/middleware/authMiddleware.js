const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to authenticate user via JWT token
 */
exports.authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authentication required." });
        }

        const token = authHeader.substring(7);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || !user.isActive) {
            return res.status(401).json({ message: "Invalid or expired token." });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token." });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired." });
        }
        next(error);
    }
};

/**
 * Middleware to check if authenticated user is an admin
 */
exports.authorizeAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required." });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }

    next();
};
