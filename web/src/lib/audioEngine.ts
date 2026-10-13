// Generative Web Audio API Synthesizer (100% Code, Zero Media Assets)
// Crystal-Clean, Non-Buzzy Harmonic Sound Design:
// - Motion-reactive pentatonic crystal chimes
// - Delightful scroll-driven cascading bells
// - Ethereal celestial pad (pure sine, zero harsh triangle buzz)
// - Tactile organic clicks and ripple shockwaves

class GenerativeAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isInitialized: boolean = false;
  private lastScrollChimeTime: number = 0;
  private scrollNoteIndex: number = 0;

  // Luminous pentatonic scale (pure harmonic frequencies in Hz)
  private pentatonicScale: number[] = [
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
    1046.50, // C6
    1174.66, // D6
    1318.51, // E6
  ];

  public init() {
    if (this.isInitialized || typeof window === "undefined") return;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();

      // Master gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Note: Continuous background drone/pad is intentionally removed.
      // Audio is 100% reactive: pure crystalline pentatonic bells on scroll, hover, and interaction.
      // This guarantees 100% zero background buzzing or humming on laptop speakers.

      this.isInitialized = true;
    } catch {
      // Audio support fallback
    }
  }

  public async toggleMute(): Promise<boolean> {
    if (!this.isInitialized) {
      this.init();
    }

    if (!this.ctx || !this.masterGain) return false;

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    const targetGain = this.isMuted ? 0.0001 : 0.65;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.exponentialRampToValueAtTime(targetGain, now + 0.25);

    if (this.isMuted) {
      setTimeout(() => {
        if (this.masterGain && this.isMuted) {
          this.masterGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
        }
      }, 300);
    } else {
      // Play a delightful welcome crystal chime when unmuting
      this.playChime(4, 0.45);
    }

    return !this.isMuted;
  }

  public setVolume(volume: number) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const clamped = Math.max(0, Math.min(volume, 1));
    this.masterGain.gain.setValueAtTime(clamped * 0.65, this.ctx.currentTime);
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Pure Crystal Chime (Smooth sine bell with zero distortion or buzz)
  public playChime(pitchIndex?: number, volumeMultiplier: number = 0.45) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const noteIdx =
        pitchIndex !== undefined
          ? Math.abs(pitchIndex) % this.pentatonicScale.length
          : Math.floor(Math.random() * this.pentatonicScale.length);

      const freq = this.pentatonicScale[noteIdx];
      osc.type = "sine"; // Pure tone
      osc.frequency.setValueAtTime(freq, now);

      // Bell envelope: instant soft attack, gentle exponential decay
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18 * volumeMultiplier, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch {
      // Audio error catch
    }
  }

  // Scroll Chime: Cascading pentatonic note stream as user scrolls through the page
  public playScrollChime(direction: "down" | "up", speed: number = 1.0) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const now = Date.now();
    // Throttle so it creates a sweet musical trickle, not a cacophony
    const throttleMs = Math.max(90, 160 / Math.max(0.5, speed));
    if (now - this.lastScrollChimeTime < throttleMs) return;

    this.lastScrollChimeTime = now;

    if (direction === "down") {
      this.scrollNoteIndex = (this.scrollNoteIndex + 1) % this.pentatonicScale.length;
    } else {
      this.scrollNoteIndex =
        (this.scrollNoteIndex - 1 + this.pentatonicScale.length) % this.pentatonicScale.length;
    }

    this.playChime(this.scrollNoteIndex, 0.28);
  }

  // Section Arrival Chime: Warm harmonic dual-bell chord when entering a major section
  public playSectionChime(sectionIndex: number) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const baseNote = (sectionIndex * 2) % (this.pentatonicScale.length - 2);
    this.playChime(baseNote, 0.35);
    setTimeout(() => {
      this.playChime(baseNote + 2, 0.25);
    }, 90);
  }

  // Signal Shockwave burst (clean sine swell + sparkling chime triad)
  public playShockwave() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;

      // Clean warm bass drop (sine wave, NO buzz)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.4);

      subGain.gain.setValueAtTime(0.25, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      subOsc.connect(subGain);
      subGain.connect(this.masterGain);
      subOsc.start(now);
      subOsc.stop(now + 0.45);

      // Ascending crystal chime chord
      [2, 4, 7].forEach((step, idx) => {
        setTimeout(() => {
          this.playChime(step, 0.5);
        }, idx * 80);
      });
    } catch {
      // Catch
    }
  }

  // Tactile organic click for buttons
  public playTactileTick() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // Catch
    }
  }

  // Waveform data for the visualizer
  public getWaveformData(outputArray: ArrayBufferView): boolean {
    if (!this.analyser || this.isMuted) {
      if (outputArray && typeof (outputArray as Uint8Array).fill === "function") {
        (outputArray as Uint8Array).fill(128);
      }
      return false;
    }

    const u8 =
      outputArray instanceof Uint8Array
        ? outputArray
        : new Uint8Array(
            outputArray.buffer,
            outputArray.byteOffset,
            outputArray.byteLength
          );

    this.analyser.getByteTimeDomainData(
      u8 as unknown as Parameters<AnalyserNode["getByteTimeDomainData"]>[0]
    );
    return true;
  }
}

export const audioEngine = new GenerativeAudioEngine();
