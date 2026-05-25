const intro = document.getElementById('intro');
const reveal = document.getElementById('reveal');
const giftButton = document.getElementById('giftButton');
const againButton = document.getElementById('againButton');
const musicButton = document.getElementById('musicButton');
const confetti = document.getElementById('confetti');

const colors = ['#ff4d8d', '#ffe66d', '#7c5cff', '#7cf7ff', '#ffffff'];
let audioContext;
let musicNodes = [];
let musicTimer;
let isMusicPlaying = false;

function launchConfetti() {
  confetti.innerHTML = '';
  for (let i = 0; i < 90; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2.4 + Math.random() * 2.6}s`;
    piece.style.animationDelay = `${Math.random() * 0.7}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.appendChild(piece);
  }
}

function playBell(frequency, startTime, duration = 0.42, volume = 0.13, type = 'triangle') {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const pan = audioContext.createStereoPanner();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  pan.pan.setValueAtTime((Math.random() - 0.5) * 0.55, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(pan);
  pan.connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.05);
  musicNodes.push(oscillator, gain, pan);
}

function playGiftOpenSound() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  audioContext.resume();

  const now = audioContext.currentTime;
  const sparkleNotes = [784, 1046.5, 1318.5, 1568];

  sparkleNotes.forEach((note, index) => {
    const start = now + index * 0.08;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(note, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.5);
    musicNodes.push(oscillator, gain);
  });
}

function playMusicLoop() {
  if (!isMusicPlaying || !audioContext) return;

  const now = audioContext.currentTime;
  const melody = [
    523.25, 523.25, 587.33, 523.25, 698.46, 659.25,
    523.25, 523.25, 587.33, 523.25, 783.99, 698.46,
    523.25, 523.25, 1046.5, 880, 698.46, 659.25, 587.33,
    932.33, 932.33, 880, 698.46, 783.99, 698.46
  ];

  melody.forEach((note, index) => {
    const start = now + index * 0.24;
    playBell(note, start, 0.36, 0.14, index % 3 === 0 ? 'square' : 'triangle');
    if (index % 2 === 0) playBell(note / 2, start, 0.18, 0.045, 'sine');
  });

  musicTimer = setTimeout(playMusicLoop, 6600);
}

function startMusic() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  audioContext.resume();
  if (isMusicPlaying) return;
  isMusicPlaying = true;
  musicButton.textContent = 'Tạm dừng nhạc ♫';
  playMusicLoop();
}

function stopMusic() {
  isMusicPlaying = false;
  clearTimeout(musicTimer);
  musicNodes.forEach((node) => {
    try { node.disconnect(); } catch (error) { /* node may already be disconnected */ }
  });
  musicNodes = [];
  musicButton.textContent = 'Bật nhạc ♫';
}

function toggleMusic() {
  if (isMusicPlaying) stopMusic();
  else startMusic();
}

function revealGift() {
  playGiftOpenSound();
  intro.classList.add('hidden');
  reveal.classList.remove('hidden');
  launchConfetti();
  setTimeout(startMusic, 520);
}

function resetGift() {
  stopMusic();
  reveal.classList.add('hidden');
  intro.classList.remove('hidden');
  confetti.innerHTML = '';
}

giftButton.addEventListener('click', revealGift);
againButton.addEventListener('click', resetGift);
musicButton.addEventListener('click', toggleMusic);
