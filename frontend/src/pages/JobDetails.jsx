import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/layout/Navbar";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const checkAIMatch = async () => {
    setAiLoading(true);
    try {
      const res = await API.post("/ai/match-score", { jobId: id });
      setAiResult(res.data);
    } catch (err) {
      // Error handled silently for production flow
      alert("Error calculating match score. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
    checkIfApplied();
  }, [id]);

  const checkIfApplied = async () => {
    if (localStorage.getItem("token")) {
      try {
        const res = await API.get("/applications/my");
        const applied = res.data.some(app => (app.job?._id || app.job) === id);
        setHasApplied(applied);
      } catch (err) {
        // Silently handle error
      }
    }
  };

  const fetchJob = async () => {
    try {
      const res = await API.get("/jobs");
      const found = res.data.find((j) => j._id === id);
      if (found) {
        setJob(found);
      } else {
        // Dummy data fallback
        setJob({
          _id: id,
          title: 'Senior Product Designer',
          company: 'Global Tech Solutions',
          location: 'Chandigarh, India',
          description: 'We are looking for a Senior Product Designer to lead the evolution of our core recruitment platform. You will work closely with cross-functional teams to translate complex user needs into elegant, high-impact design solutions. This role requires a balance of strategic thinking, user empathy, and meticulous visual craft.',
          salary: '₹18L - ₹24L PA',
          type: 'Full Time',
          experienceRequired: '2 - 4 Years',
          skillsRequired: ['React', 'Node.js', 'Tailwind CSS', 'MongoDB', 'System Design'],
          logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDh1bIZHLLumGwjCdhIhLxoGuEsOQT_zsXimBe1Vl0qQjc1KjD6xm3Myky89qhl-RtxDyEmTmU11jad3cs8mCeFA-Qb5L6MKW9MR-bTWgLJhMDZ6gkYkRwlFgss4aXXKmLhhmP8sgjigkL4ON8MjMYMauj77mb0hXZ3XrA5vOVNEThQzeDwYAwCrcMM7HuM5Qo_4j71YAAit4aOvvaxPQGh8HkkVWsPdWyCVvgl11GVBj2DRG39fdWD8habrikEen5mAkKvdNDEmsCE'
        });
      }
    } catch (err) {
      setJob({
        _id: id,
        title: 'Mocked Job Title',
        company: 'Fallback Company',
        location: 'Remote',
        description: 'Mock description for the job.',
      });
    }
  };

  const applyJob = async (e) => {
    e.preventDefault();
    try {
      if (!resume) return alert("Upload resume first!");

      const formData = new FormData();
      formData.append("jobId", id);
      formData.append("resume", resume);

      await API.post("/applications/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Applied Successfully ");
      setHasApplied(true);
    } catch (err) {
      alert("Error applying ");
    }
  };

  if (!job) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <p className="text-xl font-bold text-primary font-headline animate-pulse">Loading Job Details...</p>
    </div>
  );

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body flex flex-col">
      <Navbar />

      <main className="max-w-screen-2xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 flex-grow w-full">
        {/* Main Content Section */}
        <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Job Header Card */}
          <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-outline-variant/10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container/30 flex items-center justify-center shrink-0 border border-outline-variant/20">
                  {job.logo ? (
                    <img className="w-12 h-12 object-contain" src={job.logo} alt={job.company} />
                  ) : (
                    <span className="material-symbols-outlined text-outline text-3xl">business</span>
                  )}
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold font-headline text-on-surface tracking-tight">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-on-surface-variant font-medium">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-[18px]">business</span> {job.company}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-[18px]">location_on</span> {job.location || "Remote"}</span>
                    {job.salary && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-[18px]">payments</span> {job.salary}</span>}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-xs font-bold rounded-full tracking-wider uppercase">{job.type || "Full Time"}</span>
                    {job.experienceRequired && (
                      <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full tracking-wider uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">work_history</span>
                        {job.experienceRequired}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="self-end md:self-auto text-outline hover:text-primary hover:bg-primary-container/10 p-2 rounded-full transition-colors">
                <span className="material-symbols-outlined text-2xl">bookmark</span>
              </button>
            </div>
          </section>

          {/* Skills Required */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <section className="bg-surface-container-lowest rounded-2xl p-8 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-outline-variant/10">
              <h2 className="text-xl font-bold font-headline border-l-4 border-secondary pl-4">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill, index) => (
                  <span key={index} className="px-4 py-2 bg-surface-container text-on-surface-variant text-sm font-semibold rounded-xl border border-outline-variant/20 hover:bg-primary/5 hover:border-primary/30 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Detailed Job Description */}
          <section className="bg-surface-container-lowest rounded-2xl p-8 space-y-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-outline-variant/10">
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-headline border-l-4 border-primary pl-4">Job Description</h2>
              <p className="text-on-surface-variant leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>
          </section>

          {/* Life at Company Section */}
          <section className="space-y-6 pt-4">
            <h2 className="text-2xl font-extrabold font-headline text-on-surface">Life at {job.company}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="group relative h-48 rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPpaen7IFEr8vjxuAT76cdfvnztZtmj5RDPKewU2ejpVth7cJnNXF9mdPUnmlMm5LAyFkAJ8BrFo7LKVO5_a4A5Pmxl27IBLzvaiDvgnttznmWbYvCZ5f9q1bmP3js-tIlhLpSGQmAWDJNtxREiEG-2YbJsbBfDb7aq_TztdMQaugpH5haVmLu2HMCwxUlXnkJOp4Xv4BewlFPvglcpII_bhRw6C2xu4_81PvbCN2IYY_vfigYn9NdIYJtVyrR3YOsaf2YB8mMobS3" alt="Office Space"/>
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/20 to-transparent flex items-end p-4">
                  <span className="text-white font-bold text-sm tracking-wide">Collaborative Spaces</span>
                </div>
              </div>
              <div className="group relative h-48 rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu3KWygl9qE9uEurftmmvpCFn_tt-NJjpwf_7r5h8VTjxeiUCCGyh1RYf0Xc5seGwKkGxap-XRnfPZeyq-ojjcc9k-41gnDlCB6jTjOOZ8dHAgVPYgXe-VEzn62Dm-0y9MlMRZgTfrVwnryvNug2qGF-Hm8jg2VR5vfL3n4maBhoVULvY0UeSnozqKejYn-ozt7eD64zqJdaysTxVrIRUSho0wRnCe5si8TFIfWL9azI0KBGAFoyDSTTkykOrOHlw8z6lgWuPmJPzK" alt="Team Culture"/>
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/20 to-transparent flex items-end p-4">
                  <span className="text-white font-bold text-sm tracking-wide">Team Culture</span>
                </div>
              </div>
              <div className="group relative h-48 rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmoKTTpi10i9Fzt_SFzJRdbKC6he4FliFfPntejf8voOMzrWPoG3kEZOkOunJbXDAMyQg6vhsInRYzuIQ38WNE6py361BWGpFdHM37gSeLycqO1QRs29eTMDUJw5DRYCK8M9WyLxsvafUJjhh1YK9JAJ3gY9qTQk31AY3lRGtPQdIdOBXEjpcWHgAkR2cRcQ5F-iaKxZlTDHjQL2YjX78_-rwiAbn6m1p9olS6Of-IKxRS1BaT6Veo9IlWHNsLg8kDOwPrWmVrvJcK" alt="Learning"/>
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/20 to-transparent flex items-end p-4">
                  <span className="text-white font-bold text-sm tracking-wide">Learning & Growth</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar: Sticky Application Form */}
        <aside className="lg:col-span-4 animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
          <div className="sticky top-24 space-y-6">
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-outline-variant/15">
              <h3 className="text-2xl font-extrabold font-headline text-on-surface mb-2">Apply for this Role</h3>
              <p className="text-on-surface-variant text-sm mb-6">Complete your application to get noticed.</p>
              
              {/* AI Match Score UI - Only for students */}
              {localStorage.getItem("token") && localStorage.getItem("role") === "student" && (
                <div className="mb-8 p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-4 animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span className="material-symbols-outlined text-primary">analytics</span>
                       <h4 className="font-bold text-on-surface">AI Match Analyzer</h4>
                    </div>
                    {aiResult && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${aiResult.score > 70 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {aiResult.score}% Match
                      </span>
                    )}
                  </div>

                  {!aiResult ? (
                    <div className="space-y-3">
                      <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                        Compare your skills and experience against this role's requirements using our AI engine.
                      </p>
                      <button 
                        onClick={checkAIMatch}
                        disabled={aiLoading}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                      >
                        {aiLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">bolt</span>
                            Check My Match Score
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Score Bar */}
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${aiResult.score > 70 ? 'bg-green-500' : 'bg-amber-500'}`}
                          style={{ width: `${aiResult.score}%` }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {aiResult.matchedSkills?.length > 0 && (
                          <div className="space-y-1.5">
                            <h5 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Matched Skills</h5>
                            <div className="flex flex-wrap gap-1.5">
                              {aiResult.matchedSkills.map((s, i) => (
                                <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded text-[10px] font-bold">{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {aiResult.missingSkills?.length > 0 && (
                          <div className="space-y-1.5">
                            <h5 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Recommended Skills</h5>
                            <div className="flex flex-wrap gap-1.5">
                              {aiResult.missingSkills.map((s, i) => (
                                <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded text-[10px] font-bold">{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-outline-variant/20 shadow-sm">
                         <h5 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">tips_and_updates</span>
                            AI Career Tips
                         </h5>
                         <ul className="space-y-1.5">
                            {aiResult.recommendations?.map((tip, i) => (
                              <li key={i} className="text-[11px] text-on-surface-variant flex gap-2">
                                <span className="text-primary">•</span> {tip}
                              </li>
                            ))}
                         </ul>
                      </div>

                      <button 
                        onClick={() => setAiResult(null)}
                        className="w-full text-[11px] font-bold text-primary hover:underline"
                      >
                        Reset Analysis
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Application Form Section */}
              {localStorage.getItem("token") ? (
                hasApplied ? (
                  <div className="text-center py-6 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                       <span className="material-symbols-outlined text-emerald-600 text-3xl">check_circle</span>
                    </div>
                    <h4 className="font-bold text-emerald-800 mb-2">Already Applied</h4>
                    <p className="text-sm text-emerald-700 mb-2 px-4 font-medium">You have already submitted your application for this position.</p>
                    <Link 
                      to='/dashboard'
                      className="mt-4 px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm inline-block no-underline"
                    >
                      Track Status
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={applyJob} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Full Name</label>
                      <input className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-on-surface outline-none" placeholder="Your Name" type="text" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email Address</label>
                      <input className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-on-surface outline-none" placeholder="you@example.com" type="email" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Resume Upload</label>
                      <div className="relative overflow-hidden border-2 border-dashed border-outline-variant/50 rounded-xl p-6 bg-surface-container-low hover:bg-primary/5 hover:border-primary/50 transition-colors flex flex-col items-center justify-center group cursor-pointer">
                        <input 
                          type="file" 
                          onChange={(e) => setResume(e.target.files[0])} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                          required 
                        />
                        <span className="material-symbols-outlined text-primary text-3xl mb-2 group-hover:-translate-y-1 transition-transform">cloud_upload</span>
                        <p className="text-sm font-bold text-on-surface text-center">
                          {resume ? resume.name : "Click or Drag to Upload"}
                        </p>
                        <p className="text-[10px] text-on-surface-variant mt-1">PDF, DOC (Max 5MB)</p>
                      </div>
                    </div>
                    
                    <button type="submit" className="w-full bg-secondary hover:opacity-90 active:scale-95 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-secondary/20 transition-all flex items-center justify-center gap-2 group mt-6">
                      Submit Application
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  </form>
                )
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4 border border-outline-variant/20">
                     <span className="material-symbols-outlined text-outline text-3xl">lock</span>
                  </div>
                  <h4 className="font-bold text-on-surface mb-2">Authentication Required</h4>
                  <p className="text-sm text-on-surface-variant mb-6 pb-2">You must be logged into your student account to submit applications.</p>
                  <Link 
                    to='/login'
                    className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-md shadow-primary/20 hover:bg-primary-container hover:text-on-primary-container transition-all inline-block no-underline"
                  >
                    Login to Apply
                  </Link>
                </div>
              )}
              <p className="text-[10px] text-on-surface-variant text-center mt-6 uppercase tracking-widest font-bold flex items-center justify-center"><span className="material-symbols-outlined text-[14px] mr-1">lock</span> Safe & Encrypted Transmission</p>
            </div>

            {/* Assistance Card */}
            <div className="bg-primary/5 rounded-2xl p-6 flex flex-col items-start gap-3 border border-primary/10">
              <div className="flex items-center gap-2 w-full">
                <span className="material-symbols-outlined text-primary bg-white p-2 rounded-lg shadow-sm">contact_support</span>
                <h4 className="font-bold text-primary font-headline">Need help applying?</h4>
              </div>
              <p className="text-on-surface-variant text-xs leading-relaxed">Reach out to our placement cell for guidance on crafting the perfect application.</p>
              <a href={`mailto:hr@${job.company?.toLowerCase().replace(/\s+/g,'_')}.com`} className="text-secondary font-bold text-sm mt-1 flex items-center gap-1 hover:underline">
                Contact HR <span className="material-symbols-outlined text-sm">arrow_outward</span>
              </a>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}