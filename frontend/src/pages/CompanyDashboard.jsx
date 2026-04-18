import { useState, useEffect } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const CompanyDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, jobs, applications

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        API.get("/jobs/my"),
        API.get("/applications/company")
      ]);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      // Error handling for production
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await API.delete(`/jobs/${id}`);
        setJobs(jobs.filter(j => j._id !== id));
      } catch (err) {
        alert("Failed to delete job");
      }
    }
  };

  const updateAppStatus = async (id, status) => {
    try {
      await API.put(`/applications/${id}`, { status });
      setApplications(applications.map(app => 
        app._id === id ? { ...app, status } : app
      ));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <div className="grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 w-full animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold font-headline">Company Dashboard</h1>
            <p className="text-on-surface-variant mt-1">Manage your recruitment process and job postings</p>
          </div>
          <Link 
            to="/company/post-job"
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 self-start"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Post New Job
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant/30 mb-8 sticky top-16 bg-surface z-10 py-1 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: "dashboard" },
            { id: "jobs", label: "My Jobs", icon: "work" },
            { id: "applications", label: "Applications", icon: "group" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === tab.id ? "text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/20 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-primary text-2xl">work</span>
                  </div>
                  <div className="text-4xl font-black text-on-surface">{jobs.length}</div>
                  <div className="text-on-surface-variant font-bold text-xs uppercase tracking-widest mt-1">Jobs Posted</div>
                </div>
                
                <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/20 shadow-sm">
                  <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-secondary text-2xl">group</span>
                  </div>
                  <div className="text-4xl font-black text-on-surface">{applications.length}</div>
                  <div className="text-on-surface-variant font-bold text-xs uppercase tracking-widest mt-1">Applications Received</div>
                </div>

                <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/20 shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-green-600 text-2xl">check_circle</span>
                  </div>
                  <div className="text-4xl font-black text-on-surface">
                    {applications.filter(a => a.status === "selected").length}
                  </div>
                  <div className="text-on-surface-variant font-bold text-xs uppercase tracking-widest mt-1">Students Selected</div>
                </div>
              </div>

              {/* Quick Actions */}
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">bolt</span> Recent Activity
              </h2>
              <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
                {applications.length > 0 ? (
                    <div className="divide-y divide-outline-variant/20">
                        {applications.slice(0, 5).map(app => (
                            <div key={app._id} className="p-6 flex items-center justify-between hover:bg-on-surface/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary">
                                        {app.user?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-on-surface">{app.user?.name}</div>
                                        <div className="text-sm text-on-surface-variant">Applied for <span className="text-on-surface font-medium">{app.job?.title}</span></div>
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-on-surface-variant">
                                    {new Date(app.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-on-surface-variant font-medium">No recent activity</div>
                )}
              </div>
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.length > 0 ? (
                jobs.map(job => (
                  <div key={job._id} className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">{job.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-on-surface-variant text-sm font-medium">
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">payments</span>
                            {job.salary}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link 
                            to={`/company/edit-job/${job._id}`}
                            className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all"
                            title="Edit Job"
                        >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                        </Link>
                        <button 
                            onClick={() => handleDeleteJob(job._id)}
                            className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-error/10 hover:text-error transition-all"
                            title="Delete Job"
                        >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                        {job.skillsRequired?.map((skill, i) => (
                            <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-surface-container-high px-2 py-1 rounded-lg text-on-surface-variant">
                                {skill}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                        <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px]">group</span>
                            {applications.filter(a => a.job?._id === job._id).length} Applicants
                        </div>
                        <button 
                            onClick={() => {
                                setActiveTab("applications");
                               
                            }}
                            className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
                        >
                            View Applications
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 bg-surface-container-low rounded-3xl border border-dashed border-outline-variant text-center">
                    <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">work_history</span>
                    <h3 className="text-xl font-bold text-on-surface mb-2">No jobs posted yet</h3>
                    <p className="text-on-surface-variant mb-8 max-w-sm mx-auto">Get started by posting your first job opportunity to attract top talent from GCCBA.</p>
                    <Link 
                        to="/company/post-job"
                        className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 inline-block no-underline"
                    >
                        Post Your First Job
                    </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === "applications" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               {applications.length > 0 ? (
                <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-on-surface/5">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Student</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Job Title</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Resume</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20">
                                {applications.map(app => (
                                    <tr key={app._id} className="hover:bg-on-surface/[0.02] transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                    {app.user?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-on-surface">{app.user?.name}</div>
                                                    <div className="text-xs text-on-surface-variant">{app.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-bold text-on-surface">{app.job?.title}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <a 
                                                href={`${API.defaults.baseURL.replace('/api', '')}/${app.resume?.replace(/\\/g, "/")}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline flex items-center gap-1.5 text-sm font-bold"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">description</span>
                                                View Resume
                                            </a>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                app.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                app.status === 'shortlisted' ? 'bg-blue-100 text-blue-700' :
                                                app.status === 'selected' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => updateAppStatus(app._id, "shortlisted")}
                                                    className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${app.status === 'shortlisted' ? 'bg-blue-500 border-blue-500 text-white' : 'border-outline-variant/30 text-on-surface-variant hover:border-blue-500 hover:text-blue-500'}`}
                                                    title="Shortlist"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">star</span>
                                                </button>
                                                <button 
                                                    onClick={() => updateAppStatus(app._id, "selected")}
                                                    className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${app.status === 'selected' ? 'bg-green-500 border-green-500 text-white' : 'border-outline-variant/30 text-on-surface-variant hover:border-green-500 hover:text-green-500'}`}
                                                    title="Select"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">check</span>
                                                </button>
                                                <button 
                                                    onClick={() => updateAppStatus(app._id, "rejected")}
                                                    className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${app.status === 'rejected' ? 'bg-red-500 border-red-500 text-white' : 'border-outline-variant/30 text-on-surface-variant hover:border-red-500 hover:text-red-500'}`}
                                                    title="Reject"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
               ) : (
                <div className="py-20 bg-surface-container-low rounded-3xl border border-dashed border-outline-variant text-center">
                    <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">person_search</span>
                    <h3 className="text-xl font-bold text-on-surface mb-2">No applications yet</h3>
                    <p className="text-on-surface-variant max-w-sm mx-auto">Applications from interested students will appear here once they start applying to your jobs.</p>
                </div>
               )}
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default CompanyDashboard;
