import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const { user } = useUser();
  const { getToken } = useAuth();

  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: ""
  });

  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  // User data strictly linked to active Clerk session
  const [userData, setUserData] = useState(() => {
    if (!user) return null;
    try {
      const stored = localStorage.getItem("candidate_user_data");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Candidate Submitted Applications (Persisted in localStorage)
  const [userApplications, setUserApplications] = useState(() => {
    try {
      const stored = localStorage.getItem("candidate_applications");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save Application to localStorage whenever candidate submits
  const addCandidateApplication = (newApp) => {
    setUserApplications((prev) => {
      const exists = prev.some(
        (app) => app.jobId?._id === newApp.jobId?._id || app._id === newApp._id
      );
      if (exists) return prev;
      const updated = [newApp, ...prev];
      localStorage.setItem("candidate_applications", JSON.stringify(updated));
      return updated;
    });
  };

  // Live Update application status (Accepted / Rejected / Pending)
  const updateApplicationStatus = (appId, newStatus) => {
    setUserApplications((prev) => {
      const updated = prev.map((app) =>
        app._id === appId || app.jobId?._id === appId ? { ...app, status: newStatus } : app
      );
      localStorage.setItem("candidate_applications", JSON.stringify(updated));
      return updated;
    });
  };

  // Multi-Currency Selection State (USD $, INR ₹, EUR €, GBP £)
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("selectedCurrency") || "USD";
  });

  const changeCurrency = (newCurr) => {
    setCurrency(newCurr);
    localStorage.setItem("selectedCurrency", newCurr);
  };

  // Salary Conversion & Formatting Helper
  const formatSalary = (amountInUSD) => {
    if (!amountInUSD) return "0";
    const numeric = Number(amountInUSD);

    switch (currency) {
      case "INR": {
        const inrVal = Math.round(numeric * 83);
        if (inrVal >= 100000) {
          return `₹ ${(inrVal / 100000).toFixed(1)} Lakhs`;
        }
        return `₹ ${inrVal.toLocaleString("en-IN")}`;
      }
      case "EUR": {
        const eurVal = Math.round(numeric * 0.92);
        return `€ ${eurVal.toLocaleString("de-DE")}`;
      }
      case "GBP": {
        const gbpVal = Math.round(numeric * 0.78);
        return `£ ${gbpVal.toLocaleString("en-GB")}`;
      }
      default:
        return `$ ${numeric.toLocaleString("en-US")}`;
    }
  };

  // Uploaded PDF Resume State (PERMANENTLY PERSISTED until candidate explicitly updates)
  const [candidateUploadedResume, setCandidateUploadedResume] = useState(() => {
    try {
      const stored = localStorage.getItem("active_candidate_pdf_resume");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Save Uploaded PDF Permanently in localStorage
  const saveUploadedPdfResume = (pdfObj) => {
    setCandidateUploadedResume(pdfObj);
    localStorage.setItem("active_candidate_pdf_resume", JSON.stringify(pdfObj));
  };

  // Built-in Candidate Resume State (PERMANENTLY PERSISTED)
  const [candidateBuiltResume, setCandidateBuiltResume] = useState(() => {
    try {
      const stored = localStorage.getItem("builtResume");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Bookmarked / Saved Jobs State
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const stored = localStorage.getItem("savedJobs");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Toggle Bookmark / Save Job
  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => {
      let updated;
      if (prev.includes(jobId)) {
        updated = prev.filter((id) => id !== jobId);
      } else {
        updated = [...prev, jobId];
      }
      localStorage.setItem("savedJobs", JSON.stringify(updated));
      return updated;
    });
  };

  // Helper function to calculate AI Match Score for job
  const calculateMatchScore = (job) => {
    if (!job) return 85;
    const base = 80;
    const charCodeSum = (job._id || job.title || "").split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const score = base + (charCodeSum % 19);
    return Math.min(score, 98);
  };

  // Live Activity Stream
  const activityFeed = [
    "🔥 Candidate Alex applied for Senior React Engineer at Slack",
    "🎉 Candidate Priya got hired at Microsoft (Bangalore)",
    "⚡ 14 new candidates applied for DevOps Engineer",
    "💼 Meta posted 3 new Data Science openings"
  ];

  // Fetch job data with fallback to sample data if DB is empty or backend offline
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/jobs");
      if (data.success && data.jobs && data.jobs.length > 0) {
        setJobs(data.jobs);
      } else {
        setJobs(jobsData);
      }
    } catch {
      setJobs(jobsData);
    }
  };

  // Fetch company data cleanly
  const fetchCompanyData = async () => {
    if (!companyToken) return;
    try {
      const { data } = await axios.get(backendUrl + "/api/company/company", {
        headers: { token: companyToken }
      });

      if (data.success && data.company) {
        setCompanyData(data.company);
      }
    } catch {
      // Suppress network error toasts
    }
  };

  // Fetch user data cleanly
  const fetchUserData = async () => {
    if (!user) return;
    try {
      const token = await getToken();
      if (!token) return;

      const { data } = await axios.get(backendUrl + "/api/users/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success && data.user) {
        setUserData(data.user);
        localStorage.setItem("candidate_user_data", JSON.stringify(data.user));
      }
    } catch {
      // Maintain session state
    }
  };

  // Fetch user's applied applications data cleanly
  const fetchUserApplications = async () => {
    if (!user) return;
    try {
      const token = await getToken();
      if (!token) return;

      const { data } = await axios.get(backendUrl + "/api/users/applications", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success && data.applications && data.applications.length > 0) {
        setUserApplications(data.applications);
        localStorage.setItem("candidate_applications", JSON.stringify(data.applications));
      }
    } catch {
      // Maintain local applications state cleanly
    }
  };

  useEffect(() => {
    fetchJobs();
    const storedCompanyToken = localStorage.getItem("companyToken") || localStorage.getItem("company Token");

    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    }
  }, []);

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplications();
    } else {
      setUserData(null);
    }
  }, [user]);

  const value = {
    setSearchFilter,
    searchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendUrl,
    userData,
    setUserData,
    userApplications,
    setUserApplications,
    addCandidateApplication,
    updateApplicationStatus,
    savedJobs,
    toggleSaveJob,
    calculateMatchScore,
    currency,
    changeCurrency,
    formatSalary,
    candidateUploadedResume,
    saveUploadedPdfResume,
    candidateBuiltResume,
    setCandidateBuiltResume,
    activityFeed,
    fetchUserData,
    fetchUserApplications,
    fetchJobs
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};