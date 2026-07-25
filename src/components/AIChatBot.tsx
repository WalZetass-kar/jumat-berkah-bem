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
import { WeeklyConfig, Transaction, DistributionSpot, GalleryItem, Volunteer } from '../types';
import { formatRupiah } from '../utils/formatters';

interface AIChatBotProps {
  config: WeeklyConfig;
  transactions: Transaction[];
  spots: DistributionSpot[];
  galleryItems: GalleryItem[];
  adminUsers: any[];
  volunteers: Volunteer[];
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
  galleryItems,
  adminUsers,
  volunteers,
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
      dataTransaksiTerbaru: transactions.slice(0, 15).map(t => ({
        tanggal: t.date,
        jenis: t.type === 'INCOME' ? 'Donasi Masuk' : 'Pengeluaran',
        nominal: formatRupiah(t.amount),
        keterangan: t.donorOrVendor || t.notes,
        kategori: t.category
      })),
      dataRelawan: volunteers.map(v => ({
        nama: v.name,
        prodi: v.prodi,
        status: v.status
      })),
      dataAdmin: adminUsers.map(a => ({
        nama: a.name,
        email: a.email,
        role: a.role
      })),
      jumlahFotoGaleri: galleryItems.length,
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
        <div className="fixed bottom-20 right-3 left-3 sm:left-auto sm:bottom-6 sm:right-6 sm:w-[420px] h-[520px] sm:h-[600px] max-h-[75vh] sm:max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-5 duration-300 print:hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner backdrop-blur-md">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm text-white tracking-wide">Sahabat Berkah AI</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                </div>
                <p className="text-[11px] text-emerald-200/70 font-semibold mt-0.5">Asisten Cerdas Jumat Berkah BEM</p>
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
          <div className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 p-3 overflow-x-auto flex gap-2 scrollbar-none">
            <button
              onClick={() => handleQuickQuestion('Berapa saldo kas & total donasi masuk saat ini?')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-emerald-500/10 hover:bg-emerald-50 text-[11px] font-bold text-slate-600 hover:text-emerald-700 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cek Saldo Kas</span>
            </button>
            <button
              onClick={() => handleQuickQuestion('Bagaimana cara cetak laporan PDF atau ekspor file CSV?')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-emerald-500/10 hover:bg-emerald-50 text-[11px] font-bold text-slate-600 hover:text-emerald-700 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cetak Laporan</span>
            </button>
            <button
              onClick={() => handleQuickQuestion('Di mana saja titik lokasi penyaluran nasi Jumat ini?')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-emerald-500/10 hover:bg-emerald-50 text-[11px] font-bold text-slate-600 hover:text-emerald-700 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Titik Penyaluran</span>
            </button>
            <button
              onClick={() => handleQuickQuestion('Berapa target porsi dan target donasi bulanan saat ini?')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-emerald-500/10 hover:bg-emerald-50 text-[11px] font-bold text-slate-600 hover:text-emerald-700 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              <span>Target Bulanan</span>
            </button>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center text-xs shrink-0 font-bold mt-1 shadow-md border border-emerald-400/50">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-4 rounded-[1.25rem] text-xs leading-relaxed space-y-1.5 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-br-none shadow-slate-900/20 border border-slate-700'
                      : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none shadow-slate-200/50'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-sans">{msg.text}</p>
                  <span
                    className={`block text-[10px] text-right font-semibold ${
                      msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-xs shrink-0 font-bold mt-1 shadow-md border border-slate-600/50">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-slate-500 text-xs font-medium">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center text-xs shrink-0 shadow-md border border-emerald-400/50">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 bg-white border border-slate-100 rounded-[1.25rem] rounded-bl-none flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] text-slate-400 ml-1.5 font-semibold">Memproses...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2.5 bg-slate-50 p-1.5 rounded-[1.25rem] border border-slate-200 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all shadow-inner"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tanyakan sesuatu..."
                disabled={loading}
                className="flex-1 px-3 py-2 bg-transparent text-slate-800 text-xs font-semibold placeholder:text-slate-400 focus:outline-none transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl font-bold flex items-center justify-center transition-all shadow-md shadow-emerald-600/20 cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-slate-400 font-medium text-center mt-2.5">
              Powered by Google Gemini 3.6 Flash
            </p>
          </div>
        </div>
      )}
    </>
  );
};
