import React, { useState, useEffect } from 'react';
import { Lead } from '../App';

interface DownloadPageProps {
  onCancel: () => void;
  onLeadSubmit: (leadData: Omit<Lead, 'id' | 'date'>) => void;
  documentType: 'brochure' | 'syllabus';
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const DownloadPage: React.FC<DownloadPageProps> = ({ onCancel, onLeadSubmit, documentType, theme, toggleTheme }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: ''
  });
  const [isValid, setIsValid] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const { name, email, organization, role } = formData;
    setIsValid(name.trim() !== '' && email.trim() !== '' && organization.trim() !== '' && role.trim() !== '');
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDownload = () => {
    if (!isValid) return;
    
    // Submit lead data
    onLeadSubmit({
        name: formData.name,
        email: formData.email,
        organization: formData.organization,
        role: formData.role,
        downloaded: documentType
    });

    setIsDownloading(true);

    // Simulate file generation and download
    setTimeout(() => {
      // Create a dummy PDF blob
      const title = documentType === 'brochure' ? 'SpringSchool_2026_Brochure' : 'SpringSchool_2026_Syllabus_Full';
      const content = `
        %PDF-1.4
        1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
        2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
        3 0 obj <</Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 500 800] /Contents 6 0 R>> endobj
        4 0 obj <</Font <</F1 5 0 R>>>> endobj
        5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj
        6 0 obj
        << /Length 44 >>
        stream
        BT /F1 24 Tf 100 700 Td (${title}) Tj ET
        endstream
        endobj
        xref
        0 7
        0000000000 65535 f
        0000000009 00000 n
        0000000056 00000 n
        0000000111 00000 n
        0000000212 00000 n
        0000000250 00000 n
        0000000317 00000 n
        trailer <</Size 7 /Root 1 0 R>>
        startxref
        406
        %%EOF
      `;
      
      const blob = new Blob([content], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setIsDownloading(false);
      
      // Optional: Redirect back after download or show success
      // onCancel(); 
    }, 1500);
  };

  const docTitle = documentType === 'brochure' ? 'Official Event Brochure' : 'Detailed Course Syllabus';

  return (
    <div className="flex-grow w-full h-screen flex flex-col lg:flex-row overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-body transition-colors duration-300">
      {/* Left Column: Visual & Info */}
      <aside className="w-full lg:w-[450px] bg-[#003366] dark:bg-surface-dark border-b lg:border-b-0 lg:border-r border-primary-light dark:border-border-dark flex-shrink-0 flex flex-col relative h-[250px] lg:h-full transition-colors duration-300 text-white">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 flex flex-col h-full p-8 lg:p-12">
          {/* Back Button */}
          <div className="mb-8">
            <button 
                onClick={onCancel}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider"
            >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Return to Home
            </button>
          </div>

          <div className="mt-auto lg:mt-0 mb-4">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <span className="material-symbols-outlined text-4xl text-[#c5a059]">
                    {documentType === 'brochure' ? 'menu_book' : 'description'}
                </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold leading-tight mb-4 text-white">
                Download {documentType === 'brochure' ? 'Brochure' : 'Syllabus'}
            </h1>
            <p className="text-white/70 text-base leading-relaxed font-serif">
              Please provide your details to receive the {docTitle} for the Spring School on Sports Science 2026.
            </p>
          </div>
          
          <div className="hidden lg:block mt-auto text-white/40 text-xs">
              <p>&copy; 2026 RISE Lab, IIT Delhi</p>
          </div>
        </div>
      </aside>

      {/* Right Column: Details Form */}
      <main className="flex-1 bg-white dark:bg-background-dark relative overflow-y-auto transition-colors duration-300 flex items-center justify-center p-6">
        
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6 z-20">
             <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined text-xl">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
        </div>

        <div className="w-full max-w-lg">
          <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Information</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Fill in the fields below to unlock the download.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name</label>
              <input 
                type="text" 
                name="name"
                id="name" 
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white border border-slate-300 dark:border-border-dark rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#003366] dark:focus:ring-blue-500 transition-colors"
                placeholder="Dr. John Doe"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
              <input 
                type="email" 
                name="email"
                id="email" 
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white border border-slate-300 dark:border-border-dark rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#003366] dark:focus:ring-blue-500 transition-colors"
                placeholder="john@university.edu"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="organization" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Organization</label>
                    <input 
                        type="text" 
                        name="organization"
                        id="organization" 
                        value={formData.organization}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white border border-slate-300 dark:border-border-dark rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#003366] dark:focus:ring-blue-500 transition-colors"
                        placeholder="IIT Delhi"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Role</label>
                    <input 
                        type="text" 
                        name="role"
                        id="role" 
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white border border-slate-300 dark:border-border-dark rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#003366] dark:focus:ring-blue-500 transition-colors"
                        placeholder="Professor / Student"
                    />
                </div>
            </div>

            <div className="pt-4">
              <button 
                type="button" 
                onClick={handleDownload}
                disabled={!isValid || isDownloading}
                className={`w-full py-4 px-6 rounded-lg font-bold tracking-wider uppercase text-sm shadow-md transition-all flex items-center justify-center gap-2
                    ${isValid 
                        ? 'bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700 text-white transform hover:-translate-y-1' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }
                `}
              >
                {isDownloading ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Downloading...
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-lg">download</span>
                        Download {documentType === 'brochure' ? 'Brochure' : 'PDF'}
                    </>
                )}
              </button>
              {!isValid && (
                  <p className="text-center text-xs text-slate-400 mt-3">Please complete all fields to enable download</p>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default DownloadPage;