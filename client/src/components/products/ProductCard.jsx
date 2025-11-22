import { formatPrice, getStockStatus, truncateText } from "../../utils/formatters";

/**
 * Product card component
 */
export const ProductCard = ({ product }) => {
    const stockStatus = getStockStatus(product.stock?.quantity || 0);
    const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_20px_60px_rgba(139,92,246,0.3)]">
            {/* Product Image */}
            <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-slate-800">
                {primaryImage ? (
                    <img
                        src={primaryImage.url}
                        alt={primaryImage.alt || product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-600">
                        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}

                {/* Stock Badge */}
                <div className="absolute top-2 right-2">
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${stockStatus.label === "Out of Stock"
                                ? "bg-red-500/90 text-white"
                                : stockStatus.label === "Low Stock"
                                    ? "bg-yellow-500/90 text-slate-900"
                                    : "bg-green-500/90 text-white"
                            }`}
                    >
                        {stockStatus.label}
                    </span>
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white line-clamp-2">{product.name}</h3>

                {product.shortDescription && (
                    <p className="text-sm text-slate-400 line-clamp-2">
                        {truncateText(product.shortDescription, 80)}
                    </p>
                )}

                <div className="flex items-center justify-between pt-2">
                    <div>
                        <p className="text-2xl font-bold text-violet-300">{formatPrice(product.price)}</p>
                        {product.comparePrice && product.comparePrice > product.price && (
                            <p className="text-sm text-slate-500 line-through">
                                {formatPrice(product.comparePrice)}
                            </p>
                        )}
                    </div>

                    <button className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};
