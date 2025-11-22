/**
 * Reusable Button component with variants
 */
export const Button = ({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    onClick,
    type = "button",
    className = "",
    ...props
}) => {
    const baseStyles =
        "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary:
            "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-[0_20px_45px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 hover:shadow-[0_25px_60px_rgba(99,102,241,0.55)]",
        secondary:
            "bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl",
        danger:
            "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-[0_20px_45px_rgba(244,63,94,0.35)] hover:-translate-y-0.5 hover:shadow-[0_25px_60px_rgba(244,63,94,0.45)]",
        ghost:
            "bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/30",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading ? (
                <>
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
};
