import React, { useState } from 'react';
import { Speaker, SyllabusModule, Lead } from '../App';

interface AdminPanelProps {
  onExit: () => void;
  speakers: Speaker[];
  setSpeakers: React.Dispatch<React.SetStateAction<Speaker[]>>;
  syllabus: SyllabusModule[];
  setSyllabus: React.Dispatch<React.SetStateAction<SyllabusModule[]>>;
  leads: Lead[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

type Tab = 'dashboard' | 'speakers' | 'syllabus' | 'leads';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
    onExit, speakers, setSpeakers, syllabus, setSyllabus, leads, theme, toggleTheme 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  // Speaker Editing State
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [isSpeakerModalOpen, setIsSpeakerModalOpen] = useState(false);

  // Syllabus Editing State
  const [editingModule, setEditingModule] = useState<SyllabusModule | null>(null);
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);

  // -- Helpers --
  const deleteSpeaker = (id: string) => {
    if(window.confirm('Delete this speaker?')) {
        setSpeakers(prev => prev.filter(s => s.id !== id));
    }
  };

  const saveSpeaker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpeaker) return;

    if (speakers.find(s => s.id === editingSpeaker.id)) {
        // Update
        setSpeakers(prev => prev.map(s => s.id === editingSpeaker.id ? editingSpeaker : s));
    } else {
        // Create
        setSpeakers(prev => [...prev, editingSpeaker]);
    }
    setIsSpeakerModalOpen(false);
  };

  const deleteModule = (id: string) => {
      if(window.confirm('Delete this module?')) {
          setSyllabus(prev => prev.filter(m => m.id !== id));
      }
  };

  const saveModule = (e: React.FormEvent) => {
      e.preventDefault();
      if(!editingModule) return;
      
      if (syllabus.find(m => m.id === editingModule.id)) {
          setSyllabus(prev => prev.map(m => m.id === editingModule.id ? editingModule : m));
      } else {
          setSyllabus(prev => [...prev, editingModule]);
      }
      setIsSyllabusModalOpen(false);
  }

  const handleTopicChange = (idx: number, val: string) => {
      if (!editingModule) return;
      const newTopics = [...editingModule.topics];
      newTopics[idx] = val;
      setEditingModule({ ...editingModule, topics: newTopics });
  }

  return (
    <div className="flex h-screen w-full bg-slate-100 dark:bg-background-dark text-slate-900 dark:text-white font-body transition-colors">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#003366] text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/10">
             <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-accent">admin_panel_settings</span>
                <span className="text-xl font-bold font-display">Admin Panel</span>
             </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            {[
                { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
                { id: 'leads', icon: 'download_for_offline', label: 'Leads & Data' },
                { id: 'speakers', icon: 'groups', label: 'Speakers' },
                { id: 'syllabus', icon: 'menu_book', label: 'Syllabus' },
            ].map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as Tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-white/10 text-white font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    {item.label}
                </button>
            ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
            <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-2 text-white/70 hover:text-white">
                <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                Toggle Theme
            </button>
            <button onClick={onExit} className="w-full flex items-center gap-3 px-4 py-2 text-red-300 hover:text-red-100">
                <span className="material-symbols-outlined">logout</span>
                Exit Admin
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold font-display">Dashboard Overview</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-border-dark">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold uppercase text-slate-500">Total Leads</h3>
                            <span className="material-symbols-outlined text-[#003366] dark:text-blue-400">group</span>
                        </div>
                        <p className="text-4xl font-bold text-[#003366] dark:text-white">{leads.length}</p>
                    </div>
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-border-dark">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold uppercase text-slate-500">Speakers</h3>
                            <span className="material-symbols-outlined text-[#003366] dark:text-blue-400">record_voice_over</span>
                        </div>
                        <p className="text-4xl font-bold text-[#003366] dark:text-white">{speakers.length}</p>
                    </div>
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-border-dark">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold uppercase text-slate-500">Syllabus Modules</h3>
                            <span className="material-symbols-outlined text-[#003366] dark:text-blue-400">class</span>
                        </div>
                        <p className="text-4xl font-bold text-[#003366] dark:text-white">{syllabus.length}</p>
                    </div>
                </div>
            </div>
        )}

        {/* Leads View */}
        {activeTab === 'leads' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold font-display">Captured Leads</h1>
                    <button 
                        onClick={() => {
                            const csvContent = "data:text/csv;charset=utf-8," + "Name,Email,Organization,Role,Downloaded,Date\n" + leads.map(l => `${l.name},${l.email},${l.organization},${l.role},${l.downloaded},${l.date}`).join("\n");
                            const encodedUri = encodeURI(csvContent);
                            const link = document.createElement("a");
                            link.setAttribute("href", encodedUri);
                            link.setAttribute("download", "leads.csv");
                            document.body.appendChild(link);
                            link.click();
                        }}
                        className="bg-[#003366] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">download</span> Export CSV
                    </button>
                </div>
                
                <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-border-dark overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-xs uppercase tracking-wider text-slate-500">
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Organization</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Downloaded</th>
                                <th className="p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">No leads captured yet. Go to the download page to test.</td>
                                </tr>
                            ) : leads.map(lead => (
                                <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm">
                                    <td className="p-4 font-bold">{lead.name}</td>
                                    <td className="p-4">{lead.email}</td>
                                    <td className="p-4">{lead.organization}</td>
                                    <td className="p-4">{lead.role}</td>
                                    <td className="p-4"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{lead.downloaded}</span></td>
                                    <td className="p-4 text-slate-500">{lead.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Speakers View */}
        {activeTab === 'speakers' && (
             <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold font-display">Manage Speakers</h1>
                    <button 
                        onClick={() => {
                            setEditingSpeaker({ id: Date.now().toString(), name: '', org: '', role: '', img: 'https://ui-avatars.com/api/?name=New+Speaker&background=e2e8f0&color=1e293b&size=256' });
                            setIsSpeakerModalOpen(true);
                        }}
                        className="bg-[#003366] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">add</span> Add Speaker
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {speakers.map(speaker => (
                        <div key={speaker.id} className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-200 dark:border-border-dark flex items-start gap-4 group relative">
                             <img src={speaker.img} alt={speaker.name} className="w-16 h-16 rounded-full object-cover bg-slate-200" />
                             <div>
                                 <h3 className="font-bold text-lg">{speaker.name}</h3>
                                 <p className="text-xs font-bold uppercase text-[#c5a059]">{speaker.org}</p>
                                 <p className="text-xs text-slate-500">{speaker.role}</p>
                             </div>
                             <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => { setEditingSpeaker(speaker); setIsSpeakerModalOpen(true); }} className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded"><span className="material-symbols-outlined text-sm">edit</span></button>
                                 <button onClick={() => deleteSpeaker(speaker.id)} className="p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded"><span className="material-symbols-outlined text-sm">delete</span></button>
                             </div>
                        </div>
                    ))}
                </div>
             </div>
        )}

        {/* Syllabus View */}
        {activeTab === 'syllabus' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h1 className="text-3xl font-bold font-display">Manage Syllabus</h1>
                   <button 
                       onClick={() => {
                           setEditingModule({ id: 'NEW', title: '', lead: '', time: '', topics: ['', '', '', ''] });
                           setIsSyllabusModalOpen(true);
                       }}
                       className="bg-[#003366] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
                   >
                       <span className="material-symbols-outlined">add</span> Add Module
                   </button>
               </div>
               
               <div className="space-y-4">
                   {syllabus.map(mod => (
                       <div key={mod.id} className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-border-dark relative group">
                           <div className="flex justify-between items-start mb-4">
                               <div className="flex items-center gap-4">
                                   <div className="bg-slate-100 dark:bg-white/10 px-3 py-1 rounded text-xs font-bold">{mod.id}</div>
                                   <h3 className="font-bold text-xl">{mod.title}</h3>
                               </div>
                               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingModule(mod); setIsSyllabusModalOpen(true); }} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-bold">Edit</button>
                                    <button onClick={() => deleteModule(mod.id)} className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded text-xs font-bold">Delete</button>
                               </div>
                           </div>
                           <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
                               <p><strong className="text-slate-900 dark:text-white">Lead:</strong> {mod.lead}</p>
                               <p><strong className="text-slate-900 dark:text-white">Time:</strong> {mod.time}</p>
                           </div>
                           <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10">
                               <p className="text-xs font-bold uppercase text-slate-400 mb-2">Topics</p>
                               <ul className="list-disc pl-5 text-sm space-y-1">
                                   {mod.topics.map((t, i) => <li key={i}>{t}</li>)}
                               </ul>
                           </div>
                       </div>
                   ))}
               </div>
            </div>
        )}
      </main>

      {/* Speaker Edit Modal */}
      {isSpeakerModalOpen && editingSpeaker && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-surface-dark w-full max-w-md p-6 rounded-xl shadow-2xl">
                  <h3 className="text-xl font-bold mb-4">Edit Speaker</h3>
                  <form onSubmit={saveSpeaker} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Name</label>
                          <input type="text" value={editingSpeaker.name} onChange={e => setEditingSpeaker({...editingSpeaker, name: e.target.value})} className="w-full border p-2 rounded dark:bg-black/20" required />
                      </div>
                      <div>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Organization</label>
                          <input type="text" value={editingSpeaker.org} onChange={e => setEditingSpeaker({...editingSpeaker, org: e.target.value})} className="w-full border p-2 rounded dark:bg-black/20" required />
                      </div>
                      <div>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Role</label>
                          <input type="text" value={editingSpeaker.role} onChange={e => setEditingSpeaker({...editingSpeaker, role: e.target.value})} className="w-full border p-2 rounded dark:bg-black/20" required />
                      </div>
                      <div>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Image URL</label>
                          <input type="text" value={editingSpeaker.img} onChange={e => setEditingSpeaker({...editingSpeaker, img: e.target.value})} className="w-full border p-2 rounded dark:bg-black/20" required />
                      </div>
                      <div>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Profile Link</label>
                          <input type="text" value={editingSpeaker.link || ''} onChange={e => setEditingSpeaker({...editingSpeaker, link: e.target.value})} className="w-full border p-2 rounded dark:bg-black/20" placeholder="https://..." />
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                          <button type="button" onClick={() => setIsSpeakerModalOpen(false)} className="px-4 py-2 text-slate-500 hover:text-slate-800">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-[#003366] text-white rounded font-bold">Save</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Syllabus Edit Modal */}
      {isSyllabusModalOpen && editingModule && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-surface-dark w-full max-w-lg p-6 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">Edit Module</h3>
                  <form onSubmit={saveModule} className="space-y-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">ID</label>
                            <input type="text" value={editingModule.id} onChange={e => setEditingModule({...editingModule, id: e.target.value})} className="w-full border p-2 rounded dark:bg-black/20" required />
                        </div>
                        <div className="col-span-3">
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Title</label>
                            <input type="text" value={editingModule.title} onChange={e => setEditingModule({...editingModule, title: e.target.value})} className="w-full border p-2 rounded dark:bg-black/20" required />
                        </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Lead Faculty</label>
                          <input type="text" value={editingModule.lead} onChange={e => setEditingModule({...editingModule, lead: e.target.value})} className="w-full border p-2 rounded dark:bg-black/20" required />
                      </div>
                      <div>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Time</label>
                          <input type="text" value={editingModule.time} onChange={e => setEditingModule({...editingModule, time: e.target.value})} className="w-full border p-2 rounded dark:bg-black/20" required />
                      </div>
                      
                      <div>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Topics</label>
                          <div className="space-y-2">
                             {editingModule.topics.map((topic, i) => (
                                 <input key={i} type="text" value={topic} onChange={e => handleTopicChange(i, e.target.value)} className="w-full border p-2 rounded dark:bg-black/20 text-sm" placeholder={`Topic ${i+1}`} />
                             ))}
                             <button type="button" onClick={() => setEditingModule({...editingModule, topics: [...editingModule.topics, '']})} className="text-xs text-[#003366] font-bold">+ Add Topic</button>
                          </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                          <button type="button" onClick={() => setIsSyllabusModalOpen(false)} className="px-4 py-2 text-slate-500 hover:text-slate-800">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-[#003366] text-white rounded font-bold">Save</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};

export default AdminPanel;