import { useState } from "react";
import { uploadImages as uploadImagesAPI } from "../api/upload";
import { validateImageFiles } from "../utils/validation";

/**
 * Custom hook for handling image uploads
 */
export const useImageUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState(null);

    const uploadImages = async (files) => {
        // Validate files
        const { isValid, errors } = validateImageFiles(files);
        if (!isValid) {
            setUploadError(errors.join(" "));
            return { success: false, error: errors.join(" ") };
        }

        setUploading(true);
        setUploadProgress(0);
        setUploadError(null);

        try {
            const data = await uploadImagesAPI(files, (progress) => {
                setUploadProgress(progress);
            });

            setUploading(false);
            setUploadProgress(100);
            return { success: true, images: data.images };
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to upload images";
            setUploadError(errorMessage);
            setUploading(false);
            setUploadProgress(0);
            return { success: false, error: errorMessage };
        }
    };

    const resetUpload = () => {
        setUploading(false);
        setUploadProgress(0);
        setUploadError(null);
    };

    return {
        uploading,
        uploadProgress,
        uploadError,
        uploadImages,
        resetUpload,
    };
};
