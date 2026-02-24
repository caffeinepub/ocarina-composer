export function createOcarinaSound(
  audioContext: AudioContext,
  frequency: number,
  duration: number,
  startTime: number
): void {
  // Create oscillators for a richer ocarina-like sound
  const oscillator1 = audioContext.createOscillator();
  const oscillator2 = audioContext.createOscillator();
  
  // Use sine waves for a flute-like tone
  oscillator1.type = 'sine';
  oscillator2.type = 'sine';
  
  // Slightly detune the second oscillator for warmth
  oscillator1.frequency.setValueAtTime(frequency, startTime);
  oscillator2.frequency.setValueAtTime(frequency * 1.002, startTime);
  
  // Create filter for tone shaping
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2000, startTime);
  filter.Q.setValueAtTime(1, startTime);
  
  // Create gain nodes for envelope
  const gainNode1 = audioContext.createGain();
  const gainNode2 = audioContext.createGain();
  const masterGain = audioContext.createGain();
  
  // ADSR envelope
  const attackTime = 0.05;
  const decayTime = 0.1;
  const sustainLevel = 0.6;
  const releaseTime = 0.15;
  
  gainNode1.gain.setValueAtTime(0, startTime);
  gainNode1.gain.linearRampToValueAtTime(0.3, startTime + attackTime);
  gainNode1.gain.linearRampToValueAtTime(sustainLevel * 0.3, startTime + attackTime + decayTime);
  gainNode1.gain.setValueAtTime(sustainLevel * 0.3, startTime + duration - releaseTime);
  gainNode1.gain.linearRampToValueAtTime(0, startTime + duration);
  
  gainNode2.gain.setValueAtTime(0, startTime);
  gainNode2.gain.linearRampToValueAtTime(0.2, startTime + attackTime);
  gainNode2.gain.linearRampToValueAtTime(sustainLevel * 0.2, startTime + attackTime + decayTime);
  gainNode2.gain.setValueAtTime(sustainLevel * 0.2, startTime + duration - releaseTime);
  gainNode2.gain.linearRampToValueAtTime(0, startTime + duration);
  
  masterGain.gain.setValueAtTime(0.4, startTime);
  
  // Connect the audio graph
  oscillator1.connect(gainNode1);
  oscillator2.connect(gainNode2);
  gainNode1.connect(filter);
  gainNode2.connect(filter);
  filter.connect(masterGain);
  masterGain.connect(audioContext.destination);
  
  // Start and stop
  oscillator1.start(startTime);
  oscillator2.start(startTime);
  oscillator1.stop(startTime + duration);
  oscillator2.stop(startTime + duration);
}
