import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import API from "../services/api";

import JobSearchAutocomplete from "../components/features/jobs/JobSearchAutocomplete";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      
      let endpoint = "/jobs";
      if (token && role === "student") {
        endpoint = "/jobs/recommended";
      }

      const res = await API.get(endpoint);
      setJobs(res.data);
    } catch (err) {
      // Fallback data if needed during dev
      setJobs([
        { _id: '1', title: 'Associate Financial Analyst', company: 'Google India', location: 'Bengaluru', salary: '₹4.5 - 6.0 LPA', type: 'Full Time', posted: '2 days ago', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmGy7PJunpjnrPjJWJo-xxJRoqZ5qAh6j4bolfhvmyyFuPiDrZwDufVDPTuKrIhfc2jDw5tv_OEdmhCvOf7EBbyiF5FbMgvjpCgcdxszFUFDCA45jjWMg8mpbMW917nnj4004VKLDOQUK6pMmJBcNBkZH341i7YkZcJaOXNU_s5Qdzw0tWZQH-yDbmuGJqSiJzAFuyK-w-flqpd5SiYZU4xbzV_jyS0WwqyeOlJGkULM6L7jSpRgpZaCXioYnyjovzPym09BwrPupJ'},
        { _id: '2', title: 'Business Development', company: 'Stripe Finance', location: 'Remote', salary: '₹3.0 - 5.5 LPA', type: 'Fresher', posted: 'Just now', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZoVxFjS4KeT8imdYW1a03MRy46QXAIV7d9nRHmtkUY_AODIZV-OtXJhm5lQ7ek9f-Gdx8q-1gO5kltlLA3wh8K2d2rOZ2RaaDb4URffAAjE7q5h5MezucvF4EXe0oh9SKix3WxJj_RgP32lBIhwEYLleEN84NaA0GaPUVV3LfJaxx_nrrUqyMBHffkaV5NaPqwM5d8NPIeh1KHY7SePLQF0VsdyLDuyvpmJDL1WPeD-ZWzjBKn83BE02EeF6kPheZqmdmnNF2aPXQ'}
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (job.title && job.title.toLowerCase().includes(term)) ||
      (job.company && job.company.toLowerCase().includes(term))
    );
  });

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body flex flex-col">
      <Navbar />

      <main className="flex-grow pt-12 pb-24 px-6 animate-in fade-in zoom-in-95 duration-500 relative">
        {/* Decorative background blurs */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -mr-48 -mt-24"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -ml-48"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold font-headline mb-6 tracking-tight">Active Opportunities</h1>
            <p className="text-xl text-on-surface-variant max-w-2xl mx-auto mb-10">
              Browse through top roles posted directly by our hiring network.
            </p>

            {/* Smart Search Bar */}
            <div className="bg-surface-container-lowest max-w-3xl mx-auto rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/10 p-2 flex text-left relative z-20 group focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <div className="pl-4 pr-2 flex items-center justify-center">
                 <span className="material-symbols-outlined text-outline">search</span>
              </div>
              
              <JobSearchAutocomplete 
                onSearchChange={(val) => setSearchTerm(val)} 
                initialValue={searchTerm} 
              />
              
              <button className="bg-primary text-white rounded-full px-8 py-3 font-bold hover:bg-primary-hover transition-all shadow-md active:scale-95 ml-2">
                Search
              </button>
            </div>
          </div>

          {/* Job List Container */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <span className="material-symbols-outlined text-5xl text-primary animate-spin mb-4">refresh</span>
              <p className="text-on-surface-variant font-bold">Loading brilliant opportunities...</p>
            </div>
          ) : (
            <>
              <p className="text-on-surface-variant text-sm font-medium mb-6 uppercase tracking-widest text-center md:text-left">
                {filteredJobs.length} {filteredJobs.length === 1 ? "Role" : "Roles"} Found
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map(job => (
                  <Link
                    key={job._id || job.id} 
                    to={`/job/${job._id || job.id}`}
                    className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-outline-variant/10 group cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between no-underline block"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-xl bg-surface-container-low flex items-center justify-center p-2 shadow-inner border border-outline-variant/10">
                          {job.logo ? (
                            <img className="w-full h-auto object-contain" src={job.logo} alt={job.company} />
                          ) : (
                            <span className="material-symbols-outlined text-primary text-2xl">apartment</span>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest mb-1 shadow-sm ${job.jobType === 'Internship' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                            {job.jobType || job.type || "Full Time"}
                          </span>
                          <span className="text-[11px] text-outline font-medium">{job.posted || "Recently"}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                        <h3 className="text-lg font-bold font-headline text-on-surface group-hover:text-primary transition-colors leading-tight">
                          {job.title}
                        </h3>
                        {job.score > 0 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-700 shadow-sm shrink-0">
                            <span className="material-symbols-outlined text-[12px]">auto_awesome</span> AI Match
                          </span>
                        )}
                      </div>
                      <p className="text-on-surface-variant text-sm font-semibold mb-4">{job.company}</p>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-on-surface-variant flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                          {job.location || 'Not Specified'}
                        </p>
                        <p className="text-sm text-on-surface text-green-700 font-bold flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-green-600">payments</span>
                          {job.salary || 'Competitive'}
                        </p>
                      </div>
                      {job.skillsRequired && job.skillsRequired.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-6">
                              {job.skillsRequired.map((skill, i) => (
                                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-outline-variant/10 text-on-surface rounded-full">{skill}</span>
                              ))}
                          </div>
                      )}
                    </div>
                    
                    <span 
                      className="w-full bg-secondary text-white font-bold py-3 rounded-xl shadow-md shadow-secondary/20 hover:bg-secondary-hover transition-all active:scale-95 group-hover:scale-[1.02] flex justify-center items-center">
                      {localStorage.getItem("token") ? "Apply Now" : "Login to Apply"}
                    </span>
                  </Link>
                ))}
              </div>

              {filteredJobs.length === 0 && (
                <div className="text-center py-24 bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm mt-4">
                  <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl text-outline">work_off</span>
                  </div>
                  <h3 className="text-xl font-bold font-headline text-on-surface mb-2">No jobs matched your search</h3>
                  <p className="text-on-surface-variant">Try adjusting your keywords to find more opportunities.</p>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default Jobs;
