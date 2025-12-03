import { useState, useEffect } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { ImageUpload } from "./ImageUpload";
import { validateProductForm } from "../../utils/validation";
import { PRODUCT_CATEGORIES } from "../../utils/constants";

/**
 * Product form component for creating/editing products
 */
export const ProductForm = ({ product, onSubmit, onCancel, loading }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        shortDescription: "",
        price: "",
        comparePrice: "",
        categories: [],
        brand: "",
        sku: "",
        images: [],
        stock: {
            quantity: 0,
            lowStockThreshold: 10,
        },
        tags: [],
        isFeatured: false,
        isNewArrival: false,
    });

    const [errors, setErrors] = useState({});
    const [tagInput, setTagInput] = useState("");

    // Populate form when editing
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                description: product.description || "",
                shortDescription: product.shortDescription || "",
                price: product.price || "",
                comparePrice: product.comparePrice || "",
                categories: product.categories?.map(cat => typeof cat === 'object' ? cat._id : cat) || [],
                brand: product.brand || "",
                sku: product.sku || "",
                images: product.images || [],
                stock: product.stock || { quantity: 0, lowStockThreshold: 10 },
                tags: product.tags || [],
                isFeatured: product.isFeatured || false,
                isNewArrival: product.isNewArrival || false,
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleStockChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            stock: {
                ...prev.stock,
                [name]: parseInt(value) || 0,
            },
        }));
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()],
            }));
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { isValid, errors: validationErrors } = validateProductForm(formData);
        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
                {product ? "Edit Product" : "Add New Product"}
            </h2>

            {/* Basic Info */}
            <div className="space-y-4">
                <Input
                    label="Product Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="Enter product name"
                />

                <Input
                    label="Short Description"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    placeholder="Brief product description"
                />

                <Input
                    label="Description *"
                    name="description"
                    type="textarea"
                    value={formData.description}
                    onChange={handleChange}
                    error={errors.description}
                    placeholder="Detailed product description"
                />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Price *"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    error={errors.price}
                    placeholder="0.00"
                />

                <Input
                    label="Compare Price"
                    name="comparePrice"
                    type="number"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={handleChange}
                    placeholder="0.00"
                />
            </div>

            {/* Categories & Brand */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                        Categories *
                    </label>
                    <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-sm max-h-[200px] overflow-y-auto">
                        <div className="space-y-2">
                            {PRODUCT_CATEGORIES.map((cat) => (
                                <label
                                    key={cat}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.categories.includes(cat)}
                                        onChange={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                categories: prev.categories.includes(cat)
                                                    ? prev.categories.filter(c => c !== cat)
                                                    : [...prev.categories, cat]
                                            }));
                                        }}
                                        className="h-4 w-4 rounded border-white/20 bg-slate-900/50 text-violet-500 focus:ring-2 focus:ring-violet-500/50"
                                    />
                                    <span className="text-sm text-slate-300">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {formData.categories.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {formData.categories.map((cat) => (
                                <span
                                    key={cat}
                                    className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-300"
                                >
                                    {cat}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                categories: prev.categories.filter(c => c !== cat)
                                            }));
                                        }}
                                        className="hover:text-white"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                    {errors.categories && <p className="mt-1 text-sm text-red-400">{errors.categories}</p>}
                </div>

                <Input
                    label="Brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Brand name"
                />
            </div>

            {/* SKU & Stock */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="SKU"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Auto-generated if empty"
                />

                <Input
                    label="Stock Quantity *"
                    name="quantity"
                    type="number"
                    value={formData.stock.quantity}
                    onChange={handleStockChange}
                    error={errors.stock}
                    placeholder="0"
                />
            </div>

            {/* Images */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Product Images *
                </label>
                <ImageUpload
                    images={formData.images}
                    onImagesChange={(images) => setFormData((prev) => ({ ...prev, images }))}
                    error={errors.images}
                />
            </div>

            {/* Tags */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">Tags</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                        placeholder="Add tag and press Enter"
                        className="flex-1 rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    />
                    <Button type="button" onClick={handleAddTag} variant="secondary" size="md">
                        Add
                    </Button>
                </div>
                {formData.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-300"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="hover:text-white"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-white/20 bg-slate-900/50 text-violet-500 focus:ring-2 focus:ring-violet-500/50"
                    />
                    Featured Product
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                        type="checkbox"
                        name="isNewArrival"
                        checked={formData.isNewArrival}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-white/20 bg-slate-900/50 text-violet-500 focus:ring-2 focus:ring-violet-500/50"
                    />
                    New Arrival
                </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <Button type="submit" variant="primary" loading={loading} className="flex-1">
                    {product ? "Update Product" : "Create Product"}
                </Button>
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
};
