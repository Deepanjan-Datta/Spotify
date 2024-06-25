let currentsong = new Audio();
let songs = [];
let currfolder;
let currentIndex = 0;
function formatTime(seconds) {
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
}
async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currfolder}/`)[1]);
        }
    }
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div id="songname">${decodeURIComponent(song.split('(')[0].replaceAll("%20", " ")).replaceAll("%2C", " ")}</div>
                                <div id="artist">${decodeURIComponent(song.split('(')[1].replaceAll("%20", " ").replace(").mp3", "")).replaceAll("%2C", " ")}</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="play" style="width: 20px;">
                            </div>
        
        </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector("#songname").innerHTML, e.querySelector("#artist").innerHTML, index);
        });
    });
    if (songs.length > 0) {
        playMusic(decodeURIComponent(songs[0].split('(')[0].replaceAll("%20", " ")).replaceAll("%2C", " "),
            decodeURIComponent(songs[0].split('(')[1].replaceAll("%20", " ").replace(").mp3", "")).replaceAll("%2C", " "), 0);
    }
}
const playMusic = (track, artist, index, pause = false) => {
    currentsong.src = `/${currfolder}/` + track + "(" + artist + ")" + ".mp3";
    currentIndex = index;
    if (!pause) {
        currentsong.play();
        curr.src = "pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}
async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    let arr = Array.from(anchors);
    cardContainer.innerHTML = ""; // Clear previous album cards
    for (let i = 0; i < arr.length; i++) {
        const e = arr[i];
        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-1)[0];
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
                                <!-- Circular background -->
                                <circle cx="12" cy="12" r="11" fill="#1fdf64" />
                                <!-- Icon path -->
                                <path d="M15.5 12L9.5 15.5V8.5L15.5 12Z" fill="black" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>                                                   
                        </div>
                        <img src="/songs/${folder}/cover.jpeg" alt="happyhits">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            currentsong.pause();
            await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        });
    });
}
async function main() {
    await getSongs("songs/ArianaGrande");
    if (songs.length > 0) {
        currentIndex = 0;
        playMusic(decodeURIComponent(songs[currentIndex].split('(')[0].replaceAll("%20", " ")).replaceAll("%2C", " "),
            decodeURIComponent(songs[currentIndex].split('(')[1].replaceAll("%20", " ").replace(").mp3", "")).replaceAll("%2C", " "), currentIndex, true);
    }
    displayAlbums();
    curr.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            curr.src = "pause.svg";
        } else {
            currentsong.pause();
            curr.src = "play.svg";
        }
    });
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });
    document.querySelector(".seekbar").addEventListener("click", e => {
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        currentsong.currentTime = ((currentsong.duration) * (e.offsetX / e.target.getBoundingClientRect().width) * 100) / 100;
    });
    document.querySelector(".menu").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });
    pre.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            const song = songs[currentIndex];
            const track = decodeURIComponent(song.split('(')[0].replaceAll("%20", " ")).replaceAll("%2C", " ");
            const artist = decodeURIComponent(song.split('(')[1].replaceAll("%20", " ").replace(").mp3", "")).replaceAll("%2C", " ");
            playMusic(track, artist, currentIndex);
        }
    });
    nex.addEventListener("click", () => {
        if (currentIndex < songs.length - 1) {
            currentIndex++;
            const song = songs[currentIndex];
            const track = decodeURIComponent(song.split('(')[0].replaceAll("%20", " ")).replaceAll("%2C", " ");
            const artist = decodeURIComponent(song.split('(')[1].replaceAll("%20", " ").replace(").mp3", "")).replaceAll("%2C", " ");
            playMusic(track, artist, currentIndex);
        }
    });
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
    });
    document.querySelector(".volume>img").addEventListener("click",e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg");
            currentsong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg");
            currentsong.volume=1;
            document.querySelector(".range").getElementsByTagName("input")[0].value=100;
        }
    })
}
main();