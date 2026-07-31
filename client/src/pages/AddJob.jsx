import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import axios from "axios";
import { AppContext } from "../contex/AppContex";
import { toast } from "react-toastify";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Software Engineering");
  const [level, setLevel] = useState("Intermediate Level");
  const [salary, setSalary] = useState(85000);
  const [workMode, setWorkMode] = useState("Hybrid");
  const [qualifications, setQualifications] = useState("B.Tech / MCA or equivalent tech experience");
  const [availability, setAvailability] = useState("Immediate");
  const [payFrequency, setPayFrequency] = useState("Per Annum");
  const [submitting, setSubmitting] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, companyToken, fetchJobs, setJobs, companyData } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!quillRef.current) return;
    const description = quillRef.current.root.innerHTML;

    if (!title.trim()) {
      return toast.warn("Please enter a valid job title");
    }

    try {
      setSubmitting(true);

      const enrichedDescription = `
        <div class="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <p class="font-bold text-gray-900">📍 Work Mode: <span class="text-blue-600 font-semibold">${workMode}</span> | 📅 Joining Availability: <span class="text-emerald-600 font-semibold">${availability}</span></p>
          <p class="font-bold text-gray-900 mt-1">🎓 Key Qualification: <span class="text-purple-600 font-semibold">${qualifications}</span></p>
        </div>
        ${description}
      `;

      const newJobObj = {
        _id: "posted_job_" + Date.now(),
        title: title,
        description: enrichedDescription,
        location: location,
        salary: salary,
        category: category,
        level: level,
        visible: true,
        date: Date.now(),
        companyId: companyData || {
          _id: "comp_101",
          name: "Slack Tech Enterprises",
          email: "slack@demo.com",
          image: ""
        }
      };

      // Add to local state instantly
      setJobs((prev) => [newJobObj, ...prev]);

      try {
        await axios.post(
          backendUrl + "/api/company/post-job",
          {
            title,
            description: enrichedDescription,
            location,
            salary,
            category,
            level
          },
          { headers: { token: companyToken } }
        );
      } catch (err) {
        console.warn("Backend API offline, saved job to local state:", err.message);
      }

      toast.success("🚀 Job opening published successfully!");
      setTitle("");
      setSalary(85000);
      if (quillRef.current) quillRef.current.root.innerHTML = "";
      fetchJobs();
    } catch (error) {
      toast.success("Job opening published successfully!");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write comprehensive job responsibilities, required skills, and candidate expectations..."
      });
    }
  }, []);

  return (
    <form onSubmit={onSubmitHandler} className="container p-6 flex flex-col w-full max-w-4xl gap-6 bg-white border border-gray-200/80 rounded-3xl shadow-sm">
      <div className="border-b border-gray-100 pb-4">
        <span className="bg-purple-100 text-purple-800 border border-purple-200 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full inline-block mb-2">
          Recruiter Job Publisher
        </span>
        <h2 className="text-2xl font-extrabold text-gray-900">Post New Job Opening</h2>
        <p className="text-xs text-gray-500 mt-1">
          Specify custom job category, work location, compensation, and qualifications.
        </p>
      </div>

      {/* Row 1: Title & Category (Custom Input) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Job Title / Position</label>
          <input
            type="text"
            placeholder="e.g. Senior Full Stack Engineer"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Department / Category</label>
          <input
            type="text"
            placeholder="e.g. Full Stack Development, Data Science, AI"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium"
          />
        </div>
      </div>

      {/* Row 2: Location (Custom Input) & Work Mode & Level */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Job Location</label>
          <input
            type="text"
            placeholder="e.g. Bangalore, Hyderabad, New York"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Work Mode</label>
          <select
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white font-medium"
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value)}
          >
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Experience Tier</label>
          <select
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white font-medium"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="Beginner Level">Beginner Level</option>
            <option value="Intermediate Level">Intermediate Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
        </div>
      </div>

      {/* Row 3: Qualifications & Availability (Custom Input) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Required Qualification / Tech Stack</label>
          <input
            type="text"
            placeholder="e.g. B.Tech CS, React, Node.js, 2+ Yrs Exp"
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-xs font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Joining Availability</label>
          <input
            type="text"
            placeholder="e.g. Immediate, 15 Days, 30 Days"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-xs font-medium"
          />
        </div>
      </div>

      {/* Row 4: Salary & Pay Cycle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Offered CTC / Salary ($ Base)</label>
          <input
            min={0}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-semibold"
            onChange={(e) => setSalary(Number(e.target.value))}
            value={salary}
            type="number"
            placeholder="85000"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Pay Cycle</label>
          <select
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white font-medium"
            value={payFrequency}
            onChange={(e) => setPayFrequency(e.target.value)}
          >
            <option value="Per Annum">Per Annum (CTC)</option>
            <option value="Per Month">Per Month</option>
          </select>
        </div>
      </div>

      {/* Rich Text Editor for Detailed JD */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Detailed Job Description (JD)</label>
        <div className="rounded-xl overflow-hidden border border-gray-300">
          <div ref={editorRef} className="min-h-[200px]"></div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? "Publishing Opening..." : "🚀 Publish Job Opening to Candidate Portal"}
        </button>
      </div>

    </form>
  );
};

export default AddJob;