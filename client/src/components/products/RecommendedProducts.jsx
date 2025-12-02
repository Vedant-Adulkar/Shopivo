import { useEffect, useState } from "react";
import { fetchRecommendedProducts } from "../../api/products";
import { ProductCard } from "./ProductCard";
import { LoadingSpinner } from "../ui/LoadingSpinner";

/**
 * Recommended Products Component - displays related products from same categories
 */
export const RecommendedProducts = ({ productId }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRecommendations = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchRecommendedProducts(productId);
                setRecommendations(data.products || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load recommendations");
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            loadRecommendations();
        }
    }, [productId]);

    // Don't render if loading or error or no recommendations
    if (loading) {
        return (
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-white mb-6">You May Also Like</h2>
                <div className="flex justify-center py-8">
                    <LoadingSpinner size="md" />
                </div>
            </div>
        );
    }

    if (error || !recommendations || recommendations.length === 0) {
        return null; // Don't show section if no recommendations
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">You May Also Like</h2>

            {/* Horizontal scrollable grid */}
            <div className="relative">
                <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-violet-500/50 scrollbar-track-slate-800">
                    <div className="flex gap-4 min-w-max">
                        {recommendations.map((product) => (
                            <div key={product._id} className="w-72 flex-shrink-0">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
