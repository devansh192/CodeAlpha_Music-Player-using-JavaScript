// Playlist Array: add your own MP3 links/cover art
const songs = [
    {
        title: "Dreaming",
        artist: "Cloud Nine",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover: "dreaming.jpg" // Album art!
    },
    {
        title: "Jazz Fusion",
        artist: "Open Area",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cover: "jazz.jpeg" // Album art!
    },
    {
        title: "Chill Vibes",
        artist: "Whale Song",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        cover: "chill.jpeg" // Album art!
    }
];

const audio = document.getElementById('audio');
const albumArt = document.getElementById('album-art');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const repeatBtn = document.getElementById('repeat');
const shuffleBtn = document.getElementById('shuffle');
const muteBtn = document.getElementById('mute');
const seekBar = document.getElementById('seek');
const volumeBar = document.getElementById('volume');
const currentTime = document.getElementById('current-time');
const duration = document.getElementById('duration');
const playlistEl = document.getElementById('playlist');

let currentSong = 0;
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;

// Setup playlist
function loadPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, i) => {
        const li = document.createElement('li');
        li.textContent = `${song.title} - ${song.artist}`;
        li.onclick = () => { loadSong(i); playSong(); };
        if (i === currentSong) li.classList.add('active');
        playlistEl.appendChild(li);
    });
}

function loadSong(idx) {
    currentSong = idx;
    audio.src = songs[idx].src;
    title.textContent = songs[idx].title;
    artist.textContent = songs[idx].artist;
    albumArt.src = songs[idx].cover; // sets the album art
    loadPlaylist();
    resetProgress();
}

// Play & Pause
function playSong() {
    audio.play();
    isPlaying = true;
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    albumArt.classList.add('playing');
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    playBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    albumArt.classList.remove('playing');
}

// Next/Prev
function nextSong() {
    if (isShuffle) {
        let nextIdx;
        do { nextIdx = Math.floor(Math.random() * songs.length); }
        while (nextIdx === currentSong);
        loadSong(nextIdx);
    } else {
        loadSong((currentSong + 1) % songs.length);
    }
    playSong();
}

function prevSong() {
    loadSong((currentSong - 1 + songs.length) % songs.length);
    playSong();
}

// Repeat / Shuffle
repeatBtn.onclick = () => {
    isRepeat = !isRepeat;
    repeatBtn.style.background = isRepeat ? "#7DD6FF" : "#3A8EEE";
};
shuffleBtn.onclick = () => {
    isShuffle = !isShuffle;
    shuffleBtn.style.background = isShuffle ? "#7DD6FF" : "#3A8EEE";
};

// Play/Pause button events
playBtn.onclick = playSong;
pauseBtn.onclick = pauseSong;
nextBtn.onclick = nextSong;
prevBtn.onclick = prevSong;

// Seekbar
audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 100 || 0;
    seekBar.value = percent;
    currentTime.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(audio.duration);
});
seekBar.oninput = (e) => {
    if (audio.duration)
        audio.currentTime = (seekBar.value / 100) * audio.duration;
};

// Volume
volumeBar.oninput = () => {
    audio.volume = volumeBar.value;
    muteBtn.innerHTML = audio.volume == 0 ? "🔇" : "🔊";
};
muteBtn.onclick = () => {
    if (audio.volume > 0){
        audio.volume = 0;
        volumeBar.value = 0;
        muteBtn.innerHTML = "🔇";
    } else {
        audio.volume = 1;
        volumeBar.value = 1;
        muteBtn.innerHTML = "🔊";
    }
};

// On song end
audio.onended = () => {
    if (isRepeat) playSong();
    else nextSong();
};

function formatTime(sec){
    if (isNaN(sec)) return "0:00";
    const min = Math.floor(sec/60);
    const s = Math.floor(sec%60);
    return `${min}:${s<10?'0':''}${s}`;
}
function resetProgress(){
    seekBar.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
}

// Init
playBtn.style.display = "inline-block";
pauseBtn.style.display = "none";
loadSong(currentSong);

// Keyboard shortcuts (optional)
document.addEventListener('keydown', (e) => {
    if (e.code=="Space") isPlaying ? pauseSong() : playSong();
    if (e.code=="ArrowRight") nextSong();
    if (e.code=="ArrowLeft") prevSong();
});
