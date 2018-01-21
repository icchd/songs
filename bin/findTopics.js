const utils = require("../lib/utils");

// find topics
let sRawSongs = utils.loadFile("./bin/res/topical_index.txt");
var oSongTopics = {};
var sTopic = "";
sRawSongs.split("\n").forEach(s => {
    if (s.match(/^[A-Z\s]+$/)) {
        sTopic = s;
        return;
    }
    aMatch = s.match(/^(\d+)\s/);
    if (aMatch) {
        let sSongNumber = aMatch[1];
        if (!oSongTopics[sSongNumber]) {
            oSongTopics[sSongNumber] = [];
        }
        oSongTopics[sSongNumber].push(sTopic);
    }
});

// update songs
let oSongs = utils.loadJsonFile("songs.json");
oSongs.list = oSongs.list.map(oSong => {
    oSong.topics = oSongTopics[oSong.number] || [];
    return oSong;
});

utils.saveJsonFile("songs.json", oSongs);
