import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

export default function JobSearchAutocomplete({ placeholder = "Search by job title or company name...", onSearchChange, initialValue = "" }) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [jobs, setJobs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Fetch all jobs globally once mounted
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch (err) {
    
        setJobs([
          { _id: '1', title: 'Associate Financial Analyst', company: 'Google India' },
          { _id: '2', title: 'Business Development', company: 'Stripe Finance' }
        ]);
        console.error("Autocomplete failed to fetch jobs", err);
      }
    };
    fetchAllJobs();
  }, []);

  
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (onSearchChange) {
      onSearchChange(value);
    }

    if (value.trim().length > 0) {
      const filtered = jobs.filter(
        (job) =>
          job.title?.toLowerCase().includes(value.toLowerCase()) ||
          job.company?.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (jobId) => {
    setShowSuggestions(false);
    navigate(`/job/${jobId}`);
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
    
      handleSuggestionClick(suggestions[0]._id || suggestions[0].id);
    } else if (e.key === "Enter") {
       
       if (onSearchChange) {
           navigate('/jobs'); 
       }
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        className="w-full bg-transparent border-none focus:outline-none text-on-surface py-3 px-2 placeholder:text-outline-variant font-medium"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleEnterPress}
        onFocus={() => {
            if (searchTerm.trim().length > 0 && suggestions.length > 0) {
                setShowSuggestions(true);
            }
        }}
        autoComplete="off"
      />

      {/* Floating Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.1)] overflow-hidden max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <li className="px-4 py-2 text-xs font-bold text-outline-variant uppercase tracking-widest bg-surface-container-low/50">
            Available Matches
          </li>
          {suggestions.map((job) => (
            <li
              key={job._id || job.id}
              onClick={() => handleSuggestionClick(job._id || job.id)}
              className="px-4 py-3 hover:bg-primary/5 cursor-pointer flex items-center gap-3 border-b border-outline-variant/10 last:border-0 transition-colors"
            >
              <div className="w-8 h-8 rounded-md bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/10">
                 <span className="material-symbols-outlined text-outline text-[18px]">business_center</span>
              </div>
              <div className="flex flex-col">
                <span className="text-on-surface font-bold text-sm tracking-tight">{job.title}</span>
                <span className="text-on-surface-variant text-xs">{job.company} • {job.type || "Full Time"}</span>
              </div>
              <span className="material-symbols-outlined text-outline/50 ml-auto text-[18px] group-hover:text-primary transition-colors">arrow_outward</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
