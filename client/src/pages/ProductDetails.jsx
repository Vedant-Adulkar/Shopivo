import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../api/products";
import { addToCart } from "../store/slices/cartSlice";
import { fetchProductReviews, fetchUserProductReview, clearUserProductReview } from "../store/slices/reviewsSlice";
import { MainLayout } from "../layouts/MainLayout";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { formatPrice } from "../utils/formatters";
import { Toast } from "../components/ui/Toast";
import { RecommendedProducts } from "../components/products/RecommendedProducts";
import ReviewForm from "../components/reviews/ReviewForm";
import ReviewList from "../components/reviews/ReviewList";
import { useAuth } from "../context/AuthContext";

/**
 * Product Details Page - displays comprehensive product information
 */
const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [toast, setToast] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const { user, isAuthenticated } = useAuth();
    const reviews = useSelector((state) => state.reviews.productReviews);
    const userReview = useSelector((state) => state.reviews.userProductReview);
    const reviewsLoading = useSelector((state) => state.reviews.loading);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchProductById(id);
                setProduct(data.product);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductReviews({ productId: id, page: 1, limit: 10 }));
            if (isAuthenticated) {
                dispatch(fetchUserProductReview(id));
            }
        }
        return () => {
            dispatch(clearUserProductReview());
        };
    }, [id, dispatch, isAuthenticated]);

    const handleReviewSuccess = () => {
        setShowReviewForm(false);
        dispatch(fetchProductReviews({ productId: id, page: 1, limit: 10 }));
        dispatch(fetchUserProductReview(id));
        setToast({ type: "success", message: "Review submitted successfully!" });
    };

    const handleReviewUpdate = () => {
        dispatch(fetchProductReviews({ productId: id, page: 1, limit: 10 }));
        if (isAuthenticated) {
            dispatch(fetchUserProductReview(id));
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            </MainLayout>
        );
    }

    if (error || !product) {
        return (
            <MainLayout>
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">Product Not Found</h1>
                        <p className="text-slate-400 mb-8">{error || "The product you're looking for doesn't exist."}</p>
                        <button
                            onClick={() => navigate("/home")}
                            className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-white font-semibold hover:shadow-xl transition-all"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const displayImages = product.images?.length > 0 ? product.images : [{ url: "", alt: product.name }];

    return (
        <MainLayout>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/home")}
                    className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Image Gallery - Takes 2 columns */}
                    <div className="lg:col-span-2 space-y-3">
                        {/* Main Image */}
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-800 border border-white/10 max-w-md mx-auto lg:mx-0">
                            {displayImages[selectedImage]?.url ? (
                                <img
                                    src={displayImages[selectedImage].url}
                                    alt={displayImages[selectedImage].alt || product.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-600">
                                    <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {displayImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto lg:mx-0">
                                {displayImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${selectedImage === index
                                            ? "border-violet-500 shadow-lg shadow-violet-500/50"
                                            : "border-white/10 hover:border-violet-500/50"
                                            }`}
                                    >
                                        {image.url ? (
                                            <img
                                                src={image.url}
                                                alt={image.alt || `${product.name} ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-600">
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Information - Takes 3 columns */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Brand */}
                        {product.brand && (
                            <p className="text-xs font-semibold text-violet-400 uppercase tracking-wide">
                                {product.brand}
                            </p>
                        )}


                        {/* Product Name */}
                        <h1 className="text-3xl font-bold text-white leading-tight">{product.name}</h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <p className="text-4xl font-bold text-violet-300">{formatPrice(product.price)}</p>
                            {product.comparePrice && product.comparePrice > product.price && (
                                <div className="flex flex-col">
                                    <p className="text-lg text-slate-500 line-through">
                                        {formatPrice(product.comparePrice)}
                                    </p>
                                    <p className="text-xs font-semibold text-green-400">
                                        Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                                    </p>
                                </div>
                            )}
                        </div>


                        {/* Short Description */}
                        {product.shortDescription && (
                            <p className="text-base text-slate-300 leading-relaxed">{product.shortDescription}</p>
                        )}

                        {/* Categories */}
                        {product.categories && product.categories.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                                    Categories
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.categories.map((category, index) => (
                                        <span
                                            key={index}
                                            className="rounded-full bg-slate-800 border border-violet-500/30 px-3 py-1 text-xs text-violet-300"
                                        >
                                            {category.name || category}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="rounded-lg bg-slate-800/50 border border-white/10 px-2.5 py-1 text-xs text-slate-300"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stock Information */}
                        {product.stock && (
                            <div className="rounded-lg border border-white/10 bg-slate-800/50 p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-slate-400">Availability:</span>
                                    {product.stock.trackInventory ? (
                                        <span className={`text-sm font-bold ${product.stock.quantity > 0
                                            ? "text-green-400"
                                            : "text-red-400"
                                            }`}>
                                            {product.stock.quantity > 0
                                                ? "In Stock"
                                                : "Out of Stock"}
                                        </span>
                                    ) : (
                                        <span className="text-sm font-bold text-green-400">In Stock</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        {(!product.stock?.trackInventory || product.stock?.quantity > 0) && (
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-400">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-slate-800 text-white transition-colors hover:bg-slate-700"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 1;
                                            const maxQty = product.stock?.trackInventory ? product.stock.quantity : 999;
                                            setQuantity(Math.max(1, Math.min(val, maxQty)));
                                        }}
                                        min="1"
                                        max={product.stock?.trackInventory ? product.stock.quantity : 999}
                                        className="h-10 w-20 rounded-lg border border-white/10 bg-slate-800 text-center text-white focus:border-violet-500 focus:outline-none"
                                    />
                                    <button
                                        onClick={() => {
                                            const maxQty = product.stock?.trackInventory ? product.stock.quantity : 999;
                                            setQuantity(Math.min(maxQty, quantity + 1));
                                        }}
                                        disabled={product.stock?.trackInventory && quantity >= product.stock.quantity}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-slate-800 text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <button
                            onClick={async () => {
                                if (product.stock?.trackInventory && product.stock?.quantity < 1) {
                                    setToast({ type: "error", message: "Product is out of stock" });
                                    return;
                                }

                                setAddingToCart(true);
                                try {
                                    await dispatch(addToCart({ productId: product._id, quantity })).unwrap();
                                    setToast({ type: "success", message: `Added ${quantity} item(s) to cart!` });
                                } catch (error) {
                                    setToast({ type: "error", message: error || "Failed to add to cart" });
                                } finally {
                                    setAddingToCart(false);
                                }
                            }}
                            disabled={addingToCart || (product.stock?.trackInventory && product.stock?.quantity < 1)}
                            className={`w-full rounded-xl px-6 py-3 text-base font-semibold text-white shadow-lg transition-all ${product.stock?.trackInventory && product.stock?.quantity < 1
                                ? "bg-slate-600 cursor-not-allowed"
                                : addingToCart
                                    ? "bg-violet-400 cursor-wait"
                                    : "bg-gradient-to-r from-violet-500 to-indigo-500 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/50"
                                }`}
                        >
                            {addingToCart
                                ? "Adding to Cart..."
                                : product.stock?.trackInventory && product.stock?.quantity < 1
                                    ? "Out of Stock"
                                    : "Add to Cart"}
                        </button>
                    </div>
                </div>


                {/* Full Description */}
                {
                    product.description && (
                        <div className="mt-8 rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-white mb-3">Product Description</h2>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-line">{product.description}</p>
                        </div>
                    )
                }

                {/* Reviews Section */}
                <div className="mt-8 space-y-6">
                    {/* Reviews Header with Rating Summary */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Customer Reviews</h2>
                            {product.reviewCount > 0 && (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`text-xl ${star <= Math.round(product.averageRating)
                                                    ? "text-yellow-400"
                                                    : "text-slate-600"
                                                    }`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-lg font-semibold text-white">
                                        {product.averageRating?.toFixed(1) || "0.0"}
                                    </span>
                                    <span className="text-slate-400">
                                        ({product.reviewCount} {product.reviewCount === 1 ? "review" : "reviews"})
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Write Review Button */}
                        {isAuthenticated && !userReview && !showReviewForm && (
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/50"
                            >
                                Write a Review
                            </button>
                        )}
                    </div>

                    {/* Review Form - Only for new reviews */}
                    {isAuthenticated && showReviewForm && !userReview && (
                        <ReviewForm
                            productId={product._id}
                            existingReview={null}
                            onSuccess={handleReviewSuccess}
                            onCancel={() => setShowReviewForm(false)}
                        />
                    )}

                    {/* Login Prompt for Non-Authenticated Users */}
                    {!isAuthenticated && (
                        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm text-center">
                            <p className="text-slate-300 mb-4">
                                Please log in to write a review
                            </p>
                            <button
                                onClick={() => navigate("/login")}
                                className="rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/50"
                            >
                                Log In
                            </button>
                        </div>
                    )}

                    {/* Reviews List */}
                    {reviewsLoading ? (
                        <div className="flex justify-center py-8">
                            <LoadingSpinner size="md" />
                        </div>
                    ) : (
                        <ReviewList
                            reviews={reviews}
                            productId={product._id}
                            userReview={userReview}
                            onReviewUpdate={handleReviewUpdate}
                        />
                    )}
                </div>

                {/* Recommended Products */}
                <RecommendedProducts productId={product._id} />

            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </MainLayout>
    );
};

export default ProductDetails;
