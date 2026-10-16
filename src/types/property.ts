export interface AgentProfile {
  name: string;
  whatsapp: string;
  agencyName: string;
  agencyLogoUrl: string; // base64 or URL
  agentPhotoUrl?: string;
  isRegistered: boolean;
}

export type VideoDuration = 15 | 30 | 60;
export type AspectRatioType = '9:16' | '1:1' | '16:9';
export type NarrationTone = 'luxurious' | 'urgency_promo' | 'warm_family' | 'modern_investor';
export type VideoPlatform = 'wa_status' | 'reels_tiktok' | 'facebook_feed';

export interface PropertyPhoto {
  id: string;
  type: 'exterior' | 'interior' | 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'other';
  label: string;
  dataUrl: string;
}

export interface PropertyFormData {
  title: string;
  propertyType: string;
  location: string;
  price: string;
  landArea: string; // m2
  buildingArea: string; // m2
  bedrooms: string;
  bathrooms: string;
  carports: string;
  certificate: string;
  features: string;
  specialPromo: string;
  customDescription: string;
  duration: VideoDuration;
  aspectRatio: AspectRatioType;
  tone: NarrationTone;
  platform: VideoPlatform;
  voiceName: string; // Kore, Zephyr, Puck, Fenrir, etc.
  photos: PropertyPhoto[];
}

export interface VideoScene {
  sceneIndex: number;
  photoTarget: string; // exterior, interior, etc.
  photoIndex?: number;
  startSec: number;
  endSec: number;
  spokenText: string;
  screenTitle: string;
  screenBadge: string;
  motionStyle: 'pan-right' | 'zoom-in' | 'zoom-out' | 'tilt-up' | 'dramatic-zoom' | string;
}

export interface GeneratedVideoScript {
  catchyHeadline: string;
  fullScript: string;
  closingCtaText: string;
  highlightBadges: string[];
  scenes: VideoScene[];
}

export interface VideoEditorSettings {
  aspectRatio: AspectRatioType;
  duration: VideoDuration;
  bgmTrack: 'luxury_lofi' | 'modern_beats' | 'chill_piano' | 'ambient_corporate' | 'none';
  bgmVolume: number; // 0 to 1
  voiceVolume: number; // 0 to 1
  logoPosition: 'top_right' | 'top_left' | 'bottom_right' | 'bottom_left';
  logoScale: number; // 0.6 to 1.4
  showBadges: boolean;
  captionTheme: 'tiktok_yellow' | 'luxury_gold' | 'minimal_white' | 'cyan_modern';
  captionFontSize: number;
  visualFilter: 'none' | 'luxury_warm' | 'cinematic_vibrant' | 'bright_modern';
  watermarkEnabled: boolean;
}

export interface TokenState {
  remainingTokens: number;
  totalUsed: number;
  isUnlimitedVip: boolean;
}
