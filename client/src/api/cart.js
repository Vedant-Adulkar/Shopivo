import axios from "axios";

const API_URL = "http://localhost:5000/api/cart";

// Get auth token from localStorage
const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    return token;
};

// Create axios instance with auth header
const createAuthConfig = () => {
    const token = getAuthToken();
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

/**
 * Fetch user's cart
 */
export const fetchCart = async () => {
    const response = await axios.get(API_URL, createAuthConfig());
    return response.data;
};

/**
 * Add item to cart
 */
export const addToCart = async (productId, quantity = 1) => {
    const response = await axios.post(
        API_URL,
        { productId, quantity },
        createAuthConfig()
    );
    return response.data;
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (itemId, quantity) => {
    const response = await axios.put(
        `${API_URL}/${itemId}`,
        { quantity },
        createAuthConfig()
    );
    return response.data;
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (itemId) => {
    const response = await axios.delete(`${API_URL}/${itemId}`, createAuthConfig());
    return response.data;
};

/**
 * Clear entire cart
 */
export const clearCart = async () => {
    const response = await axios.delete(API_URL, createAuthConfig());
    return response.data;
};
