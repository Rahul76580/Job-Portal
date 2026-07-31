import React, { useContext, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../contex/AppContex";

const Dashboard = () => {
  const navigate = useNavigate();
  const { companyData, setCompanyData, setCompanyToken, companyToken, setShowRecruiterLogin } =
    useContext(AppContext);

  // Function to logout company
  const logout = () => {
    setCompanyToken(null);
    localStorage.removeItem("companyToken");
    localStorage.removeItem("company Token");
    setCompanyData(null);
    navigate("/");
  };

  const companyName = companyData ? companyData.name : "Slack Tech Enterprises";
  const hasLogo = companyData && companyData.image && companyData.image.length > 5;

  useEffect(() => {
    if (window.location.pathname === "/dashboard") {
      navigate("/dashboard/manage-jobs");
    }
  }, [navigate]);

  // Auth Guard: If recruiter is not logged in, prompt recruiter authentication
  if (!companyToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white border border-gray-200/90 rounded-3xl p-8 sm:p-10 shadow-xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-purple-50 text-purple-700 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-purple-200">
            🏢
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">
            Recruiter Login Required
          </h2>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Please sign in to your company recruiter account to access job management, publish career openings, and review candidate applications.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              🏢 Sign In to Recruiter Portal
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
            >
              ← Back to Job Portal Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      
      {/* Recruiter Navbar */}
      <header className="bg-white border-b border-gray-200 shadow-2xs py-3.5 px-4 sm:px-8">
        <div className="flex justify-between items-center container mx-auto">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img className="h-8 object-contain" src={assets.logo} alt="Logo" />
            <span className="bg-purple-100 text-purple-800 border border-purple-200 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full max-sm:hidden">
              Recruiter Hub
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <p className="text-xs sm:text-sm font-semibold text-gray-800">
                Welcome, <span className="text-purple-700 font-extrabold">{companyName}</span>
              </p>
              
              {hasLogo ? (
                <img
                  className="w-9 h-9 object-cover border-2 border-purple-500 rounded-full p-0.5"
                  src={companyData.image}
                  alt={companyName}
                />
              ) : (
                <div className="w-9 h-9 bg-purple-700 text-white font-extrabold text-sm rounded-full flex items-center justify-center shadow-2xs">
                  {companyName.charAt(0)}
                </div>
              )}

              <button
                onClick={logout}
                className="bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-600 border border-gray-200 hover:border-rose-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Recruiter Analytics Metrics Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-4 px-4 sm:px-8 border-b border-slate-800">
        <div className="container mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-2">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Active Postings</p>
            <p className="text-xl sm:text-2xl font-extrabold text-blue-400">8</p>
          </div>
          <div className="p-2">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Applicants Received</p>
            <p className="text-xl sm:text-2xl font-extrabold text-indigo-400">148</p>
          </div>
          <div className="p-2">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Hired / Accepted</p>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-400">24</p>
          </div>
          <div className="p-2">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Pending Reviews</p>
            <p className="text-xl sm:text-2xl font-extrabold text-amber-400">18</p>
          </div>
        </div>
      </div>

      {/* Main Recruiter Body & Sidebar */}
      <div className="flex-1 flex container mx-auto">
        
        {/* Left Sidebar */}
        <aside className="w-16 sm:w-64 bg-white border-r border-gray-200 py-6 min-h-screen">
          <ul className="flex flex-col gap-1.5 px-2">
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 sm:px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
              to={"/dashboard/manage-jobs"}
            >
              <img className="h-5 w-5 opacity-75" src={assets.home_icon} alt="" />
              <span className="max-sm:hidden">Manage Jobs</span>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 sm:px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
              to={"/dashboard/add-job"}
            >
              <img className="h-5 w-5 opacity-75" src={assets.add_icon} alt="" />
              <span className="max-sm:hidden">Post New Job</span>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 sm:px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
              to={"/dashboard/view-application"}
            >
              <img className="h-5 w-5 opacity-75" src={assets.person_tick_icon} alt="" />
              <span className="max-sm:hidden">View Applicants</span>
            </NavLink>
          </ul>
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Dashboard;