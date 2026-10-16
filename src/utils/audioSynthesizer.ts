/**
 * Audio Synthesizer & Sound Engine for Real Estate Video Generator
 * - Procedural BGM music generator using Web Audio API (Luxury Lo-Fi, Modern Beats, Chill Piano, Ambient)
 * - Automatic Audio Ducking (lowers BGM during narration so voice is crystal-clear)
 * - Mixed Audio Destination Node for Canvas MediaRecorder Export
 * - Web Speech API fallback for Indonesian Realistic Voiceover
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isBgmPlaying = false;
  private bgmGainNode: GainNode | null = null;
  private voiceGainNode: GainNode | null = null;
  private masterGainNode: GainNode | null = null;
  private destinationNode: MediaStreamAudioDestinationNode | null = null;
  private currentInterval: number | null = null;
  private bgmTrack: string = 'luxury_lofi';
  private currentVoiceSource: AudioBufferSourceNode | null = null;
  private baseBgmVol: number = 0.25;
  private isDucked: boolean = false;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGainNode = this.ctx.createGain();
      this.bgmGainNode = this.ctx.createGain();
      this.voiceGainNode = this.ctx.createGain();
      this.destinationNode = this.ctx.createMediaStreamDestination();

      this.bgmGainNode.connect(this.masterGainNode);
      this.voiceGainNode.connect(this.masterGainNode);

      // Connect to speakers AND to the recorder destination stream
      this.masterGainNode.connect(this.ctx.destination);
      this.masterGainNode.connect(this.destinationNode);

      this.bgmGainNode.gain.value = this.baseBgmVol;
      this.voiceGainNode.gain.value = 1.0;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMediaStreamTrack(): MediaStreamTrack | null {
    if (!this.destinationNode) {
      this.init();
    }
    return this.destinationNode?.stream.getAudioTracks()[0] || null;
  }

  public setVolumes(bgmVol: number, voiceVol: number) {
    this.baseBgmVol = Math.max(0, Math.min(1, bgmVol));
    if (this.bgmGainNode) {
      if (!this.isDucked) {
        this.bgmGainNode.gain.value = this.baseBgmVol;
      } else {
        this.bgmGainNode.gain.value = this.baseBgmVol * 0.28;
      }
    }
    if (this.voiceGainNode) {
      this.voiceGainNode.gain.value = Math.max(0, Math.min(1, voiceVol));
    }
  }

  /**
   * Automatic Audio Ducking: Smoothly lowers BGM when narration voice is active
   */
  public duckBgm(duckingFactor = 0.28) {
    if (!this.ctx || !this.bgmGainNode) return;
    this.isDucked = true;
    const now = this.ctx.currentTime;
    this.bgmGainNode.gain.cancelScheduledValues(now);
    this.bgmGainNode.gain.setValueAtTime(this.bgmGainNode.gain.value, now);
    this.bgmGainNode.gain.exponentialRampToValueAtTime(Math.max(0.001, this.baseBgmVol * duckingFactor), now + 0.2);
  }

  /**
   * Smoothly restores BGM back to full energy during pauses or after speech
   */
  public unduckBgm() {
    if (!this.ctx || !this.bgmGainNode) return;
    this.isDucked = false;
    const now = this.ctx.currentTime;
    this.bgmGainNode.gain.cancelScheduledValues(now);
    this.bgmGainNode.gain.setValueAtTime(this.bgmGainNode.gain.value, now);
    this.bgmGainNode.gain.linearRampToValueAtTime(this.baseBgmVol, now + 0.4);
  }

  // Play a smooth chord progression note
  private playNote(freq: number, startTime: number, duration: number, type: OscillatorType = 'sine', gainVal: number = 0.08) {
    if (!this.ctx || !this.bgmGainNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.bgmGainNode);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Soft percussion kick/snare beat
  private playKick(startTime: number) {
    if (!this.ctx || !this.bgmGainNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(140, startTime);
    osc.frequency.exponentialRampToValueAtTime(35, startTime + 0.12);

    gain.gain.setValueAtTime(0.18, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

    osc.connect(gain);
    gain.connect(this.bgmGainNode);
    osc.start(startTime);
    osc.stop(startTime + 0.15);
  }

  private playHihat(startTime: number) {
    if (!this.ctx || !this.bgmGainNode) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.04, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGainNode);

    noise.start(startTime);
  }

  public startBgm(track: string = 'luxury_lofi') {
    this.init();
    this.stopBgm();
    this.bgmTrack = track;
    if (track === 'none') return;
    this.isBgmPlaying = true;

    // Rich harmonic chord progressions specifically designed for real estate showcase
    const chords: { [key: string]: number[][] } = {
      luxury_lofi: [
        [174.61, 220.0, 261.63, 329.63], // Fmaj7 (warm, spacious)
        [164.81, 196.0, 246.94, 293.66], // Em7
        [146.83, 174.61, 220.0, 261.63], // Dm7
        [130.81, 164.81, 196.0, 246.94], // Cmaj7
      ],
      chill_piano: [
        [261.63, 329.63, 392.0, 493.88], // Cmaj7 (prestigious grand piano)
        [220.0, 261.63, 329.63, 392.0],  // Am7
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
        [196.0, 246.94, 293.66, 349.23], // G7
      ],
      modern_beats: [
        [220.0, 261.63, 329.63], // Am (driving, energetic, modern)
        [174.61, 220.0, 261.63], // F
        [261.63, 329.63, 392.0], // C
        [196.0, 246.94, 293.66], // G
      ],
      ambient_corporate: [
        [196.0, 246.94, 293.66, 440.0],
        [220.0, 261.63, 329.63, 440.0],
        [174.61, 220.0, 293.66, 349.23],
        [196.0, 246.94, 329.63, 392.0],
      ],
    };

    const trackChords = chords[track] || chords.luxury_lofi;
    let step = 0;

    const playLoopStep = () => {
      if (!this.isBgmPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const chordIndex = Math.floor(step / 4) % trackChords.length;
      const currentChord = trackChords[chordIndex];

      // Play rich cinematic pad chord on first beat of bar
      if (step % 4 === 0) {
        currentChord.forEach((freq, idx) => {
          this.playNote(freq, now, 2.2, 'triangle', 0.05 + idx * 0.012);
        });
      }

      // Elegant arpeggio note
      const arpFreq = currentChord[step % currentChord.length] * 2;
      this.playNote(arpFreq, now, 0.45, 'sine', 0.04);

      // Drum groove with natural pulse
      if (track === 'modern_beats' || track === 'luxury_lofi') {
        if (step % 4 === 0) this.playKick(now);
        if (step % 2 === 1) this.playHihat(now);
      }

      step++;
    };

    playLoopStep();
    this.currentInterval = window.setInterval(playLoopStep, 500);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
    if (this.currentVoiceSource) {
      try {
        this.currentVoiceSource.stop();
      } catch (e) {
        // ignore
      }
      this.currentVoiceSource = null;
    }
  }

  /**
   * Play base64 WAV audio from Gemini TTS with automatic audio ducking
   */
  public async playWavAudio(base64Wav: string): Promise<void> {
    this.init();
    if (!this.ctx || !this.voiceGainNode) return;

    try {
      const binaryString = atob(base64Wav);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBuffer = await this.ctx.decodeAudioData(bytes.buffer);

      if (this.currentVoiceSource) {
        try {
          this.currentVoiceSource.stop();
        } catch (e) {
          // ignore
        }
      }

      // Auto-duck BGM while voice is playing!
      this.duckBgm();

      const source = this.ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.voiceGainNode);
      this.currentVoiceSource = source;

      source.onended = () => {
        this.unduckBgm();
      };

      source.start();
    } catch (err) {
      console.warn('WAV decode failed, falling back to Web Speech API', err);
    }
  }

  /**
   * Speak narration using Web Speech API with automatic audio ducking
   */
  public speakIndonesian(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Auto-duck BGM when speaking!
    this.duckBgm();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 1.05; // Energetic property agent tempo
    utterance.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.startsWith('id') || v.lang.includes('ID') || v.name.includes('Indonesian'));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    utterance.onend = () => {
      this.unduckBgm();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.unduckBgm();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopAllSpeech() {
    this.unduckBgm();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.currentVoiceSource) {
      try {
        this.currentVoiceSource.stop();
      } catch (e) {
        // ignore
      }
      this.currentVoiceSource = null;
    }
  }
}

export const soundEngine = new SoundEngine();
