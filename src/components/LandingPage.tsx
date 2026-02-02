import React, { useState, useEffect, useRef } from 'react';
import { Speaker, SyllabusModule } from '../App';
import confetti from 'canvas-confetti';
import iitdLogo from '../assets/images/iitd-logo.png';
import exeterLogo from '../assets/images/University-of-Exeter-logo.png';
import saiLogo from '../assets/images/sai-logo.jpg';
import iitdMainBuilding from '../assets/images/iitd.jpg';
import programOverviewImg from '../assets/images/program-overview.png';
import profDeepakJoshiImg from '../assets/images/Prof-Deepak-Joshi-CBME-IIT-Delhi.png';
import profMarkImg from '../assets/images/Prof-Mark-Wilson-University-of-Exeter.png';
import profBiswarupImg from '../assets/images/Prof-Biswarup-Mukherjee-CBME-IIT-Delhi.png';
import profDominicImg from '../assets/images/Prof-Dominic-Farris-PHSS-University-of-Exeter.png';
import nokovLogo from '../assets/images/Nokov.motion_capture-3IkHo-Ez (1).png';
import tecGihanLogo from '../assets/images/Tec_gihan_co.jpg';
import delsysLogo from '../assets/images/Delsys Logo.png';
import cadLogo from '../assets/images/cad engineering services .png';

interface LandingPageProps {
    onRegister: () => void;
    onDownload: (type: 'brochure' | 'syllabus') => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    speakers: Speaker[];
    syllabus: SyllabusModule[];
}

const LandingPage: React.FC<LandingPageProps> = ({
    onRegister,
    onDownload,
    theme,
    toggleTheme,
    speakers,
    syllabus
}) => {
    // Syllabus Modal State
    const [activeModule, setActiveModule] = useState<SyllabusModule | null>(null);

    // Mobile Menu State
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Focused Speaker State for Carousel Effect
    const [focusedSpeakerIdx, setFocusedSpeakerIdx] = useState(0);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);

    // Speaker Carousel Logic
    const speakerScrollRef = useRef<HTMLDivElement>(null);

    const scrollSpeakers = (direction: 'left' | 'right') => {
        if (speakerScrollRef.current) {
            const container = speakerScrollRef.current;
            const cards = container.querySelectorAll('.speaker-card');
            if (cards.length === 0) return;

            let targetIdx;
            if (direction === 'left') {
                targetIdx = focusedSpeakerIdx - 1;
                if (targetIdx < 0) targetIdx = cards.length - 1;
            } else {
                targetIdx = focusedSpeakerIdx + 1;
                if (targetIdx >= cards.length) targetIdx = 0;
            }

            const targetCard = cards[targetIdx] as HTMLElement;
            const containerWidth = container.offsetWidth;
            const cardWidth = targetCard.offsetWidth;
            const scrollTarget = targetCard.offsetLeft - (containerWidth / 2) + (cardWidth / 2);

            container.scrollTo({
                left: scrollTarget,
                behavior: 'smooth'
            });
        }
    };

    // Auto-scroll logic for Speakers
    useEffect(() => {
        if (!isAutoScrolling || !speakerScrollRef.current) return;

        const interval = setInterval(() => {
            const container = speakerScrollRef.current;
            if (container) {
                const cards = container.querySelectorAll('.speaker-card');
                if (cards.length === 0) return;

                // Find the next card index
                let nextIdx = (focusedSpeakerIdx + 1) % cards.length;

                const targetCard = cards[nextIdx] as HTMLElement;
                const containerWidth = container.offsetWidth;
                const cardWidth = targetCard.offsetWidth;

                // Calculate scroll position to center the target card
                // position = cardOffset - (containerWidth/2) + (cardWidth/2)
                const scrollTarget = targetCard.offsetLeft - (containerWidth / 2) + (cardWidth / 2);

                container.scrollTo({
                    left: scrollTarget,
                    behavior: 'smooth'
                });
            }
        }, 2500); // Increased speed for faster transitions

        return () => clearInterval(interval);
    }, [isAutoScrolling, focusedSpeakerIdx, speakers.length]);

    // Intersection logic to detect "focused" speaker in the middle
    useEffect(() => {
        const container = speakerScrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            const cards = container.querySelectorAll('.speaker-card');
            const containerCenter = container.getBoundingClientRect().left + container.offsetWidth / 2;

            let closestIdx = 0;
            let minDistance = Infinity;

            cards.forEach((card, idx) => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                const distance = Math.abs(containerCenter - cardCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestIdx = idx;
                }
            });

            setFocusedSpeakerIdx(closestIdx);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check
        setTimeout(handleScroll, 100);

        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    // Certificate Tilt & Confetti Logic
    const [certStyle, setCertStyle] = useState<React.CSSProperties>({});

    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('sending');

        try {
            const response = await fetch('/api/contact.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactForm)
            });

            if (response.ok) {
                setSubmitStatus('success');
                setContactForm({ name: '', email: '', subject: '', message: '' });
                setTimeout(() => setSubmitStatus('idle'), 5000);
            } else {
                setSubmitStatus('error');
                setTimeout(() => setSubmitStatus('idle'), 5000);
            }
        } catch (error) {
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 5000);
        }
    };

    const handleCertMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation based on mouse position (max 25 degrees for more prominence)
        const rotateX = ((y - centerY) / centerY) * -25;
        const rotateY = ((x - centerX) / centerX) * 25;

        setCertStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.1, 1.1, 1.1)`,
            transition: 'transform 0.05s ease',
            zIndex: 50,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' // Add deep shadow on lift
        });
    };

    const handleCertMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        // Fire confetti from the center of the card relative to viewport
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        // Helper to handle ESM default export potential issues
        const fire = (confetti as any).default || confetti;

        if (typeof fire === 'function') {
            fire({
                particleCount: 150,
                spread: 120,
                origin: { x, y },
                zIndex: 9999, // Ensure it's on top of everything
                colors: ['#c5a059', '#003366', '#ffffff', '#FFD700'],
                startVelocity: 45,
                ticks: 200
            });
        }
    };

    const handleCertMouseLeave = () => {
        setCertStyle({
            transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
            transition: 'transform 0.5s ease',
            zIndex: 1
        });
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-background-dark transition-colors duration-300 font-body">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 w-full bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-border-dark px-6 py-4 shadow-sm">
                <div className="mx-auto max-w-7xl flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-[#003366] dark:text-blue-400">back_hand</span>
                        <div className="text-primary dark:text-white flex flex-col">
                            <h1 className="flex items-baseline leading-none tracking-tight">
                                <span className="text-3xl font-black text-[#003366] dark:text-white">RISE</span>
                                <span className="text-3xl font-light text-[#003366] dark:text-white ml-1.5">Lab</span>
                            </h1>
                            <div className="flex justify-between w-full text-[0.42rem] font-bold uppercase text-slate-500 mt-0.5">
                                {"DEVICES FOR RECOVERY".split("").map((char, i) => (
                                    <span key={i}>{char === " " ? "\u00A0" : char}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-8">
                        {['Home', 'Research', 'Publication', 'Team', 'Join us', 'Contact'].map((item) => (
                            <a key={item} href="#" className="text-[#0056b3] dark:text-blue-400 font-medium text-base hover:text-[#003366] transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Action Button & Theme Toggle */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                            aria-label="Toggle theme"
                        >
                            <span className="material-symbols-outlined text-xl">
                                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                        <button onClick={(e) => e.preventDefault()} className="hidden sm:block bg-[#0056b3] text-white px-5 py-2 rounded-md font-bold text-sm hover:bg-[#004494] transition shadow-md whitespace-nowrap">
                            Spring School
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <span className="material-symbols-outlined">
                                {mobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-border-dark shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex flex-col p-6 gap-4">
                            {['Home', 'Research', 'Publication', 'Team', 'Join us', 'Contact'].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-lg font-medium text-[#0056b3] dark:text-blue-400 hover:translate-x-2 transition-transform"
                                >
                                    {item}
                                </a>
                            ))}
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                }}
                                className="mt-4 w-full bg-[#0056b3] text-white py-4 rounded-lg font-bold text-lg shadow-lg"
                            >
                                Spring School
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-1 w-full space-y-0 pb-0">

                {/* HERO SECTION */}
                <section className="max-w-[1400px] mx-auto px-4 pt-6 pb-20">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 group">

                        {/* Main Image */}
                        <div className="relative h-[550px] lg:h-[650px] w-full">
                            <img
                                src={iitdMainBuilding}
                                alt="IIT Delhi Main Building"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[30s] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none"></div>

                            {/* Top Left Logos Card */}
                            <div className="absolute top-4 left-4 md:top-10 md:left-10 bg-white/95 backdrop-blur-sm rounded-xl py-2 px-4 md:py-3 md:px-6 shadow-xl flex items-center gap-4 md:gap-6 z-10 max-w-[90vw] flex-wrap justify-center sm:justify-start">
                                <a href="https://home.iitd.ac.in/" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-110">
                                    <img src={iitdLogo} alt="IITD" className="h-8 md:h-14 w-auto object-contain" />
                                </a>
                                <div className="w-px h-6 md:h-8 bg-slate-200 hidden sm:block"></div>
                                <a href="https://www.exeter.ac.uk/" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-110">
                                    <img src={exeterLogo} alt="Exeter" className="h-10 md:h-20 w-auto object-contain" />
                                </a>
                                <div className="w-px h-6 md:h-8 bg-slate-200 hidden sm:block"></div>
                                <a href="https://sportsauthorityofindia.nic.in/" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-110">
                                    <img src={saiLogo} alt="SAI" className="h-8 md:h-12 w-auto object-contain" />
                                </a>
                            </div>

                            {/* Hero Text Overlay Case */}
                            <div className="absolute bottom-24 left-6 right-6 lg:left-12 lg:right-auto lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 lg:max-w-xl z-10 pointer-events-none">
                                <h1 className="text-white font-black leading-[1.1] tracking-tight text-[min(7vw,2.5rem)] mb-6 drop-shadow-lg">
                                    SPRING SCHOOL IN <br />
                                    SPORTS TECHNOLOGY, <br />
                                    <span className="text-[#c5a059]">MACHINE LEARNING AND <br /> DATA ANALYTICS</span>
                                </h1>
                                <p className="text-white/90 text-lg md:text-xl font-medium max-w-lg drop-shadow-md lg:block hidden">
                                    An intensive, in-person programme at IIT Delhi for researchers, practitioners, and students exploring the intersection of sports technology, machine learning, and data analytics.
                                </p>
                            </div>
                        </div>

                        {/* Registration Card - Absolute Positioned */}
                        <div className="hidden lg:block absolute top-[42%] right-12 -translate-y-1/2 w-[380px] z-20">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
                                <div className="bg-[#0056b3] dark:bg-[#003366] p-6 text-center">
                                    <h3 className="text-white font-bold text-2xl uppercase tracking-wide">Registration Open Now</h3>
                                </div>
                                <div className="p-8">
                                    <h4 className="text-[#0056b3] dark:text-blue-400 font-bold text-center mb-6 uppercase tracking-wider text-sm">Learn Advanced Tools</h4>
                                    <ul className="space-y-3 text-slate-700 dark:text-slate-300 font-medium mb-8">
                                        {['Data Analytics', 'Machine Learning', 'Biomechanics', 'Physiology', 'Nutrition Interventions', 'Virtual Reality (VR) in Sports'].map(item => (
                                            <li key={item} className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-[18px] text-black dark:text-white font-bold text-xs">circle</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <button onClick={onRegister} className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold py-4 rounded-lg text-lg transition-colors shadow-lg uppercase tracking-wide">
                                        Register Now
                                    </button>
                                    <p className="text-[10px] text-center text-[#0056b3] dark:text-blue-300 mt-3 font-medium">
                                        Limited seats available
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Registration Card (Visible only on small screens) */}
                    <div className="lg:hidden mt-6 relative z-40">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700 mx-4">
                            <div className="bg-[#0056b3] dark:bg-[#003366] p-4 text-center">
                                <h3 className="text-white font-bold text-lg uppercase tracking-wide">Registration Open</h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400 text-center font-medium">Learn Data Analytics, ML, Biomechanics & more.</p>
                                <button onClick={onRegister} className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold py-4 rounded-lg text-lg transition-colors shadow-lg uppercase tracking-wide">
                                    Register Now
                                </button>
                                <p className="text-[10px] text-center text-[#0056b3] dark:text-blue-300 font-medium">
                                    Limited seats available
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Info Bar - Floating/Overlapping */}
                    <div className="relative mt-8 lg:-mt-20 z-30 px-4 lg:px-12 pointer-events-none">
                        <div className="bg-[#004494] dark:bg-[#003366] rounded-2xl shadow-2xl p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-white pointer-events-auto max-w-full lg:max-w-[85%] mx-auto lg:ml-0">

                            {/* Starts */}
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-3xl">calendar_month</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Programme Starts</p>
                                    <p className="text-2xl font-bold font-display">2nd March, 2026</p>
                                </div>
                            </div>

                            <div className="hidden lg:block w-px h-12 bg-white/20"></div>

                            {/* Fees */}
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-3xl">currency_rupee</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Programme Fees For Early Birds</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-lg opacity-50 line-through decoration-white/50 font-medium">₹20,000</span>
                                        <p className="text-2xl font-bold font-display leading-none">₹17,000 + GST</p>
                                        <p className="text-xs font-medium text-white/70">+ Accommodation charges (if required)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Button */}
                            <div className="w-full lg:w-auto mt-2 lg:mt-0">
                                <a
                                    href="/brochure.pdf"
                                    download="brochure.pdf"
                                    className="w-full lg:w-auto bg-white text-[#004494] hover:bg-slate-100 px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">download</span>
                                    Download Brochure
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PROGRAM OVERVIEW */}
                <section className="max-w-7xl mx-auto px-4 pb-16">
                    <h2 className="text-3xl font-black text-center text-primary dark:text-white mb-12 uppercase tracking-wide">Programme Overview</h2>
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-6 text-slate-700 dark:text-slate-300 text-lg leading-relaxed text-justify">
                            <p>
                                The event will be an intensive <strong className="text-black dark:text-white font-bold">in-person training</strong> and upskilling opportunity for <strong className="text-black dark:text-white font-bold">sports coaches, physios, fitness professionals, Sports Scientists and Entrepreneurs</strong> who would like to learn about advanced technological and analytics tools for sporting performance assessment and enhancement through interventions in nutrition, physiology, biomechanics and VR.
                            </p>
                            <p>
                                The event will feature <strong className="text-black dark:text-white font-bold">top faculty</strong> from IIT Delhi, international faculty from University of Exeter and scientists and practitioners from Sports Authority of India.
                            </p>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="aspect-video rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-surface-dark bg-black">
                                <img
                                    src={programOverviewImg}
                                    alt="Classroom Session"
                                    className="w-full h-full object-cover opacity-90"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* BANNER 1: DESIGNED FOR */}
                <section className="w-full">
                    <div className="bg-[#0056b3] dark:bg-[#003366] py-5 text-center shadow-md">
                        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">This Programme Is Specially Designed For</h2>
                    </div>
                    <div className="bg-[#f0f4f8] dark:bg-black/20 py-10 border-b border-slate-200 dark:border-slate-800">
                        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4 md:gap-6">
                            {['Sports Coaches', 'Physios', 'Fitness Professionals', 'Sports Scientists', 'Entrepreneurs'].map((role) => (
                                <div key={role} className="bg-white dark:bg-surface-dark text-slate-800 dark:text-white px-8 py-3 rounded-lg border-2 border-[#0056b3] font-bold text-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default text-center">
                                    {role}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* BANNER 2: FACULTY FROM */}
                <section className="w-full mb-16">
                    <div className="bg-[#0056b3] dark:bg-[#003366] py-5 text-center shadow-md">
                        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">Top International Faculties and Scientists From</h2>
                    </div>
                    <div className="bg-white dark:bg-surface-dark py-10 shadow-inner">
                        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-8 md:gap-20">
                            <a href="https://home.iitd.ac.in/" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-110">
                                <img src={iitdLogo} alt="IITD" className="h-16 w-auto object-contain" />
                            </a>
                            <a href="https://www.exeter.ac.uk/" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-110">
                                <img src={exeterLogo} alt="Exeter" className="h-18 md:h-24 w-auto object-contain" />
                            </a>
                            <a href="https://sportsauthorityofindia.nic.in/" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-110">
                                <img src={saiLogo} alt="SAI" className="h-16 w-auto object-contain" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* NEW: DISTINGUISHED FACULTY CAROUSEL */}
                <section className="bg-slate-50 dark:bg-[#151515] py-20 border-y border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-display font-bold text-[#003366] dark:text-white mb-4">Distinguished Faculty</h2>
                            <p className="text-slate-600 dark:text-slate-400">Our curriculum is delivered by world-renowned academics and industry practitioners.</p>
                        </div>

                        <div className="relative group px-0 md:px-12">
                            {/* Navigation Buttons */}
                            <button
                                onClick={() => scrollSpeakers('left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-surface-dark rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hidden md:flex items-center justify-center text-[#003366] dark:text-white hover:bg-[#003366] hover:text-white dark:hover:bg-blue-600 transition-colors"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>

                            <button
                                onClick={() => scrollSpeakers('right')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-surface-dark rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hidden md:flex items-center justify-center text-[#003366] dark:text-white hover:bg-[#003366] hover:text-white dark:hover:bg-blue-600 transition-colors"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>

                            <div
                                ref={speakerScrollRef}
                                onMouseEnter={() => setIsAutoScrolling(false)}
                                onMouseLeave={() => setIsAutoScrolling(true)}
                                className="flex gap-12 overflow-x-auto snap-x snap-mandatory pb-16 pt-8 scrollbar-hide scroll-smooth px-[20%] md:px-[35%]"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {speakers.map((speaker, idx) => (
                                    <a
                                        key={idx}
                                        href={speaker.link || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`snap-center shrink-0 w-[min(75vw,300px)] block group/card transition-all duration-500 speaker-card ${focusedSpeakerIdx === idx
                                            ? 'scale-110 z-20'
                                            : 'scale-90 opacity-60 blur-[1px]'
                                            }`}
                                    >
                                        <div className={`bg-white dark:bg-surface-dark border p-5 shadow-sm transition-all duration-500 ease-out h-full rounded-2xl relative ${focusedSpeakerIdx === idx
                                            ? 'border-primary dark:border-accent shadow-[0_0_30px_rgba(0,86,179,0.3)] dark:shadow-[0_0_30px_rgba(197,160,89,0.2)]'
                                            : 'border-slate-100 dark:border-slate-800'
                                            }`}>
                                            {/* Image with Dynamic Effects */}
                                            <div className="aspect-[4/5] w-full overflow-hidden bg-slate-200 dark:bg-slate-800 mb-6 rounded-xl shadow-inner relative overflow-hidden">
                                                <img
                                                    src={speaker.img}
                                                    alt={speaker.name}
                                                    className={`h-full w-full object-cover transition-all duration-700 ${focusedSpeakerIdx === idx ? 'scale-110 rotate-1' : 'scale-100'
                                                        }`}
                                                />
                                                {focusedSpeakerIdx === idx && (
                                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none"></div>
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <h3 className={`text-xl font-display font-bold mb-1 transition-colors leading-tight ${focusedSpeakerIdx === idx ? 'text-primary dark:text-accent' : 'text-slate-400 dark:text-slate-500'
                                                    }`}>
                                                    {speaker.name}
                                                </h3>
                                                <p className={`text-xs uppercase tracking-widest font-black mb-2 transition-opacity ${focusedSpeakerIdx === idx ? 'text-[#c5a059] opacity-100' : 'text-slate-400 opacity-60'
                                                    }`}>
                                                    {speaker.org}
                                                </p>
                                                <div className={`h-1 w-12 bg-[#c5a059] mx-auto mb-3 rounded-full transition-all duration-500 ${focusedSpeakerIdx === idx ? 'w-20 opacity-100' : 'w-0 opacity-0'
                                                    }`}></div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 italic leading-tight px-2">{speaker.role}</p>
                                            </div>

                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* HIGHLIGHTS */}
                <section className="max-w-7xl mx-auto px-4 pb-20 bg-[#e8eff6] dark:bg-background-dark py-16 rounded-3xl">
                    <h2 className="text-3xl font-black text-center text-primary dark:text-white mb-12 uppercase tracking-wide">Programme Highlights</h2>

                    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
                        {/* Top Row: 3 items */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { icon: 'groups', title: 'In-Person Training' },
                                { icon: 'co_present', title: 'Live Session' },
                                { icon: 'workspace_premium', title: 'Earn a certificate' },
                            ].map((item, i) => (
                                <div key={i} className="flex h-full shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-lg overflow-hidden group">
                                    <div className="w-24 bg-[#0056b3] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-4xl text-white">{item.icon}</span>
                                    </div>
                                    <div className="bg-white dark:bg-surface-dark flex items-center p-4 flex-1">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{item.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Row: 2 items */}
                        <div className="grid md:grid-cols-2 gap-6 md:w-[85%] md:mx-auto">
                            {[
                                { icon: 'domain', title: 'Technology Demonstration & Training by Industry' },
                                { icon: 'account_balance', title: 'Learn Directly From IIT Delhi & University of Exeter Faculty' },
                            ].map((item, i) => (
                                <div key={i} className="flex h-full shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-lg overflow-hidden group">
                                    <div className="w-24 bg-[#0056b3] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-4xl text-white">{item.icon}</span>
                                    </div>
                                    <div className="bg-white dark:bg-surface-dark flex items-center p-4 flex-1">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{item.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CERTIFICATE */}
                <section className="bg-[#0056b3] dark:bg-[#003366] py-16 text-white overflow-hidden relative">
                    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-bold mb-4 uppercase">Earn a certificate</h2>
                            <p className="text-xl font-medium opacity-90 mb-6">Certified by Experts. Recognized by Institutions.</p>
                            <p className="opacity-80 leading-relaxed max-w-xl">
                                Receive an Official Certificate upon Successful Completion of The Spring School, validating your learning in: Sports Technology, Machine Learning Applications, and Data Analytics in Sports Science.
                            </p>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div
                                onMouseMove={handleCertMouseMove}
                                onMouseEnter={handleCertMouseEnter}
                                onMouseLeave={handleCertMouseLeave}
                                style={certStyle}
                                className="bg-white p-2 rounded shadow-2xl transition-transform duration-100 max-w-xs md:max-w-sm cursor-pointer"
                            >
                                <div className="border-4 border-[#003366] p-6 text-center h-[240px] flex flex-col items-center justify-center bg-slate-50">
                                    <span className="material-symbols-outlined text-6xl text-[#003366] mb-2">workspace_premium</span>
                                    <div className="font-display font-bold text-[#003366] text-xl mb-1">CERTIFICATE</div>
                                    <div className="text-[#003366] text-xs uppercase tracking-widest mb-4">of Completion</div>
                                    <div className="w-16 h-1 bg-[#c5a059] mb-4"></div>
                                    <div className="text-slate-400 text-[10px]">Authorized Signature</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* COURSE SYLLABUS SECTION - NOW WITH TILES & POPUP */}
                <section className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex justify-between items-end mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
                        <div>
                            <h2 className="text-3xl font-display font-bold text-primary dark:text-white">Course Syllabus</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Spring Semester 2026 • 5-Day Intensive</p>
                        </div>
                        <a
                            href="/brochure.pdf"
                            download="brochure.pdf"
                            className="text-[#003366] dark:text-blue-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2 hover:underline"
                        >
                            Download Brochure <span className="material-symbols-outlined text-lg">download</span>
                        </a>
                    </div>

                    <div className="flex flex-col gap-6">
                        {syllabus.map((module) => (
                            <div
                                key={module.id}
                                onClick={() => setActiveModule(module)}
                                className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1 duration-300"
                            >
                                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                                    {/* Module ID Box */}
                                    <div className="flex flex-col items-center justify-center w-20 h-20 border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-black/20 shrink-0 group-hover:bg-[#003366] group-hover:border-[#003366] transition-colors">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase group-hover:text-white/70">MODULE</span>
                                        <span className="text-xl font-bold text-[#003366] dark:text-white group-hover:text-white">{module.id}</span>
                                    </div>

                                    {/* Content Info */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-display font-bold text-[#003366] dark:text-white mb-3 group-hover:text-[#0056b3] dark:group-hover:text-blue-400 transition-colors">{module.title}</h3>
                                        <div className="flex flex-wrap gap-4 lg:gap-8 text-sm text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-lg text-slate-400">person</span>
                                                {module.lead}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-lg text-slate-400">schedule</span>
                                                {module.time}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="w-full lg:w-auto mt-4 lg:mt-0">
                                        <button
                                            className="w-full lg:w-auto px-6 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white font-medium group-hover:bg-[#003366] group-hover:text-white group-hover:border-[#003366] transition-all flex items-center justify-center gap-2 rounded-lg"
                                        >
                                            View Details
                                            <span className="material-symbols-outlined text-sm">visibility</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* COORDINATORS - WITH GRAYSCALE EFFECT & LINKS */}
                <section className="max-w-5xl mx-auto px-4 py-16">
                    <h2 className="text-3xl font-bold text-center text-primary dark:text-white mb-12 uppercase tracking-wide">Programme Coordinators</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <a
                            href="https://cbme.iitd.ac.in/faculty-profile/3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                        >
                            <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-border-dark flex flex-col sm:flex-row gap-6 items-center sm:items-start hover:border-[#003366] hover:shadow-2xl md:hover:-translate-y-4 md:hover:scale-[1.02] transition-all duration-500 ease-out h-full relative z-0 hover:z-10 text-center sm:text-left">
                                <img src={profBiswarupImg} alt="Prof Biswarup Mukherjee" className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 dark:border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                                <div>
                                    <h3 className="text-xl font-bold text-[#003366] dark:text-blue-400 group-hover:underline">Prof. Biswarup Mukherjee</h3>
                                    <p className="text-xs font-bold uppercase text-slate-500 mb-3">Associate Professor, CBME, IIT Delhi</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Coordinator for IIT Delhi - University of Exeter partnership. Research focused on multi-modal platform technologies for neuromuscular activity monitoring.
                                    </p>
                                </div>
                            </div>
                        </a>

                        <a
                            href="https://experts.exeter.ac.uk/27162-dominic-farris"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                        >
                            <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-border-dark flex flex-col sm:flex-row gap-6 items-center sm:items-start hover:border-[#003366] hover:shadow-2xl md:hover:-translate-y-4 md:hover:scale-[1.02] transition-all duration-500 ease-out h-full relative z-0 hover:z-10 text-center sm:text-left">
                                <img src={profDominicImg} alt="Prof Dominic Farris" className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 dark:border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                                <div>
                                    <h3 className="text-xl font-bold text-[#003366] dark:text-blue-400 group-hover:underline">Prof. Dominic Farris</h3>
                                    <p className="text-xs font-bold uppercase text-slate-500 mb-3">Associate Professor, PHSS, Univ. of Exeter</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Extensive research in neuromuscular biomechanics and human movement science, exploring muscle coordination for efficient movement.
                                    </p>
                                </div>
                            </div>
                        </a>
                    </div>
                </section>

                {/* SPONSORS */}
                <section className="max-w-7xl mx-auto px-4 text-center pb-20">
                    <h2 className="text-2xl font-bold text-primary dark:text-white mb-12 uppercase tracking-wide">Tech Demonstration and Sponsors</h2>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
                        <a
                            href="https://en.nokov.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/logo transition-all duration-500 hover:-translate-y-4 hover:scale-110"
                        >
                            <img src={nokovLogo} alt="Nokov" className="h-12 md:h-16 w-auto object-contain transition-all duration-500" />
                        </a>
                        <a
                            href="https://tecgihan.co.jp/en/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/logo transition-all duration-500 hover:-translate-y-4 hover:scale-110"
                        >
                            <img src={tecGihanLogo} alt="Tec Gihan" className="h-12 md:h-16 w-auto object-contain transition-all duration-500" />
                        </a>
                        <a
                            href="https://delsys.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/logo transition-all duration-500 hover:-translate-y-4 hover:scale-110"
                        >
                            <img src={delsysLogo} alt="Delsys" className="h-12 md:h-16 w-auto object-contain transition-all duration-500" />
                        </a>
                        <a
                            href="https://www.cadengineering.co.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/logo transition-all duration-500 hover:-translate-y-4 hover:scale-110"
                        >
                            <img src={cadLogo} alt="CAD Engineering Services" className="h-12 md:h-16 w-auto object-contain transition-all duration-500" />
                        </a>
                    </div>
                </section>

                {/* GET IN TOUCH - DETAILED */}
                <section className="bg-white dark:bg-background-dark py-20 border-t border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-[#003366] dark:text-white mb-4 uppercase tracking-tight">Get In Touch</h2>
                            <p className="text-xl text-slate-500 dark:text-slate-400">Have questions? We'd love to hear from you</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-16">
                            {/* Left Column: Contact Info & Map */}
                            <div className="space-y-8">
                                <h3 className="text-2xl font-bold text-[#003366] dark:text-white uppercase tracking-wide">Contact Info</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-slate-100 dark:bg-surface-dark rounded-lg text-[#0056b3] dark:text-blue-400">
                                            <span className="material-symbols-outlined text-2xl">mail</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Email</h4>
                                            <p className="text-slate-600 dark:text-slate-400 text-lg">sports_iitd_exeter@admin.iitd.ac.in</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-slate-100 dark:bg-surface-dark rounded-lg text-[#0056b3] dark:text-blue-400">
                                            <span className="material-symbols-outlined text-2xl">person_pin_circle</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Location</h4>
                                            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                                                RISE Lab, Block III, Room: 395<br />
                                                IIT Delhi, Hauz Khas<br />
                                                New Delhi - 110016
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Map */}
                                <div className="w-full h-[300px] rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 mt-8 relative bg-slate-100">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.7806509291026!2d77.1929348!3d28.546312099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1d8d3afde403%3A0x750c0bc89f640de7!2sRISE%20Lab!5e0!3m2!1sen!2sin!4v1770036020309!5m2!1sen!2sin"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="RISE Lab Location"
                                        className="transition-all duration-500"
                                    ></iframe>
                                </div>
                            </div>

                            {/* Right Column: Contact Form */}
                            <div className="bg-white dark:bg-surface-dark p-8 md:p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
                                <form className="space-y-6" onSubmit={handleContactSubmit}>
                                    <div className="space-y-2">
                                        <label htmlFor="contact-name" className="text-sm font-bold text-slate-900 dark:text-white">Name</label>
                                        <input
                                            type="text"
                                            id="contact-name"
                                            value={contactForm.name}
                                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#003366] dark:focus:border-blue-400 transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="contact-email" className="text-sm font-bold text-slate-900 dark:text-white">Email</label>
                                        <input
                                            type="email"
                                            id="contact-email"
                                            value={contactForm.email}
                                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#003366] dark:focus:border-blue-400 transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="contact-subject" className="text-sm font-bold text-slate-900 dark:text-white">Subject</label>
                                        <input
                                            type="text"
                                            id="contact-subject"
                                            value={contactForm.subject}
                                            onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#003366] dark:focus:border-blue-400 transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="contact-message" className="text-sm font-bold text-slate-900 dark:text-white">Message</label>
                                        <textarea
                                            id="contact-message"
                                            rows={6}
                                            value={contactForm.message}
                                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#003366] dark:focus:border-blue-400 transition-colors resize-none"
                                        ></textarea>
                                    </div>

                                    <button
                                        disabled={submitStatus === 'sending'}
                                        className={`w-full ${submitStatus === 'success' ? 'bg-green-600' : 'bg-[#0b1120]'} dark:bg-blue-600 text-white font-bold py-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm disabled:opacity-50`}
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            {submitStatus === 'sending' ? 'sync' : submitStatus === 'success' ? 'check_circle' : 'send'}
                                        </span>
                                        {submitStatus === 'sending' ? 'Sending...' : submitStatus === 'success' ? 'Message Sent!' : submitStatus === 'error' ? 'Error - Try Again' : 'Send Message'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CALL TO ACTION - READY TO JOIN */}
                <section className="bg-[#0056b3] text-white py-16 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                        Don't miss this opportunity to learn from leading experts and network with professionals in sports science.
                    </p>
                    <button onClick={onRegister} className="bg-white text-[#0056b3] px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform">
                        Register Now
                    </button>
                </section>

            </main>

            {/* FOOTER - DETAILED */}
            <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 mb-12">
                    {/* Column 1: Brand & Social */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-4xl text-white">back_hand</span>
                            <div className="flex flex-col">
                                <h1 className="flex items-baseline leading-none tracking-tight">
                                    <span className="text-2xl font-black text-white">RISE</span>
                                    <span className="text-2xl font-light text-white ml-1.5">Lab</span>
                                </h1>
                                <div className="flex justify-between w-full text-[0.38rem] font-bold uppercase text-white/50 mt-0.5">
                                    {"DEVICES FOR RECOVERY".split("").map((char, i) => (
                                        <span key={i}>{char === " " ? "\u00A0" : char}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mb-4">
                            Rehab, Instrumentation & Sensory Engineering Lab, IIT Delhi
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity"><span className="material-symbols-outlined">smart_display</span></a>
                            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity"><span className="material-symbols-outlined">alternate_email</span></a>
                            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity"><span className="material-symbols-outlined">public</span></a>
                        </div>
                    </div>

                    {/* Column 2: Navigation */}
                    <div>
                        <h4 className="font-bold uppercase tracking-wider text-sm mb-6 text-white/40">Navigation</h4>
                        <ul className="space-y-3 text-sm text-white/70">
                            <li><a href="#" className="hover:text-white hover:underline">Home</a></li>
                            <li><a href="#" className="hover:text-white hover:underline">Research</a></li>
                            <li><a href="#" className="hover:text-white hover:underline">Team</a></li>
                            <li><a href="#" className="hover:text-white hover:underline">Contact</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h4 className="font-bold uppercase tracking-wider text-sm mb-6 text-white/40">We are located here</h4>
                        <p className="text-white/70 text-sm leading-relaxed mb-4">
                            Block III, Room: 395<br />
                            Indian Institute of Technology Delhi<br />
                            Hauz Khas, New Delhi 110016
                        </p>
                        <p className="text-white/70 text-sm">
                            <span className="block opacity-50 text-xs uppercase">Contact</span>
                            sports_iitd_exeter@admin.iitd.ac.in
                        </p>
                    </div>
                </div>

                {/* Copyright Bar */}
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-white/20 text-xs border-t border-white/5 pt-8 gap-4">
                    <div>&copy; 2026 RISE Lab • IIT Delhi. All rights reserved.</div>
                </div>
            </footer>

            {/* Floating Chat Bot */}

            {/* Course Syllabus Modal */}
            {activeModule && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setActiveModule(null)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white dark:bg-surface-dark w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                        {/* Header */}
                        <div className="bg-[#003366] p-6 text-white flex justify-between items-start">
                            <div>
                                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-2">Module {activeModule.id}</span>
                                <h3 className="text-2xl font-display font-bold">{activeModule.title}</h3>
                            </div>
                            <button
                                onClick={() => setActiveModule(null)}
                                className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                                    <div className="w-10 h-10 rounded-full bg-[#003366] text-white flex items-center justify-center">
                                        <span className="material-symbols-outlined">person</span>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">Lead Faculty</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{activeModule.lead}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                                    <div className="w-10 h-10 rounded-full bg-[#003366] text-white flex items-center justify-center">
                                        <span className="material-symbols-outlined">schedule</span>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">Schedule</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{activeModule.time}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Topics Covered</h4>
                                <ul className="space-y-3">
                                    {activeModule.topics.map((topic, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-[#003366] dark:text-blue-400 text-xl mt-0.5">check_circle</span>
                                            <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{topic}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 bg-slate-50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5 flex justify-end">
                            <button
                                onClick={() => setActiveModule(null)}
                                className="px-6 py-2.5 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold rounded-lg transition-colors"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LandingPage;