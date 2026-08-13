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
    src: encodeURI("./audio/O Je Mane Na Mana (ও যে মানে না মানা) Arnob Sunidhi Nayak Best Of Tagore - 256.MP3")
  },
  {
    title: "Ekhon Onek Raat",
    artist: "Anupam Roy (Hemlock Society)",
    src: encodeURI("./audio/Ekhon Onek Raat (এখন অনেক রাত ) Hemlock Society Anupam Roy Srijit Parambrata Koel SVF - 320.MP3")
  },
  {
    title: "Amake Amar Moto Thakte Dao",
    artist: "Anupam Roy (Autograph)",
    src: encodeURI("./audio/Amake Amar Moto Thakte Dao Autograph Prosenjit Chatterjee Anupam Roy Srijit Mukherji SVF - 256,MP3")
  },
  {
    title: "Mayabono Biharini",
    artist: "Somlata (Bedroom)",
    src: encodeURI("./audio/Mayabono Biharini from BEDROOM by Somlata - 256.MP3")
  },
  {
    title: "Boba Tunnel",
    artist: "Anupam Roy (Chotushkone)",
    src: encodeURI("./audio/Official Boba Tunnel Video Song Bengali Film Chotushkone Anupam Roy - 256.MP3")
  },
  {
    title: "Benche Thakar Gaan",
    artist: "Rupam & Anupam (Autograph)",
    src: encodeURI("./audio/Benche Thakar Gaan (বেঁচে থাকার গান) Autograph Video Song Prosenjit Anupam Rupam Srijit - 320,MP3")
  },
  {
    title: "Ekbar Bol",
    artist: "Anupam Roy (Baishe Srabon)",
    src: encodeURI("./audio/Ekbar Bol (একবার বল) Lyrical Baishe Srabon Prosenjit Abir Parambrata Anupam Roy SVF - 256,MP3")
  },
  {
    title: "Ranjha",
    artist: "B Praak & Jasleen Royal (Shershaah)",
    src: encodeURI("./audio/Ranjha – Official Video Shershaah Sidharth–Kiara B Praak Jasleen Royal Romy Anvita Dutt - 320.MP3")
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
}

function playTrack() {
  audio.play().catch(err => console.log("Playback error:", err));
  isPlaying = true;
  playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
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

// Auto-play next track when current track ends
audio.addEventListener('ended', () => {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  playTrack();
});

// Initialize first track on page load
loadTrack(currentTrackIndex);

// --- 3. Fullscreen Toggle ---
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
