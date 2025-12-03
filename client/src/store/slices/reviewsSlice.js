import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as reviewsAPI from "../../api/reviews";

// Async thunks
export const createReview = createAsyncThunk("reviews/createReview", async (reviewData, { rejectWithValue }) => {
    try {
        const data = await reviewsAPI.createReview(reviewData);
        return data.review;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create review");
    }
});

export const updateReview = createAsyncThunk("reviews/updateReview", async ({ id, reviewData }, { rejectWithValue }) => {
    try {
        const data = await reviewsAPI.updateReview(id, reviewData);
        return data.review;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update review");
    }
});

export const deleteReview = createAsyncThunk("reviews/deleteReview", async (id, { rejectWithValue }) => {
    try {
        await reviewsAPI.deleteReview(id);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete review");
    }
});

export const fetchProductReviews = createAsyncThunk("reviews/fetchProductReviews", async ({ productId, page, limit }, { rejectWithValue }) => {
    try {
        const data = await reviewsAPI.getProductReviews(productId, page, limit);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch reviews");
    }
});

export const fetchUserReviews = createAsyncThunk("reviews/fetchUserReviews", async (_, { rejectWithValue }) => {
    try {
        const data = await reviewsAPI.getUserReviews();
        return data.reviews;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch user reviews");
    }
});

export const fetchUserProductReview = createAsyncThunk("reviews/fetchUserProductReview", async (productId, { rejectWithValue }) => {
    try {
        const data = await reviewsAPI.getUserProductReview(productId);
        return data.review;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Review not found");
    }
});

// Slice
const reviewsSlice = createSlice({
    name: "reviews",
    initialState: {
        productReviews: [],
        userReviews: [],
        userProductReview: null,
        ratingDistribution: [],
        pagination: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearUserProductReview: (state) => {
            state.userProductReview = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create review
            .addCase(createReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.loading = false;
                state.productReviews.unshift(action.payload);
                state.userProductReview = action.payload;
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update review
            .addCase(updateReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.productReviews.findIndex((r) => r._id === action.payload._id);
                if (index !== -1) {
                    state.productReviews[index] = action.payload;
                }
                state.userProductReview = action.payload;
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete review
            .addCase(deleteReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.loading = false;
                state.productReviews = state.productReviews.filter((r) => r._id !== action.payload);
                state.userProductReview = null;
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch product reviews
            .addCase(fetchProductReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.productReviews = action.payload.reviews;
                state.pagination = action.payload.pagination;
                state.ratingDistribution = action.payload.ratingDistribution;
            })
            .addCase(fetchProductReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch user reviews
            .addCase(fetchUserReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.userReviews = action.payload;
            })
            .addCase(fetchUserReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch user product review
            .addCase(fetchUserProductReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProductReview.fulfilled, (state, action) => {
                state.loading = false;
                state.userProductReview = action.payload;
            })
            .addCase(fetchUserProductReview.rejected, (state, action) => {
                state.loading = false;
                state.userProductReview = null;
                state.error = null; // Don't show error if user hasn't reviewed yet
            });
    },
});

// Selectors
export const selectProductReviews = (state) => state.reviews.productReviews;
export const selectUserReviews = (state) => state.reviews.userReviews;
export const selectUserProductReview = (state) => state.reviews.userProductReview;
export const selectRatingDistribution = (state) => state.reviews.ratingDistribution;
export const selectReviewsPagination = (state) => state.reviews.pagination;
export const selectReviewsLoading = (state) => state.reviews.loading;
export const selectReviewsError = (state) => state.reviews.error;

export const { clearError, clearUserProductReview } = reviewsSlice.actions;

export default reviewsSlice.reducer;
