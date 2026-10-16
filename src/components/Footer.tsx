import React from 'react';
import { Video, MessageCircle, Heart, Phone, ShieldCheck, Mail } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (id: string) => void;
  onOpenUpgrade: () => void;
  onOpenProfile: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToSection,
  onOpenUpgrade,
  onOpenProfile,
}) => {
  const waContactUrl =
    'https://wa.me/6289673686625?text=Halo%20Admin%20PropertiClip%2C%20saya%20agen%20properti%20dan%20ingin%20konsultasi%20layanan%20video%20generator.';

  return (
    <>
      <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Col 1: Brand */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xl text-white font-['Outfit']">
                  Properti<span className="text-amber-400">Clip</span> PRO AI
                </span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
                Platform video generator pro bertenaga kecerdasan buatan khusus untuk agen properti Indonesia. Ubah foto rumah menjadi video vertikal viral dengan narasi AI realistis, watermark agency, dan subtitle karaoke.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" /> Resmi & Terpercaya
                </span>
                <span>•</span>
                <span className="text-amber-400 font-semibold text-[11px]">
                  Gratis 5 Token Demo
                </span>
              </div>
            </div>

            {/* Col 2: Navigasi */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">
                Navigasi Cepat
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => onScrollToSection('generator')}
                    className="hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    Studio Generator Video
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenProfile}
                    className="hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    Registrasi Profil Agen & Logo
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenUpgrade}
                    className="hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    Paket Unlimited VIP Token
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onScrollToSection('features')}
                    className="hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    Fitur & Keunggulan
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Kontak WhatsApp */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">
                Kontak & CS Support
              </h4>
              <p className="text-slate-400 text-xs">
                Ada pertanyaan teknis, kendala upload, atau aktivasi paket Unlimited VIP? Hubungi kami langsung:
              </p>
              <a
                href={waContactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-950/40"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: 0896-7368-6625</span>
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} PropertiClip AI. Hak Cipta Dilindungi.</p>
            <p className="flex items-center gap-1">
              Dirancang khusus untuk memajukan industri agen properti di Indonesia
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp CTA Button on Bottom-Right */}
      <a
        href={waContactUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat CS WhatsApp: 0896-7368-6625"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-2xl shadow-emerald-900/70 border border-emerald-400/40 transition-all hover:scale-105 group"
      >
        <div className="w-3 h-3 rounded-full bg-white animate-ping absolute -top-0.5 -right-0.5" />
        <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Hubungi CS: 0896-7368-6625</span>
        <span className="sm:hidden font-bold">WA CS</span>
      </a>
    </>
  );
};
