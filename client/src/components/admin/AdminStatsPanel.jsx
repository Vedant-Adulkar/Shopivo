import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAdminStats,
    selectInventoryStats,
    selectPurchaseStats,
    selectProductStats,
    selectStatsLoading,
    selectStatsError
} from "../../store/slices/statsSlice";
import { formatPrice } from "../../utils/formatters";

/**
 * Admin Statistics Panel Component
 * Displays key metrics for inventory, purchases, and products
 * Only visible to admin users
 */
const AdminStatsPanel = () => {
    const dispatch = useDispatch();
    const inventory = useSelector(selectInventoryStats);
    const purchases = useSelector(selectPurchaseStats);
    const products = useSelector(selectProductStats);
    const loading = useSelector(selectStatsLoading);
    const error = useSelector(selectStatsError);

    useEffect(() => {
        dispatch(fetchAdminStats());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="mb-8 rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
                    <p className="text-slate-300">Loading statistics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-6 backdrop-blur-sm">
                <p className="text-red-400">Failed to load statistics: {error}</p>
                <button
                    onClick={() => dispatch(fetchAdminStats())}
                    className="mt-3 rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-300 hover:bg-red-500/30"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="mb-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Store Statistics</h2>
                        <p className="text-sm text-slate-400">Admin Dashboard Overview</p>
                    </div>
                </div>
                <button
                    onClick={() => dispatch(fetchAdminStats())}
                    className="rounded-lg bg-white/5 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10"
                >
                    Refresh
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Products */}
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-slate-400">Total Products</p>
                        <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <p className="text-3xl font-bold text-white">{inventory.total}</p>
                    <p className="mt-1 text-xs text-slate-500">All products in catalog</p>
                </div>

                {/* Total Orders */}
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-green-500/10 to-green-600/5 p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-slate-400">Total Orders</p>
                        <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <p className="text-3xl font-bold text-white">{purchases.totalOrders}</p>
                    <p className="mt-1 text-xs text-slate-500">Completed purchases</p>
                </div>

                {/* Unique Customers */}
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-orange-500/10 to-orange-600/5 p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-slate-400">Customers</p>
                        <svg className="h-8 w-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <p className="text-3xl font-bold text-white">{purchases.uniqueCustomers}</p>
                    <p className="mt-1 text-xs text-slate-500">Active buyers</p>
                </div>
            </div>

            {/* Inventory Status */}
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-4">Inventory Status</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                            <svg className="h-6 w-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{inventory.inStock}</p>
                            <p className="text-sm text-slate-400">In Stock</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/20">
                            <svg className="h-6 w-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{inventory.outOfStock}</p>
                            <p className="text-sm text-slate-400">Out of Stock</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/20">
                            <svg className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{inventory.lowStock}</p>
                            <p className="text-sm text-slate-400">Low Stock</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Top Purchased */}
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4">Top Purchased Products</h3>
                    {products.topPurchased.length > 0 ? (
                        <div className="space-y-3">
                            {products.topPurchased.map((product, index) => (
                                <div key={product._id} className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-sm font-bold text-violet-300">
                                        {index + 1}
                                    </span>
                                    {product.image && (
                                        <img
                                            src={product.image.url}
                                            alt={product.name}
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-semibold text-white text-sm">{product.name}</p>
                                        <p className="text-xs text-slate-400">{product.totalQuantity} sold • {formatPrice(product.totalRevenue)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm">No purchase data available</p>
                    )}
                </div>

                {/* Top Reviewed */}
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4">Top Reviewed Products</h3>
                    {products.topReviewed.length > 0 ? (
                        <div className="space-y-3">
                            {products.topReviewed.map((product, index) => (
                                <div key={product._id} className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-sm font-bold text-yellow-300">
                                        {index + 1}
                                    </span>
                                    {product.images && product.images[0] && (
                                        <img
                                            src={product.images[0].url}
                                            alt={product.name}
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-semibold text-white text-sm">{product.name}</p>
                                        <p className="text-xs text-slate-400">
                                            {product.reviewCount} reviews • {product.averageRating?.toFixed(1)} rating
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm">No review data available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminStatsPanel;
