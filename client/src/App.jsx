import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/home"} replace />;
  }

  return children;
};

const DashboardCard = ({ title, description, action, accent }) => (
  <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-900/70 p-10 shadow-[0_30px_120px_rgba(15,23,42,0.6)] backdrop-blur-2xl">
    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
      {title}
    </p>
    <h2 className="mt-4 text-4xl font-semibold text-white">
      {description} <span className="text-violet-300">{accent}</span>
    </h2>
    <div className="mt-10">{action}</div>
  </div>
);

const UserHome = () => {
  const { user, logout } = useAuth();
  return (
    <section className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
      <DashboardCard
        title="User Portal"
        description={`Welcome, ${user?.name || "Guest"}`}
        accent="🎉"
        action={
          <div className="flex flex-wrap gap-4">
            <button
              onClick={logout}
              className="rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-[0_20px_45px_rgba(99,102,241,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_25px_60px_rgba(99,102,241,0.55)]"
            >
              Log out
            </button>
          </div>
        }
      />
    </section>
  );
};

const AdminHome = () => {
  const { user, logout } = useAuth();
  return (
    <section className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
      <DashboardCard
        title="Admin Console"
        description={`${user?.name || "Admin"}, full control granted`}
        accent="🛍️"
        action={
          <div className="flex flex-wrap gap-4">
            <button
              onClick={logout}
              className="rounded-2xl bg-gradient-to-r from-rose-500 to-orange-400 px-6 py-3 text-base font-semibold text-white shadow-[0_20px_45px_rgba(249,115,22,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_25px_60px_rgba(249,115,22,0.45)]"
            >
              Log out
            </button>
          </div>
        }
      />
    </section>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <UserHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
