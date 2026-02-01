import React, { useState, useEffect, useRef } from 'react';
// Removed GoogleGenAI import to use Nvidia API

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const SYSTEM_INSTRUCTION = `You are the "Admissions Assistant" for the Spring School on Sports Science 2026.
This is a prestigious academic event held at IIT Delhi.
Tone: Formal, polite, helpful, and precise. Avoid slang. Use "Candidate" to refer to the user.
Details:
- Dates: March 2nd - 6th, 2026.
- Location: IIT Delhi Main Campus.
- Tuition: INR 17,000 + GST.
- Curriculum: Sports Technology, Machine Learning, Data Analytics in Sports.
- Accommodation: On-campus Guest House available (additional charges apply).
- Certification: Provided upon completion of the course.
Goal: Assist prospective students with enrollment inquiries and syllabus details.`;

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Greetings. I am the Admissions Assistant. How may I assist you with your application to the Spring School?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      console.log("[ChatBot] Sending request to internal proxy...");

      let responseText = "I apologize, but I am currently unable to process your request.";

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: SYSTEM_INSTRUCTION,
          messages: messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.text
          })).concat({ role: "user", content: inputText })
        })
      });

      console.log("[ChatBot] Proxy Response status:", response.status);
      const data = await response.json();
      console.log("[ChatBot] Proxy Received data:", data);

      if (data.choices && data.choices[0] && data.choices[0].message) {
        responseText = data.choices[0].message.content;
      } else if (data.error) {
        console.error("[ChatBot] API Error:", data.error);
        responseText = `Technical Error: ${data.error.message || 'Unknown error'}`;
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      }]);

    } catch (error) {
      console.error("[ChatBot] Fetch error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I am encountering a connection issue. Please try again in a moment."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl">forum</span>
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/20 dark:bg-[#0b1219]/70 backdrop-blur-sm p-4 sm:items-center sm:justify-end sm:p-8">
          <div className="w-full sm:w-[400px] h-[600px] bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-sm shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/5 dark:ring-white/10 transition-colors">
            {/* Header */}
            <div className="bg-primary p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white border border-white/20">
                  <span className="material-symbols-outlined text-sm">school</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm font-display">Admissions Office</h3>
                  <p className="text-[10px] text-white/70 font-medium uppercase tracking-wider">Virtual Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 dark:bg-background-dark transition-colors">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-white/10 flex-shrink-0 flex items-center justify-center text-primary dark:text-white self-start mt-1">
                      <span className="material-symbols-outlined text-sm">smart_toy</span>
                    </div>
                  )}
                  <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                    <div className={`p-3.5 shadow-sm border ${msg.role === 'user'
                      ? 'bg-primary text-white border-primary rounded-t-lg rounded-bl-lg'
                      : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-border-dark text-slate-800 dark:text-slate-200 rounded-t-lg rounded-br-lg'
                      }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-serif">{msg.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-white/10 flex-shrink-0 flex items-center justify-center text-primary dark:text-white self-start mt-1">
                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                  </div>
                  <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-3.5 rounded-t-lg rounded-br-lg shadow-sm">
                    <div className="flex gap-1.5 items-center h-5">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {messages.length < 3 && (
              <div className="px-4 pb-2 bg-slate-50 dark:bg-background-dark flex flex-wrap gap-2 transition-colors">
                {['Tuition Inquiry', 'Curriculum Details', 'Accommodation'].map((action) => (
                  <button
                    key={action}
                    onClick={() => { setInputText(action); handleSendMessage(); }}
                    className="bg-white dark:bg-surface-dark hover:bg-slate-200 dark:hover:bg-border-dark border border-slate-300 dark:border-slate-700 text-primary dark:text-white text-xs font-bold px-3 py-1.5 rounded-sm transition-all shadow-sm uppercase tracking-wide"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-surface-darker border-t border-slate-200 dark:border-border-dark transition-colors">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-slate-50 dark:bg-background-dark border border-slate-300 dark:border-border-dark rounded-sm pl-4 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary dark:focus:border-accent focus:ring-1 focus:ring-primary dark:focus:ring-accent placeholder-slate-400 dark:placeholder-slate-500 transition-all font-serif"
                    placeholder="Type your inquiry..."
                    type="text"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputText.trim()}
                  className="bg-primary hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-sm transition-colors shadow-sm flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-xl">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;