import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainLayout } from "../layouts/MainLayout";
import { ProductForm } from "../components/admin/ProductForm";
import { ProductTable } from "../components/admin/ProductTable";
import { Toast } from "../components/ui/Toast";
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    selectAllProducts,
    selectProductsLoading,
} from "../store/slices/productsSlice";

/**
 * Admin Panel page - manage products
 */
const AdminPanel = () => {
    const dispatch = useDispatch();
    const products = useSelector(selectAllProducts);
    const loading = useSelector(selectProductsLoading);

    const [editingProduct, setEditingProduct] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingProduct) {
                await dispatch(
                    updateProduct({ id: editingProduct._id, productData: formData })
                ).unwrap();
                showToast("Product updated successfully!");
                setEditingProduct(null);
            } else {
                await dispatch(createProduct(formData)).unwrap();
                showToast("Product created successfully!");
            }
        } catch (error) {
            showToast(error || "Operation failed", "error");
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await dispatch(deleteProduct(id)).unwrap();
                showToast("Product deleted successfully!");
            } catch (error) {
                showToast(error || "Failed to delete product", "error");
            }
        }
    };

    const handleCancel = () => {
        setEditingProduct(null);
    };

    return (
        <MainLayout>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
                    <p className="mt-2 text-slate-400">Manage your product catalog</p>
                </div>

                {/* Two Column Layout */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Left: Product Form */}
                    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm">
                        <ProductForm
                            product={editingProduct}
                            onSubmit={handleSubmit}
                            onCancel={editingProduct ? handleCancel : null}
                            loading={loading}
                        />
                    </div>

                    {/* Right: Product List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Products</h2>
                            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-sm font-semibold text-violet-300">
                                {products.length} total
                            </span>
                        </div>
                        <ProductTable
                            products={products}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>

            {/* Toast Notifications */}
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

export default AdminPanel;
