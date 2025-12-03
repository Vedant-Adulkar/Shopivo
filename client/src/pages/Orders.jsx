import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders, selectOrders, selectOrdersLoading } from "../store/slices/ordersSlice";
import { MainLayout } from "../layouts/MainLayout";

const Orders = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const orders = useSelector(selectOrders);
    const loading = useSelector(selectOrdersLoading);

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);

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

    if (loading && orders.length === 0) {
        return (
            <MainLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="text-white">Loading orders...</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

                    {orders.length === 0 ? (
                        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-12 backdrop-blur-sm text-center">
                            <p className="text-slate-400 text-lg mb-4">No orders yet</p>
                            <button
                                onClick={() => navigate("/home")}
                                className="rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/50"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    onClick={() => navigate(`/orders/${order._id}`)}
                                    className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm cursor-pointer transition-all hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-slate-400">Order #{order.orderNumber}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 mb-4">
                                        {order.items.slice(0, 3).map((item, index) => (
                                            <img
                                                key={index}
                                                src={item.image || "/placeholder.png"}
                                                alt={item.name}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 text-sm">
                                                +{order.items.length - 3}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <div>
                                            <p className="text-sm text-slate-400">Total Amount</p>
                                            <p className="text-lg font-bold text-white">₹{order.pricing.total}</p>
                                        </div>
                                        <button className="rounded-lg bg-violet-500/20 border border-violet-500/30 px-4 py-2 text-sm font-semibold text-violet-400 transition-all hover:bg-violet-500/30">
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Orders;
