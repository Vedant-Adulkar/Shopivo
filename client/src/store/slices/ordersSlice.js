import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as ordersAPI from "../../api/orders";

// Async thunks
export const createOrder = createAsyncThunk("orders/createOrder", async (orderData, { rejectWithValue }) => {
    try {
        const data = await ordersAPI.createOrder(orderData);
        return data.order;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create order");
    }
});

export const fetchUserOrders = createAsyncThunk("orders/fetchUserOrders", async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
        const data = await ordersAPI.getUserOrders(page, limit);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
});

export const fetchOrderById = createAsyncThunk("orders/fetchOrderById", async (id, { rejectWithValue }) => {
    try {
        const data = await ordersAPI.getOrderById(id);
        return data.order;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch order");
    }
});

export const cancelOrder = createAsyncThunk("orders/cancelOrder", async (id, { rejectWithValue }) => {
    try {
        const data = await ordersAPI.cancelOrder(id);
        return data.order;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to cancel order");
    }
});

// Slice
const ordersSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        currentOrder: null,
        pagination: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
                state.orders.unshift(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch user orders
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch order by ID
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Cancel order
            .addCase(cancelOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
                const index = state.orders.findIndex((o) => o._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Selectors
export const selectOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersPagination = (state) => state.orders.pagination;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;

export const { clearCurrentOrder, clearError } = ordersSlice.actions;

export default ordersSlice.reducer;
