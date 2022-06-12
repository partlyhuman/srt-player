import {fromString} from './srt';

const $ = document.querySelector.bind(document);
const fileInput = $('#file');
const subDiv = $('#sub');

let startTime;
let subs = [];
let i = -1;
let thisSub;

fileInput.addEventListener('change', () => {
    const reader = new FileReader();
    reader.onload = function (e) {
        subs = fromString(e.target.result);
        console.log("After sorting and parsing, ", subs);
        $('#picker').classList.add('hide');
        subDiv.classList.remove('hide');
        startTime = new Date().getTime();
        setInterval(update, 100);
    };
    reader.readAsText(fileInput.files[0]);
});

function update() {
    if (!subs || subs.length <= 0) {
        return;
    }
    const time = new Date().getTime() - startTime;
    const nextSub = subs[i + 1];

    if (time >= nextSub.startTime) {
        thisSub = nextSub;
        i++;

        subDiv.innerHTML = thisSub.text.replace(/\r\n|\n/, '<br>');
        subDiv.classList.remove('empty');
    } else if (time >= thisSub?.endTime) {
        // subDiv.innerText = "";
        subDiv.classList.add('empty');
    }
}
