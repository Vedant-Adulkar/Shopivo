import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../api/auth";

const inputStyles =
  "w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const { data } = await signupUser(form);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl grid overflow-hidden rounded-3xl bg-slate-900 shadow-[0_30px_100px_rgba(59,130,246,0.3)] md:grid-cols-[1.05fr,1fr] border border-slate-800">

        {/* LEFT PANEL */}
        <section className="flex flex-col justify-between bg-gradient-to-br from-blue-600 to-blue-800 p-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAzNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

          <div className="relative z-10">
            <p className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em]">
              Shopivo Seller
            </p>
            <h1 className="mt-6 text-4xl font-bold">Create account</h1>
            <p className="mt-4 text-sm opacity-90">
              Unlock premium tools to grow and manage your ecommerce business.
            </p>
          </div>

          <div className="mt-10 flex items-center gap-4 relative z-10">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold">Customer delight</p>
              <p className="text-sm opacity-90">
                Deliver memorable shopping experiences with Shopivo.
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="px-10 py-12 bg-slate-900">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">Sign up</h2>
            <p className="text-sm text-slate-400">
              Provide your details to get started
            </p>
          </header>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className={`${inputStyles} mt-2`}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                autoComplete="email"
                className={`${inputStyles} mt-2`}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`${inputStyles} mt-2`}
              />
            </div>

            {(error || success) && (
              <p
                className={`rounded-xl border px-4 py-3 text-sm ${error
                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  }`}
              >
                {error || success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blue-500/50 transition hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-400 hover:text-blue-300 transition"
            >
              Log in instead
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Signup;
