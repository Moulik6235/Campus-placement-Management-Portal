import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import API from "../services/api";
import Footer from "../components/layout/Footer";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("analytics");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salary: "",
    experienceRequired: "",
    jobType: "",
    skillsRequired: "",
  });

  const [editId, setEditId] = useState(null);

  // FETCH DATA
  const fetchData = async () => {
    try {
      const [s, c, j, a, st] = await Promise.all([
        API.get("/admin/students").catch(() => ({ data: [] })),
        API.get("/admin/companies").catch(() => ({ data: [] })),
        API.get("/jobs").catch(() => ({ data: [] })),
        API.get("/applications").catch(() => ({ data: [] })),
        API.get("/admin/analytics").catch(() => ({ data: {} })),
      ]);

      setStudents(s.data || []);
      setCompanies(c.data || []);
      setJobs(j.data || []);
      setApplications(a.data || []);
      setStats(st.data || {});
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchData();
      setLoading(false);
    };
    load();
  }, []);

  // ================= JOB =================
  const handleSubmit = async () => {
    // Basic validation for all fields
    if (!form.title || !form.company || !form.location || !form.description || !form.salary || !form.experienceRequired || !form.jobType || !form.skillsRequired) {
      return alert("All fields are required. Please fill in all the details.");
    }
    
    setLoading(true);
    try {
      if (editId) {
        await API.put(`/jobs/${editId}`, form);
      } else {
        await API.post("/jobs", form);
      }
      setForm({ title: "", company: "", location: "", description: "", salary: "", experienceRequired: "", jobType: "", skillsRequired: "" });
      setEditId(null);
      await fetchData();
    } catch (err) {
      alert("Error saving job");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    if(window.confirm("Delete this job?")) {
      await API.delete(`/jobs/${id}`);
      fetchData();
    }
  };

  const editJob = (job) => {
    setForm(job);
    setEditId(job._id);
    setTab("jobs");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ================= STUDENT =================
  const approve = async (id) => {
    await API.put(`/admin/approve/${id}`);
    fetchData();
  };

  const reject = async (id) => {
    await API.put(`/admin/reject/${id}`);
    fetchData();
  };

  // ================= APPLICATION =================
  const updateStatus = async (id, status) => {
    await API.put(`/applications/${id}`, { status });
    fetchData();
  };

  // ================= EXPORT PDF REPORT =================
  const generateReport = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Title
    doc.setFontSize(22);
    doc.setTextColor(221, 20, 119); // Primary Color
    doc.text("GCCBA Placement Portal Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 14, 30);

    // 1. Analytics Summary
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("Platform Analytics", 14, 45);
    
    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Value']],
      body: [
        ['Total Students', stats.totalStudents || 0],
        ['Total Job Postings', stats.totalJobs || 0],
        ['Total Applications', stats.totalApplications || 0],
        ['Placement Success Rate', `${stats.successRate || 0}%`]
      ],
      theme: 'striped',
      headStyles: { fillStyle: '#dd1477' }
    });

    // 2. Job Postings
    doc.text("Active Job Postings", 14, doc.lastAutoTable.finalY + 15);
    
    const jobRows = jobs.map(j => [j.title, j.company, j.location, j.salary || 'N/A']);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Title', 'Company', 'Location', 'Salary']],
      body: jobRows,
      theme: 'grid'
    });

    // 3. Recent Applications
    if (doc.lastAutoTable.finalY > 220) doc.addPage();
    doc.text("Student Applications", 14, doc.lastAutoTable.finalY + 15);
    
    const appRows = applications.map(a => [
      a.user?.name || 'N/A',
      a.job?.title || 'N/A',
      a.job?.company || 'N/A',
      a.status || 'Pending'
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Candidate', 'Position', 'Company', 'Status']],
      body: appRows,
      theme: 'striped'
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount} | GCCBA Placement Cell CONFIDENTIAL`, 14, doc.internal.pageSize.height - 10);
    }

    doc.save(`GCCBA_Placement_Report_${date.replace(/\//g, '-')}.pdf`);
  };

  // ================= LOGOUT =================
  const logout = (e) => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminName");
    if (e.ctrlKey || e.metaKey) {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      e.preventDefault();
      window.location.href = "/admin";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-primary text-xl font-bold font-headline bg-surface">
         Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body flex relative overflow-hidden">
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-surface-container-lowest border-b border-outline-variant/20 px-6 py-4 flex items-center justify-between z-50">
        <h1 className="text-xl font-black text-primary font-headline">Admin Panel</h1>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined text-[28px]">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* SideNavBar */}
      <aside className={`w-64 fixed lg:relative left-0 top-0 h-screen bg-surface-container-lowest flex flex-col pt-24 pb-4 px-4 lg:pt-4 space-y-2 z-40 border-r border-outline-variant/20 transition-transform duration-300 shadow-2xl lg:shadow-none ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="mb-8 px-2 mt-2 hidden lg:block">
          <h1 className="text-xl font-black text-primary font-headline">Admin Panel</h1>
          <p className="text-xs font-medium text-on-surface-variant font-body">Placement Cell</p>
        </div>
        <nav className="flex-1 space-y-2">
          {[{ id: 'analytics', icon: 'analytics', label: 'Analytics' },
            { id: 'students', icon: 'group', label: 'Students' },
            { id: 'companies', icon: 'business', label: 'Companies' },
            { id: 'jobs', icon: 'work', label: 'Jobs' },
            { id: 'applications', icon: 'description', label: 'Applications' }].map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setMobileOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                tab === t.id
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-[0.98]"
                  : "text-on-surface-variant hover:bg-primary/5 hover:text-primary-hover"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
              <span className="text-sm font-bold">{t.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-3 pb-4">
          <button onClick={() => { setForm({ title: "", company: "", location: "", description: "", salary: "", experienceRequired: "", jobType: "", skillsRequired: "" }); setEditId(null); setTab('jobs'); }} className="w-full bg-secondary text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-secondary/20 hover:bg-secondary-hover transition-all active:scale-95">
            <span className="material-symbols-outlined text-sm">add</span>
            <span className="text-sm">Post a Job</span>
          </button>
          <Link 
            to="/" 
            className="w-full bg-surface-container-high text-on-surface-variant font-bold py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-primary-hover hover:text-white transition-all active:scale-95 no-underline"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            <span className="text-sm">Go to Home</span>
          </Link>
          <Link 
            to="/admin" 
            onClick={logout} 
            className="w-full bg-surface-container-high text-on-surface-variant font-bold py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-error hover:text-white transition-colors active:scale-95 no-underline"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="text-sm">Logout</span>
          </Link>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-on-surface/50 backdrop-blur-sm z-30 animate-in fade-in duration-300"
        ></div>
      )}

      {/* Main Canvas */}
      <main className="flex-1 min-h-screen p-6 lg:p-8 bg-surface-container-low/30 mt-[72px] lg:mt-0 transition-all">
        
        {/* HEADER */}
        <header className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline capitalize">
              {tab === 'analytics' ? 'Placement Insights' : `Manage ${tab}`}
            </h2>
            <p className="text-on-surface-variant font-body mt-1">
              {tab === 'analytics' ? 'Real-time recruitment data and student progression metrics.' : `View and manage all your institutional ${tab}.`}
            </p>
          </div>
          {tab === 'analytics' && (
            <div className="flex items-center space-x-4">
             
              <button onClick={generateReport} className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-hover transition-colors flex items-center space-x-2 shadow-md shadow-primary/20">
                <span className="material-symbols-outlined text-sm">file_download</span>
                <span>Export Report</span>
              </button>
            </div>
          )}
        </header>

        {tab === "analytics" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow border border-outline-variant/10 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">how_to_reg</span>
                  </div>
                </div>
                <p className="text-on-surface-variant text-xs font-bold tracking-wider uppercase mb-1">Total Placements</p>
                <p className="text-3xl font-extrabold text-on-surface font-headline">{stats?.totalApplications || 842}</p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow border border-outline-variant/10 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-secondary/10 rounded-xl text-secondary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">campaign</span>
                  </div>
                </div>
                <p className="text-on-surface-variant text-xs font-bold tracking-wider uppercase mb-1">Active Roles</p>
                <p className="text-3xl font-extrabold text-on-surface font-headline">{stats?.totalJobs || 156}</p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow border border-outline-variant/10 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-tertiary/10 rounded-xl text-tertiary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">auto_awesome</span>
                  </div>
                </div>
                <p className="text-on-surface-variant text-xs font-bold tracking-wider uppercase mb-1">Success Rate</p>
                <p className="text-3xl font-extrabold text-on-surface font-headline">{stats?.successRate || 92.4}%</p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow border border-outline-variant/10 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-orange-100/50 rounded-xl text-orange-600 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">business</span>
                  </div>
                </div>
                <p className="text-on-surface-variant text-xs font-bold tracking-wider uppercase mb-1">Total Companies</p>
                <p className="text-3xl font-extrabold text-on-surface font-headline">{stats?.totalCompanies || 0}</p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow border border-outline-variant/10 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-teal-100/50 rounded-xl text-teal-600 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">group</span>
                  </div>
                </div>
                <p className="text-on-surface-variant text-xs font-bold tracking-wider uppercase mb-1">Total Students</p>
                <p className="text-3xl font-extrabold text-on-surface font-headline">{stats?.totalStudents || 1400}</p>
              </div>
            </section>

            {/* Application List */}
            <section className="bg-surface-container-lowest rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden border border-outline-variant/10">
              <div className="px-8 py-6 flex justify-between items-center border-b border-surface-container border-opacity-50">
                <h3 className="text-lg font-bold font-headline">Recent Applications</h3>
                <button onClick={()=>setTab('applications')} className="text-xs font-bold text-primary flex items-center space-x-1 uppercase tracking-widest hover:underline">
                  <span>View All</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-lowest border-b border-surface-container">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest bg-slate-50/50">Candidate</th>
                      <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest bg-slate-50/50">Company & Role</th>
                      <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest bg-slate-50/50">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {(applications && applications.length > 0 ? applications.slice(0, 5) : []).map(app => (
                      <tr key={app._id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-8 py-4 font-semibold text-sm">{app.user?.name || "Unknown"}</td>
                        <td className="px-8 py-4 text-sm"><span className="font-bold">{app.job?.company}</span> - {app.job?.title}</td>
                        <td className="px-8 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            app.status === 'Shortlisted' ? 'bg-pink-100 text-pink-700' :
                            app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {app.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {applications.length === 0 && (
                      <tr><td colSpan="3" className="px-8 py-8 text-center text-on-surface-variant font-medium">No recent applications.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {tab === "students" && (
          <div className="bg-surface-container-lowest rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden border border-outline-variant/10 animate-in fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-surface-container">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-widest">Name & Roll</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-widest">Class & Sem</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {students.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-on-surface">{s.name}</p>
                        <p className="text-[11px] text-outline font-medium mt-0.5">Roll: {s.rollNo || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{s.email}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-on-surface">{s.studentClass || "N/A"}</p>
                        <p className="text-[11px] text-outline font-medium mt-0.5">Sem: {s.semester || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            s.status === 'approved' ? 'bg-green-100 text-green-700' :
                            s.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {s.status === "pending" ? (
                          <div className="flex space-x-2">
                            <button onClick={() => approve(s._id)} className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded hover:bg-green-200 transition-colors">Approve</button>
                            <button onClick={() => reject(s._id)} className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded hover:bg-red-200 transition-colors">Reject</button>
                          </div>
                        ) : (
                          <span className="text-xs text-outline font-medium">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-8 text-center text-on-surface-variant">No students found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "companies" && (
          <div className="bg-surface-container-lowest rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden border border-outline-variant/10 animate-in fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-surface-container">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-widest">Company Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-widest">Registration Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {companies.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                              {c.name?.charAt(0)}
                           </div>
                           <p className="text-sm font-bold text-on-surface">{c.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{c.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            c.status === 'approved' ? 'bg-green-100 text-green-700' :
                            c.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant font-medium">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {c.status === "pending" ? (
                          <div className="flex space-x-2">
                            <button onClick={() => approve(c._id)} className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600 transition-colors">Approve</button>
                            <button onClick={() => reject(c._id)} className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded hover:bg-red-200 transition-colors">Reject</button>
                          </div>
                        ) : (
                          <span className="text-xs text-outline font-medium">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {companies.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-8 text-center text-on-surface-variant">No companies found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "jobs" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-outline-variant/10">
              <h3 className="text-xl font-bold font-headline mb-6 text-primary">{editId ? "Update Job Details" : "Post a New Job"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Job Title <span className="text-red-500">*</span></label>
                  <input required placeholder="e.g. Software Engineer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-4 border border-outline-variant/40 rounded-xl outline-none focus:ring-2 ring-primary transition-shadow bg-surface-container-lowest text-on-surface" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Company <span className="text-red-500">*</span></label>
                  <input required placeholder="e.g. Google India" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full p-4 border border-outline-variant/40 rounded-xl outline-none focus:ring-2 ring-primary transition-shadow bg-surface-container-lowest text-on-surface" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Location <span className="text-red-500">*</span></label>
                  <input required placeholder="e.g. Bengaluru, Remote, On-site" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full p-4 border border-outline-variant/40 rounded-xl outline-none focus:ring-2 ring-primary transition-shadow bg-surface-container-lowest text-on-surface" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Salary <span className="text-red-500">*</span></label>
                  <input required placeholder="e.g. ₹10,00,000 PA" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="w-full p-4 border border-outline-variant/40 rounded-xl outline-none focus:ring-2 ring-primary transition-shadow bg-surface-container-lowest text-on-surface" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Work Type <span className="text-red-500">*</span></label>
                  <select required value={form.jobType || ""} onChange={(e) => setForm({ ...form, jobType: e.target.value })} className="w-full p-4 border border-outline-variant/40 rounded-xl outline-none focus:ring-2 ring-primary transition-shadow bg-surface-container-lowest text-on-surface appearance-none cursor-pointer">
                    <option value="" disabled>Select Work Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Skills Required <span className="text-red-500">*</span></label>
                  <input required placeholder="e.g. React, Node.js (comma separated)" value={Array.isArray(form.skillsRequired) ? form.skillsRequired.join(', ') : (form.skillsRequired || "")} onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })} className="w-full p-4 border border-outline-variant/40 rounded-xl outline-none focus:ring-2 ring-primary transition-shadow bg-surface-container-lowest text-on-surface" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Experience Required <span className="text-red-500">*</span></label>
                  <input required placeholder="e.g. 2+ Years / Fresher" value={form.experienceRequired} onChange={(e) => setForm({ ...form, experienceRequired: e.target.value })} className="w-full p-4 border border-outline-variant/40 rounded-xl outline-none focus:ring-2 ring-primary transition-shadow bg-surface-container-lowest text-on-surface" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Description / Requirements <span className="text-red-500">*</span></label>
                  <textarea required rows="4" placeholder="Job description here..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-4 border border-outline-variant/40 rounded-xl outline-none focus:ring-2 ring-primary transition-shadow bg-surface-container-lowest text-on-surface"></textarea>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={handleSubmit} className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary-hover active:scale-95 transition-all">
                  {editId ? "Update Job" : "Publish Job"}
                </button>
                {editId && (
                  <button onClick={() => { setForm({ title: "", company: "", location: "", description: "", salary: "", experienceRequired: "", jobType: "", skillsRequired: "" }); setEditId(null); }} className="px-8 py-3 bg-surface-container-high text-on-surface-variant font-bold rounded-xl hover:bg-outline-variant transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div key={job._id} className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-outline-variant/10 relative group hover:border-primary/30 transition-colors">
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    <button onClick={() => editJob(job)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors" title="Edit">
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button onClick={() => deleteJob(job._id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors" title="Delete">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                  <h4 className="text-lg font-bold font-headline">{job.title}</h4>
                  <p className="text-on-surface-variant text-sm font-semibold mb-3">{job.company}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-outline mb-4">
                    {job.jobType && <span className="flex items-center px-2 py-1 bg-primary/10 text-primary rounded-lg font-bold"><span className="material-symbols-outlined text-[14px] align-middle mr-1">business_center</span>{job.jobType}</span>}
                    <span className="flex items-center px-2 py-1 bg-surface-container text-on-surface-variant rounded-lg font-bold"><span className="material-symbols-outlined text-[14px] align-middle mr-1">location_on</span>{job.location || 'Not specified'}</span>
                    {job.salary && <span className="flex items-center px-2 py-1 bg-surface-container text-on-surface-variant rounded-lg font-bold"><span className="material-symbols-outlined text-[14px] align-middle mr-1">payments</span>{job.salary}</span>}
                  </div>
                  {job.skillsRequired && job.skillsRequired.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                          {job.skillsRequired.map((skill, i) => (
                              <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-outline-variant/20 text-on-surface rounded-full">{skill}</span>
                          ))}
                      </div>
                  )}
                  <p className="text-sm text-on-surface-variant line-clamp-2">{job.description}</p>
                </div>
              ))}
              {jobs.length === 0 && (
                <p className="col-span-full text-center text-on-surface-variant py-8">No active jobs posted.</p>
              )}
            </div>
          </div>
        )}

        {tab === "applications" && (
          <div className="bg-surface-container-lowest rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden border border-outline-variant/10 animate-in fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-surface-container">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-widest">Candidate</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-widest">Skills & Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-widest">Role & Company</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-widest">Resume</th>
                    <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-widest text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-on-surface">{app.user?.name || "Unknown"}</p>
                        <p className="text-[11px] text-outline mt-0.5">ID: {app.user?.rollNo || "N/A"}</p>
                        <p className="text-[11px] text-outline">{app.user?.email || ""}</p>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {(app.user?.skills || []).slice(0, 3).map((skill, si) => (
                            <span key={si} className="text-[9px] font-bold px-1.5 py-0.5 bg-outline-variant/10 text-on-surface-variant rounded-md">{skill}</span>
                          ))}
                          {(app.user?.skills || []).length > 3 && <span className="text-[9px] text-outline">+{app.user.skills.length - 3}</span>}
                        </div>
                        <p className="text-[11px] text-on-surface-variant line-clamp-1 italic">
                          {app.user?.education && app.user.education.length > 0 
                            ? `${app.user.education[0].degree} @ ${app.user.education[0].institution}`
                            : "No education details"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-on-surface">{app.job?.title}</p>
                        <p className="text-[11px] text-outline mt-0.5">{app.job?.company}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            app.status === 'Shortlisted' ? 'bg-pink-100 text-pink-700' :
                            app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                          {app.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {app.resume ? (
                          <a href={`http://localhost:5000/${app.resume.replace(/\\/g, "/")}`} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">description</span>
                            View PDF
                          </a>
                        ) : <span className="text-xs text-outline italic">No PDF</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => updateStatus(app._id, "Shortlisted")} className="h-8 px-3 flex items-center justify-center rounded bg-pink-50 text-pink-700 hover:bg-pink-100 transition-colors text-xs font-bold uppercase tracking-widest">
                            Shortlist
                          </button>
                          <button onClick={() => updateStatus(app._id, "Rejected")} className="h-8 px-3 flex items-center justify-center rounded bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-xs font-bold uppercase tracking-widest">
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr><td colSpan="6" className="px-6 py-8 text-center text-on-surface-variant font-medium">No applications found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <Footer />
      </main>
    </div>
  );
};

export default AdminDashboard;