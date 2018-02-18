var chai = require("chai");
var m = require("moment");
var expect = chai.expect;

var oHolidays = require("../lib/catholicHolidays.js").createLibrary(m);

describe("getEasterSunday", function () {
    it("works as expected", function () {
        expect(oHolidays.getEasterSunday(2017).format("DD-MM-YYYY")).to.equal("16-04-2017");
        expect(oHolidays.getEasterSunday(2018).format("DD-MM-YYYY")).to.equal("01-04-2018");
        expect(oHolidays.getEasterSunday(2024).format("DD-MM-YYYY")).to.equal("31-03-2024");
    });
});

describe("getAllSaints", function () {
    it("works as expected", function () {
        expect(oHolidays.getAllSaints(2017).format("DD-MM-YYYY")).to.equal("01-11-2017");
        expect(oHolidays.getAllSaints(2018).format("DD-MM-YYYY")).to.equal("01-11-2018");
        expect(oHolidays.getAllSaints(2024).format("DD-MM-YYYY")).to.equal("01-11-2024");
    });
});

describe("getAllHolidays", function () {
    it("works as expected", function () {
        expect(
            oHolidays.getAllHolidays(2017).map(o => {  return { date: o.date.format("DD-MM-YYYY"), description: o.description }; })
        )
        .to.deep.equal([
          {
            "date": "01-01-2017",
            "description": "Octave Day Of Christmas"
          },
          {
            "date": "06-01-2017",
            "description": "Epiphany"
          },
          {
            "date": "05-03-2017",
            "description": "First Sunday Of Lent"
          },
          {
            "date": "12-03-2017",
            "description": "Second Sunday Of Lent"
          },
          {
            "date": "19-03-2017",
            "description": "Third Sunday Of Lent"
          },
          {
            "date": "26-03-2017",
            "description": "Fourth Sunday Of Lent"
          },
          {
            "date": "16-04-2017",
            "description": "Easter Sunday"
          },
          {
            "date": "01-11-2017",
            "description": "All Saints"
          },
          {
            "date": "25-12-2017",
            "description": "Christmas Day"
          }
        ]);
    });
});

describe("_isFestiveDay", function () {
    it("works as expected", function () {
        expect(
            oHolidays._isFestiveDay(
                m({ year: 2010, month: 10, day: 12, hours: 12, minutes: 12}),
                [
                    m({ year: 2011, month: 10, day: 12, hours: 16, minutes: 12}),
                ]
            )
        ).to.equal(false);

        expect(
            oHolidays._isFestiveDay(
                m({ year: 2010, month: 10, day: 12, hours: 12, minutes: 12}),
                [
                    m({ year: 2010, month: 10, day: 12, hours: 23, minutes: 12}),
                ]
            )
        ).to.equal(true);

        expect(
            oHolidays._isFestiveDay(
                m({ year: 2010, month: 10, day: 12, hours: 12, minutes: 12}),
                [
                    m({ year: 2011, month: 10, day: 12 }),
                    m({ year: 2010, month: 12, day: 12 }),
                    m({ year: 2013, month: 10, day: 12 }),
                    m({ year: 2010, month: 10, day: 13 })
                ]
            )
        ).to.equal(false);

        expect(
            oHolidays._isFestiveDay(
                m({ year: 2010, month: 10, day: 12, hours: 12, minutes: 12}),
                [
                    m({ year: 2011, month: 10, day: 12 }),
                    m({ year: 2010, month: 11, day: 12 }),
                    m({ year: 2013, month: 10, day: 12 }),
                    m({ year: 2010, month: 10, day: 12 })
                ]
            )
        ).to.equal(true);

        expect(
            oHolidays._isFestiveDay(
                m({ year: 2017, month: 10, day: 5 }),  // a Sunday
                [
                    // ... even without festive days, a Sunday is festive.
                ]
            )
        ).to.equal(true);
    });
});

describe("getNextFestiveDay", function () {
    it("works as expected", function () {
        var oStartDay = m({ year: 2017, month: 10, day: 13 }); // a Monday (13/11/2017)
        expect(
            oHolidays._getNextFestiveDay(m, oStartDay, []).format("DD-MM-YYYY")
        ).to.equal("19-11-2017");

        expect(
            oHolidays._getNextFestiveDay(m, oStartDay, [
                // with a holiday inbetween
                m({ year: 2017, month: 10, day: 17 })
            ]).format("DD-MM-YYYY")
        ).to.equal("17-11-2017");

        expect(
            oHolidays._getNextFestiveDay(m, oStartDay, [
                // with a holiday afterwards
                m({ year: 2017, month: 10, day: 21 })
            ]).format("DD-MM-YYYY")
        ).to.equal("19-11-2017");


        var oSunday = m({ year: 2017, month: 10, day: 19 });
        var oNextSunday = m({ year: 2017, month: 10, day: 26 });
        expect(
            oHolidays._getNextFestiveDay(m, oSunday, []).format("DD-MM-YYYY")
        ).to.equal(oNextSunday.format("DD-MM-YYYY")); // does not give the same sunday, but goes to the next one

        // Getting the sunday after all saints
        var oAllSaints = m({ year: 2017, month: 10, day: 1 }); // Wed
        expect(
            oHolidays.getNextFestiveDay(oAllSaints).format("DD-MM-YYYY")
        ).to.equal("05-11-2017");

        // Getting the octave day of christmas after new year's eve
        var oNewYearsEve = m({ year: 2017, month: 11, day: 31 });
        expect(
            oHolidays.getNextFestiveDay(oNewYearsEve).format("DD-MM-YYYY")
        ).to.equal("01-01-2018");
    });
});

describe("getPreviousFestiveDay", function () {
    it("works as expected", function () {
        var oSunday1 = m({ year: 2017, month: 10, day: 19 });
        var oNextSunday1 = m({ year: 2017, month: 10, day: 26 });

        var oSunday2 = m({ year: 2017, month: 9, day: 31 });      // Tuesday
        var oNextSunday2 = m({ year: 2017, month: 10, day: 5 });  // Sunday

        var oAllSaints = m({ year: 2017, month: 10, day: 1 }); // Wed
        var oAllSaintsPlusOne = m({ year: 2017, month: 10, day: 2 }); // Thu
        expect(
            oHolidays.getPreviousFestiveDay(oNextSunday1).format("DD-MM-YYYY")
        ).to.equal(oSunday1.format("DD-MM-YYYY")); // does not give the same sunday, but goes to the next one

        // All saints: 01-11-2017
        expect(
            oHolidays.getPreviousFestiveDay(oNextSunday2).format("DD-MM-YYYY")
        ).to.equal("01-11-2017"); // gives all saints

        // Getting the sunday before all saints
        expect(
            oHolidays.getPreviousFestiveDay(oAllSaints).format("DD-MM-YYYY")
        ).to.equal("29-10-2017"); // gives all saints

        // Two holidays between sundays
        expect(
            oHolidays._getPreviousFestiveDay(m, oNextSunday2, [
                oAllSaints,
                oAllSaintsPlusOne
            ]).format("DD-MM-YYYY")
        ).to.equal(oAllSaintsPlusOne.format("DD-MM-YYYY")); // gives all saints plus one

        // Getting the 31 of last year from first of January
        var oOctaveDayOfChristmas2018 = m({ year: 2018, month: 0, day: 1 });
        expect(
            oHolidays.getPreviousFestiveDay(oOctaveDayOfChristmas2018).format("DD-MM-YYYY")
        ).to.equal("31-12-2017"); // gives all saints
    });
});

describe("getFeastName", function () {
    it("works as expected", function () {
        var oSunday = m({ year: 2017, month: 10, day: 19 });
        expect(
            oHolidays.getFeastName(oSunday)
        ).to.equal("Sunday");

        // All saints: 01-11-2017
        var oAllSaints = m({ year: 2017, month: 10, day: 1 }); // Wed
        expect(
            oHolidays.getFeastName(oAllSaints)
        ).to.equal("All Saints");
    });
});
