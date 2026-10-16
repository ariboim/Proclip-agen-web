import React, { useState, useEffect } from 'react';
import {
  AgentProfile,
  PropertyFormData,
  GeneratedVideoScript,
  TokenState,
} from './types/property';
import {
  getStoredAgentProfile,
  getStoredTokenState,
  useOneToken,
  saveTokenState,
} from './utils/storage';
import { SAMPLE_PROPERTIES, getDefaultPhotos, DEFAULT_AGENT_PROFILE } from './utils/sampleData';
import { soundEngine } from './utils/audioSynthesizer';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { PropertyForm } from './components/PropertyForm';
import { VideoStudio } from './components/VideoStudio';
import { AgentProfileModal } from './components/AgentProfileModal';
import { UpgradeModal } from './components/UpgradeModal';
import { PricingSection } from './components/PricingSection';
import { TestimonialsFAQ } from './components/TestimonialsFAQ';
import { Footer } from './components/Footer';
import confetti from 'canvas-confetti';

// Intelligent Fallback Script Generator tailored to property data
function generateIntelligentScript(data: PropertyFormData, agent: AgentProfile): GeneratedVideoScript {
  const dur = data.duration || 30;
  const priceDisplay = data.price || 'Harga Spesial Nego';
  const locDisplay = data.location || 'Lokasi Super Strategis';
  const titleDisplay = data.title || 'Rumah Modern Impian';
  const agentWa = agent.whatsapp || '089673686625';

  if (dur === 15) {
    return {
      catchyHeadline: `Hunian Idaman di ${locDisplay.slice(0, 20)}!`,
      fullScript: `Cari rumah siap huni di ${locDisplay}? Ini dia unit spesial dengan luas tanah ${data.landArea || '120'} meter persegi, ${data.bedrooms || '3'} kamar tidur, dan legalitas SHM aman. Harga hanya ${priceDisplay}! Info survey hubungi ${agent.name} sekarang.`,
      closingCtaText: `Hubungi WhatsApp ${agent.name}: ${agentWa}`,
      highlightBadges: [`Harga ${priceDisplay}`, `LT ${data.landArea || '120'}m²`, `SHM Ready`, `Lokasi Prima`],
      scenes: [
        {
          sceneIndex: 0,
          photoTarget: 'exterior',
          startSec: 0,
          endSec: 5,
          spokenText: `Cari rumah siap huni di ${locDisplay}?`,
          screenTitle: titleDisplay,
          screenBadge: `Harga ${priceDisplay}`,
          motionStyle: 'zoom-in',
        },
        {
          sceneIndex: 1,
          photoTarget: 'interior',
          startSec: 5,
          endSec: 10,
          spokenText: `Luas tanah ${data.landArea || '120'} meter persegi dengan desain modern dan legalitas SHM aman.`,
          screenTitle: 'Ruangan Lapang & Terang',
          screenBadge: `${data.bedrooms || '3'} KT • ${data.bathrooms || '2'} KM`,
          motionStyle: 'pan-right',
        },
        {
          sceneIndex: 2,
          photoTarget: 'cta',
          startSec: 10,
          endSec: 15,
          spokenText: `Harga ${priceDisplay}! Segera hubungi ${agent.name} untuk jadwal survey lokasi.`,
          screenTitle: `Hubungi ${agent.name}`,
          screenBadge: `WA: ${agentWa}`,
          motionStyle: 'dramatic-zoom',
        },
      ],
    };
  } else if (dur === 60) {
    return {
      catchyHeadline: `Eksklusif! Tur Lengkap ${titleDisplay}`,
      fullScript: `Halo calon pembeli rumah impian. Kembali lagi bersama ${agent.name} dari ${agent.agencyName}. Hari ini saya perkenalkan sebuah mahakarya hunian di ${locDisplay}. Memiliki luas tanah ${data.landArea || '120'} meter persegi dan luas bangunan ${data.buildingArea || '145'} meter persegi. Tata ruangnya sangat leluasa dengan konsep open space dan sirkulasi udara optimal. Terdapat ${data.bedrooms || '4'} kamar tidur nyaman dan ${data.bathrooms || '3'} kamar mandi mewah. Carport muat ${data.carports || '2'} mobil dengan keamanan One Gate System 24 jam. Menariknya lagi, Anda mendapatkan promo spesial ${data.specialPromo || 'Free BPHTB'}. Jangan tunda lagi sebelum unit dipesan orang lain. Hubungi ${agent.name} di WhatsApp ${agentWa} untuk survey lokasi sekarang juga!`,
      closingCtaText: `Survey & Booking Hubungi WhatsApp ${agent.name}: ${agentWa}`,
      highlightBadges: [
        `Harga ${priceDisplay}`,
        `LT ${data.landArea || '120'}m²`,
        `LB ${data.buildingArea || '145'}m²`,
        `${data.bedrooms || '4'} KT`,
        `SHM Ready`,
      ],
      scenes: [
        {
          sceneIndex: 0,
          photoTarget: 'exterior',
          startSec: 0,
          endSec: 12,
          spokenText: `Halo calon pembeli rumah impian! Kembali lagi bersama ${agent.name} dari ${agent.agencyName}.`,
          screenTitle: titleDisplay,
          screenBadge: `Lokasi: ${locDisplay}`,
          motionStyle: 'zoom-in',
        },
        {
          sceneIndex: 1,
          photoTarget: 'living',
          startSec: 12,
          endSec: 25,
          spokenText: `Memiliki luas tanah ${data.landArea || '120'} meter persegi dengan tata ruang open space yang sangat leluasa.`,
          screenTitle: 'Ruang Tamu & Keluarga Luas',
          screenBadge: `LT ${data.landArea || '120'}m² • LB ${data.buildingArea || '145'}m²`,
          motionStyle: 'pan-right',
        },
        {
          sceneIndex: 2,
          photoTarget: 'bedroom',
          startSec: 25,
          endSec: 38,
          spokenText: `Dilengkapi ${data.bedrooms || '4'} kamar tidur berkelas dan ${data.bathrooms || '3'} kamar mandi bernuansa resort.`,
          screenTitle: 'Kamar Tidur Utama Mewah',
          screenBadge: `${data.bedrooms || '4'} Kamar Tidur Nyaman`,
          motionStyle: 'zoom-out',
        },
        {
          sceneIndex: 3,
          photoTarget: 'kitchen',
          startSec: 38,
          endSec: 48,
          spokenText: `Dapur modern dan promo istimewa: ${data.specialPromo || 'Free BPHTB & Biaya KPR'}.`,
          screenTitle: 'Fasilitas & Promo Spesial',
          screenBadge: 'Promo Khusus Bulan Ini',
          motionStyle: 'pan-right',
        },
        {
          sceneIndex: 4,
          photoTarget: 'cta',
          startSec: 48,
          endSec: 60,
          spokenText: `Harga penawaran terbaik ${priceDisplay}. Hubungi WhatsApp ${agent.name} di ${agentWa} sekarang juga!`,
          screenTitle: `Hubungi ${agent.name}`,
          screenBadge: `WA: ${agentWa}`,
          motionStyle: 'dramatic-zoom',
        },
      ],
    };
  }

  // Default 30s
  return {
    catchyHeadline: `Hunian Idaman 2 Lantai di ${locDisplay.slice(0, 24)}!`,
    fullScript: `Lagi cari rumah impian yang siap huni dan lokasinya super strategis di ${locDisplay}? Nih kenalin, hunian modern 2 lantai dengan luas tanah ${data.landArea || '120'} meter persegi dan luas bangunan ${data.buildingArea || '145'} meter persegi. Ruang tamunya lega, ada ${data.bedrooms || '4'} kamar tidur, dan carport untuk ${data.carports || '2'} mobil. Legalitasnya sudah SHM aman, plus ada promo ${data.specialPromo || 'Free BPHTB'}. Harganya sangat kompetitif, ${priceDisplay}. Jangan tunggu keduluan orang lain, segera hubungi saya, ${agent.name} di nomor WhatsApp ${agentWa} untuk jadwal survey hari ini!`,
    closingCtaText: `Hubungi WhatsApp ${agent.name}: ${agentWa}`,
    highlightBadges: [
      `Harga ${priceDisplay}`,
      `LT ${data.landArea || '120'}m²`,
      `LB ${data.buildingArea || '145'}m²`,
      `${data.bedrooms || '4'} KT`,
      `SHM Ready`,
    ],
    scenes: [
      {
        sceneIndex: 0,
        photoTarget: 'exterior',
        startSec: 0,
        endSec: 8,
        spokenText: `Lagi cari rumah impian yang siap huni dan lokasinya super strategis di ${locDisplay}?`,
        screenTitle: titleDisplay,
        screenBadge: `Harga ${priceDisplay}`,
        motionStyle: 'zoom-in',
      },
      {
        sceneIndex: 1,
        photoTarget: 'living',
        startSec: 8,
        endSec: 16,
        spokenText: `Nih kenalin, hunian modern dengan luas tanah ${data.landArea || '120'} meter persegi dan ruangan lega.`,
        screenTitle: 'Ruangan Open Space Plafon Tinggi',
        screenBadge: `LT ${data.landArea || '120'}m² • LB ${data.buildingArea || '145'}m²`,
        motionStyle: 'pan-right',
      },
      {
        sceneIndex: 2,
        photoTarget: 'bedroom',
        startSec: 16,
        endSec: 23,
        spokenText: `Ada ${data.bedrooms || '4'} kamar tidur nyaman, legalitas SHM, dan promo ${data.specialPromo || 'Free BPHTB'}.`,
        screenTitle: 'Kenyamanan Hunian Keluarga',
        screenBadge: `${data.bedrooms || '4'} KT • ${data.bathrooms || '3'} KM`,
        motionStyle: 'zoom-out',
      },
      {
        sceneIndex: 3,
        photoTarget: 'cta',
        startSec: 23,
        endSec: 30,
        spokenText: `Harga ${priceDisplay}. Segera hubungi saya, ${agent.name} di WhatsApp ${agentWa} untuk survey!`,
        screenTitle: `Hubungi ${agent.name}`,
        screenBadge: `WA: ${agentWa}`,
        motionStyle: 'dramatic-zoom',
      },
    ],
  };
}

export default function App() {
  // Agent profile state
  const [agent, setAgent] = useState<AgentProfile>(DEFAULT_AGENT_PROFILE);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Token credit state
  const [tokens, setTokens] = useState<TokenState>({
    remainingTokens: 5,
    totalUsed: 0,
    isUnlimitedVip: false,
  });
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Form & Script state
  const [formData, setFormData] = useState<PropertyFormData>(() => {
    const sample = SAMPLE_PROPERTIES[0];
    const defaultPhotos = getDefaultPhotos();
    return {
      ...sample,
      photos: defaultPhotos,
    };
  });

  const [generatedScript, setGeneratedScript] = useState<GeneratedVideoScript>(() =>
    generateIntelligentScript(SAMPLE_PROPERTIES[0], DEFAULT_AGENT_PROFILE)
  );

  // Studio Mode vs Form Mode
  const [activeView, setActiveView] = useState<'form' | 'studio'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  // Initialize from LocalStorage
  useEffect(() => {
    const storedProfile = getStoredAgentProfile();
    setAgent(storedProfile);

    const storedTokens = getStoredTokenState();
    setTokens(storedTokens);
  }, []);

  // Update script whenever agent info changes
  useEffect(() => {
    setGeneratedScript((prev) => ({
      ...prev,
      closingCtaText: `Hubungi WhatsApp ${agent.name}: ${agent.whatsapp || '089673686625'}`,
    }));
  }, [agent]);

  // Scroll to anchor sections smoothly
  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'generator') {
      const el = document.getElementById('generator-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Generate Video with Gemini AI
  const handleGenerateVideo = async () => {
    // Check tokens
    const { success, state: updatedTokens } = useOneToken();
    if (!success) {
      setIsUpgradeModalOpen(true);
      return;
    }
    setTokens(updatedTokens);

    setIsLoading(true);
    setLoadingStep('Menganalisis spesifikasi properti & foto...');

    try {
      setLoadingStep('AI meracik naskah narasi realistis & persuasif...');
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: agent.name,
          agencyName: agent.agencyName,
          agentWa: agent.whatsapp,
          propertyType: formData.propertyType,
          title: formData.title,
          location: formData.location,
          price: formData.price,
          landArea: formData.landArea,
          buildingArea: formData.buildingArea,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          carports: formData.carports,
          certificate: formData.certificate,
          features: formData.features,
          specialPromo: formData.specialPromo,
          duration: formData.duration,
          tone: formData.tone,
          platform: formData.platform,
          customPrompt: formData.customDescription,
          photoCount: formData.photos.length,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          setGeneratedScript(json.data);
        } else {
          // Use intelligent fallback
          setGeneratedScript(generateIntelligentScript(formData, agent));
        }
      } else {
        setGeneratedScript(generateIntelligentScript(formData, agent));
      }

      setLoadingStep('Menyiapkan audio visual studio...');
      await new Promise((r) => setTimeout(r, 600));

      setActiveView('studio');
      setIsLoading(false);

      // Scroll to studio
      window.scrollTo({ top: 320, behavior: 'smooth' });

      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.warn('Script generation network error, using intelligent fallback', err);
      setGeneratedScript(generateIntelligentScript(formData, agent));
      setActiveView('studio');
      setIsLoading(false);
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  };

  // Regenerate script directly inside Studio Editor
  const handleRegenerateScriptInStudio = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: agent.name,
          agencyName: agent.agencyName,
          agentWa: agent.whatsapp,
          propertyType: formData.propertyType,
          title: formData.title,
          location: formData.location,
          price: formData.price,
          landArea: formData.landArea,
          buildingArea: formData.buildingArea,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          carports: formData.carports,
          certificate: formData.certificate,
          features: formData.features,
          specialPromo: formData.specialPromo,
          duration: formData.duration,
          tone: formData.tone,
          platform: formData.platform,
          customPrompt: formData.customDescription,
          photoCount: formData.photos.length,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          setGeneratedScript(json.data);
        }
      }
    } catch (err) {
      console.warn('Regeneration error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-amber-500 selection:text-slate-950">
      {/* Top Sticky Navbar */}
      <Navbar
        agent={agent}
        tokens={tokens}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      <main className="flex-1">
        {/* Landing Hero Section */}
        <LandingHero
          tokens={tokens}
          onStartGenerator={() => {
            handleScrollToSection('generator');
          }}
          onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />

        {/* Studio Generator Area */}
        <section id="generator-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {activeView === 'form' ? (
            <PropertyForm
              formData={formData}
              onChange={setFormData}
              onSubmit={handleGenerateVideo}
              isLoading={isLoading}
              loadingStep={loadingStep}
              agent={agent}
              tokens={tokens}
              onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
              onOpenProfile={() => setIsProfileModalOpen(true)}
            />
          ) : (
            <VideoStudio
              script={generatedScript}
              onUpdateScript={setGeneratedScript}
              propertyData={formData}
              onUpdatePropertyData={setFormData}
              agent={agent}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onRegenerateScript={handleRegenerateScriptInStudio}
              isRegenerating={isLoading}
              onBackToForm={() => setActiveView('form')}
            />
          )}
        </section>

        {/* Pricing Plan Section */}
        <PricingSection
          tokens={tokens}
          onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
          onStartGenerator={() => {
            setActiveView('form');
            handleScrollToSection('generator');
          }}
        />

        {/* Social Proof Testimonials & FAQ */}
        <TestimonialsFAQ />
      </main>

      {/* Footer & Floating WhatsApp CTA */}
      <Footer
        onScrollToSection={handleScrollToSection}
        onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Agent Registration & Branding Modal */}
      <AgentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={agent}
        onSaveProfile={(updated) => setAgent(updated)}
      />

      {/* VIP Unlimited Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        tokens={tokens}
        onTokensUpdated={(newTokens) => setTokens(newTokens)}
      />
    </div>
  );
}
