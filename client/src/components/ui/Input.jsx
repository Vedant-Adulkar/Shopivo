/**
 * Reusable Input component
 */
export const Input = ({
    label,
    error,
    type = "text",
    className = "",
    containerClassName = "",
    ...props
}) => {
    const inputStyles =
        "w-full rounded-xl border bg-slate-900/50 px-4 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2";

    const borderStyles = error
        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50"
        : "border-white/10 focus:border-violet-500 focus:ring-violet-500/50";

    return (
        <div className={`${containerClassName}`}>
            {label && (
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                    {label}
                </label>
            )}
            {type === "textarea" ? (
                <textarea
                    className={`${inputStyles} ${borderStyles} ${className} min-h-[120px] resize-y`}
                    {...props}
                />
            ) : (
                <input
                    type={type}
                    className={`${inputStyles} ${borderStyles} ${className}`}
                    {...props}
                />
            )}
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>
    );
};
