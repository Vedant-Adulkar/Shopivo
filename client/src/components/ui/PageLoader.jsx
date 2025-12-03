export const PageLoader = ({ message = "Loading..." }) => (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
            <p className="text-slate-400">{message}</p>
        </div>
    </div>
);

export const InlineLoader = ({ size = "md", message }) => {
    const sizes = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-3",
        lg: "h-12 w-12 border-4"
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`${sizes[size]} animate-spin rounded-full border-violet-500 border-t-transparent`}></div>
            {message && <p className="text-slate-400 text-sm">{message}</p>}
        </div>
    );
};
