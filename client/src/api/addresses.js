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
 * Create a new address
 */
export const createAddress = async (addressData) => {
    const response = await apiClient.post("/api/addresses", addressData, getAuthHeaders());
    return response.data;
};

/**
 * Get user's addresses
 */
export const getUserAddresses = async () => {
    const response = await apiClient.get("/api/addresses", getAuthHeaders());
    return response.data;
};

/**
 * Update address
 */
export const updateAddress = async (id, addressData) => {
    const response = await apiClient.patch(`/api/addresses/${id}`, addressData, getAuthHeaders());
    return response.data;
};

/**
 * Delete address
 */
export const deleteAddress = async (id) => {
    const response = await apiClient.delete(`/api/addresses/${id}`, getAuthHeaders());
    return response.data;
};

/**
 * Set address as default
 */
export const setDefaultAddress = async (id) => {
    const response = await apiClient.patch(`/api/addresses/${id}/default`, {}, getAuthHeaders());
    return response.data;
};
