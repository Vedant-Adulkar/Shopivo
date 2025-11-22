import { ProductCard } from "./ProductCard";
import { LoadingSpinner } from "../ui/LoadingSpinner";

/**
 * Product grid component with loading skeleton
 */
export const ProductGrid = ({ products, loading }) => {
    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};
