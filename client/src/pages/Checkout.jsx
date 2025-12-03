import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, selectCartTotals, clearCart } from "../store/slices/cartSlice";
import { createOrder } from "../store/slices/ordersSlice";
import { fetchAddresses, createAddress } from "../store/slices/addressesSlice";
import { selectAddresses, selectAddressesLoading } from "../store/slices/addressesSlice";
import { MainLayout } from "../layouts/MainLayout";
import AddressForm from "../components/addresses/AddressForm";

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const { totalPrice } = useSelector(selectCartTotals);
    const addresses = useSelector(selectAddresses);
    const addressesLoading = useSelector(selectAddressesLoading);

    const [step, setStep] = useState(1);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderError, setOrderError] = useState(null);

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate("/cart");
            return;
        }
        dispatch(fetchAddresses());
    }, [dispatch, cartItems.length, navigate]);

    useEffect(() => {
        if (addresses.length > 0 && !selectedAddress) {
            const defaultAddr = addresses.find((addr) => addr.isDefault);
            setSelectedAddress(defaultAddr || addresses[0]);
        }
    }, [addresses, selectedAddress]);

    const handleAddressSubmit = async (addressData) => {
        try {
            const result = await dispatch(createAddress(addressData)).unwrap();
            setSelectedAddress(result);
            setShowAddressForm(false);
        } catch (error) {
            console.error("Failed to create address:", error);
        }
    };

    const tax = totalPrice * 0.18; // 18% GST
    const shipping = totalPrice >= 500 ? 0 : 50;
    const total = totalPrice + tax + shipping;

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            setOrderError("Please select a delivery address");
            return;
        }

        try {
            setOrderLoading(true);
            setOrderError(null);

            const orderData = {
                items: cartItems.map((item) => ({
                    product: item.product._id,
                    quantity: item.quantity,
                })),
                shippingAddress: {
                    fullName: selectedAddress.fullName,
                    phone: selectedAddress.phone,
                    addressLine1: selectedAddress.addressLine1,
                    addressLine2: selectedAddress.addressLine2 || "",
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    postalCode: selectedAddress.postalCode,
                    country: selectedAddress.country || "India",
                },
                paymentMethod,
                pricing: {
                    subtotal: totalPrice,
                    tax,
                    shipping,
                    total,
                },
            };

            const order = await dispatch(createOrder(orderData)).unwrap();
            dispatch(clearCart());
            navigate(`/orders/${order._id}`, { state: { orderPlaced: true } });
        } catch (error) {
            setOrderError(error || "Failed to place order. Please try again.");
        } finally {
            setOrderLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
                <div className="container mx-auto px-4 max-w-7xl">
                    <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= s ? "bg-violet-500 text-white" : "bg-slate-800 text-slate-500"
                                        }`}
                                >
                                    {s}
                                </div>
                                {s < 3 && <div className={`w-24 h-1 ${step > s ? "bg-violet-500" : "bg-slate-800"}`} />}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Step 1: Address */}
                            {step === 1 && (
                                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm">
                                    <h2 className="text-2xl font-bold text-white mb-6">Delivery Address</h2>
                                    {showAddressForm ? (
                                        <AddressForm
                                            onSubmit={handleAddressSubmit}
                                            onCancel={() => setShowAddressForm(false)}
                                            loading={addressesLoading}
                                        />
                                    ) : (
                                        <>
                                            {addressesLoading ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                                                    <span className="ml-3 text-slate-400">Loading addresses...</span>
                                                </div>
                                            ) : addresses.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <p className="text-slate-400 mb-4">No saved addresses found</p>
                                                    <button
                                                        onClick={() => setShowAddressForm(true)}
                                                        className="rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/50"
                                                    >
                                                        Add Your First Address
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="space-y-3 mb-4">
                                                        {addresses.map((addr) => (
                                                            <label
                                                                key={addr._id}
                                                                className={`block cursor-pointer rounded-lg border p-4 transition-all ${selectedAddress?._id === addr._id
                                                                    ? "border-violet-500 bg-violet-500/10"
                                                                    : "border-white/10 bg-slate-900/50 hover:border-white/20"
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="address"
                                                                    checked={selectedAddress?._id === addr._id}
                                                                    onChange={() => setSelectedAddress(addr)}
                                                                    className="sr-only"
                                                                />
                                                                <div className="flex items-start justify-between">
                                                                    <div>
                                                                        <p className="font-semibold text-white">{addr.fullName}</p>
                                                                        <p className="text-sm text-slate-400 mt-1">
                                                                            {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                                                                            {addr.city}, {addr.state} - {addr.postalCode}
                                                                        </p>
                                                                        <p className="text-sm text-slate-400">Phone: {addr.phone}</p>
                                                                    </div>
                                                                    {addr.isDefault && (
                                                                        <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-400">
                                                                            Default
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    <button
                                                        onClick={() => setShowAddressForm(true)}
                                                        className="w-full rounded-lg border border-dashed border-white/20 px-4 py-3 text-sm font-semibold text-violet-400 transition-all hover:border-violet-500 hover:bg-violet-500/10"
                                                    >
                                                        + Add New Address
                                                    </button>
                                                    {selectedAddress && (
                                                        <button
                                                            onClick={() => setStep(2)}
                                                            className="mt-6 w-full rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/50"
                                                        >
                                                            Continue to Payment
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Step 2: Payment */}
                            {step === 2 && (
                                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm">
                                    <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>

                                    {/* Selected Address Summary */}
                                    {selectedAddress && (
                                        <div className="mb-6 rounded-lg border border-white/10 bg-slate-900/50 p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-sm font-semibold text-slate-300">Delivering to:</h3>
                                                <button
                                                    onClick={() => setStep(1)}
                                                    className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                            <p className="font-semibold text-white">{selectedAddress.fullName}</p>
                                            <p className="text-sm text-slate-400">
                                                {selectedAddress.addressLine1}, {selectedAddress.addressLine2 && `${selectedAddress.addressLine2}, `}
                                                {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postalCode}
                                            </p>
                                            <p className="text-sm text-slate-400">Phone: {selectedAddress.phone}</p>
                                        </div>
                                    )}

                                    <div className="space-y-3 mb-6">
                                        {[
                                            { value: "cod", label: "Cash on Delivery", desc: "Pay when you receive" },
                                            { value: "upi", label: "UPI", desc: "PhonePe, Google Pay, Paytm" },
                                            { value: "card", label: "Credit/Debit Card", desc: "Visa, Mastercard, RuPay" },
                                        ].map((method) => (
                                            <label
                                                key={method.value}
                                                className={`block cursor-pointer rounded-lg border p-4 transition-all ${paymentMethod === method.value
                                                    ? "border-violet-500 bg-violet-500/10"
                                                    : "border-white/10 bg-slate-900/50 hover:border-white/20"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value={method.value}
                                                    checked={paymentMethod === method.value}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div>
                                                    <p className="font-semibold text-white">{method.label}</p>
                                                    <p className="text-sm text-slate-400">{method.desc}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="flex-1 rounded-lg border border-white/10 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-white/5"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setStep(3)}
                                            className="flex-1 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/50"
                                        >
                                            Review Order
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review */}
                            {step === 3 && (
                                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm">
                                    <h2 className="text-2xl font-bold text-white mb-6">Review Order</h2>

                                    {/* Address */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-white mb-3">Delivery Address</h3>
                                        <div className="rounded-lg bg-slate-900/50 p-4">
                                            <p className="font-semibold text-white">{selectedAddress?.fullName}</p>
                                            <p className="text-sm text-slate-400 mt-1">
                                                {selectedAddress?.addressLine1}, {selectedAddress?.addressLine2 && `${selectedAddress.addressLine2}, `}
                                                {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.postalCode}
                                            </p>
                                            <p className="text-sm text-slate-400">Phone: {selectedAddress?.phone}</p>
                                        </div>
                                    </div>

                                    {/* Payment */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-white mb-3">Payment Method</h3>
                                        <div className="rounded-lg bg-slate-900/50 p-4">
                                            <p className="text-white capitalize">{paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod.toUpperCase()}</p>
                                        </div>
                                    </div>

                                    {orderError && (
                                        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">
                                            {orderError}
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="flex-1 rounded-lg border border-white/10 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-white/5"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={orderLoading}
                                            className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {orderLoading ? "Placing Order..." : "Place Order"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 backdrop-blur-sm sticky top-4">
                                <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
                                <div className="space-y-3 mb-4">
                                    {cartItems.map((item) => (
                                        <div key={item._id} className="flex gap-3">
                                            <img
                                                src={item.product?.images?.find(img => img.isPrimary)?.url || item.product?.images?.[0]?.url}
                                                alt={item.product?.name}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-white line-clamp-1">{item.product?.name}</p>
                                                <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                                                <p className="text-sm font-semibold text-violet-400">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-white/10 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Subtotal</span>
                                        <span>₹{totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Tax (18%)</span>
                                        <span>₹{tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/10">
                                        <span>Total</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Checkout;
