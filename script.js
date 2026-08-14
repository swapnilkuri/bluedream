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
    src: "audio/O Je Mane Na Mana (ও যে মানে না মানা) Arnob Sunidhi Nayak Best Of Tagore - 256.MP3"
  },
  {
    title: "Ekhon Onek Raat",
    artist: "Anupam Roy (Hemlock Society)",
    src: "audio/Ekhon Onek Raat (এখন অনেক রাত ) Hemlock Society Anupam Roy Srijit Parambrata Koel SVF - 320.MP3"
  },
  {
    title: "Amake Amar Moto Thakte Dao",
    artist: "Anupam Roy (Autograph)",
    src: "audio/Amake Amar Moto Thakte Dao Autograph Prosenjit Chatterjee Anupam Roy Srijit Mukherji SVF - 256.MP3"
  },
  {
    title: "Mayabono Biharini",
    artist: "Somlata (Bedroom)",
    src: "audio/Mayabono Biharini from BEDROOM by Somlata - 256.MP3"
  },
  {
    title: "Boba Tunnel",
    artist: "Anupam Roy (Chotushkone)",
    src: "audio/Official Boba Tunnel Video Song Bengali Film Chotushkone Anupam Roy - 256.MP3"
  },
  {
    title: "Benche Thakar Gaan",
    artist: "Rupam & Anupam (Autograph)",
    src: "audio/Benche Thakar Gaan (বেঁচে থাকার গান) Autograph Video Song Prosenjit Anupam Rupam Srijit - 320.MP3"
  }
];

let currentTrackIndex = 0;
const audio = document.getElementById('main-audio');
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
  
  // Cleanly encode path for web routing
  audio.src = encodeURI(track.src);
  audio.load();
}

function playTrack() {
  audio.play()
    .then(() => {
      if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    })
    .catch((err) => {
      console.error("Playback error:", err);
      if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play ml-0.5"></i>';
    });
}

function pauseTrack() {
  audio.pause();
  if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play ml-0.5"></i>';
}

// Play / Pause Toggle
if (playBtn) {
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      playTrack();
    } else {
      pauseTrack();
    }
  });
}

// Next / Previous Buttons
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    const wasPlaying = !audio.paused;
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (wasPlaying) playTrack();
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    const wasPlaying = !audio.paused;
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if (wasPlaying) playTrack();
  });
}

// Auto-play Next Song when current ends
audio.addEventListener('ended', () => {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  playTrack();
});

// Update play button state on audio events
audio.addEventListener('play', () => {
  if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
});

audio.addEventListener('pause', () => {
  if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play ml-0.5"></i>';
});

// Volume Slider
if (volumeSlider) {
  volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    audio.volume = val;
    updateVolumeIcon(val);
  });
}

// Mute / Unmute
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
