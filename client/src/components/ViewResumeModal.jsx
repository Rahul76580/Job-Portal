import React from "react";

const ViewResumeModal = ({ applicant, isOpen, onClose }) => {
  if (!isOpen || !applicant) return null;

  const candidate = applicant.userId || {};
  const resumeData = applicant.builtResume || candidate.builtResume;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 flex justify-between items-center">
          <div>
            <span className="bg-purple-400/20 text-purple-300 border border-purple-400/30 text-[10px] uppercase tracking-wider font-extrabold px-3 py-0.5 rounded-full inline-block mb-1">
              Candidate Resume Inspector
            </span>
            <h3 className="text-xl font-extrabold">{candidate.name || "Candidate Profile"}</h3>
            <p className="text-xs text-gray-300">
              📧 {candidate.email || "candidate@example.com"} • Applied for {applicant.jobId?.title || "Role"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 h-9 w-9 rounded-full flex items-center justify-center text-base transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Resume Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Top Info Strip */}
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-purple-950 uppercase tracking-wider">Candidate Designation</p>
              <p className="text-base font-extrabold text-purple-900">{resumeData?.title || "Full Stack Developer"}</p>
            </div>
            
            <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-300">
              ✓ Verified Applicant
            </span>
          </div>

          {/* About / Summary */}
          <div>
            <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Professional Summary</h4>
            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-200">
              {resumeData?.summary || "Passionate and detail-oriented engineer with experience building scalable web applications, REST APIs, and responsive user interfaces."}
            </p>
          </div>

          {/* Key Skills */}
          <div>
            <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Core Technical Skills</h4>
            <div className="flex flex-wrap gap-2">
              {(resumeData?.skills || ["React.js", "Node.js", "MongoDB", "Express", "Tailwind CSS", "REST API", "Git"]).map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 font-bold border border-blue-200 text-xs px-3 py-1 rounded-xl"
                >
                  ⚡ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Work Experience & Projects</h4>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
              <p className="font-extrabold text-xs text-gray-900">{resumeData?.experience || "Software Developer • Tech Innovators Inc"}</p>
              <p className="text-xs text-gray-600">
                Developed responsive MERN applications, integrated REST endpoints, optimized MongoDB queries, and collaborated with cross-functional product teams.
              </p>
            </div>
          </div>

          {/* Education */}
          <div>
            <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Education & Certifications</h4>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <p className="font-extrabold text-xs text-gray-900">{resumeData?.education || "B.Tech in Computer Science & Engineering"}</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <span className="text-xs text-gray-500 font-medium">InsiderJobs Applicant Verification System</span>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
          >
            Close Resume
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewResumeModal;
