import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "./constants";

/**
 * Validate product form data
 */
export const validateProductForm = (formData) => {
    const errors = {};

    if (!formData.name?.trim()) {
        errors.name = "Product name is required";
    } else if (formData.name.length > 200) {
        errors.name = "Product name must be less than 200 characters";
    }

    if (!formData.description?.trim()) {
        errors.description = "Description is required";
    } else if (formData.description.length > 5000) {
        errors.description = "Description must be less than 5000 characters";
    }

    if (!formData.price) {
        errors.price = "Price is required";
    } else if (formData.price <= 0) {
        errors.price = "Price must be greater than 0";
    }

    // Categories validation is optional - products can have 0 or more categories

    if (formData.stock?.quantity !== undefined && formData.stock.quantity < 0) {
        errors.stock = "Stock quantity cannot be negative";
    }

    // Images are optional - products can be created without images

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Validate image file
 */
export const validateImageFile = (file) => {
    const errors = [];

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type. Only JPEG, PNG, and WEBP are allowed.`);
    }

    if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File size exceeds 5MB limit.`);
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validate multiple image files
 */
export const validateImageFiles = (files) => {
    const allErrors = [];

    files.forEach((file) => {
        const { isValid, errors } = validateImageFile(file);
        if (!isValid) {
            allErrors.push(...errors);
        }
    });

    return {
        isValid: allErrors.length === 0,
        errors: allErrors,
    };
};
