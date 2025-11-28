import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartItems, selectCartTotals } from "../store/slices/cartSlice";
import { MainLayout } from "../layouts/MainLayout";
import { formatPrice } from "../utils/formatters";

/**
 * Checkout page - placeholder for checkout functionality
 */
const Checkout = () => {
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const { totalItems, totalPrice } = useSelector(selectCartTotals);

    return (
        <MainLayout>
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/cart")}
                        className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Cart
                    </button>
                    <h1 className="text-4xl font-bold text-white">Checkout</h1>
                </div>

                {/* Coming Soon Message */}
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-8 backdrop-blur-sm text-center mb-8">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/20">
                        <svg
                            className="h-10 w-10 text-violet-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Checkout Coming Soon</h2>
                    <p className="text-slate-400 mb-6">
                        We're working hard to bring you a seamless checkout experience. This feature will be available soon!
                    </p>
                </div>

                {/* Order Summary */}
                {cartItems.length > 0 && (
                    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm">
                        <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex justify-between text-slate-300">
                                    <span>
                                        {item.product.name} × {item.quantity}
                                    </span>
                                    <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <div className="flex justify-between text-sm text-slate-400 mb-2">
                                <span>Subtotal ({totalItems} items)</span>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-white">
                                <span>Total</span>
                                <span className="text-violet-300">{formatPrice(totalPrice)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex gap-4">
                    <button
                        onClick={() => navigate("/cart")}
                        className="flex-1 rounded-xl border border-white/10 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-white/5"
                    >
                        Back to Cart
                    </button>
                    <button
                        onClick={() => navigate("/home")}
                        className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/50"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </MainLayout>
    );
};

export default Checkout;
