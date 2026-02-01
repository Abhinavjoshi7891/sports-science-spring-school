import React from 'react';

interface RegistrationPageProps {
  onCancel: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onCancel, theme, toggleTheme }) => {
  return (
    <div className="flex-grow w-full h-screen flex flex-col lg:flex-row overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-body transition-colors duration-300">
      {/* Left Column: Program Summary */}
      <aside className="w-full lg:w-[450px] bg-primary dark:bg-surface-dark border-b lg:border-b-0 lg:border-r border-primary-light dark:border-border-dark flex-shrink-0 flex flex-col relative h-[300px] lg:h-full transition-colors duration-300 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        <div className="relative z-10 flex flex-col h-full p-8 lg:p-12 overflow-y-auto">
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

          <div className="mb-10">
            <div className="inline-block border border-accent/50 rounded px-2 py-1 mb-4">
              <span className="text-xs font-bold tracking-widest uppercase text-accent">Spring Semester 2026</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold leading-tight mb-4 text-white">Spring School in Sports Technology, Machine Learning and Data Analytics</h1>
            <p className="text-white/70 text-base leading-relaxed font-serif">
              An intensive residential program for researchers and practitioners.
            </p>
          </div>

          {/* Program Key Facts */}
          <div className="space-y-6 mb-8 border-t border-white/10 pt-8">
            <div className="flex gap-4">
              <div className="text-accent mt-1">
                <span className="material-symbols-outlined">calendar_month</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm uppercase tracking-wide">Course Dates</p>
                <p className="text-white/80 font-serif">March 2nd - 6th, 2026</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-accent mt-1">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm uppercase tracking-wide">Location</p>
                <p className="text-white/80 font-serif">IIT Delhi Campus, New Delhi</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-accent mt-1">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm uppercase tracking-wide">Tuition Fees</p>
                <p className="text-white/80 font-serif">INR 17,000 + GST</p>
                <p className="text-xs text-white/50 mt-0.5">Includes course materials & certification</p>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-3 opacity-60">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
              <span className="text-xs leading-tight">Accredited by the<br />National Board of Sports Science</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Column: Enrollment Form */}
      <main className="flex-1 bg-white dark:bg-background-dark relative overflow-y-auto transition-colors duration-300">

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

        <div className="max-w-3xl mx-auto px-6 py-12 lg:px-16 lg:py-16">
          <div className="mb-10 border-b border-slate-200 dark:border-border-dark pb-6">
            <h2 className="text-2xl font-display font-bold text-primary dark:text-white">Candidate Enrollment</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Please complete your academic profile to proceed with the application.</p>
          </div>

          <form action="#" className="space-y-10" onSubmit={(e) => e.preventDefault()}>
            {/* Section: Candidate Details */}
            <section>
              <h3 className="text-lg font-bold text-primary dark:text-white mb-6 flex items-center gap-2 uppercase tracking-wide text-sm">
                <span className="material-symbols-outlined text-accent text-lg">person</span>
                Candidate Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">First Name</label>
                  <input type="text" id="firstName" className="w-full bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white border border-slate-300 dark:border-border-dark rounded-sm px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent transition-colors" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Last Name</label>
                  <input type="text" id="lastName" className="w-full bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white border border-slate-300 dark:border-border-dark rounded-sm px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent transition-colors" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Institutional Email</label>
                  <input type="email" id="email" placeholder="name@university.edu" className="w-full bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white border border-slate-300 dark:border-border-dark rounded-sm px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent transition-colors" />
                </div>
              </div>
            </section>

            {/* Section: Academic Profile */}
            <section>
              <h3 className="text-lg font-bold text-primary dark:text-white mb-6 flex items-center gap-2 uppercase tracking-wide text-sm">
                <span className="material-symbols-outlined text-accent text-lg">school</span>
                Academic Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="institution" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Affiliated Institution / Organization</label>
                  <input type="text" id="institution" className="w-full bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white border border-slate-300 dark:border-border-dark rounded-sm px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent transition-colors" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Position</label>
                  <input type="text" id="role" placeholder="e.g. PhD Candidate, Lecturer" className="w-full bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white border border-slate-300 dark:border-border-dark rounded-sm px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent transition-colors" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="field" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Research Interest</label>
                  <div className="relative">
                    <select id="field" className="w-full appearance-none bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white border border-slate-300 dark:border-border-dark rounded-sm px-4 py-3 pr-8 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent transition-colors">
                      <option>Biomechanics</option>
                      <option>Applied Physiology</option>
                      <option>Sports Psychology</option>
                      <option>Performance Analysis</option>
                      <option>Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-white">
                      <span className="material-symbols-outlined text-sm">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Logistics */}
            <section>
              <h3 className="text-lg font-bold text-primary dark:text-white mb-6 flex items-center gap-2 uppercase tracking-wide text-sm">
                <span className="material-symbols-outlined text-accent text-lg">hotel</span>
                Residency Options
              </h3>
              <div className="bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-base font-bold text-primary dark:text-white">Limited Accomodation Available</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-serif">will be confirmed later.</p>
                </div>
                {/* Toggle */}
                <div className="flex items-center">
                  <label htmlFor="accommodation-toggle" className="flex items-center cursor-pointer relative">
                    <input type="checkbox" id="accommodation-toggle" className="sr-only peer" />
                    <div className="w-14 h-7 bg-slate-300 dark:bg-border-dark peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                    <span className="ml-3 text-sm font-bold text-primary dark:text-white">Do you want accomodation?</span>
                  </label>
                </div>
              </div>
            </section>

            {/* Form Actions */}
            <div className="pt-6 flex flex-col-reverse sm:flex-row gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 px-6 rounded-sm border border-slate-300 dark:border-border-dark text-slate-700 dark:text-white font-bold hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors uppercase tracking-wider text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => window.open('https://forms.gle/xkPYxwqSsipCxFVL6', '_blank')}
                className="flex-[2] py-3 px-6 rounded-sm bg-primary hover:bg-primary-light text-white font-bold tracking-wider uppercase text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Proceed to Payment</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegistrationPage;