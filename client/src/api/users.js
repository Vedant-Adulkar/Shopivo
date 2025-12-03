import apiClient from "./auth";

/**
 * Get current user profile
 */
export const getProfile = async () => {
    const response = await apiClient.get('/api/users/profile');
    return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (data) => {
    const response = await apiClient.put('/api/users/profile', data);
    return response.data;
};

/**
 * Upload user avatar
 */
export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post('/api/users/profile/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};
