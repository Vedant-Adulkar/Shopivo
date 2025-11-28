import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    selectCartItems,
    selectCartLoading,
    selectCartTotals,
} from "../store/slices/cartSlice";
import { MainLayout } from "../layouts/MainLayout";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { formatPrice } from "../utils/formatters";
import { Toast } from "../components/ui/Toast";

/**
 * Cart page - displays cart items and checkout options
 */
const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const loading = useSelector(selectCartLoading);
    const { totalItems, totalPrice } = useSelector(selectCartTotals);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        try {
            await dispatch(updateCartItem({ itemId, quantity: newQuantity })).unwrap();
        } catch (error) {
            setToast({ type: "error", message: error || "Failed to update quantity" });
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await dispatch(removeFromCart(itemId)).unwrap();
            setToast({ type: "success", message: "Item removed from cart" });
        } catch (error) {
            setToast({ type: "error", message: error || "Failed to remove item" });
        }
    };

    const handleClearCart = async () => {
        if (window.confirm("Are you sure you want to clear your cart?")) {
            try {
                await dispatch(clearCart()).unwrap();
                setToast({ type: "success", message: "Cart cleared" });
            } catch (error) {
                setToast({ type: "error", message: error || "Failed to clear cart" });
            }
        }
    };

    if (loading && cartItems.length === 0) {
        return (
            <MainLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            </MainLayout>
        );
    }

    if (cartItems.length === 0) {
        return (
            <MainLayout>
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-800">
                            <svg
                                className="h-12 w-12 text-slate-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">Your Cart is Empty</h1>
                        <p className="text-slate-400 mb-8">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <button
                            onClick={() => navigate("/home")}
                            className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-white font-semibold hover:shadow-xl transition-all"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white">Shopping Cart</h1>
                        <p className="mt-2 text-slate-400">
                            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                        </p>
                    </div>
                    {cartItems.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10"
                        >
                            Clear Cart
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems
                            .filter((item) => item?.product) // Filter out items with missing product data
                            .map((item) => {
                                const primaryImage = item.product?.images?.find((img) => img?.isPrimary) || item.product?.images?.[0];
                                const maxQuantity = item.product?.stock?.trackInventory
                                    ? item.product.stock.quantity
                                    : 999;

                                return (
                                    <div
                                        key={item._id}
                                        className="flex gap-4 rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-4 backdrop-blur-sm"
                                    >
                                        {/* Product Image */}
                                        <div
                                            onClick={() => navigate(`/product/${item.product._id}`)}
                                            className="h-24 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-slate-800"
                                        >
                                            {primaryImage?.url ? (
                                                <img
                                                    src={primaryImage.url}
                                                    alt={item.product?.name || "Product"}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-slate-600">
                                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                                        {/* Product Info */}
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <h3
                                                    onClick={() => navigate(`/product/${item.product._id}`)}
                                                    className="cursor-pointer text-lg font-semibold text-white hover:text-violet-300 transition-colors"
                                                >
                                                    {item.product?.name || "Product"}
                                                </h3>
                                                {item.product?.brand && (
                                                    <p className="text-sm text-slate-400">{item.product.brand}</p>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-800 text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <span className="w-12 text-center text-white font-semibold">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                                        disabled={item.quantity >= maxQuantity}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-800 text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Price and Remove */}
                                                <div className="flex items-center gap-4">
                                                    <p className="text-xl font-bold text-violet-300">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                    <button
                                                        onClick={() => handleRemoveItem(item._id)}
                                                        className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-slate-300">
                                    <span>Subtotal ({totalItems} items)</span>
                                    <span className="font-semibold">{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="border-t border-white/10 pt-3">
                                    <div className="flex justify-between text-lg font-bold text-white">
                                        <span>Total</span>
                                        <span className="text-violet-300">{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/checkout")}
                                className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/50 mb-3"
                            >
                                Proceed to Checkout
                            </button>

                            <button
                                onClick={() => navigate("/home")}
                                className="w-full rounded-xl border border-white/10 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-white/5"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </MainLayout>
    );
};

export default Cart;
