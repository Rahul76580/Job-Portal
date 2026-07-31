import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 py-6">
      <div className="container px-4 2xl:px-20 mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img width={140} src={assets.logo} alt="Logo" />
          <span className="text-xs text-gray-500 border-l border-gray-300 pl-3">
            Designed & Developed by Rahul Singh
          </span>
        </div>

        {/* Rahul Singh's Social Links */}
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-700">
          <a
            href="https://www.linkedin.com/in/rahul-singh-949a0328a/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3.5 py-1.5 rounded-xl transition-colors"
          >
            <span>💼 LinkedIn</span>
          </a>

          <a
            href="https://github.com/Rahul76580"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-3.5 py-1.5 rounded-xl transition-colors"
          >
            <span>🐙 GitHub</span>
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;