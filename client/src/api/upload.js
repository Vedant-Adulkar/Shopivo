import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://shopivo.onrender.com";

/**
 * Upload images to Cloudinary via backend
 */
export const uploadImages = async (files, onProgress) => {
    const formData = new FormData();

    // Append all files to form data
    files.forEach((file) => {
        formData.append("images", file);
    });

    const token = localStorage.getItem("authToken");

    const response = await axios.post(`${API_BASE_URL}/api/upload/images`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                onProgress(percentCompleted);
            }
        },
    });

    return response.data;
};
