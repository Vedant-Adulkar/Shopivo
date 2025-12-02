import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as productsAPI from "../../api/products";

// Async thunks
export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async ({ searchQuery = "", filters = {} } = {}, { rejectWithValue }) => {
        try {
            const data = await productsAPI.fetchProducts(searchQuery, filters);
            return data.products;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch products"
            );
        }
    }
);

export const createProduct = createAsyncThunk(
    "products/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const data = await productsAPI.createProduct(productData);
            return data.product;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create product"
            );
        }
    }
);

export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const data = await productsAPI.updateProduct(id, productData);
            return data.product;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update product"
            );
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            await productsAPI.deleteProduct(id);
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete product"
            );
        }
    }
);

// Slice
const productsSlice = createSlice({
    name: "products",
    initialState: {
        items: [],
        loading: false,
        error: null,
        searchQuery: "",
        filters: {
            categories: [],
            minPrice: "",
            maxPrice: "",
            brands: [],
            tags: [],
        },
    },
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        toggleCategoryFilter: (state, action) => {
            const category = action.payload;
            const index = state.filters.categories.indexOf(category);
            if (index > -1) {
                state.filters.categories.splice(index, 1);
            } else {
                state.filters.categories.push(category);
            }
        },
        setPriceRange: (state, action) => {
            state.filters.minPrice = action.payload.minPrice || "";
            state.filters.maxPrice = action.payload.maxPrice || "";
        },
        toggleBrandFilter: (state, action) => {
            const brand = action.payload;
            const index = state.filters.brands.indexOf(brand);
            if (index > -1) {
                state.filters.brands.splice(index, 1);
            } else {
                state.filters.brands.push(brand);
            }
        },
        toggleTagFilter: (state, action) => {
            const tag = action.payload;
            const index = state.filters.tags.indexOf(tag);
            if (index > -1) {
                state.filters.tags.splice(index, 1);
            } else {
                state.filters.tags.push(tag);
            }
        },
        clearFilters: (state) => {
            state.filters = {
                categories: [],
                minPrice: "",
                maxPrice: "",
                brands: [],
                tags: [],
            };
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create product
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex((p) => p._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete product
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((p) => p._id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Selectors
export const selectAllProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectSearchQuery = (state) => state.products.searchQuery;
export const selectFilters = (state) => state.products.filters;

// Return products from Redux store (already filtered by backend)
export const selectFilteredProducts = (state) => state.products.items;

// Get unique filter options from all products
export const selectAvailableFilterOptions = (state) => {
    const products = state.products.items;

    const categories = [...new Set(products.flatMap(p => p.categories || []))].sort();
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
    const tags = [...new Set(products.flatMap(p => p.tags || []))].sort();

    return { categories, brands, tags };
};

// Get active filter count
export const selectActiveFilterCount = (state) => {
    const { categories, brands, tags, minPrice, maxPrice } = state.products.filters;
    let count = 0;

    if (categories.length > 0) count += categories.length;
    if (brands.length > 0) count += brands.length;
    if (tags.length > 0) count += tags.length;
    if (minPrice || maxPrice) count += 1;

    return count;
};

export const {
    setSearchQuery,
    setFilters,
    toggleCategoryFilter,
    setPriceRange,
    toggleBrandFilter,
    toggleTagFilter,
    clearFilters,
    clearError,
} = productsSlice.actions;

export default productsSlice.reducer;
