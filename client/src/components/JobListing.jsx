import React, { useContext, useEffect, useState } from "react";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import { AppContext } from "../contex/AppContex";
import JobCard from "./JobCard";

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState([]);

  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const levelsList = ["Beginner Level", "Intermediate Level", "Senior Level"];

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocation((prev) =>
      prev.includes(location) ? prev.filter((c) => c !== location) : [...prev, location]
    );
  };

  const handleLevelChange = (level) => {
    setSelectedLevel((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  useEffect(() => {
    const matchesCategory = (job) =>
      selectedCategories.length === 0 || selectedCategories.includes(job.category);

    const matchesLocation = (job) =>
      selectedLocation.length === 0 || selectedLocation.includes(job.location);

    const matchesLevel = (job) =>
      selectedLevel.length === 0 || selectedLevel.includes(job.level);

    const matchesTitle = (job) =>
      searchFilter.title === "" ||
      (job.title && job.title.toLowerCase().includes(searchFilter.title.toLowerCase())) ||
      (job.category && job.category.toLowerCase().includes(searchFilter.title.toLowerCase()));

    const matchesSearchLocation = (job) =>
      searchFilter.location === "" ||
      (job.location && job.location.toLowerCase().includes(searchFilter.location.toLowerCase()));

    const newFilteredJobs = jobs
      .slice()
      .reverse()
      .filter(
        (job) =>
          matchesCategory(job) &&
          matchesLocation(job) &&
          matchesLevel(job) &&
          matchesTitle(job) &&
          matchesSearchLocation(job)
      );

    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs, selectedCategories, selectedLocation, selectedLevel, searchFilter]);

  const jobsPerPage = 6;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-6 py-8 px-4 gap-8">
      
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-1/4 bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm h-fit">
        
        {/* Active Search Filters Indicator */}
        {isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
          <div className="mb-6 bg-blue-50/70 p-3.5 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-blue-900">Current Search</h3>
              <button 
                onClick={() => setSearchFilter({ title: "", location: "" })}
                className="text-xs text-blue-600 hover:underline"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchFilter.title && (
                <span className="inline-flex items-center gap-1.5 bg-white text-blue-800 border border-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                  "{searchFilter.title}"
                  <img
                    onClick={() => setSearchFilter((prev) => ({ ...prev, title: "" }))}
                    className="cursor-pointer h-3 w-3 hover:opacity-75"
                    src={assets.cross_icon}
                    alt="Remove"
                  />
                </span>
              )}

              {searchFilter.location && (
                <span className="inline-flex items-center gap-1.5 bg-white text-indigo-800 border border-indigo-300 px-3 py-1 rounded-full text-xs font-medium">
                  📍 {searchFilter.location}
                  <img
                    onClick={() => setSearchFilter((prev) => ({ ...prev, location: "" }))}
                    className="cursor-pointer h-3 w-3 hover:opacity-75"
                    src={assets.cross_icon}
                    alt="Remove"
                  />
                </span>
              )}
            </div>
          </div>
        )}

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="w-full py-2.5 px-4 rounded-lg border border-gray-300 font-medium text-sm lg:hidden bg-gray-50 flex items-center justify-between"
        >
          <span>Filters ({selectedCategories.length + selectedLocation.length + selectedLevel.length})</span>
          <span>{showFilter ? "▲ Close" : "▼ Expand"}</span>
        </button>

        <div className={showFilter ? "block mt-4" : "max-lg:hidden"}>
          
          {/* Category Filter */}
          <div className="pb-5 border-b border-gray-100">
            <h4 className="font-bold text-gray-900 text-sm mb-3">Job Category</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              {JobCategories.map((category, index) => (
                <li key={index} className="flex items-center gap-2.5 hover:text-gray-900 cursor-pointer">
                  <input
                    id={`cat-${index}`}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    type="checkbox"
                    onChange={() => handleCategoryChange(category)}
                    checked={selectedCategories.includes(category)}
                  />
                  <label htmlFor={`cat-${index}`} className="cursor-pointer text-xs font-medium">
                    {category}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Location Filter */}
          <div className="py-5 border-b border-gray-100">
            <h4 className="font-bold text-gray-900 text-sm mb-3">Location</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              {JobLocations.map((location, index) => (
                <li key={index} className="flex items-center gap-2.5 hover:text-gray-900 cursor-pointer">
                  <input
                    id={`loc-${index}`}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    type="checkbox"
                    onChange={() => handleLocationChange(location)}
                    checked={selectedLocation.includes(location)}
                  />
                  <label htmlFor={`loc-${index}`} className="cursor-pointer text-xs font-medium">
                    {location}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Experience Level Filter */}
          <div className="pt-5">
            <h4 className="font-bold text-gray-900 text-sm mb-3">Experience Level</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              {levelsList.map((level, index) => (
                <li key={index} className="flex items-center gap-2.5 hover:text-gray-900 cursor-pointer">
                  <input
                    id={`lvl-${index}`}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    type="checkbox"
                    onChange={() => handleLevelChange(level)}
                    checked={selectedLevel.includes(level)}
                  />
                  <label htmlFor={`lvl-${index}`} className="cursor-pointer text-xs font-medium">
                    {level}
                  </label>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </aside>

      {/* Main Job Cards Grid Section */}
      <section className="w-full lg:w-3/4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b border-gray-200 pb-4">
          <div>
            <h2 className="font-bold text-2xl text-gray-900" id="job-list">
              Recommended Jobs
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              Showing <span className="font-semibold text-gray-800">{filteredJobs.length}</span> active opportunities matching your profile
            </p>
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center my-6">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">No Matching Openings Found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
              Try adjusting your search criteria or clear category & location filters to view all available roles.
            </p>
            <button
              onClick={() => {
                setSearchFilter({ title: "", location: "" });
                setSelectedCategories([]);
                setSelectedLocation([]);
                setSelectedLevel([]);
              }}
              className="bg-blue-600 text-white font-medium text-xs px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredJobs
              .slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)
              .map((job, index) => (
                <JobCard key={job._id || index} job={job} />
              ))}
          </div>
        )}

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-10">
            <a href="#job-list">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                <img className="h-4 w-4" src={assets.left_arrow_icon} alt="Previous" />
              </button>
            </a>

            {Array.from({ length: totalPages }).map((_, index) => (
              <a key={index} href="#job-list">
                <button
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-9 h-9 font-semibold text-xs rounded-lg border transition-all ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              </a>
            ))}

            <a href="#job-list">
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                <img className="h-4 w-4" src={assets.right_arrow_icon} alt="Next" />
              </button>
            </a>
          </div>
        )}

      </section>

    </div>
  );
};

export default JobListing;