var chai = require("chai");
var expect = chai.expect;

var utils = require("../lib/utils.js");

describe("getUpdatedStatisticsForCurrentDay", function () {
    var sTestDate = "some date";

    it("returns statistics for current day when undefined stats are given", function () {
        expect(utils.getUpdatedStatisticsForCurrentDay({}, undefined, sTestDate))
            .to.deep.equal({});
    });

    it("returns statistics for current day when two empty objects are given", function () {
        expect(utils.getUpdatedStatisticsForCurrentDay({}, {}, sTestDate))
            .to.deep.equal({});
    });

    it("returns statistics for current day when previous empty stats and days are given", function () {
        expect(utils.getUpdatedStatisticsForCurrentDay({
            "communion": { number: "123", title: "song title" }
        }, { }, sTestDate)).to.deep.equal({
            "123": { count: 1, lastSung: sTestDate, sungFor: { "communion": true } }
        });
    });

    it("returns statistics for current day when previous stats and days are given", function() {
        expect(utils.getUpdatedStatisticsForCurrentDay({
            "communion": {
                number: "123",
                title: "song title"
            }
        }, {
            "456": { count: 1, lastSung: sTestDate, sungFor: { "entrance": true } }
        }, sTestDate)).to.deep.equal({
            "123": { count: 1, lastSung: sTestDate, sungFor: { "communion": true } },
            "456": { count: 1, lastSung: sTestDate, sungFor: { "entrance": true } }
        });
    });

    it("returns statistics for current day when previous overlapping stats and days are given", function() {
        expect(utils.getUpdatedStatisticsForCurrentDay({
            "communion": {
                number: "123",
                title: "song title"
            }
        }, {
            "123": { count: 1, lastSung: sTestDate, sungFor: { "communion": true } }
        }, sTestDate)).to.deep.equal({
            "123": { count: 2, lastSung: sTestDate, sungFor: { "communion": true } }
        });
    });
});

describe("getUpdatedStatistics", function () {
    it("returns statistics as expected when no days exist", function () {
        expect(utils.getUpdatedStatistics([], [])).to.deep.equal([]);
    });
    it("returns statistics as expected when only one day exists", function () {
        var oTestDay = {
            entrance:  { number: "597", title: "Praise to the Lord" },
            offertory: { number: "829", title: "The Servant Song" },
            communion: { number: "822", title: "See this bread; take and eat and live in me" },
            recession: { number: "851", title: "Companions on the Journey" }
        };

        expect(utils.getUpdatedStatistics([ oTestDay ], ["12-12-1212"]))
            .to.deep.equal([ {
                "597": { count: 1, lastSung: "12-12-1212", sungFor: { "entrance": true } },
                "829": { count: 1, lastSung: "12-12-1212", sungFor: { "offertory": true } },
                "822": { count: 1, lastSung: "12-12-1212", sungFor: { "communion": true } },
                "851": { count: 1, lastSung: "12-12-1212", sungFor: { "recession": true } }
            } ]);
    });
    it("returns statistics as expected when multiple days exist", function () {
        var oTestDay1 = {
            entrance:  { number: "1", title: "Praise to the Lord" },
            offertory: { number: "2", title: "The Servant Song" },
            communion: { number: "3", title: "See this bread; take and eat and live in me" },
            recession: { number: "4", title: "Companions on the Journey" }
        };
        var oTestDay2 = {
            entrance:  { number: "5", title: "Praise to the Lord" },
            offertory: { number: "6", title: "The Servant Song" },
            communion: { number: "7", title: "See this bread; take and eat and live in me" },
            recession: { number: "8", title: "Companions on the Journey" }
        };

        var oResult = utils.getUpdatedStatistics([ oTestDay1, oTestDay2 ], [ "day1", "day2" ]);

        expect(oResult).to.deep.equal([
            {
                "1": { count: 1, lastSung: "day1", sungFor: { "entrance": true } },
                "2": { count: 1, lastSung: "day1", sungFor: { "offertory": true } },
                "3": { count: 1, lastSung: "day1", sungFor: { "communion": true } },
                "4": { count: 1, lastSung: "day1", sungFor: { "recession": true } }
            },
            {
                "1": { count: 1, lastSung: "day1", sungFor: { "entrance": true } },
                "2": { count: 1, lastSung: "day1", sungFor: { "offertory": true } },
                "3": { count: 1, lastSung: "day1", sungFor: { "communion": true } },
                "4": { count: 1, lastSung: "day1", sungFor: { "recession": true } },
                "5": { count: 1, lastSung: "day2", sungFor: { "entrance": true } },
                "6": { count: 1, lastSung: "day2", sungFor: { "offertory": true } },
                "7": { count: 1, lastSung: "day2", sungFor: { "communion": true } },
                "8": { count: 1, lastSung: "day2", sungFor: { "recession": true } }
            }
        ]);
    });
    it("it ignores existing statistics if provided", function () {
        var oTestDay1 = {
            entrance:  { number: "1", title: "Praise to the Lord" },
            offertory: { number: "2", title: "The Servant Song" },
            communion: { number: "3", title: "See this bread; take and eat and live in me" },
            recession: { number: "4", title: "Companions on the Journey" },
            stats: {
                "1": { count: 1 }
            }
        };
        var oTestDay2 = {
            entrance:  { number: "5", title: "Praise to the Lord" },
            offertory: { number: "6", title: "The Servant Song" },
            communion: { number: "7", title: "See this bread; take and eat and live in me" },
            recession: { number: "8", title: "Companions on the Journey" },
            stats: {
                "1": { count: 2 }
            }
        };

        var oResult = utils.getUpdatedStatistics([ oTestDay1, oTestDay2 ], [ "day1", "day2" ]);

        expect(oResult).to.deep.equal([
            {
                "1": { count: 1, lastSung: "day1", sungFor: { "entrance": true } },
                "2": { count: 1, lastSung: "day1", sungFor: { "offertory": true } },
                "3": { count: 1, lastSung: "day1", sungFor: { "communion": true } },
                "4": { count: 1, lastSung: "day1", sungFor: { "recession": true } }
            },
            {
                "1": { count: 1, lastSung: "day1", sungFor: { "entrance": true } },
                "2": { count: 1, lastSung: "day1", sungFor: { "offertory": true } },
                "3": { count: 1, lastSung: "day1", sungFor: { "communion": true } },
                "4": { count: 1, lastSung: "day1", sungFor: { "recession": true } },
                "5": { count: 1, lastSung: "day2", sungFor: { "entrance": true } },
                "6": { count: 1, lastSung: "day2", sungFor: { "offertory": true } },
                "7": { count: 1, lastSung: "day2", sungFor: { "communion": true } },
                "8": { count: 1, lastSung: "day2", sungFor: { "recession": true } }
            }
        ]);
    });
    it("returns cumulative statistics across multiple days", function () {
        var oTestDay1 = {
            entrance:  { number: "1", title: "Praise to the Lord" },
            offertory: { number: "2", title: "The Servant Song" },
            communion: { number: "3", title: "See this bread; take and eat and live in me" },
            recession: { number: "4", title: "Companions on the Journey" }
        };
        var oTestDay2 = {
            entrance:  { number: "5", title: "Praise to the Lord" },
            offertory: { number: "2", title: "The Servant Song" },
            communion: { number: "2", title: "See this bread; take and eat and live in me" },
            recession: { number: "8", title: "Companions on the Journey" }
        };

        var oResult = utils.getUpdatedStatistics([ oTestDay1, oTestDay2, oTestDay2 ], [ "day1", "day2", "day3" ]);

        expect(oResult).to.deep.equal([
            {
                "1": { count: 1, lastSung: "day1", sungFor: { "entrance": true } },
                "2": { count: 1, lastSung: "day1", sungFor: { "offertory": true } },
                "3": { count: 1, lastSung: "day1", sungFor: { "communion": true } },
                "4": { count: 1, lastSung: "day1", sungFor: { "recession": true } }
            },
            {
                "1": { count: 1, lastSung: "day1", sungFor: { "entrance": true } },
                "2": { count: 3, lastSung: "day2", sungFor: { "communion" : true, "offertory": true } },
                "3": { count: 1, lastSung: "day1", sungFor: { "communion": true } },
                "4": { count: 1, lastSung: "day1", sungFor: { "recession": true } },
                "5": { count: 1, lastSung: "day2", sungFor: { "entrance": true } },
                "8": { count: 1, lastSung: "day2", sungFor: { "recession": true } }
            },
            {
                "1": { count: 1, lastSung: "day1", sungFor: { "entrance": true } },
                "2": { count: 5, lastSung: "day3", sungFor: { "communion": true, offertory: true } },
                "3": { count: 1, lastSung: "day1", sungFor: { "communion": true } },
                "4": { count: 1, lastSung: "day1", sungFor: { "recession": true } },
                "5": { count: 2, lastSung: "day3", sungFor: { "entrance": true } },
                "8": { count: 2, lastSung: "day3", sungFor: { "recession": true } }
            }
        ]);
    });
});
