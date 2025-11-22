import { formatPrice, getStockStatus } from "../../utils/formatters";
import { Button } from "../ui/Button";

/**
 * Product table component for admin panel
 */
export const ProductTable = ({ products, onEdit, onDelete, loading }) => {
    if (products.length === 0) {
        return (
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-12 text-center backdrop-blur-sm">
                <p className="text-slate-400">No products yet. Create your first product!</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-white/10 bg-slate-900/70">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                                Image
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                                Price
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                                Stock
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                                Category
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {products.map((product) => {
                            const stockStatus = getStockStatus(product.stock?.quantity || 0);
                            const primaryImage =
                                product.images?.find((img) => img.isPrimary) || product.images?.[0];

                            return (
                                <tr
                                    key={product._id}
                                    className="transition-colors hover:bg-slate-800/50"
                                >
                                    <td className="px-4 py-3">
                                        <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-800">
                                            {primaryImage ? (
                                                <img
                                                    src={primaryImage.url}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-slate-600">
                                                    <svg
                                                        className="h-6 w-6"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-white line-clamp-1">{product.name}</p>
                                        <p className="text-xs text-slate-400">{product.sku}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-violet-300">
                                            {formatPrice(product.price)}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center gap-1 text-sm font-semibold ${stockStatus.color}`}
                                        >
                                            <span className="h-2 w-2 rounded-full bg-current"></span>
                                            {product.stock?.quantity || 0}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-slate-300">
                                            {product.category?.name || product.category || "N/A"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(product)}
                                                disabled={loading}
                                                className="rounded-lg bg-violet-500/20 p-2 text-violet-300 transition-colors hover:bg-violet-500/30 disabled:opacity-50"
                                                title="Edit"
                                            >
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => onDelete(product._id)}
                                                disabled={loading}
                                                className="rounded-lg bg-red-500/20 p-2 text-red-300 transition-colors hover:bg-red-500/30 disabled:opacity-50"
                                                title="Delete"
                                            >
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
