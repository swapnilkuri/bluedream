// --- 1. Real-time Clock ---
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeEl = document.getElementById('current-time');
  if (timeEl) timeEl.textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// --- 2. YouTube Music Playlist Engine ---
const playlist = [
  {
    title: "O Je Mane Na Mana",
    artist: "Arnob & Sunidhi Nayak",
    videoId: "wC3FrA70jwI"
  },
  {
    title: "Ekhon Onek Raat",
    artist: "Anupam Roy (Hemlock Society)",
    videoId: "l5Schfa_3Wk"
  },
  {
    title: "Amake Amar Moto Thakte Dao",
    artist: "Anupam Roy (Autograph)",
    videoId: "vYsfSlEBh5Y"
  },
  {
    title: "Mayabono Biharini",
    artist: "Somlata (Bedroom)",
    videoId: "1aGwOBgyWTo"
  },
  {
    title: "Boba Tunnel",
    artist: "Anupam Roy (Chotushkone)",
    videoId: "GeX_hFhdD8k"
  },
  {
    title: "Benche Thakar Gaan",
    artist: "Rupam & Anupam (Autograph)",
    videoId: "JPp4Urgfs0U"
  }
];

let player;
let isPlayerReady = false;
let currentTrackIndex = 0;
let isPlaying = false;
let currentVolume = 80;

const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const volumeSlider = document.getElementById('volume-slider');
const volumeBtn = document.getElementById('volume-btn');
const volumeIcon = document.getElementById('volume-icon');

// Initialize YouTube Player
window.onYouTubeIframeAPIReady = function() {
  player = new YT.Player('yt-player', {
    height: '0',
    width: '0',
    videoId: playlist[currentTrackIndex].videoId,
    playerVars: {
      autoplay: 0,
      controls: 0,
      playsinline: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
};

function onPlayerReady(event) {
  isPlayerReady = true;
  player.setVolume(currentVolume);
  updateTrackUI(currentTrackIndex);
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  } else if (event.data === YT.PlayerState.PAUSED) {
    isPlaying = false;
    if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play ml-0.5"></i>';
  } else if (event.data === YT.PlayerState.ENDED) {
    // Automatically play next song
    nextTrack();
  }
}

function updateTrackUI(index) {
  const track = playlist[index];
  if (trackTitle) trackTitle.textContent = track.title;
  if (trackArtist) trackArtist.textContent = track.artist;
}

function loadAndPlayTrack(index) {
  currentTrackIndex = index;
  updateTrackUI(currentTrackIndex);
  if (isPlayerReady && player) {
    player.loadVideoById(playlist[currentTrackIndex].videoId);
    player.playVideo();
  }
}

function nextTrack() {
  const nextIndex = (currentTrackIndex + 1) % playlist.length;
  loadAndPlayTrack(nextIndex);
}

function prevTrack() {
  const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadAndPlayTrack(prevIndex);
}

// Button Events
if (playBtn) {
  playBtn.addEventListener('click', () => {
    if (!isPlayerReady) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', nextTrack);
}

if (prevBtn) {
  prevBtn.addEventListener('click', prevTrack);
}

// Volume Controls
if (volumeSlider) {
  volumeSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    currentVolume = val;
    if (isPlayerReady && player) {
      player.setVolume(val);
      if (val === 0) {
        player.mute();
      } else {
        player.unMute();
      }
    }
    updateVolumeIcon(val);
  });
}

if (volumeBtn) {
  volumeBtn.addEventListener('click', () => {
    if (!isPlayerReady || !player) return;
    if (player.isMuted() || player.getVolume() === 0) {
      player.unMute();
      const restoreVol = currentVolume || 80;
      player.setVolume(restoreVol);
      if (volumeSlider) volumeSlider.value = restoreVol;
      updateVolumeIcon(restoreVol);
    } else {
      player.mute();
      if (volumeSlider) volumeSlider.value = 0;
      updateVolumeIcon(0);
    }
  });
}

function updateVolumeIcon(vol) {
  if (!volumeIcon) return;
  if (vol === 0) {
    volumeIcon.className = "fa-solid fa-volume-xmark text-slate-500";
  } else if (vol < 50) {
    volumeIcon.className = "fa-solid fa-volume-low text-cyan-300";
  } else {
    volumeIcon.className = "fa-solid fa-volume-high text-cyan-300";
  }
}

// Initial UI setup before YouTube API triggers
updateTrackUI(currentTrackIndex);

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
