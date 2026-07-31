import React from "react";

const PdfPreviewModal = ({ pdfObj, isOpen, onClose }) => {
  if (!isOpen || !pdfObj) return null;

  const pdfUrl = typeof pdfObj === "string" ? pdfObj : pdfObj.url || "#";
  const pdfName = (typeof pdfObj === "object" && pdfObj.name) ? pdfObj.name : "Candidate_Resume.pdf";

  const handleDownload = () => {
    try {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = pdfName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      window.open(pdfUrl, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-6 flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 px-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500/20 text-emerald-300 rounded-xl flex items-center justify-center text-lg border border-emerald-500/30">
              📄
            </div>
            <div>
              <h3 className="text-base font-extrabold">{pdfName}</h3>
              <p className="text-xs text-gray-300">Candidate PDF Resume Previewer</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>⬇️ Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 h-8 w-8 rounded-full flex items-center justify-center text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PDF Embedded Frame */}
        <div className="flex-1 bg-slate-100 p-2 overflow-hidden relative">
          {pdfUrl && pdfUrl !== "#" ? (
            <iframe
              src={pdfUrl}
              title={pdfName}
              className="w-full h-full rounded-2xl border border-gray-200 bg-white"
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-xs font-semibold">
              PDF content preview unavailable
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center shrink-0 px-6">
          <span className="text-xs text-gray-500 font-medium">Verified PDF Document Preview</span>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2 rounded-xl cursor-pointer"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );
};

export default PdfPreviewModal;
