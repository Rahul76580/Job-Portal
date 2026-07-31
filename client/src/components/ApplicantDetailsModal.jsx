import React from "react";
import { assets } from "../assets/assets";

const ApplicantDetailsModal = ({ applicant, isOpen, onClose, onStatusChange }) => {
  if (!isOpen || !applicant) return null;

  const candidate = applicant.userId || {};
  const job = applicant.jobId || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400 p-0.5"
              src={candidate.image || assets.profile_img}
              alt=""
            />
            <div>
              <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full">
                Candidate Profile Review
              </span>
              <h3 className="text-xl font-bold mt-0.5">{candidate.name || "Candidate Name"}</h3>
              <p className="text-xs text-gray-300">Applying for: <span className="font-semibold text-blue-300">{job.title || "Position"}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 h-8 w-8 rounded-full flex items-center justify-center text-lg"
          >
            ✕
          </button>
        </div>

        {/* Candidate Insights */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* AI Score Breakdown Card */}
          <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-indigo-950 text-sm">🤖 Candidate AI Score: 92% Match</p>
              <p className="text-indigo-700 text-[11px] mt-0.5">High skill compatibility & relevant experience criteria met.</p>
            </div>
            <span className="bg-indigo-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-sm">
              Tier 1 Fit
            </span>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-gray-700">
            <div>
              <span className="font-bold block text-gray-500 text-[10px] uppercase">Email</span>
              <span className="font-semibold text-sm">{candidate.email || "candidate@example.com"}</span>
            </div>
            <div>
              <span className="font-bold block text-gray-500 text-[10px] uppercase">Location</span>
              <span className="font-semibold text-sm">{job.location || "Remote"}</span>
            </div>
          </div>

          {/* Resume Viewer CTA */}
          <div className="flex items-center justify-between bg-blue-50/70 p-3.5 rounded-xl border border-blue-200">
            <div>
              <span className="font-bold text-blue-900 block">Candidate PDF Resume</span>
              <span className="text-blue-700 text-[11px]">Click to inspect full resume document</span>
            </div>
            <a
              href={candidate.resume || "#"}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-xs shadow-2xs flex items-center gap-1.5"
            >
              <span>View Resume</span>
              <img className="h-3.5 w-3.5" src={assets.resume_download_icon} alt="" />
            </a>
          </div>

          {/* Status Decision Footer */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-gray-500">Current Status: <span className="text-gray-900 font-bold">{applicant.status}</span></span>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onStatusChange(applicant._id, "Accepted");
                  onClose();
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-2xs transition-all active:scale-95"
              >
                Accept Candidate
              </button>
              <button
                onClick={() => {
                  onStatusChange(applicant._id, "Rejected");
                  onClose();
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-2xs transition-all active:scale-95"
              >
                Reject Application
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ApplicantDetailsModal;
