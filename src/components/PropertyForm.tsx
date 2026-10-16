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
} from 'lucide-react';

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

  // Upload Photo File
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, targetType: 'exterior' | 'interior') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const newPhoto: PropertyPhoto = {
            id: `photo_${Date.now()}_${index}`,
            type: targetType === 'exterior' ? 'exterior' : 'interior',
            label: targetType === 'exterior' ? 'Foto Luar (Eksterior)' : `Foto Dalam (Interior #${formData.photos.length + 1})`,
            dataUrl: reader.result,
          };
          onChange({
            ...formData,
            photos: [...formData.photos, newPhoto],
          });
          setPhotoError(null);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove photo
  const handleRemovePhoto = (id: string) => {
    onChange({
      ...formData,
      photos: formData.photos.filter((p) => p.id !== id),
    });
  };

  // Change photo type label
  const handleChangePhotoType = (id: string, newType: any, newLabel: string) => {
    onChange({
      ...formData,
      photos: formData.photos.map((p) =>
        p.id === id ? { ...p, type: newType, label: newLabel } : p
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

  const exteriorPhotos = formData.photos.filter((p) => p.type === 'exterior');
  const interiorPhotos = formData.photos.filter((p) => p.type !== 'exterior');

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
        {/* SECTION 1: PHOTO UPLOADER (FOTO LUAR & FOTO DALAM) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              Materi Foto Properti (Foto Luar & Foto Dalam)
            </label>
            <span className="text-xs text-slate-400">
              {formData.photos.length} Foto Dimuat
            </span>
          </div>

          {photoError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{photoError}</span>
            </div>
          )}

          {/* Upload Dropzones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Foto Luar Upload Button */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-dashed border-amber-500/40 hover:border-amber-400 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5" /> FOTO LUAR (Eksterior / Tampak Depan)
                </span>
                <span className="text-[11px] text-slate-400">{exteriorPhotos.length} foto</span>
              </div>
              <label className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700 hover:border-amber-500/50 cursor-pointer transition-all">
                <Upload className="w-6 h-6 text-amber-400 mb-1.5" />
                <span className="text-xs font-semibold text-white">Upload Foto Luar</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Tampak depan, fasad, carport</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, 'exterior')}
                  className="hidden"
                />
              </label>
            </div>

            {/* Foto Dalam Upload Button */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-dashed border-sky-500/40 hover:border-sky-400 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> FOTO DALAM (Interior / Ruangan)
                </span>
                <span className="text-[11px] text-slate-400">{interiorPhotos.length} foto</span>
              </div>
              <label className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700 hover:border-sky-500/50 cursor-pointer transition-all">
                <Upload className="w-6 h-6 text-sky-400 mb-1.5" />
                <span className="text-xs font-semibold text-white">Upload Foto Dalam</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Ruang tamu, kamar tidur, dapur</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, 'interior')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          {formData.photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {formData.photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shadow-md aspect-video sm:aspect-square flex flex-col justify-end"
                >
                  <img
                    src={photo.dataUrl}
                    alt={photo.label}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Top Badge: Photo Index & Type */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-bold text-white border border-slate-700">
                      #{index + 1}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        photo.type === 'exterior'
                          ? 'bg-amber-500/90 text-slate-950'
                          : 'bg-sky-500/90 text-slate-950'
                      }`}
                    >
                      {photo.type === 'exterior' ? 'Luar' : 'Dalam'}
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Label Selector */}
                  <div className="relative p-2 z-10">
                    <select
                      value={photo.type}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        const labelText =
                          val === 'exterior'
                            ? 'Foto Luar (Eksterior)'
                            : val === 'living'
                            ? 'Foto Ruang Tamu'
                            : val === 'bedroom'
                            ? 'Foto Kamar Tidur'
                            : val === 'kitchen'
                            ? 'Foto Dapur'
                            : 'Foto Dalam (Interior)';
                        handleChangePhotoType(photo.id, val, labelText);
                      }}
                      className="w-full text-[11px] bg-slate-900/90 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value="exterior">Tampak Luar</option>
                      <option value="living">Ruang Tamu</option>
                      <option value="bedroom">Kamar Tidur</option>
                      <option value="kitchen">Dapur</option>
                      <option value="interior">Interior Lain</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
