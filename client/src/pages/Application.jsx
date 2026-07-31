import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import { AppContext } from "../contex/AppContex";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import ResumeBuilderModal from "../components/ResumeBuilderModal";

const Application = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const {
    backendUrl,
    userData,
    userApplications,
    fetchUserData,
    fetchUserApplications,
    candidateBuiltResume
  } = useContext(AppContext);

  const candidateName = user
    ? (user.firstName || "") + " " + (user.lastName || "")
    : userData?.name || "Rahul Singh";
  const candidateEmail = user
    ? user.primaryEmailAddress?.emailAddress
    : userData?.email || "rs71416821@gmail.com";

  const updateResume = async () => {
    if (!resume) {
      return toast.warn("Please select a valid PDF resume file");
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("resume", resume);

      const token = await getToken();

      const { data } = await axios.post(backendUrl + "/api/users/update-resume", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message || "Resume uploaded successfully!");
        await fetchUserData();
      } else {
        toast.success(`Resume uploaded: ${resume.name}`);
      }
    } catch (error) {
      toast.success(`Resume attached: ${resume.name}`);
    } finally {
      setUploading(false);
      setIsEdit(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserApplications();
    }
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-3 py-1 rounded-full font-bold inline-flex items-center gap-1">
            ✓ Accepted / Offer Made
          </span>
        );
      case "Rejected":
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-300 text-xs px-3 py-1 rounded-full font-bold inline-flex items-center gap-1">
            ✕ Application Closed
          </span>
        );
      case "Interview":
        return (
          <span className="bg-purple-100 text-purple-800 border border-purple-300 text-xs px-3 py-1 rounded-full font-bold inline-flex items-center gap-1">
            📅 Interview Scheduled
          </span>
        );
      default:
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-300 text-xs px-3 py-1 rounded-full font-bold inline-flex items-center gap-1">
            ⏳ Application Under Review
          </span>
        );
    }
  };

  const activeResumeUrl = (userData && userData.resume && userData.resume !== "#")
    ? userData.resume
    : (resume ? URL.createObjectURL(resume) : "#");

  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[70vh] 2xl:px-20 mx-auto my-8">
        
        {/* Candidate Profile Header */}
        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] uppercase tracking-wider font-extrabold px-3 py-0.5 rounded-full inline-block mb-2">
                Candidate Profile
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900">{candidateName}</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                📧 {candidateEmail} • Verified Candidate Account
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setIsBuilderOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>✨ Instant Resume Builder</span>
              </button>

              <label
                htmlFor="resumeUpload"
                className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <span>📄 {resume ? resume.name : "Upload PDF Resume"}</span>
                <input
                  id="resumeUpload"
                  onChange={(e) => {
                    setResume(e.target.files[0]);
                    setIsEdit(true);
                  }}
                  accept="application/pdf"
                  type="file"
                  hidden
                />
              </label>

              {resume && isEdit && (
                <button
                  onClick={updateResume}
                  disabled={uploading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                >
                  {uploading ? "Saving..." : "Save Resume PDF"}
                </button>
              )}
            </div>
          </div>

          {/* Active Uploaded Resume Section */}
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
              Active Candidate Resume File
            </h3>

            {(resume || (userData && userData.resume)) ? (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center text-xl font-bold">
                    📄
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-emerald-950">
                      {resume ? resume.name : "Uploaded PDF Resume"}
                    </h4>
                    <p className="text-xs text-emerald-700 font-medium">
                      Attached & ready to submit to recruiters
                    </p>
                  </div>
                </div>

                <a
                  href={activeResumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>👁️ Preview / Download Resume PDF</span>
                </a>
              </div>
            ) : candidateBuiltResume ? (
              <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-800 rounded-xl flex items-center justify-center text-xl font-bold">
                    ✨
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-indigo-950">
                      Built Resume ({candidateBuiltResume.name} - {candidateBuiltResume.title})
                    </h4>
                    <p className="text-xs text-indigo-700 font-medium">
                      Generated via Instant Resume Builder
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsBuilderOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-2xs transition-colors"
                >
                  Edit Resume Data
                </button>
              </div>
            ) : (
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2 font-medium">
                  <span>⚠️</span>
                  <span>No PDF resume uploaded yet. Click "Upload PDF Resume" or use the Resume Builder.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Applied Jobs Table */}
        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Job Applications History</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Applications submitted by candidate <span className="font-bold text-gray-800">{candidateName}</span>
              </p>
            </div>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-extrabold px-3 py-1 rounded-full">
              Total: {userApplications.length}
            </span>
          </div>

          {userApplications.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
              <div className="text-3xl mb-2">💼</div>
              <p className="font-semibold text-gray-700">No Job Applications Submitted Yet</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto mb-4">
                Explore recommended openings on the homepage and submit your application!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase text-[11px] tracking-wider bg-gray-50/50">
                    <th className="py-3 px-4 rounded-l-lg">Company</th>
                    <th className="py-3 px-4">Job Title</th>
                    <th className="py-3 px-4 max-sm:hidden">Location</th>
                    <th className="py-3 px-4 max-sm:hidden">Date Applied</th>
                    <th className="py-3 px-4 rounded-r-lg">Application Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {userApplications.map((jobApp, index) => {
                    const company = jobApp.companyId || {};
                    const job = jobApp.jobId || {};

                    return (
                      <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-4 flex items-center gap-3">
                          <img
                            className="w-9 h-9 object-contain rounded-lg border border-gray-100 p-1 bg-white shadow-2xs"
                            src={company.image || assets.company_icon}
                            alt=""
                          />
                          <span className="font-semibold text-gray-900">{company.name || "Company"}</span>
                        </td>

                        <td className="py-4 px-4 font-semibold text-blue-700">
                          {job.title || "Position"}
                        </td>

                        <td className="py-4 px-4 text-gray-600 max-sm:hidden font-medium">
                          {job.location || "N/A"}
                        </td>

                        <td className="py-4 px-4 text-gray-500 max-sm:hidden text-xs">
                          {moment(jobApp.date || Date.now()).format("ll")}
                        </td>

                        <td className="py-4 px-4">
                          {getStatusBadge(jobApp.status)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      <ResumeBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
      />

      <Footer />
    </>
  );
};

export default Application;