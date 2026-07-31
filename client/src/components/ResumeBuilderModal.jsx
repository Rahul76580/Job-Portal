import React, { useState, useContext } from "react";
import { AppContext } from "../contex/AppContex";
import { toast } from "react-toastify";

const ResumeBuilderModal = ({ isOpen, onClose }) => {
  const { setCandidateBuiltResume, fetchUserData } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "Rahul Singh",
    title: "Full Stack Developer",
    email: "rahul.developer@example.com",
    phone: "+91 98765 43210",
    summary:
      "Passionate developer with expertise in React, Node.js, Express, MongoDB, and modern web applications. Experienced in building scalable SaaS tools and REST APIs.",
    skills: "React, Node.js, Express, MongoDB, JavaScript, TailwindCSS, REST APIs, Git",
    experience: "Software Engineer at TechCorp (2023 - Present) - Built high-throughput API endpoints and reactive React dashboards.",
    education: "B.Tech in Computer Science & Engineering (2020 - 2024)"
  });

  const [generating, setGenerating] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveResume = () => {
    setGenerating(true);
    setTimeout(() => {
      const resumeData = {
        ...formData,
        skillsList: formData.skills.split(",").map((s) => s.trim()),
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem("builtResume", JSON.stringify(resumeData));
      if (setCandidateBuiltResume) {
        setCandidateBuiltResume(resumeData);
      }

      setGenerating(false);
      toast.success("✨ Custom Resume built & attached to profile successfully!");
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 flex justify-between items-center">
          <div>
            <span className="bg-blue-400/20 text-blue-300 border border-blue-400/30 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full">
              Instant AI Resume Builder
            </span>
            <h2 className="text-xl font-bold mt-1">Create Professional Resume</h2>
            <p className="text-xs text-gray-300">Generate a candidate profile resume in seconds to auto-apply for jobs.</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 h-8 w-8 rounded-full flex items-center justify-center text-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body: Form & Preview */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
          
          {/* Left Form Inputs */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 pb-1 border-b border-gray-100">Candidate Information</h3>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Professional Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Key Skills (Comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Professional Summary</label>
              <textarea
                rows={2}
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Work Experience</label>
              <textarea
                rows={2}
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>
          </div>

          {/* Right Live Resume Card Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start border-b border-slate-200 pb-3 mb-3">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">{formData.name || "Candidate Name"}</h4>
                  <p className="text-xs font-semibold text-blue-600">{formData.title || "Job Title"}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  ✓ Verified Format
                </span>
              </div>

              <div className="text-[11px] text-slate-600 space-y-2">
                <p>📧 {formData.email} | 📞 {formData.phone}</p>
                
                <div>
                  <p className="font-bold text-slate-800 text-xs mt-2">Summary:</p>
                  <p className="leading-snug">{formData.summary}</p>
                </div>

                <div>
                  <p className="font-bold text-slate-800 text-xs mt-2">Top Skills:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.skills.split(",").map((s, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-bold text-slate-800 text-xs mt-2">Experience & Background:</p>
                  <p className="leading-snug text-[10px]">{formData.experience}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 text-center">
              <p className="text-[10px] text-slate-400">Live resume card generated dynamically</p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveResume}
            disabled={generating}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-2 rounded-xl shadow-md transition-all active:scale-95"
          >
            {generating ? "Building Resume..." : "✨ Attach Built Resume to Profile"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResumeBuilderModal;
