import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as statsAPI from "../../api/stats";

// Async thunk
export const fetchAdminStats = createAsyncThunk(
    "stats/fetchAdminStats",
    async (_, { rejectWithValue }) => {
        try {
            const data = await statsAPI.getAdminStats();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch statistics");
        }
    }
);

// Slice
const statsSlice = createSlice({
    name: "stats",
    initialState: {
        inventory: {
            total: 0,
            inStock: 0,
            outOfStock: 0,
            lowStock: 0
        },
        purchases: {
            totalOrders: 0,
            totalRevenue: 0,
            uniqueCustomers: 0,
            avgOrderValue: 0
        },
        products: {
            topPurchased: [],
            topReviewed: [],
            byCategory: [],
            byBrand: []
        },
        loading: false,
        error: null,
        lastUpdated: null
    },
    reducers: {
        clearStats: (state) => {
            state.inventory = { total: 0, inStock: 0, outOfStock: 0, lowStock: 0 };
            state.purchases = { totalOrders: 0, totalRevenue: 0, uniqueCustomers: 0, avgOrderValue: 0 };
            state.products = { topPurchased: [], topReviewed: [], byCategory: [], byBrand: [] };
            state.error = null;
            state.lastUpdated = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminStats.fulfilled, (state, action) => {
                state.loading = false;
                state.inventory = action.payload.inventory;
                state.purchases = action.payload.purchases;
                state.products = action.payload.products;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchAdminStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Selectors
export const selectInventoryStats = (state) => state.stats.inventory;
export const selectPurchaseStats = (state) => state.stats.purchases;
export const selectProductStats = (state) => state.stats.products;
export const selectStatsLoading = (state) => state.stats.loading;
export const selectStatsError = (state) => state.stats.error;
export const selectLastUpdated = (state) => state.stats.lastUpdated;

export const { clearStats } = statsSlice.actions;

export default statsSlice.reducer;
