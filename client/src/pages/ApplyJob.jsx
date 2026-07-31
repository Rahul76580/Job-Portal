import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../contex/AppContex";
import Loading from "../components/Loding";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import kconvert from "k-convert";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

const ApplyJob = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [JobData, setJobData] = useState(null);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);

  const {
    jobs,
    backendUrl,
    userData,
    userApplications,
    fetchUserApplications,
    savedJobs,
    toggleSaveJob,
    calculateMatchScore
  } = useContext(AppContext);

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/jobs/${id}`);
      if (data.success && data.job) {
        setJobData(data.job);
        return;
      }
    } catch (error) {
      console.warn("Backend job fetch fallback:", error.message);
    }

    // Fallback to searching context jobs if backend API returns error or offline
    const found = jobs.find((j) => j._id === id);
    if (found) {
      setJobData(found);
    }
  };

  const applyHandler = async () => {
    try {
      if (!userData) {
        return toast.error("Please login as a candidate to apply for jobs!");
      }

      if (!userData.resume) {
        navigate("/applications");
        return toast.error("Please upload your resume to apply for jobs!");
      }

      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/users/apply",
        { jobId: JobData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || "Application submitted successfully!");
        fetchUserApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const checkAlreadyApplied = () => {
    if (!JobData || !userApplications) return;
    const hasApplied = userApplications.some((item) => item.jobId && item.jobId._id === JobData._id);
    setIsAlreadyApplied(hasApplied);
  };

  useEffect(() => {
    fetchJob();
  }, [id, jobs]);

  useEffect(() => {
    if (userApplications.length > 0 && JobData) {
      checkAlreadyApplied();
    }
  }, [JobData, userApplications, id]);

  const matchScore = JobData ? calculateMatchScore(JobData) : 85;
  const isSaved = JobData ? savedJobs.includes(JobData._id) : false;

  return JobData ? (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col py-8 container px-4 2xl:px-20 mx-auto">
        
        {/* Main Job Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-10 mb-8 shadow-xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                className="h-20 w-20 bg-white rounded-xl p-2.5 border border-white/20 object-contain shadow-md"
                src={JobData.companyId?.image || assets.company_icon}
                alt={JobData.companyId?.name || "Company"}
              />

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{JobData.title}</h1>
                  <span className="bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full">
                    ⚡ {matchScore}% AI Match
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 items-center text-gray-300 text-xs sm:text-sm mt-3">
                  <span className="flex items-center gap-1.5 font-medium">
                    <img className="h-4 w-4 opacity-80" src={assets.suitcase_icon} alt="" />
                    {JobData.companyId?.name || "Company"}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <img className="h-4 w-4 opacity-80" src={assets.location_icon} alt="" />
                    {JobData.location}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <img className="h-4 w-4 opacity-80" src={assets.person_icon} alt="" />
                    {JobData.level}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <img className="h-4 w-4 opacity-80" src={assets.money_icon} alt="" />
                    CTC: ${kconvert.convertTo(JobData.salary || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => toggleSaveJob(JobData._id)}
                className={`px-4 py-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  isSaved
                    ? "bg-amber-400 text-gray-900 border-amber-400"
                    : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                }`}
              >
                <span>{isSaved ? "★ Saved" : "☆ Save"}</span>
              </button>

              <button
                onClick={applyHandler}
                disabled={isAlreadyApplied}
                className={`px-8 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                  isAlreadyApplied
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white active:scale-95"
                }`}
              >
                {isAlreadyApplied ? "✓ Already Applied" : "Apply Now"}
              </button>
            </div>

          </div>

          <p className="mt-4 text-xs text-gray-400 text-right">Posted {moment(JobData.date).fromNow()}</p>
        </div>

        {/* Content Layout: Details & Match Breakdown */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          
          <div className="w-full lg:w-2/3 bg-white p-6 sm:p-8 border border-gray-200/80 rounded-2xl shadow-sm">
            <h2 className="font-bold text-xl text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Role & Responsibilities
            </h2>

            <div
              className="rich-text text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: JobData.description }}
            ></div>

            {/* Bottom Apply CTA */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">Quick Candidate Verification Enabled</span>
              <button
                onClick={applyHandler}
                disabled={isAlreadyApplied}
                className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all shadow ${
                  isAlreadyApplied
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isAlreadyApplied ? "✓ Already Applied" : "Submit Candidate Application"}
              </button>
            </div>
          </div>

          {/* Right Column: AI Analysis & Similar Jobs */}
          <div className="w-full lg:w-1/3 space-y-6">
            
            {/* AI Resume Match Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 p-5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm text-indigo-950 flex items-center gap-1.5">
                  🤖 AI Resume Match Rating
                </h3>
                <span className="font-extrabold text-indigo-600 text-base">{matchScore}%</span>
              </div>
              
              <div className="w-full bg-indigo-200/60 rounded-full h-2 mb-4 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${matchScore}%` }}
                ></div>
              </div>

              <div className="space-y-2 text-xs text-indigo-900">
                <p className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  ✓ Required skill set alignment matched
                </p>
                <p className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  ✓ Candidate experience level criteria satisfied
                </p>
              </div>
            </div>

            {/* Similar Roles */}
            <div className="bg-white p-5 border border-gray-200/80 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-bold text-base text-gray-900">
                More Opportunities from {JobData.companyId?.name || "Company"}
              </h3>
              
              {jobs
                .filter(
                  (job) =>
                    job._id !== JobData._id &&
                    job.companyId?._id === JobData.companyId?._id
                )
                .filter((job) => {
                  const appliedJobsIds = new Set(
                    userApplications.map((app) => app.jobId && app.jobId._id)
                  );
                  return !appliedJobsIds.has(job._id);
                })
                .slice(0, 3)
                .map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
            </div>

          </div>

        </div>

      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJob;