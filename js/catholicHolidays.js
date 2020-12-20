(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.catholicHolidays = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// see https://www.staff.science.uu.nl/~gent0113/easter/easter_text2c.htm

function getEasterSunday(m, iYear) {
    var a = (iYear / 100 | 0) * 1483 - (iYear / 400 | 0) * 2225 + 2613;
    var b = ((iYear % 19 * 3510 + (a / 25 | 0) * 319) / 330 | 0) % 29;
    var c = 148 - b - ((iYear * 5 / 4 | 0) + a - b) % 7;

    return m({ year: iYear, month: (c / 31 | 0) - 1, day: c % 31 + 1 });
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
    return Object.keys(oHolidayGetters).map(function (sFn) {
        var sDescription = sFn.replace(/^get/, "").replace(/([A-Z])/g, " $1").replace(/^\s/, "");
        return {
            description: sDescription,
            date: oHolidayGetters[sFn](m, iYear)
        };
    }).sort(function (oA, oB) {
        if (oA.date.isSame(oB.date)) {
            return 0;
        }
        return oA.date.isBefore(oB.date) ? -1 : 1;
    });
}

function getFeastName(m, oFestiveDay) {
    var iYear = parseInt(oFestiveDay.format("YYYY"), 10);
    var aFestiveDaysThisYear = getAllHolidays(m, iYear).filter(function (o) {
        return o.date.format("DD-MM-YYYY") === oFestiveDay.format("DD-MM-YYYY");
    });

    if (aFestiveDaysThisYear.length > 0) {
        return aFestiveDaysThisYear[0].description;
    }
    return "Sunday";
}

function getNextFestiveDay(m, oStartFromDay) {
    var iYear = parseInt(oStartFromDay.format("YYYY"), 10);
    var aFestiveDaysThisYear = getAllHolidays(m, iYear).map(function (o) {
        return o.date;
    });
    var aFestiveDaysNextYear = getAllHolidays(m, iYear + 1).map(function (o) {
        return o.date;
    });

    var aFestiveDays = [].concat(_toConsumableArray(aFestiveDaysThisYear), _toConsumableArray(aFestiveDaysNextYear));

    return _getNextFestiveDay(m, oStartFromDay.clone(), aFestiveDays);
}

function getPreviousFestiveDay(m, oStartFromDay) {
    var iYear = parseInt(oStartFromDay.format("YYYY"), 10);
    var aFestiveDaysThisYear = getAllHolidays(m, iYear).map(function (o) {
        return o.date;
    });

    return _getPreviousFestiveDay(m, oStartFromDay, aFestiveDaysThisYear);
}

function getFourthSundayOfAdvent(m, iYear) {
    // Nearest Sunday before 25 December
    var o25Dec = m({ year: iYear, month: 11, day: 25 });
    return _getPreviousDay(o25Dec, "Sunday");
}
function getFirstSundayOfAdvent(m, iYear) {
    return getFourthSundayOfAdvent(m, iYear).subtract(3, "week");
}
function getSecondSundayOfAdvent(m, iYear) {
    return getFourthSundayOfAdvent(m, iYear).subtract(2, "week");
}
function getThirdSundayOfAdvent(m, iYear) {
    return getFourthSundayOfAdvent(m, iYear).subtract(1, "week");
}

function getLiturgicalYear(m, mCurrentDate) {
    var iYear = mCurrentDate.year();
    var oFirstSundayOfAdvent = getFirstSundayOfAdvent(m, iYear);

    var iMaybePlusOne = oFirstSundayOfAdvent.diff(mCurrentDate) <= 0 ? 1 : 0;

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

    var aNextFestiveDays = new Array(7).join(",").split(",").map(function (s, iIdx) {
        return fnMapFunction(oStartDay.clone(), iIdx);
    }).filter(function (oMaybeFestive) {
        return _isFestiveDay(oMaybeFestive, aFestiveDaysThisYear);
    });

    return aNextFestiveDays[0];
}

function _getNextDay(oStartDay, sDayName) {
    var oDay = oStartDay.clone();
    while (oDay.format("dddd") !== sDayName) {
        oDay.add(1, "day");
    }
    return oDay;
}

function _getPreviousDay(oStartDay, sDayName) {
    var oDay = oStartDay.clone();
    while (oDay.format("dddd") !== sDayName) {
        oDay.subtract(1, "day");
    }
    return oDay;
}

function _isFestiveDay(oDay, aFestiveDays) {
    if (oDay.format("dddd") === "Sunday") {
        return true;
    }

    var sDay = oDay.format("DD-MM-YYYY");
    var aMappedFestiveDays = aFestiveDays.map(function (oFestiveDay) {
        return oFestiveDay.format("DD-MM-YYYY");
    });

    return aMappedFestiveDays.indexOf(sDay) >= 0;
}

function _generateFeastsAroundDay(m, oAroundDay, iWindow) {
    var iSearchDirection = 0;
    var aLastDayDirection = [oAroundDay, oAroundDay];
    var aFeastsAroundDay = [oAroundDay];
    var oLastSearchDay = null;
    while (iWindow--) {
        iSearchDirection = 1 - iSearchDirection;
        oLastSearchDay = aLastDayDirection[iSearchDirection];

        var oLastSearchDayIncremented = iSearchDirection === 0 ? getPreviousFestiveDay(m, oLastSearchDay) : getNextFestiveDay(m, oLastSearchDay);

        aLastDayDirection[iSearchDirection] = oLastSearchDayIncremented;

        aFeastsAroundDay.push(oLastSearchDayIncremented);
    }
    return aFeastsAroundDay;
}

function _findFeastAroundDayByName(m, oAroundDay, sFeastName) {
    var iSearchWindow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5;

    var aPossibleMatchingFeasts = _generateFeastsAroundDay(m, oAroundDay, iSearchWindow);

    var oMatchingFeast = aPossibleMatchingFeasts.filter(function (oFeast) {
        return getFeastName(m, oFeast) === sFeastName;
    })[0];

    if (!oMatchingFeast) {
        return _findFeastAroundDayByName(m, oAroundDay, sFeastName, iSearchWindow * 2);
    }

    return oMatchingFeast;
}

function getFeastLastYear(m, oCurrentFestiveDay) {
    var oSearchAroundFestiveDay = oCurrentFestiveDay.clone().subtract(1, "year");
    var sDesiredFeastName = getFeastName(m, oCurrentFestiveDay);

    return _findFeastAroundDayByName(m, oSearchAroundFestiveDay, sDesiredFeastName);
}
function getFeastNextYear(m, oCurrentFestiveDay) {
    var oSearchAroundFestiveDay = oCurrentFestiveDay.clone().add(1, "year");
    var sDesiredFeastName = getFeastName(m, oCurrentFestiveDay);

    return _findFeastAroundDayByName(m, oSearchAroundFestiveDay, sDesiredFeastName);
}

var oHolidayGetters = {
    getAllSaints: getAllSaints,
    getEasterSunday: getEasterSunday,
    getChristmasDay: getChristmasDay,
    getFirstSundayOfAdvent: getFirstSundayOfAdvent,
    getSecondSundayOfAdvent: getSecondSundayOfAdvent,
    getThirdSundayOfAdvent: getThirdSundayOfAdvent,
    getFourthSundayOfAdvent: getFourthSundayOfAdvent,
    getOctaveDayOfChristmas: getOctaveDayOfChristmas,
    getEpiphany: getEpiphany,
    getFirstSundayOfLent: getFirstSundayOfLent,
    getSecondSundayOfLent: getSecondSundayOfLent,
    getThirdSundayOfLent: getThirdSundayOfLent,
    getFourthSundayOfLent: getFourthSundayOfLent,
    getPassionSunday: getPassionSunday,
    getPalmSunday: getPalmSunday,
    getHolyThursday: getHolyThursday,
    getGoodFriday: getGoodFriday,
    getHolySaturday: getHolySaturday,
    getAscensionDay: getAscensionDay,
    getCorpusChristi: getCorpusChristi
};

var oPublic = {
    getAllHolidays: getAllHolidays,
    getNextFestiveDay: getNextFestiveDay,
    getPreviousFestiveDay: getPreviousFestiveDay,
    getFeastLastYear: getFeastLastYear,
    getFeastNextYear: getFeastNextYear,
    getFeastName: getFeastName,
    getLiturgicalYear: getLiturgicalYear
};

var oPrivate = {
    _isFestiveDay: _isFestiveDay,
    _getNextFestiveDay: _getNextFestiveDay,
    _getPreviousFestiveDay: _getPreviousFestiveDay,
    _findFeastAroundDayByName: _findFeastAroundDayByName,
    _generateFeastsAroundDay: _generateFeastsAroundDay
};

module.exports = {
    createLibrary: function createLibrary(moment) {
        function bindMethods(oObject) {
            return Object.keys(oObject).reduce(function (oResult, sNext) {
                oResult[sNext] = oObject[sNext].bind(null, moment);
                return oResult;
            }, {});
        }

        return Object.assign({}, bindMethods(oPublic), bindMethods(oHolidayGetters), oPrivate);
    }
};

},{}]},{},[1])(1)
});
