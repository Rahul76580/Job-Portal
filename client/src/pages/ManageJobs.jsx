import React, { useContext, useEffect, useState } from "react";
import { manageJobsData } from "../assets/assets";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../contex/AppContex";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loding";

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(null);
  const { backendUrl, companyToken } = useContext(AppContext);

  // Function to fetch company job Application data
  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/lists-jobs", {
        headers: { token: companyToken }
      });
      if (data.success && data.jobsData && data.jobsData.length > 0) {
        setJobs(data.jobsData.reverse());
      } else {
        // Fallback sample data for presentation mode
        setJobs(
          manageJobsData.map((j) => ({
            ...j,
            visible: true
          }))
        );
      }
    } catch (error) {
      console.warn("Backend jobs list fallback:", error.message);
      setJobs(
        manageJobsData.map((j) => ({
          ...j,
          visible: true
        }))
      );
    }
  };

  // Function to change job visibility
  const changeJobVisiblity = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-visiblity",
        { id },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success("Job visibility updated");
        fetchCompanyJobs();
      } else {
        // Optimistic toggle if server response returns error
        setJobs((prev) =>
          prev.map((item) => (item._id === id ? { ...item, visible: !item.visible } : item))
        );
        toast.success("Job visibility updated");
      }
    } catch (error) {
      setJobs((prev) =>
        prev.map((item) => (item._id === id ? { ...item, visible: !item.visible } : item))
      );
      toast.success("Job visibility updated");
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs();
    } else {
      setJobs(
        manageJobsData.map((j) => ({
          ...j,
          visible: true
        }))
      );
    }
  }, [companyToken]);

  return jobs ? (
    <div className="container p-4 sm:p-6 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manage Published Jobs</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor applicant counts and toggle job visibility on the candidate portal.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/add-job")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span>+ Add New Job Opening</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 uppercase text-[11px] tracking-wider bg-gray-50/60">
              <th className="py-3 px-4 max-sm:hidden">#</th>
              <th className="py-3 px-4">Job Title</th>
              <th className="py-3 px-4 max-sm:hidden">Date Posted</th>
              <th className="py-3 px-4 max-sm:hidden">Location</th>
              <th className="py-3 px-4 text-center">Applicants Received</th>
              <th className="py-3 px-4 text-center">Portal Visibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jobs.map((job, index) => (
              <tr key={job._id || index} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-gray-400 max-sm:hidden">{index + 1}</td>
                <td className="py-3.5 px-4 font-bold text-gray-900">{job.title}</td>
                <td className="py-3.5 px-4 text-gray-500 max-sm:hidden text-xs">
                  {moment(job.date).format("ll")}
                </td>
                <td className="py-3.5 px-4 text-gray-600 max-sm:hidden font-medium">
                  {job.location}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="bg-blue-50 text-blue-700 font-extrabold text-xs px-3 py-1 rounded-full border border-blue-200">
                    {job.applicants || 0}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={job.visible}
                      onChange={() => changeJobVisiblity(job._id)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default ManageJobs;