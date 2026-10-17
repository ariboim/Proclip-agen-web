import React, { useState } from 'react';
import {
  PropertyFormData,
  PropertyPhoto,
  VideoDuration,
  AspectRatioType,
  NarrationTone,
  VideoPlatform,
  AgentProfile,
  TokenState,
} from '../types/property';
import { SAMPLE_PROPERTIES, getDefaultPhotos } from '../utils/sampleData';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Home,
  MapPin,
  Tag,
  Maximize2,
  Trash2,
  Clock,
  Smartphone,
  Layers,
  Mic,
  Plus,
  AlertCircle,
  CheckCircle,
  Sofa,
  BedDouble,
  UtensilsCrossed,
  Bath,
  Trees,
  Eye,
  X,
  LayoutGrid,
  Check,
} from 'lucide-react';

export type RoomType = 'exterior' | 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'other';

export interface RoomOption {
  id: RoomType;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
  color: string;
  activeBg: string;
  badgeClass: string;
  borderColor: string;
  defaultLabel: string;
}

export const ROOM_OPTIONS: RoomOption[] = [
  {
    id: 'exterior',
    label: 'Tampak Luar & Fasad',
    shortLabel: 'Tampak Luar',
    icon: Home,
    hint: 'Tampak depan rumah, fasad arsitektur, carport & jalanan',
    color: 'text-amber-400',
    activeBg: 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-amber-500/20',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    defaultLabel: 'Foto Luar (Tampak Depan Fasad)',
  },
  {
    id: 'living',
    label: 'Ruang Tamu & Keluarga',
    shortLabel: 'Ruang Tamu',
    icon: Sofa,
    hint: 'Living room utama, void plafon tinggi, area sofa santai & TV',
    color: 'text-sky-400',
    activeBg: 'bg-sky-500/20 text-sky-300 border-sky-400 shadow-sky-500/20',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    borderColor: 'border-sky-500/40 hover:border-sky-400',
    defaultLabel: 'Foto Ruang Tamu & Keluarga',
  },
  {
    id: 'bedroom',
    label: 'Kamar Tidur (Master & Anak)',
    shortLabel: 'Kamar Tidur',
    icon: BedDouble,
    hint: 'Master bedroom, tempat tidur nyaman, pencahayaan alami & lemari',
    color: 'text-indigo-400',
    activeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400 shadow-indigo-500/20',
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    borderColor: 'border-indigo-500/40 hover:border-indigo-400',
    defaultLabel: 'Foto Kamar Tidur',
  },
  {
    id: 'kitchen',
    label: 'Dapur & Ruang Makan',
    shortLabel: 'Dapur & Makan',
    icon: UtensilsCrossed,
    hint: 'Kitchen set modern, meja makan keluarga, minibar & island marmer',
    color: 'text-emerald-400',
    activeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-emerald-500/20',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    defaultLabel: 'Foto Dapur & Ruang Makan',
  },
  {
    id: 'bathroom',
    label: 'Kamar Mandi',
    shortLabel: 'Kamar Mandi',
    icon: Bath,
    hint: 'Sanitary mewah, shower box, wastafel marmer & water heater',
    color: 'text-cyan-400',
    activeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-cyan-500/20',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    borderColor: 'border-cyan-500/40 hover:border-cyan-400',
    defaultLabel: 'Foto Kamar Mandi',
  },
  {
    id: 'other',
    label: 'Taman, Balkon & Fasilitas',
    shortLabel: 'Taman & Balkon',
    icon: Trees,
    hint: 'Taman belakang asri, balkon view, rooftop, kolam renang atau area cuci',
    color: 'text-rose-400',
    activeBg: 'bg-rose-500/20 text-rose-300 border-rose-400 shadow-rose-500/20',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    borderColor: 'border-rose-500/40 hover:border-rose-400',
    defaultLabel: 'Foto Taman / Balkon / Fasilitas',
  },
];

interface PropertyFormProps {
  formData: PropertyFormData;
  onChange: (data: PropertyFormData) => void;
  onSubmit: () => void;
  isLoading: boolean;
  loadingStep: string;
  agent: AgentProfile;
  tokens: TokenState;
  onOpenUpgrade: () => void;
  onOpenProfile: () => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading,
  loadingStep,
  agent,
  tokens,
  onOpenUpgrade,
  onOpenProfile,
}) => {
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [activeRoomTab, setActiveRoomTab] = useState<'all' | RoomType>('all');
  const [previewPhoto, setPreviewPhoto] = useState<PropertyPhoto | null>(null);

  // Quick Preset Sample Property
  const handleLoadSample = (sampleIndex: number) => {
    const sample = SAMPLE_PROPERTIES[sampleIndex];
    const defaultPhotos = getDefaultPhotos();
    onChange({
      ...sample,
      photos: defaultPhotos,
    });
    setPhotoError(null);
  };

  // Upload Photo File directly to specific room
  const handleUploadToRoom = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetRoom: RoomType
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const roomConfig = ROOM_OPTIONS.find((r) => r.id === targetRoom);
    const roomTitle = roomConfig ? roomConfig.shortLabel : 'Ruangan';

    const fileList = Array.from(files);
    let processed = 0;
    const newPhotos: PropertyPhoto[] = [];

    fileList.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          newPhotos.push({
            id: `photo_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 6)}`,
            type: targetRoom,
            label: `Foto ${roomTitle} #${formData.photos.filter((p) => p.type === targetRoom).length + newPhotos.length + 1}`,
            dataUrl: reader.result,
          });
        }
        processed++;
        if (processed === fileList.length) {
          onChange({
            ...formData,
            photos: [...formData.photos, ...newPhotos],
          });
          setPhotoError(null);
        }
      };
      reader.readAsDataURL(file);
    });
    // Reset file input value so user can upload identical file names if needed
    e.target.value = '';
  };

  // Remove photo
  const handleRemovePhoto = (id: string) => {
    onChange({
      ...formData,
      photos: formData.photos.filter((p) => p.id !== id),
    });
  };

  // Instant 1-Click switch photo room (NO DROPDOWN)
  const handleSwitchPhotoRoom = (id: string, newRoomType: RoomType) => {
    const roomConfig = ROOM_OPTIONS.find((r) => r.id === newRoomType);
    const label = roomConfig ? roomConfig.defaultLabel : 'Foto Properti';
    onChange({
      ...formData,
      photos: formData.photos.map((p) =>
        p.id === id ? { ...p, type: newRoomType, label } : p
      ),
    });
  };

  // Check validity before submitting
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.photos.length < 2) {
      setPhotoError('Mohon sertakan minimal 2 foto (Foto Luar & Foto Dalam) agar video memiliki transisi menarik.');
      return;
    }
    if (!tokens.isUnlimitedVip && tokens.remainingTokens <= 0) {
      onOpenUpgrade();
      return;
    }
    setPhotoError(null);
    onSubmit();
  };

  // Helper count per room
  const getRoomPhotoCount = (roomType: RoomType) => {
    return formData.photos.filter((p) => p.type === roomType).length;
  };

  // Photos to display based on active room tab
  const displayedPhotos =
    activeRoomTab === 'all'
      ? formData.photos
      : formData.photos.filter((p) => p.type === activeRoomTab);

  const activeRoomConfig = ROOM_OPTIONS.find((r) => r.id === activeRoomTab);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-slate-100">
      {/* Header bar with quick demo load */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Langkah 2: Materi & Spesifikasi Video
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white">
            Input Foto & Spesifikasi Listing Properti
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            AI kami akan meracik naskah narasi realistis Indonesia yang luwes (tidak kaku) dan menyinkronkannya dengan foto-foto Anda.
          </p>
        </div>

        {/* Quick Demo Sample Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden lg:inline">Contoh Cepat:</span>
          <button
            type="button"
            onClick={() => handleLoadSample(0)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            Rumah Bintaro
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample(1)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            Villa Bandung
          </button>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* SECTION 1: PHOTO UPLOADER PER PILIHAN RUANGAN */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                Upload Foto Berdasarkan Ruangan
              </label>
              <p className="text-xs text-slate-400 mt-0.5">
                Setiap pilihan ruangan memiliki tombol upload langsung. Pilih tab ruangan untuk fokus upload atau gunakan mode grid.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-amber-300">
                Total: {formData.photos.length} Foto Dimuat
              </span>
            </div>
          </div>

          {photoError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{photoError}</span>
            </div>
          )}

          {/* INTERACTIVE ROOM SWITCH BUTTONS (TAB PILIHAN RUANGAN) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Pilih Ruangan untuk Upload / Filter:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {/* All Rooms Tab Button */}
              <button
                type="button"
                onClick={() => setActiveRoomTab('all')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  activeRoomTab === 'all'
                    ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Semua Ruangan</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-900 text-[10px] text-slate-300 border border-slate-700">
                  {formData.photos.length}
                </span>
              </button>

              {/* Room Specific Tab Buttons */}
              {ROOM_OPTIONS.map((room) => {
                const IconComponent = room.icon;
                const count = getRoomPhotoCount(room.id);
                const isActive = activeRoomTab === room.id;
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setActiveRoomTab(room.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isActive
                        ? `${room.activeBg} border-2 scale-105 shadow-md`
                        : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isActive ? '' : room.color}`} />
                    <span>{room.shortLabel}</span>
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        count > 0
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : 'bg-slate-900 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DEDICATED UPLOAD MODE VIEW */}
          {activeRoomTab !== 'all' && activeRoomConfig && (
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900 border-2 border-dashed border-amber-500/50 shadow-xl transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-slate-900/90 border border-slate-700 ${activeRoomConfig.color}`}>
                    <activeRoomConfig.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white font-['Outfit']">
                        Mode Upload: {activeRoomConfig.label}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold border border-amber-400/30">
                        {getRoomPhotoCount(activeRoomConfig.id)} Foto
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {activeRoomConfig.hint}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 cursor-pointer transition-transform hover:scale-105">
                    <Upload className="w-4 h-4 stroke-[2.5]" />
                    <span>Upload Foto {activeRoomConfig.shortLabel}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleUploadToRoom(e, activeRoomConfig.id)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Fast Drag & Drop Zone */}
              <label className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-700/80 hover:border-amber-400/60 cursor-pointer transition-all text-center group">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-amber-400" />
                </div>
                <span className="text-xs font-bold text-white">
                  Klik untuk Jelajahi File atau Drag & Drop Foto {activeRoomConfig.shortLabel} di Sini
                </span>
                <span className="text-[11px] text-slate-400 mt-1 max-w-md">
                  Mendukung JPG, PNG, WEBP. Anda dapat memilih beberapa foto sekaligus untuk ruangan ini.
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleUploadToRoom(e, activeRoomConfig.id)}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* ALL ROOMS GRID UPLOAD MODE (Setiap Ruangan Memiliki Kotak Upload Langsung) */}
          {activeRoomTab === 'all' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ROOM_OPTIONS.map((room) => {
                const IconComponent = room.icon;
                const count = getRoomPhotoCount(room.id);
                return (
                  <div
                    key={room.id}
                    className="p-4 rounded-2xl bg-slate-800/60 border border-dashed border-slate-700 hover:border-amber-500/50 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold flex items-center gap-1.5 ${room.color}`}>
                          <IconComponent className="w-4 h-4" />
                          {room.label}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            count > 0
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : 'bg-slate-900 text-slate-400'
                          }`}
                        >
                          {count} foto
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-3 line-clamp-2">
                        {room.hint}
                      </p>
                    </div>

                    <label className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-700 hover:border-amber-400 text-white text-xs font-semibold cursor-pointer transition-all group">
                      <Upload className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
                      <span>Upload {room.shortLabel}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleUploadToRoom(e, room.id)}
                        className="hidden"
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          {/* PHOTO GALLERY GRID WITH 1-CLICK INSTANT ROOM SWITCHER (NO DROPDOWN) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                {activeRoomTab === 'all'
                  ? `Semua Foto Properti (${formData.photos.length})`
                  : `Foto Ruangan ${activeRoomConfig?.label} (${displayedPhotos.length})`}
              </span>
              {activeRoomTab !== 'all' && (
                <button
                  type="button"
                  onClick={() => setActiveRoomTab('all')}
                  className="text-xs text-amber-400 hover:underline cursor-pointer"
                >
                  Tampilkan Semua Ruangan →
                </button>
              )}
            </div>

            {displayedPhotos.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800 text-center">
                <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-400">
                  {activeRoomTab === 'all'
                    ? 'Belum ada foto yang diupload.'
                    : `Belum ada foto untuk ${activeRoomConfig?.label}.`}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Gunakan tombol upload di atas untuk menambahkan foto ruangan ini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedPhotos.map((photo, index) => {
                  const currentRoom = ROOM_OPTIONS.find((r) => r.id === photo.type) || ROOM_OPTIONS[0];
                  const Icon = currentRoom.icon;
                  return (
                    <div
                      key={photo.id}
                      className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 hover:border-slate-500 shadow-md flex flex-col justify-between transition-all"
                    >
                      {/* Image Thumbnail Container */}
                      <div className="relative aspect-video sm:aspect-square overflow-hidden bg-slate-900">
                        <img
                          src={photo.dataUrl}
                          alt={photo.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                          <span className="px-2 py-0.5 rounded-md bg-slate-950/90 text-[10px] font-bold text-white border border-slate-700">
                            #{index + 1}
                          </span>
                          <span
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${currentRoom.badgeClass}`}
                          >
                            <Icon className="w-3 h-3" />
                            {currentRoom.shortLabel}
                          </span>
                        </div>

                        {/* Action Buttons on Image */}
                        <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                          <button
                            type="button"
                            onClick={() => setPreviewPhoto(photo)}
                            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                            title="Perbesar Foto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="p-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                            title="Hapus Foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* 1-CLICK INSTANT ROOM SWITCHER BUTTONS (NO DROPDOWN!) */}
                      <div className="p-2.5 bg-slate-900/95 border-t border-slate-800 space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                          <span>Pindah Ruangan:</span>
                          <span className="text-amber-400 font-semibold">{currentRoom.shortLabel}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {ROOM_OPTIONS.map((r) => {
                            const isCurrent = photo.type === r.id;
                            const RIcon = r.icon;
                            return (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => handleSwitchPhotoRoom(photo.id, r.id)}
                                title={`Pindahkan foto ini ke ${r.label}`}
                                className={`flex items-center justify-center gap-1 px-1.5 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                                  isCurrent
                                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm'
                                    : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 border-slate-700 hover:text-white'
                                }`}
                              >
                                <RIcon className="w-2.5 h-2.5 flex-shrink-0" />
                                <span className="truncate">{r.shortLabel}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* FULL IMAGE PREVIEW MODAL */}
        {previewPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-4 flex items-center justify-between border-b border-slate-800">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  {previewPhoto.label}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewPhoto(null)}
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[75vh] overflow-hidden">
                <img
                  src={previewPhoto.dataUrl}
                  alt={previewPhoto.label}
                  className="max-h-[70vh] w-auto object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: PROPERTI SPESIFIKASI (LT, LB, KT, KM, HARGA, LOKASI) */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            Spesifikasi & Detail Properti
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Judul Properti */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Judul Promosi Properti <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => onChange({ ...formData, title: e.target.value })}
                placeholder="Contoh: Rumah Mewah Scandinavian 2 Lantai Siap Huni"
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>

            {/* Tipe Properti */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tipe / Jenis Properti
              </label>
              <input
                type="text"
                value={formData.propertyType}
                onChange={(e) => onChange({ ...formData, propertyType: e.target.value })}
                placeholder="Rumah Tapak / Villa / Ruko / Apartemen"
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>

            {/* Lokasi Strategis */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Lokasi & Akses Strategis <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => onChange({ ...formData, location: e.target.value })}
                  placeholder="Contoh: Bintaro Sektor 9, Tangerang Selatan (5 Menit ke Gerbang Tol)"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>
            </div>

            {/* Harga */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Harga Jual / Sewa <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => onChange({ ...formData, price: e.target.value })}
                placeholder="Contoh: Rp 1.850.000.000 (Nego)"
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 text-sm font-semibold text-amber-300"
              />
            </div>

            {/* Luas Tanah & Luas Bangunan */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Luas Tanah (LT)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.landArea}
                    onChange={(e) => onChange({ ...formData, landArea: e.target.value })}
                    placeholder="120"
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">m²</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Luas Bangunan (LB)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.buildingArea}
                    onChange={(e) => onChange({ ...formData, buildingArea: e.target.value })}
                    placeholder="145"
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">m²</span>
                </div>
              </div>
            </div>

            {/* Kamar Tidur & Kamar Mandi */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kamar Tidur (KT)
                </label>
                <input
                  type="text"
                  value={formData.bedrooms}
                  onChange={(e) => onChange({ ...formData, bedrooms: e.target.value })}
                  placeholder="4 KT"
                  className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kamar Mandi (KM)
                </label>
                <input
                  type="text"
                  value={formData.bathrooms}
                  onChange={(e) => onChange({ ...formData, bathrooms: e.target.value })}
                  placeholder="3 KM"
                  className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>
            </div>

            {/* Carport & Sertifikat */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Carport / Garasi
                </label>
                <input
                  type="text"
                  value={formData.carports}
                  onChange={(e) => onChange({ ...formData, carports: e.target.value })}
                  placeholder="2 Mobil"
                  className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Legalitas
                </label>
                <input
                  type="text"
                  value={formData.certificate}
                  onChange={(e) => onChange({ ...formData, certificate: e.target.value })}
                  placeholder="SHM + IMB"
                  className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>
            </div>

            {/* Fasilitas Unggulan */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Fasilitas & USP Listing
              </label>
              <input
                type="text"
                value={formData.features}
                onChange={(e) => onChange({ ...formData, features: e.target.value })}
                placeholder="Contoh: One Gate System, Security 24 Jam, Bebas Banjir, Dekat Sekolah Favorit"
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm"
              />
            </div>

            {/* Promo Khusus */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Promo Khusus / Bonus
              </label>
              <input
                type="text"
                value={formData.specialPromo}
                onChange={(e) => onChange({ ...formData, specialPromo: e.target.value })}
                placeholder="Contoh: Free BPHTB & Biaya KPR, Bonus Kitchen Set"
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm"
              />
            </div>
          </div>

          {/* Deskripsi Bebas / Catatan Khusus */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Deskripsi Bebas / Selling Point Tambahan (Bahan Naskah AI)
            </label>
            <textarea
              rows={2}
              value={formData.customDescription}
              onChange={(e) => onChange({ ...formData, customDescription: e.target.value })}
              placeholder="Tuliskan keunikan rumah, alasan harus beli sekarang, suasana lingkungan yang asri, atau pencahayaan alami..."
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm"
            />
          </div>
        </div>

        {/* SECTION 3: DURASI, FORMAT PLATFORM & GAYA NARASI */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Pengaturan Durasi, Format & Tone Narasi AI
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Durasi Pilihan */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Pilih Durasi Video
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([15, 30, 60] as VideoDuration[]).map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => onChange({ ...formData, duration: dur })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      formData.duration === dur
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {dur} Detik
                    <span className="block text-[10px] font-normal opacity-80">
                      {dur === 15 ? 'Status WA' : dur === 30 ? 'Reels/TikTok' : 'Full Tour'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspek Rasio & Platform */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Aspek Rasio & Platform
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['9:16', '1:1', '16:9'] as AspectRatioType[]).map((aspect) => (
                  <button
                    key={aspect}
                    type="button"
                    onClick={() => onChange({ ...formData, aspectRatio: aspect })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      formData.aspectRatio === aspect
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {aspect}
                    <span className="block text-[10px] font-normal opacity-80">
                      {aspect === '9:16' ? 'Vertikal' : aspect === '1:1' ? 'Kotak Feed' : 'Landscape'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gaya Tone Narasi */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Gaya Narasi AI (Tidak Kaku)
              </label>
              <select
                value={formData.tone}
                onChange={(e) => onChange({ ...formData, tone: e.target.value as NarrationTone })}
                className="w-full py-2.5 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-medium focus:ring-2 focus:ring-amber-500"
              >
                <option value="luxurious">Mewah & Prestisius (Bahasa Berkelas)</option>
                <option value="urgency_promo">Promo & Diskon Terbatas (Rebutan)</option>
                <option value="warm_family">Hangat & Ramah Keluarga (Impian)</option>
                <option value="modern_investor">Investor & Capital Gain (Cuan)</option>
              </select>
            </div>
          </div>

          {/* Voice Actor Selection */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Pilihan Karakter Suara AI Narator:</span>
                <span className="text-[11px] text-slate-400">Intonasi bahasa Indonesia natural, fasih, dan meyakinkan</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[
                { name: 'Kore', label: 'Citra (Wanita Elegan)' },
                { name: 'Fenrir', label: 'Dimas (Pria Berwibawa)' },
                { name: 'Puck', label: 'Rani (Ceria & Ramah)' },
                { name: 'Zephyr', label: 'Bayu (Enerjik Hangat)' },
              ].map((v) => (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => onChange({ ...formData, voiceName: v.name })}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    formData.voiceName === v.name
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON WITH TOKEN COST */}
        <div className="pt-4 border-t border-slate-800">
          {tokens.isBlocked && (
            <div className="mb-4 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
                <span>
                  <strong>Akun Anda Sedang Ditangguhkan:</strong> Pembuatan video dinonaktifkan oleh Admin. Silakan hubungi CS untuk verifikasi akun.
                </span>
              </div>
              <a
                href="https://wa.me/6289673686625?text=Halo%20Admin%2C%20akun%20saya%20terblokir%20di%20PropertiClip%20AI%2C%20mohon%20bantuannya."
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs whitespace-nowrap"
              >
                Hubungi Admin (0896-7368-6625)
              </a>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Biaya pembuatan: <span className="font-bold text-amber-400">1 Token</span>{' '}
              {tokens.isUnlimitedVip ? (
                <span className="text-emerald-400 font-semibold">(VIP Unlimited Aktif)</span>
              ) : (
                <span>(Sisa: {tokens.remainingTokens} Token Demo)</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || tokens.isBlocked}
              className={`py-4 px-8 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                tokens.isBlocked
                  ? 'bg-rose-950/50 text-rose-400 border border-rose-500/40 cursor-not-allowed'
                  : isLoading
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-amber-500/25 hover:scale-[1.02]'
              }`}
            >
              {tokens.isBlocked ? (
                <span>Akun Ditangguhkan (Hubungi Admin)</span>
              ) : isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{loadingStep || 'AI Sedang Meracik Video...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-200" />
                  <span>Buat Video Promosi Properti Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
