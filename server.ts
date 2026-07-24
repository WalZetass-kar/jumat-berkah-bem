import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is missing.');
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Route: AI Assistant Chatbot
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, context, history } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(500).json({
          error: 'Kunci API Gemini belum dikonfigurasi. Silakan periksa Secrets panel.',
        });
      }

      // System instruction enriched with current program data context
      const systemInstruction = `
Anda adalah Asisten AI Cerdas "Sahabat Berkah" untuk Aplikasi Pencatatan Keuangan & Penyaluran Jumat Berkah (BEM LP3I Pekanbaru - Kabinet Luminaire).

Tujuan Anda:
1. Membantu pengguna, pengurus BEM, dan donatur memahami informasi seputar program Jumat Berkah.
2. Memberikan ringkasan data transaksi donasi, belanja, saldo kas, serta titik penyaluran porsi nasi kotak berdasarkan data aplikasi terbaru.
3. Menjelaskan fitur aplikasi seperti:
   - Pencatatan transaksi (Donasi masuk / Belanja)
   - Penentuan target porsi mingguan & target bulanan
   - Peta & status titik penyaluran porsi
   - Ekspor data laporan ke format CSV / Excel
   - Cetak Laporan Resmi ke format PDF
   - Salin Teks Format Broadcast WhatsApp
4. Menjawab pertanyaan seputar rekening donasi (BSI 7100-2024-88 a.n BEM LP3I Pekanbaru) dan ajakan berinfaq.

Panduan Komunikasi:
- Gunakan bahasa Indonesia yang ramah, sopan, islami (misal: Assalamu'alaikum, Syukron, Barakallah), dan profesional.
- Berikan jawaban yang ringkas, scannable dengan bullet points jika relevan.
- Jika pengguna bertanya tentang data saldo atau donasi, gunakan data konteks aplikasi yang disediakan di bawah ini jika ada.

DATA KONTEKS APLIKASI SAAT INI:
${JSON.stringify(context || {}, null, 2)}
`;

      // Build contents array including previous turn history if provided
      let promptContents: any = message;
      if (Array.isArray(history) && history.length > 0) {
        const historyPrompt = history
          .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Pengguna' : 'Asisten'}: ${h.text}`)
          .join('\n');
        promptContents = `${historyPrompt}\nPengguna: ${message}\nAsisten:`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: promptContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'Maaf, saya tidak dapat memproses jawaban saat ini. Silakan coba lagi.';

      return res.json({ reply: replyText });
    } catch (err: any) {
      console.error('Error in /api/chat:', err);
      return res.status(500).json({
        error: 'Terjadi kesalahan pada server AI: ' + (err.message || 'Error tidak diketahui'),
      });
    }
  });

  // Vite Middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
