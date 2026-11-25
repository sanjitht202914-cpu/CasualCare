import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  ShieldAlert, 
  AlertCircle
} from 'lucide-react';
import { translations } from '../data/mockData';
import { snsService } from '../services/snsService';

export default function AIAssistant({ lang, patient, medicines, onTriggerSOS }) {
  const t = translations[lang];

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: lang === 'ta' 
        ? `வணக்கம் திரு. ${patient.name}! நான் உங்கள் கேஷுவல் கேர் AI மருத்துவ உதவியாளர். உங்கள் மருந்துகள், அறுவைசிகிச்சை மீட்டெடுப்பு, உணவு முறை அல்லது உடல் நல அறிகுறிகள் குறித்து தமிழில் அல்லது ஆங்கிலத்தில் எப்போது வேண்டுமானாலும் என்னிடம் கேட்கலாம்.`
        : `Hello Mr. ${patient.name}! I am your CasualCare AI Clinical Assistant. I am monitoring your postoperative cardiac recovery and glycemic logs. How can I assist you today?`,
      time: "Just now"
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatError, setChatError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = lang === 'ta' ? [
    "என் இதயத் துடிப்பு 74 bpm இருப்பது சரியா?",
    "இன்று இரவு Enalapril மாத்திரை எடுக்க மறந்துவிட்டால் என்ன செய்வது?",
    "அறுவை சிகிச்சைக்குப் பின் நடைபயிற்சி எப்போது செய்யலாம்?",
    "நீரிழிவு நோயாளிக்கான மாலை நேர சிற்றுண்டி என்ன?"
  ] : [
    "Is my resting heart rate of 74 bpm normal?",
    "What should I do if I missed my evening Enalapril dose?",
    "Can I do mild stair climbing 2 weeks after surgery?",
    "Low glycemic evening snacks recommendations"
  ];

  const handleSend = async (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!userText) setInput('');
    setIsTyping(true);
    setChatError(null);

    try {
      // Connect to SNS Workbench workflow: module "ai_care_assistant"
      const response = await snsService.askAiCareAssistant(textToSend);
      const replyText = response?.reply || response?.data?.reply || response?.message || 'I have received your message.';

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error('AI Care Assistant error:', err);
      const errMsg = err?.message || 'Unable to connect to AI Care Assistant.';
      setChatError(errMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          isError: true,
          text: `⚠️ AI Care Assistant Error: ${errMsg}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[750px] overflow-hidden">
      {/* AI Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base">{t.ai.title}</h2>
              <span className="text-[10px] bg-teal-400/30 text-teal-200 border border-teal-400/30 px-2 py-0.2 rounded-full font-semibold">
                Tamil / English Hybrid
              </span>
            </div>
            <p className="text-xs text-teal-200/80">{t.ai.subtitle}</p>
          </div>
        </div>

        <button
          onClick={onTriggerSOS}
          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Emergency SOS</span>
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-500 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          {lang === 'ta' ? 'விரைவு கேள்விகள்:' : 'Quick Clinical Prompts:'}
        </span>
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            disabled={isTyping}
            onClick={() => handleSend(q)}
            className="text-xs bg-white text-slate-700 border border-slate-200 hover:border-teal-500 hover:text-teal-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
        {messages.map((m) => {
          const isAI = m.sender === 'ai';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isAI
                    ? m.isError
                      ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                    : 'bg-teal-600 text-white rounded-tr-none'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <div className={`text-[10px] mt-2 flex items-center justify-between ${isAI ? (m.isError ? 'text-rose-500' : 'text-slate-400') : 'text-teal-100'}`}>
                  <span>{m.time}</span>
                  {isAI && (
                    <span className={`text-[10px] font-medium ${m.isError ? 'text-rose-600' : 'text-teal-600'}`}>
                      {m.isError ? 'SNS Workbench Error' : 'CasualCare AI Assistant'}
                    </span>
                  )}
                </div>
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce delay-100"></span>
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce delay-200"></span>
              <span>CasualCare AI Care Assistant is processing via SNS Workbench...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box and Disclaimer */}
      <div className="p-4 bg-white border-t border-slate-200">
        {chatError && (
          <div className="mb-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{chatError}</span>
            </div>
            <button
              onClick={() => setChatError(null)}
              className="text-rose-600 hover:text-rose-800 font-bold ml-2 text-xs"
            >
              ×
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            disabled={isTyping}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isTyping ? "Evaluating clinical query via SNS Workbench..." : t.ai.inputPlaceholder}
            className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="px-5 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs"
          >
            <span>{isTyping ? 'Sending...' : t.ai.send}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-slate-400 mt-2 text-center flex items-center justify-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.ai.disclaimer}</span>
        </p>
      </div>
    </div>
  );
}
