import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainLayout } from "../layouts/MainLayout";
import { ProductGrid } from "../components/products/ProductGrid";
import { EmptyState } from "../components/products/EmptyState";
import { FilterSidebar } from "../components/products/FilterSidebar";
import {
    fetchProducts,
    selectFilteredProducts,
    selectProductsLoading,
    selectSearchQuery,
    selectFilters,
    selectActiveFilterCount,
} from "../store/slices/productsSlice";

/**
 * Home page - displays all products with search and filters
 */
const Home = () => {
    const dispatch = useDispatch();
    const filteredProducts = useSelector(selectFilteredProducts);
    const loading = useSelector(selectProductsLoading);
    const searchQuery = useSelector(selectSearchQuery);
    const filters = useSelector(selectFilters);
    const activeFilterCount = useSelector(selectActiveFilterCount);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <MainLayout showSearch={true}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header with Filter Toggle */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white">
                            {searchQuery ? "Search Results" : "All Products"}
                        </h1>
                        <p className="mt-2 text-slate-400">
                            {searchQuery
                                ? `Showing results for "${searchQuery}"`
                                : "Discover our amazing collection"}
                        </p>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg font-semibold hover:from-blue-800 hover:to-blue-700 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="ml-1 px-2 py-0.5 bg-white text-blue-900 text-xs font-bold rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Main Content with Sidebar */}
                <div className="flex gap-6">
                    {/* Filter Sidebar - Hidden on mobile unless toggled */}
                    <div className="hidden lg:block">
                        <FilterSidebar isOpen={true} onClose={() => { }} />
                    </div>

                    {/* Mobile Filter Sidebar */}
                    <div className="lg:hidden">
                        <FilterSidebar
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                        />
                    </div>

                    {/* Products */}
                    <div className="flex-1 min-w-0">
                        {filteredProducts.length === 0 && !loading ? (
                            <EmptyState searchQuery={searchQuery} />
                        ) : (
                            <ProductGrid products={filteredProducts} loading={loading} />
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Home;

