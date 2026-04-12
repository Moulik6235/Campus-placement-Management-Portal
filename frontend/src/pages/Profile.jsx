import { useState } from "react";
import API from "../services/api";
import { jsPDF } from "jspdf";
import Navbar from "../components/layout/Navbar";

export default function Profile() {
  // PROFILE
  const [skills, setSkills] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const role = localStorage.getItem("role");

  //FILES
  const [photo, setPhoto] = useState(null);

  // TEMPLATE
  const [template, setTemplate] = useState("modern");

  //  FORM
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    about: "",
    skills: "",
    education: [{ institution: "", degree: "", year: "" }],
    links: "",
    projects: [{ title: "", link: "", description: "" }],
  });

  // ================= PROFILE SAVE =================
  const saveProfile = async () => {
    try {
      await API.put("/users/profile", {
        skills: skills.split(",").map(s => s.trim()),
        preferredJobType: jobType,
        preferredLocation: location,
        about: form.about,
        education: form.education,
        projects: form.projects
      });
      alert("Profile and Resume Data Saved Successfully!");
    } catch (e) {
      alert("Update failed. Please check your connection.");
    }
  };

  // ================= AUTO FILL =================
  const autoFill = async () => {
    try {
      const res = await API.get("/users/profile");
      const user = res.data;

      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        about: user.about || ("Passionate developer skilled in " + (user.skills || []).join(", ")),
        skills: (user.skills || []).join(", "),
        education: user.education?.length > 0 ? user.education : [{ institution: "", degree: "", year: "" }],
        links: user.github || "",
        projects: user.projects?.length > 0 ? user.projects : [{ title: "", link: "", description: "" }],
      });
      setSkills((user.skills || []).join(", "));
      setJobType(user.preferredJobType || "");
      setLocation(user.preferredLocation || "");

      alert("Auto Filled ");
    } catch {
      alert("Auto-fill failed ");
    }
  };

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProject = (i, e) => {
    const arr = [...form.projects];
    arr[i][e.target.name] = e.target.value;
    setForm({ ...form, projects: arr });
  };

  const addProject = () => {
    setForm({
      ...form,
      projects: [...form.projects, { title: "", link: "", description: "" }],
    });
  };

  const handleEducation = (i, e) => {
    const arr = [...form.education];
    arr[i][e.target.name] = e.target.value;
    setForm({ ...form, education: arr });
  };

  const addEducation = () => {
    setForm({
      ...form,
      education: [...form.education, { institution: "", degree: "", year: "" }],
    });
  };

  const handlePhoto = (e) => {
    setPhoto(e.target.files[0]);
  };

  // ================= PDF =================
  const generatePDF = () => {
    const doc = new jsPDF();

    if (photo) {
      const reader = new FileReader();
      reader.onload = function (e) {
        doc.addImage(e.target.result, "JPEG", 150, 10, 40, 40);
        build(doc);
      };
      reader.readAsDataURL(photo);
    } else {
      build(doc);
    }

    function build(doc) {
      let y = 10;

      if (template === "modern") {
        doc.setFontSize(20);
        doc.text(form.name, 10, y);
        y += 8;
        doc.setFontSize(11);
        doc.text(`${form.email} | ${form.phone}`, 10, y);
      }

      if (template === "classic") {
        doc.text("RESUME", 80, y);
        y += 10;
        doc.text(`Name: ${form.name}`, 10, y);
        y += 6;
        doc.text(`Email: ${form.email}`, 10, y);
      }

      if (template === "minimal") {
        doc.setFontSize(16);
        doc.text(form.name, 10, y);
      }

      y += 10;
      doc.text("About", 10, y);
      y += 6;
      doc.text(form.about || "-", 10, y);

      y += 10;
      doc.text("Skills", 10, y);
      y += 6;
      doc.text(form.skills || "-", 10, y);

      y += 10;
      doc.text("Education", 10, y);
      y += 6;
      form.education.forEach((edu) => {
        if (!edu.degree) return;
        doc.text(`${edu.degree} - ${edu.institution} (${edu.year})`, 10, y);
        y += 6;
      });

      y += 10;
      doc.text("Projects", 10, y);
      y += 6;

      form.projects.forEach((p, i) => {
        if (!p.title) return;
        doc.text(`${i + 1}. ${p.title}`, 10, y);
        y += 5;
        doc.text(`Link: ${p.link}`, 10, y);
        y += 5;
        doc.text(p.description, 10, y);
        y += 8;
      });

      y += 5;
      doc.text("Links", 10, y);
      y += 6;
      doc.text(form.links || "-", 10, y);

      doc.save(`${form.name || "resume"}.pdf`);
    }
  };

  // ================= UI =================
  return (
    <div className="bg-surface text-on-surface min-h-screen font-body flex flex-col">
      <Navbar />

      <main className="max-w-screen-xl mx-auto px-6 py-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold font-headline">My Profile</h1>
            <p className="text-on-surface-variant text-sm mt-1">Manage your career preferences and resume</p>
          </div>
          <button onClick={autoFill} className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">magic_button</span> Auto Fill Data
          </button>
        </div>

        {role === "company" ? (
          <div className="max-w-3xl mx-auto bg-surface-container-lowest rounded-3xl p-8 sm:p-12 shadow-sm border border-outline-variant/15">
            <h2 className="text-2xl font-bold font-headline mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">business</span>
              Company Details
            </h2>
            
            <div className="space-y-6">
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Company Name</label>
                  <input 
                    className="w-full bg-surface-container-low border border-transparent rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface outline-none font-medium" 
                    value={form.name} 
                    name="name"
                    onChange={handleChange}
                  />
               </div>

               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Official Email</label>
                  <input 
                    className="w-full bg-surface-container-low border border-transparent rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface outline-none font-medium opacity-70" 
                    value={form.email} 
                    disabled
                  />
               </div>

               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">About the Company</label>
                  <textarea 
                    className="w-full bg-surface-container-low border border-transparent rounded-xl py-4 px-5 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface outline-none font-medium resize-none" 
                    rows={5}
                    placeholder="Describe your company's mission, culture, and what you look for in candidates..."
                    name="about"
                    value={form.about}
                    onChange={handleChange}
                  />
               </div>

               <button 
                  onClick={saveProfile} 
                  className="w-full mt-4 bg-primary text-white py-4 rounded-xl font-bold transition-all active:scale-[0.98] flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
               >
                  <span className="material-symbols-outlined">save</span>
                  Update Company Profile
               </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* PROFILE / PREFERENCES*/}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-outline-variant/15">
              <h2 className="text-xl font-bold font-headline mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">manage_accounts</span> Career Preferences
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Target Skills (comma separated)</label>
                  <input className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-on-surface outline-none" placeholder="React, Node.js, UI/UX" value={skills} onChange={(e) => setSkills(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Preferred Job Type</label>
                  <select className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-on-surface outline-none appearance-none" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                    <option value="">Select Job Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Preferred Location</label>
                  <input className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-on-surface outline-none" placeholder="e.g. Bangalore, Remote" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>

                <button onClick={saveProfile} className="w-full mt-4 bg-secondary hover:bg-secondary-container hover:text-on-secondary-container text-on-secondary py-3 rounded-xl font-bold transition-colors active:scale-[0.98] flex justify-center items-center gap-2 shadow-sm shadow-secondary/20">
                  <span className="material-symbols-outlined text-[18px]">save</span> Save Profile & Resume
                </button>
              </div>
            </div>
          </div>

          {/* RESUME BUILDER */}
          <div className="lg:col-span-8">
            <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-outline-variant/15">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-headline flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">description</span> ATS Resume Builder
                </h2>
                
                <button onClick={generatePDF} className="bg-primary text-on-primary hover:bg-primary-fixed hover:text-on-primary-fixed px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2 shadow-sm shadow-primary/20">
                  <span className="material-symbols-outlined text-[18px]">download</span> Export PDF
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pt-2 border-t border-outline-variant/20">
                <div className="space-y-1.5 mt-4">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Template Style</label>
                  <select onChange={(e)=>setTemplate(e.target.value)} value={template} className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-on-surface outline-none appearance-none">
                    <option value="modern">Modern (Recommended)</option>
                    <option value="classic">Classic (Standard)</option>
                    <option value="minimal">Minimal (Clean)</option>
                  </select>
                </div>
                
                <div className="space-y-1.5 mt-4">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Profile Photo (Optional)</label>
                  <input type="file" onChange={handlePhoto} className="w-full file:bg-primary/10 file:text-primary file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4 file:font-semibold file:cursor-pointer text-sm text-on-surface-variant cursor-pointer py-1.5" accept="image/*"/>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Full Name</label>
                    <input name="name" placeholder="John Doe" className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none" value={form.name} onChange={handleChange}/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</label>
                    <input name="email" placeholder="john@example.com" className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none" value={form.email} onChange={handleChange}/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Phone</label>
                    <input name="phone" placeholder="+91 9876543210" className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none" value={form.phone} onChange={handleChange}/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Portfolio / GitHub Links</label>
                    <input name="links" placeholder="github.com/johndoe" className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none" value={form.links} onChange={handleChange}/>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Education History</label>
                  </div>
                  
                  {form.education.map((edu, i) => (
                    <div key={i} className="p-5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest/50 relative">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                          <input name="degree" placeholder="Degree (e.g. B.Com)" className="w-full bg-surface-container-low rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary text-sm" value={edu.degree} onChange={(e)=>handleEducation(i,e)} />
                        </div>
                        <div className="md:col-span-1">
                          <input name="institution" placeholder="Institution / College" className="w-full bg-surface-container-low rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary text-sm" value={edu.institution} onChange={(e)=>handleEducation(i,e)} />
                        </div>
                        <div className="md:col-span-1">
                          <input name="year" placeholder="Year / Grade" className="w-full bg-surface-container-low rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary text-sm" value={edu.year} onChange={(e)=>handleEducation(i,e)} />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button onClick={addEducation} className="flex items-center gap-1 text-sm font-bold text-primary hover:bg-primary/5 px-3 py-2 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[18px]">add</span> Add more education
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Technical & Soft Skills</label>
                  <input name="skills" placeholder="React, Express, Public Speaking" className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none" value={form.skills} onChange={handleChange}/>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Professional Summary (About)</label>
                  <textarea name="about" placeholder="Write a 2-3 line professional bio..." rows={3} className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none resize-none" value={form.about} onChange={handleChange}/>
                </div>

                <div className="space-y-4 pt-4 border-t border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">build</span> Key Projects
                    </h3>
                  </div>
                  
                  {form.projects.map((p, i) => (
                    <div key={i} className="p-5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest/50 relative group">
                      <div className="absolute -left-3 top-5 bg-surface-container-high text-on-surface-variant w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">{i+1}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="title" placeholder="Project Title" className="w-full bg-surface-container-low rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary" value={p.title} onChange={(e)=>handleProject(i,e)} />
                        <input name="link" placeholder="Live Link / Repo URL" className="w-full bg-surface-container-low rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary" value={p.link} onChange={(e)=>handleProject(i,e)} />
                      </div>
                      <textarea name="description" placeholder="Short description of what you accomplished..." rows={2} className="w-full bg-surface-container-low rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary mt-3 resize-none" value={p.description} onChange={(e)=>handleProject(i,e)} />
                    </div>
                  ))}

                  <button onClick={addProject} className="flex items-center gap-1 text-sm font-bold text-primary hover:bg-primary/5 px-3 py-2 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[18px]">add</span> Add Another Project
                  </button>
                </div>

              </div>
            </div>
          </div>
          
        </div>
        )}
      </main>
    </div>
  );
}