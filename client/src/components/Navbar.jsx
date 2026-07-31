import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../contex/AppContex";
import ResumeBuilderModal from "./ResumeBuilderModal";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const {
    setShowRecruiterLogin,
    savedJobs,
    companyToken,
    companyData,
    currency,
    changeCurrency,
    candidateBuiltResume
  } = useContext(AppContext);

  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-gray-100 shadow-2xs transition-all">
        <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center py-3.5">
          
          {/* Logo & Platform Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img
              className="h-8 sm:h-9 object-contain hover:scale-105 transition-transform"
              src={assets.logo}
              alt="JobPortal Logo"
            />
            <span className="hidden md:inline-flex text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
              {companyToken ? "Employer Mode" : "Candidate Mode"}
            </span>
          </div>

          {/* Navigation Action Links */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-gray-700">
            
            {/* Multi-Currency Switcher Dropdown */}
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
              <span className="text-gray-400 text-xs">💱</span>
              <select
                value={currency}
                onChange={(e) => changeCurrency(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-800 outline-none cursor-pointer"
              >
                <option value="USD">$ USD</option>
                <option value="INR">₹ INR</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
            </div>

            {/* Instant Resume Builder Button */}
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>📄 {candidateBuiltResume ? "Resume Attached" : "Build Resume"}</span>
            </button>

            {/* Saved Jobs Quick Pill */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <span>🔖 Saved</span>
              {savedJobs.length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {savedJobs.length}
                </span>
              )}
            </button>

            {/* Recruiter / Employer Hub Switch Button */}
            {companyToken ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>🏢 Employer Dashboard ({companyData?.name || "Recruiter"})</span>
              </button>
            ) : (
              <button
                onClick={() => setShowRecruiterLogin(true)}
                className="text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
              >
                🏢 Recruiter Login
              </button>
            )}

            {/* Candidate User Auth Status */}
            {user ? (
              <div className="flex items-center gap-3 border-l border-gray-200 pl-3">
                <Link
                  to={"/applications"}
                  className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
                >
                  My Applications
                </Link>

                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <button
                onClick={() => openSignIn()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 sm:px-5 py-1.5 rounded-full text-xs shadow-2xs transition-all cursor-pointer"
              >
                👤 Candidate Sign In
              </button>
            )}

          </div>
        </div>
      </header>

      {/* Resume Builder Modal */}
      <ResumeBuilderModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </>
  );
};

export default Navbar;