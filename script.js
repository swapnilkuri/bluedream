// --- 1. Real-time Clock ---
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById('current-time').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// --- 2. Multi-Song Playlist Engine ---
const playlist = [
  {
    title: "O Je Mane Na Mana",
    artist: "Arnob & Sunidhi Nayak",
    src: "/audio/song1.mp3"
  },
  {
    title: "Ekhon Onek Raat",
    artist: "Anupam Roy (Hemlock Society)",
    src: "/audio/song2.mp3"
  },
  {
    title: "Amake Amar Moto Thakte Dao",
    artist: "Anupam Roy (Autograph)",
    src: "/audio/song3.mp3"
  },
  {
    title: "Mayabono Biharini",
    artist: "Somlata (Bedroom)",
    src: "/audio/song4.mp3"
  },
  {
    title: "Boba Tunnel",
    artist: "Anupam Roy (Chotushkone)",
    src: "/audio/song5.mp3"
  },
  {
    title: "Benche Thakar Gaan",
    artist: "Rupam & Anupam (Autograph)",
    src: "/audio/song6.mp3"
  },
  {
    title: "Ekbar Bol",
    artist: "Anupam Roy (Baishe Srabon)",
    src: "/audio/song7.mp3"
  },
  {
    title: "Ranjha",
    artist: "B Praak & Jasleen Royal (Shershaah)",
    src: "/audio/song8.mp3"
  }
];

let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio();

const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');

function loadTrack(index) {
  const track = playlist[index];
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  audio.src = track.src;
  audio.load(); // Force audio reload
}

function playTrack() {
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      })
      .catch((error) => {
        console.error("Audio playback failed:", error);
        isPlaying = false;
        playBtn.innerHTML = '<i class="fa-solid fa-play ml-0.5"></i>';
      });
  }
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = '<i class="fa-solid fa-play ml-0.5"></i>';
}

// Controls Logic
playBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
});

nextBtn.addEventListener('click', () => {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  if (isPlaying) playTrack();
});

prevBtn.addEventListener('click', () => {
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
  if (isPlaying) playTrack();
});

// Auto-play next track when current finishes
audio.addEventListener('ended', () => {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  playTrack();
});

// Initialize first track on page load
loadTrack(currentTrackIndex);

// --- 3. Fullscreen Toggle ---
const fullscreenBtn = document.getElementById('fullscreen-btn');
if (fullscreenBtn) {
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });
}
