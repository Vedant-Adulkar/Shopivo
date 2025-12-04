// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://shopivo.onrender.com";

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES = 10;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Product categories (temporary - will be replaced with dynamic categories)
export const PRODUCT_CATEGORIES = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports & Outdoors",
    "Books",
    "Toys & Games",
    "Health & Beauty",
    "Food & Beverages",
    "Automotive",
    "Other",
];

// Stock status thresholds
export const LOW_STOCK_THRESHOLD = 10;
export const OUT_OF_STOCK = 0;
