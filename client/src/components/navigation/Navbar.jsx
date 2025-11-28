import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";
import { CartIcon } from "./CartIcon";

/**
 * Main navigation bar component
 */
export const Navbar = ({ showSearch = false }) => {
    const { user } = useAuth();
    const location = useLocation();
    const isAdmin = user?.role === "admin";

    return (
        <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo */}
                    <Link
                        to="/home"
                        className="flex items-center gap-2 text-xl font-bold text-white transition-colors hover:text-violet-300"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500">
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
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                        </div>
                        <span className="hidden sm:inline">Shopivo</span>
                    </Link>

                    {/* Search Bar */}
                    {showSearch && (
                        <div className="hidden md:block flex-1 max-w-xl">
                            <SearchBar />
                        </div>
                    )}

                    {/* Navigation Links */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/home"
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${location.pathname === "/home"
                                ? "bg-violet-500/20 text-violet-300"
                                : "text-slate-300 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            Home
                        </Link>

                        {isAdmin && (
                            <Link
                                to="/admin"
                                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${location.pathname === "/admin"
                                    ? "bg-violet-500/20 text-violet-300"
                                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                Admin Panel
                            </Link>
                        )}

                        <CartIcon />
                        <UserMenu />
                    </div>
                </div>

                {/* Mobile Search */}
                {showSearch && (
                    <div className="block md:hidden pb-4">
                        <SearchBar />
                    </div>
                )}
            </div>
        </nav>
    );
};
