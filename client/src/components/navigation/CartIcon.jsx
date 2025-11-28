import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, selectCartTotals } from "../../store/slices/cartSlice";

/**
 * Cart icon with badge showing item count
 */
export const CartIcon = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { totalItems } = useSelector(selectCartTotals);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    return (
        <button
            onClick={() => navigate("/cart")}
            className="relative rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Shopping cart"
        >
            <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-xs font-bold text-white">
                    {totalItems > 99 ? "99+" : totalItems}
                </span>
            )}
        </button>
    );
};
