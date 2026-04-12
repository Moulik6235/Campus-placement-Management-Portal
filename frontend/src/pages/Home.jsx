import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import API from "../services/api";
import JobSearchAutocomplete from "../components/features/jobs/JobSearchAutocomplete";

const Home = () => {
  const isLoggedIn = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const role = localStorage.getItem("role");
        const endpoint = role === "student" ? "/jobs/recommended" : "/jobs";
        const res = await API.get(endpoint);
        setJobs(res.data.slice(0, 4));
      } catch (err) {
        // Silently handle error for production feel
      }
    };
    if (isLoggedIn) fetchJobs();
  }, [isLoggedIn]);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-6 overflow-hidden bg-surface-container-low">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary rounded-full blur-[120px] -ml-48 -mb-48"></div>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            {isLoggedIn && userRole === 'company' ? (
              <div className="py-12 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-secondary/5 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-secondary/10">
                  <span className="material-symbols-outlined text-secondary text-5xl">handshake</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-4">Empowering Your <span className="text-primary">Recruitment</span></h1>
                <p className="text-xl text-on-surface-variant mb-10 max-w-xl mx-auto font-medium leading-relaxed">
                  Welcome to the GCCBA Hiring Portal. Discover top talent, manage listings, and bridge the gap between education and industry excellence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to='/company/dashboard'
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/30 flex items-center gap-3 text-lg"
                  >
                    <span className="material-symbols-outlined">dashboard</span>
                    Go to Dashboard
                  </Link>
                  <Link
                    to='/company/post-job'
                    className="bg-secondary text-white px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-secondary/30 flex items-center gap-3 text-lg"
                  >
                    <span className="material-symbols-outlined">add_circle</span>
                    Post New Job
                  </Link>
                </div>
              </div>
            ) : isLoggedIn && userRole === 'admin' ? (
              <div className="py-12 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-primary/5 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/10">
                  <span className="material-symbols-outlined text-primary text-5xl">admin_panel_settings</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-4">Hello, Administrator</h1>
                <p className="text-xl text-on-surface-variant mb-10 max-w-xl mx-auto font-medium">
                  Welcome to your management overview. Access your specialized tools and analytics via the dashboard link below.
                </p>
                <Link
                  to='/admin/dashboard'
                  className="bg-primary text-white px-10 py-5 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/30 flex items-center gap-3 mx-auto text-lg w-fit"
                >
                  <span className="material-symbols-outlined">dashboard</span>
                  Go to Admin Dashboard
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface mb-6 leading-tight">
                  {isLoggedIn ? (
                    <>Welcome back. <span className="text-primary">Ready to Explore & Grow?</span></>
                  ) : (
                    <>Connecting Ambition with <span className="text-primary">Global Opportunity</span></>
                  )}
                </h1>
                <p className="text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto font-medium">
                  {isLoggedIn ? (
                    <>Access premium opportunities from global industry leaders curated specifically for your profile.</>
                  ) : (
                    <>Your gateway to world-class placements and internships. Join thousands of students building their futures at GCCBA Chandigarh.</>
                  )}
                </p>

                {/* Search Bar (Hero Component) */}
                <div className="bg-surface-container-lowest rounded-2xl md:rounded-xl sunken-shadow p-2 flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto">
                  <div className="flex-1 flex items-center px-4 py-3 w-full">
                    <span className="material-symbols-outlined text-outline mr-3">work</span>
                    <JobSearchAutocomplete
                      placeholder="Role or Company"
                      onSearchChange={(val) => setSearch(val)}
                      initialValue={search}
                    />
                  </div>
                  <div className="hidden md:block w-px h-10 bg-outline-variant/10"></div>
                  <div className="flex-1 flex items-center px-4 py-3 w-full border-y md:border-y-0 border-outline-variant/10 bg-surface-container-low md:bg-transparent">
                    <span className="material-symbols-outlined text-outline mr-3">location_on</span>
                    <input className="w-full bg-transparent border-none focus:outline-none text-on-surface placeholder:text-outline-variant" placeholder="Location" type="text" />
                  </div>
                  <div className="hidden md:block w-px h-10 bg-outline-variant/10"></div>
                  <div className="flex-1 flex items-center px-4 py-3 w-full">
                    <span className="material-symbols-outlined text-outline mr-3">star</span>
                    <select className="w-full bg-transparent border-none focus:outline-none text-on-surface appearance-none">
                      <option>Experience</option>
                      <option>Fresher</option>
                      <option>1-3 Years</option>
                      <option>3+ Years</option>
                    </select>
                  </div>
                  <Link
                    to='/jobs'
                    className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-xl md:rounded-lg font-bold hover:bg-primary-hover transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                  >
                    Search Jobs
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Stats Section */}
        {userRole !== 'admin' && userRole !== 'company' && (
          <section className="max-w-6xl mx-auto -mt-16 relative z-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="bg-surface-container-lowest p-8 rounded-xl sunken-shadow border-t-4 border-primary">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg text-primary">
                  <span className="material-symbols-outlined text-3xl">groups</span>
                </div>
                <div className="text-3xl font-extrabold text-on-surface">1K+</div>
              </div>
              <p className="text-on-surface-variant font-medium">Students Placed</p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-xl sunken-shadow border-t-4 border-secondary">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-secondary/10 p-3 rounded-lg text-secondary">
                  <span className="material-symbols-outlined text-3xl">apartment</span>
                </div>
                <div className="text-3xl font-extrabold text-on-surface">100+</div>
              </div>
              <p className="text-on-surface-variant font-medium">Active Hiring Partners</p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-xl sunken-shadow border-t-4 border-tertiary">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-tertiary/10 p-3 rounded-lg text-tertiary">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                </div>
                <div className="text-3xl font-extrabold text-on-surface">94%</div>
              </div>
              <p className="text-on-surface-variant font-medium">Placement Success Rate</p>
            </div>
          </section>
        )}

        {/* Hiring Partners Carousel */}
        {userRole !== 'company' && (
          <section className="py-24 overflow-hidden relative">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-3">Top Companies Hiring Now</h2>
            <p className="text-on-surface-variant font-medium text-lg">Join thousands of GCCBA alumni at premier institutions</p>
          </div>

          <div className="relative w-full flex items-center overflow-hidden max-w-screen-2xl mx-auto before:content-[''] before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[150px] before:bg-gradient-to-r before:from-surface before:to-transparent after:content-[''] after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[150px] after:bg-gradient-to-l after:from-surface after:to-transparent">
            {/* The animated flex container */}
            <div className="animate-marquee gap-12 md:gap-24 w-max px-6">

              {/* Set 1 */}
              <div className="flex shrink-0 items-center gap-14 md:gap-32">
                <img alt="Infosys" className="h-20 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/Infosys.png" />
                <img alt="HDFC" className="h-20 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/hdfc.png" />
                <img alt="ICICI" className="h-16 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/icici.png" />
                <img alt="ITC" className="h-24 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/itc.png" />
                <img alt="Meta" className="h-16 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/meta.png" />
                <img alt="Netflix" className="h-16 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/netflix-svgrepo-com.svg" />
                <img alt="SBI" className="h-20 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/sbi.png" />
                <img alt="Aditya Birla" className="h-20 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/adtiya_birla_group.png" />
                <img alt="Tech Mahindra" className="h-20 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/tech_mahindra.png" />
                <img alt="AU BANK" className="h-20 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/au_bank.png" />
                <img alt="Wipro" className="h-20 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/wipro.png" />
              </div>

              {/* Duplicate Set*/}
              <div className="flex shrink-0 items-center gap-14 md:gap-32">
                <img alt="Infosys" className="h-20 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/Infosys.png" />
                <img alt="HDFC" className="h-20 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/hdfc.png" />
                <img alt="ICICI" className="h-16 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/icici.png" />
                <img alt="ITC" className="h-24 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/itc.png" />
                <img alt="Meta" className="h-16 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/meta.png" />
                <img alt="Netflix" className="h-16 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/netflix-svgrepo-com.svg" />
                <img alt="SBI" className="h-20 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/sbi.png" />
                <img alt="Aditya Birla" className="h-20 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/adtiya_birla_group.png" />
                <img alt="Tech Mahindra" className="h-20 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/tech_mahindra.png" />
                <img alt="AU BANK" className="h-20 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/au_bank.png" />
                <img alt="Wipro" className="h-20 w-auto object-contain shrink-0 hover:scale-110 transition-all cursor-pointer drop-shadow-sm" src="/logos/wipro.png" />
              </div>

            </div>
          </div>
          </section>
        )}

         {/* Featured Jobs Section (Only visible for students) */}
        {isLoggedIn && userRole === 'student' && jobs.length > 0 && (
          <section className="bg-surface-container-low py-24 px-6 md:min-h-[500px]">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-4xl font-bold text-on-surface mb-2">Recommended Jobs</h2>
                  <p className="text-on-surface-variant">Based on your academic profile and preferences.</p>
                </div>
                <Link
                  to='/jobs'
                  className="text-primary font-bold hover:text-primary-hover hover:underline flex items-center gap-2 cursor-pointer transition-colors"
                >
                  View All Opportunities <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {jobs.map(job => (
                  <Link 
                    key={job._id || job.id} 
                    to={`/job/${job._id || job.id}`} 
                    className="bg-surface-container-lowest p-8 rounded-xl sunken-shadow group hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between cursor-pointer no-underline"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-8">
                        <div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center p-2">
                          {job.logo ? (
                            <img className="w-full h-auto object-contain" src={job.logo} alt={job.company} />
                          ) : (
                            <span className="material-symbols-outlined text-primary text-3xl">apartment</span>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-2 text-[10px] ${job.jobType === 'Internship' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                            {job.jobType || job.type || 'Full Time'}
                          </span>
                          <span className="text-on-surface-variant text-sm font-medium">{job.posted || 'Recently'}</span>
                        </div>
                      </div>
                      <div className="mb-2">
                        {job.score > 0 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-700 shadow-sm mb-2">
                            <span className="material-symbols-outlined text-[12px]">auto_awesome</span> AI Match
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">{job.title}</h3>
                      </div>
                      <p className="text-on-surface-variant text-sm mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">apartment</span> {job.company}
                        <span className="mx-2 text-outline-variant">•</span>
                        <span className="material-symbols-outlined text-sm">location_on</span> {job.location || 'Not Specified'}
                      </p>
                      {job.skillsRequired && job.skillsRequired.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-6">
                              {job.skillsRequired.map((skill, i) => (
                                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-outline-variant/10 text-on-surface rounded-full">{skill}</span>
                              ))}
                          </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-on-surface font-bold">{job.salary || 'Competitive'}</span>
                      <span className="bg-secondary text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-secondary-hover active:scale-95 transition-all inline-block">Apply</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Placed Students Section */}
        {userRole !== 'company' && (
          <section className="py-24 px-6 bg-surface">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-on-surface mb-4">Our Star Achievers</h2>
              <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">Meet some of our brightest students who have successfully secured placements at top global companies through the GCCBA Placement Cell.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Rahul Sharma", company: "Infosys", package: "8.5 LPA", image: "/images/students/student1.png", role: "Software Engineer" },
                { name: "Priya Singh", company: "HDFC Bank", package: "7.2 LPA", image: "/images/students/student2.png", role: "Management Trainee" },
                { name: "Amit Patel", company: "ICICI Bank", package: "6.8 LPA", image: "/images/students/student3.png", role: "Relationship Manager" },
                { name: "Sneha Reddy", company: "ITC Limited", package: "9.0 LPA", image: "/images/students/student4.png", role: "Business Analyst" }
              ].map((student, index) => (
                <div key={index} className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10 hover:shadow-xl transition-all duration-300 group">
                  <div className="aspect-[5/4] overflow-hidden bg-slate-200">
                    <img 
                      src={student.image} 
                      alt={student.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                       <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Placed</span>
                       <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{student.company}</span>
                    </div>
                    <h3 className="text-lg font-bold text-on-surface mb-0.5">{student.name}</h3>
                    <p className="text-sm text-on-surface-variant mb-4">{student.role}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                      <span className="text-xs font-medium text-outline">CTC Offered</span>
                      <span className="text-primary font-bold">{student.package}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </section>
        )}

       

        {/* Newsletter / CTA */}
        {userRole !== 'company' && (
          <section className="py-24 px-6 overflow-hidden relative">
          <div className="max-w-6xl mx-auto bg-primary rounded-3xl p-12 md:p-20 relative overflow-hidden text-center text-white">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">Stay Ahead of the Curve</h2>
              <p className="text-blue-100 text-lg mb-10">Get personalized job alerts and career tips delivered to your inbox every week.</p>
              <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                <input className="flex-1 rounded-xl px-6 py-4 text-on-surface border border-white/20 bg-white/10 placeholder:text-white/60 focus:outline-none focus:ring-2 ring-white/50 transition-all font-medium" placeholder="Your University Email" type="email" />
                <button className="bg-white text-primary px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-50 active:scale-95 transition-all outline-none border-none">Subscribe</button>
              </div>
            </div>
          </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-high w-full border-t-0 mt-auto">
        <div className="w-full py-12 px-6 flex flex-col md:flex-row justify-between items-center max-w-screen-2xl mx-auto">
          <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
            <div className="text-md font-bold text-outline uppercase tracking-[2px] mb-4">GCCBA PLACEMENT CELL</div>
            <p className="text-outline-variant text-xs">© 2026 Government College of Commerce and Business Administration. All Rights Reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="text-outline text-xs uppercase hover:text-primary font-bold transition-all" target="_blank" rel="noreferrer" href="https://gccbachd.org/about-us/">About Us</a>
            <a className="text-outline text-xs uppercase hover:text-primary font-bold transition-all" target="_blank" rel="noreferrer" href="https://gccbachd.org/privacy-policy/">Privacy Policy</a>
            <a className="text-outline text-xs uppercase hover:text-primary font-bold transition-all" target="_blank" rel="noreferrer" href="https://gccbaplacementcell.wordpress.com/">Placement Cell Blog</a>
            <a className="text-outline text-xs uppercase hover:text-primary font-bold transition-all" target="_blank" rel="noreferrer" href="https://gccbachd.org/contact-us/">Contact GCCBA</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;