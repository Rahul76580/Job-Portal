import React, { useContext, useRef, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../contex/AppContex";

const Hero = () => {
  const { setSearchFilter, setIsSearched, activityFeed } = useContext(AppContext);
  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % activityFeed.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [activityFeed.length]);

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current ? titleRef.current.value : "",
      location: locationRef.current ? locationRef.current.value : ""
    });
    setIsSearched(true);
  };

  const handleQuickSearch = (keyword) => {
    if (titleRef.current) {
      titleRef.current.value = keyword;
    }
    setSearchFilter((prev) => ({ ...prev, title: keyword }));
    setIsSearched(true);
  };

  return (
    <div className="container 2xl:px-20 mx-auto my-6 px-4">
      
      {/* Live Activity Ticker */}
      <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl px-4 py-2 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2 overflow-hidden text-xs">
          <span className="bg-blue-600 text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-md tracking-wider">
            Live Stream
          </span>
          <p className="text-blue-950 font-medium truncate animate-pulse">
            {activityFeed[tickerIndex]}
          </p>
        </div>
        <span className="text-[10px] text-blue-600 font-semibold max-sm:hidden">
          ⚡ Updated Realtime
        </span>
      </div>

      {/* Main Hero Card */}
      <div className="bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white py-14 md:py-20 text-center rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* Glowing Background Spheres */}
        <div className="absolute -top-28 -left-28 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-28 -right-28 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1 rounded-full text-xs font-semibold tracking-wide text-blue-200 mb-4 shadow-2xs">
            🚀 10,000+ Verified Tech & Executive Roles
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Discover Exceptional Roles & <span className="bg-gradient-to-r from-blue-400 via-indigo-200 to-emerald-300 bg-clip-text text-transparent">Accelerate Your Career</span>
          </h1>

          <p className="mb-8 text-gray-300 text-sm sm:text-base font-normal max-w-xl mx-auto">
            Connect directly with verified tech enterprises and startups using automated AI skill matching & one-click candidate apply.
          </p>

          {/* Search Bar Container */}
          <div className="flex flex-col sm:flex-row items-center bg-white rounded-2xl p-2 max-w-2xl mx-auto shadow-2xl gap-2 border border-gray-100">
            <div className="flex items-center flex-1 px-4 py-2 w-full border-b sm:border-b-0 sm:border-r border-gray-200">
              <img className="h-5 w-5 opacity-60 mr-3" src={assets.search_icon} alt="Search" />
              <input
                type="text"
                placeholder="Job title, skill, or tech stack"
                className="outline-none w-full text-gray-800 placeholder-gray-400 text-sm"
                ref={titleRef}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </div>

            <div className="flex items-center flex-1 px-4 py-2 w-full">
              <img className="h-5 w-5 opacity-60 mr-3" src={assets.location_icon} alt="Location" />
              <input
                type="text"
                placeholder="Location or Remote"
                className="outline-none w-full text-gray-800 placeholder-gray-400 text-sm"
                ref={locationRef}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </div>

            <button
              onClick={onSearch}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto px-8 py-3.5 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Search Roles
            </button>
          </div>

          {/* Quick Trending Tags */}
          <div className="mt-6 flex items-center justify-center gap-2 flex-wrap text-xs text-gray-300">
            <span className="font-medium text-gray-400">Popular Searches:</span>
            {["Full Stack", "React", "Python", "Data Science", "Remote", "DevOps"].map((tag) => (
              <button
                key={tag}
                onClick={() => handleQuickSearch(tag)}
                className="bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1 rounded-full transition-colors font-medium"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-blue-400">10,000+</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Active Jobs</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-indigo-300">500+</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Companies</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-400">98%</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Success Rate</p>
            </div>
          </div>

        </div>
      </div>

      {/* Trusted By Enterprise Banner */}
      <div className="border border-gray-200/80 bg-white/70 backdrop-blur shadow-2xs mt-6 p-5 rounded-2xl flex items-center justify-between flex-wrap gap-4">
        <p className="font-semibold text-xs uppercase tracking-wider text-gray-500 w-full text-center md:w-auto">
          Trusted by Industry Leaders
        </p>
        <div className="flex justify-center items-center gap-6 sm:gap-12 flex-wrap mx-auto md:mx-0 opacity-80 hover:opacity-100 transition-opacity">
          <img className="h-5 sm:h-6 object-contain" src={assets.microsoft_logo} alt="Microsoft" />
          <img className="h-5 sm:h-6 object-contain" src={assets.walmart_logo} alt="Walmart" />
          <img className="h-5 sm:h-6 object-contain" src={assets.accenture_logo} alt="Accenture" />
          <img className="h-5 sm:h-6 object-contain" src={assets.samsung_logo} alt="Samsung" />
          <img className="h-5 sm:h-6 object-contain" src={assets.amazon_logo} alt="Amazon" />
          <img className="h-5 sm:h-6 object-contain" src={assets.adobe_logo} alt="Adobe" />
        </div>
      </div>

    </div>
  );
};

export default Hero;