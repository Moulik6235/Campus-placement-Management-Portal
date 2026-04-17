import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await API.post("/admin/login", form);

      // SAVE REAL JWT TOKEN
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminRole", res.data.role);
      localStorage.setItem("adminName", "Admin");

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 relative overflow-hidden group">
          
          {/* Decorative glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all duration-700"></div>

          <div className="text-center mb-8 relative">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
            </div>
            <h1 className="text-3xl font-extrabold font-headline text-on-surface mb-2">Admin Portal</h1>
            <p className="text-on-surface-variant text-sm">Secure login for placement administrators</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative">
            
            {error && (
              <div className="bg-error-container text-on-error-container p-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Admin Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">admin_panel_settings</span>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@college.example.com"
                  className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-on-surface outline-none"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 pl-10 pr-12 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-on-surface outline-none"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors focus:outline-none flex items-center justify-center p-1 rounded-full"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-primary hover:bg-primary-container hover:text-on-primary-container text-on-primary py-3.5 rounded-xl font-bold shadow-md shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 group"
            >
              {loading ? "Authenticating..." : "Login as Admin"}
              {!loading && <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">login</span>}
            </button>
            
          </form>

          <p className="text-center mt-8 text-sm text-on-surface-variant font-medium">
            Not an admin?{" "}
            <Link to="/login" className="text-primary hover:text-primary-fixed hover:underline font-bold transition-colors">
              Student Login
            </Link>
          </p>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;