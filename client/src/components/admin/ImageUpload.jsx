import { useState } from "react";
import { useImageUpload } from "../../hooks/useImageUpload";
import { MAX_FILES } from "../../utils/constants";

/**
 * Image upload component with drag-and-drop
 */
export const ImageUpload = ({ images, onImagesChange, error }) => {
    const [isDragging, setIsDragging] = useState(false);
    const { uploading, uploadProgress, uploadError, uploadImages } = useImageUpload();

    const handleFileSelect = async (files) => {
        if (files.length === 0) return;

        const fileArray = Array.from(files);
        if (fileArray.length + images.length > MAX_FILES) {
            alert(`Maximum ${MAX_FILES} images allowed`);
            return;
        }

        const result = await uploadImages(fileArray);
        if (result.success) {
            const newImages = result.images.map((img) => ({
                url: img.url,
                alt: "",
                isPrimary: images.length === 0, // First image is primary
            }));
            onImagesChange([...images, ...newImages]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        // If removed image was primary and there are other images, make first one primary
        if (images[index].isPrimary && newImages.length > 0) {
            newImages[0].isPrimary = true;
        }
        onImagesChange(newImages);
    };

    const handleSetPrimary = (index) => {
        const newImages = images.map((img, i) => ({
            ...img,
            isPrimary: i === index,
        }));
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all ${isDragging
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-white/20 bg-slate-900/50"
                    }`}
            >
                <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                    disabled={uploading}
                />

                <label
                    htmlFor="image-upload"
                    className="cursor-pointer"
                >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20">
                        <svg
                            className="h-8 w-8 text-violet-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    </div>
                    <p className="mb-2 text-sm font-semibold text-white">
                        {uploading ? "Uploading..." : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-slate-400">
                        PNG, JPG, WEBP up to 5MB (Max {MAX_FILES} images)
                    </p>
                </label>

                {uploading && (
                    <div className="mt-4">
                        <div className="mx-auto h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-700">
                            <div
                                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <p className="mt-2 text-sm text-violet-400">{uploadProgress}%</p>
                    </div>
                )}
            </div>

            {(error || uploadError) && (
                <p className="text-sm text-red-400">{error || uploadError}</p>
            )}

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-slate-800"
                        >
                            <img
                                src={image.url}
                                alt={image.alt || `Product image ${index + 1}`}
                                className="h-full w-full object-cover"
                            />

                            {/* Primary Badge */}
                            {image.isPrimary && (
                                <div className="absolute top-2 left-2">
                                    <span className="rounded-full bg-violet-500 px-2 py-1 text-xs font-semibold text-white">
                                        Primary
                                    </span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-950/80 opacity-0 transition-opacity group-hover:opacity-100">
                                {!image.isPrimary && (
                                    <button
                                        onClick={() => handleSetPrimary(index)}
                                        className="rounded-lg bg-violet-500 p-2 text-white transition-colors hover:bg-violet-600"
                                        title="Set as primary"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </button>
                                )}
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="rounded-lg bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                                    title="Remove"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
