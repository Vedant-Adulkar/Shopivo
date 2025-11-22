import apiClient from "./auth";

/**
 * Fetch all products with optional search
 */
export const fetchProducts = async (searchQuery = "") => {
    const params = searchQuery ? { search: searchQuery } : {};
    const response = await apiClient.get("/api/products", { params });
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
