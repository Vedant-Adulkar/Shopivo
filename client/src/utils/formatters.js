/**
 * Format price to currency string
 */
export const formatPrice = (price) => {
    if (price === null || price === undefined) return "N/A";
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(price);
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

/**
 * Get stock status
 */
export const getStockStatus = (quantity) => {
    if (quantity === 0) {
        return { label: "Out of Stock", color: "text-red-500" };
    } else if (quantity <= 10) {
        return { label: "Low Stock", color: "text-yellow-500" };
    } else {
        return { label: "In Stock", color: "text-green-500" };
    }
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};
