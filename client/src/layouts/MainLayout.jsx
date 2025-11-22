import { Navbar } from "../components/navigation/Navbar";

/**
 * Main layout wrapper with navbar
 */
export const MainLayout = ({ children, showSearch = false }) => {
    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar showSearch={showSearch} />
            <main>{children}</main>
        </div>
    );
};
