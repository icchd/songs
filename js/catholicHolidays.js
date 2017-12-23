(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.catholicHolidays = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getEasterSunday(m, iYear) {
    var a = (iYear / 100 | 0) * 1483 - (iYear / 400 | 0) * 2225 + 2613;
    var b = ((iYear % 19 * 3510 + (a / 25 | 0) * 319) / 330 | 0) % 29;
    var c = 148 - b - ((iYear * 5 / 4 | 0) + a - b) % 7;

    return m({ year: iYear, month: (c / 31 | 0) - 1, day: c % 31 + 1 });
}

function getEpiphany(m, iYear) {
    return m({ year: iYear, month: 0, day: 6 });
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
    var aFestiveDaysLastYear = getAllHolidays(m, iYear - 1).map(function (o) {
        return o.date;
    });

    var aFestiveDays = [].concat(_toConsumableArray(aFestiveDaysLastYear), _toConsumableArray(aFestiveDaysThisYear));

    return _getPreviousFestiveDay(m, oStartFromDay, aFestiveDaysThisYear);
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

var oHolidayGetters = {
    getAllSaints: getAllSaints,
    getEasterSunday: getEasterSunday,
    getChristmasDay: getChristmasDay,
    getOctaveDayOfChristmas: getOctaveDayOfChristmas,
    getEpiphany: getEpiphany
};

var oPublic = {
    getAllHolidays: getAllHolidays,
    getNextFestiveDay: getNextFestiveDay,
    getPreviousFestiveDay: getPreviousFestiveDay,
    getFeastName: getFeastName
};

var oPrivate = {
    _isFestiveDay: _isFestiveDay,
    _getNextFestiveDay: _getNextFestiveDay,
    _getPreviousFestiveDay: _getPreviousFestiveDay
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