// --- 1. Real-time Clock ---
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById('current-time').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// --- 2. Custom Target Countdown ---
// Set target date (e.g., New Year or custom event date)
const targetDate = new Date(new Date().getFullYear() + 1, 0, 1); 

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById('countdown-timer').textContent = "Event Started!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById('countdown-timer').textContent = `${days} days remaining`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// --- 3. Simple Audio Player Setup ---
const audio = new Audio('https://stream.zeno.fm/f3wvbbqmdg8uv'); // Public chill lofi stream URL
const playBtn = document.getElementById('play-btn');
let isPlaying = false;

playBtn.addEventListener('click', () => {
  if (!isPlaying) {
    audio.play();
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    isPlaying = true;
  } else {
    audio.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-play ml-0.5"></i>';
    isPlaying = false;
  }
});

// --- 4. Fullscreen Toggle ---
const fullscreenBtn = document.getElementById('fullscreen-btn');
fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
});
