import { fromString } from './srt';

const $ = document.querySelector.bind(document);
const sliderInput = $('#slider');
const fileInput = $('#file');
const subDiv = $('#sub');

let playing = false;
let seeking = false;
const PLAY_UPDATE_MS = 100;
let lastRealTime = 0;
let currentPlayTime = 0;
let maxPlayTime = 0;
let subs = [];
let i = -1;
let thisSub;

sliderInput.addEventListener('input', (e) => {
    seeking = true;
    seek(e.target.value);
});

sliderInput.addEventListener('change', (e) => {
    seek(e.target.value);
    seeking = false;
});


fileInput.addEventListener('change', () => {
    const reader = new FileReader();
    reader.onload = function (e) {
        parse(e.target.result);
    };
    reader.readAsText(fileInput.files[0]);
});

function parse(alltext) {
    subs = fromString(alltext);
    console.log('After sorting and parsing, ', subs);
    $('#picker').classList.add('hide');
    sliderInput.classList.remove('hide');
    maxPlayTime = subs[subs.length - 1].endTime;
    // sliderInput.setAttribute('max', maxPlayTime);
    sliderInput.max = maxPlayTime;
    console.log('last time = ', maxPlayTime);
    subDiv.classList.remove('hide');
    lastRealTime = getRealTime();
    setInterval(updatePlay, PLAY_UPDATE_MS);
    playing = true;
}

function getRealTime() {
    return new Date().getTime();
}


function seek(playTime) {
    playTime = parseInt(playTime, 10);
    const found = subs.findIndex(sub => sub.endTime >= playTime) - 1;
    if (found < 0) {
        return;
    }
    currentPlayTime = playTime;
    i = found;
    subDiv.innerHTML = subs[found].text;
    subDiv.classList.remove('empty');
}

function updatePlay() {
    if (!subs || subs.length <= 0) {
        return;
    }
    if (!playing || seeking) {
        return;
    }
    const now = getRealTime();
    const dt = now - lastRealTime;
    lastRealTime = now;
    currentPlayTime += dt;
    console.log(dt, currentPlayTime);
    sliderInput.value = currentPlayTime;

    const nextSub = subs[i + 1];

    if (currentPlayTime >= nextSub.startTime) {
        thisSub = nextSub;
        i++;

        subDiv.innerHTML = thisSub.text;
        subDiv.classList.remove('empty');
    } else if (currentPlayTime >= lastRealTime) {
        // subDiv.innerText = "";
        subDiv.classList.add('empty');
    }
}
