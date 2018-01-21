const fs = require("fs");

function cloneJson(oJson) {
    return JSON.parse(JSON.stringify(oJson));
}

function loadFile(sFileName) {
    return fs.readFileSync(sFileName, 'utf8');
}

function loadJsonFile(sFileName) {
    return JSON.parse(loadFile(sFileName));
}

function saveJsonFile(sFileName, oJson) {
    const content = JSON.stringify(oJson, null, 3);
    fs.writeFileSync(sFileName, content, 'utf8');
}

function getUpdatedStatisticsForCurrentDay(oCurrentSongs, oPreviousStats = {}, sDateLabel) {
    // returns updated json statistics
    if (!oCurrentSongs ||
        Object.keys(oCurrentSongs).length === 0) {

        return oPreviousStats;
    }

    // build new stats on top of current stats
    var oCurrentStats = Object.assign({}, oPreviousStats);

    Object.keys(oCurrentSongs).forEach(sMoment => {
        var sNumber = oCurrentSongs[sMoment].number;

        var oPreviousNumberStats = oCurrentStats[sNumber] || {};
        var oPreviousNumberSungFor = oPreviousNumberStats.sungFor || {};

        var oAllMoments = {};
        oAllMoments[sMoment] = true; // current song

        // add moments from previous times
        Object.keys(oPreviousNumberSungFor).forEach(function (sMoment) {
            oAllMoments[sMoment] = true;
        });

        var iCurrentCount = (oCurrentStats[sNumber] || {}).count || 0;

        oCurrentStats[sNumber] = {
            count: iCurrentCount + 1,
            lastSung: sDateLabel,
            sungFor: oAllMoments
        };
    });

    return oCurrentStats;
}

function removeStatsFromObject(oSongsWithStats) {
    var oSongs = {};
    Object.keys(oSongsWithStats).filter(sKey => sKey !== "stats")
        .forEach(sMoment => { oSongs[sMoment] = oSongsWithStats[sMoment]; });
    return oSongs;
}

function getUpdatedStatistics(aSortedSongsSung, aDateLabels) {
    var aStats = [];

    aSortedSongsSung
        .map(oSongWithStats => removeStatsFromObject(oSongWithStats))
        .reduce((oPrevStats, oCurrSongs) => {
            // start from previous statistics
            var oNewStats = getUpdatedStatisticsForCurrentDay(oCurrSongs, oPrevStats, aDateLabels.shift());

            aStats.push(oNewStats);

            return oNewStats;
        }, {});

    return aStats;
}

function getDatesFromFilenames(aFiles) {
    return aFiles.map(sFile => {
        const sJustTheFilename = sFile.split("/").pop();
        const [d, m, y] = sJustTheFilename.replace(".json", "").split("-");
        return `${d}-${m}-${y}`;
    });
}

function getSortedFilenames(sPath) {
    // returns array of sorted filenames
    return fs.readdirSync(sPath).map(sFile => {
        const [d, m, y] = sFile.replace(".json", "").split("-");
        return {
            file: sFile,
            sortableDate: parseInt(`${y}${m}${d}`, 10)
        };
    }).sort((a, b) => {
        if (a.sortableDate < b.sortableDate) { return -1 };
        if (a.sortableDate === b.sortableDate) { return 0 };
        return 1;
    }).map(o => {
        return sPath + "/" + o.file;
    });
}

module.exports = {
    loadFile,
    loadJsonFile,
    saveJsonFile,
    getUpdatedStatisticsForCurrentDay,
    getUpdatedStatistics,
    getSortedFilenames,
    getDatesFromFilenames
};
