// --- 1. Real-time Clock ---
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeEl = document.getElementById('current-time');
  if (timeEl) timeEl.textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// --- 2. Multi-Song Playlist Engine ---
const playlist = [
  {
    title: "O Je Mane Na Mana",
    artist: "Arnob & Sunidhi Nayak",
    src: "./audio/song1.mp3"
  },
  {
    title: "Ekhon Onek Raat",
    artist: "Anupam Roy (Hemlock Society)",
    src: "./audio/song2.mp3"
  },
  {
    title: "Amake Amar Moto Thakte Dao",
    artist: "Anupam Roy (Autograph)",
    src: "./audio/song3.mp3"
  },
  {
    title: "Mayabono Biharini",
    artist: "Somlata (Bedroom)",
    src: "./audio/song4.mp3"
  },
  {
    title: "Boba Tunnel",
    artist: "Anupam Roy (Chotushkone)",
    src: "./audio/song5.mp3"
  },
  {
    title: "Benche Thakar Gaan",
    artist: "Rupam & Anupam (Autograph)",
    src: "./audio/song6.mp3"
  },
  {
    title: "Ekbar Bol",
    artist: "Anupam Roy (Baishe Srabon)",
    src: "./audio/song7.mp3"
  },
  {
    title: "Ranjha",
    artist: "B Praak & Jasleen Royal (Shershaah)",
    src: "./audio/song8.mp3"
  }
];

let currentTrackIndex = 0;
let isPlaying = false;
const audio = new Audio();
audio.volume = 0.8;

const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const volumeSlider = document.getElementById('volume-slider');
const volumeBtn = document.getElementById('volume-btn');
const volumeIcon = document.getElementById('volume-icon');

let lastVolume = 0.8;

function loadTrack(index) {
  const track = playlist[index];
  if (trackTitle) trackTitle.textContent = track.title;
  if (trackArtist) trackArtist.textContent = track.artist;
  audio.src = track.src;
  audio.load();
}

function playTrack() {
  audio.play()
    .then(() => {
      isPlaying = true;
      if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    })
    .catch((err) => {
      console.error("Playback error:", err);
      isPlaying = false;
      if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play ml-0.5"></i>';
    });
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play ml-0.5"></i>';
}

// Play / Pause Button
if (playBtn) {
  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  });
}

// Next / Previous Buttons
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playTrack();
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playTrack();
  });
}

// Auto-play Next Song when current ends
audio.addEventListener('ended', () => {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  playTrack();
});

// Volume Slider
if (volumeSlider) {
  volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    audio.volume = val;
    updateVolumeIcon(val);
  });
}

// Mute / Unmute Toggle
if (volumeBtn) {
  volumeBtn.addEventListener('click', () => {
    if (audio.volume > 0) {
      lastVolume = audio.volume;
      audio.volume = 0;
      if (volumeSlider) volumeSlider.value = 0;
      updateVolumeIcon(0);
    } else {
      audio.volume = lastVolume || 0.8;
      if (volumeSlider) volumeSlider.value = audio.volume;
      updateVolumeIcon(audio.volume);
    }
  });
}

function updateVolumeIcon(vol) {
  if (!volumeIcon) return;
  if (vol === 0) {
    volumeIcon.className = "fa-solid fa-volume-xmark text-slate-500";
  } else if (vol < 0.5) {
    volumeIcon.className = "fa-solid fa-volume-low text-cyan-300";
  } else {
    volumeIcon.className = "fa-solid fa-volume-high text-cyan-300";
  }
}

// Initialize First Track
loadTrack(currentTrackIndex);

// --- 3. Fullscreen Toggle ---
const fullscreenBtn = document.getElementById('fullscreen-btn');
if (fullscreenBtn) {
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });
}
