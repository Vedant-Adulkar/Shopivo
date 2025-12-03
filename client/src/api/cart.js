import apiClient from "./auth";

/**
 * Fetch user's cart
 */
export const fetchCart = async () => {
    const response = await apiClient.get("/api/cart");
    return response.data;
};

/**
 * Add item to cart
 */
export const addToCart = async (productId, quantity = 1) => {
    const response = await apiClient.post("/api/cart", { productId, quantity });
    return response.data;
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (itemId, quantity) => {
    const response = await apiClient.put(`/api/cart/${itemId}`, { quantity });
    return response.data;
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (itemId) => {
    const response = await apiClient.delete(`/api/cart/${itemId}`);
    return response.data;
};

/**
 * Clear entire cart
 */
export const clearCart = async () => {
    const response = await apiClient.delete("/api/cart");
    return response.data;
};
