import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  RefreshCw, 
  ChevronDown, 
  HelpCircle,
  Coins,
  FileSpreadsheet,
  MapPin,
  Target
} from 'lucide-react';
import { WeeklyConfig, Transaction, DistributionSpot } from '../types';
import { formatRupiah } from '../utils/formatters';

interface AIChatBotProps {
  config: WeeklyConfig;
  transactions: Transaction[];
  spots: DistributionSpot[];
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIChatBot: React.FC<AIChatBotProps> = ({
  config,
  transactions,
  spots,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Assalamu'alaikum! 👋 Saya **Sahabat Berkah**, Asisten AI untuk Program Jumat Berkah BEM LP3I Pekanbaru. Ada yang bisa saya bantu terkait laporan keuangan, titik penyaluran, atau cara penggunaan aplikasi?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Context summarizer for AI prompt
  const getAppContext = () => {
    const totalIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    const currentBalance = totalIncome - totalExpense;
    const totalDistributed = spots.reduce((sum, s) => sum + s.distributedPackages, 0);

    return {
      organisasi: config.organizationName,
      periodeSaatIni: config.currentFridayLabel,
      targetBulananPortion: config.targetMonthlyPortions || 2000,
      targetBulananRp: config.targetMonthlyDonation || 30000000,
      targetBulanLabel: config.targetMonthLabel || 'Juli 2026',
      ringkasanKeuangan: {
        totalDonasiMasuk: formatRupiah(totalIncome),
        totalBelanjaOperasional: formatRupiah(totalExpense),
        saldoKasSekarang: formatRupiah(currentBalance),
        jumlahTransaksiDonasi: transactions.filter((t) => t.type === 'INCOME').length,
      },
      titikPenyaluran: spots.map((s) => ({
        nama: s.name,
        lokasi: s.location,
        terbagikan: `${s.distributedPackages}/${s.targetPackages} porsi`,
        status: s.status === 'COMPLETED' ? 'Selesai' : 'Proses',
      })),
      totalPorsiTerbagi: `${totalDistributed} porsi`,
      rekeningDonasi: config.bankInfo,
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputMessage).trim();
    if (!messageText || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const chatHistory = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          context: getAppContext(),
          history: chatHistory.slice(-6), // Send last 6 turns for context continuity
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal terhubung dengan server AI');
      }

      const botReplyMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Maaf, belum ada tanggapan.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReplyMsg]);
    } catch (error: any) {
      console.error('Error sending AI chat:', error);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ Mohoh maaf, terjadi kendala saat memproses pertanyaan: ${error.message || 'Koneksi error'}. Pastikan koneksi internet stabil.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: `Riwayat percakapan telah dibersihkan. Ada lagi yang bisa saya bantu seputar program Jumat Berkah? 😊`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Button Toggle */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 print:hidden">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold rounded-full shadow-xl hover:shadow-emerald-600/30 transition-all duration-300 transform hover:scale-105 cursor-pointer border border-emerald-400/30"
          >
            <div className="relative">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            </div>
            <span className="text-xs tracking-wide hidden xs:inline">Tanya AI Sahabat Berkah</span>
            <span className="text-xs tracking-wide xs:hidden">Tanya AI</span>
            <span className="ml-0.5 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
              AI
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Modal Box */}
      {isOpen && (
        <div className="fixed bottom-20 right-3 left-3 sm:left-auto sm:bottom-6 sm:right-6 sm:w-[420px] h-[520px] sm:h-[580px] max-h-[72vh] sm:max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 print:hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600/40 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white">Sahabat Berkah AI</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[11px] text-emerald-200/80 font-medium">Asisten Cerdas Jumat Berkah BEM</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Bersihkan Percakapan"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Suggestions Bar */}
          <div className="bg-slate-50 border-b border-slate-200 p-2.5 overflow-x-auto flex gap-1.5 scrollbar-thin scrollbar-thumb-slate-300">
            <button
              onClick={() => handleQuickQuestion('Berapa saldo kas & total donasi masuk saat ini?')}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-[11px] font-semibold text-slate-700 hover:text-emerald-800 whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Coins className="w-3 h-3 text-emerald-600" />
              <span>Cek Saldo Kas</span>
            </button>
            <button
              onClick={() => handleQuickQuestion('Bagaimana cara cetak laporan PDF atau ekspor file CSV?')}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-[11px] font-semibold text-slate-700 hover:text-emerald-800 whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
              <span>Cara Cetak/CSV</span>
            </button>
            <button
              onClick={() => handleQuickQuestion('Di mana saja titik lokasi penyaluran nasi Jumat ini?')}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-[11px] font-semibold text-slate-700 hover:text-emerald-800 whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>Titik Penyaluran</span>
            </button>
            <button
              onClick={() => handleQuickQuestion('Berapa target porsi dan target donasi bulanan saat ini?')}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-[11px] font-semibold text-slate-700 hover:text-emerald-800 whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Target className="w-3 h-3 text-emerald-600" />
              <span>Target Bulanan</span>
            </button>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 font-bold mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-none shadow-md shadow-emerald-700/10'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-sans">{msg.text}</p>
                  <span
                    className={`block text-[10px] text-right font-medium ${
                      msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs shrink-0 font-bold mt-0.5 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-500 text-xs font-medium">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] text-slate-400 ml-1">Sahabat Berkah sedang berpikir...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ketik pertanyaan seputar Jumat Berkah..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-xs flex items-center justify-center transition-all shadow-md shadow-emerald-600/20 cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">
              Powered by Google Gemini 3.6 Flash • AI khusus BEM LP3I Pekanbaru
            </p>
          </div>
        </div>
      )}
    </>
  );
};
