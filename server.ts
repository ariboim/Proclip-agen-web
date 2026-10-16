import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Setup JSON body parsing
app.use(express.json({ limit: '25mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI Script Generator specifically for Indonesian Property Agents
app.post('/api/generate-script', async (req, res) => {
  try {
    const {
      agentName,
      agencyName,
      agentWa,
      propertyType,
      title,
      location,
      price,
      landArea,
      buildingArea,
      bedrooms,
      bathrooms,
      carports,
      certificate,
      features,
      specialPromo,
      duration = 30, // 15, 30, or 60
      tone = 'luxurious', // luxurious, urgency_promo, warm_family, modern_investor
      platform = 'reels_tiktok', // wa_status, reels_tiktok, facebook_feed
      customPrompt = '',
      photoCount = 2,
    } = req.body;

    const wordTarget = duration === 15 ? '35-45 kata' : duration === 30 ? '70-90 kata' : '140-180 kata';

    const systemPrompt = `Anda adalah copywriter dan scriptwriter video promosi properti terbaik di Indonesia, berpengalaman memproduksi video viral bernilai miliaran rupiah untuk agen properti profesional (ERA, Brighton, Ray White, Century 21, dll).
TUGAS UTAMA:
Buatkan naskah voiceover video promosi properti yang SANGAT REALISTIS, luwes, mengalir alami, tidak kaku, menggunakan intonasi bahasa Indonesia yang menjual (hypnotic property copywriting), memikat calon pembeli rumah/investor, dan langsung menyentuh emosi pembeli.

PENTING:
- JANGAN KAKU seperti membaca brosur teknis! Ubah spesifikasi teknis menjadi benefit hidup nyata (misal: "Carport 2 mobil, ga pusing parkir", "Legalitas SHM aman tenang tanpa was-was").
- Target durasi video: ${duration} detik (sekitar ${wordTarget} untuk pembacaan tempo ramah dan energik).
- Format platform: ${platform} (${platform === 'wa_status' ? 'Status WhatsApp - singkat, to the point, visual' : platform === 'reels_tiktok' ? 'Instagram Reels & TikTok - hook 3 detik pertama sangat menghentak' : 'Facebook & Feed - berbobot, meyakinkan, prospektif'}).
- Tone gaya: ${tone === 'luxurious' ? 'Mewah, elegan, prestisius, kebanggaan keluarga' : tone === 'urgency_promo' ? 'Promo terbatas, diskon besar, jangan sampai keduluan orang lain' : tone === 'warm_family' ? 'Hangat, nyaman, lingkungan ramah anak, hunian impian masa depan' : 'Cuan investasi, lokasi prima bernilai tinggi, capital gain mantap'}.
- CTA di akhir harus menyuruh penonton segera kontak WhatsApp ${agentName} (${agencyName}) di nomor ${agentWa || '089673686625'}.`;

    const userPrompt = `Detail Properti:
- Judul Properti: ${title || propertyType || 'Rumah Modern'}
- Tipe/Jenis: ${propertyType || 'Rumah Tinggal'}
- Lokasi: ${location || 'Lokasi Strategis'}
- Harga: ${price || 'Hubungi Kami'}
- Luas Tanah: ${landArea ? landArea + ' m²' : '-'}
- Luas Bangunan: ${buildingArea ? buildingArea + ' m²' : '-'}
- Kamar Tidur: ${bedrooms ? bedrooms + ' KT' : '-'}
- Kamar Mandi: ${bathrooms ? bathrooms + ' KM' : '-'}
- Carport: ${carports ? carports + ' Mobil' : '-'}
- Legalitas: ${certificate || 'SHM Ready'}
- Fasilitas Unggulan: ${features || 'One gate system, bebas banjir, akses strategis'}
- Promo Khusus: ${specialPromo || 'Free konsultasi KPR dan survey lokasi'}
- Catatan Khusus Agen: ${customPrompt || 'Tampilkan keindahan dan kenyamanan properti ini'}
- Jumlah Foto Properti: ${photoCount} foto (eksterior dan interior)
- Agen: ${agentName || 'Agen Properti'}, Agency: ${agencyName || 'Agency Properti'}

Kembalikan output dalam format JSON terstruktur yang membagi video menjadi ${photoCount >= 4 ? photoCount : Math.min(Math.max(3, photoCount), 5)} adegan (scenes) dengan teks narasi, timing awal-akhir (total pas ${duration} detik), teks overlay/badge visual layar, dan caption karaoke per kalimat.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            catchyHeadline: {
              type: Type.STRING,
              description: 'Hook judul headline singkat pemikat (maks 8 kata)',
            },
            fullScript: {
              type: Type.STRING,
              description: 'Naskah lengkap yang diucapkan narator dari awal sampai akhir tanpa potongan teks teknis',
            },
            closingCtaText: {
              type: Type.STRING,
              description: 'Kalimat ajakan penutup hubungi WhatsApp',
            },
            highlightBadges: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Daftar 4-6 badge spesifikasi singkat untuk ditampilkan di video (misal: "LT 120m²", "Harga 1,2 M", "SHM Ready")',
            },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneIndex: { type: Type.INTEGER },
                  photoTarget: {
                    type: Type.STRING,
                    description: 'Rekomendasi jenis foto: exterior, interior, bedrooms, kitchen, atau cta',
                  },
                  startSec: { type: Type.NUMBER },
                  endSec: { type: Type.NUMBER },
                  spokenText: { type: Type.STRING },
                  screenTitle: { type: Type.STRING },
                  screenBadge: { type: Type.STRING },
                  motionStyle: {
                    type: Type.STRING,
                    description: 'Efek kamera: pan-right, zoom-in, zoom-out, tilt-up, dramatic-zoom',
                  },
                },
                required: ['sceneIndex', 'photoTarget', 'startSec', 'endSec', 'spokenText', 'screenTitle', 'screenBadge', 'motionStyle'],
              },
            },
          },
          required: ['catchyHeadline', 'fullScript', 'closingCtaText', 'highlightBadges', 'scenes'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating script:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal membuat naskah video dengan AI',
    });
  }
});

// Endpoint: AI Realistic Text-to-Speech (Gemini 3.8 Flash Lite TTS)
app.post('/api/generate-tts', async (req, res) => {
  try {
    const { text, voiceName = 'Kore', stylePrompt = 'Natural, engaging Indonesian real estate consultant' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Text tidak boleh kosong' });
    }

    // Call Gemini 3.8 Flash Lite TTS
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 1000), // safe limit
              speechMetadata: {
                style: stylePrompt,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName, // 'Kore', 'Puck', 'Fenrir', 'Zephyr', 'Charon'
            },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ success: false, error: 'Tidak ada audio yang dihasilkan oleh model TTS' });
    }

    return res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('TTS generation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal memproses suara AI TTS',
    });
  }
});

// Production / Dev Vite handling
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
