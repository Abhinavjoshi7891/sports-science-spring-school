import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import RegistrationPage from './components/RegistrationPage';
import DownloadPage from './components/DownloadPage';
import AdminPanel from './components/AdminPanel';

// Import Speaker Images
import brigBibhuImg from './assets/images/Brig-Bibhu-Kalyan-Nayak-Director-NCSSR-SAI.png';
import drChrisImg from './assets/images/Dr-Chris-Byrne-PHSS-University-of-Exeter.png';
import drManishImg from './assets/images/Dr-Manish-Rana-Paralympic-Committee-of-India.png';
import drShatarupaImg from './assets/images/Dr-Shatarupa-Chakraborty-NCSSR-SAI.png';
import drSubhraImg from './assets/images/Dr-Subhra-Chatterjee-NCSSR-SAI.png';
import drTimImg from './assets/images/Dr-Tim-Podlogar-University-of-Exeter.png';
import jamesRhodesImg from './assets/images/James-Rhodes-Data Scientist-University-of-Exeter.png';
import manikandanImg from './assets/images/Mr-Manikandan-TAs-at-IIT-Delhi.png';
import nikhilImg from './assets/images/Mr-Nikhil-Chowdhary-TAs-at-IIT-Delhi.png';
import sankarImg from './assets/images/Mr-Sankar-Balasubramanian-IISC.png';
import tanishaImg from './assets/images/Ms-Tanisha-Majumdar-TAs-at-IIT-Delhi.png';
import profDeepakJoshiImg from './assets/images/Prof-Deepak-Joshi-CBME-IIT-Delhi.png';
import profJoannaImg from './assets/images/Prof-Joanna-Bowtell-PHSS-University-of-Exeter.png';
import profKKDeepakImg from './assets/images/Prof-K-K-Deepak-IIT-Delhi.png';
import profKaushikImg from './assets/images/Prof-Kaushik-Mukherjee-ME-IIT-Delhi.png';
import profMarkImg from './assets/images/Prof-Mark-Wilson-University-of-Exeter.png';
import profShahidImg from './assets/images/Prof-Shahid-Malik-CeNSE-IIT-Delhi.png';
import abhinavJoshiImg from './assets/images/abhinav-joshi.jpg';
import profBiswarupImg from './assets/images/Prof-Biswarup-Mukherjee-CBME-IIT-Delhi.png';
import profDominicImg from './assets/images/Prof-Dominic-Farris-PHSS-University-of-Exeter.png';

export type ViewState = 'landing' | 'register' | 'download' | 'admin';
export type Theme = 'light' | 'dark';
export type DocumentType = 'brochure' | 'syllabus';

// Types for our Data
export interface Speaker {
  id: string;
  name: string;
  org: string;
  role: string;
  img: string;
  link?: string;
}

export interface SyllabusModule {
  id: string;
  title: string;
  lead: string;
  time: string;
  topics: string[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  downloaded: string;
  date: string;
}

// Initial Data
const INITIAL_SPEAKERS: Speaker[] = [
  { id: '1', name: 'Prof. Deepak Joshi', org: 'CBME, IIT DELHI', role: 'Associate Professor', img: profDeepakJoshiImg, link: 'https://cbme.iitd.ac.in/faculty-profile/15' },
  { id: '2', name: 'Prof. Mark Wilson', org: 'UNIV. OF EXETER', role: 'Professor of Performance Psychology', img: profMarkImg, link: 'https://experts.exeter.ac.uk/1051-mark-wilson' },
  { id: '3', name: 'Brig. Bibhu Nayak', org: 'NCSSR, SAI', role: 'Director', img: brigBibhuImg, link: 'https://sportsauthorityofindia.nic.in/' },
  { id: '4', name: 'Prof. Joanna Bowtell', org: 'UNIV. OF EXETER', role: 'Professor of Applied Physiology', img: profJoannaImg, link: 'https://experts.exeter.ac.uk/20502-joanna-bowtell' },
  { id: '5', name: 'Prof. K. K. Deepak', org: 'IIT DELHI', role: 'Professor of Physiology', img: profKKDeepakImg, link: 'https://cbme.iitd.ac.in/faculty-profile/21' },
  { id: '6', name: 'Dr. Chris Byrne', org: 'UNIV. OF EXETER', role: 'Associate Professor', img: drChrisImg, link: 'https://experts.exeter.ac.uk/1040-chris-byrne' },
  { id: '7', name: 'Prof. Kaushik Mukherjee', org: 'ME, IIT DELHI', role: 'Associate Professor', img: profKaushikImg, link: 'https://mech.iitd.ac.in/faculty-profile/192' },
  { id: '8', name: 'Dr. Tim Podlogar', org: 'UNIV. OF EXETER', role: 'Research Fellow & Nutritionist', img: drTimImg, link: 'https://experts.exeter.ac.uk/43996-tim-podlogar' },
  { id: '9', name: 'Prof. Shahid Malik', org: 'CeNSE, IIT DELHI', role: 'Professor', img: profShahidImg, link: 'https://web.iitd.ac.in/~smalik/' },
  { id: '10', name: 'Dr. Manish Rana', org: 'PCI', role: 'Sports Scientist', img: drManishImg, link: 'https://in.linkedin.com/in/manish-rana' },
  { id: '11', name: 'Dr. Shatarupa Chakraborty', org: 'NCSSR, SAI', role: 'Scientist', img: drShatarupaImg, link: 'https://in.linkedin.com/in/dr-shatarupa-chakraborty-6b120590' },
  { id: '12', name: 'Dr. Subhra Chatterjee', org: 'NCSSR, SAI', role: 'Scientist', img: drSubhraImg, link: 'https://in.linkedin.com/in/dr-subhra-chatterjee-7a3555154' },
  { id: '13', name: 'James Rhodes', org: 'UNIV. OF EXETER', role: 'Data Scientist', img: jamesRhodesImg, link: 'https://www.exeter.ac.uk/' },
  { id: '14', name: 'Mr. Sankar Balasubramanian', org: 'IISC', role: 'Research Scholar', img: sankarImg, link: 'https://in.linkedin.com/in/sankar4' },
  { id: '15', name: 'Mr. Manikandan', org: 'IIT DELHI', role: 'Technical Assistant', img: manikandanImg, link: 'https://in.linkedin.com/in/manikandaniitd' },
  { id: '16', name: 'Mr. Nikhil Chowdhary', org: 'IIT DELHI', role: 'Technical Assistant', img: nikhilImg, link: 'https://www.linkedin.com/in/nikhil-chowdhary-756a292ab/' },
  { id: '17', name: 'Ms. Tanisha Majumdar', org: 'IIT DELHI', role: 'Technical Assistant', img: tanishaImg, link: 'https://in.linkedin.com/in/tanisha-majumdar-17a6a4206' },
  { id: '18', name: 'Mr. Abhinav Joshi', org: 'IIT DELHI', role: 'Technical Assistant', img: abhinavJoshiImg, link: 'https://www.linkedin.com/in/abhinav-joshi-949a9227' },
  { id: '19', name: 'Prof. Biswarup Mukherjee', org: 'CBME, IIT DELHI', role: 'Associate Professor', img: profBiswarupImg, link: 'https://cbme.iitd.ac.in/faculty-profile/3' },
  { id: '20', name: 'Prof. Dominic Farris', org: 'PHSS, UNIV. OF EXETER', role: 'Associate Professor', img: profDominicImg, link: 'https://experts.exeter.ac.uk/27162-dominic-farris' },
];

const INITIAL_SYLLABUS: SyllabusModule[] = [
  {
    id: 'M101',
    title: 'Foundations of Biomechanics',
    lead: 'Dr. Rajesh Kumar',
    time: 'Day 1 • 09:00 - 17:00',
    topics: ['Incorporating Technology in Sports', 'Exercise Physiology and Role of Sensing', 'Sensing Muscle Function - EMG and Ultrasound', 'Application in practice - GPS']
  },
  {
    id: 'M102',
    title: 'Data Acquisition & Sensor Technology',
    lead: 'Prof. Sarah Jenkins',
    time: 'Day 2 • 09:00 - 17:00',
    topics: ['Evidence and Technology based Approach to Sports Nutrition', 'Biosensing based insights into exercise', 'Physical performance in the heat', 'Role of Technology for Parasports']
  },
  {
    id: 'A201',
    title: 'Artificial Intelligence in Kinematics',
    lead: 'Dr. Emily Chen',
    time: 'Day 3 • 09:00 - 17:00',
    topics: ['Introduction to AI and ML in Sports', 'Applied Data Science in Sports', 'Predictive Modelling for Injury Prevention', 'Computer Vision in Motion Analysis']
  },
  {
    id: 'L301',
    title: 'Laboratory: Applied Motion Analysis',
    lead: 'Faculty Staff',
    time: 'Day 4 • 09:00 - 16:00',
    topics: ['Hands on Demo: Motion capture (Sponsored by Nokov)', 'Hands on Demo: Wireless EMG data processing', 'Muscle oximetry, biomechanics (Delsys, Vo2Master)', 'VR Environment design basic game design']
  },
  {
    id: 'C400',
    title: 'Capstone Project & Colloquium',
    lead: 'Guest Speakers',
    time: 'Day 5 • 10:00 - 14:00',
    topics: ['Group Project Presentations', 'Panel Discussion with Industry Experts', 'Certification Ceremony', 'Networking Lunch']
  },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [downloadDocType, setDownloadDocType] = useState<DocumentType>('brochure');

  // -- Data State (Mocking a Database) --
  // We use localStorage to persist changes made in the Admin Panel
  const [speakers, setSpeakers] = useState<Speaker[]>(() => {
    const saved = localStorage.getItem('speakers_v3');
    return saved ? JSON.parse(saved) : INITIAL_SPEAKERS;
  });

  const [syllabus, setSyllabus] = useState<SyllabusModule[]>(() => {
    const saved = localStorage.getItem('syllabus');
    return saved ? JSON.parse(saved) : INITIAL_SYLLABUS;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('leads');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to local storage whenever data changes
  useEffect(() => {
    // Force refresh if the data is outdated (checking for Nikhil's link as a proxy)
    const isOutdated = !speakers.some(s => s.name === 'Mr. Nikhil Chowdhary' && s.link?.includes('nikhil-chowdhary'));
    if (isOutdated) {
      setSpeakers(INITIAL_SPEAKERS);
    }
    localStorage.setItem('speakers_v3', JSON.stringify(speakers));
  }, [speakers]);
  useEffect(() => { localStorage.setItem('syllabus', JSON.stringify(syllabus)); }, [syllabus]);
  useEffect(() => { localStorage.setItem('leads', JSON.stringify(leads)); }, [leads]);


  // -- Theme State --
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme;
      if (saved) return saved;
      return 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // -- Navigation --
  const navigateToRegister = () => {
    window.scrollTo(0, 0);
    setCurrentView('register');
  };

  const navigateToDownload = (type: DocumentType) => {
    setDownloadDocType(type);
    window.scrollTo(0, 0);
    setCurrentView('download');
  };

  const navigateToHome = () => {
    window.scrollTo(0, 0);
    setCurrentView('landing');
  };

  const navigateToAdmin = () => {
    window.scrollTo(0, 0);
    setCurrentView('admin');
  }

  // -- Data Handlers --
  const handleLeadSubmit = (leadData: Omit<Lead, 'id' | 'date'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    };
    setLeads(prev => [newLead, ...prev]);
  };

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage
          onRegister={navigateToRegister}
          onDownload={navigateToDownload}
          onAdminClick={navigateToAdmin}
          theme={theme}
          toggleTheme={toggleTheme}
          speakers={speakers}
          syllabus={syllabus}
        />
      )}
      {currentView === 'register' && (
        <RegistrationPage
          onCancel={navigateToHome}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
      {currentView === 'download' && (
        <DownloadPage
          onCancel={navigateToHome}
          onLeadSubmit={handleLeadSubmit}
          documentType={downloadDocType}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
      {currentView === 'admin' && (
        <AdminPanel
          onExit={navigateToHome}
          speakers={speakers}
          setSpeakers={setSpeakers}
          syllabus={syllabus}
          setSyllabus={setSyllabus}
          leads={leads}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
    </>
  );
};

export default App;