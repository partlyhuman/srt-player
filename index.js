import { fromString } from './srt';
import { formatTimestamp } from './format-duration';

const $ = document.querySelector.bind(document);
const $slider = $('#slider');
const $file = $('#file');
const $sub = $('#sub');
const $controls = $('.controls');
const $play = $('#play');
const $pause = $('#pause');
const $time = $('#time');
const $back = $('#back');
const $fwd = $('#fwd');

const STEP = 250;
const PLAY_UPDATE_MS = 100;
let playing = false;
let seeking = false;
let lastRealTime = 0;
let currentPlayTime = 0;
let maxPlayTime = 0;
let subs = [];
let i = -1;

$slider.addEventListener('input', (e) => {
    seeking = true;
    seek(e.target.value);
});

$slider.addEventListener('change', (e) => {
    seek(e.target.value);
    seeking = false;
});

$pause.addEventListener('click', onPlayPause);

$play.addEventListener('click', onPlayPause);

$back.addEventListener('click', () => {
   seek(currentPlayTime - STEP);
});

$fwd.addEventListener('click', () => {
    seek(currentPlayTime + STEP);
})

$file.addEventListener('change', () => {
    const reader = new FileReader();
    reader.onload = function (e) {
        parse(e.target.result);
        $('#picker').classList.add('hide');
        $controls.classList.remove('hide');
    };
    reader.readAsText($file.files[0]);
});

function parse(alltext) {
    subs = fromString(alltext);
    maxPlayTime = subs[subs.length - 1].endTime;
    // sliderInput.setAttribute('max', maxPlayTime);
    $slider.max = maxPlayTime;
    $sub.classList.remove('hide');
    lastRealTime = getRealTime();
    setInterval(updatePlay, PLAY_UPDATE_MS);
    playing = true;
}

function getRealTime() {
    return new Date().getTime();
}

function onPlayPause() {
    lastRealTime = getRealTime();
    playing = !playing;
    if (playing) {
        $pause.classList.remove('hide');
        $play.classList.add('hide');
    } else {
        $play.classList.remove('hide');
        $pause.classList.add('hide');
    }
}

function seek(playTime) {
    if (typeof playTime === 'string') {
        playTime = parseInt(playTime, 10);
    }

    // console.log('seek from ', currentPlayTime, 'to', playTime)
    playTime = Math.max(0, Math.min(maxPlayTime, playTime));
    const found = Math.max(0, subs.findIndex(sub => sub.endTime >= playTime) - 1);
    let sub = subs[found];
    currentPlayTime = playTime;
    i = found;
    if (sub.startTime > playTime) {
        sub = null;
        $sub.classList.add('empty');
    } else {
        $sub.innerHTML = subs[found].text;
        $sub.classList.remove('empty');
    }
    updateTimeDisplay();

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
    // console.log(dt, currentPlayTime);
    $slider.value = currentPlayTime;

    const nextSub = subs[i + 1];

    if (currentPlayTime >= nextSub.startTime) {
        i++;

        $sub.innerHTML = nextSub.text;
        $sub.classList.remove('empty');
    } else if (currentPlayTime >= lastRealTime) {
        // subDiv.innerText = "";
        $sub.classList.add('empty');
    }
    updateTimeDisplay();
}

function updateTimeDisplay() {
    $time.innerText = formatTimestamp(currentPlayTime);
}
