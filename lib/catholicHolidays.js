// see https://www.staff.science.uu.nl/~gent0113/easter/easter_text2c.htm

function getEasterSunday(m, iYear) {
    var a = (iYear / 100 | 0) * 1483 - (iYear / 400 | 0) * 2225 + 2613;
    var b = ((iYear % 19 * 3510 + (a / 25 | 0) * 319) / 330 | 0) % 29;
    var c = 148 - b - ((iYear * 5 / 4 | 0) + a - b) % 7;

    return m({year: iYear, month: (c / 31 | 0) - 1, day: c % 31 + 1});
}

function getCorpusChristi(m, iYear) {
    return getEasterSunday(m, iYear).add(60, "days");
}

function getFirstSundayOfLent(m, iYear) {
    return getEasterSunday(m, iYear).subtract(6, "weeks");
}
function getSecondSundayOfLent(m, iYear) {
    return getEasterSunday(m, iYear).subtract(5, "weeks");
}
function getThirdSundayOfLent(m, iYear) {
    return getEasterSunday(m, iYear).subtract(4, "weeks");
}
function getFourthSundayOfLent(m, iYear) {
    return getEasterSunday(m, iYear).subtract(3, "weeks");
}
function getPassionSunday(m, iYear) {
    return getEasterSunday(m, iYear).subtract(2, "weeks");
}
function getPalmSunday(m, iYear) {
    return getEasterSunday(m, iYear).subtract(1, "weeks");
}
function getHolyThursday(m, iYear) {
    return getEasterSunday(m, iYear).subtract(3, "days");
}
function getGoodFriday(m, iYear) {
    return getEasterSunday(m, iYear).subtract(2, "days");
}
function getHolySaturday(m, iYear) {
    return getEasterSunday(m, iYear).subtract(1, "days");
}
function getEpiphany(m, iYear) {
    return m({ year: iYear, month: 0, day: 6 });
}
function getAscensionDay(m, iYear) {
    return getEasterSunday(m, iYear).add(39, "days");
}

function getAllSaints(m, iYear) {
    return m({ year: iYear, month: 10, day: 0 });
}

function getChristmasDay(m, iYear) {
    return m({ year: iYear, month: 11, day: 25 });
}

function getOctaveDayOfChristmas(m, iYear) {
    var oChristmasDayPreviousYear = getChristmasDay(m, iYear - 1);
    return oChristmasDayPreviousYear.add(7, "days");
}

function getAllHolidays(m, iYear) {
    return Object.keys(oHolidayGetters).map(sFn => {
        var sDescription = sFn.replace(/^get/, "").replace(/([A-Z])/g, " $1").replace(/^\s/, "");
        return {
            description: sDescription,
            date: oHolidayGetters[sFn](m, iYear)
        };
    }).sort( (oA, oB) => {
        if (oA.date.isSame(oB.date)) {
            return 0;
        }
        return oA.date.isBefore(oB.date) ? -1 : 1;
    });
}

function getFeastName(m, oFestiveDay) {
    var iYear = parseInt(oFestiveDay.format("YYYY"), 10);
    var aFestiveDaysThisYear = getAllHolidays(m, iYear).filter(o => o.date.format("DD-MM-YYYY") === oFestiveDay.format("DD-MM-YYYY"));

    if (aFestiveDaysThisYear.length > 0) {
        return aFestiveDaysThisYear[0].description;
    }
    return "Sunday";
}

function getNextFestiveDay(m, oStartFromDay) {
    var iYear = parseInt(oStartFromDay.format("YYYY"), 10);
    var aFestiveDaysThisYear = getAllHolidays(m, iYear).map(o => o.date);
    var aFestiveDaysNextYear = getAllHolidays(m, iYear + 1).map(o => o.date);

    var aFestiveDays = [...aFestiveDaysThisYear, ...aFestiveDaysNextYear];

    return _getNextFestiveDay(m, oStartFromDay.clone(), aFestiveDays);
}

function getPreviousFestiveDay(m, oStartFromDay) {
    var iYear = parseInt(oStartFromDay.format("YYYY"), 10);
    var aFestiveDaysThisYear = getAllHolidays(m, iYear).map(o => o.date);

    return _getPreviousFestiveDay(m, oStartFromDay, aFestiveDaysThisYear);
}

function getFirstSundayOfAdvent(m, iYear) {
    // Nearest Sunday to 30 November
    var o30Nov = m({ year: iYear, month: 10, day: 30 });
    var iWeekDay30Nov = o30Nov.weekday();
    return o30Nov.add(7 - iWeekDay30Nov, "days");
}
function getSecondSundayOfAdvent(m, iYear) {
    return getFirstSundayOfAdvent(m, iYear).add(1, "week");
}
function getThirdSundayOfAdvent(m, iYear) {
    return getSecondSundayOfAdvent(m, iYear).add(1, "week");
}
function getFourthSundayOfAdvent(m, iYear) {
    return getThirdSundayOfAdvent(m, iYear).add(1, "week");
}

function getLiturgicalYear(m, mCurrentDate) {
    var iYear = mCurrentDate.year();
    var oFirstSundayOfAdvent = getFirstSundayOfAdvent(m, iYear);

    var iMaybePlusOne = oFirstSundayOfAdvent.diff(mCurrentDate) <= 0
        ? 1
        : 0;

    return ["C", "A", "B"][(iYear + iMaybePlusOne) % 3];
}

function _getNextFestiveDay(m, oStartFromDay, aFestiveDaysThisYear) {
    return _getSuccessiveFestiveDay(m, oStartFromDay, aFestiveDaysThisYear, true /* forward */);
}

function _getPreviousFestiveDay(m, oStartFromDay, aFestiveDaysThisYear) {
    return _getSuccessiveFestiveDay(m, oStartFromDay, aFestiveDaysThisYear.reverse(), false /* backward */);
}

function _getSuccessiveFestiveDay(m, oStartDay, aFestiveDaysThisYear, bForwardDirection) {
    function fnMapForward(oDay, iIncrementIdx) {
        return oDay.add(iIncrementIdx + 1, "days");
    }

    function fnMapBackward(oDay, iIncrementIdx) {
        return oDay.subtract(iIncrementIdx + 1, "days");
    }

    var fnMapFunction = bForwardDirection ? fnMapForward : fnMapBackward;

    var aNextFestiveDays = new Array(7).join(",").split(",")
        .map((s, iIdx) => fnMapFunction(oStartDay.clone(), iIdx))
        .filter(oMaybeFestive => _isFestiveDay(oMaybeFestive, aFestiveDaysThisYear));

    return aNextFestiveDays[0];
}

function _isFestiveDay(oDay, aFestiveDays) {
    if (oDay.format("dddd") === "Sunday") {
        return true;
    }

    var sDay = oDay.format("DD-MM-YYYY");
    var aMappedFestiveDays = aFestiveDays.map(oFestiveDay => oFestiveDay.format("DD-MM-YYYY"));

    return aMappedFestiveDays.indexOf(sDay) >= 0;
}

var oHolidayGetters = {
    getAllSaints,
    getEasterSunday,
    getChristmasDay,
    getFirstSundayOfAdvent,
    getSecondSundayOfAdvent,
    getThirdSundayOfAdvent,
    getFourthSundayOfAdvent,
    getOctaveDayOfChristmas,
    getEpiphany,
    getFirstSundayOfLent,
    getSecondSundayOfLent,
    getThirdSundayOfLent,
    getFourthSundayOfLent,
    getPassionSunday,
    getPalmSunday,
    getHolyThursday,
    getGoodFriday,
    getHolySaturday,
    getAscensionDay,
    getCorpusChristi
};

var oPublic = {
    getAllHolidays,
    getNextFestiveDay,
    getPreviousFestiveDay,
    getFeastName,
    getLiturgicalYear
};

var oPrivate = {
    _isFestiveDay,
    _getNextFestiveDay,
    _getPreviousFestiveDay
};

module.exports = {
    createLibrary: function (moment) {
        function bindMethods(oObject) {
            return Object.keys(oObject).reduce(function (oResult, sNext) {
                oResult[sNext] = oObject[sNext].bind(null, moment);
                return oResult;
            }, {});
        }

        return Object.assign({}, bindMethods(oPublic), bindMethods(oHolidayGetters), oPrivate);
    }
};
