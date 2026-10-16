import React from 'react';
import { TokenState } from '../types/property';
import {
  Sparkles,
  Play,
  CheckCircle2,
  TrendingUp,
  Award,
  Video,
  ShieldCheck,
  MessageCircle,
  Clock,
  Smartphone,
  Crown,
} from 'lucide-react';

interface LandingHeroProps {
  tokens: TokenState;
  onStartGenerator: () => void;
  onOpenUpgrade: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  tokens,
  onStartGenerator,
  onOpenUpgrade,
  onOpenProfile,
  onOpenAdmin,
}) => {
  const waContactUrl =
    'https://wa.me/6289673686625?text=Halo%20Admin%20PropertiClip%2C%20saya%20agen%20properti%20dan%20tertarik%20konsultasi%20layanan%20video%20generator%20properti.';

  return (
    <section id="hero" className="relative pt-6 pb-16 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-rose-500/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Promotional Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold shadow-lg shadow-amber-500/5">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Bonus Registrasi: Dapatkan 5 Token Demo Gratis (1 Token = 1 Video)</span>
          </div>
        </div>

        {/* Main Headings */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] tracking-tight text-white leading-[1.15]">
            Ubah Foto Rumah Jadi{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
              Video Promosi Sinematik Viral
            </span>{' '}
            Sekelas Agency Elit dalam 60 Detik
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Tingkatkan respon calon pembeli hingga <strong className="text-amber-400 font-bold">340%</strong>. Dilengkapi narasi AI bahasa Indonesia yang luwes (tidak kaku), watermark logo agency Anda, dan subtitle bergerak siap tayang di WhatsApp Status, Reels, TikTok & Facebook.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartGenerator}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-105 cursor-pointer"
            >
              <Video className="w-5 h-5 text-slate-950" />
              <span>Mulai Buat Video Promosi (Demo 5 Token)</span>
            </button>

            <a
              href={waContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 hover:border-emerald-400 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Tanya CS WhatsApp (0896-7368-6625)</span>
            </a>
          </div>

          {/* EYE-CATCHING PROMINENT ADMIN BADGE */}
          <div className="pt-2">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border-2 border-amber-400/80 text-amber-300 hover:text-white transition-all text-xs font-bold cursor-pointer shadow-lg shadow-amber-500/20 hover:scale-105"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Menu Pengelola: Akses Dashboard Admin & Worksheet Database (user: admin | pass: 8888)</span>
            </button>
          </div>

          {/* Social Proof Stats */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xl sm:text-2xl font-black text-white font-['Outfit'] block">2.400+</span>
              <span className="text-xs text-slate-400">Agen Terdaftar</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-['Outfit'] block">38.000+</span>
              <span className="text-xs text-slate-400">Video Diproduksi</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-['Outfit'] block">1 Token = 1 Video</span>
              <span className="text-xs text-slate-400">Sistem Demo Transparan</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xl sm:text-2xl font-black text-sky-400 font-['Outfit'] block">9:16 & 1:1</span>
              <span className="text-xs text-slate-400">WA, Reels, TikTok, FB</span>
            </div>
          </div>
        </div>

        {/* Feature Highlights Section */}
        <div id="features" className="mt-20 pt-12 border-t border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
              Mengapa Agen Properti Top Beralih ke <span className="text-amber-400">PropertiClip AI</span>?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Dibuat khusus untuk alur kerja agen properti Indonesia. Tanpa perlu skill editing video dan tanpa biaya videografer jutaan rupiah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">
                Narasi AI Realistis (Tidak Kaku)
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Naskah copywriting otomatis mengubah spesifikasi rumah (LT, LB, KT, KM, SHM) menjadi kalimat penjualan luwes yang memikat rasa bangga dan urgensi pembeli.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">
                Watermark Logo Agency & WA Agen
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Upload logo kantor (Brighton, ERA, Ray White, Century 21, dll). Logo otomatis menempel elegan di sudut video bersama nomor WhatsApp dan nama Anda.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">
                Pilihan Durasi & Multi-Platform
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Pilih 15 detik (cepat untuk Status WA), 30 detik (viral di Reels & TikTok), atau 60 detik (full tour Facebook). Format 9:16 vertikal dan 1:1 feed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
