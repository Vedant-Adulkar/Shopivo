import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainLayout } from "../layouts/MainLayout";
import { ProductGrid } from "../components/products/ProductGrid";
import { EmptyState } from "../components/products/EmptyState";
import {
    fetchProducts,
    selectFilteredProducts,
    selectProductsLoading,
    selectSearchQuery,
} from "../store/slices/productsSlice";

/**
 * Home page - displays all products with search
 */
const Home = () => {
    const dispatch = useDispatch();
    const filteredProducts = useSelector(selectFilteredProducts);
    const loading = useSelector(selectProductsLoading);
    const searchQuery = useSelector(selectSearchQuery);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <MainLayout showSearch={true}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white">
                        {searchQuery ? "Search Results" : "All Products"}
                    </h1>
                    <p className="mt-2 text-slate-400">
                        {searchQuery
                            ? `Showing results for "${searchQuery}"`
                            : "Discover our amazing collection"}
                    </p>
                </div>

                {/* Products */}
                {filteredProducts.length === 0 && !loading ? (
                    <EmptyState searchQuery={searchQuery} />
                ) : (
                    <ProductGrid products={filteredProducts} loading={loading} />
                )}
            </div>
        </MainLayout>
    );
};

export default Home;
