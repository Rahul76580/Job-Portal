import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../contex/AppContex";
import QuickApplyModal from "./QuickApplyModal";
import JobShareModal from "./JobShareModal";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { savedJobs, toggleSaveJob, calculateMatchScore, formatSalary } =
    useContext(AppContext);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const isSaved = savedJobs.includes(job._id);
  const matchScore = calculateMatchScore(job);

  return (
    <>
      <div className="bg-white border border-gray-200/90 hover:border-blue-300 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative">
        
        <div>
          {/* Card Top Header */}
          <div className="flex justify-between items-start gap-2 mb-3">
            <div className="flex items-center gap-3">
              <img
                className="h-10 w-10 object-contain rounded-xl p-1.5 border border-gray-100 bg-gray-50/50"
                src={job.companyId?.image}
                alt={job.companyId?.name || "Company"}
              />
              <div>
                <p className="text-xs font-semibold text-gray-500">{job.companyId?.name || "Company"}</p>
                <h3
                  onClick={() => {
                    navigate(`/apply-job/${job._id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="font-bold text-base text-gray-900 group-hover:text-blue-600 cursor-pointer transition-colors line-clamp-1"
                >
                  {job.title}
                </h3>
              </div>
            </div>

            {/* Quick Actions (Share & Bookmark) */}
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareModalOpen(true);
                }}
                className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-xs"
                title="Share Job"
              >
                🔗
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveJob(job._id);
                }}
                className={`p-2 rounded-full transition-all text-xs ${
                  isSaved
                    ? "bg-amber-100 text-amber-600 font-bold"
                    : "text-gray-400 hover:text-amber-500 hover:bg-amber-50"
                }`}
                title={isSaved ? "Remove from saved" : "Save Job"}
              >
                {isSaved ? "★" : "☆"}
              </button>
            </div>
          </div>

          {/* Badges Bar */}
          <div className="flex flex-wrap gap-2 mb-3 text-xs font-medium">
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
              ⚡ {matchScore}% Match
            </span>
            <span className="bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-0.5 rounded-md text-[11px]">
              📍 {job.location}
            </span>
            <span className="bg-purple-50 border border-purple-200 text-purple-700 px-2.5 py-0.5 rounded-md text-[11px]">
              💼 {job.level}
            </span>
          </div>

          {/* Short Job Description Snippet */}
          <div
            className="text-gray-600 text-xs line-clamp-2 mb-4 rich-text"
            dangerouslySetInnerHTML={{ __html: job.description }}
          ></div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-2">
          <div>
            <span className="text-[10px] text-gray-400 block font-semibold uppercase">CTC / Salary</span>
            <span className="font-extrabold text-gray-900 text-sm">
              {formatSalary(job.salary || 65000)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-2xs"
            >
              Quick Apply
            </button>
          </div>
        </div>

      </div>

      {/* Quick Apply Popup Modal */}
      <QuickApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />

      {/* Job Social Share Popup Modal */}
      <JobShareModal
        job={job}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
};

export default JobCard;