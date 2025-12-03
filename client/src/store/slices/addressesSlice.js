import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as addressesAPI from "../../api/addresses";

// Async thunks
export const createAddress = createAsyncThunk("addresses/createAddress", async (addressData, { rejectWithValue }) => {
    try {
        const data = await addressesAPI.createAddress(addressData);
        return data.address;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create address");
    }
});

export const fetchAddresses = createAsyncThunk("addresses/fetchAddresses", async (_, { rejectWithValue }) => {
    try {
        const data = await addressesAPI.getUserAddresses();
        return data.addresses;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch addresses");
    }
});

export const updateAddress = createAsyncThunk("addresses/updateAddress", async ({ id, addressData }, { rejectWithValue }) => {
    try {
        const data = await addressesAPI.updateAddress(id, addressData);
        return data.address;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update address");
    }
});

export const deleteAddress = createAsyncThunk("addresses/deleteAddress", async (id, { rejectWithValue }) => {
    try {
        await addressesAPI.deleteAddress(id);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete address");
    }
});

export const setDefaultAddress = createAsyncThunk("addresses/setDefaultAddress", async (id, { rejectWithValue }) => {
    try {
        const data = await addressesAPI.setDefaultAddress(id);
        return data.address;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to set default address");
    }
});

// Slice
const addressesSlice = createSlice({
    name: "addresses",
    initialState: {
        addresses: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create address
            .addCase(createAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses.unshift(action.payload);
                // Sort to keep default address first
                state.addresses.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
            })
            .addCase(createAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch addresses
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update address
            .addCase(updateAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.addresses.findIndex((a) => a._id === action.payload._id);
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete address
            .addCase(deleteAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = state.addresses.filter((a) => a._id !== action.payload);
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Set default address
            .addCase(setDefaultAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setDefaultAddress.fulfilled, (state, action) => {
                state.loading = false;
                // Unset all other defaults
                state.addresses.forEach((a) => {
                    a.isDefault = a._id === action.payload._id;
                });
                // Sort to keep default address first
                state.addresses.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
            })
            .addCase(setDefaultAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Selectors
export const selectAddresses = (state) => state.addresses.addresses;
export const selectAddressesLoading = (state) => state.addresses.loading;
export const selectAddressesError = (state) => state.addresses.error;

export const { clearError } = addressesSlice.actions;

export default addressesSlice.reducer;
