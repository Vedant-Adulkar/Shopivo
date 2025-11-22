/**
 * Loading Spinner component
 */
export const LoadingSpinner = ({ size = "md", overlay = false }) => {
    const sizes = {
        sm: "h-6 w-6",
        md: "h-12 w-12",
        lg: "h-16 w-16",
    };

    const spinner = (
        <div className="flex items-center justify-center">
            <div
                className={`${sizes[size]} animate-spin rounded-full border-4 border-slate-700 border-t-violet-500`}
            ></div>
        </div>
    );

    if (overlay) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                {spinner}
            </div>
        );
    }

    return spinner;
};
