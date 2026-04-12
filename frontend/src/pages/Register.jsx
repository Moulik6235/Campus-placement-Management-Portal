import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/layout/Navbar";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rollNo: "",
    studentClass: "",
    semester: "",
    role: "student", // Default role
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const reqLower = /[a-z]/.test(form.password);
  const reqUpper = /[A-Z]/.test(form.password);
  const reqNumber = /[0-9]/.test(form.password);
  const reqLength = form.password.length >= 8;
  const isPasswordValid = reqLower && reqUpper && reqNumber && reqLength && form.password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError("Please ensure your password meets all security requirements.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", form);
      setSuccess(true);
      // Success modal will show, then user can click to go home
    } catch (err) {
      setError(err.response?.data?.message || "Error registering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500 py-12">
        <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 relative overflow-hidden group">
          
          {/* Decorative glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-secondary/10 transition-all duration-700"></div>

          <div className="text-center mb-8 relative">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-secondary/20">
              <span className="material-symbols-outlined text-secondary text-3xl">rocket_launch</span>
            </div>
            <h1 className="text-3xl font-extrabold font-headline text-on-surface mb-2">Create Account</h1>
            <p className="text-on-surface-variant text-sm">Join the portal to explore career opportunities</p>
          </div>

          <div className="flex bg-surface-container-high p-1 rounded-2xl mb-8 relative z-10">
            <button
              onClick={() => setForm(prev => ({ ...prev, role: "student" }))}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${form.role === "student" ? "bg-white text-secondary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              <span className="material-symbols-outlined text-sm">school</span>
              Student
            </button>
            <button
              onClick={() => setForm(prev => ({ ...prev, role: "company" }))}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${form.role === "company" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              <span className="material-symbols-outlined text-sm">business</span>
              Company
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative">
            
            {error && (
              <div className="bg-error-container text-on-error-container p-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{form.role === 'company' ? 'Company Name' : 'Full Name'}</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">{form.role === 'company' ? 'business' : 'person'}</span>
                  <input
                    type="text"
                    name="name"
                    placeholder={form.role === 'company' ? 'Example Tech Inc.' : 'Full Name'}
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-secondary focus:border-secondary focus:bg-white transition-all text-on-surface outline-none"
                    required
                  />
                </div>
              </div>

              {form.role === "student" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Roll No</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">badge</span>
                    <input
                      type="text"
                      name="rollNo"
                      placeholder="Roll No."
                      value={form.rollNo}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-secondary focus:border-secondary focus:bg-white transition-all text-on-surface outline-none"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {form.role === "student" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Class</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">school</span>
                    <input
                      type="text"
                      name="studentClass"
                      list="classes-list"
                      placeholder="Class"
                      value={form.studentClass}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-secondary focus:border-secondary focus:bg-white transition-all text-on-surface outline-none"
                      required
                    />
                    <datalist id="classes-list">
                      <option value="BCA" />
                      <option value="BCOM" />
                      <option value="BBA" />
                      <option value="MCOM" />
                      <option value="MBA" />
                      <option value="MCA" />
                    </datalist>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Semester</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">calendar_month</span>
                    <input
                      type="text"
                      name="semester"
                      list="semesters-list"
                      placeholder="Semster"
                      value={form.semester}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-secondary focus:border-secondary focus:bg-white transition-all text-on-surface outline-none"
                      required
                    />
                    <datalist id="semesters-list">
                      <option value="1st" />
                      <option value="2nd" />
                      <option value="3rd" />
                      <option value="4th" />
                      <option value="5th" />
                      <option value="6th" />
                    </datalist>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">mail</span>
                <input
                  type="email"
                  name="email"
                  placeholder="name@college.edu"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-secondary focus:border-secondary focus:bg-white transition-all text-on-surface outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 pl-10 pr-12 focus:ring-2 focus:ring-secondary focus:border-secondary focus:bg-white transition-all text-on-surface outline-none"
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
              {/* Dynamic Password Checklist */}
              {form.password.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-3 px-1 text-[11px] font-bold uppercase tracking-wider">
                  <div className={`flex items-center gap-2 transition-colors ${reqLength ? "text-green-600" : "text-on-surface-variant"}`}>
                    <span className="material-symbols-outlined text-[16px]">{reqLength ? "check_circle" : "radio_button_unchecked"}</span> Minimum 8 characters
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${reqUpper ? "text-green-600" : "text-on-surface-variant"}`}>
                    <span className="material-symbols-outlined text-[16px]">{reqUpper ? "check_circle" : "radio_button_unchecked"}</span> 1 Uppercase letter
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${reqLower ? "text-green-600" : "text-on-surface-variant"}`}>
                    <span className="material-symbols-outlined text-[16px]">{reqLower ? "check_circle" : "radio_button_unchecked"}</span> 1 Lowercase letter
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${reqNumber ? "text-green-600" : "text-on-surface-variant"}`}>
                    <span className="material-symbols-outlined text-[16px]">{reqNumber ? "check_circle" : "radio_button_unchecked"}</span> 1 Number
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (form.password.length > 0 && !isPasswordValid)}
              className="w-full mt-8 bg-secondary hover:bg-secondary-container hover:text-on-secondary-container text-on-secondary py-3.5 rounded-xl font-bold shadow-md shadow-secondary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex justify-center items-center gap-2 group"
            >
              {loading ? "Creating Account..." : "Register Now"}
              {!loading && <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>}
            </button>
            
          </form>

          <p className="text-center mt-8 text-sm text-on-surface-variant font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-secondary hover:underline font-bold transition-colors">
              Sign in
            </Link>
          </p>

        </div>
      </main>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-8 shadow-2xl border border-outline-variant/30 text-center animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-green-600 text-5xl">check_circle</span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-on-surface mb-4">Registration Successful!</h2>
            
            <p className="text-on-surface-variant font-medium mb-8 leading-relaxed">
              Welcome aboard, <strong>{form.name}</strong>! <br /><br />
              Your account has been created and is now <span className="text-primary font-bold">under review</span> by the GCCBA Placement Cell.
              <br /><br />
              You will receive an <span className="font-bold">email notification</span> once your account is approved. After that, you'll be able to sign in and apply for jobs.
            </p>

            <button
              onClick={() => navigate("/")}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Go to Home Page
              <span className="material-symbols-outlined text-xl">home</span>
            </button>
            
            <p className="mt-6 text-xs text-outline font-bold uppercase tracking-widest">
              Know. Explore. Grow.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;