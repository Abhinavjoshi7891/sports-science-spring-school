import React from 'react';

interface RegistrationPageProps {
  onCancel: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onCancel, theme, toggleTheme }) => {
  return (
    <div className="flex-grow w-full h-screen flex flex-col lg:flex-row overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-body transition-colors duration-300">
      {/* Left Column: Programme Summary */}
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
              An intensive residential programme for researchers and practitioners.
            </p>
          </div>

          {/* Programme Key Facts */}
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

        </div>
      </aside>

      {/* Right Column: Registration Process */}
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

        <div className="max-w-3xl mx-auto px-6 py-12 lg:px-16 lg:py-20">
          <div className="mb-12 border-b border-slate-200 dark:border-border-dark pb-8">
            <h2 className="text-3xl font-display font-bold text-primary dark:text-white mb-4">Registration Process</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Please follow the steps below to secure your seat in the Spring School.
            </p>
          </div>

          <div className="space-y-8 mb-16">
            {[
              {
                step: '1',
                title: 'Registration Form',
                desc: 'Fill out the official registration form with your personal and academic details.'
              },
              {
                step: '2',
                title: 'Payment Link',
                desc: 'The registration team will reach out to your email address with a payment link from the official IIT DELHI CEP PAY Portal.'
              },
              {
                step: '3',
                title: 'Save Confirmation',
                desc: 'Keep a copy of the payment confirmation for your records.'
              },
              {
                step: '4',
                title: 'Final Confirmation',
                desc: 'Once payment is confirmed, you will receive an email within 48 hours confirming your registration.'
              }
            ].map((item) => (
              <div key={item.step} className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/5 dark:bg-white/5 border-2 border-primary/20 dark:border-white/20 flex items-center justify-center font-bold text-primary dark:text-accent group-hover:bg-primary group-hover:text-white dark:group-hover:bg-accent dark:group-hover:text-primary transition-all duration-300">
                  {item.step}
                </div>
                <div className="pt-2">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-serif">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="bg-slate-50 dark:bg-surface-dark rounded-2xl p-8 border border-slate-200 dark:border-border-dark text-center shadow-sm">
            <button
              onClick={() => window.open('https://forms.gle/xkPYxwqSsipCxFVL6', '_blank')}
              className="w-full sm:w-auto bg-primary hover:bg-primary-light text-white font-black px-10 py-5 rounded-lg text-lg tracking-widest uppercase shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-3 mx-auto"
            >
              <span>Click Here For Registration Form</span>
              <span className="material-symbols-outlined">open_in_new</span>
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-6 font-medium">
              You will be redirected to Google Forms to complete your details.
            </p>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={onCancel}
              className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
            >
              Return back to home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegistrationPage;