const intro = document.getElementById('intro');
const reveal = document.getElementById('reveal');
const giftButton = document.getElementById('giftButton');
const againButton = document.getElementById('againButton');
const musicButton = document.getElementById('musicButton');
const confetti = document.getElementById('confetti');

const colors = ['#ff4d8d', '#ffe66d', '#7c5cff', '#7cf7ff', '#ffffff'];
const music = new Audio('assets/Ba_i_Ha_t_Chu_c_Mu_ng_Sinh_Nha_t_Tie_ng_Vie_t_Nha_c_Chu_c_Mu.mp3');
music.loop = true;
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

function startMusic() {
  if (isMusicPlaying) return;
  isMusicPlaying = true;
  musicButton.textContent = 'Tạm dừng nhạc ♫';
  music.currentTime = 0;
  music.volume = 0.75;
  music.play().catch(() => {});
}

function stopMusic() {
  isMusicPlaying = false;
  music.pause();
  musicButton.textContent = 'Bật nhạc ♫';
}

function toggleMusic() {
  if (isMusicPlaying) stopMusic();
  else startMusic();
}

function revealGift() {
  intro.classList.add('hidden');
  reveal.classList.remove('hidden');
  launchConfetti();
  setTimeout(startMusic, 350);
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
