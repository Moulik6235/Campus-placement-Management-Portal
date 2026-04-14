import { useState, useEffect } from "react";
import API from "../services/api";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import JobSearchAutocomplete from "../components/features/jobs/JobSearchAutocomplete";

export default function Dashboard() {
  const location = useLocation();
  const [active, setActive] = useState(() => {
    return sessionStorage.getItem("dashboardTab") || (location.pathname === "/dashboard" ? "applications" : "jobs");
  });
  
  useEffect(() => {
    sessionStorage.setItem("dashboardTab", active);
  }, [active]);
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState({});
  const [applications, setApplications] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    about: "",
    education: [],
    skills: [],
    projects: [],
  });
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    fetchJobs();
    fetchUser();
    fetchApps();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs/recommended");
      setJobs(res.data);
    } catch(err) {
      // Fallback data
      setJobs([
        { _id: '1', title: 'Associate Financial Analyst', company: 'Google India', location: 'Bengaluru', salary: '₹4.5 - 6.0 LPA', type: 'Full Time', posted: '2 days ago', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmGy7PJunpjnrPjJWJo-xxJRoqZ5qAh6j4bolfhvmyyFuPiDrZwDufVDPTuKrIhfc2jDw5tv_OEdmhCvOf7EBbyiF5FbMgvjpCgcdxszFUFDCA45jjWMg8mpbMW917nnj4004VKLDOQUK6pMmJBcNBkZH341i7YkZcJaOXNU_s5Qdzw0tWZQH-yDbmuGJqSiJzAFuyK-w-flqpd5SiYZU4xbzV_jyS0WwqyeOlJGkULM6L7jSpRgpZaCXioYnyjovzPym09BwrPupJ'},
        { _id: '2', title: 'Business Development', company: 'Stripe Finance', location: 'Remote', salary: '₹3.0 - 5.5 LPA', type: 'Fresher', posted: 'Just now', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZoVxFjS4KeT8imdYW1a03MRy46QXAIV7d9nRHmtkUY_AODIZV-OtXJhm5lQ7ek9f-Gdx8q-1gO5kltlLA3wh8K2d2rOZ2RaaDb4URffAAjE7q5h5MezucvF4EXe0oh9SKix3WxJj_RgP32lBIhwEYLleEN84NaA0GaPUVV3LfJaxx_nrrUqyMBHffkaV5NaPqwM5d8NPIeh1KHY7SePLQF0VsdyLDuyvpmJDL1WPeD-ZWzjBKn83BE02EeF6kPheZqmdmnNF2aPXQ'}
      ]);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data);
      setForm({
        about: res.data.about || "",
        education: res.data.education || [],
        skills: res.data.skills || [],
        projects: res.data.projects || [],
      });
    } catch(err) {
      // Error handled silently
    }
  };

  const fetchApps = async () => {
    try {
      const res = await API.get("/applications/my");
      setApplications(res.data);
    } catch(err) {
      setApplications([
        { _id: '1', job: { title: 'Operations Trainee', company: 'Zomato Media Corp' }, status: 'Shortlisted' }
      ]);
    }
  };

  const saveData = async () => {
    try {
      let finalSkills = [...form.skills];
      if (skillInput.trim() && !finalSkills.includes(skillInput.trim())) {
        finalSkills.push(skillInput.trim());
      }

      await API.put("/users/profile", {
        about: form.about,
        education: form.education,
        skills: finalSkills,
        projects: form.projects,
      });

      setForm({ ...form, skills: finalSkills });
      setSkillInput("");
      setEditing(false);
      fetchUser();
    } catch(err) {
      setEditing(false);
    }
  };

  const addProject = () => {
    setForm({
      ...form,
      projects: [...form.projects, { title: "", link: "", description: "" }],
    });
  };

  const addEducation = () => {
    setForm({
      ...form,
      education: [...form.education, { institution: "", degree: "", year: "" }],
    });
  };

  const handleEducation = (i, e) => {
    const arr = [...form.education];
    arr[i][e.target.name] = e.target.value;
    setForm({ ...form, education: arr });
  };

  const handleProject = (i, e) => {
    const arr = [...form.projects];
    arr[i][e.target.name] = e.target.value;
    setForm({ ...form, projects: arr });
  };

  const addSkill = (e) => {
    if ((e.type === "keydown" && e.key === "Enter") || e.type === "click") {
      if (e.preventDefault) e.preventDefault();
      if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
        setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setForm({ ...form, skills: form.skills.filter(s => s !== skillToRemove) });
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body">
      <Navbar />

      <main className="max-w-screen-2xl mx-auto w-full px-6 py-8 flex-grow">
        {/* Hero Search Section */}
        <section className="mb-10">
          <div className="bg-surface-container-lowest p-2 rounded-xl shadow-[0_24px_32px_-12px_rgba(25,28,29,0.04)] flex flex-col md:flex-row items-center">
            <div className="flex-1 flex items-center px-6 py-3 space-x-3 ghost-border border-r border-outline-variant/15 md:border-r-0 md:border-b-0 border-b">
              <span className="material-symbols-outlined text-outline">search</span>
              <JobSearchAutocomplete placeholder="Enter skills / designations" />
            </div>
            <div className="hidden md:block w-px h-10 bg-outline-variant/10"></div>
            <div className="flex-1 flex items-center px-6 py-3 space-x-3 ghost-border border-r border-outline-variant/15 md:border-r-0 md:border-b-0 border-b">
              <span className="material-symbols-outlined text-outline">location_on</span>
              <input className="w-full border-none focus:outline-none bg-transparent text-on-surface font-body" placeholder="Enter location" type="text" />
            </div>
            <div className="hidden md:block w-px h-10 bg-outline-variant/10"></div>
            <div className="flex-1 flex items-center px-6 py-3 space-x-3">
              <span className="material-symbols-outlined text-outline">work_history</span>
              <select className="w-full border-none focus:outline-none bg-transparent text-on-surface font-body appearance-none">
                <option>Select experience</option>
                <option>Fresher</option>
                <option>1-2 Years</option>
                <option>3+ Years</option>
              </select>
            </div>
            <button className="m-2 bg-primary text-white font-bold px-10 py-4 rounded-lg hover:opacity-90 transition-all w-full md:w-auto">Search</button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar Links */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-2 lg:space-y-1 no-scrollbar">
                <button 
                  onClick={() => setActive("jobs")} 
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${active === 'jobs' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'bg-surface-container-low lg:bg-transparent text-on-surface-variant hover:bg-primary/5 hover:text-primary'}`}
                >
                  <span className="material-symbols-outlined text-sm">work</span> Available Jobs
                </button>
                <button 
                  onClick={() => setActive("profile")} 
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${active === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'bg-surface-container-low lg:bg-transparent text-on-surface-variant hover:bg-primary/5 hover:text-primary'}`}
                >
                  <span className="material-symbols-outlined text-sm">description</span> Profile Summary
                </button>
                <button 
                  onClick={() => setActive("education")} 
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${active === 'education' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'bg-surface-container-low lg:bg-transparent text-on-surface-variant hover:bg-primary/5 hover:text-primary'}`}
                >
                  <span className="material-symbols-outlined text-sm">school</span> Education
                </button>
                <button 
                  onClick={() => setActive("skills")} 
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${active === 'skills' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'bg-surface-container-low lg:bg-transparent text-on-surface-variant hover:bg-primary/5 hover:text-primary'}`}
                >
                  <span className="material-symbols-outlined text-sm">psychology</span> Skills
                </button>
                <button 
                  onClick={() => setActive("projects")} 
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${active === 'projects' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'bg-surface-container-low lg:bg-transparent text-on-surface-variant hover:bg-primary/5 hover:text-primary'}`}
                >
                  <span className="material-symbols-outlined text-sm">rocket_launch</span> Projects
                </button>
                <button 
                  onClick={() => setActive("applications")} 
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${active === 'applications' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'bg-surface-container-low lg:bg-transparent text-on-surface-variant hover:bg-primary/5 hover:text-primary'}`}
                >
                  <span className="material-symbols-outlined text-sm">fact_check</span> Applications
                </button>
              </div>
            </div>

            {/* Application Status Widget */}
            <div className="bg-surface-container-low p-6 rounded-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full -mr-12 -mt-12"></div>
              <h3 className="font-headline font-bold text-on-surface mb-4">Live Track</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                  <span className="text-sm font-medium text-slate-600">Pending</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                    {applications.filter(a => a.status === 'Pending').length}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                  <span className="text-sm font-medium text-slate-600">Shortlisted</span>
                  <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs font-bold rounded">
                    {applications.filter(a => a.status === 'Shortlisted').length}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            
            {active === "jobs" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-on-surface-variant text-sm font-medium">Showing <span className="font-bold text-on-surface">{jobs.length}</span> jobs matches for your profile</p>
                  <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
                    <span>Sort by:</span>
                    <select className="bg-transparent border-none outline-none font-bold text-on-surface cursor-pointer focus:ring-0">
                      <option>Relevance</option>
                      <option>Newest</option>
                    </select>
                  </div>
                </div>

                {jobs.map(job => (
                  <Link 
                    key={job._id} 
                    to={`/job/${job._id}`}
                    className="group bg-surface-container-lowest p-8 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_24px_32px_-12px_rgba(25,28,29,0.06)] transition-all duration-300 relative overflow-hidden block no-underline"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex flex-col md:flex-row items-start justify-between">
                      <div className="flex items-start space-x-6">
                        <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden shrink-0">
                          {job.logo ? (
                             <img src={job.logo} alt={job.company} className="w-10 h-10 object-contain" />
                          ) : (
                             <span className="material-symbols-outlined text-outline">business</span>
                          )}
                        </div>
                        <div className="space-y-1 text-left">
                          {job.score > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-700 mb-1 shadow-sm">
                              <span className="material-symbols-outlined text-[12px]">auto_awesome</span> AI Match
                            </span>
                          )}
                          <h2 className="text-xl font-headline font-bold text-primary group-hover:text-blue-800 transition-colors">{job.title}</h2>
                          <p className="text-sm font-semibold text-on-surface">{job.company}</p>
                          <div className="flex flex-wrap gap-4 pt-2 text-on-surface-variant text-sm">
                            <span className="flex items-center"><span className="material-symbols-outlined text-base mr-1">business_center</span> {job.jobType || job.type || 'Full Time'}</span>
                            <span className="flex items-center"><span className="material-symbols-outlined text-base mr-1">location_on</span> {job.location || 'N/A'}</span>
                            <span className="flex items-center"><span className="material-symbols-outlined text-base mr-1">payments</span> {job.salary || 'Competitive'}</span>
                          </div>
                          {job.skillsRequired && job.skillsRequired.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-3">
                                {job.skillsRequired.map((skill, i) => (
                                    <span key={i} className="text-[11px] font-bold px-2.5 py-1 bg-outline-variant/10 text-on-surface rounded-md">{skill}</span>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <span className="bg-secondary text-white font-bold px-8 py-3 rounded-lg shadow-lg shadow-secondary/10 hover:bg-secondary-hover transition-all active:scale-95 inline-block">View Details</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            )}

            {active === "applications" && (
              <div className="bg-surface-container-lowest p-8 rounded-xl sunken-shadow">
                <h2 className="text-2xl font-headline font-bold text-on-surface mb-6">My Applications</h2>
                {applications.length === 0 ? (
                  <p className="text-on-surface-variant">No applications yet.</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map(app => (
                      <div key={app._id} className="border border-outline-variant/30 rounded-lg p-5 flex justify-between items-center hover:bg-surface transition-colors">
                        <div>
                          <h3 className="font-bold text-lg">{app.job?.title || 'Unknown Role'}</h3>
                          <p className="text-on-surface-variant text-sm">{app.job?.company || 'Company'}</p>
                        </div>
                        <div>
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                            app.status === 'Shortlisted' ? 'bg-pink-100 text-pink-700' :
                            app.status === 'Interview' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {['profile', 'education', 'skills', 'projects'].includes(active) && (
              <div className="bg-surface-container-lowest p-8 rounded-xl sunken-shadow">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-headline font-bold text-on-surface capitalize">{active}</h2>
                  {!editing && (
                    <button onClick={() => setEditing(true)} className="flex items-center text-primary font-bold hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-sm mr-2">edit</span> Edit Mode
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {active === "profile" && (
                    <div>
                      {editing ? (
                        <>
                          <label className="block text-sm font-bold text-on-surface-variant mb-2 uppercase tracking-widest">About Me</label>
                          <textarea className="w-full p-4 border border-outline-variant/40 rounded-lg outline-none focus:ring-2 ring-primary transition-shadow bg-transparent" rows="5" value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
                        </>
                      ) : (
                        <p className="text-on-surface-variant leading-relaxed">{user.about || "No profile summary added yet."}</p>
                      )}
                    </div>
                  )}

                  {active === "education" && (
                    <div className="space-y-4">
                      {editing ? (
                        <>
                          {(Array.isArray(form.education) ? form.education : []).map((edu, i) => (
                            <div key={i} className="border border-outline-variant/30 p-4 rounded-lg bg-surface-container-low space-y-3">
                              <input name="institution" placeholder="Institution Name" className="w-full p-3 border border-outline-variant/40 rounded outline-none focus:ring-1 ring-primary bg-white" value={edu.institution || ""} onChange={(e) => handleEducation(i, e)} />
                              <input name="degree" placeholder="Degree / Course" className="w-full p-3 border border-outline-variant/40 rounded outline-none focus:ring-1 ring-primary bg-white" value={edu.degree || ""} onChange={(e) => handleEducation(i, e)} />
                              <input name="year" placeholder="Year of Passing" className="w-full p-3 border border-outline-variant/40 rounded outline-none focus:ring-1 ring-primary bg-white" value={edu.year || ""} onChange={(e) => handleEducation(i, e)} />
                            </div>
                          ))}
                          <button onClick={addEducation} className="flex items-center text-primary font-bold hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors border border-primary">
                            <span className="material-symbols-outlined text-sm mr-2">add</span> Add Education
                          </button>
                        </>
                      ) : (
                        <div className="space-y-4">
                          {user.education && Array.isArray(user.education) && user.education.length > 0 ? user.education.map((edu, i) => (
                            <div key={i} className="border border-outline-variant/20 p-5 rounded-lg">
                              <h3 className="font-bold text-lg text-primary">{edu.institution}</h3>
                              <p className="text-on-surface-variant text-sm mt-1 mb-1 font-semibold">{edu.degree}</p>
                              <p className="text-on-surface text-sm">{edu.year}</p>
                            </div>
                          )) : <p className="text-on-surface-variant">No education details added.</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {active === "skills" && (
                    <div>
                      {editing ? (
                        <div className="space-y-4">
                          <label className="block text-sm font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Add Skills (Press Enter or click Add)</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              list="popular-skills"
                              className="w-full p-4 border border-outline-variant/40 rounded-lg outline-none focus:ring-2 ring-primary transition-shadow bg-transparent" 
                              placeholder="e.g. JavaScript, AWS, Marketing..."
                              value={skillInput} 
                              onChange={(e) => setSkillInput(e.target.value)} 
                              onKeyDown={addSkill}
                            />
                            <button onClick={addSkill} className="bg-primary/20 text-primary px-6 rounded-lg font-bold hover:bg-primary/30 transition-all">Add</button>
                          </div>
                          <datalist id="popular-skills">
                            <option value="JavaScript" />
                            <option value="React" />
                            <option value="Node.js" />
                            <option value="Python" />
                            <option value="Java" />
                            <option value="C++" />
                            <option value="HTML" />
                            <option value="CSS" />
                            <option value="SQL" />
                            <option value="MongoDB" />
                            <option value="AWS" />
                            <option value="Docker" />
                            <option value="Figma" />
                          </datalist>
                          <div className="flex flex-wrap gap-2 pt-2">
                             {form.skills.map((s, i) => (
                               <span key={i} className="px-3 py-1 bg-primary/10 text-primary font-medium rounded-full text-sm flex items-center gap-2 group">
                                 {s}
                                 <button type="button" onClick={() => removeSkill(s)} className="material-symbols-outlined text-[16px] hover:text-red-500 font-bold transition-colors">close</button>
                               </span>
                             ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {user.skills?.length > 0 ? user.skills.map((s, i) => (
                            <span key={i} className="px-3 py-1 bg-surface-container-high text-on-surface-variant font-medium rounded-full text-sm shadow-sm">{s}</span>
                          )) : <p className="text-on-surface-variant">No skills added.</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {active === "projects" && (
                    <div className="space-y-4">
                      {editing ? (
                        <>
                          {form.projects.map((p, i) => (
                            <div key={i} className="border border-outline-variant/30 p-4 rounded-lg bg-surface-container-low space-y-3">
                              <input name="title" placeholder="Project Title" className="w-full p-3 border border-outline-variant/40 rounded outline-none focus:ring-1 ring-primary bg-white" value={p.title} onChange={(e) => handleProject(i, e)} />
                              <input name="link" placeholder="Project Link" className="w-full p-3 border border-outline-variant/40 rounded outline-none focus:ring-1 ring-primary bg-white" value={p.link} onChange={(e) => handleProject(i, e)} />
                              <textarea name="description" placeholder="Description" rows="2" className="w-full p-3 border border-outline-variant/40 rounded outline-none focus:ring-1 ring-primary bg-white" value={p.description} onChange={(e) => handleProject(i, e)} />
                            </div>
                          ))}
                          <button onClick={addProject} className="flex items-center text-primary font-bold hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors border border-primary">
                            <span className="material-symbols-outlined text-sm mr-2">add</span> Add Project
                          </button>
                        </>
                      ) : (
                        <div className="space-y-4">
                          {user.projects?.length > 0 ? user.projects.map((p, i) => (
                            <div key={i} className="border border-outline-variant/20 p-5 rounded-lg">
                              <h3 className="font-bold text-lg text-primary">{p.title}</h3>
                              {p.link && <a href={p.link} className="text-sm text-secondary hover:underline mb-2 inline-block relative z-10">{p.link}</a>}
                              <p className="text-on-surface-variant text-sm mt-2">{p.description}</p>
                            </div>
                          )) : <p className="text-on-surface-variant">No projects added.</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Save Button for all forms */}
                  {editing && (
                    <div className="mt-8 pt-6 border-t border-outline-variant/20 flex gap-4">
                      <button onClick={saveData} className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-md">
                        Save Changes
                      </button>
                      <button onClick={() => { setEditing(false); setSkillInput(""); fetchUser(); }} className="px-8 py-3 bg-surface-container text-on-surface font-bold rounded-lg hover:bg-outline-variant transition-all">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}