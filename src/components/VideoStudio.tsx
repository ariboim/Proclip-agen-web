import React, { useState, useEffect, useRef } from 'react';
import {
  PropertyFormData,
  GeneratedVideoScript,
  AgentProfile,
  VideoEditorSettings,
  AspectRatioType,
  VideoDuration,
} from '../types/property';
import {
  renderVideoFrame,
  preloadImages,
  getResolutionForAspect,
  exportVideoWithAudio,
} from '../utils/videoRenderer';
import { soundEngine } from '../utils/audioSynthesizer';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Sliders,
  Type,
  Music,
  Shield,
  Palette,
  Sparkles,
  Volume2,
  VolumeX,
  Share2,
  Check,
  MessageCircle,
  ExternalLink,
  Edit3,
  Maximize2,
  Film,
  Flame,
  Zap,
  Layers,
  Wand2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VideoStudioProps {
  script: GeneratedVideoScript;
  onUpdateScript: (newScript: GeneratedVideoScript) => void;
  propertyData: PropertyFormData;
  onUpdatePropertyData: (newData: PropertyFormData) => void;
  agent: AgentProfile;
  onOpenProfile: () => void;
  onRegenerateScript: () => Promise<void>;
  isRegenerating: boolean;
  onBackToForm: () => void;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({
  script,
  onUpdateScript,
  propertyData,
  onUpdatePropertyData,
  agent,
  onOpenProfile,
  onRegenerateScript,
  isRegenerating,
  onBackToForm,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const totalDuration = propertyData.duration || 30;

  // Editor settings state
  const [settings, setSettings] = useState<VideoEditorSettings>({
    aspectRatio: propertyData.aspectRatio || '9:16',
    duration: totalDuration,
    bgmTrack: 'luxury_lofi',
    bgmVolume: 0.25,
    voiceVolume: 1.0,
    logoPosition: 'top_right',
    logoScale: 1.0,
    showBadges: true,
    captionTheme: 'tiktok_yellow',
    captionFontSize: 18,
    visualFilter: 'luxury_warm',
    watermarkEnabled: true,
    transitionEffect: 'light_leak',
    transitionDuration: 0.75,
    cameraAngleMotion: 'gimbal_walkthrough',
    cinematicLighting: true,
    autoSubtitleStyle: 'viral_capcut_yellow',
    subtitlePosition: 'bottom',
    audioDucking: true,
  });

  // Active editing tab
  const [activeTab, setActiveTab] = useState<'script' | 'transitions' | 'audio' | 'branding' | 'captions'>('transitions');

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('');
  const [downloadSuccessModal, setDownloadSuccessModal] = useState(false);

  // Preloaded images cache
  const imagesCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const logoImageRef = useRef<HTMLImageElement | null>(null);
  const [isAssetsReady, setIsAssetsReady] = useState(false);

  // Load assets on mount or when photos change
  useEffect(() => {
    let isMounted = true;
    preloadImages(propertyData.photos, agent.agencyLogoUrl).then(({ imagesCache, logoImage }) => {
      if (!isMounted) return;
      imagesCacheRef.current = imagesCache;
      logoImageRef.current = logoImage;
      setIsAssetsReady(true);
      drawCurrentFrame(0);
      // Automatically start video preview playback as requested
      setTimeout(() => {
        if (isMounted) {
          setIsPlaying(true);
        }
      }, 300);
    });
    return () => {
      isMounted = false;
    };
  }, [propertyData.photos, agent.agencyLogoUrl]);

  // Redraw when currentTime or settings change
  const drawCurrentFrame = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = getResolutionForAspect(settings.aspectRatio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    renderVideoFrame({
      canvas,
      currentTime: time,
      totalDuration,
      script,
      photos: propertyData.photos,
      propertyData,
      agent,
      settings,
      imagesCache: imagesCacheRef.current,
      logoImage: logoImageRef.current,
    });
  };

  useEffect(() => {
    drawCurrentFrame(currentTime);
  }, [currentTime, settings, script, propertyData, agent]);

  // Playback timer loop
  useEffect(() => {
    let animFrame: number;
    let lastTimestamp: number | null = null;

    if (isPlaying) {
      soundEngine.init();
      soundEngine.setVolumes(settings.bgmVolume, settings.voiceVolume);
      soundEngine.startBgm(settings.bgmTrack);

      const loop = (timestamp: number) => {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const delta = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;

        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= totalDuration) {
            setIsPlaying(false);
            soundEngine.stopBgm();
            return 0;
          }
          return next;
        });

        animFrame = requestAnimationFrame(loop);
      };

      animFrame = requestAnimationFrame(loop);
    } else {
      soundEngine.stopBgm();
    }

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
      soundEngine.stopBgm();
    };
  }, [isPlaying, totalDuration, settings.bgmTrack, settings.bgmVolume, settings.voiceVolume]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    soundEngine.stopBgm();
    drawCurrentFrame(0);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    drawCurrentFrame(val);
  };

  const handlePreviewTransition = () => {
    // Jump to 1.0s before the end of Scene 1 so the agent immediately witnesses the cinematic transition
    const firstSceneEnd = script.scenes?.[0]?.endSec || Math.min(8, totalDuration / 2);
    const transDur = settings.transitionDuration || 0.75;
    const targetTime = Math.max(0, firstSceneEnd - transDur - 0.4);
    setCurrentTime(targetTime);
    drawCurrentFrame(targetTime);
    setIsPlaying(true);
  };

  // Export video to download
  const handleExport = async () => {
    setIsPlaying(false);
    setIsExporting(true);
    setExportProgress(5);
    setExportStatusText('Menginisialisasi encoder video...');

    try {
      const videoBlob = await exportVideoWithAudio({
        duration: totalDuration,
        aspectRatio: settings.aspectRatio,
        script,
        photos: propertyData.photos,
        propertyData,
        agent,
        settings,
        onProgress: (pct, msg) => {
          setExportProgress(pct);
          setExportStatusText(msg);
        },
      });

      // Trigger browser download
      const cleanTitle = (propertyData.title || 'Properti_Promosi')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .slice(0, 24);
      const filename = `PropertiClip_${cleanTitle}_${totalDuration}s.webm`;

      const downloadUrl = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setIsExporting(false);
      setDownloadSuccessModal(true);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (e) {
        // ignore
      }
    } catch (err: any) {
      console.error('Export error:', err);
      alert('Maaf, ekspor video mengalami kendala teknis: ' + (err.message || 'Coba gunakan browser Chrome/Edge'));
      setIsExporting(false);
    }
  };

  // Preview Voice Speech
  const handlePreviewVoice = () => {
    soundEngine.speakIndonesian(script.fullScript);
  };

  const waShareUrl = `https://wa.me/6289673686625?text=Halo%20Admin%20PropertiClip%2C%20saya%20sudah%20generate%20video%20promosi%20properti%20untuk%20listing%20saya%20dan%20tertarik%20konsultasi%20strategi%20posting%20iklan.`;

  return (
    <div className="bg-white border-2 border-orange-200/90 rounded-3xl p-6 sm:p-8 shadow-xl text-slate-800">
      {/* Top Bar: Back & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-orange-200 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold mb-2">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Langkah 3: Review & Edit Video Sebelum Download
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-slate-900">
            Studio Editor Video Promosi Properti
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Sesuaikan naskah, volume audio, posisi logo agency, atau langsung unduh video siap posting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToForm}
            className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-950 text-xs font-bold border border-orange-300 transition-colors cursor-pointer shadow-xs"
          >
            ← Ubah Form / Foto
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Video ({settings.aspectRatio})
          </button>
        </div>
      </div>

      {/* Main Studio Layout: Player on Left, Editor Suite on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: REAL-TIME VIDEO PLAYER */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* Automatic Preview Notification Banner */}
          <div className="w-full max-w-[420px] mb-3 p-3 rounded-2xl bg-orange-50/90 border border-orange-300 text-orange-950 text-xs flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-slate-900">
                Pratinjau Otomatis: Tonton video sebelum diunduh atau dibagikan
              </span>
            </div>
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-nowrap">
              LIVE PREVIEW
            </span>
          </div>

          {/* Canvas Wrapper with aspect ratio styling */}
          <div
            className={`relative rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border-2 border-slate-800 flex items-center justify-center ${
              settings.aspectRatio === '9:16'
                ? 'w-full max-w-[340px] aspect-[9/16]'
                : settings.aspectRatio === '1:1'
                ? 'w-full max-w-[420px] aspect-square'
                : 'w-full max-w-[520px] aspect-video'
            }`}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain cursor-pointer"
              onClick={handleTogglePlay}
            />

            {/* Play/Pause Overlay Icon when paused */}
            {!isPlaying && (
              <div
                onClick={handleTogglePlay}
                className="absolute inset-0 flex items-center justify-center bg-slate-950/30 backdrop-blur-[2px] cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 ml-1" />
                </div>
              </div>
            )}

            {/* Platform & Active Transition indicator badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="px-2 py-1 rounded-md bg-slate-950/70 border border-slate-700/60 text-[10px] font-bold text-slate-300 backdrop-blur-sm">
                {settings.aspectRatio === '9:16'
                  ? 'Status WA / Reels / TikTok'
                  : settings.aspectRatio === '1:1'
                  ? 'Feed IG / Facebook'
                  : 'Landscape YouTube'}
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/25 border border-amber-400/60 text-[10px] font-black text-amber-300 backdrop-blur-sm shadow-md">
                <Film className="w-3 h-3 text-rose-400" />
                <span>
                  {settings.transitionEffect === 'light_leak'
                    ? 'Light Leak'
                    : settings.transitionEffect === 'cross_dissolve'
                    ? 'Cross Dissolve'
                    : settings.transitionEffect === 'smooth_zoom'
                    ? 'Smooth Zoom'
                    : settings.transitionEffect === 'film_blur'
                    ? 'Film Blur'
                    : 'Whip Pan'}
                </span>
              </div>
            </div>
          </div>

          {/* Player Controls Bar */}
          <div className="w-full max-w-[420px] mt-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            {/* Scrubber slider */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
                {currentTime.toFixed(1)}s
              </span>
              <input
                type="range"
                min="0"
                max={totalDuration}
                step="0.1"
                value={currentTime}
                onChange={handleScrub}
                className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-[11px] font-mono text-slate-400 w-10">
                {totalDuration}s
              </span>
            </div>

            {/* Buttons: Play/Pause, Reset, Voice Preview */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Putar Video'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2.5 rounded-xl bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 transition-colors cursor-pointer"
                  title="Mulai Ulang dari Awal"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speech & Transition quick test buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePreviewTransition}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer"
                  title="Loncat ke 1 detik sebelum pergantian adegan untuk melihat efek transisi langsung"
                >
                  <Film className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tes Transisi</span>
                </button>

                <button
                  type="button"
                  onClick={handlePreviewVoice}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
                  title="Dengarkan Naskah Narasi AI"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Tes Suara</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TABBED VIDEO EDITOR SUITE */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-orange-50/80 border border-orange-200 overflow-x-auto shadow-xs">
            <button
              onClick={() => setActiveTab('script')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'script'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-orange-100/60'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              Naskah AI
            </button>
            <button
              onClick={() => setActiveTab('transitions')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'transitions'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-orange-100/60'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-rose-500" />
              Transisi Sinematik
              <span className="px-1.5 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider">
                PRO
              </span>
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'audio'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-orange-100/60'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              Musik & Audio
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'branding'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-orange-100/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Logo & Watermark
            </button>
            <button
              onClick={() => setActiveTab('captions')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'captions'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-orange-100/60'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Subtitle & Filter
            </button>
          </div>

          {/* TAB 1: EDIT NASKAH & NARASI AI */}
          {activeTab === 'script' && (
            <div className="space-y-4 p-5 rounded-2xl bg-orange-50/40 border border-orange-200/80 animate-in fade-in duration-150 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    Edit Teks Naskah Narasi AI
                  </h3>
                  <p className="text-xs text-slate-600">
                    Bebas sesuaikan kata-kata agar semakin pas dengan gaya bicara Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onRegenerateScript}
                  disabled={isRegenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-950 border border-orange-300 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  {isRegenerating ? 'Meracik...' : 'Regenerate Naskah AI'}
                </button>
              </div>

              {/* Headline Hook */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Catchy Headline Hook (Pemikat Penonton 3 Detik Pertama)
                </label>
                <input
                  type="text"
                  value={script.catchyHeadline}
                  onChange={(e) =>
                    onUpdateScript({ ...script, catchyHeadline: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Full Narration Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Naskah Narasi Lengkap (Dibacakan AI)
                </label>
                <textarea
                  rows={4}
                  value={script.fullScript}
                  onChange={(e) =>
                    onUpdateScript({ ...script, fullScript: e.target.value })
                  }
                  className="w-full p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs leading-relaxed focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Scene breakdown overview */}
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  Struktur Adegan ({script.scenes?.length || 0} Scene Sinkron):
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(script.scenes || []).map((scene, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-start justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-amber-400">Scene #{idx + 1}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({scene.startSec}s - {scene.endSec}s)
                          </span>
                          <span className="text-[10px] bg-slate-800 text-sky-300 px-1.5 py-0.5 rounded">
                            {scene.photoTarget}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={scene.spokenText}
                          onChange={(e) => {
                            const newScenes = [...script.scenes];
                            newScenes[idx] = { ...scene, spokenText: e.target.value };
                            onUpdateScript({ ...script, scenes: newScenes });
                          }}
                          className="w-full bg-slate-950 px-2 py-1 rounded text-slate-200 text-xs border border-slate-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: TRANSISI SINEMATIK (CUSTOM CINEMATIC TRANSITIONS) */}
          {activeTab === 'transitions' && (
            <div className="space-y-5 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Film className="w-4 h-4 text-amber-400" />
                    Pilihan Efek Transisi Sinematik Antar Adegan
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black uppercase">
                      PRO High-End
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Transisi visual kelas bioskop membuat video promosi properti tampak hidup dan berkelas, bukan sekadar potongan foto statis.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePreviewTransition}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-400/50 hover:border-amber-300 text-amber-300 hover:text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-md shadow-amber-950/40"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Preview Efek Transisi</span>
                </button>
              </div>

              {/* Grid of Transition Effects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'cross_dissolve',
                    name: 'Cross Dissolve',
                    subtitle: 'Smooth S-Curve Blend',
                    badge: 'Elegan & Alami',
                    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                    desc: 'Pergantian visual halus dengan kurva S-Curve sinematik. Sangat seimbang dan nyaman untuk tur properti elegan.',
                    icon: Layers,
                  },
                  {
                    id: 'light_leak',
                    name: 'Cinematic Light Leak',
                    subtitle: 'Luxury Anamorphic Film Burn',
                    badge: 'Direkomendasikan (VIP)',
                    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                    desc: 'Bias kilatan cahaya matahari emas menyapu lensa seperti kamera film 35mm. Memberikan aura hunian mewah & prestisius.',
                    icon: Flame,
                  },
                  {
                    id: 'smooth_zoom',
                    name: 'Smooth Zoom Through',
                    subtitle: 'Architectural Fly-Through',
                    badge: 'Viral Reels & TikTok',
                    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
                    desc: 'Kamera meluncur dinamis menembus frame langsung masuk ke ruangan berikutnya layaknya drone FPV atau gimbal pro.',
                    icon: Zap,
                  },
                  {
                    id: 'film_blur',
                    name: 'Defocus Film Blur',
                    subtitle: 'Cinema Rack-Focus Bokeh',
                    badge: 'Artistik & Cozy',
                    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                    desc: 'Defocus blur optik lembut yang mengalihkan perhatian penonton ke sudut ruangan baru secara artistik.',
                    icon: Wand2,
                  },
                  {
                    id: 'whip_pan',
                    name: 'Dynamic Whip Pan',
                    subtitle: 'High-Speed Steadicam Whip',
                    badge: 'Enerjik & Cepat',
                    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
                    desc: 'Sapuan horizontal kilat berenergi tinggi dengan tarikan motion blur modern, cocok untuk video promo hook cepat.',
                    icon: Film,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = settings.transitionEffect === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSettings({ ...settings, transitionEffect: item.id as any });
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-500/15 via-slate-900 to-amber-950/20 border-amber-400 shadow-lg shadow-amber-500/10'
                          : 'bg-slate-900/90 border-slate-700/80 hover:border-slate-500 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-slate-800 text-amber-400 group-hover:bg-slate-700'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {item.subtitle}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>

                      {isSelected && (
                        <div className="mt-2.5 pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px]">
                          <span className="text-amber-300 font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-amber-400" />
                            Transisi Sedang Digunakan
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewTransition();
                            }}
                            className="text-amber-400 hover:underline font-bold cursor-pointer"
                          >
                            Putar Efek Transisi →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Transition Duration / Speed Controls */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200">
                    Durasi / Kecepatan Transisi Antar Adegan:
                  </span>
                  <span className="text-amber-400 font-bold font-mono">
                    {settings.transitionDuration || 0.75} Detik
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 0.5, label: '0.5s (Cepat & Ringkas)' },
                    { val: 0.75, label: '0.75s (Standar Sinematik)' },
                    { val: 1.0, label: '1.0s (Dramatis Slow)' },
                  ].map((speed) => (
                    <button
                      key={speed.val}
                      type="button"
                      onClick={() =>
                        setSettings({ ...settings, transitionDuration: speed.val })
                      }
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        (settings.transitionDuration || 0.75) === speed.val
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {speed.label}
                    </button>
                  ))}
                </div>

                <input
                  type="range"
                  min="0.3"
                  max="1.4"
                  step="0.05"
                  value={settings.transitionDuration || 0.75}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      transitionDuration: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Architectural Video Tip */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Tips Videografer Properti Pro:</strong> Untuk video listing rumah mewah & villa, gunakan <em>Cinematic Light Leak</em> dengan durasi 0.75s untuk menonjolkan bias cahaya matahari alami di ruang tamu dan taman.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: MUSIK & AUDIO MIXER */}
          {activeTab === 'audio' && (
            <div className="space-y-5 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 animate-in fade-in duration-150">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Music className="w-4 h-4 text-amber-400" />
                  Pilihan Backsound Musik Promosi Properti
                </h3>
                <p className="text-xs text-slate-400">
                  Semua musik 100% bebas hak cipta, aman untuk iklan komersial di Instagram, TikTok & Facebook.
                </p>
              </div>

              {/* BGM Track Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'luxury_lofi', label: 'Luxury Lo-Fi', desc: 'Chill & Berkelas' },
                  { id: 'chill_piano', label: 'Acoustic Piano', desc: 'Elegan & Hangat' },
                  { id: 'modern_beats', label: 'Modern Upbeat', desc: 'Enerjik & Ceria' },
                  { id: 'ambient_corporate', label: 'Ambient Soft', desc: 'Tenang & Bersih' },
                ].map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      setSettings({ ...settings, bgmTrack: track.id as any });
                      if (isPlaying) {
                        soundEngine.startBgm(track.id);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      settings.bgmTrack === track.id
                        ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-xs font-bold block">{track.label}</span>
                    <span className="text-[10px] text-slate-400">{track.desc}</span>
                  </button>
                ))}
              </div>

              {/* Volume Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-300">Volume Musik Backsound:</span>
                    <span className="text-amber-400">{Math.round(settings.bgmVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.bgmVolume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setSettings({ ...settings, bgmVolume: val });
                      soundEngine.setVolumes(val, settings.voiceVolume);
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-300">Volume Suara Narator:</span>
                    <span className="text-emerald-400">{Math.round(settings.voiceVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.voiceVolume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setSettings({ ...settings, voiceVolume: val });
                      soundEngine.setVolumes(settings.bgmVolume, val);
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOGO & WATERMARK AGENCY */}
          {activeTab === 'branding' && (
            <div className="space-y-5 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    Pengaturan Logo Agency & Watermark
                  </h3>
                  <p className="text-xs text-slate-400">
                    Atur posisi dan ukuran logo kantor agency Anda di sudut video.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
                >
                  Ganti File Logo →
                </button>
              </div>

              {/* Watermark Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-700">
                <span className="text-xs font-semibold text-slate-200">
                  Tampilkan Branding Logo Agency di Video
                </span>
                <input
                  type="checkbox"
                  checked={settings.watermarkEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, watermarkEnabled: e.target.checked })
                  }
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Logo Position Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Posisi Logo di Layar
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'top_right', label: 'Kanan Atas (Rekomendasi)' },
                    { id: 'top_left', label: 'Kiri Atas' },
                    { id: 'bottom_right', label: 'Kanan Bawah' },
                    { id: 'bottom_left', label: 'Kiri Bawah' },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() =>
                        setSettings({ ...settings, logoPosition: pos.id as any })
                      }
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        settings.logoPosition === pos.id
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo Scale Slider */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Ukuran / Skala Logo Watermark:</span>
                  <span className="text-amber-400">{settings.logoScale.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.4"
                  step="0.1"
                  value={settings.logoScale}
                  onChange={(e) =>
                    setSettings({ ...settings, logoScale: parseFloat(e.target.value) })
                  }
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 4: SUBTITLE & VISUAL FILTER */}
          {activeTab === 'captions' && (
            <div className="space-y-5 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 animate-in fade-in duration-150">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  Gaya Subtitle Karaoke & Filter Visual Foto
                </h3>
                <p className="text-xs text-slate-400">
                  Subtitle bergaya TikTok & Reels membantu video ditonton sampai selesai walau tanpa suara.
                </p>
              </div>

              {/* Caption Theme */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Warna Highlight Subtitle (Karaoke Style)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'tiktok_yellow', label: 'Kuning Neon TikTok', color: '#facc15' },
                    { id: 'luxury_gold', label: 'Emas Mewah Gold', color: '#fbbf24' },
                    { id: 'cyan_modern', label: 'Cyan Biru Modern', color: '#38bdf8' },
                    { id: 'minimal_white', label: 'Putih Minimalis', color: '#ffffff' },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() =>
                        setSettings({ ...settings, captionTheme: theme.id as any })
                      }
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        settings.captionTheme === theme.id
                          ? 'bg-slate-800 border-amber-400 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: theme.color }}
                      />
                      <span>{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Tone Warna Filter Foto Visual
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'luxury_warm', label: 'Luxury Warm Gold' },
                    { id: 'cinematic_vibrant', label: 'Cinematic Vibrant' },
                    { id: 'bright_modern', label: 'Bright Modern' },
                    { id: 'none', label: 'Asli (No Filter)' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() =>
                        setSettings({ ...settings, visualFilter: filter.id as any })
                      }
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        settings.visualFilter === filter.id
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Badges Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-700">
                <span className="text-xs font-semibold text-slate-200">
                  Tampilkan Badge Spesifikasi (LT, LB, KT, KM, SHM)
                </span>
                <input
                  type="checkbox"
                  checked={settings.showBadges}
                  onChange={(e) =>
                    setSettings({ ...settings, showBadges: e.target.checked })
                  }
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Final Action Bar with Download Button & WhatsApp Share */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Video Sudah Siap Diunduh!
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Format siap posting di WhatsApp Status, Reels, TikTok, dan Facebook.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Video Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EXPORTING PROGRESS MODAL */}
      {isExporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-500 flex items-center justify-center shadow-xl shadow-amber-500/20 animate-pulse">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Sedang Meng-encode Video Promosi...
            </h3>
            <p className="text-xs text-slate-400">{exportStatusText}</p>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 h-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 block">
              {exportProgress}%
            </span>
          </div>
        </div>
      )}

      {/* DOWNLOAD SUCCESS MODAL WITH WA CTA */}
      {downloadSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center shadow-2xl space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-xl shadow-emerald-500/20">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-['Outfit'] text-white">
                Video Berhasil Diunduh! 🎉
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                File video tersimpan di perangkat Anda. Siap diposting ke Status WhatsApp, TikTok, Instagram Reels, dan Facebook!
              </p>
            </div>

            {/* Next Step Advice */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-left text-xs space-y-2">
              <span className="font-bold text-amber-400 block">💡 Tips Closing Cepat Agen Properti:</span>
              <p className="text-slate-300">
                1. Pasang di Status WhatsApp dengan caption harga dan tautan chat Anda.
              </p>
              <p className="text-slate-300">
                2. Posting di Reels & TikTok menggunakan hashtag lokasi (misal: #RumahBintaro #PropertiJaksel).
              </p>
            </div>

            {/* Direct WhatsApp CTA to 089673686625 */}
            <div className="space-y-3 pt-2">
              <a
                href={waShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasi / Hubungi WhatsApp: 0896-7368-6625</span>
              </a>

              <button
                type="button"
                onClick={() => setDownloadSuccessModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup & Lanjutkan Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
