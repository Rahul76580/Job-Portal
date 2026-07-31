import React from "react";
import { useClerk } from "@clerk/clerk-react";

const CandidateAuthModal = ({ isOpen, onClose, onLaunchResumeBuilder }) => {
  const { openSignIn } = useClerk();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
        
        <div className="w-14 h-14 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
          👤
        </div>

        <h3 className="font-extrabold text-xl text-gray-900 mb-1">
          Candidate Sign In Required
        </h3>

        <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6">
          To submit your job application, save roles, or build your resume, please sign in with your candidate account.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              openSignIn();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            🔑 Sign In / Sign Up as Candidate
          </button>

          {onLaunchResumeBuilder && (
            <button
              onClick={() => {
                onClose();
                onLaunchResumeBuilder();
              }}
              className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs py-3 rounded-xl border border-indigo-200 transition-all cursor-pointer"
            >
              📄 Pre-build Candidate Resume First
            </button>
          )}

          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-600 font-semibold pt-2"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default CandidateAuthModal;
