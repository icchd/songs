const utils = require("../lib/utils");

var oLastStats = {};
var oPreviousSongs = {};

var aSortedFilenames = utils.getSortedFilenames("./save");

var aSongHistory = aSortedFilenames.map(sFileName => utils.loadJsonFile(sFileName));
var aFormattedDates = utils.getDatesFromFilenames(aSortedFilenames);
var aUpdatedStatistics = utils.getUpdatedStatistics(aSongHistory, aFormattedDates);

// rewrite each file
aSortedFilenames.forEach(sFile => {
    var oSongsWithoutStats = aSongHistory.shift();
    var oStats = aUpdatedStatistics.shift();
    var oSongsWithStats = Object.assign({}, oSongsWithoutStats, { stats: oStats });
    utils.saveJsonFile(sFile, oSongsWithStats);
});
