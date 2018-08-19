const utils = require("../lib/utils");

let aSongLinks = utils.loadJsonFile("./bin/res/links_index.json");
var oSongLinks = {};
var sTopic = "";
aSongLinks.forEach(function (o) {
    // find number
    var sNumber = null;
    var sTitle = null;
    var oMatch = o.title.match(/(\d+)/);
    if (oMatch) {
        sNumber = oMatch[1];
    }

    try {
        sTitle = o.title.split(/\d+:?\s*/)[1].trim();
        oSongLinks[sNumber] = { title: sTitle, link: o.link };
    } catch (e) {
        console.log("Cannot find song number: " + o.title);
    }
});

// update songs
let oSongs = utils.loadJsonFile("songs.json");
oSongs.list = oSongs.list.map(oSong => {
    var sNumber = oSong.number;
    if (oSongLinks.hasOwnProperty(sNumber)) {
        let oSongLink = oSongLinks[sNumber];
        let bHaveLinks = oSongLinks.hasOwnProperty("links");
        if (!bHaveLinks) {
            oSong.links = [];
        }
        if (oSong.links.indexOf(oSongLink.link) === -1) {
            oSong.links.push(oSongLink.link);
        }
        if (oSong.links.length === 0) {
            delete oSong.links;
        }
    }

    return oSong;
});

utils.saveJsonFile("songs.json", oSongs);
