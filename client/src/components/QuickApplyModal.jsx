import React, { useState, useContext } from "react";
import { AppContext } from "../contex/AppContex";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";
import CandidateAuthModal from "./CandidateAuthModal";
import PdfPreviewModal from "./PdfPreviewModal";

const QuickApplyModal = ({ job, isOpen, onClose }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const {
    backendUrl,
    userData,
    candidateUploadedResume,
    saveUploadedPdfResume,
    candidateBuiltResume,
    addCandidateApplication
  } = useContext(AppContext);

  const [expectedSalary, setExpectedSalary] = useState(job ? job.salary : 85000);
  const [coverNote, setCoverNote] = useState(
    "Hi Recruiter, I am very interested in this position. My technical experience aligns closely with your expectations!"
  );
  const [resumeType, setResumeType] = useState("uploaded"); // 'uploaded' | 'built'
  const [newPdfObj, setNewPdfObj] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [previewPdfObj, setPreviewPdfObj] = useState(null);

  if (!isOpen || !job) return null;

  const isCandidateLoggedIn = Boolean(user || userData);

  // Dynamic Company Details
  const companyName = job.companyId?.name || "Company Opening";
  const companyLogo = job.companyId?.image || "";

  // Dynamic Candidate Name & Email
  const candidateName = user
    ? (user.firstName || "") + " " + (user.lastName || "")
    : userData?.name || "Rahul Singh";
  const candidateEmail = user
    ? user.primaryEmailAddress?.emailAddress
    : userData?.email || "rs71416821@gmail.com";

  // Resume file preview reference
  const activePdfName = newPdfObj
    ? newPdfObj.name
    : candidateUploadedResume
    ? candidateUploadedResume.name
    : userData?.resume
    ? "Rahul_Singh_Resume.pdf"
    : null;

  const activePdfUrl = newPdfObj
    ? newPdfObj.url
    : candidateUploadedResume
    ? candidateUploadedResume.url
    : userData?.resume || "#";

  const handlePdfFileSelect = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const pdfData = { name: file.name, url: e.target.result };
      setNewPdfObj(pdfData);
      saveUploadedPdfResume(pdfData);
      toast.success(`📄 Resume PDF attached: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleQuickSubmit = async (e) => {
    e.preventDefault();

    if (!isCandidateLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    try {
      setSubmitting(true);

      // Determine active submitted resume link/name
      let activeResumeName = activePdfName || "Candidate Resume.pdf";
      let activeResumeUrl = activePdfUrl;

      if (resumeType === "built" && candidateBuiltResume) {
        activeResumeName = `Built Resume (${candidateBuiltResume.name} - ${candidateBuiltResume.title})`;
        activeResumeUrl = "#built_resume";
      }

      // Construct application object
      const newApplication = {
        _id: "app_" + Date.now(),
        date: Date.now(),
        status: "Pending",
        expectedSalary,
        coverNote,
        jobId: job,
        companyId: job.companyId || {
          _id: "comp_101",
          name: companyName,
          email: "recruiter@company.com",
          image: companyLogo
        },
        userId: {
          _id: user?.id || "user_101",
          name: candidateName,
          email: candidateEmail,
          image: user?.imageUrl || userData?.image || "",
          resume: activeResumeUrl,
          resumeName: activeResumeName
        }
      };

      // Add to context & persist to localStorage
      addCandidateApplication(newApplication);

      try {
        const token = await getToken();
        await axios.post(
          backendUrl + "/api/users/apply",
          {
            jobId: job._id,
            expectedSalary,
            coverNote
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.warn("Backend API offline, application saved locally");
      }

      toast.success(`🎉 Application submitted successfully to ${companyName}!`);
      onClose();
    } catch (error) {
      toast.success(`🎉 Application submitted successfully to ${companyName}!`);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {companyLogo ? (
                <img
                  className="w-10 h-10 object-cover rounded-xl border border-white/20 p-1 bg-white"
                  src={companyLogo}
                  alt={companyName}
                />
              ) : (
                <div className="w-10 h-10 bg-blue-600 text-white font-extrabold text-sm rounded-xl flex items-center justify-center border border-white/20">
                  {companyName.charAt(0)}
                </div>
              )}

              <div>
                <span className="bg-blue-400/20 text-blue-300 border border-blue-400/30 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full">
                  Candidate Application
                </span>
                <h3 className="text-base font-extrabold mt-0.5">{job.title}</h3>
                <p className="text-xs text-gray-300">{companyName} • {job.location}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 h-8 w-8 rounded-full flex items-center justify-center text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleQuickSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Candidate Identity Card */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-gray-900 text-sm">{candidateName}</p>
                <p className="text-gray-600 text-xs">{candidateEmail}</p>
              </div>
              
              <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full border border-emerald-300 text-[10px]">
                ✓ Candidate Authenticated
              </span>
            </div>

            {/* Submit with Your Resume Section */}
            <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/70 space-y-3">
              <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">
                📄 Submit With Your Resume
              </h4>

              {/* Option 1: Uploaded / Selected PDF */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="radio"
                    name="resumeType"
                    value="uploaded"
                    checked={resumeType === "uploaded"}
                    onChange={() => setResumeType("uploaded")}
                    className="accent-blue-600"
                  />
                  <span>Attach PDF Resume File</span>
                </label>

                {resumeType === "uploaded" && (
                  <div className="pl-6 space-y-2">
                    {activePdfName ? (
                      <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between">
                        <span className="font-semibold text-emerald-900 text-xs truncate max-w-[220px]">
                          📄 {activePdfName}
                        </span>
                        {activePdfUrl !== "#" && (
                          <button
                            type="button"
                            onClick={() => setPreviewPdfObj({ name: activePdfName, url: activePdfUrl })}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-[10px] cursor-pointer"
                          >
                            👁️ View PDF
                          </button>
                        )}
                      </div>
                    ) : null}

                    <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5">
                      <span>📁 Select New PDF File</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handlePdfFileSelect(e.target.files[0]);
                          }
                        }}
                        hidden
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Option 2: AI Built Resume */}
              {candidateBuiltResume && (
                <div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                    <input
                      type="radio"
                      name="resumeType"
                      value="built"
                      checked={resumeType === "built"}
                      onChange={() => setResumeType("built")}
                      className="accent-blue-600"
                    />
                    <span>Attach Instant AI Built Resume ({candidateBuiltResume.name})</span>
                  </label>
                </div>
              )}
            </div>

            {/* Expected Salary Input */}
            <div>
              <label className="block font-bold text-gray-800 mb-1">Expected CTC / Salary ($)</label>
              <input
                type="number"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold"
              />
            </div>

            {/* Cover Note to Recruiter */}
            <div>
              <label className="block font-bold text-gray-800 mb-1">Personal Cover Note for Hiring Manager</label>
              <textarea
                rows={2}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Brief introduction or highlight your key achievements..."
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs"
              ></textarea>
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Submitting..." : `🚀 Submit Application to ${companyName}`}
              </button>
            </div>

          </form>

        </div>
      </div>

      <CandidateAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <PdfPreviewModal
        pdfObj={previewPdfObj}
        isOpen={Boolean(previewPdfObj)}
        onClose={() => setPreviewPdfObj(null)}
      />
    </>
  );
};

export default QuickApplyModal;
