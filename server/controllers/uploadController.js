const cloudinary = require("../config/cloudinary");

/**
 * Upload multiple images to Cloudinary
 */
exports.uploadImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No images provided." });
        }

        const uploadPromises = req.files.map((file) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "shopivo/products",
                        resource_type: "image",
                        transformation: [
                            { width: 1000, height: 1000, crop: "limit" },
                            { quality: "auto" },
                            { fetch_format: "auto" },
                        ],
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve({
                                url: result.secure_url,
                                publicId: result.public_id,
                            });
                        }
                    }
                );

                uploadStream.end(file.buffer);
            });
        });

        const uploadedImages = await Promise.all(uploadPromises);

        res.status(200).json({
            message: "Images uploaded successfully.",
            images: uploadedImages,
        });
    } catch (error) {
        console.error("Image upload error:", error);
        next(error);
    }
};
