import apiClient from "./auth";

// Create a review
export const createReview = async (reviewData) => {
    console.log("[Reviews API] Creating review with data:", reviewData);
    try {
        const response = await apiClient.post("/api/reviews", reviewData);
        console.log("[Reviews API] Review created successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("[Reviews API] Create review failed:", error.response?.data || error.message);
        throw error;
    }
};

// Update a review
export const updateReview = async (id, reviewData) => {
    const response = await apiClient.put(`/api/reviews/${id}`, reviewData);
    return response.data;
};

// Delete a review
export const deleteReview = async (id) => {
    const response = await apiClient.delete(`/api/reviews/${id}`);
    return response.data;
};

// Get product reviews
export const getProductReviews = async (productId, page = 1, limit = 10) => {
    const response = await apiClient.get(`/api/reviews/product/${productId}`, {
        params: { page, limit },
    });
    return response.data;
};

// Get user's reviews
export const getUserReviews = async () => {
    const response = await apiClient.get("/api/reviews/user");
    return response.data;
};

// Get user's review for a specific product
export const getUserProductReview = async (productId) => {
    const response = await apiClient.get(`/api/reviews/user/product/${productId}`);
    return response.data;
};
