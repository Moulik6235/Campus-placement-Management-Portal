import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("name");
  const initial = userName ? userName[0].toUpperCase() : (role === "admin" ? "A" : "S");
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
    window.location.reload();
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const NavLink = ({ path, label }) => (
    <Link
      to={path}
      className={`relative cursor-pointer transition-colors py-1 ${
        isActive(path) 
          ? "text-primary font-bold" 
          : "text-on-surface-variant font-medium hover:text-primary-hover"
      }`}
    >
      {label}
      {isActive(path) && (
        <span className="absolute bottom-[-14px] left-0 right-0 h-1 bg-primary rounded-t-full" />
      )}
    </Link>
  );

  return (
    <nav className="bg-surface/80 backdrop-blur-xl w-full top-0 z-50 sticky border-b border-outline-variant/20 shadow-[0_4px_30px_rgb(0,0,0,0.02)]">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-10">
          {/* LOGO */}
          <Link 
            to="/"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-white p-1 shadow-sm border border-outline-variant/10 w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
              <img src="/logos/ggcba.webp" alt="GCCBA Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <span className="text-xl font-extrabold font-headline tracking-tight text-on-surface">
              GCCBA <span className="text-primary">Careers</span>
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex gap-8 items-center mt-1">
            <NavLink path="/" label="Home" />
            {role !== "company" && <NavLink path="/jobs" label="Jobs" />}
            <NavLink path="/help" label="Help & Support" />
            {isLoggedIn && role === "student" && (
              <Link to="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors font-bold text-sm tracking-wide uppercase">Dashboard</Link>
            )}
            {isLoggedIn && role === "company" && (
              <Link to="/company/dashboard" className="text-on-surface-variant hover:text-primary transition-colors font-bold text-sm tracking-wide uppercase">Dashboard</Link>
            )}
            {isLoggedIn && role === "admin" && (
              <NavLink path="/admin/dashboard" label="Dashboard" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* MOBILE MENU TOGGLE */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-on-surface-variant hover:text-primary p-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[28px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <button className="hidden sm:flex text-on-surface-variant hover:text-primary-hover hover:bg-primary/5 w-10 h-10 rounded-full items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
              </button>
              <button className="hidden sm:flex text-on-surface-variant hover:text-secondary-hover hover:bg-secondary/5 w-10 h-10 rounded-full items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[22px]">favorite</span>
              </button>

              <div className="w-px h-6 bg-outline-variant/40 mx-1 hidden sm:block"></div>

              {/* PROFILE DROPDOWN */}
              <div className="relative" ref={dropdownRef}>
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-on-surface/5 p-1 pr-3 rounded-full transition-all border border-transparent hover:border-outline-variant/30"
                  onClick={() => setOpen(!open)}
                >
                  <div className="w-9 h-9 rounded-full bg-on-surface text-surface flex items-center justify-center font-bold font-headline select-none shadow-lg border border-outline-variant/30">
                    {initial}
                  </div>
                  <span className="material-symbols-outlined text-on-surface text-[20px] transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
                    keyboard_arrow_down
                  </span>
                </div>

                {open && (
                  <div className="absolute right-0 mt-3 bg-surface-container-lowest shadow-[0_10px_40px_rgb(0,0,0,0.08)] rounded-2xl w-56 p-2 border border-outline-variant/15 top-full animate-in slide-in-from-top-2 fade-in duration-200">
                    
                    <div className="px-4 py-3 border-b border-outline-variant/15 mb-2">
                      <p className="text-sm font-bold text-on-surface font-headline">My Account</p>
                      <p className="text-xs text-on-surface-variant capitalize">{role}</p>
                    </div>

                    {role !== 'admin' && (
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-[20px]">{role === 'company' ? 'business' : 'person'}</span> 
                        {role === 'company' ? 'Company Profile' : 'Portfolio / Resume'}
                      </Link>
                    )}

                    {role === "student" && (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 cursor-pointer hover:bg-surface-container-low px-4 py-2.5 rounded-xl transition-colors text-on-surface font-medium text-sm no-underline"
                        >
                          <span className="material-symbols-outlined text-[20px] text-primary">dashboard</span>
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 cursor-pointer hover:bg-surface-container-low px-4 py-2.5 rounded-xl transition-colors text-on-surface font-medium text-sm no-underline"
                        >
                          <span className="material-symbols-outlined text-[20px] text-primary">work</span>
                          My Applications
                        </Link>
                      </>
                    )}

                    {role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 cursor-pointer hover:bg-surface-container-low px-4 py-2.5 rounded-xl transition-colors text-on-surface font-medium text-sm no-underline"
                      >
                        <span className="material-symbols-outlined text-[20px] text-primary">admin_panel_settings</span>
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="h-px bg-outline-variant/15 my-2"></div>

                    <Link
                      to="/"
                      onClick={handleLogout}
                      className="flex items-center gap-3 cursor-pointer hover:bg-error-container/50 text-error px-4 py-2.5 rounded-xl transition-colors font-bold text-sm no-underline"
                    >
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      Log out
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/admin"
                className="text-on-surface-variant font-medium hover:text-primary hover:bg-primary/5 transition-all active:scale-95 px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 text-sm mr-2 border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                <span className="hidden sm:inline">Admin</span>
              </Link>
              <div className="w-px h-5 bg-outline-variant/40 mr-2 hidden sm:block"></div>
              <Link
                to="/login"
                className="text-primary font-bold hover:text-primary-hover hover:bg-primary/5 transition-all active:scale-95 px-5 py-2.5 rounded-xl cursor-pointer border border-primary/20"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-primary text-on-primary rounded-xl px-6 py-2.5 font-bold hover:bg-primary-hover transition-all active:scale-95 shadow-sm shadow-primary/20 cursor-pointer border border-primary/10 no-underline"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[100%] left-0 right-0 bg-surface border-b border-outline-variant/20 shadow-xl animate-in slide-in-from-top duration-300 z-40">
          <div className="flex flex-col p-6 gap-6">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg font-bold flex items-center gap-3 ${location.pathname === '/' ? 'text-primary' : 'text-on-surface'}`}
            >
              <span className="material-symbols-outlined">home</span> Home
            </Link>
            {role !== "company" && (
              <Link 
                to="/jobs" 
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg font-bold flex items-center gap-3 ${location.pathname === '/jobs' ? 'text-primary' : 'text-on-surface'}`}
              >
                <span className="material-symbols-outlined">work</span> Jobs
              </Link>
            )}
            <Link 
              to="/help" 
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg font-bold flex items-center gap-3 ${location.pathname === '/help' ? 'text-primary' : 'text-on-surface'}`}
            >
              <span className="material-symbols-outlined">help</span> Help Support
            </Link>
            {isLoggedIn ? (
              <>
                <Link 
                  to={role === "admin" ? "/admin/dashboard" : (role === "company" ? "/company/dashboard" : "/dashboard")} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold flex items-center gap-3 text-on-surface"
                >
                  <span className="material-symbols-outlined">dashboard</span> Dashboard
                </Link>
              </>
            ) : (
              <div className="flex flex-col gap-4 pt-4 border-t border-outline-variant/10">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center font-bold text-on-surface border border-outline-variant/30 rounded-xl">Log In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center font-bold text-white bg-primary rounded-xl hover:bg-primary-hover transition-colors shadow-sm">Register</Link>
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center font-bold text-on-surface-variant flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span> Admin Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;