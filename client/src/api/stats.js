import apiClient from "./auth";

/**
 * Get admin statistics
 */
export const getAdminStats = async () => {
    const response = await apiClient.get("/api/admin/stats");
    return response.data;
};
