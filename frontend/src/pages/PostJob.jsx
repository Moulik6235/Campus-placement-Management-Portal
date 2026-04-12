import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const PostJob = () => {
  const { id } = useParams(); // For Edit Mode
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    salary: "",
    jobType: "Full-time",
    description: "",
    skillsRequired: "",
    experienceRequired: ""
  });

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setFetching(true);
      const res = await API.get("/jobs"); // We fetch all then find or we can add a get single job route
      const job = res.data.find(j => j._id === id);
      if (job) {
        setForm({
          title: job.title || "",
          location: job.location || "",
          salary: job.salary || "",
          jobType: job.jobType || "Full-time",
          description: job.description || "",
          skillsRequired: Array.isArray(job.skillsRequired) ? job.skillsRequired.join(", ") : job.skillsRequired || "",
          experienceRequired: job.experienceRequired || ""
        });
      }
    } catch (err) {
      console.error("Error fetching job", err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await API.put(`/jobs/${id}`, form);
        alert("Job updated successfully!");
      } else {
        await API.post("/jobs", form);
        alert("Job posted successfully!");
      }
      navigate("/company/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error saving job");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
     return (
        <div className="min-h-screen bg-surface flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-12 w-full animate-in fade-in zoom-in-95 duration-500">
        
        <div className="bg-surface-container-lowest rounded-[32px] p-8 sm:p-12 shadow-xl border border-outline-variant/20 relative overflow-hidden group">
          
          {/* Decorative glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-all duration-700"></div>

          <div className="text-center mb-10 relative">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-4xl">
                 {id ? "edit_note" : "post_add"}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold font-headline text-on-surface mb-2">
                {id ? "Edit Job Posting" : "Post a New Job"}
            </h1>
            <p className="text-on-surface-variant text-sm">Fill in the details to find the perfect candidate</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Job Title</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">work</span>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Software Engineer"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-transparent rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-on-surface outline-none font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Location</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">location_on</span>
                        <input
                            type="text"
                            name="location"
                            placeholder="e.g. Chandigarh, Remote"
                            value={form.location}
                            onChange={handleChange}
                            className="w-full bg-surface-container-low border border-transparent rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-on-surface outline-none font-medium"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Salary Package</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">payments</span>
                        <input
                            type="text"
                            name="salary"
                            placeholder="e.g. 8-12 LPA"
                            value={form.salary}
                            onChange={handleChange}
                            className="w-full bg-surface-container-low border border-transparent rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-on-surface outline-none font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Job Type</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">category</span>
                        <select
                            name="jobType"
                            value={form.jobType}
                            onChange={handleChange}
                            className="w-full bg-surface-container-low border border-transparent rounded-2xl py-4 pl-12 pr-8 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-on-surface outline-none font-medium appearance-none"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Contract">Contract</option>
                            <option value="Part-time">Part-time</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Exp. Required</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">history_edu</span>
                        <input
                            type="text"
                            name="experienceRequired"
                            placeholder="e.g. 2+ Years, Fresher"
                            value={form.experienceRequired}
                            onChange={handleChange}
                            className="w-full bg-surface-container-low border border-transparent rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-on-surface outline-none font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Required Skills (Comma separated)</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-5 text-outline text-lg">bolt</span>
                <textarea
                  name="skillsRequired"
                  placeholder="e.g. HTML, CSS, JavaScript, React"
                  value={form.skillsRequired}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-surface-container-low border border-transparent rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-on-surface outline-none font-medium resize-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Job Description</label>
              <textarea
                name="description"
                placeholder="Briefly describe the role, responsibilities, and requirements..."
                value={form.description}
                onChange={handleChange}
                rows={6}
                className="w-full bg-surface-container-low border border-transparent rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-on-surface outline-none font-medium resize-none"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={() => navigate("/company/dashboard")}
                    className="flex-1 bg-surface-container-high text-on-surface-variant py-4 rounded-2xl font-bold hover:bg-outline-variant/30 transition-all active:scale-[0.98]"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-primary hover:bg-primary-hover text-on-primary py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2 group"
                >
                    {loading ? "Saving..." : (id ? "Update Job" : "Post Job Now")}
                    {!loading && <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">rocket_launch</span>}
                </button>
            </div>
            
          </form>

        </div>
      </main>
    </div>
  );
};

export default PostJob;
