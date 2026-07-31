import React from "react";
import { toast } from "react-toastify";

const JobShareModal = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null;

  const jobUrl = window.location.origin + `/apply-job/${job._id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jobUrl);
    toast.success("🔗 Job link copied to clipboard!");
    onClose();
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`, "_blank");
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this job opening: ${job.title} at ${job.companyId?.name || "Company"}`)}&url=${encodeURIComponent(jobUrl)}`, "_blank");
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Applying for ${job.title} at ${job.companyId?.name || "Company"}: ${jobUrl}`)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6">
        
        <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900">Share Job Opening</h3>
            <p className="text-xs text-gray-500">{job.title} at {job.companyId?.name || "Company"}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <button
            onClick={shareLinkedIn}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-semibold text-xs transition-colors"
          >
            <span className="text-xl mb-1">💼</span>
            <span>LinkedIn</span>
          </button>

          <button
            onClick={shareTwitter}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 font-semibold text-xs transition-colors"
          >
            <span className="text-xl mb-1">𝕏</span>
            <span>Twitter / X</span>
          </button>

          <button
            onClick={shareWhatsApp}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-semibold text-xs transition-colors"
          >
            <span className="text-xl mb-1">💬</span>
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Link Copy Box */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700">Direct Shareable Link</label>
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
            <input
              type="text"
              readOnly
              value={jobUrl}
              className="bg-transparent text-xs text-gray-600 font-mono w-full outline-none px-2"
            />
            <button
              onClick={copyToClipboard}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg whitespace-nowrap"
            >
              Copy Link
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobShareModal;
