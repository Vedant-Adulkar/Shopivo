import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, updateProfile, uploadAvatar } from '../api/users';
import { getUserAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '../api/addresses';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/ui/PageLoader';

const Profile = () => {
    const { user: authUser, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Account Info State
    const [isEditingAccount, setIsEditingAccount] = useState(false);
    const [accountData, setAccountData] = useState({ name: '', phone: '' });
    const [uploading, setUploading] = useState(false);

    // Address State
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressFormData, setAddressFormData] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        addressType: 'home'
    });

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const [profileData, addressesData] = await Promise.all([
                getProfile(),
                getUserAddresses()
            ]);

            setUser(profileData.user);
            setAccountData({
                name: profileData.user.name || '',
                phone: profileData.user.phone || ''
            });
            setAddresses(addressesData.addresses || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setSuccess('');
            const response = await updateProfile(accountData);
            setUser(response.user);
            updateUser(response.user);
            setSuccess('Profile updated successfully!');
            setIsEditingAccount(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        try {
            setUploading(true);
            setError('');
            const response = await uploadAvatar(file);
            setUser(response.user);
            updateUser(response.user);
            setSuccess('Avatar updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setSuccess('');

            if (editingAddressId) {
                await updateAddress(editingAddressId, addressFormData);
                setSuccess('Address updated successfully!');
            } else {
                await createAddress(addressFormData);
                setSuccess('Address added successfully!');
            }

            // Refresh addresses
            const addressesData = await getUserAddresses();
            setAddresses(addressesData.addresses || []);

            // Reset form
            setIsAddingAddress(false);
            setEditingAddressId(null);
            resetAddressForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save address');
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;

        try {
            setError('');
            await deleteAddress(id);
            setSuccess('Address deleted successfully!');
            const addressesData = await getUserAddresses();
            setAddresses(addressesData.addresses || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete address');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            setError('');
            await setDefaultAddress(id);
            setSuccess('Default address updated!');
            const addressesData = await getUserAddresses();
            setAddresses(addressesData.addresses || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to set default address');
        }
    };

    const startEditAddress = (address) => {
        setEditingAddressId(address._id);
        setAddressFormData({
            fullName: address.fullName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || '',
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            addressType: address.addressType
        });
        setIsAddingAddress(true);
    };

    const resetAddressForm = () => {
        setAddressFormData({
            fullName: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'India',
            addressType: 'home'
        });
    };

    if (loading) {
        return <PageLoader message="Loading profile..." />;
    }

    return (
        <div className="min-h-screen bg-slate-950 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 mb-8 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-violet-500 hover:bg-violet-600 rounded-full p-2 cursor-pointer transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </label>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
                                <p className="text-slate-400">{user?.email}</p>
                                {user?.phone && <p className="text-slate-500 text-sm">{user.phone}</p>}
                            </div>
                        </div>

                        {/* Dashboard Navigation Button */}
                        <Link
                            to={user?.role === 'admin' ? '/admin' : '/home'}
                            className="flex items-center gap-2 px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors font-semibold"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            {user?.role === 'admin' ? 'Dashboard' : 'Home'}
                        </Link>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
                        {success}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('account')}
                        className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'account'
                            ? 'text-violet-400 border-b-2 border-violet-400'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Account Info
                    </button>
                    <button
                        onClick={() => setActiveTab('addresses')}
                        className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'addresses'
                            ? 'text-violet-400 border-b-2 border-violet-400'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Addresses ({addresses.length})
                    </button>
                </div>

                {/* Account Info Tab */}
                {activeTab === 'account' && (
                    <div className="bg-slate-900 rounded-xl p-8 border border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Account Information</h2>
                            {!isEditingAccount && (
                                <button
                                    onClick={() => setIsEditingAccount(true)}
                                    className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {isEditingAccount ? (
                            <form onSubmit={handleAccountUpdate} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={accountData.name}
                                        onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-2">
                                        Phone (Indian format)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            value={accountData.phone.replace(/^\+91/, '')}
                                            onChange={(e) => {
                                                // Remove non-digits
                                                const digits = e.target.value.replace(/\D/g, '');
                                                // Limit to 10 digits
                                                const limited = digits.slice(0, 10);
                                                // Store with +91 prefix
                                                setAccountData({ ...accountData, phone: limited ? `+91${limited}` : '' });
                                            }}
                                            className="w-full pl-16 pr-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500"
                                            placeholder="98765 43210"
                                            maxLength={10}
                                            pattern="[0-9]{10}"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Enter 10-digit Indian mobile number
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditingAccount(false);
                                            setAccountData({
                                                name: user?.name || '',
                                                phone: user?.phone || ''
                                            });
                                        }}
                                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-slate-400">Name</p>
                                    <p className="text-lg text-white">{user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Email</p>
                                    <p className="text-lg text-white">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Phone</p>
                                    <p className="text-lg text-white">
                                        {user?.phone ? (
                                            // Format: +91 XXXXX XXXXX
                                            user.phone.startsWith('+91')
                                                ? `+91 ${user.phone.slice(3, 8)} ${user.phone.slice(8)}`
                                                : user.phone
                                        ) : 'Not provided'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Saved Addresses</h2>
                            {!isAddingAddress && (
                                <button
                                    onClick={() => {
                                        setIsAddingAddress(true);
                                        setEditingAddressId(null);
                                        resetAddressForm();
                                    }}
                                    className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors"
                                >
                                    Add New Address
                                </button>
                            )}
                        </div>

                        {/* Address Form */}
                        {isAddingAddress && (
                            <div className="bg-slate-900 rounded-xl p-6 border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-4">
                                    {editingAddressId ? 'Edit Address' : 'Add New Address'}
                                </h3>
                                <form onSubmit={handleAddressSubmit} className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-400 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={addressFormData.fullName}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, fullName: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-400 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            value={addressFormData.phone}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-slate-400 mb-2">Address Line 1</label>
                                        <input
                                            type="text"
                                            value={addressFormData.addressLine1}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, addressLine1: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-slate-400 mb-2">Address Line 2 (Optional)</label>
                                        <input
                                            type="text"
                                            value={addressFormData.addressLine2}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, addressLine2: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-400 mb-2">City</label>
                                        <input
                                            type="text"
                                            value={addressFormData.city}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-400 mb-2">State</label>
                                        <input
                                            type="text"
                                            value={addressFormData.state}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-400 mb-2">Postal Code</label>
                                        <input
                                            type="text"
                                            value={addressFormData.postalCode}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, postalCode: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-400 mb-2">Country</label>
                                        <input
                                            type="text"
                                            value={addressFormData.country}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, country: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-slate-400 mb-2">Address Type</label>
                                        <select
                                            value={addressFormData.addressType}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, addressType: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500"
                                        >
                                            <option value="home">Home</option>
                                            <option value="work">Work</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2 flex gap-4">
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors"
                                        >
                                            {editingAddressId ? 'Update Address' : 'Add Address'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAddingAddress(false);
                                                setEditingAddressId(null);
                                                resetAddressForm();
                                            }}
                                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Address List */}
                        <div className="grid gap-4">
                            {addresses.length === 0 ? (
                                <div className="bg-slate-900 rounded-xl p-8 border border-white/10 text-center">
                                    <p className="text-slate-400">No addresses saved yet</p>
                                </div>
                            ) : (
                                addresses.map((address) => (
                                    <div
                                        key={address._id}
                                        className={`bg-slate-900 rounded-xl p-6 border ${address.isDefault ? 'border-violet-500' : 'border-white/10'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-white">{address.fullName}</h3>
                                                    <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                                                        {address.addressType}
                                                    </span>
                                                    {address.isDefault && (
                                                        <span className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-slate-300">{address.addressLine1}</p>
                                                {address.addressLine2 && <p className="text-slate-300">{address.addressLine2}</p>}
                                                <p className="text-slate-300">
                                                    {address.city}, {address.state} {address.postalCode}
                                                </p>
                                                <p className="text-slate-300">{address.country}</p>
                                                <p className="text-slate-400 text-sm mt-2">{address.phone}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {!address.isDefault && (
                                                    <button
                                                        onClick={() => handleSetDefault(address._id)}
                                                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                                                    >
                                                        Set Default
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => startEditAddress(address)}
                                                    className="px-3 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAddress(address._id)}
                                                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
