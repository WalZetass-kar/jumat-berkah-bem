import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        error: 'Kunci API Gemini belum dikonfigurasi. Silakan periksa Settings > Environment Variables di Vercel.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `
Anda adalah Asisten AI Cerdas "Sahabat Berkah" untuk Aplikasi Pencatatan Keuangan & Penyaluran Jumat Berkah (BEM LP3I Pekanbaru - Kabinet Luminaire).

Tujuan Anda:
1. Membantu pengguna, pengurus BEM, dan donatur memahami informasi seputar program Jumat Berkah.
2. Memberikan ringkasan data transaksi donasi, belanja, saldo kas, serta titik penyaluran porsi nasi kotak berdasarkan data aplikasi terbaru.
3. Menjelaskan fitur aplikasi.

Panduan Komunikasi:
- Gunakan bahasa Indonesia yang ramah, sopan, islami, dan profesional.
- Berikan jawaban yang ringkas.

DATA KONTEKS APLIKASI SAAT INI:
${JSON.stringify(context || {}, null, 2)}
`;

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
    return res.status(200).json({ reply: replyText });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    return res.status(500).json({
      error: 'Terjadi kesalahan pada server AI: ' + (err.message || 'Error tidak diketahui'),
    });
  }
}
