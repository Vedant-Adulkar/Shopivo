import { useAuth } from "../../context/AuthContext";

/**
 * Empty state component for when no products are found
 */
export const EmptyState = ({ searchQuery }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    return (
        <div className="flex min-h-[500px] items-center justify-center px-4">
            <div className="text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-800/50">
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
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                </div>

                <h3 className="mb-2 text-2xl font-bold text-white">
                    {searchQuery ? "No products found" : "No products yet"}
                </h3>

                <p className="mb-6 text-slate-400">
                    {searchQuery
                        ? `No products match "${searchQuery}". Try a different search term.`
                        : isAdmin
                            ? "Get started by adding your first product in the Admin Panel."
                            : "Check back soon for new products!"}
                </p>

                {isAdmin && !searchQuery && (
                    <a
                        href="/admin"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add Product
                    </a>
                )}
            </div>
        </div>
    );
};
