const utils = require("../lib/utils");

// find topics
let sRawSongs = utils.loadFile("./bin/res/scriptural_index.txt");
var oSongScriptures = {};
var sBook = "";
sRawSongs.split("\n").forEach(s => {
    if (s.match(/^(\d+)?[A-Z\s]+$/)) {
        sBook = s;
        return;
    }
    aMatch = s.match(/^([-0-9:,\sa-z&]+)\s?([.]\s)+(\d.*)$/);
    if (aMatch) {
        var sScripture = aMatch[1];
        var sSongs = aMatch[3];
        sSongs.split(", ").forEach(function (sSongNumber) {
            if (!oSongScriptures[sSongNumber]) {
                 oSongScriptures[sSongNumber] = {};
            }
            if (!oSongScriptures[sSongNumber][sBook]) {
                oSongScriptures[sSongNumber][sBook] = [];
            }
            var sReading = sScripture.replace(/\s+$/, "");
            oSongScriptures[sSongNumber][sBook].push(sReading);
        });
    }
});

// update songs
let oSongs = utils.loadJsonFile("songs.json");
oSongs.list = oSongs.list.map(oSong => {
    oSong.scriptures = oSongScriptures[oSong.number] || {};
    return oSong;
});

utils.saveJsonFile("songs.json", oSongs);
