import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import JobDetails from "./pages/JobDetails";
import Jobs from "./pages/Jobs";
import CompanyDashboard from "./pages/CompanyDashboard";
import PostJob from "./pages/PostJob";
import Help from "./pages/Help";

// Global Features
import AIChatbot from "./components/features/ai/AIChatbot";

// Protected Routes
import ProtectedRoute, { AdminRoute, StudentRoute, CompanyRoute } from "./components/features/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/*Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/help" element={<Help />} />

        
        <Route path="/admin" element={<AdminLogin />} />

        <Route path="/job/:id" element={<JobDetails />} />

        {/* Student Dashboard */}
        <Route
          path="/dashboard"
          element={
            <StudentRoute>
              <Dashboard />
            </StudentRoute>
          }
        />

        {/* Profile Page */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Company Dashboard & Job Management */}
        <Route
          path="/company/dashboard"
          element={
            <CompanyRoute>
              <CompanyDashboard />
            </CompanyRoute>
          }
        />
        <Route
          path="/company/post-job"
          element={
            <CompanyRoute>
              <PostJob />
            </CompanyRoute>
          }
        />
        <Route
          path="/company/edit-job/:id"
          element={
            <CompanyRoute>
              <PostJob />
            </CompanyRoute>
          }
        />

        {/* Optional: 404 Page */}
        <Route
          path="*"
          element={
            <h1 style={{ textAlign: "center", marginTop: "50px" }}>
              404 - Page Not Found
            </h1>
          }
        />

      </Routes>
      <AIChatbot />
    </BrowserRouter>
  );
}

export default App;