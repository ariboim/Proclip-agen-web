import React from 'react';
import { TokenState } from '../types/property';
import { Check, Crown, Zap, MessageCircle, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  tokens: TokenState;
  onOpenUpgrade: () => void;
  onStartGenerator: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  tokens,
  onOpenUpgrade,
  onStartGenerator,
}) => {
  const waContactUrl =
    'https://wa.me/6289673686625?text=Halo%20Admin%20PropertiClip%2C%20saya%20tertarik%20dengan%20Paket%20Unlimited%20Token%20VIP%20Rp%20199rb%20untuk%20agen%20properti.';

  return (
    <section id="pricing" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <Crown className="w-3.5 h-3.5" />
            Pilihan Paket Transparan
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] text-white">
            Mulai dari Demo Gratis 5 Token, Upgrade ke{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Unlimited VIP
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            1 Token = 1 Video Lengkap. Coba 5 video gratis sekarang dan rasakan kemudahan closing lewat video sosial media!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Card 1: Paket Demo Gratis */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Paket Percobaan
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                  Gratis Agen Baru
                </span>
              </div>

              <h3 className="text-2xl font-bold font-['Outfit'] text-white">Demo 5 Token</h3>
              <p className="text-xs text-slate-400 mt-1">
                Cocok untuk menguji kualitas video & narasi AI pada listing pertama Anda.
              </p>

              <div className="my-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">Rp 0</span>
                  <span className="text-xs text-slate-400">/ 5 Video Pertama</span>
                </div>
                <span className="text-xs text-emerald-400 font-semibold block mt-1">
                  1 Token = 1 Video Full HD
                </span>
              </div>

              <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-300">
                {[
                  '5 Credit Token Pembuatan Video',
                  'Watermark Logo Agency Anda Sendiri',
                  'Pilihan Durasi 15s, 30s & 60s',
                  'Format Rasio 9:16 (WA, Reels, TikTok)',
                  'AI Narasi Bahasa Indonesia Realistis',
                  'Opsi Edit Teks & Musik Sebelum Download',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={onStartGenerator}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
            >
              Gunakan 5 Token Demo Sekarang
            </button>
          </div>

          {/* Card 2: Paket VIP Unlimited Token */}
          <div className="relative p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/10 flex flex-col justify-between">
            {/* Best Value Ribbon */}
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[11px] tracking-wider uppercase shadow-md">
              Paling Laris Untuk Top Agen
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" /> Akses Penuh Tanpa Batas
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
                  Lifetime VIP
                </span>
              </div>

              <h3 className="text-2xl font-bold font-['Outfit'] text-white">VIP Unlimited Token</h3>
              <p className="text-xs text-slate-400 mt-1">
                Bikin video listing setiap hari tanpa perlu khawatir kehabisan kuota video.
              </p>

              <div className="my-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-amber-400">Rp 199.000</span>
                  <span className="text-xs text-slate-400 line-through">Rp 499.000</span>
                </div>
                <span className="text-xs text-emerald-400 font-semibold block mt-1">
                  Sekali Bayar • Buat Video Tanpa Batas (Unlimited)
                </span>
              </div>

              <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-200">
                {[
                  'Video Generation Tanpa Batas (Unlimited Token)',
                  'Bebas Watermark PropertiClip (Hanya Logo & WA Anda)',
                  'Kualitas Render Full HD 1080p 60FPS Jernih Maksimal',
                  'Regenerate Naskah AI Hypnotic Copywriting Sepuasnya',
                  'Akses Semua Karakter Suara AI Realistis (Pria & Wanita)',
                  'Koleksi Musik Bebas Royalti & Bebas Ganti Backsound',
                  'Prioritas Server Render Video Cepat Tanpa Antri',
                  'Bantuan & Konsultasi Iklan Properti via WhatsApp VIP',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct WhatsApp CTA Button to 089673686625 */}
            <a
              href={waContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Aktivasi Unlimited via WhatsApp (0896-7368-6625)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
