import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, selectReviewsLoading } from "../../store/slices/reviewsSlice";
import { useAuth } from "../../context/AuthContext";
import ReviewForm from "./ReviewForm";

const ReviewList = ({ reviews, productId, userReview, onReviewUpdate }) => {
    const dispatch = useDispatch();
    const loading = useSelector(selectReviewsLoading);
    const { user: currentUser } = useAuth();
    const [editingReview, setEditingReview] = useState(null);

    const handleDelete = async (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await dispatch(deleteReview(reviewId)).unwrap();
                onReviewUpdate?.();
            } catch (error) {
                console.error("Delete review error:", error);
            }
        }
    };

    const handleEditSuccess = () => {
        console.log("[ReviewList] handleEditSuccess called, closing edit form");
        setEditingReview(null);
        console.log("[ReviewList] Calling onReviewUpdate to refresh reviews");
        onReviewUpdate?.();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-lg ${star <= rating ? "text-yellow-400" : "text-slate-600"}`}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (reviews.length === 0) {
        return (
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-8 backdrop-blur-sm text-center">
                <p className="text-slate-400">No reviews yet. Be the first to review this product!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => {
                // Convert IDs to strings for reliable comparison
                const isOwnReview = currentUser && review.user && (
                    String(review.user._id) === String(currentUser._id) ||
                    String(review.user._id) === String(currentUser.id)
                );
                const isEditing = editingReview === review._id;

                console.log(`[ReviewList] Rendering review ${review._id}:`, {
                    isOwnReview,
                    isEditing,
                    editingReview,
                    reviewId: review._id
                });

                if (isEditing) {
                    return (
                        <ReviewForm
                            key={review._id}
                            productId={productId}
                            existingReview={review}
                            onSuccess={handleEditSuccess}
                            onCancel={() => setEditingReview(null)}
                        />
                    );
                }

                return (
                    <div
                        key={review._id}
                        className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white font-semibold">
                                        {review.user?.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{review.user?.name || "Anonymous"}</p>
                                        <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
                                    </div>
                                </div>
                                {renderStars(review.rating)}
                            </div>

                            {isOwnReview && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            console.log("[ReviewList] Edit clicked for review:", review._id);
                                            console.log("[ReviewList] Current user:", currentUser?._id);
                                            console.log("[ReviewList] Review owner:", review.user?._id);
                                            console.log("[ReviewList] Is own review:", isOwnReview);
                                            setEditingReview(review._id);
                                            console.log("[ReviewList] Set editingReview to:", review._id);
                                        }}
                                        disabled={loading}
                                        className="text-sm text-violet-400 hover:text-violet-300 transition-colors disabled:opacity-50"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        disabled={loading}
                                        className="text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        {review.title && <h4 className="font-semibold text-white mb-2">{review.title}</h4>}

                        <p className="text-slate-300 leading-relaxed">{review.comment}</p>

                        {review.verified && (
                            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Verified Purchase
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ReviewList;
