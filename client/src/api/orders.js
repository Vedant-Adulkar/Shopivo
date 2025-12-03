import apiClient from "./auth";

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem("authToken");
};

// Create axios instance with auth header
const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${getAuthToken()}`,
    },
});

/**
 * Create a new order
 */
export const createOrder = async (orderData) => {
    const response = await apiClient.post("/api/orders", orderData, getAuthHeaders());
    return response.data;
};

/**
 * Get user's orders
 */
export const getUserOrders = async (page = 1, limit = 10) => {
    const response = await apiClient.get(`/api/orders?page=${page}&limit=${limit}`, getAuthHeaders());
    return response.data;
};

/**
 * Get single order by ID
 */
export const getOrderById = async (id) => {
    const response = await apiClient.get(`/api/orders/${id}`, getAuthHeaders());
    return response.data;
};

/**
 * Cancel order
 */
export const cancelOrder = async (id) => {
    const response = await apiClient.patch(`/api/orders/${id}/cancel`, {}, getAuthHeaders());
    return response.data;
};
