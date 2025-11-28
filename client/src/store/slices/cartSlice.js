import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartAPI from "../../api/cart";

// Async thunks
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const data = await cartAPI.fetchCart();
            return data.cart;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch cart"
            );
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, quantity = 1 }, { rejectWithValue }) => {
        try {
            const data = await cartAPI.addToCart(productId, quantity);
            return data.cart;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add item to cart"
            );
        }
    }
);

export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async ({ itemId, quantity }, { rejectWithValue }) => {
        try {
            const data = await cartAPI.updateCartItem(itemId, quantity);
            return data.cart;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update cart item"
            );
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (itemId, { rejectWithValue }) => {
        try {
            const data = await cartAPI.removeFromCart(itemId);
            return data.cart;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove item from cart"
            );
        }
    }
);

export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async (_, { rejectWithValue }) => {
        try {
            const data = await cartAPI.clearCart();
            return data.cart;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to clear cart"
            );
        }
    }
);

// Slice
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: false,
        error: null,
        totalItems: 0,
        totalPrice: 0,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items || [];
                state.totalItems = action.payload.totalItems || 0;
                state.totalPrice = action.payload.totalPrice || 0;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add to cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items || [];
                state.totalItems = action.payload.totalItems || 0;
                state.totalPrice = action.payload.totalPrice || 0;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update cart item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items || [];
                state.totalItems = action.payload.totalItems || 0;
                state.totalPrice = action.payload.totalPrice || 0;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove from cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items || [];
                state.totalItems = action.payload.totalItems || 0;
                state.totalPrice = action.payload.totalPrice || 0;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Clear cart
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = [];
                state.totalItems = 0;
                state.totalPrice = 0;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartTotals = (state) => ({
    totalItems: state.cart.totalItems,
    totalPrice: state.cart.totalPrice,
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
