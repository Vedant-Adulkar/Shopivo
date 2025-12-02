import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../../store/slices/productsSlice";
import { useDebounce } from "../../hooks/useDebounce";

/**
 * Search bar component with debounced search
 */
export const SearchBar = () => {
    const [localSearch, setLocalSearch] = useState("");
    const dispatch = useDispatch();
    const debouncedSearch = useDebounce(localSearch, 300);

    // Update Redux when debounced value changes
    // FilterSidebar's useEffect will handle fetching products
    useEffect(() => {
        dispatch(setSearchQuery(debouncedSearch));
    }, [debouncedSearch, dispatch]);

    const handleClear = () => {
        setLocalSearch("");
        dispatch(setSearchQuery(""));
    };

    return (
        <div className="relative flex-1 max-w-xl">
            <div className="relative">
                <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 pl-11 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
                <svg
                    className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                {localSearch && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};
