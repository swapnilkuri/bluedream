// --- 1. Real-time Clock ---
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeEl = document.getElementById('current-time');
  if (timeEl) timeEl.textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// --- 2. Playlists Categories ---
const allPlaylists = {
  bengali: [
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
  ],
  ritviz: [
    {
      title: "Chandamama",
      artist: "Ritviz (Mimmi)",
      videoId: "mWxZEtHNOSs"
    },
    {
      title: "Barso",
      artist: "Ritviz (Ved)",
      videoId: "cqOcnONQB4M"
    },
    {
      title: "Sage",
      artist: "Ritviz (Ved)",
      videoId: "bFp0sX1lswk"
    },
    {
      title: "Udd Gaye",
      artist: "Ritviz",
      videoId: "3jDQKquMXP4"
    },
    {
      title: "Baaraat",
      artist: "Ritviz & Nucleya",
      videoId: "0jyeL0fmHRU"
    },
    {
      title: "Jeet 2.0",
      artist: "Ritviz",
      videoId: "z26Sn6gRn98"
    }
  ]
};

let activeCategory = 'bengali';
let activePlaylist = allPlaylists[activeCategory];
let currentTrackIndex = 0;

let player;
let isPlayerReady = false;
let isPlaying = false;
let isBuffering = false;
let currentVolume = 80;

const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const trackCover = document.getElementById('track-cover');
const volumeSlider = document.getElementById('volume-slider');
const volumeBtn = document.getElementById('volume-btn');
const volumeIcon = document.getElementById('volume-icon');

// Initialize YouTube IFrame API
window.onYouTubeIframeAPIReady = function() {
  player = new YT.Player('yt-player', {
    height: '200',
    width: '200',
    videoId: activePlaylist[currentTrackIndex].videoId,
    playerVars: {
      autoplay: 0,
      controls: 0,
      playsinline: 1,
      rel: 0,
      enablejsapi: 1,
      origin: window.location.origin
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
};

function onPlayerReady() {
  isPlayerReady = true;
  player.setVolume(currentVolume);
  player.cueVideoById(activePlaylist[currentTrackIndex].videoId);
  updateTrackUI();
  renderPlaylistModal();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.BUFFERING) {
    isBuffering = true;
    if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-sm"></i>';
  } else if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    isBuffering = false;
    if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  } else if (event.data === YT.PlayerState.PAUSED) {
    isPlaying = false;
    isBuffering = false;
    if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play ml-0.5"></i>';
  } else if (event.data === YT.PlayerState.ENDED) {
    nextTrack();
  }
  renderPlaylistModal();
}

function updateTrackUI() {
  const track = activePlaylist[currentTrackIndex];
  if (trackTitle) trackTitle.textContent = track.title;
  if (trackArtist) trackArtist.textContent = track.artist;
  if (trackCover) {
    trackCover.src = `https://img.youtube.com/vi/${track.videoId}/mqdefault.jpg`;
  }
  renderPlaylistModal();
}

function loadAndPlayTrack(index, category = null) {
  if (category && category !== activeCategory) {
    activeCategory = category;
    activePlaylist = allPlaylists[activeCategory];
    updateCategoryTabsUI();
  }
  currentTrackIndex = index;
  updateTrackUI();
  if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-sm"></i>';
  
  if (isPlayerReady && player) {
    player.loadVideoById({
      videoId: activePlaylist[currentTrackIndex].videoId,
      startSeconds: 0,
      suggestedQuality: 'small'
    });
    player.playVideo();
  }
}

function nextTrack() {
  const nextIndex = (currentTrackIndex + 1) % activePlaylist.length;
  loadAndPlayTrack(nextIndex);
}

function prevTrack() {
  const prevIndex = (currentTrackIndex - 1 + activePlaylist.length) % activePlaylist.length;
  loadAndPlayTrack(prevIndex);
}

// Play / Pause Click
if (playBtn) {
  playBtn.addEventListener('click', () => {
    if (!isPlayerReady || !player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      playBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-sm"></i>';
      player.playVideo();
    }
  });
}

if (nextBtn) nextBtn.addEventListener('click', nextTrack);
if (prevBtn) prevBtn.addEventListener('click', prevTrack);

// Volume Controls
if (volumeSlider) {
  volumeSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    currentVolume = val;
    if (isPlayerReady && player) {
      player.setVolume(val);
      if (val === 0) player.mute();
      else player.unMute();
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

// --- 3. Modal & Tab Controls ---
const openPlaylistBtn = document.getElementById('open-playlist-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const playlistModal = document.getElementById('playlist-modal');
const playlistItemsContainer = document.getElementById('playlist-items-container');
const tabBengali = document.getElementById('tab-bengali');
const tabRitviz = document.getElementById('tab-ritviz');

let viewingCategory = 'bengali';

function updateCategoryTabsUI() {
  if (viewingCategory === 'bengali') {
    tabBengali.className = "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3.5 py-1.5 rounded-xl transition";
    tabRitviz.className = "text-slate-400 hover:text-slate-200 border border-transparent px-3.5 py-1.5 rounded-xl transition";
  } else {
    tabRitviz.className = "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3.5 py-1.5 rounded-xl transition";
    tabBengali.className = "text-slate-400 hover:text-slate-200 border border-transparent px-3.5 py-1.5 rounded-xl transition";
  }
}

if (tabBengali) {
  tabBengali.addEventListener('click', () => {
    viewingCategory = 'bengali';
    updateCategoryTabsUI();
    renderPlaylistModal();
  });
}

if (tabRitviz) {
  tabRitviz.addEventListener('click', () => {
    viewingCategory = 'ritviz';
    updateCategoryTabsUI();
    renderPlaylistModal();
  });
}

if (openPlaylistBtn && playlistModal) {
  openPlaylistBtn.addEventListener('click', () => {
    viewingCategory = activeCategory;
    updateCategoryTabsUI();
    playlistModal.classList.remove('hidden');
    renderPlaylistModal();
  });
}

if (closeModalBtn && playlistModal) {
  closeModalBtn.addEventListener('click', () => {
    playlistModal.classList.add('hidden');
  });
}

if (playlistModal) {
  playlistModal.addEventListener('click', (e) => {
    if (e.target === playlistModal) {
      playlistModal.classList.add('hidden');
    }
  });
}

function renderPlaylistModal() {
  if (!playlistItemsContainer) return;
  playlistItemsContainer.innerHTML = '';

  const listToDisplay = allPlaylists[viewingCategory];

  listToDisplay.forEach((track, idx) => {
    const isCurrent = viewingCategory === activeCategory && idx === currentTrackIndex;
    const num = (idx + 1).toString().padStart(2, '0');
    const thumbnailUrl = `https://img.youtube.com/vi/${track.videoId}/mqdefault.jpg`;

    const item = document.createElement('div');
    item.className = `flex items-center space-x-3 p-2.5 rounded-2xl cursor-pointer transition ${
      isCurrent ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300' : 'hover:bg-slate-800/80 text-slate-300'
    }`;

    item.innerHTML = `
      <span class="text-xs font-semibold ${isCurrent ? 'text-cyan-300' : 'text-slate-500'} w-5 text-center">${num}</span>
      <div class="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/50 shrink-0">
        <img src="${thumbnailUrl}" alt="${track.title}" class="w-full h-full object-cover">
        ${isCurrent && isPlaying ? '<div class="absolute inset-0 bg-black/40 flex items-center justify-center"><i class="fa-solid fa-volume-high text-xs text-cyan-300 animate-pulse"></i></div>' : ''}
      </div>
      <div class="flex-1 min-w-0">
        <h5 class="text-xs font-semibold truncate ${isCurrent ? 'text-cyan-200' : 'text-slate-100'}">${track.title}</h5>
        <p class="text-[10px] text-slate-400 truncate">${track.artist}</p>
      </div>
    `;

    item.addEventListener('click', () => {
      loadAndPlayTrack(idx, viewingCategory);
      playlistModal.classList.add('hidden');
    });

    playlistItemsContainer.appendChild(item);
  });
}

// Fullscreen
const fullscreenBtn = document.getElementById('fullscreen-btn');
if (fullscreenBtn) {
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  });
}

// Initial UI Setup
updateTrackUI();
