import React, { useContext, useEffect, useState } from "react";
import { assets, viewApplicationsPageData } from "../assets/assets";
import { AppContext } from "../contex/AppContex";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loding";
import ApplicantDetailsModal from "../components/ApplicantDetailsModal";
import ViewResumeModal from "../components/ViewResumeModal";

const ViewApplication = () => {
  const { backendUrl, companyToken, userApplications, companyData, updateApplicationStatus } =
    useContext(AppContext);
  const [applicants, setApplicants] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [resumeModalApplicant, setResumeModalApplicant] = useState(null);

  // Function to fetch company job Applications data
  const fetchCompanyJobApplications = async () => {
    let apiApps = [];
    try {
      const { data } = await axios.get(backendUrl + "/api/company/applicants", {
        headers: { token: companyToken }
      });

      if (data.success && data.applications) {
        apiApps = data.applications;
      }
    } catch (error) {
      console.warn("Backend applicants fetch using client state fallback");
    }

    // Merge submitted user applications from client state + API apps + fallback mock data
    const merged = [...(userApplications || []), ...apiApps];

    if (merged.length > 0) {
      setApplicants(merged.reverse());
    } else {
      setApplicants(
        viewApplicationsPageData.map((item) => ({
          _id: item._id,
          userId: { name: item.name, image: item.imgSrc, resume: "#", email: "candidate@example.com" },
          jobId: { title: item.jobTitle, location: item.location },
          status: "Pending"
        }))
      );
    }
  };

  // Function to update job application status (Reflected live in Candidate Applications)
  const changeJobApplicationStatus = async (id, status) => {
    setApplicants((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status } : item))
    );

    // Live update candidate applications in AppContext & localStorage
    updateApplicationStatus(id, status);
    toast.success(`Application status updated to ${status}`);

    try {
      await axios.post(
        backendUrl + "/api/company/change-status",
        { id, status },
        { headers: { token: companyToken } }
      );
    } catch (error) {
      console.warn("Status updated locally");
    }
  };

  useEffect(() => {
    fetchCompanyJobApplications();
  }, [companyToken, userApplications]);

  return applicants ? (
    <>
      <div className="container mx-auto p-4 sm:p-6 bg-white border border-gray-200/80 rounded-3xl shadow-2xs">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div>
            <span className="bg-purple-100 text-purple-800 border border-purple-200 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full inline-block mb-1.5">
              Recruiter Hub
            </span>
            <h2 className="text-xl font-bold text-gray-900">Job Applicants Management ({companyData?.name || "Company"})</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Review applicant profile details, inspect candidate resumes, and manage hiring status.
            </p>
          </div>
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full">
            Total Applicants: {applicants.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase text-[11px] tracking-wider bg-gray-50/60">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4 max-sm:hidden">Job Position</th>
                <th className="py-3 px-4 max-sm:hidden">Location</th>
                <th className="py-3 px-4">Submitted Resume</th>
                <th className="py-3 px-4 text-center">Inspect Profile</th>
                <th className="py-3 px-4 text-center">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applicants
                .filter((item) => item.jobId && item.userId)
                .map((applicant, index) => {
                  const candidate = applicant.userId || {};
                  const job = applicant.jobId || {};

                  // Check if candidate submitted a PDF file or Built Resume
                  const isPdfResume =
                    (candidate.resume && (candidate.resume.includes(".pdf") || candidate.resume.startsWith("data:") || candidate.resume.startsWith("blob:") || (candidate.resume.startsWith("http") && !candidate.resume.includes("#built_resume")))) ||
                    (candidate.resumeName && candidate.resumeName.includes(".pdf"));

                  const pdfResumeUrl = (candidate.resume && candidate.resume !== "#" && candidate.resume !== "#built_resume")
                    ? candidate.resume
                    : "#";

                  return (
                    <tr key={applicant._id || index} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-400">{index + 1}</td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-2xs"
                            src={candidate.image || assets.profile_img}
                            alt=""
                          />
                          <div>
                            <span className="font-extrabold text-gray-900 block">{candidate.name || "Candidate"}</span>
                            <span className="text-[11px] text-gray-500">{candidate.email || "candidate@example.com"}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-blue-700 max-sm:hidden">
                        {job.title || "Position"}
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 max-sm:hidden font-medium">
                        {job.location || "N/A"}
                      </td>

                      <td className="py-3.5 px-4">
                        {isPdfResume && pdfResumeUrl !== "#" ? (
                          <a
                            href={pdfResumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3.5 py-1.5 rounded-xl border border-emerald-300 inline-flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                          >
                            <span>👁️ View PDF Resume</span>
                          </a>
                        ) : (
                          <button
                            onClick={() => setResumeModalApplicant(applicant)}
                            className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs px-3.5 py-1.5 rounded-xl border border-purple-200 inline-flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                          >
                            <span>📄 Open Built Resume</span>
                          </button>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedApplicant(applicant)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-3.5 py-1.5 rounded-xl border border-indigo-200 transition-colors cursor-pointer"
                        >
                          🔍 Inspect Details
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {applicant.status === "Pending" ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => changeJobApplicationStatus(applicant._id, "Accepted")}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => changeJobApplicationStatus(applicant._id, "Rejected")}
                              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full border ${
                              applicant.status === "Accepted"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : "bg-rose-100 text-rose-800 border-rose-300"
                            }`}
                          >
                            {applicant.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Candidate Resume Modal */}
      <ViewResumeModal
        applicant={resumeModalApplicant}
        isOpen={Boolean(resumeModalApplicant)}
        onClose={() => setResumeModalApplicant(null)}
      />

      {/* Recruiter Candidate Details Inspection Modal */}
      <ApplicantDetailsModal
        applicant={selectedApplicant}
        isOpen={Boolean(selectedApplicant)}
        onClose={() => setSelectedApplicant(null)}
        onStatusChange={changeJobApplicationStatus}
      />
    </>
  ) : (
    <Loading />
  );
};

export default ViewApplication;