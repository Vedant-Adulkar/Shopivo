import apiClient from "./auth";

/**
 * Fetch all products with optional search and filters
 */
export const fetchProducts = async (searchQuery = "", filters = {}) => {
    const params = {};

    if (searchQuery) {
        params.search = searchQuery;
    }

    if (filters.categories && filters.categories.length > 0) {
        params.categories = filters.categories;
    }

    if (filters.minPrice) {
        params.minPrice = filters.minPrice;
    }

    if (filters.maxPrice) {
        params.maxPrice = filters.maxPrice;
    }

    if (filters.brands && filters.brands.length > 0) {
        params.brands = filters.brands;
    }

    if (filters.tags && filters.tags.length > 0) {
        params.tags = filters.tags;
    }

    const response = await apiClient.get("/api/products", {
        params,
        paramsSerializer: {
            indexes: null, // This ensures arrays are serialized as ?categories=value1&categories=value2
        }
    });
    return response.data;
};

/**
 * Fetch single product by ID
 */
export const fetchProductById = async (id) => {
    const response = await apiClient.get(`/api/products/${id}`);
    return response.data;
};

/**
 * Create new product (Admin only)
 */
export const createProduct = async (productData) => {
    const response = await apiClient.post("/api/products", productData);
    return response.data;
};

/**
 * Update product (Admin only)
 */
export const updateProduct = async (id, productData) => {
    const response = await apiClient.put(`/api/products/${id}`, productData);
    return response.data;
};

/**
 * Delete product (Admin only)
 */
export const deleteProduct = async (id) => {
    const response = await apiClient.delete(`/api/products/${id}`);
    return response.data;
};

/**
 * Fetch recommended products based on shared categories
 */
export const fetchRecommendedProducts = async (productId) => {
    const response = await apiClient.get(`/api/products/${productId}/recommendations`);
    return response.data;
};
