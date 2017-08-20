const fs = require("fs");

function cloneJson(oJson) {
    return JSON.parse(JSON.stringify(oJson));
}

function loadJsonFile(sFileName) {
    return JSON.parse(fs.readFileSync(sFileName, 'utf8'));
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

    var oCurrentStats = Object.assign({}, oPreviousStats);

    Object.keys(oCurrentSongs).map(sMoment => oCurrentSongs[sMoment].number)
        .forEach(sNumber => {
            var iCurrentCount = (oCurrentStats[sNumber] || {}).count || 0;
            oCurrentStats[sNumber] = {
                count: iCurrentCount + 1,
                lastSung: sDateLabel
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
    loadJsonFile,
    saveJsonFile,
    getUpdatedStatisticsForCurrentDay,
    getUpdatedStatistics,
    getSortedFilenames,
    getDatesFromFilenames
};