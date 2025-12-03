import { useState } from "react";

/**
 * Address form component for creating/editing addresses
 */
const AddressForm = ({ initialData = null, onSubmit, onCancel, loading = false }) => {
    const [formData, setFormData] = useState(
        initialData || {
            fullName: "",
            phone: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "India",
            addressType: "home",
            isDefault: false,
        }
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    placeholder="John Doe"
                />
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    placeholder="+91 1234567890"
                />
            </div>

            {/* Address Line 1 */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Address Line 1 *</label>
                <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    placeholder="House No., Building Name"
                />
            </div>

            {/* Address Line 2 */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Address Line 2</label>
                <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    placeholder="Road Name, Area, Colony"
                />
            </div>

            {/* City, State, Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">City *</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        placeholder="Mumbai"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">State *</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        placeholder="Maharashtra"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Postal Code *</label>
                    <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        placeholder="400001"
                    />
                </div>
            </div>

            {/* Address Type */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Address Type</label>
                <select
                    name="addressType"
                    value={formData.addressType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                </select>
            </div>

            {/* Set as Default */}
            <div className="flex items-center">
                <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-white/10 bg-slate-900/50 text-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
                <label className="ml-2 text-sm text-slate-300">Set as default address</label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/5"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Saving..." : initialData ? "Update Address" : "Add Address"}
                </button>
            </div>
        </form>
    );
};

export default AddressForm;
