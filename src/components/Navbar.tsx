import React from 'react';
import { AgentProfile, TokenState } from '../types/property';
import { Video, Sparkles, Crown, MessageCircle, UserCheck, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  agent: AgentProfile;
  tokens: TokenState;
  onOpenProfile: () => void;
  onOpenUpgrade: () => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  agent,
  tokens,
  onOpenProfile,
  onOpenUpgrade,
  onScrollToSection,
  onOpenAdmin,
}) => {
  const waContactUrl = 'https://wa.me/6289673686625?text=Halo%20Admin%2C%20saya%20tertarik%20dengan%20PropertiClip%20AI%20Video%20Generator%20untuk%20agen%20properti.';

  return (
    <>
      {/* EYE-CATCHING TOP ADMIN ACCESS BAR */}
      <div className="bg-gradient-to-r from-amber-950/90 via-slate-950 to-amber-950/90 border-b border-amber-500/40 py-2 px-3 sm:px-6 relative z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/25 border border-amber-400 text-[10px] font-black text-amber-300 uppercase tracking-wider">
              🔐 PORTAL ADMIN & WORKSHEET
            </span>
            <span className="hidden md:inline text-xs text-amber-100 font-medium">
              Kontrol Token Unlimited, Status Blokir & Database Agen Terdaftar
            </span>
          </div>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 transition-all hover:scale-105 cursor-pointer uppercase tracking-wide border border-amber-200"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>Klik Akses Admin Disini</span>
          </button>
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/90 border-b border-slate-800/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand / Logo */}
          <div
            onClick={() => onScrollToSection('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-['Outfit']">
                  Properti<span className="text-amber-400">Clip</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PRO AI
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Video Generator Agen Properti</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300">
            <button
              onClick={() => onScrollToSection('generator')}
              className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Studio Generator
            </button>
            <button
              onClick={() => onScrollToSection('features')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Keunggulan
            </button>
            <button
              onClick={() => onScrollToSection('pricing')}
              className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              Paket Unlimited
            </button>
            <button
              onClick={() => onScrollToSection('faq')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Right Action Badges: Eye-Catching Admin Button + Token Counter + Agent Profile + WA CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* EYE-CATCHING HIGHLIGHTED ADMIN BUTTON (Always Visible) */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-400 hover:border-amber-300 text-amber-300 hover:text-white font-black text-xs shadow-md shadow-amber-500/25 transition-all hover:scale-105 cursor-pointer animate-pulse"
              title="Klik untuk membuka Login Admin & Worksheet Database"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="tracking-wide">AKSES ADMIN</span>
            </button>

            {/* Token Credit Badge */}
            <button
              onClick={onOpenUpgrade}
              title="Klik untuk upgrade ke Unlimited Token"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 transition-all cursor-pointer group"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
                  {tokens.isUnlimitedVip ? (
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Crown className="w-3.5 h-3.5" /> VIP UNLIMITED
                    </span>
                  ) : (
                    <>
                      <span>Token:</span>
                      <span className="text-amber-400 font-bold">{tokens.remainingTokens}</span>
                    </>
                  )}
                </div>
              </div>
              {!tokens.isUnlimitedVip && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                  Top Up
                </span>
              )}
            </button>

            {/* Agent Profile Button */}
            <button
              onClick={onOpenProfile}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                agent.isRegistered
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500'
                  : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
              }`}
            >
              {agent.agencyLogoUrl ? (
                <img
                  src={agent.agencyLogoUrl}
                  alt="Logo Agency"
                  className="w-5 h-5 object-contain rounded"
                />
              ) : (
                <UserCheck className="w-4 h-4 text-amber-400" />
              )}
              <span className="text-xs font-semibold hidden sm:inline">
                {agent.isRegistered ? agent.name.split(' ')[0] : 'Registrasi Agen'}
              </span>
            </button>

            {/* WhatsApp CTA Direct to 089673686625 */}
            <a
              href={waContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-xs shadow-md shadow-emerald-950/40 transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden lg:inline">CS WA: 0896-7368-6625</span>
              <span className="lg:hidden">WA</span>
            </a>
          </div>
        </div>
      </header>
    </>
  );
};
