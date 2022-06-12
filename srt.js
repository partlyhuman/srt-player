const SECOND = 1000, MINUTE = 60 * SECOND, HOUR = 60 * MINUTE;

export function fromString(stringData) {
    const segments = stringData.split(/\r\n\r\n|\n\n/);
    console.log(`Loaded ${segments.length} titles`);
    return segments.map(createSrtData).filter(x => x != null).sort((a, b) => a.startTime > b.startTime);
}

function createSrtData(string) {
    var lines = string.split(/\r\n|\n/);
    // console.log(lines);

    if (lines.length < 3) {
        return null;
    }

    var number = parseInt(lines[0], 10), times = lines[1].split(" --> "), startTime = parseTime(times[0]),
        endTime = parseTime(times[1]), text = lines.slice(2).join("<br>");
    //.replace(/\r\n|\n/, '<br>');

    return { number: number, startTime: startTime, endTime: endTime, text: text };

    // memo[number] = {``
    //     number: number, startTime: startTime, endTime: endTime, text: text
    // };
    //
    // return memo;
}

function parseTime(timeString) {
    var chunks = timeString.split(":"), secondChunks = chunks[2].split(","), hours = parseInt(chunks[0], 10),
        minutes = parseInt(chunks[1], 10), seconds = parseInt(secondChunks[0], 10),
        milliSeconds = parseInt(secondChunks[1], 10);

    return HOUR * hours + MINUTE * minutes + SECOND * seconds + milliSeconds;
}
