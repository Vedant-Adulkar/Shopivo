import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderById, cancelOrder, selectCurrentOrder, selectOrdersLoading } from "../store/slices/ordersSlice";
import { MainLayout } from "../layouts/MainLayout";

const OrderDetailsPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const order = useSelector(selectCurrentOrder);
    const loading = useSelector(selectOrdersLoading);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        dispatch(fetchOrderById(id));
        if (location.state?.orderPlaced) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
        }
    }, [dispatch, id, location.state]);

    const handleCancelOrder = async () => {
        setCancelling(true);
        try {
            await dispatch(cancelOrder(id)).unwrap();
            setShowCancelConfirm(false);
            // Refresh order to show updated status
            await dispatch(fetchOrderById(id));
        } catch (error) {
            alert(error || "Failed to cancel order");
        } finally {
            setCancelling(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
            shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
            delivered: "bg-green-500/20 text-green-400 border-green-500/30",
            cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
        };
        return colors[status] || colors.pending;
    };

    if (loading && !order) {
        return (
            <MainLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="text-white">Loading order details...</div>
                </div>
            </MainLayout>
        );
    }

    if (!order) {
        return (
            <MainLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="text-white">Order not found</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
                <div className="container mx-auto px-4 max-w-5xl">
                    {showSuccess && (
                        <div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-green-400">
                            ✓ Order placed successfully! Order number: {order.orderNumber}
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Order Details</h1>
                            <p className="text-slate-400 mt-1">Order #{order.orderNumber}</p>
                        </div>
                        <span className={`rounded-full border px-4 py-2 text-sm font-semibold ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Order Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm">
                                <h2 className="text-xl font-bold text-white mb-4">Order Items</h2>
                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 pb-4 border-b border-white/10 last:border-0">
                                            <img
                                                src={item.image || "/placeholder.png"}
                                                alt={item.name}
                                                className="w-20 h-20 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-white">{item.name}</p>
                                                <p className="text-sm text-slate-400 mt-1">Quantity: {item.quantity}</p>
                                                <p className="text-sm font-semibold text-violet-400 mt-1">₹{item.price}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-white">₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm">
                                <h2 className="text-xl font-bold text-white mb-4">Shipping Address</h2>
                                <div className="text-slate-300">
                                    <p className="font-semibold">{order.shippingAddress.fullName}</p>
                                    <p className="text-sm mt-2">
                                        {order.shippingAddress.addressLine1}
                                        {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                                    </p>
                                    <p className="text-sm">
                                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                                    </p>
                                    <p className="text-sm mt-2">Phone: {order.shippingAddress.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm sticky top-4">
                                <h2 className="text-xl font-bold text-white mb-4">Payment Summary</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-slate-300">
                                        <span>Subtotal</span>
                                        <span>₹{order.pricing.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>Tax</span>
                                        <span>₹{order.pricing.tax}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>Shipping</span>
                                        <span>{order.pricing.shipping === 0 ? "FREE" : `₹${order.pricing.shipping}`}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-white pt-3 border-t border-white/10">
                                        <span>Total</span>
                                        <span>₹{order.pricing.total}</span>
                                    </div>
                                    <div className="pt-3 border-t border-white/10">
                                        <p className="text-sm text-slate-400">Payment Method</p>
                                        <p className="text-white font-semibold capitalize">{order.paymentMethod}</p>
                                    </div>
                                </div>

                                {order.status === "pending" && (
                                    <div className="mt-6">
                                        {!showCancelConfirm ? (
                                            <button
                                                onClick={() => setShowCancelConfirm(true)}
                                                className="w-full rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/30"
                                            >
                                                Cancel Order
                                            </button>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-sm text-slate-300 text-center">Are you sure?</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleCancelOrder}
                                                        disabled={cancelling}
                                                        className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-600 disabled:opacity-50"
                                                    >
                                                        {cancelling ? "Cancelling..." : "Yes, Cancel"}
                                                    </button>
                                                    <button
                                                        onClick={() => setShowCancelConfirm(false)}
                                                        disabled={cancelling}
                                                        className="flex-1 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/5 disabled:opacity-50"
                                                    >
                                                        No, Keep
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={() => navigate("/orders")}
                                    className="mt-3 w-full rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/5"
                                >
                                    View All Orders
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default OrderDetailsPage;
