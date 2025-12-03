import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReview, updateReview, selectReviewsLoading, selectReviewsError } from "../../store/slices/reviewsSlice";

const ReviewForm = ({ productId, existingReview, onSuccess, onCancel }) => {
    const dispatch = useDispatch();
    const loading = useSelector(selectReviewsLoading);
    const error = useSelector(selectReviewsError);

    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState(existingReview?.comment || "");
    const [title, setTitle] = useState(existingReview?.title || "");

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment);
            setTitle(existingReview.title || "");
        }
    }, [existingReview]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert("Please select a rating");
            return;
        }

        if (comment.trim().length < 10) {
            alert("Review must be at least 10 characters");
            return;
        }

        try {
            if (existingReview) {
                console.log("[ReviewForm] Updating review:", existingReview._id);
                await dispatch(updateReview({ id: existingReview._id, reviewData: { rating, comment, title } })).unwrap();
                console.log("[ReviewForm] Review updated successfully, calling onSuccess");
            } else {
                console.log("[ReviewForm] Creating new review");
                await dispatch(createReview({ product: productId, rating, comment, title })).unwrap();
                console.log("[ReviewForm] Review created successfully, calling onSuccess");
            }
            onSuccess?.();
            console.log("[ReviewForm] onSuccess callback executed");
        } catch (err) {
            console.error("Review submission error:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4">
                {existingReview ? "Edit Your Review" : "Write a Review"}
            </h3>

            {error && (
                <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* Star Rating */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Rating *</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="text-3xl transition-all hover:scale-110"
                        >
                            <span className={`${(hoverRating || rating) >= star ? "text-yellow-400" : "text-slate-600"}`}>
                                ★
                            </span>
                        </button>
                    ))}
                    <span className="ml-2 text-slate-400 self-center">
                        {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "Select rating"}
                    </span>
                </div>
            </div>

            {/* Title (Optional) */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Title (Optional)</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    placeholder="Summarize your experience"
                    className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
            </div>

            {/* Comment */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Review *</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    minLength={10}
                    maxLength={1000}
                    rows={5}
                    placeholder="Share your experience with this product (minimum 10 characters)"
                    className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
                />
                <div className="mt-1 text-xs text-slate-500 text-right">
                    {comment.length}/1000 characters
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 rounded-lg border border-white/10 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-white/5 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading || rating === 0}
                    className="flex-1 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/50 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                    {loading ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
                </button>
            </div>
        </form>
    );
};

export default ReviewForm;
