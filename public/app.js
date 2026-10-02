const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

const songsDiv = document.getElementById("songs");

const audio = document.getElementById("audio");

const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");

const bgBlur = document.getElementById("bgBlur");

const progressBar = document.getElementById("progressBar");

const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const lyricsDiv = document.getElementById("lyrics");

const queueDiv = document.getElementById("queue");

let queue = [];
let currentIndex = 0;

audio.setAttribute("playsinline", true);

searchBtn.onclick = async () => {

  const q = searchInput.value;

  if(!q) return;

  songsDiv.innerHTML = "Searching...";

  const res = await fetch(`/search?q=${encodeURIComponent(q)}`);

  const songs = await res.json();

  songsDiv.innerHTML = "";

  songs.forEach(song => {

    const div = document.createElement("div");

    div.className = "song";

    div.innerHTML = `
      <img src="${song.thumbnail}">
    
      <div class="meta">
        <h2>${song.title}</h2>
        <p>${song.artist}</p>
      </div>

      <button class="addBtn">+</button>`;

    div.onclick = () => {
      queue = [song] ;
      currentIndex = 0;
      updateQueue();
      playSong(0);
    }
    div.querySelector(".addBtn").onclick = (e) => {
      e.stopPropagation();
      queue.push(song);
      updateQueue;
    };

    songsDiv.appendChild(div);

  });

};

function playSong(index){

  currentIndex = index;

  const song = queue[index];

  audio.src = `/stream/${song.videoId}`;

  audio.play();

  cover.src = song.thumbnail;

  title.innerText = song.title;
  artist.innerText = song.artist;

  bgBlur.style.backgroundImage = `url(${song.thumbnail})`;

  playBtn.innerText = "⏸";

  loadLyrics(song.title, song.artist);

}

function updateQueue(){

  queueDiv.innerHTML =
    "Queue: " +
    queue.map(q => q.title).join(" • ");

}

audio.addEventListener("ended", () => {

  if(currentIndex < queue.length - 1){
    playSong(currentIndex + 1);
  }

});

nextBtn.onclick = () => {

  if(currentIndex < queue.length - 1){
    playSong(currentIndex + 1);
  }

};

prevBtn.onclick = () => {

  if(currentIndex > 0){
    playSong(currentIndex - 1);
  }

};

playBtn.onclick = () => {

  if(audio.paused){
    audio.play();
    playBtn.innerText = "⏸";
  }else{
    audio.pause();
    playBtn.innerText = "▶";
  }

};

audio.addEventListener("timeupdate", () => {

  const progress =
    (audio.currentTime / audio.duration) * 100;

  progressBar.style.width = progress + "%";

});

function moodSearch(mood){

  searchInput.value = mood;

  searchBtn.click();

}

const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

function animateVisualizer(){

  requestAnimationFrame(animateVisualizer);

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(let i=0;i<40;i++){

    const h = Math.random() * canvas.height;

    ctx.fillStyle = "#8b5cf6";

    ctx.fillRect(
      i * 12,
      canvas.height - h,
      8,
      h
    );

  }

}

animateVisualizer();

async function loadLyrics(title, artist){

  try{

    lyricsDiv.innerHTML = "Loading lyrics...";

    const res = await fetch(
      `https://api.lyrics.ovh/v1/${artist}/${title}`
    );

    const data = await res.json();

    if(data.lyrics){

      lyricsDiv.innerHTML =
        data.lyrics.replace(/\\n/g, "<br>");

    }else{

      lyricsDiv.innerHTML =
        "Lyrics not found 👾";

    }

  }catch(err){

    lyricsDiv.innerHTML =
      "Lyrics unavailable 👾";

  }

}
