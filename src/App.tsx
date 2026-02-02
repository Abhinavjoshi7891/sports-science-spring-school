import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import RegistrationPage from './components/RegistrationPage';
import DownloadPage from './components/DownloadPage';

// Import Speaker Images
import brigBibhuImg from './assets/images/Brig-Bibhu-Kalyan-Nayak-Director-NCSSR-SAI.png';
import drChrisImg from './assets/images/Dr-Chris-Byrne-PHSS-University-of-Exeter.png';
import drManishImg from './assets/images/Dr-Manish-Rana-Paralympic-Committee-of-India.png';
import drShatarupaImg from './assets/images/Dr-Shatarupa-Chakraborty-NCSSR-SAI.png';
import drSubhraImg from './assets/images/Dr-Subhra-Chatterjee-NCSSR-SAI.png';
import drTimImg from './assets/images/Dr-Tim-Podlogar-University-of-Exeter.png';
import jamesRhodesImg from './assets/images/James-Rhodes.jpeg';
import manikandanImg from './assets/images/manikandan-new.jpeg';
import nikhilImg from './assets/images/Mr-Nikhil-Chowdhary-TAs-at-IIT-Delhi.png';
import sankarImg from './assets/images/Mr-Sankar-Balasubramanian-IISC.png';
import tanishaImg from './assets/images/Ms-Tanisha-Majumdar-TAs-at-IIT-Delhi.png';
import profDeepakJoshiImg from './assets/images/Prof-Deepak-Joshi-CBME-IIT-Delhi.png';
import profJoannaImg from './assets/images/Prof-Joanna-Bowtell-PHSS-University-of-Exeter.png';
import profKKDeepakImg from './assets/images/Prof-K-K-Deepak-IIT-Delhi.png';
import profKaushikImg from './assets/images/Prof-Kaushik-Mukherjee-ME-IIT-Delhi.png';
import profMarkImg from './assets/images/Prof-Mark-Wilson-University-of-Exeter.png';
import profShahidImg from './assets/images/Prof-Shahid-Malik-CeNSE-IIT-Delhi.png';
import abhinavJoshiImg from './assets/images/Abhinav-Joshi.png';
import profBiswarupImg from './assets/images/Prof-Biswarup-Mukherjee-CBME-IIT-Delhi.png';
import profDominicImg from './assets/images/Prof-Dominic-Farris-PHSS-University-of-Exeter.png';

export type ViewState = 'landing' | 'register' | 'download';
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
  { id: '3', name: 'Brig. Bibhu Kalyan Nayak', org: 'NCSSR, SAI', role: 'Director', img: brigBibhuImg, link: 'https://sportsauthorityofindia.nic.in/' },
  { id: '4', name: 'Prof. Joanna Bowtell', org: 'PHSS, UNIV. OF EXETER', role: 'Professor of Applied Physiology', img: profJoannaImg, link: 'https://experts.exeter.ac.uk/20502-joanna-bowtell' },
  { id: '2', name: 'Prof. Mark Wilson', org: 'UNIV. OF EXETER', role: 'Professor of Performance Psychology', img: profMarkImg, link: 'https://experts.exeter.ac.uk/1051-mark-wilson' },
  { id: '20', name: 'Prof. Dominic Farris', org: 'PHSS, UNIV. OF EXETER', role: 'Associate Professor', img: profDominicImg, link: 'https://experts.exeter.ac.uk/27162-dominic-farris' },
  { id: '6', name: 'Prof. Chris Byrne', org: 'PHSS, UNIV. OF EXETER', role: 'Associate Professor', img: drChrisImg, link: 'https://experts.exeter.ac.uk/1040-chris-byrne' },
  { id: '1', name: 'Prof. Deepak Joshi', org: 'CBME, IIT DELHI', role: 'Associate Professor', img: profDeepakJoshiImg, link: 'https://cbme.iitd.ac.in/faculty-profile/15' },
  { id: '7', name: 'Prof. Kaushik Mukherjee', org: 'ME, IIT DELHI', role: 'Associate Professor', img: profKaushikImg, link: 'https://mech.iitd.ac.in/faculty-profile/192' },
  { id: '8', name: 'Prof. Tim Podlogar', org: 'UNIV. OF EXETER', role: 'Research Fellow & Nutritionist', img: drTimImg, link: 'https://experts.exeter.ac.uk/43996-tim-podlogar' },
  { id: '13', name: 'Dr. James Rhodes', org: 'THE FOOTBALL ASSOCIATION', role: 'Data Scientist', img: jamesRhodesImg, link: 'https://www.linkedin.com/in/james-rhodes-05248546/?originalSubdomain=uk' },
  { id: '9', name: 'Prof. Shahid Malik', org: 'SeNSE, IIT DELHI', role: 'Professor', img: profShahidImg, link: 'https://web.iitd.ac.in/~smalik/' },
  { id: '19', name: 'Prof. Biswarup Mukherjee', org: 'CBME, IIT DELHI', role: 'Associate Professor', img: profBiswarupImg, link: 'https://cbme.iitd.ac.in/faculty-profile/3' },
  { id: '12', name: 'Dr. Subhra Chatterjee', org: 'NCSSR, SAI', role: 'Scientist', img: drSubhraImg, link: 'https://in.linkedin.com/in/dr-subhra-chatterjee-7a3555154' },
  { id: '11', name: 'Dr. Shatarupa Chakraborty', org: 'NCSSR, SAI', role: 'Scientist', img: drShatarupaImg, link: 'https://in.linkedin.com/in/dr-shatarupa-chakraborty-6b120590' },
  { id: '10', name: 'Dr. Manish Rana', org: 'PCI', role: 'Director, Paralympics Committee of India', img: drManishImg, link: 'https://in.linkedin.com/in/manish-rana' },
  { id: '5', name: 'Prof. K. K. Deepak', org: 'IIT DELHI', role: 'Professor of Physiology', img: profKKDeepakImg, link: 'https://cbme.iitd.ac.in/faculty-profile/21' },
  { id: '14', name: 'Mr. Sankar Balasubramanian', org: 'IISC', role: 'Research Scholar', img: sankarImg, link: 'https://in.linkedin.com/in/sankar4' },
  { id: '15', name: 'Mr. Manikandan', org: 'IIT DELHI', role: 'TA at IIT Delhi', img: manikandanImg, link: 'https://in.linkedin.com/in/manikandaniitd' },
  { id: '17', name: 'Ms. Tanisha Majumdar', org: 'IIT DELHI', role: 'TA at IIT Delhi', img: tanishaImg, link: 'https://in.linkedin.com/in/tanisha-majumdar-17a6a4206' },
  { id: '16', name: 'Mr. Nikhil Chowdhary', org: 'IIT DELHI', role: 'TA at IIT Delhi', img: nikhilImg, link: 'https://www.linkedin.com/in/nikhil-chowdhary-756a292ab/' },
  { id: '18', name: 'Mr. Abhinav Joshi', org: 'IIT DELHI', role: 'TA at IIT Delhi', img: abhinavJoshiImg, link: 'https://www.linkedin.com/in/abhinav-joshi-949a9227' },
];

const INITIAL_SYLLABUS: SyllabusModule[] = [
  {
    id: 'D1',
    title: 'Biosensing in Sport & Exercise 1',
    lead: 'Brig. Bibhu Nayak, Dr. Subhra Chatterjee, Prof. Biswarup Mukherjee',
    time: 'Day 1 • 2nd March, Monday',
    topics: [
      'Welcome Note: Dean, International Relations, IIT Delhi',
      'Pushing the Boundaries: Incorporating Technology in Sports',
      'Exercise Physiology and Role of Sensing',
      'Sensing Muscle Function: EMG and Ultrasound',
      'Application in practice: GPS and Data Analytics'
    ]
  },
  {
    id: 'D2',
    title: 'Biosensing in Sport & Exercise 2',
    lead: 'Prof. Joanna Bowtell, Prof. Chris Byrne, Mr. Manish Rana',
    time: 'Day 2 • 3rd March, Tuesday',
    topics: [
      'Evidence and Technology-based Approach to Sports Nutrition',
      'Insights into Performance in the Heat',
      'Role of Technology for Parasports',
      'Up-close with a coach: Technology Integration',
      'GPS best practices: Case studies and Real-world Data'
    ]
  },
  {
    id: 'D3',
    title: 'Holi Break & Networking',
    lead: 'Programme Faculty & IIT Delhi',
    time: 'Day 3 • 4th March, Wednesday',
    topics: [
      'No sessions scheduled (Holi Festival Holiday)',
      'Evening Networking Event at IIT Delhi',
      'Faculty Dinner and Informal Networking',
      'Cultural celebration and interaction'
    ]
  },
  {
    id: 'D4',
    title: 'Performance Psychology & AR/VR',
    lead: 'Prof. Mark Wilson, Prof. Deepak Joshi, Prof. Shahid Malik',
    time: 'Day 4 • 5th March, Thursday',
    topics: [
      'Sports Wearables: Neural technologies (EEG and fNIRs)',
      'AR and VR technologies for sports training',
      'Hands-on VR: Environment and Game Design',
      'Role of Simulation and Modelling in Sports',
      'Athlete Stress Management: Psychology & Tech Interventions'
    ]
  },
  {
    id: 'D5',
    title: 'AI, ML and Data Science',
    lead: 'Prof. Biswarup Mukherjee, Prof. Deepak Joshi, Dr. James Rhodes',
    time: 'Day 5 • 6th March, Friday',
    topics: [
      'Introduction to AI and ML Applications in Sports',
      'Applied Data Science for High Performance',
      'Demo: Motion capture and Modelling (Powered by Nokov)',
      'Demo: Wireless EMG and Muscle Oximetry processing',
      'Conclusion, Wrap-up and Certification'
    ]
  },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [downloadDocType, setDownloadDocType] = useState<DocumentType>('brochure');

  // -- Data State (Mocking a Database) --
  // We use localStorage to persist changes made in the Admin Panel
  const [speakers, setSpeakers] = useState<Speaker[]>(() => {
    const saved = localStorage.getItem('speakers_v8');
    return saved ? JSON.parse(saved) : INITIAL_SPEAKERS;
  });

  const [syllabus, setSyllabus] = useState<SyllabusModule[]>(() => {
    const saved = localStorage.getItem('syllabus_v4');
    return saved ? JSON.parse(saved) : INITIAL_SYLLABUS;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('leads');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to local storage whenever data changes
  useEffect(() => {
    // Force refresh if the data is outdated (checking for James Rhodes' FA org)
    const isOutdated = !speakers.some(s => s.name === 'Dr. James Rhodes' && s.org === 'THE FOOTBALL ASSOCIATION');
    if (isOutdated) {
      setSpeakers(INITIAL_SPEAKERS);
    }
    localStorage.setItem('speakers_v8', JSON.stringify(speakers));
  }, [speakers]);
  useEffect(() => {
    localStorage.setItem('syllabus_v4', JSON.stringify(syllabus));
  }, [syllabus]);
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

    </>
  );
};

export default App;