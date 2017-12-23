(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.moment = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

var hookCallback;

function hooks () {
    return hookCallback.apply(null, arguments);
}

// This is done to register the method called with moment()
// without creating circular dependencies.
function setHookCallback (callback) {
    hookCallback = callback;
}

function isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}

function isObject(input) {
    // IE8 will treat undefined and null as object if it wasn't for
    // input != null
    return input != null && Object.prototype.toString.call(input) === '[object Object]';
}

function isObjectEmpty(obj) {
    if (Object.getOwnPropertyNames) {
        return (Object.getOwnPropertyNames(obj).length === 0);
    } else {
        var k;
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                return false;
            }
        }
        return true;
    }
}

function isUndefined(input) {
    return input === void 0;
}

function isNumber(input) {
    return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}

function map(arr, fn) {
    var res = [], i;
    for (i = 0; i < arr.length; ++i) {
        res.push(fn(arr[i], i));
    }
    return res;
}

function hasOwnProp(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
}

function extend(a, b) {
    for (var i in b) {
        if (hasOwnProp(b, i)) {
            a[i] = b[i];
        }
    }

    if (hasOwnProp(b, 'toString')) {
        a.toString = b.toString;
    }

    if (hasOwnProp(b, 'valueOf')) {
        a.valueOf = b.valueOf;
    }

    return a;
}

function createUTC (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, true).utc();
}

function defaultParsingFlags() {
    // We need to deep clone this object.
    return {
        empty           : false,
        unusedTokens    : [],
        unusedInput     : [],
        overflow        : -2,
        charsLeftOver   : 0,
        nullInput       : false,
        invalidMonth    : null,
        invalidFormat   : false,
        userInvalidated : false,
        iso             : false,
        parsedDateParts : [],
        meridiem        : null,
        rfc2822         : false,
        weekdayMismatch : false
    };
}

function getParsingFlags(m) {
    if (m._pf == null) {
        m._pf = defaultParsingFlags();
    }
    return m._pf;
}

var some;
if (Array.prototype.some) {
    some = Array.prototype.some;
} else {
    some = function (fun) {
        var t = Object(this);
        var len = t.length >>> 0;

        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(this, t[i], i, t)) {
                return true;
            }
        }

        return false;
    };
}

function isValid(m) {
    if (m._isValid == null) {
        var flags = getParsingFlags(m);
        var parsedParts = some.call(flags.parsedDateParts, function (i) {
            return i != null;
        });
        var isNowValid = !isNaN(m._d.getTime()) &&
            flags.overflow < 0 &&
            !flags.empty &&
            !flags.invalidMonth &&
            !flags.invalidWeekday &&
            !flags.weekdayMismatch &&
            !flags.nullInput &&
            !flags.invalidFormat &&
            !flags.userInvalidated &&
            (!flags.meridiem || (flags.meridiem && parsedParts));

        if (m._strict) {
            isNowValid = isNowValid &&
                flags.charsLeftOver === 0 &&
                flags.unusedTokens.length === 0 &&
                flags.bigHour === undefined;
        }

        if (Object.isFrozen == null || !Object.isFrozen(m)) {
            m._isValid = isNowValid;
        }
        else {
            return isNowValid;
        }
    }
    return m._isValid;
}

function createInvalid (flags) {
    var m = createUTC(NaN);
    if (flags != null) {
        extend(getParsingFlags(m), flags);
    }
    else {
        getParsingFlags(m).userInvalidated = true;
    }

    return m;
}

// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
var momentProperties = hooks.momentProperties = [];

function copyConfig(to, from) {
    var i, prop, val;

    if (!isUndefined(from._isAMomentObject)) {
        to._isAMomentObject = from._isAMomentObject;
    }
    if (!isUndefined(from._i)) {
        to._i = from._i;
    }
    if (!isUndefined(from._f)) {
        to._f = from._f;
    }
    if (!isUndefined(from._l)) {
        to._l = from._l;
    }
    if (!isUndefined(from._strict)) {
        to._strict = from._strict;
    }
    if (!isUndefined(from._tzm)) {
        to._tzm = from._tzm;
    }
    if (!isUndefined(from._isUTC)) {
        to._isUTC = from._isUTC;
    }
    if (!isUndefined(from._offset)) {
        to._offset = from._offset;
    }
    if (!isUndefined(from._pf)) {
        to._pf = getParsingFlags(from);
    }
    if (!isUndefined(from._locale)) {
        to._locale = from._locale;
    }

    if (momentProperties.length > 0) {
        for (i = 0; i < momentProperties.length; i++) {
            prop = momentProperties[i];
            val = from[prop];
            if (!isUndefined(val)) {
                to[prop] = val;
            }
        }
    }

    return to;
}

var updateInProgress = false;

// Moment prototype object
function Moment(config) {
    copyConfig(this, config);
    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
    if (!this.isValid()) {
        this._d = new Date(NaN);
    }
    // Prevent infinite loop in case updateOffset creates new moment
    // objects.
    if (updateInProgress === false) {
        updateInProgress = true;
        hooks.updateOffset(this);
        updateInProgress = false;
    }
}

function isMoment (obj) {
    return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
}

function absFloor (number) {
    if (number < 0) {
        // -0 -> 0
        return Math.ceil(number) || 0;
    } else {
        return Math.floor(number);
    }
}

function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion,
        value = 0;

    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = absFloor(coercedNumber);
    }

    return value;
}

// compare two arrays, return the number of differences
function compareArrays(array1, array2, dontConvert) {
    var len = Math.min(array1.length, array2.length),
        lengthDiff = Math.abs(array1.length - array2.length),
        diffs = 0,
        i;
    for (i = 0; i < len; i++) {
        if ((dontConvert && array1[i] !== array2[i]) ||
            (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
            diffs++;
        }
    }
    return diffs + lengthDiff;
}

function warn(msg) {
    if (hooks.suppressDeprecationWarnings === false &&
            (typeof console !==  'undefined') && console.warn) {
        console.warn('Deprecation warning: ' + msg);
    }
}

function deprecate(msg, fn) {
    var firstTime = true;

    return extend(function () {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(null, msg);
        }
        if (firstTime) {
            var args = [];
            var arg;
            for (var i = 0; i < arguments.length; i++) {
                arg = '';
                if (typeof arguments[i] === 'object') {
                    arg += '\n[' + i + '] ';
                    for (var key in arguments[0]) {
                        arg += key + ': ' + arguments[0][key] + ', ';
                    }
                    arg = arg.slice(0, -2); // Remove trailing comma and space
                } else {
                    arg = arguments[i];
                }
                args.push(arg);
            }
            warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
            firstTime = false;
        }
        return fn.apply(this, arguments);
    }, fn);
}

var deprecations = {};

function deprecateSimple(name, msg) {
    if (hooks.deprecationHandler != null) {
        hooks.deprecationHandler(name, msg);
    }
    if (!deprecations[name]) {
        warn(msg);
        deprecations[name] = true;
    }
}

hooks.suppressDeprecationWarnings = false;
hooks.deprecationHandler = null;

function isFunction(input) {
    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
}

function set (config) {
    var prop, i;
    for (i in config) {
        prop = config[i];
        if (isFunction(prop)) {
            this[i] = prop;
        } else {
            this['_' + i] = prop;
        }
    }
    this._config = config;
    // Lenient ordinal parsing accepts just a number in addition to
    // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
    // TODO: Remove "ordinalParse" fallback in next major release.
    this._dayOfMonthOrdinalParseLenient = new RegExp(
        (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
            '|' + (/\d{1,2}/).source);
}

function mergeConfigs(parentConfig, childConfig) {
    var res = extend({}, parentConfig), prop;
    for (prop in childConfig) {
        if (hasOwnProp(childConfig, prop)) {
            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                res[prop] = {};
                extend(res[prop], parentConfig[prop]);
                extend(res[prop], childConfig[prop]);
            } else if (childConfig[prop] != null) {
                res[prop] = childConfig[prop];
            } else {
                delete res[prop];
            }
        }
    }
    for (prop in parentConfig) {
        if (hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])) {
            // make sure changes to properties don't modify parent config
            res[prop] = extend({}, res[prop]);
        }
    }
    return res;
}

function Locale(config) {
    if (config != null) {
        this.set(config);
    }
}

var keys;

if (Object.keys) {
    keys = Object.keys;
} else {
    keys = function (obj) {
        var i, res = [];
        for (i in obj) {
            if (hasOwnProp(obj, i)) {
                res.push(i);
            }
        }
        return res;
    };
}

var defaultCalendar = {
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    nextWeek : 'dddd [at] LT',
    lastDay : '[Yesterday at] LT',
    lastWeek : '[Last] dddd [at] LT',
    sameElse : 'L'
};

function calendar (key, mom, now) {
    var output = this._calendar[key] || this._calendar['sameElse'];
    return isFunction(output) ? output.call(mom, now) : output;
}

var defaultLongDateFormat = {
    LTS  : 'h:mm:ss A',
    LT   : 'h:mm A',
    L    : 'MM/DD/YYYY',
    LL   : 'MMMM D, YYYY',
    LLL  : 'MMMM D, YYYY h:mm A',
    LLLL : 'dddd, MMMM D, YYYY h:mm A'
};

function longDateFormat (key) {
    var format = this._longDateFormat[key],
        formatUpper = this._longDateFormat[key.toUpperCase()];

    if (format || !formatUpper) {
        return format;
    }

    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
        return val.slice(1);
    });

    return this._longDateFormat[key];
}

var defaultInvalidDate = 'Invalid date';

function invalidDate () {
    return this._invalidDate;
}

var defaultOrdinal = '%d';
var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

function ordinal (number) {
    return this._ordinal.replace('%d', number);
}

var defaultRelativeTime = {
    future : 'in %s',
    past   : '%s ago',
    s  : 'a few seconds',
    ss : '%d seconds',
    m  : 'a minute',
    mm : '%d minutes',
    h  : 'an hour',
    hh : '%d hours',
    d  : 'a day',
    dd : '%d days',
    M  : 'a month',
    MM : '%d months',
    y  : 'a year',
    yy : '%d years'
};

function relativeTime (number, withoutSuffix, string, isFuture) {
    var output = this._relativeTime[string];
    return (isFunction(output)) ?
        output(number, withoutSuffix, string, isFuture) :
        output.replace(/%d/i, number);
}

function pastFuture (diff, output) {
    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
}

var aliases = {};

function addUnitAlias (unit, shorthand) {
    var lowerCase = unit.toLowerCase();
    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
}

function normalizeUnits(units) {
    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
}

function normalizeObjectUnits(inputObject) {
    var normalizedInput = {},
        normalizedProp,
        prop;

    for (prop in inputObject) {
        if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
                normalizedInput[normalizedProp] = inputObject[prop];
            }
        }
    }

    return normalizedInput;
}

var priorities = {};

function addUnitPriority(unit, priority) {
    priorities[unit] = priority;
}

function getPrioritizedUnits(unitsObj) {
    var units = [];
    for (var u in unitsObj) {
        units.push({unit: u, priority: priorities[u]});
    }
    units.sort(function (a, b) {
        return a.priority - b.priority;
    });
    return units;
}

function zeroFill(number, targetLength, forceSign) {
    var absNumber = '' + Math.abs(number),
        zerosToFill = targetLength - absNumber.length,
        sign = number >= 0;
    return (sign ? (forceSign ? '+' : '') : '-') +
        Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
}

var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

var formatFunctions = {};

var formatTokenFunctions = {};

// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken (token, padded, ordinal, callback) {
    var func = callback;
    if (typeof callback === 'string') {
        func = function () {
            return this[callback]();
        };
    }
    if (token) {
        formatTokenFunctions[token] = func;
    }
    if (padded) {
        formatTokenFunctions[padded[0]] = function () {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        };
    }
    if (ordinal) {
        formatTokenFunctions[ordinal] = function () {
            return this.localeData().ordinal(func.apply(this, arguments), token);
        };
    }
}

function removeFormattingTokens(input) {
    if (input.match(/\[[\s\S]/)) {
        return input.replace(/^\[|\]$/g, '');
    }
    return input.replace(/\\/g, '');
}

function makeFormatFunction(format) {
    var array = format.match(formattingTokens), i, length;

    for (i = 0, length = array.length; i < length; i++) {
        if (formatTokenFunctions[array[i]]) {
            array[i] = formatTokenFunctions[array[i]];
        } else {
            array[i] = removeFormattingTokens(array[i]);
        }
    }

    return function (mom) {
        var output = '', i;
        for (i = 0; i < length; i++) {
            output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
        }
        return output;
    };
}

// format date using native date object
function formatMoment(m, format) {
    if (!m.isValid()) {
        return m.localeData().invalidDate();
    }

    format = expandFormat(format, m.localeData());
    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

    return formatFunctions[format](m);
}

function expandFormat(format, locale) {
    var i = 5;

    function replaceLongDateFormatTokens(input) {
        return locale.longDateFormat(input) || input;
    }

    localFormattingTokens.lastIndex = 0;
    while (i >= 0 && localFormattingTokens.test(format)) {
        format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        localFormattingTokens.lastIndex = 0;
        i -= 1;
    }

    return format;
}

var match1         = /\d/;            //       0 - 9
var match2         = /\d\d/;          //      00 - 99
var match3         = /\d{3}/;         //     000 - 999
var match4         = /\d{4}/;         //    0000 - 9999
var match6         = /[+-]?\d{6}/;    // -999999 - 999999
var match1to2      = /\d\d?/;         //       0 - 99
var match3to4      = /\d\d\d\d?/;     //     999 - 9999
var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
var match1to3      = /\d{1,3}/;       //       0 - 999
var match1to4      = /\d{1,4}/;       //       0 - 9999
var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

var matchUnsigned  = /\d+/;           //       0 - inf
var matchSigned    = /[+-]?\d+/;      //    -inf - inf

var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

// any word (or two) characters or numbers including two/three word month in arabic.
// includes scottish gaelic two word and hyphenated months
var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


var regexes = {};

function addRegexToken (token, regex, strictRegex) {
    regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
        return (isStrict && strictRegex) ? strictRegex : regex;
    };
}

function getParseRegexForToken (token, config) {
    if (!hasOwnProp(regexes, token)) {
        return new RegExp(unescapeFormat(token));
    }

    return regexes[token](config._strict, config._locale);
}

// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function unescapeFormat(s) {
    return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
        return p1 || p2 || p3 || p4;
    }));
}

function regexEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var tokens = {};

function addParseToken (token, callback) {
    var i, func = callback;
    if (typeof token === 'string') {
        token = [token];
    }
    if (isNumber(callback)) {
        func = function (input, array) {
            array[callback] = toInt(input);
        };
    }
    for (i = 0; i < token.length; i++) {
        tokens[token[i]] = func;
    }
}

function addWeekParseToken (token, callback) {
    addParseToken(token, function (input, array, config, token) {
        config._w = config._w || {};
        callback(input, config._w, config, token);
    });
}

function addTimeToArrayFromToken(token, input, config) {
    if (input != null && hasOwnProp(tokens, token)) {
        tokens[token](input, config._a, config, token);
    }
}

var YEAR = 0;
var MONTH = 1;
var DATE = 2;
var HOUR = 3;
var MINUTE = 4;
var SECOND = 5;
var MILLISECOND = 6;
var WEEK = 7;
var WEEKDAY = 8;

// FORMATTING

addFormatToken('Y', 0, 0, function () {
    var y = this.year();
    return y <= 9999 ? '' + y : '+' + y;
});

addFormatToken(0, ['YY', 2], 0, function () {
    return this.year() % 100;
});

addFormatToken(0, ['YYYY',   4],       0, 'year');
addFormatToken(0, ['YYYYY',  5],       0, 'year');
addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

// ALIASES

addUnitAlias('year', 'y');

// PRIORITIES

addUnitPriority('year', 1);

// PARSING

addRegexToken('Y',      matchSigned);
addRegexToken('YY',     match1to2, match2);
addRegexToken('YYYY',   match1to4, match4);
addRegexToken('YYYYY',  match1to6, match6);
addRegexToken('YYYYYY', match1to6, match6);

addParseToken(['YYYYY', 'YYYYYY'], YEAR);
addParseToken('YYYY', function (input, array) {
    array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
});
addParseToken('YY', function (input, array) {
    array[YEAR] = hooks.parseTwoDigitYear(input);
});
addParseToken('Y', function (input, array) {
    array[YEAR] = parseInt(input, 10);
});

// HELPERS

function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// HOOKS

hooks.parseTwoDigitYear = function (input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
};

// MOMENTS

var getSetYear = makeGetSet('FullYear', true);

function getIsLeapYear () {
    return isLeapYear(this.year());
}

function makeGetSet (unit, keepTime) {
    return function (value) {
        if (value != null) {
            set$1(this, unit, value);
            hooks.updateOffset(this, keepTime);
            return this;
        } else {
            return get(this, unit);
        }
    };
}

function get (mom, unit) {
    return mom.isValid() ?
        mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
}

function set$1 (mom, unit, value) {
    if (mom.isValid() && !isNaN(value)) {
        if (unit === 'FullYear' && isLeapYear(mom.year())) {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
        }
        else {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }
}

// MOMENTS

function stringGet (units) {
    units = normalizeUnits(units);
    if (isFunction(this[units])) {
        return this[units]();
    }
    return this;
}


function stringSet (units, value) {
    if (typeof units === 'object') {
        units = normalizeObjectUnits(units);
        var prioritized = getPrioritizedUnits(units);
        for (var i = 0; i < prioritized.length; i++) {
            this[prioritized[i].unit](units[prioritized[i].unit]);
        }
    } else {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units](value);
        }
    }
    return this;
}

function mod(n, x) {
    return ((n % x) + x) % x;
}

var indexOf;

if (Array.prototype.indexOf) {
    indexOf = Array.prototype.indexOf;
} else {
    indexOf = function (o) {
        // I know
        var i;
        for (i = 0; i < this.length; ++i) {
            if (this[i] === o) {
                return i;
            }
        }
        return -1;
    };
}

function daysInMonth(year, month) {
    if (isNaN(year) || isNaN(month)) {
        return NaN;
    }
    var modMonth = mod(month, 12);
    year += (month - modMonth) / 12;
    return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
}

// FORMATTING

addFormatToken('M', ['MM', 2], 'Mo', function () {
    return this.month() + 1;
});

addFormatToken('MMM', 0, 0, function (format) {
    return this.localeData().monthsShort(this, format);
});

addFormatToken('MMMM', 0, 0, function (format) {
    return this.localeData().months(this, format);
});

// ALIASES

addUnitAlias('month', 'M');

// PRIORITY

addUnitPriority('month', 8);

// PARSING

addRegexToken('M',    match1to2);
addRegexToken('MM',   match1to2, match2);
addRegexToken('MMM',  function (isStrict, locale) {
    return locale.monthsShortRegex(isStrict);
});
addRegexToken('MMMM', function (isStrict, locale) {
    return locale.monthsRegex(isStrict);
});

addParseToken(['M', 'MM'], function (input, array) {
    array[MONTH] = toInt(input) - 1;
});

addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
    var month = config._locale.monthsParse(input, token, config._strict);
    // if we didn't find a month name, mark the date as invalid.
    if (month != null) {
        array[MONTH] = month;
    } else {
        getParsingFlags(config).invalidMonth = input;
    }
});

// LOCALES

var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
function localeMonths (m, format) {
    if (!m) {
        return isArray(this._months) ? this._months :
            this._months['standalone'];
    }
    return isArray(this._months) ? this._months[m.month()] :
        this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
}

var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
function localeMonthsShort (m, format) {
    if (!m) {
        return isArray(this._monthsShort) ? this._monthsShort :
            this._monthsShort['standalone'];
    }
    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
        this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
}

function handleStrictParse(monthName, format, strict) {
    var i, ii, mom, llc = monthName.toLocaleLowerCase();
    if (!this._monthsParse) {
        // this is not used
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
        for (i = 0; i < 12; ++i) {
            mom = createUTC([2000, i]);
            this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
            this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'MMM') {
            ii = indexOf.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'MMM') {
            ii = indexOf.call(this._shortMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf.call(this._longMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeMonthsParse (monthName, format, strict) {
    var i, mom, regex;

    if (this._monthsParseExact) {
        return handleStrictParse.call(this, monthName, format, strict);
    }

    if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
    }

    // TODO: add sorting
    // Sorting makes sure if one month (or abbr) is a prefix of another
    // see sorting in computeMonthsParse
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
        }
        if (!strict && !this._monthsParse[i]) {
            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
            return i;
        } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
            return i;
        } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
        }
    }
}

// MOMENTS

function setMonth (mom, value) {
    var dayOfMonth;

    if (!mom.isValid()) {
        // No op
        return mom;
    }

    if (typeof value === 'string') {
        if (/^\d+$/.test(value)) {
            value = toInt(value);
        } else {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (!isNumber(value)) {
                return mom;
            }
        }
    }

    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
    return mom;
}

function getSetMonth (value) {
    if (value != null) {
        setMonth(this, value);
        hooks.updateOffset(this, true);
        return this;
    } else {
        return get(this, 'Month');
    }
}

function getDaysInMonth () {
    return daysInMonth(this.year(), this.month());
}

var defaultMonthsShortRegex = matchWord;
function monthsShortRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsShortStrictRegex;
        } else {
            return this._monthsShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsShortRegex')) {
            this._monthsShortRegex = defaultMonthsShortRegex;
        }
        return this._monthsShortStrictRegex && isStrict ?
            this._monthsShortStrictRegex : this._monthsShortRegex;
    }
}

var defaultMonthsRegex = matchWord;
function monthsRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsStrictRegex;
        } else {
            return this._monthsRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsRegex')) {
            this._monthsRegex = defaultMonthsRegex;
        }
        return this._monthsStrictRegex && isStrict ?
            this._monthsStrictRegex : this._monthsRegex;
    }
}

function computeMonthsParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom;
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        shortPieces.push(this.monthsShort(mom, ''));
        longPieces.push(this.months(mom, ''));
        mixedPieces.push(this.months(mom, ''));
        mixedPieces.push(this.monthsShort(mom, ''));
    }
    // Sorting makes sure if one month (or abbr) is a prefix of another it
    // will match the longer piece.
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 12; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
    }
    for (i = 0; i < 24; i++) {
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._monthsShortRegex = this._monthsRegex;
    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
}

function createDate (y, m, d, h, M, s, ms) {
    // can't just apply() to create a date:
    // https://stackoverflow.com/q/181348
    var date = new Date(y, m, d, h, M, s, ms);

    // the date constructor remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
        date.setFullYear(y);
    }
    return date;
}

function createUTCDate (y) {
    var date = new Date(Date.UTC.apply(null, arguments));

    // the Date.UTC function remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
        date.setUTCFullYear(y);
    }
    return date;
}

// start-of-first-week - start-of-year
function firstWeekOffset(year, dow, doy) {
    var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
        fwd = 7 + dow - doy,
        // first-week day local weekday -- which local weekday is fwd
        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

    return -fwdlw + fwd - 1;
}

// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
    var localWeekday = (7 + weekday - dow) % 7,
        weekOffset = firstWeekOffset(year, dow, doy),
        dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
        resYear, resDayOfYear;

    if (dayOfYear <= 0) {
        resYear = year - 1;
        resDayOfYear = daysInYear(resYear) + dayOfYear;
    } else if (dayOfYear > daysInYear(year)) {
        resYear = year + 1;
        resDayOfYear = dayOfYear - daysInYear(year);
    } else {
        resYear = year;
        resDayOfYear = dayOfYear;
    }

    return {
        year: resYear,
        dayOfYear: resDayOfYear
    };
}

function weekOfYear(mom, dow, doy) {
    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
        resWeek, resYear;

    if (week < 1) {
        resYear = mom.year() - 1;
        resWeek = week + weeksInYear(resYear, dow, doy);
    } else if (week > weeksInYear(mom.year(), dow, doy)) {
        resWeek = week - weeksInYear(mom.year(), dow, doy);
        resYear = mom.year() + 1;
    } else {
        resYear = mom.year();
        resWeek = week;
    }

    return {
        week: resWeek,
        year: resYear
    };
}

function weeksInYear(year, dow, doy) {
    var weekOffset = firstWeekOffset(year, dow, doy),
        weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
}

// FORMATTING

addFormatToken('w', ['ww', 2], 'wo', 'week');
addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

// ALIASES

addUnitAlias('week', 'w');
addUnitAlias('isoWeek', 'W');

// PRIORITIES

addUnitPriority('week', 5);
addUnitPriority('isoWeek', 5);

// PARSING

addRegexToken('w',  match1to2);
addRegexToken('ww', match1to2, match2);
addRegexToken('W',  match1to2);
addRegexToken('WW', match1to2, match2);

addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
    week[token.substr(0, 1)] = toInt(input);
});

// HELPERS

// LOCALES

function localeWeek (mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
}

var defaultLocaleWeek = {
    dow : 0, // Sunday is the first day of the week.
    doy : 6  // The week that contains Jan 1st is the first week of the year.
};

function localeFirstDayOfWeek () {
    return this._week.dow;
}

function localeFirstDayOfYear () {
    return this._week.doy;
}

// MOMENTS

function getSetWeek (input) {
    var week = this.localeData().week(this);
    return input == null ? week : this.add((input - week) * 7, 'd');
}

function getSetISOWeek (input) {
    var week = weekOfYear(this, 1, 4).week;
    return input == null ? week : this.add((input - week) * 7, 'd');
}

// FORMATTING

addFormatToken('d', 0, 'do', 'day');

addFormatToken('dd', 0, 0, function (format) {
    return this.localeData().weekdaysMin(this, format);
});

addFormatToken('ddd', 0, 0, function (format) {
    return this.localeData().weekdaysShort(this, format);
});

addFormatToken('dddd', 0, 0, function (format) {
    return this.localeData().weekdays(this, format);
});

addFormatToken('e', 0, 0, 'weekday');
addFormatToken('E', 0, 0, 'isoWeekday');

// ALIASES

addUnitAlias('day', 'd');
addUnitAlias('weekday', 'e');
addUnitAlias('isoWeekday', 'E');

// PRIORITY
addUnitPriority('day', 11);
addUnitPriority('weekday', 11);
addUnitPriority('isoWeekday', 11);

// PARSING

addRegexToken('d',    match1to2);
addRegexToken('e',    match1to2);
addRegexToken('E',    match1to2);
addRegexToken('dd',   function (isStrict, locale) {
    return locale.weekdaysMinRegex(isStrict);
});
addRegexToken('ddd',   function (isStrict, locale) {
    return locale.weekdaysShortRegex(isStrict);
});
addRegexToken('dddd',   function (isStrict, locale) {
    return locale.weekdaysRegex(isStrict);
});

addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
    var weekday = config._locale.weekdaysParse(input, token, config._strict);
    // if we didn't get a weekday name, mark the date as invalid
    if (weekday != null) {
        week.d = weekday;
    } else {
        getParsingFlags(config).invalidWeekday = input;
    }
});

addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
    week[token] = toInt(input);
});

// HELPERS

function parseWeekday(input, locale) {
    if (typeof input !== 'string') {
        return input;
    }

    if (!isNaN(input)) {
        return parseInt(input, 10);
    }

    input = locale.weekdaysParse(input);
    if (typeof input === 'number') {
        return input;
    }

    return null;
}

function parseIsoWeekday(input, locale) {
    if (typeof input === 'string') {
        return locale.weekdaysParse(input) % 7 || 7;
    }
    return isNaN(input) ? null : input;
}

// LOCALES

var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
function localeWeekdays (m, format) {
    if (!m) {
        return isArray(this._weekdays) ? this._weekdays :
            this._weekdays['standalone'];
    }
    return isArray(this._weekdays) ? this._weekdays[m.day()] :
        this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
}

var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
function localeWeekdaysShort (m) {
    return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
}

var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
function localeWeekdaysMin (m) {
    return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
}

function handleStrictParse$1(weekdayName, format, strict) {
    var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._minWeekdaysParse = [];

        for (i = 0; i < 7; ++i) {
            mom = createUTC([2000, 1]).day(i);
            this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
            this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'dddd') {
            ii = indexOf.call(this._weekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'dddd') {
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf.call(this._minWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeWeekdaysParse (weekdayName, format, strict) {
    var i, mom, regex;

    if (this._weekdaysParseExact) {
        return handleStrictParse$1.call(this, weekdayName, format, strict);
    }

    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._minWeekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._fullWeekdaysParse = [];
    }

    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already

        mom = createUTC([2000, 1]).day(i);
        if (strict && !this._fullWeekdaysParse[i]) {
            this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
            this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
            this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
        }
        if (!this._weekdaysParse[i]) {
            regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
            this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
            return i;
        }
    }
}

// MOMENTS

function getSetDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    if (input != null) {
        input = parseWeekday(input, this.localeData());
        return this.add(input - day, 'd');
    } else {
        return day;
    }
}

function getSetLocaleDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return input == null ? weekday : this.add(input - weekday, 'd');
}

function getSetISODayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }

    // behaves the same as moment#day except
    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
    // as a setter, sunday should belong to the previous week.

    if (input != null) {
        var weekday = parseIsoWeekday(input, this.localeData());
        return this.day(this.day() % 7 ? weekday : weekday - 7);
    } else {
        return this.day() || 7;
    }
}

var defaultWeekdaysRegex = matchWord;
function weekdaysRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysStrictRegex;
        } else {
            return this._weekdaysRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            this._weekdaysRegex = defaultWeekdaysRegex;
        }
        return this._weekdaysStrictRegex && isStrict ?
            this._weekdaysStrictRegex : this._weekdaysRegex;
    }
}

var defaultWeekdaysShortRegex = matchWord;
function weekdaysShortRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysShortStrictRegex;
        } else {
            return this._weekdaysShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysShortRegex')) {
            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
        }
        return this._weekdaysShortStrictRegex && isStrict ?
            this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
    }
}

var defaultWeekdaysMinRegex = matchWord;
function weekdaysMinRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysMinStrictRegex;
        } else {
            return this._weekdaysMinRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysMinRegex')) {
            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
        }
        return this._weekdaysMinStrictRegex && isStrict ?
            this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
    }
}


function computeWeekdaysParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom, minp, shortp, longp;
    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, 1]).day(i);
        minp = this.weekdaysMin(mom, '');
        shortp = this.weekdaysShort(mom, '');
        longp = this.weekdays(mom, '');
        minPieces.push(minp);
        shortPieces.push(shortp);
        longPieces.push(longp);
        mixedPieces.push(minp);
        mixedPieces.push(shortp);
        mixedPieces.push(longp);
    }
    // Sorting makes sure if one weekday (or abbr) is a prefix of another it
    // will match the longer piece.
    minPieces.sort(cmpLenRev);
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 7; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._weekdaysShortRegex = this._weekdaysRegex;
    this._weekdaysMinRegex = this._weekdaysRegex;

    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
}

// FORMATTING

function hFormat() {
    return this.hours() % 12 || 12;
}

function kFormat() {
    return this.hours() || 24;
}

addFormatToken('H', ['HH', 2], 0, 'hour');
addFormatToken('h', ['hh', 2], 0, hFormat);
addFormatToken('k', ['kk', 2], 0, kFormat);

addFormatToken('hmm', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
});

addFormatToken('hmmss', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

addFormatToken('Hmm', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2);
});

addFormatToken('Hmmss', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

function meridiem (token, lowercase) {
    addFormatToken(token, 0, 0, function () {
        return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
    });
}

meridiem('a', true);
meridiem('A', false);

// ALIASES

addUnitAlias('hour', 'h');

// PRIORITY
addUnitPriority('hour', 13);

// PARSING

function matchMeridiem (isStrict, locale) {
    return locale._meridiemParse;
}

addRegexToken('a',  matchMeridiem);
addRegexToken('A',  matchMeridiem);
addRegexToken('H',  match1to2);
addRegexToken('h',  match1to2);
addRegexToken('k',  match1to2);
addRegexToken('HH', match1to2, match2);
addRegexToken('hh', match1to2, match2);
addRegexToken('kk', match1to2, match2);

addRegexToken('hmm', match3to4);
addRegexToken('hmmss', match5to6);
addRegexToken('Hmm', match3to4);
addRegexToken('Hmmss', match5to6);

addParseToken(['H', 'HH'], HOUR);
addParseToken(['k', 'kk'], function (input, array, config) {
    var kInput = toInt(input);
    array[HOUR] = kInput === 24 ? 0 : kInput;
});
addParseToken(['a', 'A'], function (input, array, config) {
    config._isPm = config._locale.isPM(input);
    config._meridiem = input;
});
addParseToken(['h', 'hh'], function (input, array, config) {
    array[HOUR] = toInt(input);
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
    getParsingFlags(config).bigHour = true;
});
addParseToken('Hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
});
addParseToken('Hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
});

// LOCALES

function localeIsPM (input) {
    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
    // Using charAt should be more compatible.
    return ((input + '').toLowerCase().charAt(0) === 'p');
}

var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
function localeMeridiem (hours, minutes, isLower) {
    if (hours > 11) {
        return isLower ? 'pm' : 'PM';
    } else {
        return isLower ? 'am' : 'AM';
    }
}


// MOMENTS

// Setting the hour should keep the time, because the user explicitly
// specified which hour he wants. So trying to maintain the same hour (in
// a new timezone) makes sense. Adding/subtracting hours does not follow
// this rule.
var getSetHour = makeGetSet('Hours', true);

// months
// week
// weekdays
// meridiem
var baseConfig = {
    calendar: defaultCalendar,
    longDateFormat: defaultLongDateFormat,
    invalidDate: defaultInvalidDate,
    ordinal: defaultOrdinal,
    dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
    relativeTime: defaultRelativeTime,

    months: defaultLocaleMonths,
    monthsShort: defaultLocaleMonthsShort,

    week: defaultLocaleWeek,

    weekdays: defaultLocaleWeekdays,
    weekdaysMin: defaultLocaleWeekdaysMin,
    weekdaysShort: defaultLocaleWeekdaysShort,

    meridiemParse: defaultLocaleMeridiemParse
};

// internal storage for locale config files
var locales = {};
var localeFamilies = {};
var globalLocale;

function normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function chooseLocale(names) {
    var i = 0, j, next, locale, split;

    while (i < names.length) {
        split = normalizeLocale(names[i]).split('-');
        j = split.length;
        next = normalizeLocale(names[i + 1]);
        next = next ? next.split('-') : null;
        while (j > 0) {
            locale = loadLocale(split.slice(0, j).join('-'));
            if (locale) {
                return locale;
            }
            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                //the next array item is better than a shallower substring of this one
                break;
            }
            j--;
        }
        i++;
    }
    return null;
}

function loadLocale(name) {
    var oldLocale = null;
    // TODO: Find a better way to register and load all the locales in Node
    if (!locales[name] && (typeof module !== 'undefined') &&
            module && module.exports) {
        try {
            oldLocale = globalLocale._abbr;
            var aliasedRequire = require;
            aliasedRequire('./locale/' + name);
            getSetGlobalLocale(oldLocale);
        } catch (e) {}
    }
    return locales[name];
}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function getSetGlobalLocale (key, values) {
    var data;
    if (key) {
        if (isUndefined(values)) {
            data = getLocale(key);
        }
        else {
            data = defineLocale(key, values);
        }

        if (data) {
            // moment.duration._locale = moment._locale = data;
            globalLocale = data;
        }
    }

    return globalLocale._abbr;
}

function defineLocale (name, config) {
    if (config !== null) {
        var parentConfig = baseConfig;
        config.abbr = name;
        if (locales[name] != null) {
            deprecateSimple('defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                    'an existing locale. moment.defineLocale(localeName, ' +
                    'config) should only be used for creating a new locale ' +
                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
            parentConfig = locales[name]._config;
        } else if (config.parentLocale != null) {
            if (locales[config.parentLocale] != null) {
                parentConfig = locales[config.parentLocale]._config;
            } else {
                if (!localeFamilies[config.parentLocale]) {
                    localeFamilies[config.parentLocale] = [];
                }
                localeFamilies[config.parentLocale].push({
                    name: name,
                    config: config
                });
                return null;
            }
        }
        locales[name] = new Locale(mergeConfigs(parentConfig, config));

        if (localeFamilies[name]) {
            localeFamilies[name].forEach(function (x) {
                defineLocale(x.name, x.config);
            });
        }

        // backwards compat for now: also set the locale
        // make sure we set the locale AFTER all child locales have been
        // created, so we won't end up with the child locale set.
        getSetGlobalLocale(name);


        return locales[name];
    } else {
        // useful for testing
        delete locales[name];
        return null;
    }
}

function updateLocale(name, config) {
    if (config != null) {
        var locale, parentConfig = baseConfig;
        // MERGE
        if (locales[name] != null) {
            parentConfig = locales[name]._config;
        }
        config = mergeConfigs(parentConfig, config);
        locale = new Locale(config);
        locale.parentLocale = locales[name];
        locales[name] = locale;

        // backwards compat for now: also set the locale
        getSetGlobalLocale(name);
    } else {
        // pass null for config to unupdate, useful for tests
        if (locales[name] != null) {
            if (locales[name].parentLocale != null) {
                locales[name] = locales[name].parentLocale;
            } else if (locales[name] != null) {
                delete locales[name];
            }
        }
    }
    return locales[name];
}

// returns locale data
function getLocale (key) {
    var locale;

    if (key && key._locale && key._locale._abbr) {
        key = key._locale._abbr;
    }

    if (!key) {
        return globalLocale;
    }

    if (!isArray(key)) {
        //short-circuit everything else
        locale = loadLocale(key);
        if (locale) {
            return locale;
        }
        key = [key];
    }

    return chooseLocale(key);
}

function listLocales() {
    return keys(locales);
}

function checkOverflow (m) {
    var overflow;
    var a = m._a;

    if (a && getParsingFlags(m).overflow === -2) {
        overflow =
            a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
            a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
            a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
            a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
            a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
            -1;

        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
            overflow = DATE;
        }
        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
            overflow = WEEK;
        }
        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
            overflow = WEEKDAY;
        }

        getParsingFlags(m).overflow = overflow;
    }

    return m;
}

// Pick the first defined of two or three arguments.
function defaults(a, b, c) {
    if (a != null) {
        return a;
    }
    if (b != null) {
        return b;
    }
    return c;
}

function currentDateArray(config) {
    // hooks is actually the exported moment object
    var nowValue = new Date(hooks.now());
    if (config._useUTC) {
        return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
    }
    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
}

// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
function configFromArray (config) {
    var i, date, input = [], currentDate, yearToUse;

    if (config._d) {
        return;
    }

    currentDate = currentDateArray(config);

    //compute day of the year from weeks and weekdays
    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
        dayOfYearFromWeekInfo(config);
    }

    //if the day of the year is set, figure out what it is
    if (config._dayOfYear != null) {
        yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

        if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
            getParsingFlags(config)._overflowDayOfYear = true;
        }

        date = createUTCDate(yearToUse, 0, config._dayOfYear);
        config._a[MONTH] = date.getUTCMonth();
        config._a[DATE] = date.getUTCDate();
    }

    // Default to current date.
    // * if no year, month, day of month are given, default to today
    // * if day of month is given, default month and year
    // * if month is given, default only year
    // * if year is given, don't default anything
    for (i = 0; i < 3 && config._a[i] == null; ++i) {
        config._a[i] = input[i] = currentDate[i];
    }

    // Zero out whatever was not defaulted, including time
    for (; i < 7; i++) {
        config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
    }

    // Check for 24:00:00.000
    if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
        config._nextDay = true;
        config._a[HOUR] = 0;
    }

    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
    // Apply timezone offset from input. The actual utcOffset can be changed
    // with parseZone.
    if (config._tzm != null) {
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    }

    if (config._nextDay) {
        config._a[HOUR] = 24;
    }

    // check for mismatching day of week
    if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== config._d.getDay()) {
        getParsingFlags(config).weekdayMismatch = true;
    }
}

function dayOfYearFromWeekInfo(config) {
    var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

    w = config._w;
    if (w.GG != null || w.W != null || w.E != null) {
        dow = 1;
        doy = 4;

        // TODO: We need to take the current isoWeekYear, but that depends on
        // how we interpret now (local, utc, fixed offset). So create
        // a now version of current config (take local/utc/offset flags, and
        // create now).
        weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
        week = defaults(w.W, 1);
        weekday = defaults(w.E, 1);
        if (weekday < 1 || weekday > 7) {
            weekdayOverflow = true;
        }
    } else {
        dow = config._locale._week.dow;
        doy = config._locale._week.doy;

        var curWeek = weekOfYear(createLocal(), dow, doy);

        weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

        // Default to current week.
        week = defaults(w.w, curWeek.week);

        if (w.d != null) {
            // weekday -- low day numbers are considered next week
            weekday = w.d;
            if (weekday < 0 || weekday > 6) {
                weekdayOverflow = true;
            }
        } else if (w.e != null) {
            // local weekday -- counting starts from begining of week
            weekday = w.e + dow;
            if (w.e < 0 || w.e > 6) {
                weekdayOverflow = true;
            }
        } else {
            // default to begining of week
            weekday = dow;
        }
    }
    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
        getParsingFlags(config)._overflowWeeks = true;
    } else if (weekdayOverflow != null) {
        getParsingFlags(config)._overflowWeekday = true;
    } else {
        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }
}

// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

var isoDates = [
    ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
    ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
    ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
    ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
    ['YYYY-DDD', /\d{4}-\d{3}/],
    ['YYYY-MM', /\d{4}-\d\d/, false],
    ['YYYYYYMMDD', /[+-]\d{10}/],
    ['YYYYMMDD', /\d{8}/],
    // YYYYMM is NOT allowed by the standard
    ['GGGG[W]WWE', /\d{4}W\d{3}/],
    ['GGGG[W]WW', /\d{4}W\d{2}/, false],
    ['YYYYDDD', /\d{7}/]
];

// iso time formats and regexes
var isoTimes = [
    ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
    ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
    ['HH:mm:ss', /\d\d:\d\d:\d\d/],
    ['HH:mm', /\d\d:\d\d/],
    ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
    ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
    ['HHmmss', /\d\d\d\d\d\d/],
    ['HHmm', /\d\d\d\d/],
    ['HH', /\d\d/]
];

var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

// date from iso format
function configFromISO(config) {
    var i, l,
        string = config._i,
        match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
        allowTime, dateFormat, timeFormat, tzFormat;

    if (match) {
        getParsingFlags(config).iso = true;

        for (i = 0, l = isoDates.length; i < l; i++) {
            if (isoDates[i][1].exec(match[1])) {
                dateFormat = isoDates[i][0];
                allowTime = isoDates[i][2] !== false;
                break;
            }
        }
        if (dateFormat == null) {
            config._isValid = false;
            return;
        }
        if (match[3]) {
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(match[3])) {
                    // match[2] should be 'T' or space
                    timeFormat = (match[2] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (timeFormat == null) {
                config._isValid = false;
                return;
            }
        }
        if (!allowTime && timeFormat != null) {
            config._isValid = false;
            return;
        }
        if (match[4]) {
            if (tzRegex.exec(match[4])) {
                tzFormat = 'Z';
            } else {
                config._isValid = false;
                return;
            }
        }
        config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
        configFromStringAndFormat(config);
    } else {
        config._isValid = false;
    }
}

// RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
    var result = [
        untruncateYear(yearStr),
        defaultLocaleMonthsShort.indexOf(monthStr),
        parseInt(dayStr, 10),
        parseInt(hourStr, 10),
        parseInt(minuteStr, 10)
    ];

    if (secondStr) {
        result.push(parseInt(secondStr, 10));
    }

    return result;
}

function untruncateYear(yearStr) {
    var year = parseInt(yearStr, 10);
    if (year <= 49) {
        return 2000 + year;
    } else if (year <= 999) {
        return 1900 + year;
    }
    return year;
}

function preprocessRFC2822(s) {
    // Remove comments and folding whitespace and replace multiple-spaces with a single space
    return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').trim();
}

function checkWeekday(weekdayStr, parsedInput, config) {
    if (weekdayStr) {
        // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
        var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
            weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
        if (weekdayProvided !== weekdayActual) {
            getParsingFlags(config).weekdayMismatch = true;
            config._isValid = false;
            return false;
        }
    }
    return true;
}

var obsOffsets = {
    UT: 0,
    GMT: 0,
    EDT: -4 * 60,
    EST: -5 * 60,
    CDT: -5 * 60,
    CST: -6 * 60,
    MDT: -6 * 60,
    MST: -7 * 60,
    PDT: -7 * 60,
    PST: -8 * 60
};

function calculateOffset(obsOffset, militaryOffset, numOffset) {
    if (obsOffset) {
        return obsOffsets[obsOffset];
    } else if (militaryOffset) {
        // the only allowed military tz is Z
        return 0;
    } else {
        var hm = parseInt(numOffset, 10);
        var m = hm % 100, h = (hm - m) / 100;
        return h * 60 + m;
    }
}

// date and time from ref 2822 format
function configFromRFC2822(config) {
    var match = rfc2822.exec(preprocessRFC2822(config._i));
    if (match) {
        var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
        if (!checkWeekday(match[1], parsedArray, config)) {
            return;
        }

        config._a = parsedArray;
        config._tzm = calculateOffset(match[8], match[9], match[10]);

        config._d = createUTCDate.apply(null, config._a);
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

        getParsingFlags(config).rfc2822 = true;
    } else {
        config._isValid = false;
    }
}

// date from iso format or fallback
function configFromString(config) {
    var matched = aspNetJsonRegex.exec(config._i);

    if (matched !== null) {
        config._d = new Date(+matched[1]);
        return;
    }

    configFromISO(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    configFromRFC2822(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    // Final attempt, use Input Fallback
    hooks.createFromInputFallback(config);
}

hooks.createFromInputFallback = deprecate(
    'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
    'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
    'discouraged and will be removed in an upcoming major release. Please refer to ' +
    'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
    function (config) {
        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
    }
);

// constant that refers to the ISO standard
hooks.ISO_8601 = function () {};

// constant that refers to the RFC 2822 form
hooks.RFC_2822 = function () {};

// date from string and format string
function configFromStringAndFormat(config) {
    // TODO: Move this to another part of the creation flow to prevent circular deps
    if (config._f === hooks.ISO_8601) {
        configFromISO(config);
        return;
    }
    if (config._f === hooks.RFC_2822) {
        configFromRFC2822(config);
        return;
    }
    config._a = [];
    getParsingFlags(config).empty = true;

    // This array is used to make a Date, either with `new Date` or `Date.UTC`
    var string = '' + config._i,
        i, parsedInput, tokens, token, skipped,
        stringLength = string.length,
        totalParsedInputLength = 0;

    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

    for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
        // console.log('token', token, 'parsedInput', parsedInput,
        //         'regex', getParseRegexForToken(token, config));
        if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            if (skipped.length > 0) {
                getParsingFlags(config).unusedInput.push(skipped);
            }
            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            totalParsedInputLength += parsedInput.length;
        }
        // don't parse if it's not a known token
        if (formatTokenFunctions[token]) {
            if (parsedInput) {
                getParsingFlags(config).empty = false;
            }
            else {
                getParsingFlags(config).unusedTokens.push(token);
            }
            addTimeToArrayFromToken(token, parsedInput, config);
        }
        else if (config._strict && !parsedInput) {
            getParsingFlags(config).unusedTokens.push(token);
        }
    }

    // add remaining unparsed input length to the string
    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
    if (string.length > 0) {
        getParsingFlags(config).unusedInput.push(string);
    }

    // clear _12h flag if hour is <= 12
    if (config._a[HOUR] <= 12 &&
        getParsingFlags(config).bigHour === true &&
        config._a[HOUR] > 0) {
        getParsingFlags(config).bigHour = undefined;
    }

    getParsingFlags(config).parsedDateParts = config._a.slice(0);
    getParsingFlags(config).meridiem = config._meridiem;
    // handle meridiem
    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

    configFromArray(config);
    checkOverflow(config);
}


function meridiemFixWrap (locale, hour, meridiem) {
    var isPm;

    if (meridiem == null) {
        // nothing to do
        return hour;
    }
    if (locale.meridiemHour != null) {
        return locale.meridiemHour(hour, meridiem);
    } else if (locale.isPM != null) {
        // Fallback
        isPm = locale.isPM(meridiem);
        if (isPm && hour < 12) {
            hour += 12;
        }
        if (!isPm && hour === 12) {
            hour = 0;
        }
        return hour;
    } else {
        // this is not supposed to happen
        return hour;
    }
}

// date from string and array of format strings
function configFromStringAndArray(config) {
    var tempConfig,
        bestMoment,

        scoreToBeat,
        i,
        currentScore;

    if (config._f.length === 0) {
        getParsingFlags(config).invalidFormat = true;
        config._d = new Date(NaN);
        return;
    }

    for (i = 0; i < config._f.length; i++) {
        currentScore = 0;
        tempConfig = copyConfig({}, config);
        if (config._useUTC != null) {
            tempConfig._useUTC = config._useUTC;
        }
        tempConfig._f = config._f[i];
        configFromStringAndFormat(tempConfig);

        if (!isValid(tempConfig)) {
            continue;
        }

        // if there is any input that was not parsed add a penalty for that format
        currentScore += getParsingFlags(tempConfig).charsLeftOver;

        //or tokens
        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

        getParsingFlags(tempConfig).score = currentScore;

        if (scoreToBeat == null || currentScore < scoreToBeat) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
        }
    }

    extend(config, bestMoment || tempConfig);
}

function configFromObject(config) {
    if (config._d) {
        return;
    }

    var i = normalizeObjectUnits(config._i);
    config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
        return obj && parseInt(obj, 10);
    });

    configFromArray(config);
}

function createFromConfig (config) {
    var res = new Moment(checkOverflow(prepareConfig(config)));
    if (res._nextDay) {
        // Adding is smart enough around DST
        res.add(1, 'd');
        res._nextDay = undefined;
    }

    return res;
}

function prepareConfig (config) {
    var input = config._i,
        format = config._f;

    config._locale = config._locale || getLocale(config._l);

    if (input === null || (format === undefined && input === '')) {
        return createInvalid({nullInput: true});
    }

    if (typeof input === 'string') {
        config._i = input = config._locale.preparse(input);
    }

    if (isMoment(input)) {
        return new Moment(checkOverflow(input));
    } else if (isDate(input)) {
        config._d = input;
    } else if (isArray(format)) {
        configFromStringAndArray(config);
    } else if (format) {
        configFromStringAndFormat(config);
    }  else {
        configFromInput(config);
    }

    if (!isValid(config)) {
        config._d = null;
    }

    return config;
}

function configFromInput(config) {
    var input = config._i;
    if (isUndefined(input)) {
        config._d = new Date(hooks.now());
    } else if (isDate(input)) {
        config._d = new Date(input.valueOf());
    } else if (typeof input === 'string') {
        configFromString(config);
    } else if (isArray(input)) {
        config._a = map(input.slice(0), function (obj) {
            return parseInt(obj, 10);
        });
        configFromArray(config);
    } else if (isObject(input)) {
        configFromObject(config);
    } else if (isNumber(input)) {
        // from milliseconds
        config._d = new Date(input);
    } else {
        hooks.createFromInputFallback(config);
    }
}

function createLocalOrUTC (input, format, locale, strict, isUTC) {
    var c = {};

    if (locale === true || locale === false) {
        strict = locale;
        locale = undefined;
    }

    if ((isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)) {
        input = undefined;
    }
    // object construction must be done this way.
    // https://github.com/moment/moment/issues/1423
    c._isAMomentObject = true;
    c._useUTC = c._isUTC = isUTC;
    c._l = locale;
    c._i = input;
    c._f = format;
    c._strict = strict;

    return createFromConfig(c);
}

function createLocal (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, false);
}

var prototypeMin = deprecate(
    'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other < this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

var prototypeMax = deprecate(
    'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other > this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
function pickBy(fn, moments) {
    var res, i;
    if (moments.length === 1 && isArray(moments[0])) {
        moments = moments[0];
    }
    if (!moments.length) {
        return createLocal();
    }
    res = moments[0];
    for (i = 1; i < moments.length; ++i) {
        if (!moments[i].isValid() || moments[i][fn](res)) {
            res = moments[i];
        }
    }
    return res;
}

// TODO: Use [].sort instead?
function min () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isBefore', args);
}

function max () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isAfter', args);
}

var now = function () {
    return Date.now ? Date.now() : +(new Date());
};

var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

function isDurationValid(m) {
    for (var key in m) {
        if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
            return false;
        }
    }

    var unitHasDecimal = false;
    for (var i = 0; i < ordering.length; ++i) {
        if (m[ordering[i]]) {
            if (unitHasDecimal) {
                return false; // only allow non-integers for smallest unit
            }
            if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                unitHasDecimal = true;
            }
        }
    }

    return true;
}

function isValid$1() {
    return this._isValid;
}

function createInvalid$1() {
    return createDuration(NaN);
}

function Duration (duration) {
    var normalizedInput = normalizeObjectUnits(duration),
        years = normalizedInput.year || 0,
        quarters = normalizedInput.quarter || 0,
        months = normalizedInput.month || 0,
        weeks = normalizedInput.week || 0,
        days = normalizedInput.day || 0,
        hours = normalizedInput.hour || 0,
        minutes = normalizedInput.minute || 0,
        seconds = normalizedInput.second || 0,
        milliseconds = normalizedInput.millisecond || 0;

    this._isValid = isDurationValid(normalizedInput);

    // representation for dateAddRemove
    this._milliseconds = +milliseconds +
        seconds * 1e3 + // 1000
        minutes * 6e4 + // 1000 * 60
        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
    // Because of dateAddRemove treats 24 hours as different from a
    // day when working around DST, we need to store them separately
    this._days = +days +
        weeks * 7;
    // It is impossible to translate months into days without knowing
    // which months you are are talking about, so we have to store
    // it separately.
    this._months = +months +
        quarters * 3 +
        years * 12;

    this._data = {};

    this._locale = getLocale();

    this._bubble();
}

function isDuration (obj) {
    return obj instanceof Duration;
}

function absRound (number) {
    if (number < 0) {
        return Math.round(-1 * number) * -1;
    } else {
        return Math.round(number);
    }
}

// FORMATTING

function offset (token, separator) {
    addFormatToken(token, 0, 0, function () {
        var offset = this.utcOffset();
        var sign = '+';
        if (offset < 0) {
            offset = -offset;
            sign = '-';
        }
        return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
    });
}

offset('Z', ':');
offset('ZZ', '');

// PARSING

addRegexToken('Z',  matchShortOffset);
addRegexToken('ZZ', matchShortOffset);
addParseToken(['Z', 'ZZ'], function (input, array, config) {
    config._useUTC = true;
    config._tzm = offsetFromString(matchShortOffset, input);
});

// HELPERS

// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
var chunkOffset = /([\+\-]|\d\d)/gi;

function offsetFromString(matcher, string) {
    var matches = (string || '').match(matcher);

    if (matches === null) {
        return null;
    }

    var chunk   = matches[matches.length - 1] || [];
    var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
    var minutes = +(parts[1] * 60) + toInt(parts[2]);

    return minutes === 0 ?
      0 :
      parts[0] === '+' ? minutes : -minutes;
}

// Return a moment from input, that is local/utc/zone equivalent to model.
function cloneWithOffset(input, model) {
    var res, diff;
    if (model._isUTC) {
        res = model.clone();
        diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
        // Use low-level api, because this fn is low-level api.
        res._d.setTime(res._d.valueOf() + diff);
        hooks.updateOffset(res, false);
        return res;
    } else {
        return createLocal(input).local();
    }
}

function getDateOffset (m) {
    // On Firefox.24 Date#getTimezoneOffset returns a floating point.
    // https://github.com/moment/moment/pull/1871
    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
}

// HOOKS

// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
hooks.updateOffset = function () {};

// MOMENTS

// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
function getSetOffset (input, keepLocalTime, keepMinutes) {
    var offset = this._offset || 0,
        localAdjust;
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    if (input != null) {
        if (typeof input === 'string') {
            input = offsetFromString(matchShortOffset, input);
            if (input === null) {
                return this;
            }
        } else if (Math.abs(input) < 16 && !keepMinutes) {
            input = input * 60;
        }
        if (!this._isUTC && keepLocalTime) {
            localAdjust = getDateOffset(this);
        }
        this._offset = input;
        this._isUTC = true;
        if (localAdjust != null) {
            this.add(localAdjust, 'm');
        }
        if (offset !== input) {
            if (!keepLocalTime || this._changeInProgress) {
                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
            } else if (!this._changeInProgress) {
                this._changeInProgress = true;
                hooks.updateOffset(this, true);
                this._changeInProgress = null;
            }
        }
        return this;
    } else {
        return this._isUTC ? offset : getDateOffset(this);
    }
}

function getSetZone (input, keepLocalTime) {
    if (input != null) {
        if (typeof input !== 'string') {
            input = -input;
        }

        this.utcOffset(input, keepLocalTime);

        return this;
    } else {
        return -this.utcOffset();
    }
}

function setOffsetToUTC (keepLocalTime) {
    return this.utcOffset(0, keepLocalTime);
}

function setOffsetToLocal (keepLocalTime) {
    if (this._isUTC) {
        this.utcOffset(0, keepLocalTime);
        this._isUTC = false;

        if (keepLocalTime) {
            this.subtract(getDateOffset(this), 'm');
        }
    }
    return this;
}

function setOffsetToParsedOffset () {
    if (this._tzm != null) {
        this.utcOffset(this._tzm, false, true);
    } else if (typeof this._i === 'string') {
        var tZone = offsetFromString(matchOffset, this._i);
        if (tZone != null) {
            this.utcOffset(tZone);
        }
        else {
            this.utcOffset(0, true);
        }
    }
    return this;
}

function hasAlignedHourOffset (input) {
    if (!this.isValid()) {
        return false;
    }
    input = input ? createLocal(input).utcOffset() : 0;

    return (this.utcOffset() - input) % 60 === 0;
}

function isDaylightSavingTime () {
    return (
        this.utcOffset() > this.clone().month(0).utcOffset() ||
        this.utcOffset() > this.clone().month(5).utcOffset()
    );
}

function isDaylightSavingTimeShifted () {
    if (!isUndefined(this._isDSTShifted)) {
        return this._isDSTShifted;
    }

    var c = {};

    copyConfig(c, this);
    c = prepareConfig(c);

    if (c._a) {
        var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
        this._isDSTShifted = this.isValid() &&
            compareArrays(c._a, other.toArray()) > 0;
    } else {
        this._isDSTShifted = false;
    }

    return this._isDSTShifted;
}

function isLocal () {
    return this.isValid() ? !this._isUTC : false;
}

function isUtcOffset () {
    return this.isValid() ? this._isUTC : false;
}

function isUtc () {
    return this.isValid() ? this._isUTC && this._offset === 0 : false;
}

// ASP.NET json date format regex
var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
// and further modified to allow for strings containing both week and day
var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

function createDuration (input, key) {
    var duration = input,
        // matching against regexp is expensive, do it on demand
        match = null,
        sign,
        ret,
        diffRes;

    if (isDuration(input)) {
        duration = {
            ms : input._milliseconds,
            d  : input._days,
            M  : input._months
        };
    } else if (isNumber(input)) {
        duration = {};
        if (key) {
            duration[key] = input;
        } else {
            duration.milliseconds = input;
        }
    } else if (!!(match = aspNetRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y  : 0,
            d  : toInt(match[DATE])                         * sign,
            h  : toInt(match[HOUR])                         * sign,
            m  : toInt(match[MINUTE])                       * sign,
            s  : toInt(match[SECOND])                       * sign,
            ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
        };
    } else if (!!(match = isoRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : (match[1] === '+') ? 1 : 1;
        duration = {
            y : parseIso(match[2], sign),
            M : parseIso(match[3], sign),
            w : parseIso(match[4], sign),
            d : parseIso(match[5], sign),
            h : parseIso(match[6], sign),
            m : parseIso(match[7], sign),
            s : parseIso(match[8], sign)
        };
    } else if (duration == null) {// checks for null or undefined
        duration = {};
    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
        diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

        duration = {};
        duration.ms = diffRes.milliseconds;
        duration.M = diffRes.months;
    }

    ret = new Duration(duration);

    if (isDuration(input) && hasOwnProp(input, '_locale')) {
        ret._locale = input._locale;
    }

    return ret;
}

createDuration.fn = Duration.prototype;
createDuration.invalid = createInvalid$1;

function parseIso (inp, sign) {
    // We'd normally use ~~inp for this, but unfortunately it also
    // converts floats to ints.
    // inp may be undefined, so careful calling replace on it.
    var res = inp && parseFloat(inp.replace(',', '.'));
    // apply sign while we're at it
    return (isNaN(res) ? 0 : res) * sign;
}

function positiveMomentsDifference(base, other) {
    var res = {milliseconds: 0, months: 0};

    res.months = other.month() - base.month() +
        (other.year() - base.year()) * 12;
    if (base.clone().add(res.months, 'M').isAfter(other)) {
        --res.months;
    }

    res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

    return res;
}

function momentsDifference(base, other) {
    var res;
    if (!(base.isValid() && other.isValid())) {
        return {milliseconds: 0, months: 0};
    }

    other = cloneWithOffset(other, base);
    if (base.isBefore(other)) {
        res = positiveMomentsDifference(base, other);
    } else {
        res = positiveMomentsDifference(other, base);
        res.milliseconds = -res.milliseconds;
        res.months = -res.months;
    }

    return res;
}

// TODO: remove 'name' arg after deprecation is removed
function createAdder(direction, name) {
    return function (val, period) {
        var dur, tmp;
        //invert the arguments, but complain about it
        if (period !== null && !isNaN(+period)) {
            deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
            tmp = val; val = period; period = tmp;
        }

        val = typeof val === 'string' ? +val : val;
        dur = createDuration(val, period);
        addSubtract(this, dur, direction);
        return this;
    };
}

function addSubtract (mom, duration, isAdding, updateOffset) {
    var milliseconds = duration._milliseconds,
        days = absRound(duration._days),
        months = absRound(duration._months);

    if (!mom.isValid()) {
        // No op
        return;
    }

    updateOffset = updateOffset == null ? true : updateOffset;

    if (months) {
        setMonth(mom, get(mom, 'Month') + months * isAdding);
    }
    if (days) {
        set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
    }
    if (milliseconds) {
        mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
    }
    if (updateOffset) {
        hooks.updateOffset(mom, days || months);
    }
}

var add      = createAdder(1, 'add');
var subtract = createAdder(-1, 'subtract');

function getCalendarFormat(myMoment, now) {
    var diff = myMoment.diff(now, 'days', true);
    return diff < -6 ? 'sameElse' :
            diff < -1 ? 'lastWeek' :
            diff < 0 ? 'lastDay' :
            diff < 1 ? 'sameDay' :
            diff < 2 ? 'nextDay' :
            diff < 7 ? 'nextWeek' : 'sameElse';
}

function calendar$1 (time, formats) {
    // We want to compare the start of today, vs this.
    // Getting start-of-today depends on whether we're local/utc/offset or not.
    var now = time || createLocal(),
        sod = cloneWithOffset(now, this).startOf('day'),
        format = hooks.calendarFormat(this, sod) || 'sameElse';

    var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

    return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
}

function clone () {
    return new Moment(this);
}

function isAfter (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() > localInput.valueOf();
    } else {
        return localInput.valueOf() < this.clone().startOf(units).valueOf();
    }
}

function isBefore (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() < localInput.valueOf();
    } else {
        return this.clone().endOf(units).valueOf() < localInput.valueOf();
    }
}

function isBetween (from, to, units, inclusivity) {
    inclusivity = inclusivity || '()';
    return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
        (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
}

function isSame (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input),
        inputMs;
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(units || 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() === localInput.valueOf();
    } else {
        inputMs = localInput.valueOf();
        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
    }
}

function isSameOrAfter (input, units) {
    return this.isSame(input, units) || this.isAfter(input,units);
}

function isSameOrBefore (input, units) {
    return this.isSame(input, units) || this.isBefore(input,units);
}

function diff (input, units, asFloat) {
    var that,
        zoneDelta,
        delta, output;

    if (!this.isValid()) {
        return NaN;
    }

    that = cloneWithOffset(input, this);

    if (!that.isValid()) {
        return NaN;
    }

    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

    units = normalizeUnits(units);

    switch (units) {
        case 'year': output = monthDiff(this, that) / 12; break;
        case 'month': output = monthDiff(this, that); break;
        case 'quarter': output = monthDiff(this, that) / 3; break;
        case 'second': output = (this - that) / 1e3; break; // 1000
        case 'minute': output = (this - that) / 6e4; break; // 1000 * 60
        case 'hour': output = (this - that) / 36e5; break; // 1000 * 60 * 60
        case 'day': output = (this - that - zoneDelta) / 864e5; break; // 1000 * 60 * 60 * 24, negate dst
        case 'week': output = (this - that - zoneDelta) / 6048e5; break; // 1000 * 60 * 60 * 24 * 7, negate dst
        default: output = this - that;
    }

    return asFloat ? output : absFloor(output);
}

function monthDiff (a, b) {
    // difference in months
    var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
        // b is in (anchor - 1 month, anchor + 1 month)
        anchor = a.clone().add(wholeMonthDiff, 'months'),
        anchor2, adjust;

    if (b - anchor < 0) {
        anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor - anchor2);
    } else {
        anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor2 - anchor);
    }

    //check for negative zero, return zero if negative zero
    return -(wholeMonthDiff + adjust) || 0;
}

hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

function toString () {
    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
}

function toISOString() {
    if (!this.isValid()) {
        return null;
    }
    var m = this.clone().utc();
    if (m.year() < 0 || m.year() > 9999) {
        return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
    if (isFunction(Date.prototype.toISOString)) {
        // native implementation is ~50x faster, use it when we can
        return this.toDate().toISOString();
    }
    return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
}

/**
 * Return a human readable representation of a moment that can
 * also be evaluated to get a new moment which is the same
 *
 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
 */
function inspect () {
    if (!this.isValid()) {
        return 'moment.invalid(/* ' + this._i + ' */)';
    }
    var func = 'moment';
    var zone = '';
    if (!this.isLocal()) {
        func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
        zone = 'Z';
    }
    var prefix = '[' + func + '("]';
    var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
    var datetime = '-MM-DD[T]HH:mm:ss.SSS';
    var suffix = zone + '[")]';

    return this.format(prefix + year + datetime + suffix);
}

function format (inputString) {
    if (!inputString) {
        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
    }
    var output = formatMoment(this, inputString);
    return this.localeData().postformat(output);
}

function from (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function fromNow (withoutSuffix) {
    return this.from(createLocal(), withoutSuffix);
}

function to (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function toNow (withoutSuffix) {
    return this.to(createLocal(), withoutSuffix);
}

// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
function locale (key) {
    var newLocaleData;

    if (key === undefined) {
        return this._locale._abbr;
    } else {
        newLocaleData = getLocale(key);
        if (newLocaleData != null) {
            this._locale = newLocaleData;
        }
        return this;
    }
}

var lang = deprecate(
    'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
    function (key) {
        if (key === undefined) {
            return this.localeData();
        } else {
            return this.locale(key);
        }
    }
);

function localeData () {
    return this._locale;
}

function startOf (units) {
    units = normalizeUnits(units);
    // the following switch intentionally omits break keywords
    // to utilize falling through the cases.
    switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
        case 'date':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
    }

    // weeks are a special case
    if (units === 'week') {
        this.weekday(0);
    }
    if (units === 'isoWeek') {
        this.isoWeekday(1);
    }

    // quarters are also special
    if (units === 'quarter') {
        this.month(Math.floor(this.month() / 3) * 3);
    }

    return this;
}

function endOf (units) {
    units = normalizeUnits(units);
    if (units === undefined || units === 'millisecond') {
        return this;
    }

    // 'date' is an alias for 'day', so it should be considered as such.
    if (units === 'date') {
        units = 'day';
    }

    return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
}

function valueOf () {
    return this._d.valueOf() - ((this._offset || 0) * 60000);
}

function unix () {
    return Math.floor(this.valueOf() / 1000);
}

function toDate () {
    return new Date(this.valueOf());
}

function toArray () {
    var m = this;
    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
}

function toObject () {
    var m = this;
    return {
        years: m.year(),
        months: m.month(),
        date: m.date(),
        hours: m.hours(),
        minutes: m.minutes(),
        seconds: m.seconds(),
        milliseconds: m.milliseconds()
    };
}

function toJSON () {
    // new Date(NaN).toJSON() === null
    return this.isValid() ? this.toISOString() : null;
}

function isValid$2 () {
    return isValid(this);
}

function parsingFlags () {
    return extend({}, getParsingFlags(this));
}

function invalidAt () {
    return getParsingFlags(this).overflow;
}

function creationData() {
    return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
    };
}

// FORMATTING

addFormatToken(0, ['gg', 2], 0, function () {
    return this.weekYear() % 100;
});

addFormatToken(0, ['GG', 2], 0, function () {
    return this.isoWeekYear() % 100;
});

function addWeekYearFormatToken (token, getter) {
    addFormatToken(0, [token, token.length], 0, getter);
}

addWeekYearFormatToken('gggg',     'weekYear');
addWeekYearFormatToken('ggggg',    'weekYear');
addWeekYearFormatToken('GGGG',  'isoWeekYear');
addWeekYearFormatToken('GGGGG', 'isoWeekYear');

// ALIASES

addUnitAlias('weekYear', 'gg');
addUnitAlias('isoWeekYear', 'GG');

// PRIORITY

addUnitPriority('weekYear', 1);
addUnitPriority('isoWeekYear', 1);


// PARSING

addRegexToken('G',      matchSigned);
addRegexToken('g',      matchSigned);
addRegexToken('GG',     match1to2, match2);
addRegexToken('gg',     match1to2, match2);
addRegexToken('GGGG',   match1to4, match4);
addRegexToken('gggg',   match1to4, match4);
addRegexToken('GGGGG',  match1to6, match6);
addRegexToken('ggggg',  match1to6, match6);

addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
    week[token.substr(0, 2)] = toInt(input);
});

addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
    week[token] = hooks.parseTwoDigitYear(input);
});

// MOMENTS

function getSetWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy);
}

function getSetISOWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input, this.isoWeek(), this.isoWeekday(), 1, 4);
}

function getISOWeeksInYear () {
    return weeksInYear(this.year(), 1, 4);
}

function getWeeksInYear () {
    var weekInfo = this.localeData()._week;
    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
}

function getSetWeekYearHelper(input, week, weekday, dow, doy) {
    var weeksTarget;
    if (input == null) {
        return weekOfYear(this, dow, doy).year;
    } else {
        weeksTarget = weeksInYear(input, dow, doy);
        if (week > weeksTarget) {
            week = weeksTarget;
        }
        return setWeekAll.call(this, input, week, weekday, dow, doy);
    }
}

function setWeekAll(weekYear, week, weekday, dow, doy) {
    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
        date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

    this.year(date.getUTCFullYear());
    this.month(date.getUTCMonth());
    this.date(date.getUTCDate());
    return this;
}

// FORMATTING

addFormatToken('Q', 0, 'Qo', 'quarter');

// ALIASES

addUnitAlias('quarter', 'Q');

// PRIORITY

addUnitPriority('quarter', 7);

// PARSING

addRegexToken('Q', match1);
addParseToken('Q', function (input, array) {
    array[MONTH] = (toInt(input) - 1) * 3;
});

// MOMENTS

function getSetQuarter (input) {
    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
}

// FORMATTING

addFormatToken('D', ['DD', 2], 'Do', 'date');

// ALIASES

addUnitAlias('date', 'D');

// PRIOROITY
addUnitPriority('date', 9);

// PARSING

addRegexToken('D',  match1to2);
addRegexToken('DD', match1to2, match2);
addRegexToken('Do', function (isStrict, locale) {
    // TODO: Remove "ordinalParse" fallback in next major release.
    return isStrict ?
      (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
      locale._dayOfMonthOrdinalParseLenient;
});

addParseToken(['D', 'DD'], DATE);
addParseToken('Do', function (input, array) {
    array[DATE] = toInt(input.match(match1to2)[0], 10);
});

// MOMENTS

var getSetDayOfMonth = makeGetSet('Date', true);

// FORMATTING

addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

// ALIASES

addUnitAlias('dayOfYear', 'DDD');

// PRIORITY
addUnitPriority('dayOfYear', 4);

// PARSING

addRegexToken('DDD',  match1to3);
addRegexToken('DDDD', match3);
addParseToken(['DDD', 'DDDD'], function (input, array, config) {
    config._dayOfYear = toInt(input);
});

// HELPERS

// MOMENTS

function getSetDayOfYear (input) {
    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
    return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
}

// FORMATTING

addFormatToken('m', ['mm', 2], 0, 'minute');

// ALIASES

addUnitAlias('minute', 'm');

// PRIORITY

addUnitPriority('minute', 14);

// PARSING

addRegexToken('m',  match1to2);
addRegexToken('mm', match1to2, match2);
addParseToken(['m', 'mm'], MINUTE);

// MOMENTS

var getSetMinute = makeGetSet('Minutes', false);

// FORMATTING

addFormatToken('s', ['ss', 2], 0, 'second');

// ALIASES

addUnitAlias('second', 's');

// PRIORITY

addUnitPriority('second', 15);

// PARSING

addRegexToken('s',  match1to2);
addRegexToken('ss', match1to2, match2);
addParseToken(['s', 'ss'], SECOND);

// MOMENTS

var getSetSecond = makeGetSet('Seconds', false);

// FORMATTING

addFormatToken('S', 0, 0, function () {
    return ~~(this.millisecond() / 100);
});

addFormatToken(0, ['SS', 2], 0, function () {
    return ~~(this.millisecond() / 10);
});

addFormatToken(0, ['SSS', 3], 0, 'millisecond');
addFormatToken(0, ['SSSS', 4], 0, function () {
    return this.millisecond() * 10;
});
addFormatToken(0, ['SSSSS', 5], 0, function () {
    return this.millisecond() * 100;
});
addFormatToken(0, ['SSSSSS', 6], 0, function () {
    return this.millisecond() * 1000;
});
addFormatToken(0, ['SSSSSSS', 7], 0, function () {
    return this.millisecond() * 10000;
});
addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
    return this.millisecond() * 100000;
});
addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
    return this.millisecond() * 1000000;
});


// ALIASES

addUnitAlias('millisecond', 'ms');

// PRIORITY

addUnitPriority('millisecond', 16);

// PARSING

addRegexToken('S',    match1to3, match1);
addRegexToken('SS',   match1to3, match2);
addRegexToken('SSS',  match1to3, match3);

var token;
for (token = 'SSSS'; token.length <= 9; token += 'S') {
    addRegexToken(token, matchUnsigned);
}

function parseMs(input, array) {
    array[MILLISECOND] = toInt(('0.' + input) * 1000);
}

for (token = 'S'; token.length <= 9; token += 'S') {
    addParseToken(token, parseMs);
}
// MOMENTS

var getSetMillisecond = makeGetSet('Milliseconds', false);

// FORMATTING

addFormatToken('z',  0, 0, 'zoneAbbr');
addFormatToken('zz', 0, 0, 'zoneName');

// MOMENTS

function getZoneAbbr () {
    return this._isUTC ? 'UTC' : '';
}

function getZoneName () {
    return this._isUTC ? 'Coordinated Universal Time' : '';
}

var proto = Moment.prototype;

proto.add               = add;
proto.calendar          = calendar$1;
proto.clone             = clone;
proto.diff              = diff;
proto.endOf             = endOf;
proto.format            = format;
proto.from              = from;
proto.fromNow           = fromNow;
proto.to                = to;
proto.toNow             = toNow;
proto.get               = stringGet;
proto.invalidAt         = invalidAt;
proto.isAfter           = isAfter;
proto.isBefore          = isBefore;
proto.isBetween         = isBetween;
proto.isSame            = isSame;
proto.isSameOrAfter     = isSameOrAfter;
proto.isSameOrBefore    = isSameOrBefore;
proto.isValid           = isValid$2;
proto.lang              = lang;
proto.locale            = locale;
proto.localeData        = localeData;
proto.max               = prototypeMax;
proto.min               = prototypeMin;
proto.parsingFlags      = parsingFlags;
proto.set               = stringSet;
proto.startOf           = startOf;
proto.subtract          = subtract;
proto.toArray           = toArray;
proto.toObject          = toObject;
proto.toDate            = toDate;
proto.toISOString       = toISOString;
proto.inspect           = inspect;
proto.toJSON            = toJSON;
proto.toString          = toString;
proto.unix              = unix;
proto.valueOf           = valueOf;
proto.creationData      = creationData;

// Year
proto.year       = getSetYear;
proto.isLeapYear = getIsLeapYear;

// Week Year
proto.weekYear    = getSetWeekYear;
proto.isoWeekYear = getSetISOWeekYear;

// Quarter
proto.quarter = proto.quarters = getSetQuarter;

// Month
proto.month       = getSetMonth;
proto.daysInMonth = getDaysInMonth;

// Week
proto.week           = proto.weeks        = getSetWeek;
proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
proto.weeksInYear    = getWeeksInYear;
proto.isoWeeksInYear = getISOWeeksInYear;

// Day
proto.date       = getSetDayOfMonth;
proto.day        = proto.days             = getSetDayOfWeek;
proto.weekday    = getSetLocaleDayOfWeek;
proto.isoWeekday = getSetISODayOfWeek;
proto.dayOfYear  = getSetDayOfYear;

// Hour
proto.hour = proto.hours = getSetHour;

// Minute
proto.minute = proto.minutes = getSetMinute;

// Second
proto.second = proto.seconds = getSetSecond;

// Millisecond
proto.millisecond = proto.milliseconds = getSetMillisecond;

// Offset
proto.utcOffset            = getSetOffset;
proto.utc                  = setOffsetToUTC;
proto.local                = setOffsetToLocal;
proto.parseZone            = setOffsetToParsedOffset;
proto.hasAlignedHourOffset = hasAlignedHourOffset;
proto.isDST                = isDaylightSavingTime;
proto.isLocal              = isLocal;
proto.isUtcOffset          = isUtcOffset;
proto.isUtc                = isUtc;
proto.isUTC                = isUtc;

// Timezone
proto.zoneAbbr = getZoneAbbr;
proto.zoneName = getZoneName;

// Deprecations
proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

function createUnix (input) {
    return createLocal(input * 1000);
}

function createInZone () {
    return createLocal.apply(null, arguments).parseZone();
}

function preParsePostFormat (string) {
    return string;
}

var proto$1 = Locale.prototype;

proto$1.calendar        = calendar;
proto$1.longDateFormat  = longDateFormat;
proto$1.invalidDate     = invalidDate;
proto$1.ordinal         = ordinal;
proto$1.preparse        = preParsePostFormat;
proto$1.postformat      = preParsePostFormat;
proto$1.relativeTime    = relativeTime;
proto$1.pastFuture      = pastFuture;
proto$1.set             = set;

// Month
proto$1.months            =        localeMonths;
proto$1.monthsShort       =        localeMonthsShort;
proto$1.monthsParse       =        localeMonthsParse;
proto$1.monthsRegex       = monthsRegex;
proto$1.monthsShortRegex  = monthsShortRegex;

// Week
proto$1.week = localeWeek;
proto$1.firstDayOfYear = localeFirstDayOfYear;
proto$1.firstDayOfWeek = localeFirstDayOfWeek;

// Day of Week
proto$1.weekdays       =        localeWeekdays;
proto$1.weekdaysMin    =        localeWeekdaysMin;
proto$1.weekdaysShort  =        localeWeekdaysShort;
proto$1.weekdaysParse  =        localeWeekdaysParse;

proto$1.weekdaysRegex       =        weekdaysRegex;
proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

// Hours
proto$1.isPM = localeIsPM;
proto$1.meridiem = localeMeridiem;

function get$1 (format, index, field, setter) {
    var locale = getLocale();
    var utc = createUTC().set(setter, index);
    return locale[field](utc, format);
}

function listMonthsImpl (format, index, field) {
    if (isNumber(format)) {
        index = format;
        format = undefined;
    }

    format = format || '';

    if (index != null) {
        return get$1(format, index, field, 'month');
    }

    var i;
    var out = [];
    for (i = 0; i < 12; i++) {
        out[i] = get$1(format, i, field, 'month');
    }
    return out;
}

// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
function listWeekdaysImpl (localeSorted, format, index, field) {
    if (typeof localeSorted === 'boolean') {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    } else {
        format = localeSorted;
        index = format;
        localeSorted = false;

        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    }

    var locale = getLocale(),
        shift = localeSorted ? locale._week.dow : 0;

    if (index != null) {
        return get$1(format, (index + shift) % 7, field, 'day');
    }

    var i;
    var out = [];
    for (i = 0; i < 7; i++) {
        out[i] = get$1(format, (i + shift) % 7, field, 'day');
    }
    return out;
}

function listMonths (format, index) {
    return listMonthsImpl(format, index, 'months');
}

function listMonthsShort (format, index) {
    return listMonthsImpl(format, index, 'monthsShort');
}

function listWeekdays (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
}

function listWeekdaysShort (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
}

function listWeekdaysMin (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
}

getSetGlobalLocale('en', {
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (toInt(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    }
});

// Side effect imports
hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

var mathAbs = Math.abs;

function abs () {
    var data           = this._data;

    this._milliseconds = mathAbs(this._milliseconds);
    this._days         = mathAbs(this._days);
    this._months       = mathAbs(this._months);

    data.milliseconds  = mathAbs(data.milliseconds);
    data.seconds       = mathAbs(data.seconds);
    data.minutes       = mathAbs(data.minutes);
    data.hours         = mathAbs(data.hours);
    data.months        = mathAbs(data.months);
    data.years         = mathAbs(data.years);

    return this;
}

function addSubtract$1 (duration, input, value, direction) {
    var other = createDuration(input, value);

    duration._milliseconds += direction * other._milliseconds;
    duration._days         += direction * other._days;
    duration._months       += direction * other._months;

    return duration._bubble();
}

// supports only 2.0-style add(1, 's') or add(duration)
function add$1 (input, value) {
    return addSubtract$1(this, input, value, 1);
}

// supports only 2.0-style subtract(1, 's') or subtract(duration)
function subtract$1 (input, value) {
    return addSubtract$1(this, input, value, -1);
}

function absCeil (number) {
    if (number < 0) {
        return Math.floor(number);
    } else {
        return Math.ceil(number);
    }
}

function bubble () {
    var milliseconds = this._milliseconds;
    var days         = this._days;
    var months       = this._months;
    var data         = this._data;
    var seconds, minutes, hours, years, monthsFromDays;

    // if we have a mix of positive and negative values, bubble down first
    // check: https://github.com/moment/moment/issues/2166
    if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
            (milliseconds <= 0 && days <= 0 && months <= 0))) {
        milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
        days = 0;
        months = 0;
    }

    // The following code bubbles up values, see the tests for
    // examples of what that means.
    data.milliseconds = milliseconds % 1000;

    seconds           = absFloor(milliseconds / 1000);
    data.seconds      = seconds % 60;

    minutes           = absFloor(seconds / 60);
    data.minutes      = minutes % 60;

    hours             = absFloor(minutes / 60);
    data.hours        = hours % 24;

    days += absFloor(hours / 24);

    // convert days to months
    monthsFromDays = absFloor(daysToMonths(days));
    months += monthsFromDays;
    days -= absCeil(monthsToDays(monthsFromDays));

    // 12 months -> 1 year
    years = absFloor(months / 12);
    months %= 12;

    data.days   = days;
    data.months = months;
    data.years  = years;

    return this;
}

function daysToMonths (days) {
    // 400 years have 146097 days (taking into account leap year rules)
    // 400 years have 12 months === 4800
    return days * 4800 / 146097;
}

function monthsToDays (months) {
    // the reverse of daysToMonths
    return months * 146097 / 4800;
}

function as (units) {
    if (!this.isValid()) {
        return NaN;
    }
    var days;
    var months;
    var milliseconds = this._milliseconds;

    units = normalizeUnits(units);

    if (units === 'month' || units === 'year') {
        days   = this._days   + milliseconds / 864e5;
        months = this._months + daysToMonths(days);
        return units === 'month' ? months : months / 12;
    } else {
        // handle milliseconds separately because of floating point math errors (issue #1867)
        days = this._days + Math.round(monthsToDays(this._months));
        switch (units) {
            case 'week'   : return days / 7     + milliseconds / 6048e5;
            case 'day'    : return days         + milliseconds / 864e5;
            case 'hour'   : return days * 24    + milliseconds / 36e5;
            case 'minute' : return days * 1440  + milliseconds / 6e4;
            case 'second' : return days * 86400 + milliseconds / 1000;
            // Math.floor prevents floating point math errors here
            case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
            default: throw new Error('Unknown unit ' + units);
        }
    }
}

// TODO: Use this.as('ms')?
function valueOf$1 () {
    if (!this.isValid()) {
        return NaN;
    }
    return (
        this._milliseconds +
        this._days * 864e5 +
        (this._months % 12) * 2592e6 +
        toInt(this._months / 12) * 31536e6
    );
}

function makeAs (alias) {
    return function () {
        return this.as(alias);
    };
}

var asMilliseconds = makeAs('ms');
var asSeconds      = makeAs('s');
var asMinutes      = makeAs('m');
var asHours        = makeAs('h');
var asDays         = makeAs('d');
var asWeeks        = makeAs('w');
var asMonths       = makeAs('M');
var asYears        = makeAs('y');

function clone$1 () {
    return createDuration(this);
}

function get$2 (units) {
    units = normalizeUnits(units);
    return this.isValid() ? this[units + 's']() : NaN;
}

function makeGetter(name) {
    return function () {
        return this.isValid() ? this._data[name] : NaN;
    };
}

var milliseconds = makeGetter('milliseconds');
var seconds      = makeGetter('seconds');
var minutes      = makeGetter('minutes');
var hours        = makeGetter('hours');
var days         = makeGetter('days');
var months       = makeGetter('months');
var years        = makeGetter('years');

function weeks () {
    return absFloor(this.days() / 7);
}

var round = Math.round;
var thresholds = {
    ss: 44,         // a few seconds to seconds
    s : 45,         // seconds to minute
    m : 45,         // minutes to hour
    h : 22,         // hours to day
    d : 26,         // days to month
    M : 11          // months to year
};

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}

function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
    var duration = createDuration(posNegDuration).abs();
    var seconds  = round(duration.as('s'));
    var minutes  = round(duration.as('m'));
    var hours    = round(duration.as('h'));
    var days     = round(duration.as('d'));
    var months   = round(duration.as('M'));
    var years    = round(duration.as('y'));

    var a = seconds <= thresholds.ss && ['s', seconds]  ||
            seconds < thresholds.s   && ['ss', seconds] ||
            minutes <= 1             && ['m']           ||
            minutes < thresholds.m   && ['mm', minutes] ||
            hours   <= 1             && ['h']           ||
            hours   < thresholds.h   && ['hh', hours]   ||
            days    <= 1             && ['d']           ||
            days    < thresholds.d   && ['dd', days]    ||
            months  <= 1             && ['M']           ||
            months  < thresholds.M   && ['MM', months]  ||
            years   <= 1             && ['y']           || ['yy', years];

    a[2] = withoutSuffix;
    a[3] = +posNegDuration > 0;
    a[4] = locale;
    return substituteTimeAgo.apply(null, a);
}

// This function allows you to set the rounding function for relative time strings
function getSetRelativeTimeRounding (roundingFunction) {
    if (roundingFunction === undefined) {
        return round;
    }
    if (typeof(roundingFunction) === 'function') {
        round = roundingFunction;
        return true;
    }
    return false;
}

// This function allows you to set a threshold for relative time strings
function getSetRelativeTimeThreshold (threshold, limit) {
    if (thresholds[threshold] === undefined) {
        return false;
    }
    if (limit === undefined) {
        return thresholds[threshold];
    }
    thresholds[threshold] = limit;
    if (threshold === 's') {
        thresholds.ss = limit - 1;
    }
    return true;
}

function humanize (withSuffix) {
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var locale = this.localeData();
    var output = relativeTime$1(this, !withSuffix, locale);

    if (withSuffix) {
        output = locale.pastFuture(+this, output);
    }

    return locale.postformat(output);
}

var abs$1 = Math.abs;

function sign(x) {
    return ((x > 0) - (x < 0)) || +x;
}

function toISOString$1() {
    // for ISO strings we do not use the normal bubbling rules:
    //  * milliseconds bubble up until they become hours
    //  * days do not bubble at all
    //  * months bubble up until they become years
    // This is because there is no context-free conversion between hours and days
    // (think of clock changes)
    // and also not between days and months (28-31 days per month)
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var seconds = abs$1(this._milliseconds) / 1000;
    var days         = abs$1(this._days);
    var months       = abs$1(this._months);
    var minutes, hours, years;

    // 3600 seconds -> 60 minutes -> 1 hour
    minutes           = absFloor(seconds / 60);
    hours             = absFloor(minutes / 60);
    seconds %= 60;
    minutes %= 60;

    // 12 months -> 1 year
    years  = absFloor(months / 12);
    months %= 12;


    // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
    var Y = years;
    var M = months;
    var D = days;
    var h = hours;
    var m = minutes;
    var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
    var total = this.asSeconds();

    if (!total) {
        // this is the same as C#'s (Noda) and python (isodate)...
        // but not other JS (goog.date)
        return 'P0D';
    }

    var totalSign = total < 0 ? '-' : '';
    var ymSign = sign(this._months) !== sign(total) ? '-' : '';
    var daysSign = sign(this._days) !== sign(total) ? '-' : '';
    var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

    return totalSign + 'P' +
        (Y ? ymSign + Y + 'Y' : '') +
        (M ? ymSign + M + 'M' : '') +
        (D ? daysSign + D + 'D' : '') +
        ((h || m || s) ? 'T' : '') +
        (h ? hmsSign + h + 'H' : '') +
        (m ? hmsSign + m + 'M' : '') +
        (s ? hmsSign + s + 'S' : '');
}

var proto$2 = Duration.prototype;

proto$2.isValid        = isValid$1;
proto$2.abs            = abs;
proto$2.add            = add$1;
proto$2.subtract       = subtract$1;
proto$2.as             = as;
proto$2.asMilliseconds = asMilliseconds;
proto$2.asSeconds      = asSeconds;
proto$2.asMinutes      = asMinutes;
proto$2.asHours        = asHours;
proto$2.asDays         = asDays;
proto$2.asWeeks        = asWeeks;
proto$2.asMonths       = asMonths;
proto$2.asYears        = asYears;
proto$2.valueOf        = valueOf$1;
proto$2._bubble        = bubble;
proto$2.clone          = clone$1;
proto$2.get            = get$2;
proto$2.milliseconds   = milliseconds;
proto$2.seconds        = seconds;
proto$2.minutes        = minutes;
proto$2.hours          = hours;
proto$2.days           = days;
proto$2.weeks          = weeks;
proto$2.months         = months;
proto$2.years          = years;
proto$2.humanize       = humanize;
proto$2.toISOString    = toISOString$1;
proto$2.toString       = toISOString$1;
proto$2.toJSON         = toISOString$1;
proto$2.locale         = locale;
proto$2.localeData     = localeData;

// Deprecations
proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
proto$2.lang = lang;

// Side effect imports

// FORMATTING

addFormatToken('X', 0, 0, 'unix');
addFormatToken('x', 0, 0, 'valueOf');

// PARSING

addRegexToken('x', matchSigned);
addRegexToken('X', matchTimestamp);
addParseToken('X', function (input, array, config) {
    config._d = new Date(parseFloat(input, 10) * 1000);
});
addParseToken('x', function (input, array, config) {
    config._d = new Date(toInt(input));
});

// Side effect imports

//! moment.js
//! version : 2.19.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

hooks.version = '2.19.1';

setHookCallback(createLocal);

hooks.fn                    = proto;
hooks.min                   = min;
hooks.max                   = max;
hooks.now                   = now;
hooks.utc                   = createUTC;
hooks.unix                  = createUnix;
hooks.months                = listMonths;
hooks.isDate                = isDate;
hooks.locale                = getSetGlobalLocale;
hooks.invalid               = createInvalid;
hooks.duration              = createDuration;
hooks.isMoment              = isMoment;
hooks.weekdays              = listWeekdays;
hooks.parseZone             = createInZone;
hooks.localeData            = getLocale;
hooks.isDuration            = isDuration;
hooks.monthsShort           = listMonthsShort;
hooks.weekdaysMin           = listWeekdaysMin;
hooks.defineLocale          = defineLocale;
hooks.updateLocale          = updateLocale;
hooks.locales               = listLocales;
hooks.weekdaysShort         = listWeekdaysShort;
hooks.normalizeUnits        = normalizeUnits;
hooks.relativeTimeRounding  = getSetRelativeTimeRounding;
hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
hooks.calendarFormat        = getCalendarFormat;
hooks.prototype             = proto;

//! moment.js locale configuration
//! locale : Afrikaans [af]
//! author : Werner Mollentze : https://github.com/wernerm

hooks.defineLocale('af', {
    months : 'Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember'.split('_'),
    monthsShort : 'Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
    weekdays : 'Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag'.split('_'),
    weekdaysShort : 'Son_Maa_Din_Woe_Don_Vry_Sat'.split('_'),
    weekdaysMin : 'So_Ma_Di_Wo_Do_Vr_Sa'.split('_'),
    meridiemParse: /vm|nm/i,
    isPM : function (input) {
        return /^nm$/i.test(input);
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 12) {
            return isLower ? 'vm' : 'VM';
        } else {
            return isLower ? 'nm' : 'NM';
        }
    },
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Vandag om] LT',
        nextDay : '[Môre om] LT',
        nextWeek : 'dddd [om] LT',
        lastDay : '[Gister om] LT',
        lastWeek : '[Laas] dddd [om] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'oor %s',
        past : '%s gelede',
        s : '\'n paar sekondes',
        m : '\'n minuut',
        mm : '%d minute',
        h : '\'n uur',
        hh : '%d ure',
        d : '\'n dag',
        dd : '%d dae',
        M : '\'n maand',
        MM : '%d maande',
        y : '\'n jaar',
        yy : '%d jaar'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
    ordinal : function (number) {
        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de'); // Thanks to Joris Röling : https://github.com/jjupiter
    },
    week : {
        dow : 1, // Maandag is die eerste dag van die week.
        doy : 4  // Die week wat die 4de Januarie bevat is die eerste week van die jaar.
    }
});

//! moment.js locale configuration
//! locale : Arabic (Algeria) [ar-dz]
//! author : Noureddine LOUAHEDJ : https://github.com/noureddineme

hooks.defineLocale('ar-dz', {
    months : 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
    monthsShort : 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
    weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    weekdaysShort : 'احد_اثنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
    weekdaysMin : 'أح_إث_ثلا_أر_خم_جم_سب'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[اليوم على الساعة] LT',
        nextDay: '[غدا على الساعة] LT',
        nextWeek: 'dddd [على الساعة] LT',
        lastDay: '[أمس على الساعة] LT',
        lastWeek: 'dddd [على الساعة] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'في %s',
        past : 'منذ %s',
        s : 'ثوان',
        m : 'دقيقة',
        mm : '%d دقائق',
        h : 'ساعة',
        hh : '%d ساعات',
        d : 'يوم',
        dd : '%d أيام',
        M : 'شهر',
        MM : '%d أشهر',
        y : 'سنة',
        yy : '%d سنوات'
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 4  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Arabic (Kuwait) [ar-kw]
//! author : Nusret Parlak: https://github.com/nusretparlak

hooks.defineLocale('ar-kw', {
    months : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
    monthsShort : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
    weekdays : 'الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    weekdaysShort : 'احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[اليوم على الساعة] LT',
        nextDay: '[غدا على الساعة] LT',
        nextWeek: 'dddd [على الساعة] LT',
        lastDay: '[أمس على الساعة] LT',
        lastWeek: 'dddd [على الساعة] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'في %s',
        past : 'منذ %s',
        s : 'ثوان',
        m : 'دقيقة',
        mm : '%d دقائق',
        h : 'ساعة',
        hh : '%d ساعات',
        d : 'يوم',
        dd : '%d أيام',
        M : 'شهر',
        MM : '%d أشهر',
        y : 'سنة',
        yy : '%d سنوات'
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Arabic (Lybia) [ar-ly]
//! author : Ali Hmer: https://github.com/kikoanis

var symbolMap = {
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '0': '0'
};
var pluralForm = function (n) {
    return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
};
var plurals = {
    s : ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
    m : ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
    h : ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
    d : ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
    M : ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
    y : ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
};
var pluralize = function (u) {
    return function (number, withoutSuffix, string, isFuture) {
        var f = pluralForm(number),
            str = plurals[u][pluralForm(number)];
        if (f === 2) {
            str = str[withoutSuffix ? 0 : 1];
        }
        return str.replace(/%d/i, number);
    };
};
var months$1 = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر'
];

hooks.defineLocale('ar-ly', {
    months : months$1,
    monthsShort : months$1,
    weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'D/\u200FM/\u200FYYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    meridiemParse: /ص|م/,
    isPM : function (input) {
        return 'م' === input;
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'ص';
        } else {
            return 'م';
        }
    },
    calendar : {
        sameDay: '[اليوم عند الساعة] LT',
        nextDay: '[غدًا عند الساعة] LT',
        nextWeek: 'dddd [عند الساعة] LT',
        lastDay: '[أمس عند الساعة] LT',
        lastWeek: 'dddd [عند الساعة] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'بعد %s',
        past : 'منذ %s',
        s : pluralize('s'),
        m : pluralize('m'),
        mm : pluralize('m'),
        h : pluralize('h'),
        hh : pluralize('h'),
        d : pluralize('d'),
        dd : pluralize('d'),
        M : pluralize('M'),
        MM : pluralize('M'),
        y : pluralize('y'),
        yy : pluralize('y')
    },
    preparse: function (string) {
        return string.replace(/،/g, ',');
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap[match];
        }).replace(/,/g, '،');
    },
    week : {
        dow : 6, // Saturday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Arabic (Morocco) [ar-ma]
//! author : ElFadili Yassine : https://github.com/ElFadiliY
//! author : Abdel Said : https://github.com/abdelsaid

hooks.defineLocale('ar-ma', {
    months : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
    monthsShort : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
    weekdays : 'الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    weekdaysShort : 'احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[اليوم على الساعة] LT',
        nextDay: '[غدا على الساعة] LT',
        nextWeek: 'dddd [على الساعة] LT',
        lastDay: '[أمس على الساعة] LT',
        lastWeek: 'dddd [على الساعة] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'في %s',
        past : 'منذ %s',
        s : 'ثوان',
        m : 'دقيقة',
        mm : '%d دقائق',
        h : 'ساعة',
        hh : '%d ساعات',
        d : 'يوم',
        dd : '%d أيام',
        M : 'شهر',
        MM : '%d أشهر',
        y : 'سنة',
        yy : '%d سنوات'
    },
    week : {
        dow : 6, // Saturday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Arabic (Saudi Arabia) [ar-sa]
//! author : Suhail Alkowaileet : https://github.com/xsoh

var symbolMap$1 = {
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩',
    '0': '٠'
};
var numberMap = {
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    '٠': '0'
};

hooks.defineLocale('ar-sa', {
    months : 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
    monthsShort : 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
    weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    meridiemParse: /ص|م/,
    isPM : function (input) {
        return 'م' === input;
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'ص';
        } else {
            return 'م';
        }
    },
    calendar : {
        sameDay: '[اليوم على الساعة] LT',
        nextDay: '[غدا على الساعة] LT',
        nextWeek: 'dddd [على الساعة] LT',
        lastDay: '[أمس على الساعة] LT',
        lastWeek: 'dddd [على الساعة] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'في %s',
        past : 'منذ %s',
        s : 'ثوان',
        m : 'دقيقة',
        mm : '%d دقائق',
        h : 'ساعة',
        hh : '%d ساعات',
        d : 'يوم',
        dd : '%d أيام',
        M : 'شهر',
        MM : '%d أشهر',
        y : 'سنة',
        yy : '%d سنوات'
    },
    preparse: function (string) {
        return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
            return numberMap[match];
        }).replace(/،/g, ',');
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap$1[match];
        }).replace(/,/g, '،');
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale  :  Arabic (Tunisia) [ar-tn]
//! author : Nader Toukabri : https://github.com/naderio

hooks.defineLocale('ar-tn', {
    months: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
    monthsShort: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
    weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
    weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    weekdaysParseExact : true,
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd D MMMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[اليوم على الساعة] LT',
        nextDay: '[غدا على الساعة] LT',
        nextWeek: 'dddd [على الساعة] LT',
        lastDay: '[أمس على الساعة] LT',
        lastWeek: 'dddd [على الساعة] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'في %s',
        past: 'منذ %s',
        s: 'ثوان',
        m: 'دقيقة',
        mm: '%d دقائق',
        h: 'ساعة',
        hh: '%d ساعات',
        d: 'يوم',
        dd: '%d أيام',
        M: 'شهر',
        MM: '%d أشهر',
        y: 'سنة',
        yy: '%d سنوات'
    },
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Arabic [ar]
//! author : Abdel Said: https://github.com/abdelsaid
//! author : Ahmed Elkhatib
//! author : forabi https://github.com/forabi

var symbolMap$2 = {
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩',
    '0': '٠'
};
var numberMap$1 = {
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    '٠': '0'
};
var pluralForm$1 = function (n) {
    return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
};
var plurals$1 = {
    s : ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
    m : ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
    h : ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
    d : ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
    M : ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
    y : ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
};
var pluralize$1 = function (u) {
    return function (number, withoutSuffix, string, isFuture) {
        var f = pluralForm$1(number),
            str = plurals$1[u][pluralForm$1(number)];
        if (f === 2) {
            str = str[withoutSuffix ? 0 : 1];
        }
        return str.replace(/%d/i, number);
    };
};
var months$2 = [
    'كانون الثاني يناير',
    'شباط فبراير',
    'آذار مارس',
    'نيسان أبريل',
    'أيار مايو',
    'حزيران يونيو',
    'تموز يوليو',
    'آب أغسطس',
    'أيلول سبتمبر',
    'تشرين الأول أكتوبر',
    'تشرين الثاني نوفمبر',
    'كانون الأول ديسمبر'
];

hooks.defineLocale('ar', {
    months : months$2,
    monthsShort : months$2,
    weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'D/\u200FM/\u200FYYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    meridiemParse: /ص|م/,
    isPM : function (input) {
        return 'م' === input;
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'ص';
        } else {
            return 'م';
        }
    },
    calendar : {
        sameDay: '[اليوم عند الساعة] LT',
        nextDay: '[غدًا عند الساعة] LT',
        nextWeek: 'dddd [عند الساعة] LT',
        lastDay: '[أمس عند الساعة] LT',
        lastWeek: 'dddd [عند الساعة] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'بعد %s',
        past : 'منذ %s',
        s : pluralize$1('s'),
        m : pluralize$1('m'),
        mm : pluralize$1('m'),
        h : pluralize$1('h'),
        hh : pluralize$1('h'),
        d : pluralize$1('d'),
        dd : pluralize$1('d'),
        M : pluralize$1('M'),
        MM : pluralize$1('M'),
        y : pluralize$1('y'),
        yy : pluralize$1('y')
    },
    preparse: function (string) {
        return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
            return numberMap$1[match];
        }).replace(/،/g, ',');
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap$2[match];
        }).replace(/,/g, '،');
    },
    week : {
        dow : 6, // Saturday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Azerbaijani [az]
//! author : topchiyev : https://github.com/topchiyev

var suffixes = {
    1: '-inci',
    5: '-inci',
    8: '-inci',
    70: '-inci',
    80: '-inci',
    2: '-nci',
    7: '-nci',
    20: '-nci',
    50: '-nci',
    3: '-üncü',
    4: '-üncü',
    100: '-üncü',
    6: '-ncı',
    9: '-uncu',
    10: '-uncu',
    30: '-uncu',
    60: '-ıncı',
    90: '-ıncı'
};

hooks.defineLocale('az', {
    months : 'yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr'.split('_'),
    monthsShort : 'yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek'.split('_'),
    weekdays : 'Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə'.split('_'),
    weekdaysShort : 'Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən'.split('_'),
    weekdaysMin : 'Bz_BE_ÇA_Çə_CA_Cü_Şə'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[bugün saat] LT',
        nextDay : '[sabah saat] LT',
        nextWeek : '[gələn həftə] dddd [saat] LT',
        lastDay : '[dünən] LT',
        lastWeek : '[keçən həftə] dddd [saat] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s sonra',
        past : '%s əvvəl',
        s : 'birneçə saniyyə',
        m : 'bir dəqiqə',
        mm : '%d dəqiqə',
        h : 'bir saat',
        hh : '%d saat',
        d : 'bir gün',
        dd : '%d gün',
        M : 'bir ay',
        MM : '%d ay',
        y : 'bir il',
        yy : '%d il'
    },
    meridiemParse: /gecə|səhər|gündüz|axşam/,
    isPM : function (input) {
        return /^(gündüz|axşam)$/.test(input);
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'gecə';
        } else if (hour < 12) {
            return 'səhər';
        } else if (hour < 17) {
            return 'gündüz';
        } else {
            return 'axşam';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,
    ordinal : function (number) {
        if (number === 0) {  // special case for zero
            return number + '-ıncı';
        }
        var a = number % 10,
            b = number % 100 - a,
            c = number >= 100 ? 100 : null;
        return number + (suffixes[a] || suffixes[b] || suffixes[c]);
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Belarusian [be]
//! author : Dmitry Demidov : https://github.com/demidov91
//! author: Praleska: http://praleska.pro/
//! Author : Menelion Elensúle : https://github.com/Oire

function plural(word, num) {
    var forms = word.split('_');
    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
}
function relativeTimeWithPlural(number, withoutSuffix, key) {
    var format = {
        'mm': withoutSuffix ? 'хвіліна_хвіліны_хвілін' : 'хвіліну_хвіліны_хвілін',
        'hh': withoutSuffix ? 'гадзіна_гадзіны_гадзін' : 'гадзіну_гадзіны_гадзін',
        'dd': 'дзень_дні_дзён',
        'MM': 'месяц_месяцы_месяцаў',
        'yy': 'год_гады_гадоў'
    };
    if (key === 'm') {
        return withoutSuffix ? 'хвіліна' : 'хвіліну';
    }
    else if (key === 'h') {
        return withoutSuffix ? 'гадзіна' : 'гадзіну';
    }
    else {
        return number + ' ' + plural(format[key], +number);
    }
}

hooks.defineLocale('be', {
    months : {
        format: 'студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня'.split('_'),
        standalone: 'студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань'.split('_')
    },
    monthsShort : 'студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж'.split('_'),
    weekdays : {
        format: 'нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу'.split('_'),
        standalone: 'нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота'.split('_'),
        isFormat: /\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/
    },
    weekdaysShort : 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
    weekdaysMin : 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY г.',
        LLL : 'D MMMM YYYY г., HH:mm',
        LLLL : 'dddd, D MMMM YYYY г., HH:mm'
    },
    calendar : {
        sameDay: '[Сёння ў] LT',
        nextDay: '[Заўтра ў] LT',
        lastDay: '[Учора ў] LT',
        nextWeek: function () {
            return '[У] dddd [ў] LT';
        },
        lastWeek: function () {
            switch (this.day()) {
                case 0:
                case 3:
                case 5:
                case 6:
                    return '[У мінулую] dddd [ў] LT';
                case 1:
                case 2:
                case 4:
                    return '[У мінулы] dddd [ў] LT';
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'праз %s',
        past : '%s таму',
        s : 'некалькі секунд',
        m : relativeTimeWithPlural,
        mm : relativeTimeWithPlural,
        h : relativeTimeWithPlural,
        hh : relativeTimeWithPlural,
        d : 'дзень',
        dd : relativeTimeWithPlural,
        M : 'месяц',
        MM : relativeTimeWithPlural,
        y : 'год',
        yy : relativeTimeWithPlural
    },
    meridiemParse: /ночы|раніцы|дня|вечара/,
    isPM : function (input) {
        return /^(дня|вечара)$/.test(input);
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'ночы';
        } else if (hour < 12) {
            return 'раніцы';
        } else if (hour < 17) {
            return 'дня';
        } else {
            return 'вечара';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(і|ы|га)/,
    ordinal: function (number, period) {
        switch (period) {
            case 'M':
            case 'd':
            case 'DDD':
            case 'w':
            case 'W':
                return (number % 10 === 2 || number % 10 === 3) && (number % 100 !== 12 && number % 100 !== 13) ? number + '-і' : number + '-ы';
            case 'D':
                return number + '-га';
            default:
                return number;
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Bulgarian [bg]
//! author : Krasen Borisov : https://github.com/kraz

hooks.defineLocale('bg', {
    months : 'януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември'.split('_'),
    monthsShort : 'янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек'.split('_'),
    weekdays : 'неделя_понеделник_вторник_сряда_четвъртък_петък_събота'.split('_'),
    weekdaysShort : 'нед_пон_вто_сря_чет_пет_съб'.split('_'),
    weekdaysMin : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'D.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY H:mm',
        LLLL : 'dddd, D MMMM YYYY H:mm'
    },
    calendar : {
        sameDay : '[Днес в] LT',
        nextDay : '[Утре в] LT',
        nextWeek : 'dddd [в] LT',
        lastDay : '[Вчера в] LT',
        lastWeek : function () {
            switch (this.day()) {
                case 0:
                case 3:
                case 6:
                    return '[В изминалата] dddd [в] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[В изминалия] dddd [в] LT';
            }
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'след %s',
        past : 'преди %s',
        s : 'няколко секунди',
        m : 'минута',
        mm : '%d минути',
        h : 'час',
        hh : '%d часа',
        d : 'ден',
        dd : '%d дни',
        M : 'месец',
        MM : '%d месеца',
        y : 'година',
        yy : '%d години'
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
    ordinal : function (number) {
        var lastDigit = number % 10,
            last2Digits = number % 100;
        if (number === 0) {
            return number + '-ев';
        } else if (last2Digits === 0) {
            return number + '-ен';
        } else if (last2Digits > 10 && last2Digits < 20) {
            return number + '-ти';
        } else if (lastDigit === 1) {
            return number + '-ви';
        } else if (lastDigit === 2) {
            return number + '-ри';
        } else if (lastDigit === 7 || lastDigit === 8) {
            return number + '-ми';
        } else {
            return number + '-ти';
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Bambara [bm]
//! author : Estelle Comment : https://github.com/estellecomment
// Language contact person : Abdoufata Kane : https://github.com/abdoufata

hooks.defineLocale('bm', {
    months : 'Zanwuyekalo_Fewuruyekalo_Marisikalo_Awirilikalo_Mɛkalo_Zuwɛnkalo_Zuluyekalo_Utikalo_Sɛtanburukalo_ɔkutɔburukalo_Nowanburukalo_Desanburukalo'.split('_'),
    monthsShort : 'Zan_Few_Mar_Awi_Mɛ_Zuw_Zul_Uti_Sɛt_ɔku_Now_Des'.split('_'),
    weekdays : 'Kari_Ntɛnɛn_Tarata_Araba_Alamisa_Juma_Sibiri'.split('_'),
    weekdaysShort : 'Kar_Ntɛ_Tar_Ara_Ala_Jum_Sib'.split('_'),
    weekdaysMin : 'Ka_Nt_Ta_Ar_Al_Ju_Si'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'MMMM [tile] D [san] YYYY',
        LLL : 'MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm',
        LLLL : 'dddd MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm'
    },
    calendar : {
        sameDay : '[Bi lɛrɛ] LT',
        nextDay : '[Sini lɛrɛ] LT',
        nextWeek : 'dddd [don lɛrɛ] LT',
        lastDay : '[Kunu lɛrɛ] LT',
        lastWeek : 'dddd [tɛmɛnen lɛrɛ] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s kɔnɔ',
        past : 'a bɛ %s bɔ',
        s : 'sanga dama dama',
        m : 'miniti kelen',
        mm : 'miniti %d',
        h : 'lɛrɛ kelen',
        hh : 'lɛrɛ %d',
        d : 'tile kelen',
        dd : 'tile %d',
        M : 'kalo kelen',
        MM : 'kalo %d',
        y : 'san kelen',
        yy : 'san %d'
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Bengali [bn]
//! author : Kaushik Gandhi : https://github.com/kaushikgandhi

var symbolMap$3 = {
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
    '0': '০'
};
var numberMap$2 = {
    '১': '1',
    '২': '2',
    '৩': '3',
    '৪': '4',
    '৫': '5',
    '৬': '6',
    '৭': '7',
    '৮': '8',
    '৯': '9',
    '০': '0'
};

hooks.defineLocale('bn', {
    months : 'জানুয়ারী_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর'.split('_'),
    monthsShort : 'জানু_ফেব_মার্চ_এপ্র_মে_জুন_জুল_আগ_সেপ্ট_অক্টো_নভে_ডিসে'.split('_'),
    weekdays : 'রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার'.split('_'),
    weekdaysShort : 'রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি'.split('_'),
    weekdaysMin : 'রবি_সোম_মঙ্গ_বুধ_বৃহঃ_শুক্র_শনি'.split('_'),
    longDateFormat : {
        LT : 'A h:mm সময়',
        LTS : 'A h:mm:ss সময়',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, A h:mm সময়',
        LLLL : 'dddd, D MMMM YYYY, A h:mm সময়'
    },
    calendar : {
        sameDay : '[আজ] LT',
        nextDay : '[আগামীকাল] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[গতকাল] LT',
        lastWeek : '[গত] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s পরে',
        past : '%s আগে',
        s : 'কয়েক সেকেন্ড',
        m : 'এক মিনিট',
        mm : '%d মিনিট',
        h : 'এক ঘন্টা',
        hh : '%d ঘন্টা',
        d : 'এক দিন',
        dd : '%d দিন',
        M : 'এক মাস',
        MM : '%d মাস',
        y : 'এক বছর',
        yy : '%d বছর'
    },
    preparse: function (string) {
        return string.replace(/[১২৩৪৫৬৭৮৯০]/g, function (match) {
            return numberMap$2[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap$3[match];
        });
    },
    meridiemParse: /রাত|সকাল|দুপুর|বিকাল|রাত/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if ((meridiem === 'রাত' && hour >= 4) ||
                (meridiem === 'দুপুর' && hour < 5) ||
                meridiem === 'বিকাল') {
            return hour + 12;
        } else {
            return hour;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'রাত';
        } else if (hour < 10) {
            return 'সকাল';
        } else if (hour < 17) {
            return 'দুপুর';
        } else if (hour < 20) {
            return 'বিকাল';
        } else {
            return 'রাত';
        }
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Tibetan [bo]
//! author : Thupten N. Chakrishar : https://github.com/vajradog

var symbolMap$4 = {
    '1': '༡',
    '2': '༢',
    '3': '༣',
    '4': '༤',
    '5': '༥',
    '6': '༦',
    '7': '༧',
    '8': '༨',
    '9': '༩',
    '0': '༠'
};
var numberMap$3 = {
    '༡': '1',
    '༢': '2',
    '༣': '3',
    '༤': '4',
    '༥': '5',
    '༦': '6',
    '༧': '7',
    '༨': '8',
    '༩': '9',
    '༠': '0'
};

hooks.defineLocale('bo', {
    months : 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
    monthsShort : 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
    weekdays : 'གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་'.split('_'),
    weekdaysShort : 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
    weekdaysMin : 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
    longDateFormat : {
        LT : 'A h:mm',
        LTS : 'A h:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, A h:mm',
        LLLL : 'dddd, D MMMM YYYY, A h:mm'
    },
    calendar : {
        sameDay : '[དི་རིང] LT',
        nextDay : '[སང་ཉིན] LT',
        nextWeek : '[བདུན་ཕྲག་རྗེས་མ], LT',
        lastDay : '[ཁ་སང] LT',
        lastWeek : '[བདུན་ཕྲག་མཐའ་མ] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s ལ་',
        past : '%s སྔན་ལ',
        s : 'ལམ་སང',
        m : 'སྐར་མ་གཅིག',
        mm : '%d སྐར་མ',
        h : 'ཆུ་ཚོད་གཅིག',
        hh : '%d ཆུ་ཚོད',
        d : 'ཉིན་གཅིག',
        dd : '%d ཉིན་',
        M : 'ཟླ་བ་གཅིག',
        MM : '%d ཟླ་བ',
        y : 'ལོ་གཅིག',
        yy : '%d ལོ'
    },
    preparse: function (string) {
        return string.replace(/[༡༢༣༤༥༦༧༨༩༠]/g, function (match) {
            return numberMap$3[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap$4[match];
        });
    },
    meridiemParse: /མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if ((meridiem === 'མཚན་མོ' && hour >= 4) ||
                (meridiem === 'ཉིན་གུང' && hour < 5) ||
                meridiem === 'དགོང་དག') {
            return hour + 12;
        } else {
            return hour;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'མཚན་མོ';
        } else if (hour < 10) {
            return 'ཞོགས་ཀས';
        } else if (hour < 17) {
            return 'ཉིན་གུང';
        } else if (hour < 20) {
            return 'དགོང་དག';
        } else {
            return 'མཚན་མོ';
        }
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Breton [br]
//! author : Jean-Baptiste Le Duigou : https://github.com/jbleduigou

function relativeTimeWithMutation(number, withoutSuffix, key) {
    var format = {
        'mm': 'munutenn',
        'MM': 'miz',
        'dd': 'devezh'
    };
    return number + ' ' + mutation(format[key], number);
}
function specialMutationForYears(number) {
    switch (lastNumber(number)) {
        case 1:
        case 3:
        case 4:
        case 5:
        case 9:
            return number + ' bloaz';
        default:
            return number + ' vloaz';
    }
}
function lastNumber(number) {
    if (number > 9) {
        return lastNumber(number % 10);
    }
    return number;
}
function mutation(text, number) {
    if (number === 2) {
        return softMutation(text);
    }
    return text;
}
function softMutation(text) {
    var mutationTable = {
        'm': 'v',
        'b': 'v',
        'd': 'z'
    };
    if (mutationTable[text.charAt(0)] === undefined) {
        return text;
    }
    return mutationTable[text.charAt(0)] + text.substring(1);
}

hooks.defineLocale('br', {
    months : 'Genver_C\'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu'.split('_'),
    monthsShort : 'Gen_C\'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker'.split('_'),
    weekdays : 'Sul_Lun_Meurzh_Merc\'her_Yaou_Gwener_Sadorn'.split('_'),
    weekdaysShort : 'Sul_Lun_Meu_Mer_Yao_Gwe_Sad'.split('_'),
    weekdaysMin : 'Su_Lu_Me_Mer_Ya_Gw_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'h[e]mm A',
        LTS : 'h[e]mm:ss A',
        L : 'DD/MM/YYYY',
        LL : 'D [a viz] MMMM YYYY',
        LLL : 'D [a viz] MMMM YYYY h[e]mm A',
        LLLL : 'dddd, D [a viz] MMMM YYYY h[e]mm A'
    },
    calendar : {
        sameDay : '[Hiziv da] LT',
        nextDay : '[Warc\'hoazh da] LT',
        nextWeek : 'dddd [da] LT',
        lastDay : '[Dec\'h da] LT',
        lastWeek : 'dddd [paset da] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'a-benn %s',
        past : '%s \'zo',
        s : 'un nebeud segondennoù',
        m : 'ur vunutenn',
        mm : relativeTimeWithMutation,
        h : 'un eur',
        hh : '%d eur',
        d : 'un devezh',
        dd : relativeTimeWithMutation,
        M : 'ur miz',
        MM : relativeTimeWithMutation,
        y : 'ur bloaz',
        yy : specialMutationForYears
    },
    dayOfMonthOrdinalParse: /\d{1,2}(añ|vet)/,
    ordinal : function (number) {
        var output = (number === 1) ? 'añ' : 'vet';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Bosnian [bs]
//! author : Nedim Cholich : https://github.com/frontyard
//! based on (hr) translation by Bojan Marković

function translate(number, withoutSuffix, key) {
    var result = number + ' ';
    switch (key) {
        case 'm':
            return withoutSuffix ? 'jedna minuta' : 'jedne minute';
        case 'mm':
            if (number === 1) {
                result += 'minuta';
            } else if (number === 2 || number === 3 || number === 4) {
                result += 'minute';
            } else {
                result += 'minuta';
            }
            return result;
        case 'h':
            return withoutSuffix ? 'jedan sat' : 'jednog sata';
        case 'hh':
            if (number === 1) {
                result += 'sat';
            } else if (number === 2 || number === 3 || number === 4) {
                result += 'sata';
            } else {
                result += 'sati';
            }
            return result;
        case 'dd':
            if (number === 1) {
                result += 'dan';
            } else {
                result += 'dana';
            }
            return result;
        case 'MM':
            if (number === 1) {
                result += 'mjesec';
            } else if (number === 2 || number === 3 || number === 4) {
                result += 'mjeseca';
            } else {
                result += 'mjeseci';
            }
            return result;
        case 'yy':
            if (number === 1) {
                result += 'godina';
            } else if (number === 2 || number === 3 || number === 4) {
                result += 'godine';
            } else {
                result += 'godina';
            }
            return result;
    }
}

hooks.defineLocale('bs', {
    months : 'januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar'.split('_'),
    monthsShort : 'jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.'.split('_'),
    monthsParseExact: true,
    weekdays : 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
    weekdaysShort : 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
    weekdaysMin : 'ne_po_ut_sr_če_pe_su'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY H:mm',
        LLLL : 'dddd, D. MMMM YYYY H:mm'
    },
    calendar : {
        sameDay  : '[danas u] LT',
        nextDay  : '[sutra u] LT',
        nextWeek : function () {
            switch (this.day()) {
                case 0:
                    return '[u] [nedjelju] [u] LT';
                case 3:
                    return '[u] [srijedu] [u] LT';
                case 6:
                    return '[u] [subotu] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[u] dddd [u] LT';
            }
        },
        lastDay  : '[jučer u] LT',
        lastWeek : function () {
            switch (this.day()) {
                case 0:
                case 3:
                    return '[prošlu] dddd [u] LT';
                case 6:
                    return '[prošle] [subote] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[prošli] dddd [u] LT';
            }
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'za %s',
        past   : 'prije %s',
        s      : 'par sekundi',
        m      : translate,
        mm     : translate,
        h      : translate,
        hh     : translate,
        d      : 'dan',
        dd     : translate,
        M      : 'mjesec',
        MM     : translate,
        y      : 'godinu',
        yy     : translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Catalan [ca]
//! author : Juan G. Hurtado : https://github.com/juanghurtado

hooks.defineLocale('ca', {
    months : {
        standalone: 'gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre'.split('_'),
        format: 'de gener_de febrer_de març_d\'abril_de maig_de juny_de juliol_d\'agost_de setembre_d\'octubre_de novembre_de desembre'.split('_'),
        isFormat: /D[oD]?(\s)+MMMM/
    },
    monthsShort : 'gen._febr._març_abr._maig_juny_jul._ag._set._oct._nov._des.'.split('_'),
    monthsParseExact : true,
    weekdays : 'diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte'.split('_'),
    weekdaysShort : 'dg._dl._dt._dc._dj._dv._ds.'.split('_'),
    weekdaysMin : 'dg_dl_dt_dc_dj_dv_ds'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM [de] YYYY',
        ll : 'D MMM YYYY',
        LLL : 'D MMMM [de] YYYY [a les] H:mm',
        lll : 'D MMM YYYY, H:mm',
        LLLL : 'dddd D MMMM [de] YYYY [a les] H:mm',
        llll : 'ddd D MMM YYYY, H:mm'
    },
    calendar : {
        sameDay : function () {
            return '[avui a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
        },
        nextDay : function () {
            return '[demà a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
        },
        nextWeek : function () {
            return 'dddd [a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
        },
        lastDay : function () {
            return '[ahir a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
        },
        lastWeek : function () {
            return '[el] dddd [passat a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'd\'aquí %s',
        past : 'fa %s',
        s : 'uns segons',
        m : 'un minut',
        mm : '%d minuts',
        h : 'una hora',
        hh : '%d hores',
        d : 'un dia',
        dd : '%d dies',
        M : 'un mes',
        MM : '%d mesos',
        y : 'un any',
        yy : '%d anys'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(r|n|t|è|a)/,
    ordinal : function (number, period) {
        var output = (number === 1) ? 'r' :
            (number === 2) ? 'n' :
            (number === 3) ? 'r' :
            (number === 4) ? 't' : 'è';
        if (period === 'w' || period === 'W') {
            output = 'a';
        }
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Czech [cs]
//! author : petrbela : https://github.com/petrbela

var months$3 = 'leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec'.split('_');
var monthsShort = 'led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro'.split('_');
function plural$1(n) {
    return (n > 1) && (n < 5) && (~~(n / 10) !== 1);
}
function translate$1(number, withoutSuffix, key, isFuture) {
    var result = number + ' ';
    switch (key) {
        case 's':  // a few seconds / in a few seconds / a few seconds ago
            return (withoutSuffix || isFuture) ? 'pár sekund' : 'pár sekundami';
        case 'm':  // a minute / in a minute / a minute ago
            return withoutSuffix ? 'minuta' : (isFuture ? 'minutu' : 'minutou');
        case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
            if (withoutSuffix || isFuture) {
                return result + (plural$1(number) ? 'minuty' : 'minut');
            } else {
                return result + 'minutami';
            }
            break;
        case 'h':  // an hour / in an hour / an hour ago
            return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
        case 'hh': // 9 hours / in 9 hours / 9 hours ago
            if (withoutSuffix || isFuture) {
                return result + (plural$1(number) ? 'hodiny' : 'hodin');
            } else {
                return result + 'hodinami';
            }
            break;
        case 'd':  // a day / in a day / a day ago
            return (withoutSuffix || isFuture) ? 'den' : 'dnem';
        case 'dd': // 9 days / in 9 days / 9 days ago
            if (withoutSuffix || isFuture) {
                return result + (plural$1(number) ? 'dny' : 'dní');
            } else {
                return result + 'dny';
            }
            break;
        case 'M':  // a month / in a month / a month ago
            return (withoutSuffix || isFuture) ? 'měsíc' : 'měsícem';
        case 'MM': // 9 months / in 9 months / 9 months ago
            if (withoutSuffix || isFuture) {
                return result + (plural$1(number) ? 'měsíce' : 'měsíců');
            } else {
                return result + 'měsíci';
            }
            break;
        case 'y':  // a year / in a year / a year ago
            return (withoutSuffix || isFuture) ? 'rok' : 'rokem';
        case 'yy': // 9 years / in 9 years / 9 years ago
            if (withoutSuffix || isFuture) {
                return result + (plural$1(number) ? 'roky' : 'let');
            } else {
                return result + 'lety';
            }
            break;
    }
}

hooks.defineLocale('cs', {
    months : months$3,
    monthsShort : monthsShort,
    monthsParse : (function (months, monthsShort) {
        var i, _monthsParse = [];
        for (i = 0; i < 12; i++) {
            // use custom parser to solve problem with July (červenec)
            _monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
        }
        return _monthsParse;
    }(months$3, monthsShort)),
    shortMonthsParse : (function (monthsShort) {
        var i, _shortMonthsParse = [];
        for (i = 0; i < 12; i++) {
            _shortMonthsParse[i] = new RegExp('^' + monthsShort[i] + '$', 'i');
        }
        return _shortMonthsParse;
    }(monthsShort)),
    longMonthsParse : (function (months) {
        var i, _longMonthsParse = [];
        for (i = 0; i < 12; i++) {
            _longMonthsParse[i] = new RegExp('^' + months[i] + '$', 'i');
        }
        return _longMonthsParse;
    }(months$3)),
    weekdays : 'neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota'.split('_'),
    weekdaysShort : 'ne_po_út_st_čt_pá_so'.split('_'),
    weekdaysMin : 'ne_po_út_st_čt_pá_so'.split('_'),
    longDateFormat : {
        LT: 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY H:mm',
        LLLL : 'dddd D. MMMM YYYY H:mm',
        l : 'D. M. YYYY'
    },
    calendar : {
        sameDay: '[dnes v] LT',
        nextDay: '[zítra v] LT',
        nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[v neděli v] LT';
                case 1:
                case 2:
                    return '[v] dddd [v] LT';
                case 3:
                    return '[ve středu v] LT';
                case 4:
                    return '[ve čtvrtek v] LT';
                case 5:
                    return '[v pátek v] LT';
                case 6:
                    return '[v sobotu v] LT';
            }
        },
        lastDay: '[včera v] LT',
        lastWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[minulou neděli v] LT';
                case 1:
                case 2:
                    return '[minulé] dddd [v] LT';
                case 3:
                    return '[minulou středu v] LT';
                case 4:
                case 5:
                    return '[minulý] dddd [v] LT';
                case 6:
                    return '[minulou sobotu v] LT';
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'za %s',
        past : 'před %s',
        s : translate$1,
        m : translate$1,
        mm : translate$1,
        h : translate$1,
        hh : translate$1,
        d : translate$1,
        dd : translate$1,
        M : translate$1,
        MM : translate$1,
        y : translate$1,
        yy : translate$1
    },
    dayOfMonthOrdinalParse : /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Chuvash [cv]
//! author : Anatoly Mironov : https://github.com/mirontoli

hooks.defineLocale('cv', {
    months : 'кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав'.split('_'),
    monthsShort : 'кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш'.split('_'),
    weekdays : 'вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун'.split('_'),
    weekdaysShort : 'выр_тун_ытл_юн_кӗҫ_эрн_шӑм'.split('_'),
    weekdaysMin : 'вр_тн_ыт_юн_кҫ_эр_шм'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD-MM-YYYY',
        LL : 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]',
        LLL : 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm',
        LLLL : 'dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm'
    },
    calendar : {
        sameDay: '[Паян] LT [сехетре]',
        nextDay: '[Ыран] LT [сехетре]',
        lastDay: '[Ӗнер] LT [сехетре]',
        nextWeek: '[Ҫитес] dddd LT [сехетре]',
        lastWeek: '[Иртнӗ] dddd LT [сехетре]',
        sameElse: 'L'
    },
    relativeTime : {
        future : function (output) {
            var affix = /сехет$/i.exec(output) ? 'рен' : /ҫул$/i.exec(output) ? 'тан' : 'ран';
            return output + affix;
        },
        past : '%s каялла',
        s : 'пӗр-ик ҫеккунт',
        m : 'пӗр минут',
        mm : '%d минут',
        h : 'пӗр сехет',
        hh : '%d сехет',
        d : 'пӗр кун',
        dd : '%d кун',
        M : 'пӗр уйӑх',
        MM : '%d уйӑх',
        y : 'пӗр ҫул',
        yy : '%d ҫул'
    },
    dayOfMonthOrdinalParse: /\d{1,2}-мӗш/,
    ordinal : '%d-мӗш',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Welsh [cy]
//! author : Robert Allen : https://github.com/robgallen
//! author : https://github.com/ryangreaves

hooks.defineLocale('cy', {
    months: 'Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr'.split('_'),
    monthsShort: 'Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag'.split('_'),
    weekdays: 'Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn'.split('_'),
    weekdaysShort: 'Sul_Llun_Maw_Mer_Iau_Gwe_Sad'.split('_'),
    weekdaysMin: 'Su_Ll_Ma_Me_Ia_Gw_Sa'.split('_'),
    weekdaysParseExact : true,
    // time formats are the same as en-gb
    longDateFormat: {
        LT: 'HH:mm',
        LTS : 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd, D MMMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[Heddiw am] LT',
        nextDay: '[Yfory am] LT',
        nextWeek: 'dddd [am] LT',
        lastDay: '[Ddoe am] LT',
        lastWeek: 'dddd [diwethaf am] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'mewn %s',
        past: '%s yn ôl',
        s: 'ychydig eiliadau',
        m: 'munud',
        mm: '%d munud',
        h: 'awr',
        hh: '%d awr',
        d: 'diwrnod',
        dd: '%d diwrnod',
        M: 'mis',
        MM: '%d mis',
        y: 'blwyddyn',
        yy: '%d flynedd'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
    // traditional ordinal numbers above 31 are not commonly used in colloquial Welsh
    ordinal: function (number) {
        var b = number,
            output = '',
            lookup = [
                '', 'af', 'il', 'ydd', 'ydd', 'ed', 'ed', 'ed', 'fed', 'fed', 'fed', // 1af to 10fed
                'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'fed' // 11eg to 20fed
            ];
        if (b > 20) {
            if (b === 40 || b === 50 || b === 60 || b === 80 || b === 100) {
                output = 'fed'; // not 30ain, 70ain or 90ain
            } else {
                output = 'ain';
            }
        } else if (b > 0) {
            output = lookup[b];
        }
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Danish [da]
//! author : Ulrik Nielsen : https://github.com/mrbase

hooks.defineLocale('da', {
    months : 'januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december'.split('_'),
    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
    weekdays : 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
    weekdaysShort : 'søn_man_tir_ons_tor_fre_lør'.split('_'),
    weekdaysMin : 'sø_ma_ti_on_to_fr_lø'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY HH:mm',
        LLLL : 'dddd [d.] D. MMMM YYYY [kl.] HH:mm'
    },
    calendar : {
        sameDay : '[i dag kl.] LT',
        nextDay : '[i morgen kl.] LT',
        nextWeek : 'på dddd [kl.] LT',
        lastDay : '[i går kl.] LT',
        lastWeek : '[i] dddd[s kl.] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'om %s',
        past : '%s siden',
        s : 'få sekunder',
        m : 'et minut',
        mm : '%d minutter',
        h : 'en time',
        hh : '%d timer',
        d : 'en dag',
        dd : '%d dage',
        M : 'en måned',
        MM : '%d måneder',
        y : 'et år',
        yy : '%d år'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : German (Austria) [de-at]
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
//! author : Martin Groller : https://github.com/MadMG
//! author : Mikolaj Dadela : https://github.com/mik01aj

function processRelativeTime(number, withoutSuffix, key, isFuture) {
    var format = {
        'm': ['eine Minute', 'einer Minute'],
        'h': ['eine Stunde', 'einer Stunde'],
        'd': ['ein Tag', 'einem Tag'],
        'dd': [number + ' Tage', number + ' Tagen'],
        'M': ['ein Monat', 'einem Monat'],
        'MM': [number + ' Monate', number + ' Monaten'],
        'y': ['ein Jahr', 'einem Jahr'],
        'yy': [number + ' Jahre', number + ' Jahren']
    };
    return withoutSuffix ? format[key][0] : format[key][1];
}

hooks.defineLocale('de-at', {
    months : 'Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
    monthsShort : 'Jän._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
    monthsParseExact : true,
    weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
    weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
    weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY HH:mm',
        LLLL : 'dddd, D. MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[heute um] LT [Uhr]',
        sameElse: 'L',
        nextDay: '[morgen um] LT [Uhr]',
        nextWeek: 'dddd [um] LT [Uhr]',
        lastDay: '[gestern um] LT [Uhr]',
        lastWeek: '[letzten] dddd [um] LT [Uhr]'
    },
    relativeTime : {
        future : 'in %s',
        past : 'vor %s',
        s : 'ein paar Sekunden',
        m : processRelativeTime,
        mm : '%d Minuten',
        h : processRelativeTime,
        hh : '%d Stunden',
        d : processRelativeTime,
        dd : processRelativeTime,
        M : processRelativeTime,
        MM : processRelativeTime,
        y : processRelativeTime,
        yy : processRelativeTime
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : German (Switzerland) [de-ch]
//! author : sschueller : https://github.com/sschueller

// based on: https://www.bk.admin.ch/dokumentation/sprachen/04915/05016/index.html?lang=de#

function processRelativeTime$1(number, withoutSuffix, key, isFuture) {
    var format = {
        'm': ['eine Minute', 'einer Minute'],
        'h': ['eine Stunde', 'einer Stunde'],
        'd': ['ein Tag', 'einem Tag'],
        'dd': [number + ' Tage', number + ' Tagen'],
        'M': ['ein Monat', 'einem Monat'],
        'MM': [number + ' Monate', number + ' Monaten'],
        'y': ['ein Jahr', 'einem Jahr'],
        'yy': [number + ' Jahre', number + ' Jahren']
    };
    return withoutSuffix ? format[key][0] : format[key][1];
}

hooks.defineLocale('de-ch', {
    months : 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
    monthsShort : 'Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
    monthsParseExact : true,
    weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
    weekdaysShort : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT: 'HH.mm',
        LTS: 'HH.mm.ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY HH.mm',
        LLLL : 'dddd, D. MMMM YYYY HH.mm'
    },
    calendar : {
        sameDay: '[heute um] LT [Uhr]',
        sameElse: 'L',
        nextDay: '[morgen um] LT [Uhr]',
        nextWeek: 'dddd [um] LT [Uhr]',
        lastDay: '[gestern um] LT [Uhr]',
        lastWeek: '[letzten] dddd [um] LT [Uhr]'
    },
    relativeTime : {
        future : 'in %s',
        past : 'vor %s',
        s : 'ein paar Sekunden',
        m : processRelativeTime$1,
        mm : '%d Minuten',
        h : processRelativeTime$1,
        hh : '%d Stunden',
        d : processRelativeTime$1,
        dd : processRelativeTime$1,
        M : processRelativeTime$1,
        MM : processRelativeTime$1,
        y : processRelativeTime$1,
        yy : processRelativeTime$1
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : German [de]
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
//! author : Mikolaj Dadela : https://github.com/mik01aj

function processRelativeTime$2(number, withoutSuffix, key, isFuture) {
    var format = {
        'm': ['eine Minute', 'einer Minute'],
        'h': ['eine Stunde', 'einer Stunde'],
        'd': ['ein Tag', 'einem Tag'],
        'dd': [number + ' Tage', number + ' Tagen'],
        'M': ['ein Monat', 'einem Monat'],
        'MM': [number + ' Monate', number + ' Monaten'],
        'y': ['ein Jahr', 'einem Jahr'],
        'yy': [number + ' Jahre', number + ' Jahren']
    };
    return withoutSuffix ? format[key][0] : format[key][1];
}

hooks.defineLocale('de', {
    months : 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
    monthsShort : 'Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
    monthsParseExact : true,
    weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
    weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
    weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY HH:mm',
        LLLL : 'dddd, D. MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[heute um] LT [Uhr]',
        sameElse: 'L',
        nextDay: '[morgen um] LT [Uhr]',
        nextWeek: 'dddd [um] LT [Uhr]',
        lastDay: '[gestern um] LT [Uhr]',
        lastWeek: '[letzten] dddd [um] LT [Uhr]'
    },
    relativeTime : {
        future : 'in %s',
        past : 'vor %s',
        s : 'ein paar Sekunden',
        m : processRelativeTime$2,
        mm : '%d Minuten',
        h : processRelativeTime$2,
        hh : '%d Stunden',
        d : processRelativeTime$2,
        dd : processRelativeTime$2,
        M : processRelativeTime$2,
        MM : processRelativeTime$2,
        y : processRelativeTime$2,
        yy : processRelativeTime$2
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Maldivian [dv]
//! author : Jawish Hameed : https://github.com/jawish

var months$4 = [
    'ޖެނުއަރީ',
    'ފެބްރުއަރީ',
    'މާރިޗު',
    'އޭޕްރީލު',
    'މޭ',
    'ޖޫން',
    'ޖުލައި',
    'އޯގަސްޓު',
    'ސެޕްޓެމްބަރު',
    'އޮކްޓޯބަރު',
    'ނޮވެމްބަރު',
    'ޑިސެމްބަރު'
];
var weekdays = [
    'އާދިއްތަ',
    'ހޯމަ',
    'އަންގާރަ',
    'ބުދަ',
    'ބުރާސްފަތި',
    'ހުކުރު',
    'ހޮނިހިރު'
];

hooks.defineLocale('dv', {
    months : months$4,
    monthsShort : months$4,
    weekdays : weekdays,
    weekdaysShort : weekdays,
    weekdaysMin : 'އާދި_ހޯމަ_އަން_ބުދަ_ބުރާ_ހުކު_ހޮނި'.split('_'),
    longDateFormat : {

        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'D/M/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    meridiemParse: /މކ|މފ/,
    isPM : function (input) {
        return 'މފ' === input;
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'މކ';
        } else {
            return 'މފ';
        }
    },
    calendar : {
        sameDay : '[މިއަދު] LT',
        nextDay : '[މާދަމާ] LT',
        nextWeek : 'dddd LT',
        lastDay : '[އިއްޔެ] LT',
        lastWeek : '[ފާއިތުވި] dddd LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'ތެރޭގައި %s',
        past : 'ކުރިން %s',
        s : 'ސިކުންތުކޮޅެއް',
        m : 'މިނިޓެއް',
        mm : 'މިނިޓު %d',
        h : 'ގަޑިއިރެއް',
        hh : 'ގަޑިއިރު %d',
        d : 'ދުވަހެއް',
        dd : 'ދުވަސް %d',
        M : 'މަހެއް',
        MM : 'މަސް %d',
        y : 'އަހަރެއް',
        yy : 'އަހަރު %d'
    },
    preparse: function (string) {
        return string.replace(/،/g, ',');
    },
    postformat: function (string) {
        return string.replace(/,/g, '،');
    },
    week : {
        dow : 7,  // Sunday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Greek [el]
//! author : Aggelos Karalias : https://github.com/mehiel

hooks.defineLocale('el', {
    monthsNominativeEl : 'Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος'.split('_'),
    monthsGenitiveEl : 'Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου'.split('_'),
    months : function (momentToFormat, format) {
        if (!momentToFormat) {
            return this._monthsNominativeEl;
        } else if (typeof format === 'string' && /D/.test(format.substring(0, format.indexOf('MMMM')))) { // if there is a day number before 'MMMM'
            return this._monthsGenitiveEl[momentToFormat.month()];
        } else {
            return this._monthsNominativeEl[momentToFormat.month()];
        }
    },
    monthsShort : 'Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ'.split('_'),
    weekdays : 'Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο'.split('_'),
    weekdaysShort : 'Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ'.split('_'),
    weekdaysMin : 'Κυ_Δε_Τρ_Τε_Πε_Πα_Σα'.split('_'),
    meridiem : function (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'μμ' : 'ΜΜ';
        } else {
            return isLower ? 'πμ' : 'ΠΜ';
        }
    },
    isPM : function (input) {
        return ((input + '').toLowerCase()[0] === 'μ');
    },
    meridiemParse : /[ΠΜ]\.?Μ?\.?/i,
    longDateFormat : {
        LT : 'h:mm A',
        LTS : 'h:mm:ss A',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY h:mm A',
        LLLL : 'dddd, D MMMM YYYY h:mm A'
    },
    calendarEl : {
        sameDay : '[Σήμερα {}] LT',
        nextDay : '[Αύριο {}] LT',
        nextWeek : 'dddd [{}] LT',
        lastDay : '[Χθες {}] LT',
        lastWeek : function () {
            switch (this.day()) {
                case 6:
                    return '[το προηγούμενο] dddd [{}] LT';
                default:
                    return '[την προηγούμενη] dddd [{}] LT';
            }
        },
        sameElse : 'L'
    },
    calendar : function (key, mom) {
        var output = this._calendarEl[key],
            hours = mom && mom.hours();
        if (isFunction(output)) {
            output = output.apply(mom);
        }
        return output.replace('{}', (hours % 12 === 1 ? 'στη' : 'στις'));
    },
    relativeTime : {
        future : 'σε %s',
        past : '%s πριν',
        s : 'λίγα δευτερόλεπτα',
        m : 'ένα λεπτό',
        mm : '%d λεπτά',
        h : 'μία ώρα',
        hh : '%d ώρες',
        d : 'μία μέρα',
        dd : '%d μέρες',
        M : 'ένας μήνας',
        MM : '%d μήνες',
        y : 'ένας χρόνος',
        yy : '%d χρόνια'
    },
    dayOfMonthOrdinalParse: /\d{1,2}η/,
    ordinal: '%dη',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : English (Australia) [en-au]
//! author : Jared Morse : https://github.com/jarcoal

hooks.defineLocale('en-au', {
    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    longDateFormat : {
        LT : 'h:mm A',
        LTS : 'h:mm:ss A',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY h:mm A',
        LLLL : 'dddd, D MMMM YYYY h:mm A'
    },
    calendar : {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'in %s',
        past : '%s ago',
        s : 'a few seconds',
        m : 'a minute',
        mm : '%d minutes',
        h : 'an hour',
        hh : '%d hours',
        d : 'a day',
        dd : '%d days',
        M : 'a month',
        MM : '%d months',
        y : 'a year',
        yy : '%d years'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : English (Canada) [en-ca]
//! author : Jonathan Abourbih : https://github.com/jonbca

hooks.defineLocale('en-ca', {
    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    longDateFormat : {
        LT : 'h:mm A',
        LTS : 'h:mm:ss A',
        L : 'YYYY-MM-DD',
        LL : 'MMMM D, YYYY',
        LLL : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    },
    calendar : {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'in %s',
        past : '%s ago',
        s : 'a few seconds',
        m : 'a minute',
        mm : '%d minutes',
        h : 'an hour',
        hh : '%d hours',
        d : 'a day',
        dd : '%d days',
        M : 'a month',
        MM : '%d months',
        y : 'a year',
        yy : '%d years'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    }
});

//! moment.js locale configuration
//! locale : English (United Kingdom) [en-gb]
//! author : Chris Gedrim : https://github.com/chrisgedrim

hooks.defineLocale('en-gb', {
    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'in %s',
        past : '%s ago',
        s : 'a few seconds',
        m : 'a minute',
        mm : '%d minutes',
        h : 'an hour',
        hh : '%d hours',
        d : 'a day',
        dd : '%d days',
        M : 'a month',
        MM : '%d months',
        y : 'a year',
        yy : '%d years'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : English (Ireland) [en-ie]
//! author : Chris Cartlidge : https://github.com/chriscartlidge

hooks.defineLocale('en-ie', {
    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD-MM-YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'in %s',
        past : '%s ago',
        s : 'a few seconds',
        m : 'a minute',
        mm : '%d minutes',
        h : 'an hour',
        hh : '%d hours',
        d : 'a day',
        dd : '%d days',
        M : 'a month',
        MM : '%d months',
        y : 'a year',
        yy : '%d years'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : English (New Zealand) [en-nz]
//! author : Luke McGregor : https://github.com/lukemcgregor

hooks.defineLocale('en-nz', {
    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    longDateFormat : {
        LT : 'h:mm A',
        LTS : 'h:mm:ss A',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY h:mm A',
        LLLL : 'dddd, D MMMM YYYY h:mm A'
    },
    calendar : {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'in %s',
        past : '%s ago',
        s : 'a few seconds',
        m : 'a minute',
        mm : '%d minutes',
        h : 'an hour',
        hh : '%d hours',
        d : 'a day',
        dd : '%d days',
        M : 'a month',
        MM : '%d months',
        y : 'a year',
        yy : '%d years'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Esperanto [eo]
//! author : Colin Dean : https://github.com/colindean
//! author : Mia Nordentoft Imperatori : https://github.com/miestasmia
//! comment : miestasmia corrected the translation by colindean

hooks.defineLocale('eo', {
    months : 'januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro'.split('_'),
    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec'.split('_'),
    weekdays : 'dimanĉo_lundo_mardo_merkredo_ĵaŭdo_vendredo_sabato'.split('_'),
    weekdaysShort : 'dim_lun_mard_merk_ĵaŭ_ven_sab'.split('_'),
    weekdaysMin : 'di_lu_ma_me_ĵa_ve_sa'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY-MM-DD',
        LL : 'D[-a de] MMMM, YYYY',
        LLL : 'D[-a de] MMMM, YYYY HH:mm',
        LLLL : 'dddd, [la] D[-a de] MMMM, YYYY HH:mm'
    },
    meridiemParse: /[ap]\.t\.m/i,
    isPM: function (input) {
        return input.charAt(0).toLowerCase() === 'p';
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'p.t.m.' : 'P.T.M.';
        } else {
            return isLower ? 'a.t.m.' : 'A.T.M.';
        }
    },
    calendar : {
        sameDay : '[Hodiaŭ je] LT',
        nextDay : '[Morgaŭ je] LT',
        nextWeek : 'dddd [je] LT',
        lastDay : '[Hieraŭ je] LT',
        lastWeek : '[pasinta] dddd [je] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'post %s',
        past : 'antaŭ %s',
        s : 'sekundoj',
        m : 'minuto',
        mm : '%d minutoj',
        h : 'horo',
        hh : '%d horoj',
        d : 'tago',//ne 'diurno', ĉar estas uzita por proksimumo
        dd : '%d tagoj',
        M : 'monato',
        MM : '%d monatoj',
        y : 'jaro',
        yy : '%d jaroj'
    },
    dayOfMonthOrdinalParse: /\d{1,2}a/,
    ordinal : '%da',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Spanish (Dominican Republic) [es-do]

var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
var monthsShort$1 = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

var monthsParse = [/^ene/i, /^feb/i, /^mar/i, /^abr/i, /^may/i, /^jun/i, /^jul/i, /^ago/i, /^sep/i, /^oct/i, /^nov/i, /^dic/i];
var monthsRegex$1 = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;

hooks.defineLocale('es-do', {
    months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
    monthsShort : function (m, format) {
        if (!m) {
            return monthsShortDot;
        } else if (/-MMM-/.test(format)) {
            return monthsShort$1[m.month()];
        } else {
            return monthsShortDot[m.month()];
        }
    },
    monthsRegex: monthsRegex$1,
    monthsShortRegex: monthsRegex$1,
    monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
    monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
    monthsParse: monthsParse,
    longMonthsParse: monthsParse,
    shortMonthsParse: monthsParse,
    weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    weekdaysShort : 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    weekdaysMin : 'do_lu_ma_mi_ju_vi_sá'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'h:mm A',
        LTS : 'h:mm:ss A',
        L : 'DD/MM/YYYY',
        LL : 'D [de] MMMM [de] YYYY',
        LLL : 'D [de] MMMM [de] YYYY h:mm A',
        LLLL : 'dddd, D [de] MMMM [de] YYYY h:mm A'
    },
    calendar : {
        sameDay : function () {
            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextDay : function () {
            return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextWeek : function () {
            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastDay : function () {
            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastWeek : function () {
            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'en %s',
        past : 'hace %s',
        s : 'unos segundos',
        m : 'un minuto',
        mm : '%d minutos',
        h : 'una hora',
        hh : '%d horas',
        d : 'un día',
        dd : '%d días',
        M : 'un mes',
        MM : '%d meses',
        y : 'un año',
        yy : '%d años'
    },
    dayOfMonthOrdinalParse : /\d{1,2}º/,
    ordinal : '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Spanish(United State) [es-us]
//! author : bustta : https://github.com/bustta

var monthsShortDot$1 = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
var monthsShort$2 = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

hooks.defineLocale('es-us', {
    months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
    monthsShort : function (m, format) {
        if (!m) {
            return monthsShortDot$1;
        } else if (/-MMM-/.test(format)) {
            return monthsShort$2[m.month()];
        } else {
            return monthsShortDot$1[m.month()];
        }
    },
    monthsParseExact : true,
    weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    weekdaysShort : 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    weekdaysMin : 'do_lu_ma_mi_ju_vi_sá'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'MM/DD/YYYY',
        LL : 'MMMM [de] D [de] YYYY',
        LLL : 'MMMM [de] D [de] YYYY H:mm',
        LLLL : 'dddd, MMMM [de] D [de] YYYY H:mm'
    },
    calendar : {
        sameDay : function () {
            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextDay : function () {
            return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextWeek : function () {
            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastDay : function () {
            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastWeek : function () {
            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'en %s',
        past : 'hace %s',
        s : 'unos segundos',
        m : 'un minuto',
        mm : '%d minutos',
        h : 'una hora',
        hh : '%d horas',
        d : 'un día',
        dd : '%d días',
        M : 'un mes',
        MM : '%d meses',
        y : 'un año',
        yy : '%d años'
    },
    dayOfMonthOrdinalParse : /\d{1,2}º/,
    ordinal : '%dº',
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Spanish [es]
//! author : Julio Napurí : https://github.com/julionc

var monthsShortDot$2 = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
var monthsShort$3 = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

var monthsParse$1 = [/^ene/i, /^feb/i, /^mar/i, /^abr/i, /^may/i, /^jun/i, /^jul/i, /^ago/i, /^sep/i, /^oct/i, /^nov/i, /^dic/i];
var monthsRegex$2 = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;

hooks.defineLocale('es', {
    months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
    monthsShort : function (m, format) {
        if (!m) {
            return monthsShortDot$2;
        } else if (/-MMM-/.test(format)) {
            return monthsShort$3[m.month()];
        } else {
            return monthsShortDot$2[m.month()];
        }
    },
    monthsRegex : monthsRegex$2,
    monthsShortRegex : monthsRegex$2,
    monthsStrictRegex : /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
    monthsShortStrictRegex : /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
    monthsParse : monthsParse$1,
    longMonthsParse : monthsParse$1,
    shortMonthsParse : monthsParse$1,
    weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    weekdaysShort : 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    weekdaysMin : 'do_lu_ma_mi_ju_vi_sá'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D [de] MMMM [de] YYYY',
        LLL : 'D [de] MMMM [de] YYYY H:mm',
        LLLL : 'dddd, D [de] MMMM [de] YYYY H:mm'
    },
    calendar : {
        sameDay : function () {
            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextDay : function () {
            return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextWeek : function () {
            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastDay : function () {
            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastWeek : function () {
            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'en %s',
        past : 'hace %s',
        s : 'unos segundos',
        m : 'un minuto',
        mm : '%d minutos',
        h : 'una hora',
        hh : '%d horas',
        d : 'un día',
        dd : '%d días',
        M : 'un mes',
        MM : '%d meses',
        y : 'un año',
        yy : '%d años'
    },
    dayOfMonthOrdinalParse : /\d{1,2}º/,
    ordinal : '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Estonian [et]
//! author : Henry Kehlmann : https://github.com/madhenry
//! improvements : Illimar Tambek : https://github.com/ragulka

function processRelativeTime$3(number, withoutSuffix, key, isFuture) {
    var format = {
        's' : ['mõne sekundi', 'mõni sekund', 'paar sekundit'],
        'm' : ['ühe minuti', 'üks minut'],
        'mm': [number + ' minuti', number + ' minutit'],
        'h' : ['ühe tunni', 'tund aega', 'üks tund'],
        'hh': [number + ' tunni', number + ' tundi'],
        'd' : ['ühe päeva', 'üks päev'],
        'M' : ['kuu aja', 'kuu aega', 'üks kuu'],
        'MM': [number + ' kuu', number + ' kuud'],
        'y' : ['ühe aasta', 'aasta', 'üks aasta'],
        'yy': [number + ' aasta', number + ' aastat']
    };
    if (withoutSuffix) {
        return format[key][2] ? format[key][2] : format[key][1];
    }
    return isFuture ? format[key][0] : format[key][1];
}

hooks.defineLocale('et', {
    months        : 'jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember'.split('_'),
    monthsShort   : 'jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets'.split('_'),
    weekdays      : 'pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev'.split('_'),
    weekdaysShort : 'P_E_T_K_N_R_L'.split('_'),
    weekdaysMin   : 'P_E_T_K_N_R_L'.split('_'),
    longDateFormat : {
        LT   : 'H:mm',
        LTS : 'H:mm:ss',
        L    : 'DD.MM.YYYY',
        LL   : 'D. MMMM YYYY',
        LLL  : 'D. MMMM YYYY H:mm',
        LLLL : 'dddd, D. MMMM YYYY H:mm'
    },
    calendar : {
        sameDay  : '[Täna,] LT',
        nextDay  : '[Homme,] LT',
        nextWeek : '[Järgmine] dddd LT',
        lastDay  : '[Eile,] LT',
        lastWeek : '[Eelmine] dddd LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s pärast',
        past   : '%s tagasi',
        s      : processRelativeTime$3,
        m      : processRelativeTime$3,
        mm     : processRelativeTime$3,
        h      : processRelativeTime$3,
        hh     : processRelativeTime$3,
        d      : processRelativeTime$3,
        dd     : '%d päeva',
        M      : processRelativeTime$3,
        MM     : processRelativeTime$3,
        y      : processRelativeTime$3,
        yy     : processRelativeTime$3
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Basque [eu]
//! author : Eneko Illarramendi : https://github.com/eillarra

hooks.defineLocale('eu', {
    months : 'urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua'.split('_'),
    monthsShort : 'urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.'.split('_'),
    monthsParseExact : true,
    weekdays : 'igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata'.split('_'),
    weekdaysShort : 'ig._al._ar._az._og._ol._lr.'.split('_'),
    weekdaysMin : 'ig_al_ar_az_og_ol_lr'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY-MM-DD',
        LL : 'YYYY[ko] MMMM[ren] D[a]',
        LLL : 'YYYY[ko] MMMM[ren] D[a] HH:mm',
        LLLL : 'dddd, YYYY[ko] MMMM[ren] D[a] HH:mm',
        l : 'YYYY-M-D',
        ll : 'YYYY[ko] MMM D[a]',
        lll : 'YYYY[ko] MMM D[a] HH:mm',
        llll : 'ddd, YYYY[ko] MMM D[a] HH:mm'
    },
    calendar : {
        sameDay : '[gaur] LT[etan]',
        nextDay : '[bihar] LT[etan]',
        nextWeek : 'dddd LT[etan]',
        lastDay : '[atzo] LT[etan]',
        lastWeek : '[aurreko] dddd LT[etan]',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s barru',
        past : 'duela %s',
        s : 'segundo batzuk',
        m : 'minutu bat',
        mm : '%d minutu',
        h : 'ordu bat',
        hh : '%d ordu',
        d : 'egun bat',
        dd : '%d egun',
        M : 'hilabete bat',
        MM : '%d hilabete',
        y : 'urte bat',
        yy : '%d urte'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Persian [fa]
//! author : Ebrahim Byagowi : https://github.com/ebraminio

var symbolMap$5 = {
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹',
    '0': '۰'
};
var numberMap$4 = {
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
    '۰': '0'
};

hooks.defineLocale('fa', {
    months : 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
    monthsShort : 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
    weekdays : 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
    weekdaysShort : 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
    weekdaysMin : 'ی_د_س_چ_پ_ج_ش'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    meridiemParse: /قبل از ظهر|بعد از ظهر/,
    isPM: function (input) {
        return /بعد از ظهر/.test(input);
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'قبل از ظهر';
        } else {
            return 'بعد از ظهر';
        }
    },
    calendar : {
        sameDay : '[امروز ساعت] LT',
        nextDay : '[فردا ساعت] LT',
        nextWeek : 'dddd [ساعت] LT',
        lastDay : '[دیروز ساعت] LT',
        lastWeek : 'dddd [پیش] [ساعت] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'در %s',
        past : '%s پیش',
        s : 'چند ثانیه',
        m : 'یک دقیقه',
        mm : '%d دقیقه',
        h : 'یک ساعت',
        hh : '%d ساعت',
        d : 'یک روز',
        dd : '%d روز',
        M : 'یک ماه',
        MM : '%d ماه',
        y : 'یک سال',
        yy : '%d سال'
    },
    preparse: function (string) {
        return string.replace(/[۰-۹]/g, function (match) {
            return numberMap$4[match];
        }).replace(/،/g, ',');
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap$5[match];
        }).replace(/,/g, '،');
    },
    dayOfMonthOrdinalParse: /\d{1,2}م/,
    ordinal : '%dم',
    week : {
        dow : 6, // Saturday is the first day of the week.
        doy : 12 // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Finnish [fi]
//! author : Tarmo Aidantausta : https://github.com/bleadof

var numbersPast = 'nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän'.split(' ');
var numbersFuture = [
        'nolla', 'yhden', 'kahden', 'kolmen', 'neljän', 'viiden', 'kuuden',
        numbersPast[7], numbersPast[8], numbersPast[9]
    ];
function translate$2(number, withoutSuffix, key, isFuture) {
    var result = '';
    switch (key) {
        case 's':
            return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
        case 'm':
            return isFuture ? 'minuutin' : 'minuutti';
        case 'mm':
            result = isFuture ? 'minuutin' : 'minuuttia';
            break;
        case 'h':
            return isFuture ? 'tunnin' : 'tunti';
        case 'hh':
            result = isFuture ? 'tunnin' : 'tuntia';
            break;
        case 'd':
            return isFuture ? 'päivän' : 'päivä';
        case 'dd':
            result = isFuture ? 'päivän' : 'päivää';
            break;
        case 'M':
            return isFuture ? 'kuukauden' : 'kuukausi';
        case 'MM':
            result = isFuture ? 'kuukauden' : 'kuukautta';
            break;
        case 'y':
            return isFuture ? 'vuoden' : 'vuosi';
        case 'yy':
            result = isFuture ? 'vuoden' : 'vuotta';
            break;
    }
    result = verbalNumber(number, isFuture) + ' ' + result;
    return result;
}
function verbalNumber(number, isFuture) {
    return number < 10 ? (isFuture ? numbersFuture[number] : numbersPast[number]) : number;
}

hooks.defineLocale('fi', {
    months : 'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split('_'),
    monthsShort : 'tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu'.split('_'),
    weekdays : 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split('_'),
    weekdaysShort : 'su_ma_ti_ke_to_pe_la'.split('_'),
    weekdaysMin : 'su_ma_ti_ke_to_pe_la'.split('_'),
    longDateFormat : {
        LT : 'HH.mm',
        LTS : 'HH.mm.ss',
        L : 'DD.MM.YYYY',
        LL : 'Do MMMM[ta] YYYY',
        LLL : 'Do MMMM[ta] YYYY, [klo] HH.mm',
        LLLL : 'dddd, Do MMMM[ta] YYYY, [klo] HH.mm',
        l : 'D.M.YYYY',
        ll : 'Do MMM YYYY',
        lll : 'Do MMM YYYY, [klo] HH.mm',
        llll : 'ddd, Do MMM YYYY, [klo] HH.mm'
    },
    calendar : {
        sameDay : '[tänään] [klo] LT',
        nextDay : '[huomenna] [klo] LT',
        nextWeek : 'dddd [klo] LT',
        lastDay : '[eilen] [klo] LT',
        lastWeek : '[viime] dddd[na] [klo] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s päästä',
        past : '%s sitten',
        s : translate$2,
        m : translate$2,
        mm : translate$2,
        h : translate$2,
        hh : translate$2,
        d : translate$2,
        dd : translate$2,
        M : translate$2,
        MM : translate$2,
        y : translate$2,
        yy : translate$2
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Faroese [fo]
//! author : Ragnar Johannesen : https://github.com/ragnar123

hooks.defineLocale('fo', {
    months : 'januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
    monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
    weekdays : 'sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur'.split('_'),
    weekdaysShort : 'sun_mán_týs_mik_hós_frí_ley'.split('_'),
    weekdaysMin : 'su_má_tý_mi_hó_fr_le'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D. MMMM, YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Í dag kl.] LT',
        nextDay : '[Í morgin kl.] LT',
        nextWeek : 'dddd [kl.] LT',
        lastDay : '[Í gjár kl.] LT',
        lastWeek : '[síðstu] dddd [kl] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'um %s',
        past : '%s síðani',
        s : 'fá sekund',
        m : 'ein minutt',
        mm : '%d minuttir',
        h : 'ein tími',
        hh : '%d tímar',
        d : 'ein dagur',
        dd : '%d dagar',
        M : 'ein mánaði',
        MM : '%d mánaðir',
        y : 'eitt ár',
        yy : '%d ár'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : French (Canada) [fr-ca]
//! author : Jonathan Abourbih : https://github.com/jonbca

hooks.defineLocale('fr-ca', {
    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact : true,
    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY-MM-DD',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Aujourd’hui à] LT',
        nextDay : '[Demain à] LT',
        nextWeek : 'dddd [à] LT',
        lastDay : '[Hier à] LT',
        lastWeek : 'dddd [dernier à] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dans %s',
        past : 'il y a %s',
        s : 'quelques secondes',
        m : 'une minute',
        mm : '%d minutes',
        h : 'une heure',
        hh : '%d heures',
        d : 'un jour',
        dd : '%d jours',
        M : 'un mois',
        MM : '%d mois',
        y : 'un an',
        yy : '%d ans'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
    ordinal : function (number, period) {
        switch (period) {
            // Words with masculine grammatical gender: mois, trimestre, jour
            default:
            case 'M':
            case 'Q':
            case 'D':
            case 'DDD':
            case 'd':
                return number + (number === 1 ? 'er' : 'e');

            // Words with feminine grammatical gender: semaine
            case 'w':
            case 'W':
                return number + (number === 1 ? 're' : 'e');
        }
    }
});

//! moment.js locale configuration
//! locale : French (Switzerland) [fr-ch]
//! author : Gaspard Bucher : https://github.com/gaspard

hooks.defineLocale('fr-ch', {
    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact : true,
    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Aujourd’hui à] LT',
        nextDay : '[Demain à] LT',
        nextWeek : 'dddd [à] LT',
        lastDay : '[Hier à] LT',
        lastWeek : 'dddd [dernier à] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dans %s',
        past : 'il y a %s',
        s : 'quelques secondes',
        m : 'une minute',
        mm : '%d minutes',
        h : 'une heure',
        hh : '%d heures',
        d : 'un jour',
        dd : '%d jours',
        M : 'un mois',
        MM : '%d mois',
        y : 'un an',
        yy : '%d ans'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
    ordinal : function (number, period) {
        switch (period) {
            // Words with masculine grammatical gender: mois, trimestre, jour
            default:
            case 'M':
            case 'Q':
            case 'D':
            case 'DDD':
            case 'd':
                return number + (number === 1 ? 'er' : 'e');

            // Words with feminine grammatical gender: semaine
            case 'w':
            case 'W':
                return number + (number === 1 ? 're' : 'e');
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : French [fr]
//! author : John Fischer : https://github.com/jfroffice

hooks.defineLocale('fr', {
    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact : true,
    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Aujourd’hui à] LT',
        nextDay : '[Demain à] LT',
        nextWeek : 'dddd [à] LT',
        lastDay : '[Hier à] LT',
        lastWeek : 'dddd [dernier à] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dans %s',
        past : 'il y a %s',
        s : 'quelques secondes',
        m : 'une minute',
        mm : '%d minutes',
        h : 'une heure',
        hh : '%d heures',
        d : 'un jour',
        dd : '%d jours',
        M : 'un mois',
        MM : '%d mois',
        y : 'un an',
        yy : '%d ans'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(er|)/,
    ordinal : function (number, period) {
        switch (period) {
            // TODO: Return 'e' when day of month > 1. Move this case inside
            // block for masculine words below.
            // See https://github.com/moment/moment/issues/3375
            case 'D':
                return number + (number === 1 ? 'er' : '');

            // Words with masculine grammatical gender: mois, trimestre, jour
            default:
            case 'M':
            case 'Q':
            case 'DDD':
            case 'd':
                return number + (number === 1 ? 'er' : 'e');

            // Words with feminine grammatical gender: semaine
            case 'w':
            case 'W':
                return number + (number === 1 ? 're' : 'e');
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Frisian [fy]
//! author : Robin van der Vliet : https://github.com/robin0van0der0v

var monthsShortWithDots = 'jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.'.split('_');
var monthsShortWithoutDots = 'jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_');

hooks.defineLocale('fy', {
    months : 'jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber'.split('_'),
    monthsShort : function (m, format) {
        if (!m) {
            return monthsShortWithDots;
        } else if (/-MMM-/.test(format)) {
            return monthsShortWithoutDots[m.month()];
        } else {
            return monthsShortWithDots[m.month()];
        }
    },
    monthsParseExact : true,
    weekdays : 'snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon'.split('_'),
    weekdaysShort : 'si._mo._ti._wo._to._fr._so.'.split('_'),
    weekdaysMin : 'Si_Mo_Ti_Wo_To_Fr_So'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD-MM-YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[hjoed om] LT',
        nextDay: '[moarn om] LT',
        nextWeek: 'dddd [om] LT',
        lastDay: '[juster om] LT',
        lastWeek: '[ôfrûne] dddd [om] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'oer %s',
        past : '%s lyn',
        s : 'in pear sekonden',
        m : 'ien minút',
        mm : '%d minuten',
        h : 'ien oere',
        hh : '%d oeren',
        d : 'ien dei',
        dd : '%d dagen',
        M : 'ien moanne',
        MM : '%d moannen',
        y : 'ien jier',
        yy : '%d jierren'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
    ordinal : function (number) {
        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Scottish Gaelic [gd]
//! author : Jon Ashdown : https://github.com/jonashdown

var months$5 = [
    'Am Faoilleach', 'An Gearran', 'Am Màrt', 'An Giblean', 'An Cèitean', 'An t-Ògmhios', 'An t-Iuchar', 'An Lùnastal', 'An t-Sultain', 'An Dàmhair', 'An t-Samhain', 'An Dùbhlachd'
];

var monthsShort$4 = ['Faoi', 'Gear', 'Màrt', 'Gibl', 'Cèit', 'Ògmh', 'Iuch', 'Lùn', 'Sult', 'Dàmh', 'Samh', 'Dùbh'];

var weekdays$1 = ['Didòmhnaich', 'Diluain', 'Dimàirt', 'Diciadain', 'Diardaoin', 'Dihaoine', 'Disathairne'];

var weekdaysShort = ['Did', 'Dil', 'Dim', 'Dic', 'Dia', 'Dih', 'Dis'];

var weekdaysMin = ['Dò', 'Lu', 'Mà', 'Ci', 'Ar', 'Ha', 'Sa'];

hooks.defineLocale('gd', {
    months : months$5,
    monthsShort : monthsShort$4,
    monthsParseExact : true,
    weekdays : weekdays$1,
    weekdaysShort : weekdaysShort,
    weekdaysMin : weekdaysMin,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[An-diugh aig] LT',
        nextDay : '[A-màireach aig] LT',
        nextWeek : 'dddd [aig] LT',
        lastDay : '[An-dè aig] LT',
        lastWeek : 'dddd [seo chaidh] [aig] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'ann an %s',
        past : 'bho chionn %s',
        s : 'beagan diogan',
        m : 'mionaid',
        mm : '%d mionaidean',
        h : 'uair',
        hh : '%d uairean',
        d : 'latha',
        dd : '%d latha',
        M : 'mìos',
        MM : '%d mìosan',
        y : 'bliadhna',
        yy : '%d bliadhna'
    },
    dayOfMonthOrdinalParse : /\d{1,2}(d|na|mh)/,
    ordinal : function (number) {
        var output = number === 1 ? 'd' : number % 10 === 2 ? 'na' : 'mh';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Galician [gl]
//! author : Juan G. Hurtado : https://github.com/juanghurtado

hooks.defineLocale('gl', {
    months : 'xaneiro_febreiro_marzo_abril_maio_xuño_xullo_agosto_setembro_outubro_novembro_decembro'.split('_'),
    monthsShort : 'xan._feb._mar._abr._mai._xuñ._xul._ago._set._out._nov._dec.'.split('_'),
    monthsParseExact: true,
    weekdays : 'domingo_luns_martes_mércores_xoves_venres_sábado'.split('_'),
    weekdaysShort : 'dom._lun._mar._mér._xov._ven._sáb.'.split('_'),
    weekdaysMin : 'do_lu_ma_mé_xo_ve_sá'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D [de] MMMM [de] YYYY',
        LLL : 'D [de] MMMM [de] YYYY H:mm',
        LLLL : 'dddd, D [de] MMMM [de] YYYY H:mm'
    },
    calendar : {
        sameDay : function () {
            return '[hoxe ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
        },
        nextDay : function () {
            return '[mañá ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
        },
        nextWeek : function () {
            return 'dddd [' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
        },
        lastDay : function () {
            return '[onte ' + ((this.hours() !== 1) ? 'á' : 'a') + '] LT';
        },
        lastWeek : function () {
            return '[o] dddd [pasado ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : function (str) {
            if (str.indexOf('un') === 0) {
                return 'n' + str;
            }
            return 'en ' + str;
        },
        past : 'hai %s',
        s : 'uns segundos',
        m : 'un minuto',
        mm : '%d minutos',
        h : 'unha hora',
        hh : '%d horas',
        d : 'un día',
        dd : '%d días',
        M : 'un mes',
        MM : '%d meses',
        y : 'un ano',
        yy : '%d anos'
    },
    dayOfMonthOrdinalParse : /\d{1,2}º/,
    ordinal : '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Konkani Latin script [gom-latn]
//! author : The Discoverer : https://github.com/WikiDiscoverer

function processRelativeTime$4(number, withoutSuffix, key, isFuture) {
    var format = {
        's': ['thodde secondanim', 'thodde second'],
        'm': ['eka mintan', 'ek minute'],
        'mm': [number + ' mintanim', number + ' mintam'],
        'h': ['eka horan', 'ek hor'],
        'hh': [number + ' horanim', number + ' hor'],
        'd': ['eka disan', 'ek dis'],
        'dd': [number + ' disanim', number + ' dis'],
        'M': ['eka mhoinean', 'ek mhoino'],
        'MM': [number + ' mhoineanim', number + ' mhoine'],
        'y': ['eka vorsan', 'ek voros'],
        'yy': [number + ' vorsanim', number + ' vorsam']
    };
    return withoutSuffix ? format[key][0] : format[key][1];
}

hooks.defineLocale('gom-latn', {
    months : 'Janer_Febrer_Mars_Abril_Mai_Jun_Julai_Agost_Setembr_Otubr_Novembr_Dezembr'.split('_'),
    monthsShort : 'Jan._Feb._Mars_Abr._Mai_Jun_Jul._Ago._Set._Otu._Nov._Dez.'.split('_'),
    monthsParseExact : true,
    weekdays : 'Aitar_Somar_Mongllar_Budvar_Brestar_Sukrar_Son\'var'.split('_'),
    weekdaysShort : 'Ait._Som._Mon._Bud._Bre._Suk._Son.'.split('_'),
    weekdaysMin : 'Ai_Sm_Mo_Bu_Br_Su_Sn'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'A h:mm [vazta]',
        LTS : 'A h:mm:ss [vazta]',
        L : 'DD-MM-YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY A h:mm [vazta]',
        LLLL : 'dddd, MMMM[achea] Do, YYYY, A h:mm [vazta]',
        llll: 'ddd, D MMM YYYY, A h:mm [vazta]'
    },
    calendar : {
        sameDay: '[Aiz] LT',
        nextDay: '[Faleam] LT',
        nextWeek: '[Ieta to] dddd[,] LT',
        lastDay: '[Kal] LT',
        lastWeek: '[Fatlo] dddd[,] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : '%s',
        past : '%s adim',
        s : processRelativeTime$4,
        m : processRelativeTime$4,
        mm : processRelativeTime$4,
        h : processRelativeTime$4,
        hh : processRelativeTime$4,
        d : processRelativeTime$4,
        dd : processRelativeTime$4,
        M : processRelativeTime$4,
        MM : processRelativeTime$4,
        y : processRelativeTime$4,
        yy : processRelativeTime$4
    },
    dayOfMonthOrdinalParse : /\d{1,2}(er)/,
    ordinal : function (number, period) {
        switch (period) {
            // the ordinal 'er' only applies to day of the month
            case 'D':
                return number + 'er';
            default:
            case 'M':
            case 'Q':
            case 'DDD':
            case 'd':
            case 'w':
            case 'W':
                return number;
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    },
    meridiemParse: /rati|sokalli|donparam|sanje/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'rati') {
            return hour < 4 ? hour : hour + 12;
        } else if (meridiem === 'sokalli') {
            return hour;
        } else if (meridiem === 'donparam') {
            return hour > 12 ? hour : hour + 12;
        } else if (meridiem === 'sanje') {
            return hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'rati';
        } else if (hour < 12) {
            return 'sokalli';
        } else if (hour < 16) {
            return 'donparam';
        } else if (hour < 20) {
            return 'sanje';
        } else {
            return 'rati';
        }
    }
});

//! moment.js locale configuration
//! locale : Gujarati [gu]
//! author : Kaushik Thanki : https://github.com/Kaushik1987

var symbolMap$6 = {
        '1': '૧',
        '2': '૨',
        '3': '૩',
        '4': '૪',
        '5': '૫',
        '6': '૬',
        '7': '૭',
        '8': '૮',
        '9': '૯',
        '0': '૦'
    };
var numberMap$5 = {
        '૧': '1',
        '૨': '2',
        '૩': '3',
        '૪': '4',
        '૫': '5',
        '૬': '6',
        '૭': '7',
        '૮': '8',
        '૯': '9',
        '૦': '0'
    };

hooks.defineLocale('gu', {
    months: 'જાન્યુઆરી_ફેબ્રુઆરી_માર્ચ_એપ્રિલ_મે_જૂન_જુલાઈ_ઑગસ્ટ_સપ્ટેમ્બર_ઑક્ટ્બર_નવેમ્બર_ડિસેમ્બર'.split('_'),
    monthsShort: 'જાન્યુ._ફેબ્રુ._માર્ચ_એપ્રિ._મે_જૂન_જુલા._ઑગ._સપ્ટે._ઑક્ટ્._નવે._ડિસે.'.split('_'),
    monthsParseExact: true,
    weekdays: 'રવિવાર_સોમવાર_મંગળવાર_બુધ્વાર_ગુરુવાર_શુક્રવાર_શનિવાર'.split('_'),
    weekdaysShort: 'રવિ_સોમ_મંગળ_બુધ્_ગુરુ_શુક્ર_શનિ'.split('_'),
    weekdaysMin: 'ર_સો_મં_બુ_ગુ_શુ_શ'.split('_'),
    longDateFormat: {
        LT: 'A h:mm વાગ્યે',
        LTS: 'A h:mm:ss વાગ્યે',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY, A h:mm વાગ્યે',
        LLLL: 'dddd, D MMMM YYYY, A h:mm વાગ્યે'
    },
    calendar: {
        sameDay: '[આજ] LT',
        nextDay: '[કાલે] LT',
        nextWeek: 'dddd, LT',
        lastDay: '[ગઇકાલે] LT',
        lastWeek: '[પાછલા] dddd, LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: '%s મા',
        past: '%s પેહલા',
        s: 'અમુક પળો',
        m: 'એક મિનિટ',
        mm: '%d મિનિટ',
        h: 'એક કલાક',
        hh: '%d કલાક',
        d: 'એક દિવસ',
        dd: '%d દિવસ',
        M: 'એક મહિનો',
        MM: '%d મહિનો',
        y: 'એક વર્ષ',
        yy: '%d વર્ષ'
    },
    preparse: function (string) {
        return string.replace(/[૧૨૩૪૫૬૭૮૯૦]/g, function (match) {
            return numberMap$5[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap$6[match];
        });
    },
    // Gujarati notation for meridiems are quite fuzzy in practice. While there exists
    // a rigid notion of a 'Pahar' it is not used as rigidly in modern Gujarati.
    meridiemParse: /રાત|બપોર|સવાર|સાંજ/,
    meridiemHour: function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'રાત') {
            return hour < 4 ? hour : hour + 12;
        } else if (meridiem === 'સવાર') {
            return hour;
        } else if (meridiem === 'બપોર') {
            return hour >= 10 ? hour : hour + 12;
        } else if (meridiem === 'સાંજ') {
            return hour + 12;
        }
    },
    meridiem: function (hour, minute, isLower) {
        if (hour < 4) {
            return 'રાત';
        } else if (hour < 10) {
            return 'સવાર';
        } else if (hour < 17) {
            return 'બપોર';
        } else if (hour < 20) {
            return 'સાંજ';
        } else {
            return 'રાત';
        }
    },
    week: {
        dow: 0, // Sunday is the first day of the week.
        doy: 6 // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Hebrew [he]
//! author : Tomer Cohen : https://github.com/tomer
//! author : Moshe Simantov : https://github.com/DevelopmentIL
//! author : Tal Ater : https://github.com/TalAter

hooks.defineLocale('he', {
    months : 'ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר'.split('_'),
    monthsShort : 'ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳'.split('_'),
    weekdays : 'ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת'.split('_'),
    weekdaysShort : 'א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳'.split('_'),
    weekdaysMin : 'א_ב_ג_ד_ה_ו_ש'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D [ב]MMMM YYYY',
        LLL : 'D [ב]MMMM YYYY HH:mm',
        LLLL : 'dddd, D [ב]MMMM YYYY HH:mm',
        l : 'D/M/YYYY',
        ll : 'D MMM YYYY',
        lll : 'D MMM YYYY HH:mm',
        llll : 'ddd, D MMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[היום ב־]LT',
        nextDay : '[מחר ב־]LT',
        nextWeek : 'dddd [בשעה] LT',
        lastDay : '[אתמול ב־]LT',
        lastWeek : '[ביום] dddd [האחרון בשעה] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'בעוד %s',
        past : 'לפני %s',
        s : 'מספר שניות',
        m : 'דקה',
        mm : '%d דקות',
        h : 'שעה',
        hh : function (number) {
            if (number === 2) {
                return 'שעתיים';
            }
            return number + ' שעות';
        },
        d : 'יום',
        dd : function (number) {
            if (number === 2) {
                return 'יומיים';
            }
            return number + ' ימים';
        },
        M : 'חודש',
        MM : function (number) {
            if (number === 2) {
                return 'חודשיים';
            }
            return number + ' חודשים';
        },
        y : 'שנה',
        yy : function (number) {
            if (number === 2) {
                return 'שנתיים';
            } else if (number % 10 === 0 && number !== 10) {
                return number + ' שנה';
            }
            return number + ' שנים';
        }
    },
    meridiemParse: /אחה"צ|לפנה"צ|אחרי הצהריים|לפני הצהריים|לפנות בוקר|בבוקר|בערב/i,
    isPM : function (input) {
        return /^(אחה"צ|אחרי הצהריים|בערב)$/.test(input);
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 5) {
            return 'לפנות בוקר';
        } else if (hour < 10) {
            return 'בבוקר';
        } else if (hour < 12) {
            return isLower ? 'לפנה"צ' : 'לפני הצהריים';
        } else if (hour < 18) {
            return isLower ? 'אחה"צ' : 'אחרי הצהריים';
        } else {
            return 'בערב';
        }
    }
});

//! moment.js locale configuration
//! locale : Hindi [hi]
//! author : Mayank Singhal : https://github.com/mayanksinghal

var symbolMap$7 = {
    '1': '१',
    '2': '२',
    '3': '३',
    '4': '४',
    '5': '५',
    '6': '६',
    '7': '७',
    '8': '८',
    '9': '९',
    '0': '०'
};
var numberMap$6 = {
    '१': '1',
    '२': '2',
    '३': '3',
    '४': '4',
    '५': '5',
    '६': '6',
    '७': '7',
    '८': '8',
    '९': '9',
    '०': '0'
};

hooks.defineLocale('hi', {
    months : 'जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर'.split('_'),
    monthsShort : 'जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.'.split('_'),
    monthsParseExact: true,
    weekdays : 'रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
    weekdaysShort : 'रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि'.split('_'),
    weekdaysMin : 'र_सो_मं_बु_गु_शु_श'.split('_'),
    longDateFormat : {
        LT : 'A h:mm बजे',
        LTS : 'A h:mm:ss बजे',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, A h:mm बजे',
        LLLL : 'dddd, D MMMM YYYY, A h:mm बजे'
    },
    calendar : {
        sameDay : '[आज] LT',
        nextDay : '[कल] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[कल] LT',
        lastWeek : '[पिछले] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s में',
        past : '%s पहले',
        s : 'कुछ ही क्षण',
        m : 'एक मिनट',
        mm : '%d मिनट',
        h : 'एक घंटा',
        hh : '%d घंटे',
        d : 'एक दिन',
        dd : '%d दिन',
        M : 'एक महीने',
        MM : '%d महीने',
        y : 'एक वर्ष',
        yy : '%d वर्ष'
    },
    preparse: function (string) {
        return string.replace(/[१२३४५६७८९०]/g, function (match) {
            return numberMap$6[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap$7[match];
        });
    },
    // Hindi notation for meridiems are quite fuzzy in practice. While there exists
    // a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
    meridiemParse: /रात|सुबह|दोपहर|शाम/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'रात') {
            return hour < 4 ? hour : hour + 12;
        } else if (meridiem === 'सुबह') {
            return hour;
        } else if (meridiem === 'दोपहर') {
            return hour >= 10 ? hour : hour + 12;
        } else if (meridiem === 'शाम') {
            return hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'रात';
        } else if (hour < 10) {
            return 'सुबह';
        } else if (hour < 17) {
            return 'दोपहर';
        } else if (hour < 20) {
            return 'शाम';
        } else {
            return 'रात';
        }
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Croatian [hr]
//! author : Bojan Marković : https://github.com/bmarkovic

function translate$3(number, withoutSuffix, key) {
    var result = number + ' ';
    switch (key) {
        case 'm':
            return withoutSuffix ? 'jedna minuta' : 'jedne minute';
        case 'mm':
            if (number === 1) {
                result += 'minuta';
            } else if (number === 2 || number === 3 || number === 4) {
                result += 'minute';
            } else {
                result += 'minuta';
            }
            return result;
        case 'h':
            return withoutSuffix ? 'jedan sat' : 'jednog sata';
        case 'hh':
            if (number === 1) {
                result += 'sat';
            } else if (number === 2 || number === 3 || number === 4) {
                result += 'sata';
            } else {
                result += 'sati';
            }
            return result;
        case 'dd':
            if (number === 1) {
                result += 'dan';
            } else {
                result += 'dana';
            }
            return result;
        case 'MM':
            if (number === 1) {
                result += 'mjesec';
            } else if (number === 2 || number === 3 || number === 4) {
                result += 'mjeseca';
            } else {
                result += 'mjeseci';
            }
            return result;
        case 'yy':
            if (number === 1) {
                result += 'godina';
            } else if (number === 2 || number === 3 || number === 4) {
                result += 'godine';
            } else {
                result += 'godina';
            }
            return result;
    }
}

hooks.defineLocale('hr', {
    months : {
        format: 'siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca'.split('_'),
        standalone: 'siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac'.split('_')
    },
    monthsShort : 'sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.'.split('_'),
    monthsParseExact: true,
    weekdays : 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
    weekdaysShort : 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
    weekdaysMin : 'ne_po_ut_sr_če_pe_su'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY H:mm',
        LLLL : 'dddd, D. MMMM YYYY H:mm'
    },
    calendar : {
        sameDay  : '[danas u] LT',
        nextDay  : '[sutra u] LT',
        nextWeek : function () {
            switch (this.day()) {
                case 0:
                    return '[u] [nedjelju] [u] LT';
                case 3:
                    return '[u] [srijedu] [u] LT';
                case 6:
                    return '[u] [subotu] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[u] dddd [u] LT';
            }
        },
        lastDay  : '[jučer u] LT',
        lastWeek : function () {
            switch (this.day()) {
                case 0:
                case 3:
                    return '[prošlu] dddd [u] LT';
                case 6:
                    return '[prošle] [subote] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[prošli] dddd [u] LT';
            }
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'za %s',
        past   : 'prije %s',
        s      : 'par sekundi',
        m      : translate$3,
        mm     : translate$3,
        h      : translate$3,
        hh     : translate$3,
        d      : 'dan',
        dd     : translate$3,
        M      : 'mjesec',
        MM     : translate$3,
        y      : 'godinu',
        yy     : translate$3
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Hungarian [hu]
//! author : Adam Brunner : https://github.com/adambrunner

var weekEndings = 'vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton'.split(' ');
function translate$4(number, withoutSuffix, key, isFuture) {
    var num = number,
        suffix;
    switch (key) {
        case 's':
            return (isFuture || withoutSuffix) ? 'néhány másodperc' : 'néhány másodperce';
        case 'm':
            return 'egy' + (isFuture || withoutSuffix ? ' perc' : ' perce');
        case 'mm':
            return num + (isFuture || withoutSuffix ? ' perc' : ' perce');
        case 'h':
            return 'egy' + (isFuture || withoutSuffix ? ' óra' : ' órája');
        case 'hh':
            return num + (isFuture || withoutSuffix ? ' óra' : ' órája');
        case 'd':
            return 'egy' + (isFuture || withoutSuffix ? ' nap' : ' napja');
        case 'dd':
            return num + (isFuture || withoutSuffix ? ' nap' : ' napja');
        case 'M':
            return 'egy' + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
        case 'MM':
            return num + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
        case 'y':
            return 'egy' + (isFuture || withoutSuffix ? ' év' : ' éve');
        case 'yy':
            return num + (isFuture || withoutSuffix ? ' év' : ' éve');
    }
    return '';
}
function week(isFuture) {
    return (isFuture ? '' : '[múlt] ') + '[' + weekEndings[this.day()] + '] LT[-kor]';
}

hooks.defineLocale('hu', {
    months : 'január_február_március_április_május_június_július_augusztus_szeptember_október_november_december'.split('_'),
    monthsShort : 'jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec'.split('_'),
    weekdays : 'vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat'.split('_'),
    weekdaysShort : 'vas_hét_kedd_sze_csüt_pén_szo'.split('_'),
    weekdaysMin : 'v_h_k_sze_cs_p_szo'.split('_'),
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'YYYY.MM.DD.',
        LL : 'YYYY. MMMM D.',
        LLL : 'YYYY. MMMM D. H:mm',
        LLLL : 'YYYY. MMMM D., dddd H:mm'
    },
    meridiemParse: /de|du/i,
    isPM: function (input) {
        return input.charAt(1).toLowerCase() === 'u';
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 12) {
            return isLower === true ? 'de' : 'DE';
        } else {
            return isLower === true ? 'du' : 'DU';
        }
    },
    calendar : {
        sameDay : '[ma] LT[-kor]',
        nextDay : '[holnap] LT[-kor]',
        nextWeek : function () {
            return week.call(this, true);
        },
        lastDay : '[tegnap] LT[-kor]',
        lastWeek : function () {
            return week.call(this, false);
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s múlva',
        past : '%s',
        s : translate$4,
        m : translate$4,
        mm : translate$4,
        h : translate$4,
        hh : translate$4,
        d : translate$4,
        dd : translate$4,
        M : translate$4,
        MM : translate$4,
        y : translate$4,
        yy : translate$4
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Armenian [hy-am]
//! author : Armendarabyan : https://github.com/armendarabyan

hooks.defineLocale('hy-am', {
    months : {
        format: 'հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի'.split('_'),
        standalone: 'հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր'.split('_')
    },
    monthsShort : 'հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ'.split('_'),
    weekdays : 'կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ'.split('_'),
    weekdaysShort : 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
    weekdaysMin : 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY թ.',
        LLL : 'D MMMM YYYY թ., HH:mm',
        LLLL : 'dddd, D MMMM YYYY թ., HH:mm'
    },
    calendar : {
        sameDay: '[այսօր] LT',
        nextDay: '[վաղը] LT',
        lastDay: '[երեկ] LT',
        nextWeek: function () {
            return 'dddd [օրը ժամը] LT';
        },
        lastWeek: function () {
            return '[անցած] dddd [օրը ժամը] LT';
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : '%s հետո',
        past : '%s առաջ',
        s : 'մի քանի վայրկյան',
        m : 'րոպե',
        mm : '%d րոպե',
        h : 'ժամ',
        hh : '%d ժամ',
        d : 'օր',
        dd : '%d օր',
        M : 'ամիս',
        MM : '%d ամիս',
        y : 'տարի',
        yy : '%d տարի'
    },
    meridiemParse: /գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,
    isPM: function (input) {
        return /^(ցերեկվա|երեկոյան)$/.test(input);
    },
    meridiem : function (hour) {
        if (hour < 4) {
            return 'գիշերվա';
        } else if (hour < 12) {
            return 'առավոտվա';
        } else if (hour < 17) {
            return 'ցերեկվա';
        } else {
            return 'երեկոյան';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}|\d{1,2}-(ին|րդ)/,
    ordinal: function (number, period) {
        switch (period) {
            case 'DDD':
            case 'w':
            case 'W':
            case 'DDDo':
                if (number === 1) {
                    return number + '-ին';
                }
                return number + '-րդ';
            default:
                return number;
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Indonesian [id]
//! author : Mohammad Satrio Utomo : https://github.com/tyok
//! reference: http://id.wikisource.org/wiki/Pedoman_Umum_Ejaan_Bahasa_Indonesia_yang_Disempurnakan

hooks.defineLocale('id', {
    months : 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split('_'),
    monthsShort : 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des'.split('_'),
    weekdays : 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'),
    weekdaysShort : 'Min_Sen_Sel_Rab_Kam_Jum_Sab'.split('_'),
    weekdaysMin : 'Mg_Sn_Sl_Rb_Km_Jm_Sb'.split('_'),
    longDateFormat : {
        LT : 'HH.mm',
        LTS : 'HH.mm.ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY [pukul] HH.mm',
        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
    },
    meridiemParse: /pagi|siang|sore|malam/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'pagi') {
            return hour;
        } else if (meridiem === 'siang') {
            return hour >= 11 ? hour : hour + 12;
        } else if (meridiem === 'sore' || meridiem === 'malam') {
            return hour + 12;
        }
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 11) {
            return 'pagi';
        } else if (hours < 15) {
            return 'siang';
        } else if (hours < 19) {
            return 'sore';
        } else {
            return 'malam';
        }
    },
    calendar : {
        sameDay : '[Hari ini pukul] LT',
        nextDay : '[Besok pukul] LT',
        nextWeek : 'dddd [pukul] LT',
        lastDay : '[Kemarin pukul] LT',
        lastWeek : 'dddd [lalu pukul] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dalam %s',
        past : '%s yang lalu',
        s : 'beberapa detik',
        m : 'semenit',
        mm : '%d menit',
        h : 'sejam',
        hh : '%d jam',
        d : 'sehari',
        dd : '%d hari',
        M : 'sebulan',
        MM : '%d bulan',
        y : 'setahun',
        yy : '%d tahun'
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Icelandic [is]
//! author : Hinrik Örn Sigurðsson : https://github.com/hinrik

function plural$2(n) {
    if (n % 100 === 11) {
        return true;
    } else if (n % 10 === 1) {
        return false;
    }
    return true;
}
function translate$5(number, withoutSuffix, key, isFuture) {
    var result = number + ' ';
    switch (key) {
        case 's':
            return withoutSuffix || isFuture ? 'nokkrar sekúndur' : 'nokkrum sekúndum';
        case 'm':
            return withoutSuffix ? 'mínúta' : 'mínútu';
        case 'mm':
            if (plural$2(number)) {
                return result + (withoutSuffix || isFuture ? 'mínútur' : 'mínútum');
            } else if (withoutSuffix) {
                return result + 'mínúta';
            }
            return result + 'mínútu';
        case 'hh':
            if (plural$2(number)) {
                return result + (withoutSuffix || isFuture ? 'klukkustundir' : 'klukkustundum');
            }
            return result + 'klukkustund';
        case 'd':
            if (withoutSuffix) {
                return 'dagur';
            }
            return isFuture ? 'dag' : 'degi';
        case 'dd':
            if (plural$2(number)) {
                if (withoutSuffix) {
                    return result + 'dagar';
                }
                return result + (isFuture ? 'daga' : 'dögum');
            } else if (withoutSuffix) {
                return result + 'dagur';
            }
            return result + (isFuture ? 'dag' : 'degi');
        case 'M':
            if (withoutSuffix) {
                return 'mánuður';
            }
            return isFuture ? 'mánuð' : 'mánuði';
        case 'MM':
            if (plural$2(number)) {
                if (withoutSuffix) {
                    return result + 'mánuðir';
                }
                return result + (isFuture ? 'mánuði' : 'mánuðum');
            } else if (withoutSuffix) {
                return result + 'mánuður';
            }
            return result + (isFuture ? 'mánuð' : 'mánuði');
        case 'y':
            return withoutSuffix || isFuture ? 'ár' : 'ári';
        case 'yy':
            if (plural$2(number)) {
                return result + (withoutSuffix || isFuture ? 'ár' : 'árum');
            }
            return result + (withoutSuffix || isFuture ? 'ár' : 'ári');
    }
}

hooks.defineLocale('is', {
    months : 'janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember'.split('_'),
    monthsShort : 'jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des'.split('_'),
    weekdays : 'sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur'.split('_'),
    weekdaysShort : 'sun_mán_þri_mið_fim_fös_lau'.split('_'),
    weekdaysMin : 'Su_Má_Þr_Mi_Fi_Fö_La'.split('_'),
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY [kl.] H:mm',
        LLLL : 'dddd, D. MMMM YYYY [kl.] H:mm'
    },
    calendar : {
        sameDay : '[í dag kl.] LT',
        nextDay : '[á morgun kl.] LT',
        nextWeek : 'dddd [kl.] LT',
        lastDay : '[í gær kl.] LT',
        lastWeek : '[síðasta] dddd [kl.] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'eftir %s',
        past : 'fyrir %s síðan',
        s : translate$5,
        m : translate$5,
        mm : translate$5,
        h : 'klukkustund',
        hh : translate$5,
        d : translate$5,
        dd : translate$5,
        M : translate$5,
        MM : translate$5,
        y : translate$5,
        yy : translate$5
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Italian [it]
//! author : Lorenzo : https://github.com/aliem
//! author: Mattia Larentis: https://github.com/nostalgiaz

hooks.defineLocale('it', {
    months : 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split('_'),
    monthsShort : 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
    weekdays : 'domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato'.split('_'),
    weekdaysShort : 'dom_lun_mar_mer_gio_ven_sab'.split('_'),
    weekdaysMin : 'do_lu_ma_me_gi_ve_sa'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[Oggi alle] LT',
        nextDay: '[Domani alle] LT',
        nextWeek: 'dddd [alle] LT',
        lastDay: '[Ieri alle] LT',
        lastWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[la scorsa] dddd [alle] LT';
                default:
                    return '[lo scorso] dddd [alle] LT';
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : function (s) {
            return ((/^[0-9].+$/).test(s) ? 'tra' : 'in') + ' ' + s;
        },
        past : '%s fa',
        s : 'alcuni secondi',
        m : 'un minuto',
        mm : '%d minuti',
        h : 'un\'ora',
        hh : '%d ore',
        d : 'un giorno',
        dd : '%d giorni',
        M : 'un mese',
        MM : '%d mesi',
        y : 'un anno',
        yy : '%d anni'
    },
    dayOfMonthOrdinalParse : /\d{1,2}º/,
    ordinal: '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Japanese [ja]
//! author : LI Long : https://github.com/baryon

hooks.defineLocale('ja', {
    months : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays : '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
    weekdaysShort : '日_月_火_水_木_金_土'.split('_'),
    weekdaysMin : '日_月_火_水_木_金_土'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY/MM/DD',
        LL : 'YYYY年M月D日',
        LLL : 'YYYY年M月D日 HH:mm',
        LLLL : 'YYYY年M月D日 HH:mm dddd',
        l : 'YYYY/MM/DD',
        ll : 'YYYY年M月D日',
        lll : 'YYYY年M月D日 HH:mm',
        llll : 'YYYY年M月D日 HH:mm dddd'
    },
    meridiemParse: /午前|午後/i,
    isPM : function (input) {
        return input === '午後';
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return '午前';
        } else {
            return '午後';
        }
    },
    calendar : {
        sameDay : '[今日] LT',
        nextDay : '[明日] LT',
        nextWeek : '[来週]dddd LT',
        lastDay : '[昨日] LT',
        lastWeek : '[前週]dddd LT',
        sameElse : 'L'
    },
    dayOfMonthOrdinalParse : /\d{1,2}日/,
    ordinal : function (number, period) {
        switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return number + '日';
            default:
                return number;
        }
    },
    relativeTime : {
        future : '%s後',
        past : '%s前',
        s : '数秒',
        m : '1分',
        mm : '%d分',
        h : '1時間',
        hh : '%d時間',
        d : '1日',
        dd : '%d日',
        M : '1ヶ月',
        MM : '%dヶ月',
        y : '1年',
        yy : '%d年'
    }
});

//! moment.js locale configuration
//! locale : Javanese [jv]
//! author : Rony Lantip : https://github.com/lantip
//! reference: http://jv.wikipedia.org/wiki/Basa_Jawa

hooks.defineLocale('jv', {
    months : 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember'.split('_'),
    monthsShort : 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des'.split('_'),
    weekdays : 'Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu'.split('_'),
    weekdaysShort : 'Min_Sen_Sel_Reb_Kem_Jem_Sep'.split('_'),
    weekdaysMin : 'Mg_Sn_Sl_Rb_Km_Jm_Sp'.split('_'),
    longDateFormat : {
        LT : 'HH.mm',
        LTS : 'HH.mm.ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY [pukul] HH.mm',
        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
    },
    meridiemParse: /enjing|siyang|sonten|ndalu/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'enjing') {
            return hour;
        } else if (meridiem === 'siyang') {
            return hour >= 11 ? hour : hour + 12;
        } else if (meridiem === 'sonten' || meridiem === 'ndalu') {
            return hour + 12;
        }
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 11) {
            return 'enjing';
        } else if (hours < 15) {
            return 'siyang';
        } else if (hours < 19) {
            return 'sonten';
        } else {
            return 'ndalu';
        }
    },
    calendar : {
        sameDay : '[Dinten puniko pukul] LT',
        nextDay : '[Mbenjang pukul] LT',
        nextWeek : 'dddd [pukul] LT',
        lastDay : '[Kala wingi pukul] LT',
        lastWeek : 'dddd [kepengker pukul] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'wonten ing %s',
        past : '%s ingkang kepengker',
        s : 'sawetawis detik',
        m : 'setunggal menit',
        mm : '%d menit',
        h : 'setunggal jam',
        hh : '%d jam',
        d : 'sedinten',
        dd : '%d dinten',
        M : 'sewulan',
        MM : '%d wulan',
        y : 'setaun',
        yy : '%d taun'
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Georgian [ka]
//! author : Irakli Janiashvili : https://github.com/irakli-janiashvili

hooks.defineLocale('ka', {
    months : {
        standalone: 'იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი'.split('_'),
        format: 'იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს'.split('_')
    },
    monthsShort : 'იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ'.split('_'),
    weekdays : {
        standalone: 'კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი'.split('_'),
        format: 'კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს'.split('_'),
        isFormat: /(წინა|შემდეგ)/
    },
    weekdaysShort : 'კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ'.split('_'),
    weekdaysMin : 'კვ_ორ_სა_ოთ_ხუ_პა_შა'.split('_'),
    longDateFormat : {
        LT : 'h:mm A',
        LTS : 'h:mm:ss A',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY h:mm A',
        LLLL : 'dddd, D MMMM YYYY h:mm A'
    },
    calendar : {
        sameDay : '[დღეს] LT[-ზე]',
        nextDay : '[ხვალ] LT[-ზე]',
        lastDay : '[გუშინ] LT[-ზე]',
        nextWeek : '[შემდეგ] dddd LT[-ზე]',
        lastWeek : '[წინა] dddd LT-ზე',
        sameElse : 'L'
    },
    relativeTime : {
        future : function (s) {
            return (/(წამი|წუთი|საათი|წელი)/).test(s) ?
                s.replace(/ი$/, 'ში') :
                s + 'ში';
        },
        past : function (s) {
            if ((/(წამი|წუთი|საათი|დღე|თვე)/).test(s)) {
                return s.replace(/(ი|ე)$/, 'ის უკან');
            }
            if ((/წელი/).test(s)) {
                return s.replace(/წელი$/, 'წლის უკან');
            }
        },
        s : 'რამდენიმე წამი',
        m : 'წუთი',
        mm : '%d წუთი',
        h : 'საათი',
        hh : '%d საათი',
        d : 'დღე',
        dd : '%d დღე',
        M : 'თვე',
        MM : '%d თვე',
        y : 'წელი',
        yy : '%d წელი'
    },
    dayOfMonthOrdinalParse: /0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,
    ordinal : function (number) {
        if (number === 0) {
            return number;
        }
        if (number === 1) {
            return number + '-ლი';
        }
        if ((number < 20) || (number <= 100 && (number % 20 === 0)) || (number % 100 === 0)) {
            return 'მე-' + number;
        }
        return number + '-ე';
    },
    week : {
        dow : 1,
        doy : 7
    }
});

//! moment.js locale configuration
//! locale : Kazakh [kk]
//! authors : Nurlan Rakhimzhanov : https://github.com/nurlan

var suffixes$1 = {
    0: '-ші',
    1: '-ші',
    2: '-ші',
    3: '-ші',
    4: '-ші',
    5: '-ші',
    6: '-шы',
    7: '-ші',
    8: '-ші',
    9: '-шы',
    10: '-шы',
    20: '-шы',
    30: '-шы',
    40: '-шы',
    50: '-ші',
    60: '-шы',
    70: '-ші',
    80: '-ші',
    90: '-шы',
    100: '-ші'
};

hooks.defineLocale('kk', {
    months : 'қаңтар_ақпан_наурыз_сәуір_мамыр_маусым_шілде_тамыз_қыркүйек_қазан_қараша_желтоқсан'.split('_'),
    monthsShort : 'қаң_ақп_нау_сәу_мам_мау_шіл_там_қыр_қаз_қар_жел'.split('_'),
    weekdays : 'жексенбі_дүйсенбі_сейсенбі_сәрсенбі_бейсенбі_жұма_сенбі'.split('_'),
    weekdaysShort : 'жек_дүй_сей_сәр_бей_жұм_сен'.split('_'),
    weekdaysMin : 'жк_дй_сй_ср_бй_жм_сн'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Бүгін сағат] LT',
        nextDay : '[Ертең сағат] LT',
        nextWeek : 'dddd [сағат] LT',
        lastDay : '[Кеше сағат] LT',
        lastWeek : '[Өткен аптаның] dddd [сағат] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s ішінде',
        past : '%s бұрын',
        s : 'бірнеше секунд',
        m : 'бір минут',
        mm : '%d минут',
        h : 'бір сағат',
        hh : '%d сағат',
        d : 'бір күн',
        dd : '%d күн',
        M : 'бір ай',
        MM : '%d ай',
        y : 'бір жыл',
        yy : '%d жыл'
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(ші|шы)/,
    ordinal : function (number) {
        var a = number % 10,
            b = number >= 100 ? 100 : null;
        return number + (suffixes$1[number] || suffixes$1[a] || suffixes$1[b]);
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Cambodian [km]
//! author : Kruy Vanna : https://github.com/kruyvanna

hooks.defineLocale('km', {
    months: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
    monthsShort: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
    weekdays: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
    weekdaysShort: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
    weekdaysMin: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS : 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd, D MMMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[ថ្ងៃនេះ ម៉ោង] LT',
        nextDay: '[ស្អែក ម៉ោង] LT',
        nextWeek: 'dddd [ម៉ោង] LT',
        lastDay: '[ម្សិលមិញ ម៉ោង] LT',
        lastWeek: 'dddd [សប្តាហ៍មុន] [ម៉ោង] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: '%sទៀត',
        past: '%sមុន',
        s: 'ប៉ុន្មានវិនាទី',
        m: 'មួយនាទី',
        mm: '%d នាទី',
        h: 'មួយម៉ោង',
        hh: '%d ម៉ោង',
        d: 'មួយថ្ងៃ',
        dd: '%d ថ្ងៃ',
        M: 'មួយខែ',
        MM: '%d ខែ',
        y: 'មួយឆ្នាំ',
        yy: '%d ឆ្នាំ'
    },
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Kannada [kn]
//! author : Rajeev Naik : https://github.com/rajeevnaikte

var symbolMap$8 = {
    '1': '೧',
    '2': '೨',
    '3': '೩',
    '4': '೪',
    '5': '೫',
    '6': '೬',
    '7': '೭',
    '8': '೮',
    '9': '೯',
    '0': '೦'
};
var numberMap$7 = {
    '೧': '1',
    '೨': '2',
    '೩': '3',
    '೪': '4',
    '೫': '5',
    '೬': '6',
    '೭': '7',
    '೮': '8',
    '೯': '9',
    '೦': '0'
};

hooks.defineLocale('kn', {
    months : 'ಜನವರಿ_ಫೆಬ್ರವರಿ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬರ್_ಅಕ್ಟೋಬರ್_ನವೆಂಬರ್_ಡಿಸೆಂಬರ್'.split('_'),
    monthsShort : 'ಜನ_ಫೆಬ್ರ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬ_ಅಕ್ಟೋಬ_ನವೆಂಬ_ಡಿಸೆಂಬ'.split('_'),
    monthsParseExact: true,
    weekdays : 'ಭಾನುವಾರ_ಸೋಮವಾರ_ಮಂಗಳವಾರ_ಬುಧವಾರ_ಗುರುವಾರ_ಶುಕ್ರವಾರ_ಶನಿವಾರ'.split('_'),
    weekdaysShort : 'ಭಾನು_ಸೋಮ_ಮಂಗಳ_ಬುಧ_ಗುರು_ಶುಕ್ರ_ಶನಿ'.split('_'),
    weekdaysMin : 'ಭಾ_ಸೋ_ಮಂ_ಬು_ಗು_ಶು_ಶ'.split('_'),
    longDateFormat : {
        LT : 'A h:mm',
        LTS : 'A h:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, A h:mm',
        LLLL : 'dddd, D MMMM YYYY, A h:mm'
    },
    calendar : {
        sameDay : '[ಇಂದು] LT',
        nextDay : '[ನಾಳೆ] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[ನಿನ್ನೆ] LT',
        lastWeek : '[ಕೊನೆಯ] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s ನಂತರ',
        past : '%s ಹಿಂದೆ',
        s : 'ಕೆಲವು ಕ್ಷಣಗಳು',
        m : 'ಒಂದು ನಿಮಿಷ',
        mm : '%d ನಿಮಿಷ',
        h : 'ಒಂದು ಗಂಟೆ',
        hh : '%d ಗಂಟೆ',
        d : 'ಒಂದು ದಿನ',
        dd : '%d ದಿನ',
        M : 'ಒಂದು ತಿಂಗಳು',
        MM : '%d ತಿಂಗಳು',
        y : 'ಒಂದು ವರ್ಷ',
        yy : '%d ವರ್ಷ'
    },
    preparse: function (string) {
        return string.replace(/[೧೨೩೪೫೬೭೮೯೦]/g, function (match) {
            return numberMap$7[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap$8[match];
        });
    },
    meridiemParse: /ರಾತ್ರಿ|ಬೆಳಿಗ್ಗೆ|ಮಧ್ಯಾಹ್ನ|ಸಂಜೆ/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'ರಾತ್ರಿ') {
            return hour < 4 ? hour : hour + 12;
        } else if (meridiem === 'ಬೆಳಿಗ್ಗೆ') {
            return hour;
        } else if (meridiem === 'ಮಧ್ಯಾಹ್ನ') {
            return hour >= 10 ? hour : hour + 12;
        } else if (meridiem === 'ಸಂಜೆ') {
            return hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'ರಾತ್ರಿ';
        } else if (hour < 10) {
            return 'ಬೆಳಿಗ್ಗೆ';
        } else if (hour < 17) {
            return 'ಮಧ್ಯಾಹ್ನ';
        } else if (hour < 20) {
            return 'ಸಂಜೆ';
        } else {
            return 'ರಾತ್ರಿ';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}(ನೇ)/,
    ordinal : function (number) {
        return number + 'ನೇ';
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Korean [ko]
//! author : Kyungwook, Park : https://github.com/kyungw00k
//! author : Jeeeyul Lee <jeeeyul@gmail.com>

hooks.defineLocale('ko', {
    months : '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
    monthsShort : '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
    weekdays : '일요일_월요일_화요일_수요일_목요일_금요일_토요일'.split('_'),
    weekdaysShort : '일_월_화_수_목_금_토'.split('_'),
    weekdaysMin : '일_월_화_수_목_금_토'.split('_'),
    longDateFormat : {
        LT : 'A h:mm',
        LTS : 'A h:mm:ss',
        L : 'YYYY.MM.DD',
        LL : 'YYYY년 MMMM D일',
        LLL : 'YYYY년 MMMM D일 A h:mm',
        LLLL : 'YYYY년 MMMM D일 dddd A h:mm',
        l : 'YYYY.MM.DD',
        ll : 'YYYY년 MMMM D일',
        lll : 'YYYY년 MMMM D일 A h:mm',
        llll : 'YYYY년 MMMM D일 dddd A h:mm'
    },
    calendar : {
        sameDay : '오늘 LT',
        nextDay : '내일 LT',
        nextWeek : 'dddd LT',
        lastDay : '어제 LT',
        lastWeek : '지난주 dddd LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s 후',
        past : '%s 전',
        s : '몇 초',
        ss : '%d초',
        m : '1분',
        mm : '%d분',
        h : '한 시간',
        hh : '%d시간',
        d : '하루',
        dd : '%d일',
        M : '한 달',
        MM : '%d달',
        y : '일 년',
        yy : '%d년'
    },
    dayOfMonthOrdinalParse : /\d{1,2}(일|월|주)/,
    ordinal : function (number, period) {
        switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return number + '일';
            case 'M':
                return number + '월';
            case 'w':
            case 'W':
                return number + '주';
            default:
                return number;
        }
    },
    meridiemParse : /오전|오후/,
    isPM : function (token) {
        return token === '오후';
    },
    meridiem : function (hour, minute, isUpper) {
        return hour < 12 ? '오전' : '오후';
    }
});

//! moment.js locale configuration
//! locale : Kyrgyz [ky]
//! author : Chyngyz Arystan uulu : https://github.com/chyngyz


var suffixes$2 = {
    0: '-чү',
    1: '-чи',
    2: '-чи',
    3: '-чү',
    4: '-чү',
    5: '-чи',
    6: '-чы',
    7: '-чи',
    8: '-чи',
    9: '-чу',
    10: '-чу',
    20: '-чы',
    30: '-чу',
    40: '-чы',
    50: '-чү',
    60: '-чы',
    70: '-чи',
    80: '-чи',
    90: '-чу',
    100: '-чү'
};

hooks.defineLocale('ky', {
    months : 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
    monthsShort : 'янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split('_'),
    weekdays : 'Жекшемби_Дүйшөмбү_Шейшемби_Шаршемби_Бейшемби_Жума_Ишемби'.split('_'),
    weekdaysShort : 'Жек_Дүй_Шей_Шар_Бей_Жум_Ише'.split('_'),
    weekdaysMin : 'Жк_Дй_Шй_Шр_Бй_Жм_Иш'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Бүгүн саат] LT',
        nextDay : '[Эртең саат] LT',
        nextWeek : 'dddd [саат] LT',
        lastDay : '[Кече саат] LT',
        lastWeek : '[Өткен аптанын] dddd [күнү] [саат] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s ичинде',
        past : '%s мурун',
        s : 'бирнече секунд',
        m : 'бир мүнөт',
        mm : '%d мүнөт',
        h : 'бир саат',
        hh : '%d саат',
        d : 'бир күн',
        dd : '%d күн',
        M : 'бир ай',
        MM : '%d ай',
        y : 'бир жыл',
        yy : '%d жыл'
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(чи|чы|чү|чу)/,
    ordinal : function (number) {
        var a = number % 10,
            b = number >= 100 ? 100 : null;
        return number + (suffixes$2[number] || suffixes$2[a] || suffixes$2[b]);
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Luxembourgish [lb]
//! author : mweimerskirch : https://github.com/mweimerskirch
//! author : David Raison : https://github.com/kwisatz

function processRelativeTime$5(number, withoutSuffix, key, isFuture) {
    var format = {
        'm': ['eng Minutt', 'enger Minutt'],
        'h': ['eng Stonn', 'enger Stonn'],
        'd': ['een Dag', 'engem Dag'],
        'M': ['ee Mount', 'engem Mount'],
        'y': ['ee Joer', 'engem Joer']
    };
    return withoutSuffix ? format[key][0] : format[key][1];
}
function processFutureTime(string) {
    var number = string.substr(0, string.indexOf(' '));
    if (eifelerRegelAppliesToNumber(number)) {
        return 'a ' + string;
    }
    return 'an ' + string;
}
function processPastTime(string) {
    var number = string.substr(0, string.indexOf(' '));
    if (eifelerRegelAppliesToNumber(number)) {
        return 'viru ' + string;
    }
    return 'virun ' + string;
}
/**
 * Returns true if the word before the given number loses the '-n' ending.
 * e.g. 'an 10 Deeg' but 'a 5 Deeg'
 *
 * @param number {integer}
 * @returns {boolean}
 */
function eifelerRegelAppliesToNumber(number) {
    number = parseInt(number, 10);
    if (isNaN(number)) {
        return false;
    }
    if (number < 0) {
        // Negative Number --> always true
        return true;
    } else if (number < 10) {
        // Only 1 digit
        if (4 <= number && number <= 7) {
            return true;
        }
        return false;
    } else if (number < 100) {
        // 2 digits
        var lastDigit = number % 10, firstDigit = number / 10;
        if (lastDigit === 0) {
            return eifelerRegelAppliesToNumber(firstDigit);
        }
        return eifelerRegelAppliesToNumber(lastDigit);
    } else if (number < 10000) {
        // 3 or 4 digits --> recursively check first digit
        while (number >= 10) {
            number = number / 10;
        }
        return eifelerRegelAppliesToNumber(number);
    } else {
        // Anything larger than 4 digits: recursively check first n-3 digits
        number = number / 1000;
        return eifelerRegelAppliesToNumber(number);
    }
}

hooks.defineLocale('lb', {
    months: 'Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
    monthsShort: 'Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
    monthsParseExact : true,
    weekdays: 'Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg'.split('_'),
    weekdaysShort: 'So._Mé._Dë._Më._Do._Fr._Sa.'.split('_'),
    weekdaysMin: 'So_Mé_Dë_Më_Do_Fr_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat: {
        LT: 'H:mm [Auer]',
        LTS: 'H:mm:ss [Auer]',
        L: 'DD.MM.YYYY',
        LL: 'D. MMMM YYYY',
        LLL: 'D. MMMM YYYY H:mm [Auer]',
        LLLL: 'dddd, D. MMMM YYYY H:mm [Auer]'
    },
    calendar: {
        sameDay: '[Haut um] LT',
        sameElse: 'L',
        nextDay: '[Muer um] LT',
        nextWeek: 'dddd [um] LT',
        lastDay: '[Gëschter um] LT',
        lastWeek: function () {
            // Different date string for 'Dënschdeg' (Tuesday) and 'Donneschdeg' (Thursday) due to phonological rule
            switch (this.day()) {
                case 2:
                case 4:
                    return '[Leschten] dddd [um] LT';
                default:
                    return '[Leschte] dddd [um] LT';
            }
        }
    },
    relativeTime : {
        future : processFutureTime,
        past : processPastTime,
        s : 'e puer Sekonnen',
        m : processRelativeTime$5,
        mm : '%d Minutten',
        h : processRelativeTime$5,
        hh : '%d Stonnen',
        d : processRelativeTime$5,
        dd : '%d Deeg',
        M : processRelativeTime$5,
        MM : '%d Méint',
        y : processRelativeTime$5,
        yy : '%d Joer'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal: '%d.',
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Lao [lo]
//! author : Ryan Hart : https://github.com/ryanhart2

hooks.defineLocale('lo', {
    months : 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
    monthsShort : 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
    weekdays : 'ອາທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
    weekdaysShort : 'ທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
    weekdaysMin : 'ທ_ຈ_ອຄ_ພ_ພຫ_ສກ_ສ'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'ວັນdddd D MMMM YYYY HH:mm'
    },
    meridiemParse: /ຕອນເຊົ້າ|ຕອນແລງ/,
    isPM: function (input) {
        return input === 'ຕອນແລງ';
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'ຕອນເຊົ້າ';
        } else {
            return 'ຕອນແລງ';
        }
    },
    calendar : {
        sameDay : '[ມື້ນີ້ເວລາ] LT',
        nextDay : '[ມື້ອື່ນເວລາ] LT',
        nextWeek : '[ວັນ]dddd[ໜ້າເວລາ] LT',
        lastDay : '[ມື້ວານນີ້ເວລາ] LT',
        lastWeek : '[ວັນ]dddd[ແລ້ວນີ້ເວລາ] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'ອີກ %s',
        past : '%sຜ່ານມາ',
        s : 'ບໍ່ເທົ່າໃດວິນາທີ',
        m : '1 ນາທີ',
        mm : '%d ນາທີ',
        h : '1 ຊົ່ວໂມງ',
        hh : '%d ຊົ່ວໂມງ',
        d : '1 ມື້',
        dd : '%d ມື້',
        M : '1 ເດືອນ',
        MM : '%d ເດືອນ',
        y : '1 ປີ',
        yy : '%d ປີ'
    },
    dayOfMonthOrdinalParse: /(ທີ່)\d{1,2}/,
    ordinal : function (number) {
        return 'ທີ່' + number;
    }
});

//! moment.js locale configuration
//! locale : Lithuanian [lt]
//! author : Mindaugas Mozūras : https://github.com/mmozuras

var units = {
    'm' : 'minutė_minutės_minutę',
    'mm': 'minutės_minučių_minutes',
    'h' : 'valanda_valandos_valandą',
    'hh': 'valandos_valandų_valandas',
    'd' : 'diena_dienos_dieną',
    'dd': 'dienos_dienų_dienas',
    'M' : 'mėnuo_mėnesio_mėnesį',
    'MM': 'mėnesiai_mėnesių_mėnesius',
    'y' : 'metai_metų_metus',
    'yy': 'metai_metų_metus'
};
function translateSeconds(number, withoutSuffix, key, isFuture) {
    if (withoutSuffix) {
        return 'kelios sekundės';
    } else {
        return isFuture ? 'kelių sekundžių' : 'kelias sekundes';
    }
}
function translateSingular(number, withoutSuffix, key, isFuture) {
    return withoutSuffix ? forms(key)[0] : (isFuture ? forms(key)[1] : forms(key)[2]);
}
function special(number) {
    return number % 10 === 0 || (number > 10 && number < 20);
}
function forms(key) {
    return units[key].split('_');
}
function translate$6(number, withoutSuffix, key, isFuture) {
    var result = number + ' ';
    if (number === 1) {
        return result + translateSingular(number, withoutSuffix, key[0], isFuture);
    } else if (withoutSuffix) {
        return result + (special(number) ? forms(key)[1] : forms(key)[0]);
    } else {
        if (isFuture) {
            return result + forms(key)[1];
        } else {
            return result + (special(number) ? forms(key)[1] : forms(key)[2]);
        }
    }
}
hooks.defineLocale('lt', {
    months : {
        format: 'sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio'.split('_'),
        standalone: 'sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis'.split('_'),
        isFormat: /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?|MMMM?(\[[^\[\]]*\]|\s)+D[oD]?/
    },
    monthsShort : 'sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd'.split('_'),
    weekdays : {
        format: 'sekmadienį_pirmadienį_antradienį_trečiadienį_ketvirtadienį_penktadienį_šeštadienį'.split('_'),
        standalone: 'sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis'.split('_'),
        isFormat: /dddd HH:mm/
    },
    weekdaysShort : 'Sek_Pir_Ant_Tre_Ket_Pen_Šeš'.split('_'),
    weekdaysMin : 'S_P_A_T_K_Pn_Š'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY-MM-DD',
        LL : 'YYYY [m.] MMMM D [d.]',
        LLL : 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
        LLLL : 'YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]',
        l : 'YYYY-MM-DD',
        ll : 'YYYY [m.] MMMM D [d.]',
        lll : 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
        llll : 'YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]'
    },
    calendar : {
        sameDay : '[Šiandien] LT',
        nextDay : '[Rytoj] LT',
        nextWeek : 'dddd LT',
        lastDay : '[Vakar] LT',
        lastWeek : '[Praėjusį] dddd LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'po %s',
        past : 'prieš %s',
        s : translateSeconds,
        m : translateSingular,
        mm : translate$6,
        h : translateSingular,
        hh : translate$6,
        d : translateSingular,
        dd : translate$6,
        M : translateSingular,
        MM : translate$6,
        y : translateSingular,
        yy : translate$6
    },
    dayOfMonthOrdinalParse: /\d{1,2}-oji/,
    ordinal : function (number) {
        return number + '-oji';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Latvian [lv]
//! author : Kristaps Karlsons : https://github.com/skakri
//! author : Jānis Elmeris : https://github.com/JanisE

var units$1 = {
    'm': 'minūtes_minūtēm_minūte_minūtes'.split('_'),
    'mm': 'minūtes_minūtēm_minūte_minūtes'.split('_'),
    'h': 'stundas_stundām_stunda_stundas'.split('_'),
    'hh': 'stundas_stundām_stunda_stundas'.split('_'),
    'd': 'dienas_dienām_diena_dienas'.split('_'),
    'dd': 'dienas_dienām_diena_dienas'.split('_'),
    'M': 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
    'MM': 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
    'y': 'gada_gadiem_gads_gadi'.split('_'),
    'yy': 'gada_gadiem_gads_gadi'.split('_')
};
/**
 * @param withoutSuffix boolean true = a length of time; false = before/after a period of time.
 */
function format$1(forms, number, withoutSuffix) {
    if (withoutSuffix) {
        // E.g. "21 minūte", "3 minūtes".
        return number % 10 === 1 && number % 100 !== 11 ? forms[2] : forms[3];
    } else {
        // E.g. "21 minūtes" as in "pēc 21 minūtes".
        // E.g. "3 minūtēm" as in "pēc 3 minūtēm".
        return number % 10 === 1 && number % 100 !== 11 ? forms[0] : forms[1];
    }
}
function relativeTimeWithPlural$1(number, withoutSuffix, key) {
    return number + ' ' + format$1(units$1[key], number, withoutSuffix);
}
function relativeTimeWithSingular(number, withoutSuffix, key) {
    return format$1(units$1[key], number, withoutSuffix);
}
function relativeSeconds(number, withoutSuffix) {
    return withoutSuffix ? 'dažas sekundes' : 'dažām sekundēm';
}

hooks.defineLocale('lv', {
    months : 'janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris'.split('_'),
    monthsShort : 'jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec'.split('_'),
    weekdays : 'svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena'.split('_'),
    weekdaysShort : 'Sv_P_O_T_C_Pk_S'.split('_'),
    weekdaysMin : 'Sv_P_O_T_C_Pk_S'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY.',
        LL : 'YYYY. [gada] D. MMMM',
        LLL : 'YYYY. [gada] D. MMMM, HH:mm',
        LLLL : 'YYYY. [gada] D. MMMM, dddd, HH:mm'
    },
    calendar : {
        sameDay : '[Šodien pulksten] LT',
        nextDay : '[Rīt pulksten] LT',
        nextWeek : 'dddd [pulksten] LT',
        lastDay : '[Vakar pulksten] LT',
        lastWeek : '[Pagājušā] dddd [pulksten] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'pēc %s',
        past : 'pirms %s',
        s : relativeSeconds,
        m : relativeTimeWithSingular,
        mm : relativeTimeWithPlural$1,
        h : relativeTimeWithSingular,
        hh : relativeTimeWithPlural$1,
        d : relativeTimeWithSingular,
        dd : relativeTimeWithPlural$1,
        M : relativeTimeWithSingular,
        MM : relativeTimeWithPlural$1,
        y : relativeTimeWithSingular,
        yy : relativeTimeWithPlural$1
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Montenegrin [me]
//! author : Miodrag Nikač <miodrag@restartit.me> : https://github.com/miodragnikac

var translator = {
    words: { //Different grammatical cases
        m: ['jedan minut', 'jednog minuta'],
        mm: ['minut', 'minuta', 'minuta'],
        h: ['jedan sat', 'jednog sata'],
        hh: ['sat', 'sata', 'sati'],
        dd: ['dan', 'dana', 'dana'],
        MM: ['mjesec', 'mjeseca', 'mjeseci'],
        yy: ['godina', 'godine', 'godina']
    },
    correctGrammaticalCase: function (number, wordKey) {
        return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
    },
    translate: function (number, withoutSuffix, key) {
        var wordKey = translator.words[key];
        if (key.length === 1) {
            return withoutSuffix ? wordKey[0] : wordKey[1];
        } else {
            return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
        }
    }
};

hooks.defineLocale('me', {
    months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
    monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
    monthsParseExact : true,
    weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
    weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
    weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
    weekdaysParseExact : true,
    longDateFormat: {
        LT: 'H:mm',
        LTS : 'H:mm:ss',
        L: 'DD.MM.YYYY',
        LL: 'D. MMMM YYYY',
        LLL: 'D. MMMM YYYY H:mm',
        LLLL: 'dddd, D. MMMM YYYY H:mm'
    },
    calendar: {
        sameDay: '[danas u] LT',
        nextDay: '[sjutra u] LT',

        nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[u] [nedjelju] [u] LT';
                case 3:
                    return '[u] [srijedu] [u] LT';
                case 6:
                    return '[u] [subotu] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[u] dddd [u] LT';
            }
        },
        lastDay  : '[juče u] LT',
        lastWeek : function () {
            var lastWeekDays = [
                '[prošle] [nedjelje] [u] LT',
                '[prošlog] [ponedjeljka] [u] LT',
                '[prošlog] [utorka] [u] LT',
                '[prošle] [srijede] [u] LT',
                '[prošlog] [četvrtka] [u] LT',
                '[prošlog] [petka] [u] LT',
                '[prošle] [subote] [u] LT'
            ];
            return lastWeekDays[this.day()];
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'za %s',
        past   : 'prije %s',
        s      : 'nekoliko sekundi',
        m      : translator.translate,
        mm     : translator.translate,
        h      : translator.translate,
        hh     : translator.translate,
        d      : 'dan',
        dd     : translator.translate,
        M      : 'mjesec',
        MM     : translator.translate,
        y      : 'godinu',
        yy     : translator.translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Maori [mi]
//! author : John Corrigan <robbiecloset@gmail.com> : https://github.com/johnideal

hooks.defineLocale('mi', {
    months: 'Kohi-tāte_Hui-tanguru_Poutū-te-rangi_Paenga-whāwhā_Haratua_Pipiri_Hōngoingoi_Here-turi-kōkā_Mahuru_Whiringa-ā-nuku_Whiringa-ā-rangi_Hakihea'.split('_'),
    monthsShort: 'Kohi_Hui_Pou_Pae_Hara_Pipi_Hōngoi_Here_Mahu_Whi-nu_Whi-ra_Haki'.split('_'),
    monthsRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
    monthsStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
    monthsShortRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
    monthsShortStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,2}/i,
    weekdays: 'Rātapu_Mane_Tūrei_Wenerei_Tāite_Paraire_Hātarei'.split('_'),
    weekdaysShort: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
    weekdaysMin: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY [i] HH:mm',
        LLLL: 'dddd, D MMMM YYYY [i] HH:mm'
    },
    calendar: {
        sameDay: '[i teie mahana, i] LT',
        nextDay: '[apopo i] LT',
        nextWeek: 'dddd [i] LT',
        lastDay: '[inanahi i] LT',
        lastWeek: 'dddd [whakamutunga i] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'i roto i %s',
        past: '%s i mua',
        s: 'te hēkona ruarua',
        m: 'he meneti',
        mm: '%d meneti',
        h: 'te haora',
        hh: '%d haora',
        d: 'he ra',
        dd: '%d ra',
        M: 'he marama',
        MM: '%d marama',
        y: 'he tau',
        yy: '%d tau'
    },
    dayOfMonthOrdinalParse: /\d{1,2}º/,
    ordinal: '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Macedonian [mk]
//! author : Borislav Mickov : https://github.com/B0k0

hooks.defineLocale('mk', {
    months : 'јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември'.split('_'),
    monthsShort : 'јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек'.split('_'),
    weekdays : 'недела_понеделник_вторник_среда_четврток_петок_сабота'.split('_'),
    weekdaysShort : 'нед_пон_вто_сре_чет_пет_саб'.split('_'),
    weekdaysMin : 'нe_пo_вт_ср_че_пе_сa'.split('_'),
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'D.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY H:mm',
        LLLL : 'dddd, D MMMM YYYY H:mm'
    },
    calendar : {
        sameDay : '[Денес во] LT',
        nextDay : '[Утре во] LT',
        nextWeek : '[Во] dddd [во] LT',
        lastDay : '[Вчера во] LT',
        lastWeek : function () {
            switch (this.day()) {
                case 0:
                case 3:
                case 6:
                    return '[Изминатата] dddd [во] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[Изминатиот] dddd [во] LT';
            }
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'после %s',
        past : 'пред %s',
        s : 'неколку секунди',
        m : 'минута',
        mm : '%d минути',
        h : 'час',
        hh : '%d часа',
        d : 'ден',
        dd : '%d дена',
        M : 'месец',
        MM : '%d месеци',
        y : 'година',
        yy : '%d години'
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
    ordinal : function (number) {
        var lastDigit = number % 10,
            last2Digits = number % 100;
        if (number === 0) {
            return number + '-ев';
        } else if (last2Digits === 0) {
            return number + '-ен';
        } else if (last2Digits > 10 && last2Digits < 20) {
            return number + '-ти';
        } else if (lastDigit === 1) {
            return number + '-ви';
        } else if (lastDigit === 2) {
            return number + '-ри';
        } else if (lastDigit === 7 || lastDigit === 8) {
            return number + '-ми';
        } else {
            return number + '-ти';
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Malayalam [ml]
//! author : Floyd Pink : https://github.com/floydpink

hooks.defineLocale('ml', {
    months : 'ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ'.split('_'),
    monthsShort : 'ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.'.split('_'),
    monthsParseExact : true,
    weekdays : 'ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച'.split('_'),
    weekdaysShort : 'ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി'.split('_'),
    weekdaysMin : 'ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ'.split('_'),
    longDateFormat : {
        LT : 'A h:mm -നു',
        LTS : 'A h:mm:ss -നു',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, A h:mm -നു',
        LLLL : 'dddd, D MMMM YYYY, A h:mm -നു'
    },
    calendar : {
        sameDay : '[ഇന്ന്] LT',
        nextDay : '[നാളെ] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[ഇന്നലെ] LT',
        lastWeek : '[കഴിഞ്ഞ] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s കഴിഞ്ഞ്',
        past : '%s മുൻപ്',
        s : 'അൽപ നിമിഷങ്ങൾ',
        m : 'ഒരു മിനിറ്റ്',
        mm : '%d മിനിറ്റ്',
        h : 'ഒരു മണിക്കൂർ',
        hh : '%d മണിക്കൂർ',
        d : 'ഒരു ദിവസം',
        dd : '%d ദിവസം',
        M : 'ഒരു മാസം',
        MM : '%d മാസം',
        y : 'ഒരു വർഷം',
        yy : '%d വർഷം'
    },
    meridiemParse: /രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if ((meridiem === 'രാത്രി' && hour >= 4) ||
                meridiem === 'ഉച്ച കഴിഞ്ഞ്' ||
                meridiem === 'വൈകുന്നേരം') {
            return hour + 12;
        } else {
            return hour;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'രാത്രി';
        } else if (hour < 12) {
            return 'രാവിലെ';
        } else if (hour < 17) {
            return 'ഉച്ച കഴിഞ്ഞ്';
        } else if (hour < 20) {
            return 'വൈകുന്നേരം';
        } else {
            return 'രാത്രി';
        }
    }
});

//! moment.js locale configuration
//! locale : Marathi [mr]
//! author : Harshad Kale : https://github.com/kalehv
//! author : Vivek Athalye : https://github.com/vnathalye

var symbolMap$9 = {
    '1': '१',
    '2': '२',
    '3': '३',
    '4': '४',
    '5': '५',
    '6': '६',
    '7': '७',
    '8': '८',
    '9': '९',
    '0': '०'
};
var numberMap$8 = {
    '१': '1',
    '२': '2',
    '३': '3',
    '४': '4',
    '५': '5',
    '६': '6',
    '७': '7',
    '८': '8',
    '९': '9',
    '०': '0'
};

function relativeTimeMr(number, withoutSuffix, string, isFuture)
{
    var output = '';
    if (withoutSuffix) {
        switch (string) {
            case 's': output = 'काही सेकंद'; break;
            case 'm': output = 'एक मिनिट'; break;
            case 'mm': output = '%d मिनिटे'; break;
            case 'h': output = 'एक तास'; break;
            case 'hh': output = '%d तास'; break;
            case 'd': output = 'एक दिवस'; break;
            case 'dd': output = '%d दिवस'; break;
            case 'M': output = 'एक महिना'; break;
            case 'MM': output = '%d महिने'; break;
            case 'y': output = 'एक वर्ष'; break;
            case 'yy': output = '%d वर्षे'; break;
        }
    }
    else {
        switch (string) {
            case 's': output = 'काही सेकंदां'; break;
            case 'm': output = 'एका मिनिटा'; break;
            case 'mm': output = '%d मिनिटां'; break;
            case 'h': output = 'एका तासा'; break;
            case 'hh': output = '%d तासां'; break;
            case 'd': output = 'एका दिवसा'; break;
            case 'dd': output = '%d दिवसां'; break;
            case 'M': output = 'एका महिन्या'; break;
            case 'MM': output = '%d महिन्यां'; break;
            case 'y': output = 'एका वर्षा'; break;
            case 'yy': output = '%d वर्षां'; break;
        }
    }
    return output.replace(/%d/i, number);
}

hooks.defineLocale('mr', {
    months : 'जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर'.split('_'),
    monthsShort: 'जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.'.split('_'),
    monthsParseExact : true,
    weekdays : 'रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
    weekdaysShort : 'रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि'.split('_'),
    weekdaysMin : 'र_सो_मं_बु_गु_शु_श'.split('_'),
    longDateFormat : {
        LT : 'A h:mm वाजता',
        LTS : 'A h:mm:ss वाजता',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, A h:mm वाजता',
        LLLL : 'dddd, D MMMM YYYY, A h:mm वाजता'
    },
    calendar : {
        sameDay : '[आज] LT',
        nextDay : '[उद्या] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[काल] LT',
        lastWeek: '[मागील] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future: '%sमध्ये',
        past: '%sपूर्वी',
        s: relativeTimeMr,
        m: relativeTimeMr,
        mm: relativeTimeMr,
        h: relativeTimeMr,
        hh: relativeTimeMr,
        d: relativeTimeMr,
        dd: relativeTimeMr,
        M: relativeTimeMr,
        MM: relativeTimeMr,
        y: relativeTimeMr,
        yy: relativeTimeMr
    },
    preparse: function (string) {
        return string.replace(/[१२३४५६७८९०]/g, function (match) {
            return numberMap$8[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap$9[match];
        });
    },
    meridiemParse: /रात्री|सकाळी|दुपारी|सायंकाळी/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'रात्री') {
            return hour < 4 ? hour : hour + 12;
        } else if (meridiem === 'सकाळी') {
            return hour;
        } else if (meridiem === 'दुपारी') {
            return hour >= 10 ? hour : hour + 12;
        } else if (meridiem === 'सायंकाळी') {
            return hour + 12;
        }
    },
    meridiem: function (hour, minute, isLower) {
        if (hour < 4) {
            return 'रात्री';
        } else if (hour < 10) {
            return 'सकाळी';
        } else if (hour < 17) {
            return 'दुपारी';
        } else if (hour < 20) {
            return 'सायंकाळी';
        } else {
            return 'रात्री';
        }
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Malay [ms-my]
//! note : DEPRECATED, the correct one is [ms]
//! author : Weldan Jamili : https://github.com/weldan

hooks.defineLocale('ms-my', {
    months : 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
    monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
    weekdays : 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
    weekdaysShort : 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
    weekdaysMin : 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
    longDateFormat : {
        LT : 'HH.mm',
        LTS : 'HH.mm.ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY [pukul] HH.mm',
        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
    },
    meridiemParse: /pagi|tengahari|petang|malam/,
    meridiemHour: function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'pagi') {
            return hour;
        } else if (meridiem === 'tengahari') {
            return hour >= 11 ? hour : hour + 12;
        } else if (meridiem === 'petang' || meridiem === 'malam') {
            return hour + 12;
        }
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 11) {
            return 'pagi';
        } else if (hours < 15) {
            return 'tengahari';
        } else if (hours < 19) {
            return 'petang';
        } else {
            return 'malam';
        }
    },
    calendar : {
        sameDay : '[Hari ini pukul] LT',
        nextDay : '[Esok pukul] LT',
        nextWeek : 'dddd [pukul] LT',
        lastDay : '[Kelmarin pukul] LT',
        lastWeek : 'dddd [lepas pukul] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dalam %s',
        past : '%s yang lepas',
        s : 'beberapa saat',
        m : 'seminit',
        mm : '%d minit',
        h : 'sejam',
        hh : '%d jam',
        d : 'sehari',
        dd : '%d hari',
        M : 'sebulan',
        MM : '%d bulan',
        y : 'setahun',
        yy : '%d tahun'
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Malay [ms]
//! author : Weldan Jamili : https://github.com/weldan

hooks.defineLocale('ms', {
    months : 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
    monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
    weekdays : 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
    weekdaysShort : 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
    weekdaysMin : 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
    longDateFormat : {
        LT : 'HH.mm',
        LTS : 'HH.mm.ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY [pukul] HH.mm',
        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
    },
    meridiemParse: /pagi|tengahari|petang|malam/,
    meridiemHour: function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'pagi') {
            return hour;
        } else if (meridiem === 'tengahari') {
            return hour >= 11 ? hour : hour + 12;
        } else if (meridiem === 'petang' || meridiem === 'malam') {
            return hour + 12;
        }
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 11) {
            return 'pagi';
        } else if (hours < 15) {
            return 'tengahari';
        } else if (hours < 19) {
            return 'petang';
        } else {
            return 'malam';
        }
    },
    calendar : {
        sameDay : '[Hari ini pukul] LT',
        nextDay : '[Esok pukul] LT',
        nextWeek : 'dddd [pukul] LT',
        lastDay : '[Kelmarin pukul] LT',
        lastWeek : 'dddd [lepas pukul] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dalam %s',
        past : '%s yang lepas',
        s : 'beberapa saat',
        m : 'seminit',
        mm : '%d minit',
        h : 'sejam',
        hh : '%d jam',
        d : 'sehari',
        dd : '%d hari',
        M : 'sebulan',
        MM : '%d bulan',
        y : 'setahun',
        yy : '%d tahun'
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Burmese [my]
//! author : Squar team, mysquar.com
//! author : David Rossellat : https://github.com/gholadr
//! author : Tin Aung Lin : https://github.com/thanyawzinmin

var symbolMap$10 = {
    '1': '၁',
    '2': '၂',
    '3': '၃',
    '4': '၄',
    '5': '၅',
    '6': '၆',
    '7': '၇',
    '8': '၈',
    '9': '၉',
    '0': '၀'
};
var numberMap$9 = {
    '၁': '1',
    '၂': '2',
    '၃': '3',
    '၄': '4',
    '၅': '5',
    '၆': '6',
    '၇': '7',
    '၈': '8',
    '၉': '9',
    '၀': '0'
};

hooks.defineLocale('my', {
    months: 'ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ'.split('_'),
    monthsShort: 'ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ'.split('_'),
    weekdays: 'တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ'.split('_'),
    weekdaysShort: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),
    weekdaysMin: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),

    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd D MMMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[ယနေ.] LT [မှာ]',
        nextDay: '[မနက်ဖြန်] LT [မှာ]',
        nextWeek: 'dddd LT [မှာ]',
        lastDay: '[မနေ.က] LT [မှာ]',
        lastWeek: '[ပြီးခဲ့သော] dddd LT [မှာ]',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'လာမည့် %s မှာ',
        past: 'လွန်ခဲ့သော %s က',
        s: 'စက္ကန်.အနည်းငယ်',
        m: 'တစ်မိနစ်',
        mm: '%d မိနစ်',
        h: 'တစ်နာရီ',
        hh: '%d နာရီ',
        d: 'တစ်ရက်',
        dd: '%d ရက်',
        M: 'တစ်လ',
        MM: '%d လ',
        y: 'တစ်နှစ်',
        yy: '%d နှစ်'
    },
    preparse: function (string) {
        return string.replace(/[၁၂၃၄၅၆၇၈၉၀]/g, function (match) {
            return numberMap$9[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap$10[match];
        });
    },
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4 // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Norwegian Bokmål [nb]
//! authors : Espen Hovlandsdal : https://github.com/rexxars
//!           Sigurd Gartmann : https://github.com/sigurdga

hooks.defineLocale('nb', {
    months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
    monthsShort : 'jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.'.split('_'),
    monthsParseExact : true,
    weekdays : 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
    weekdaysShort : 'sø._ma._ti._on._to._fr._lø.'.split('_'),
    weekdaysMin : 'sø_ma_ti_on_to_fr_lø'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY [kl.] HH:mm',
        LLLL : 'dddd D. MMMM YYYY [kl.] HH:mm'
    },
    calendar : {
        sameDay: '[i dag kl.] LT',
        nextDay: '[i morgen kl.] LT',
        nextWeek: 'dddd [kl.] LT',
        lastDay: '[i går kl.] LT',
        lastWeek: '[forrige] dddd [kl.] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'om %s',
        past : '%s siden',
        s : 'noen sekunder',
        m : 'ett minutt',
        mm : '%d minutter',
        h : 'en time',
        hh : '%d timer',
        d : 'en dag',
        dd : '%d dager',
        M : 'en måned',
        MM : '%d måneder',
        y : 'ett år',
        yy : '%d år'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Nepalese [ne]
//! author : suvash : https://github.com/suvash

var symbolMap$11 = {
    '1': '१',
    '2': '२',
    '3': '३',
    '4': '४',
    '5': '५',
    '6': '६',
    '7': '७',
    '8': '८',
    '9': '९',
    '0': '०'
};
var numberMap$10 = {
    '१': '1',
    '२': '2',
    '३': '3',
    '४': '4',
    '५': '5',
    '६': '6',
    '७': '7',
    '८': '8',
    '९': '9',
    '०': '0'
};

hooks.defineLocale('ne', {
    months : 'जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर'.split('_'),
    monthsShort : 'जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.'.split('_'),
    monthsParseExact : true,
    weekdays : 'आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार'.split('_'),
    weekdaysShort : 'आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.'.split('_'),
    weekdaysMin : 'आ._सो._मं._बु._बि._शु._श.'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'Aको h:mm बजे',
        LTS : 'Aको h:mm:ss बजे',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, Aको h:mm बजे',
        LLLL : 'dddd, D MMMM YYYY, Aको h:mm बजे'
    },
    preparse: function (string) {
        return string.replace(/[१२३४५६७८९०]/g, function (match) {
            return numberMap$10[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap$11[match];
        });
    },
    meridiemParse: /राति|बिहान|दिउँसो|साँझ/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'राति') {
            return hour < 4 ? hour : hour + 12;
        } else if (meridiem === 'बिहान') {
            return hour;
        } else if (meridiem === 'दिउँसो') {
            return hour >= 10 ? hour : hour + 12;
        } else if (meridiem === 'साँझ') {
            return hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 3) {
            return 'राति';
        } else if (hour < 12) {
            return 'बिहान';
        } else if (hour < 16) {
            return 'दिउँसो';
        } else if (hour < 20) {
            return 'साँझ';
        } else {
            return 'राति';
        }
    },
    calendar : {
        sameDay : '[आज] LT',
        nextDay : '[भोलि] LT',
        nextWeek : '[आउँदो] dddd[,] LT',
        lastDay : '[हिजो] LT',
        lastWeek : '[गएको] dddd[,] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%sमा',
        past : '%s अगाडि',
        s : 'केही क्षण',
        m : 'एक मिनेट',
        mm : '%d मिनेट',
        h : 'एक घण्टा',
        hh : '%d घण्टा',
        d : 'एक दिन',
        dd : '%d दिन',
        M : 'एक महिना',
        MM : '%d महिना',
        y : 'एक बर्ष',
        yy : '%d बर्ष'
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Dutch (Belgium) [nl-be]
//! author : Joris Röling : https://github.com/jorisroling
//! author : Jacob Middag : https://github.com/middagj

var monthsShortWithDots$1 = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
var monthsShortWithoutDots$1 = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

var monthsParse$2 = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
var monthsRegex$3 = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

hooks.defineLocale('nl-be', {
    months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
    monthsShort : function (m, format) {
        if (!m) {
            return monthsShortWithDots$1;
        } else if (/-MMM-/.test(format)) {
            return monthsShortWithoutDots$1[m.month()];
        } else {
            return monthsShortWithDots$1[m.month()];
        }
    },

    monthsRegex: monthsRegex$3,
    monthsShortRegex: monthsRegex$3,
    monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
    monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

    monthsParse : monthsParse$2,
    longMonthsParse : monthsParse$2,
    shortMonthsParse : monthsParse$2,

    weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
    weekdaysShort : 'zo._ma._di._wo._do._vr._za.'.split('_'),
    weekdaysMin : 'zo_ma_di_wo_do_vr_za'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[vandaag om] LT',
        nextDay: '[morgen om] LT',
        nextWeek: 'dddd [om] LT',
        lastDay: '[gisteren om] LT',
        lastWeek: '[afgelopen] dddd [om] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'over %s',
        past : '%s geleden',
        s : 'een paar seconden',
        m : 'één minuut',
        mm : '%d minuten',
        h : 'één uur',
        hh : '%d uur',
        d : 'één dag',
        dd : '%d dagen',
        M : 'één maand',
        MM : '%d maanden',
        y : 'één jaar',
        yy : '%d jaar'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
    ordinal : function (number) {
        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Dutch [nl]
//! author : Joris Röling : https://github.com/jorisroling
//! author : Jacob Middag : https://github.com/middagj

var monthsShortWithDots$2 = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
var monthsShortWithoutDots$2 = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

var monthsParse$3 = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
var monthsRegex$4 = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

hooks.defineLocale('nl', {
    months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
    monthsShort : function (m, format) {
        if (!m) {
            return monthsShortWithDots$2;
        } else if (/-MMM-/.test(format)) {
            return monthsShortWithoutDots$2[m.month()];
        } else {
            return monthsShortWithDots$2[m.month()];
        }
    },

    monthsRegex: monthsRegex$4,
    monthsShortRegex: monthsRegex$4,
    monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
    monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

    monthsParse : monthsParse$3,
    longMonthsParse : monthsParse$3,
    shortMonthsParse : monthsParse$3,

    weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
    weekdaysShort : 'zo._ma._di._wo._do._vr._za.'.split('_'),
    weekdaysMin : 'zo_ma_di_wo_do_vr_za'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD-MM-YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[vandaag om] LT',
        nextDay: '[morgen om] LT',
        nextWeek: 'dddd [om] LT',
        lastDay: '[gisteren om] LT',
        lastWeek: '[afgelopen] dddd [om] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'over %s',
        past : '%s geleden',
        s : 'een paar seconden',
        m : 'één minuut',
        mm : '%d minuten',
        h : 'één uur',
        hh : '%d uur',
        d : 'één dag',
        dd : '%d dagen',
        M : 'één maand',
        MM : '%d maanden',
        y : 'één jaar',
        yy : '%d jaar'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
    ordinal : function (number) {
        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Nynorsk [nn]
//! author : https://github.com/mechuwind

hooks.defineLocale('nn', {
    months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
    monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
    weekdays : 'sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag'.split('_'),
    weekdaysShort : 'sun_mån_tys_ons_tor_fre_lau'.split('_'),
    weekdaysMin : 'su_må_ty_on_to_fr_lø'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY [kl.] H:mm',
        LLLL : 'dddd D. MMMM YYYY [kl.] HH:mm'
    },
    calendar : {
        sameDay: '[I dag klokka] LT',
        nextDay: '[I morgon klokka] LT',
        nextWeek: 'dddd [klokka] LT',
        lastDay: '[I går klokka] LT',
        lastWeek: '[Føregåande] dddd [klokka] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'om %s',
        past : '%s sidan',
        s : 'nokre sekund',
        m : 'eit minutt',
        mm : '%d minutt',
        h : 'ein time',
        hh : '%d timar',
        d : 'ein dag',
        dd : '%d dagar',
        M : 'ein månad',
        MM : '%d månader',
        y : 'eit år',
        yy : '%d år'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Punjabi (India) [pa-in]
//! author : Harpreet Singh : https://github.com/harpreetkhalsagtbit

var symbolMap$12 = {
    '1': '੧',
    '2': '੨',
    '3': '੩',
    '4': '੪',
    '5': '੫',
    '6': '੬',
    '7': '੭',
    '8': '੮',
    '9': '੯',
    '0': '੦'
};
var numberMap$11 = {
    '੧': '1',
    '੨': '2',
    '੩': '3',
    '੪': '4',
    '੫': '5',
    '੬': '6',
    '੭': '7',
    '੮': '8',
    '੯': '9',
    '੦': '0'
};

hooks.defineLocale('pa-in', {
    // There are months name as per Nanakshahi Calender but they are not used as rigidly in modern Punjabi.
    months : 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split('_'),
    monthsShort : 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split('_'),
    weekdays : 'ਐਤਵਾਰ_ਸੋਮਵਾਰ_ਮੰਗਲਵਾਰ_ਬੁਧਵਾਰ_ਵੀਰਵਾਰ_ਸ਼ੁੱਕਰਵਾਰ_ਸ਼ਨੀਚਰਵਾਰ'.split('_'),
    weekdaysShort : 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
    weekdaysMin : 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
    longDateFormat : {
        LT : 'A h:mm ਵਜੇ',
        LTS : 'A h:mm:ss ਵਜੇ',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, A h:mm ਵਜੇ',
        LLLL : 'dddd, D MMMM YYYY, A h:mm ਵਜੇ'
    },
    calendar : {
        sameDay : '[ਅਜ] LT',
        nextDay : '[ਕਲ] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[ਕਲ] LT',
        lastWeek : '[ਪਿਛਲੇ] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s ਵਿੱਚ',
        past : '%s ਪਿਛਲੇ',
        s : 'ਕੁਝ ਸਕਿੰਟ',
        m : 'ਇਕ ਮਿੰਟ',
        mm : '%d ਮਿੰਟ',
        h : 'ਇੱਕ ਘੰਟਾ',
        hh : '%d ਘੰਟੇ',
        d : 'ਇੱਕ ਦਿਨ',
        dd : '%d ਦਿਨ',
        M : 'ਇੱਕ ਮਹੀਨਾ',
        MM : '%d ਮਹੀਨੇ',
        y : 'ਇੱਕ ਸਾਲ',
        yy : '%d ਸਾਲ'
    },
    preparse: function (string) {
        return string.replace(/[੧੨੩੪੫੬੭੮੯੦]/g, function (match) {
            return numberMap$11[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap$12[match];
        });
    },
    // Punjabi notation for meridiems are quite fuzzy in practice. While there exists
    // a rigid notion of a 'Pahar' it is not used as rigidly in modern Punjabi.
    meridiemParse: /ਰਾਤ|ਸਵੇਰ|ਦੁਪਹਿਰ|ਸ਼ਾਮ/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'ਰਾਤ') {
            return hour < 4 ? hour : hour + 12;
        } else if (meridiem === 'ਸਵੇਰ') {
            return hour;
        } else if (meridiem === 'ਦੁਪਹਿਰ') {
            return hour >= 10 ? hour : hour + 12;
        } else if (meridiem === 'ਸ਼ਾਮ') {
            return hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'ਰਾਤ';
        } else if (hour < 10) {
            return 'ਸਵੇਰ';
        } else if (hour < 17) {
            return 'ਦੁਪਹਿਰ';
        } else if (hour < 20) {
            return 'ਸ਼ਾਮ';
        } else {
            return 'ਰਾਤ';
        }
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Polish [pl]
//! author : Rafal Hirsz : https://github.com/evoL

var monthsNominative = 'styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień'.split('_');
var monthsSubjective = 'stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia'.split('_');
function plural$3(n) {
    return (n % 10 < 5) && (n % 10 > 1) && ((~~(n / 10) % 10) !== 1);
}
function translate$7(number, withoutSuffix, key) {
    var result = number + ' ';
    switch (key) {
        case 'm':
            return withoutSuffix ? 'minuta' : 'minutę';
        case 'mm':
            return result + (plural$3(number) ? 'minuty' : 'minut');
        case 'h':
            return withoutSuffix  ? 'godzina'  : 'godzinę';
        case 'hh':
            return result + (plural$3(number) ? 'godziny' : 'godzin');
        case 'MM':
            return result + (plural$3(number) ? 'miesiące' : 'miesięcy');
        case 'yy':
            return result + (plural$3(number) ? 'lata' : 'lat');
    }
}

hooks.defineLocale('pl', {
    months : function (momentToFormat, format) {
        if (!momentToFormat) {
            return monthsNominative;
        } else if (format === '') {
            // Hack: if format empty we know this is used to generate
            // RegExp by moment. Give then back both valid forms of months
            // in RegExp ready format.
            return '(' + monthsSubjective[momentToFormat.month()] + '|' + monthsNominative[momentToFormat.month()] + ')';
        } else if (/D MMMM/.test(format)) {
            return monthsSubjective[momentToFormat.month()];
        } else {
            return monthsNominative[momentToFormat.month()];
        }
    },
    monthsShort : 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
    weekdays : 'niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota'.split('_'),
    weekdaysShort : 'ndz_pon_wt_śr_czw_pt_sob'.split('_'),
    weekdaysMin : 'Nd_Pn_Wt_Śr_Cz_Pt_So'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[Dziś o] LT',
        nextDay: '[Jutro o] LT',
        nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[W niedzielę o] LT';

                case 2:
                    return '[We wtorek o] LT';

                case 3:
                    return '[W środę o] LT';

                case 6:
                    return '[W sobotę o] LT';

                default:
                    return '[W] dddd [o] LT';
            }
        },
        lastDay: '[Wczoraj o] LT',
        lastWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[W zeszłą niedzielę o] LT';
                case 3:
                    return '[W zeszłą środę o] LT';
                case 6:
                    return '[W zeszłą sobotę o] LT';
                default:
                    return '[W zeszły] dddd [o] LT';
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'za %s',
        past : '%s temu',
        s : 'kilka sekund',
        m : translate$7,
        mm : translate$7,
        h : translate$7,
        hh : translate$7,
        d : '1 dzień',
        dd : '%d dni',
        M : 'miesiąc',
        MM : translate$7,
        y : 'rok',
        yy : translate$7
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Portuguese (Brazil) [pt-br]
//! author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira

hooks.defineLocale('pt-br', {
    months : 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
    monthsShort : 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
    weekdays : 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
    weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
    weekdaysMin : 'Do_2ª_3ª_4ª_5ª_6ª_Sá'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D [de] MMMM [de] YYYY',
        LLL : 'D [de] MMMM [de] YYYY [às] HH:mm',
        LLLL : 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
    },
    calendar : {
        sameDay: '[Hoje às] LT',
        nextDay: '[Amanhã às] LT',
        nextWeek: 'dddd [às] LT',
        lastDay: '[Ontem às] LT',
        lastWeek: function () {
            return (this.day() === 0 || this.day() === 6) ?
                '[Último] dddd [às] LT' : // Saturday + Sunday
                '[Última] dddd [às] LT'; // Monday - Friday
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'em %s',
        past : '%s atrás',
        s : 'poucos segundos',
        ss : '%d segundos',
        m : 'um minuto',
        mm : '%d minutos',
        h : 'uma hora',
        hh : '%d horas',
        d : 'um dia',
        dd : '%d dias',
        M : 'um mês',
        MM : '%d meses',
        y : 'um ano',
        yy : '%d anos'
    },
    dayOfMonthOrdinalParse: /\d{1,2}º/,
    ordinal : '%dº'
});

//! moment.js locale configuration
//! locale : Portuguese [pt]
//! author : Jefferson : https://github.com/jalex79

hooks.defineLocale('pt', {
    months : 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
    monthsShort : 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
    weekdays : 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
    weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
    weekdaysMin : 'Do_2ª_3ª_4ª_5ª_6ª_Sá'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D [de] MMMM [de] YYYY',
        LLL : 'D [de] MMMM [de] YYYY HH:mm',
        LLLL : 'dddd, D [de] MMMM [de] YYYY HH:mm'
    },
    calendar : {
        sameDay: '[Hoje às] LT',
        nextDay: '[Amanhã às] LT',
        nextWeek: 'dddd [às] LT',
        lastDay: '[Ontem às] LT',
        lastWeek: function () {
            return (this.day() === 0 || this.day() === 6) ?
                '[Último] dddd [às] LT' : // Saturday + Sunday
                '[Última] dddd [às] LT'; // Monday - Friday
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'em %s',
        past : 'há %s',
        s : 'segundos',
        m : 'um minuto',
        mm : '%d minutos',
        h : 'uma hora',
        hh : '%d horas',
        d : 'um dia',
        dd : '%d dias',
        M : 'um mês',
        MM : '%d meses',
        y : 'um ano',
        yy : '%d anos'
    },
    dayOfMonthOrdinalParse: /\d{1,2}º/,
    ordinal : '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Romanian [ro]
//! author : Vlad Gurdiga : https://github.com/gurdiga
//! author : Valentin Agachi : https://github.com/avaly

function relativeTimeWithPlural$2(number, withoutSuffix, key) {
    var format = {
            'mm': 'minute',
            'hh': 'ore',
            'dd': 'zile',
            'MM': 'luni',
            'yy': 'ani'
        },
        separator = ' ';
    if (number % 100 >= 20 || (number >= 100 && number % 100 === 0)) {
        separator = ' de ';
    }
    return number + separator + format[key];
}

hooks.defineLocale('ro', {
    months : 'ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie'.split('_'),
    monthsShort : 'ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.'.split('_'),
    monthsParseExact: true,
    weekdays : 'duminică_luni_marți_miercuri_joi_vineri_sâmbătă'.split('_'),
    weekdaysShort : 'Dum_Lun_Mar_Mie_Joi_Vin_Sâm'.split('_'),
    weekdaysMin : 'Du_Lu_Ma_Mi_Jo_Vi_Sâ'.split('_'),
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY H:mm',
        LLLL : 'dddd, D MMMM YYYY H:mm'
    },
    calendar : {
        sameDay: '[azi la] LT',
        nextDay: '[mâine la] LT',
        nextWeek: 'dddd [la] LT',
        lastDay: '[ieri la] LT',
        lastWeek: '[fosta] dddd [la] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'peste %s',
        past : '%s în urmă',
        s : 'câteva secunde',
        m : 'un minut',
        mm : relativeTimeWithPlural$2,
        h : 'o oră',
        hh : relativeTimeWithPlural$2,
        d : 'o zi',
        dd : relativeTimeWithPlural$2,
        M : 'o lună',
        MM : relativeTimeWithPlural$2,
        y : 'un an',
        yy : relativeTimeWithPlural$2
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Russian [ru]
//! author : Viktorminator : https://github.com/Viktorminator
//! Author : Menelion Elensúle : https://github.com/Oire
//! author : Коренберг Марк : https://github.com/socketpair

function plural$4(word, num) {
    var forms = word.split('_');
    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
}
function relativeTimeWithPlural$3(number, withoutSuffix, key) {
    var format = {
        'mm': withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
        'hh': 'час_часа_часов',
        'dd': 'день_дня_дней',
        'MM': 'месяц_месяца_месяцев',
        'yy': 'год_года_лет'
    };
    if (key === 'm') {
        return withoutSuffix ? 'минута' : 'минуту';
    }
    else {
        return number + ' ' + plural$4(format[key], +number);
    }
}
var monthsParse$4 = [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[йя]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i];

// http://new.gramota.ru/spravka/rules/139-prop : § 103
// Сокращения месяцев: http://new.gramota.ru/spravka/buro/search-answer?s=242637
// CLDR data:          http://www.unicode.org/cldr/charts/28/summary/ru.html#1753
hooks.defineLocale('ru', {
    months : {
        format: 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_'),
        standalone: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_')
    },
    monthsShort : {
        // по CLDR именно "июл." и "июн.", но какой смысл менять букву на точку ?
        format: 'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'.split('_'),
        standalone: 'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split('_')
    },
    weekdays : {
        standalone: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
        format: 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_'),
        isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/
    },
    weekdaysShort : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
    weekdaysMin : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
    monthsParse : monthsParse$4,
    longMonthsParse : monthsParse$4,
    shortMonthsParse : monthsParse$4,

    // полные названия с падежами, по три буквы, для некоторых, по 4 буквы, сокращения с точкой и без точки
    monthsRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

    // копия предыдущего
    monthsShortRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

    // полные названия с падежами
    monthsStrictRegex: /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,

    // Выражение, которое соотвествует только сокращённым формам
    monthsShortStrictRegex: /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY г.',
        LLL : 'D MMMM YYYY г., HH:mm',
        LLLL : 'dddd, D MMMM YYYY г., HH:mm'
    },
    calendar : {
        sameDay: '[Сегодня в] LT',
        nextDay: '[Завтра в] LT',
        lastDay: '[Вчера в] LT',
        nextWeek: function (now) {
            if (now.week() !== this.week()) {
                switch (this.day()) {
                    case 0:
                        return '[В следующее] dddd [в] LT';
                    case 1:
                    case 2:
                    case 4:
                        return '[В следующий] dddd [в] LT';
                    case 3:
                    case 5:
                    case 6:
                        return '[В следующую] dddd [в] LT';
                }
            } else {
                if (this.day() === 2) {
                    return '[Во] dddd [в] LT';
                } else {
                    return '[В] dddd [в] LT';
                }
            }
        },
        lastWeek: function (now) {
            if (now.week() !== this.week()) {
                switch (this.day()) {
                    case 0:
                        return '[В прошлое] dddd [в] LT';
                    case 1:
                    case 2:
                    case 4:
                        return '[В прошлый] dddd [в] LT';
                    case 3:
                    case 5:
                    case 6:
                        return '[В прошлую] dddd [в] LT';
                }
            } else {
                if (this.day() === 2) {
                    return '[Во] dddd [в] LT';
                } else {
                    return '[В] dddd [в] LT';
                }
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'через %s',
        past : '%s назад',
        s : 'несколько секунд',
        m : relativeTimeWithPlural$3,
        mm : relativeTimeWithPlural$3,
        h : 'час',
        hh : relativeTimeWithPlural$3,
        d : 'день',
        dd : relativeTimeWithPlural$3,
        M : 'месяц',
        MM : relativeTimeWithPlural$3,
        y : 'год',
        yy : relativeTimeWithPlural$3
    },
    meridiemParse: /ночи|утра|дня|вечера/i,
    isPM : function (input) {
        return /^(дня|вечера)$/.test(input);
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'ночи';
        } else if (hour < 12) {
            return 'утра';
        } else if (hour < 17) {
            return 'дня';
        } else {
            return 'вечера';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(й|го|я)/,
    ordinal: function (number, period) {
        switch (period) {
            case 'M':
            case 'd':
            case 'DDD':
                return number + '-й';
            case 'D':
                return number + '-го';
            case 'w':
            case 'W':
                return number + '-я';
            default:
                return number;
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Sindhi [sd]
//! author : Narain Sagar : https://github.com/narainsagar

var months$6 = [
    'جنوري',
    'فيبروري',
    'مارچ',
    'اپريل',
    'مئي',
    'جون',
    'جولاءِ',
    'آگسٽ',
    'سيپٽمبر',
    'آڪٽوبر',
    'نومبر',
    'ڊسمبر'
];
var days$1 = [
    'آچر',
    'سومر',
    'اڱارو',
    'اربع',
    'خميس',
    'جمع',
    'ڇنڇر'
];

hooks.defineLocale('sd', {
    months : months$6,
    monthsShort : months$6,
    weekdays : days$1,
    weekdaysShort : days$1,
    weekdaysMin : days$1,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd، D MMMM YYYY HH:mm'
    },
    meridiemParse: /صبح|شام/,
    isPM : function (input) {
        return 'شام' === input;
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'صبح';
        }
        return 'شام';
    },
    calendar : {
        sameDay : '[اڄ] LT',
        nextDay : '[سڀاڻي] LT',
        nextWeek : 'dddd [اڳين هفتي تي] LT',
        lastDay : '[ڪالهه] LT',
        lastWeek : '[گزريل هفتي] dddd [تي] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s پوء',
        past : '%s اڳ',
        s : 'چند سيڪنڊ',
        m : 'هڪ منٽ',
        mm : '%d منٽ',
        h : 'هڪ ڪلاڪ',
        hh : '%d ڪلاڪ',
        d : 'هڪ ڏينهن',
        dd : '%d ڏينهن',
        M : 'هڪ مهينو',
        MM : '%d مهينا',
        y : 'هڪ سال',
        yy : '%d سال'
    },
    preparse: function (string) {
        return string.replace(/،/g, ',');
    },
    postformat: function (string) {
        return string.replace(/,/g, '،');
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Northern Sami [se]
//! authors : Bård Rolstad Henriksen : https://github.com/karamell


hooks.defineLocale('se', {
    months : 'ođđajagemánnu_guovvamánnu_njukčamánnu_cuoŋománnu_miessemánnu_geassemánnu_suoidnemánnu_borgemánnu_čakčamánnu_golggotmánnu_skábmamánnu_juovlamánnu'.split('_'),
    monthsShort : 'ođđj_guov_njuk_cuo_mies_geas_suoi_borg_čakč_golg_skáb_juov'.split('_'),
    weekdays : 'sotnabeaivi_vuossárga_maŋŋebárga_gaskavahkku_duorastat_bearjadat_lávvardat'.split('_'),
    weekdaysShort : 'sotn_vuos_maŋ_gask_duor_bear_láv'.split('_'),
    weekdaysMin : 's_v_m_g_d_b_L'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'MMMM D. [b.] YYYY',
        LLL : 'MMMM D. [b.] YYYY [ti.] HH:mm',
        LLLL : 'dddd, MMMM D. [b.] YYYY [ti.] HH:mm'
    },
    calendar : {
        sameDay: '[otne ti] LT',
        nextDay: '[ihttin ti] LT',
        nextWeek: 'dddd [ti] LT',
        lastDay: '[ikte ti] LT',
        lastWeek: '[ovddit] dddd [ti] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : '%s geažes',
        past : 'maŋit %s',
        s : 'moadde sekunddat',
        m : 'okta minuhta',
        mm : '%d minuhtat',
        h : 'okta diimmu',
        hh : '%d diimmut',
        d : 'okta beaivi',
        dd : '%d beaivvit',
        M : 'okta mánnu',
        MM : '%d mánut',
        y : 'okta jahki',
        yy : '%d jagit'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Sinhalese [si]
//! author : Sampath Sitinamaluwa : https://github.com/sampathsris

/*jshint -W100*/
hooks.defineLocale('si', {
    months : 'ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්'.split('_'),
    monthsShort : 'ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ'.split('_'),
    weekdays : 'ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා'.split('_'),
    weekdaysShort : 'ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන'.split('_'),
    weekdaysMin : 'ඉ_ස_අ_බ_බ්‍ර_සි_සෙ'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'a h:mm',
        LTS : 'a h:mm:ss',
        L : 'YYYY/MM/DD',
        LL : 'YYYY MMMM D',
        LLL : 'YYYY MMMM D, a h:mm',
        LLLL : 'YYYY MMMM D [වැනි] dddd, a h:mm:ss'
    },
    calendar : {
        sameDay : '[අද] LT[ට]',
        nextDay : '[හෙට] LT[ට]',
        nextWeek : 'dddd LT[ට]',
        lastDay : '[ඊයේ] LT[ට]',
        lastWeek : '[පසුගිය] dddd LT[ට]',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%sකින්',
        past : '%sකට පෙර',
        s : 'තත්පර කිහිපය',
        m : 'මිනිත්තුව',
        mm : 'මිනිත්තු %d',
        h : 'පැය',
        hh : 'පැය %d',
        d : 'දිනය',
        dd : 'දින %d',
        M : 'මාසය',
        MM : 'මාස %d',
        y : 'වසර',
        yy : 'වසර %d'
    },
    dayOfMonthOrdinalParse: /\d{1,2} වැනි/,
    ordinal : function (number) {
        return number + ' වැනි';
    },
    meridiemParse : /පෙර වරු|පස් වරු|පෙ.ව|ප.ව./,
    isPM : function (input) {
        return input === 'ප.ව.' || input === 'පස් වරු';
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'ප.ව.' : 'පස් වරු';
        } else {
            return isLower ? 'පෙ.ව.' : 'පෙර වරු';
        }
    }
});

//! moment.js locale configuration
//! locale : Slovak [sk]
//! author : Martin Minka : https://github.com/k2s
//! based on work of petrbela : https://github.com/petrbela

var months$7 = 'január_február_marec_apríl_máj_jún_júl_august_september_október_november_december'.split('_');
var monthsShort$5 = 'jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec'.split('_');
function plural$5(n) {
    return (n > 1) && (n < 5);
}
function translate$8(number, withoutSuffix, key, isFuture) {
    var result = number + ' ';
    switch (key) {
        case 's':  // a few seconds / in a few seconds / a few seconds ago
            return (withoutSuffix || isFuture) ? 'pár sekúnd' : 'pár sekundami';
        case 'm':  // a minute / in a minute / a minute ago
            return withoutSuffix ? 'minúta' : (isFuture ? 'minútu' : 'minútou');
        case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
            if (withoutSuffix || isFuture) {
                return result + (plural$5(number) ? 'minúty' : 'minút');
            } else {
                return result + 'minútami';
            }
            break;
        case 'h':  // an hour / in an hour / an hour ago
            return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
        case 'hh': // 9 hours / in 9 hours / 9 hours ago
            if (withoutSuffix || isFuture) {
                return result + (plural$5(number) ? 'hodiny' : 'hodín');
            } else {
                return result + 'hodinami';
            }
            break;
        case 'd':  // a day / in a day / a day ago
            return (withoutSuffix || isFuture) ? 'deň' : 'dňom';
        case 'dd': // 9 days / in 9 days / 9 days ago
            if (withoutSuffix || isFuture) {
                return result + (plural$5(number) ? 'dni' : 'dní');
            } else {
                return result + 'dňami';
            }
            break;
        case 'M':  // a month / in a month / a month ago
            return (withoutSuffix || isFuture) ? 'mesiac' : 'mesiacom';
        case 'MM': // 9 months / in 9 months / 9 months ago
            if (withoutSuffix || isFuture) {
                return result + (plural$5(number) ? 'mesiace' : 'mesiacov');
            } else {
                return result + 'mesiacmi';
            }
            break;
        case 'y':  // a year / in a year / a year ago
            return (withoutSuffix || isFuture) ? 'rok' : 'rokom';
        case 'yy': // 9 years / in 9 years / 9 years ago
            if (withoutSuffix || isFuture) {
                return result + (plural$5(number) ? 'roky' : 'rokov');
            } else {
                return result + 'rokmi';
            }
            break;
    }
}

hooks.defineLocale('sk', {
    months : months$7,
    monthsShort : monthsShort$5,
    weekdays : 'nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota'.split('_'),
    weekdaysShort : 'ne_po_ut_st_št_pi_so'.split('_'),
    weekdaysMin : 'ne_po_ut_st_št_pi_so'.split('_'),
    longDateFormat : {
        LT: 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY H:mm',
        LLLL : 'dddd D. MMMM YYYY H:mm'
    },
    calendar : {
        sameDay: '[dnes o] LT',
        nextDay: '[zajtra o] LT',
        nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[v nedeľu o] LT';
                case 1:
                case 2:
                    return '[v] dddd [o] LT';
                case 3:
                    return '[v stredu o] LT';
                case 4:
                    return '[vo štvrtok o] LT';
                case 5:
                    return '[v piatok o] LT';
                case 6:
                    return '[v sobotu o] LT';
            }
        },
        lastDay: '[včera o] LT',
        lastWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[minulú nedeľu o] LT';
                case 1:
                case 2:
                    return '[minulý] dddd [o] LT';
                case 3:
                    return '[minulú stredu o] LT';
                case 4:
                case 5:
                    return '[minulý] dddd [o] LT';
                case 6:
                    return '[minulú sobotu o] LT';
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'za %s',
        past : 'pred %s',
        s : translate$8,
        m : translate$8,
        mm : translate$8,
        h : translate$8,
        hh : translate$8,
        d : translate$8,
        dd : translate$8,
        M : translate$8,
        MM : translate$8,
        y : translate$8,
        yy : translate$8
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Slovenian [sl]
//! author : Robert Sedovšek : https://github.com/sedovsek

function processRelativeTime$6(number, withoutSuffix, key, isFuture) {
    var result = number + ' ';
    switch (key) {
        case 's':
            return withoutSuffix || isFuture ? 'nekaj sekund' : 'nekaj sekundami';
        case 'm':
            return withoutSuffix ? 'ena minuta' : 'eno minuto';
        case 'mm':
            if (number === 1) {
                result += withoutSuffix ? 'minuta' : 'minuto';
            } else if (number === 2) {
                result += withoutSuffix || isFuture ? 'minuti' : 'minutama';
            } else if (number < 5) {
                result += withoutSuffix || isFuture ? 'minute' : 'minutami';
            } else {
                result += withoutSuffix || isFuture ? 'minut' : 'minutami';
            }
            return result;
        case 'h':
            return withoutSuffix ? 'ena ura' : 'eno uro';
        case 'hh':
            if (number === 1) {
                result += withoutSuffix ? 'ura' : 'uro';
            } else if (number === 2) {
                result += withoutSuffix || isFuture ? 'uri' : 'urama';
            } else if (number < 5) {
                result += withoutSuffix || isFuture ? 'ure' : 'urami';
            } else {
                result += withoutSuffix || isFuture ? 'ur' : 'urami';
            }
            return result;
        case 'd':
            return withoutSuffix || isFuture ? 'en dan' : 'enim dnem';
        case 'dd':
            if (number === 1) {
                result += withoutSuffix || isFuture ? 'dan' : 'dnem';
            } else if (number === 2) {
                result += withoutSuffix || isFuture ? 'dni' : 'dnevoma';
            } else {
                result += withoutSuffix || isFuture ? 'dni' : 'dnevi';
            }
            return result;
        case 'M':
            return withoutSuffix || isFuture ? 'en mesec' : 'enim mesecem';
        case 'MM':
            if (number === 1) {
                result += withoutSuffix || isFuture ? 'mesec' : 'mesecem';
            } else if (number === 2) {
                result += withoutSuffix || isFuture ? 'meseca' : 'mesecema';
            } else if (number < 5) {
                result += withoutSuffix || isFuture ? 'mesece' : 'meseci';
            } else {
                result += withoutSuffix || isFuture ? 'mesecev' : 'meseci';
            }
            return result;
        case 'y':
            return withoutSuffix || isFuture ? 'eno leto' : 'enim letom';
        case 'yy':
            if (number === 1) {
                result += withoutSuffix || isFuture ? 'leto' : 'letom';
            } else if (number === 2) {
                result += withoutSuffix || isFuture ? 'leti' : 'letoma';
            } else if (number < 5) {
                result += withoutSuffix || isFuture ? 'leta' : 'leti';
            } else {
                result += withoutSuffix || isFuture ? 'let' : 'leti';
            }
            return result;
    }
}

hooks.defineLocale('sl', {
    months : 'januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december'.split('_'),
    monthsShort : 'jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.'.split('_'),
    monthsParseExact: true,
    weekdays : 'nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota'.split('_'),
    weekdaysShort : 'ned._pon._tor._sre._čet._pet._sob.'.split('_'),
    weekdaysMin : 'ne_po_to_sr_če_pe_so'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY H:mm',
        LLLL : 'dddd, D. MMMM YYYY H:mm'
    },
    calendar : {
        sameDay  : '[danes ob] LT',
        nextDay  : '[jutri ob] LT',

        nextWeek : function () {
            switch (this.day()) {
                case 0:
                    return '[v] [nedeljo] [ob] LT';
                case 3:
                    return '[v] [sredo] [ob] LT';
                case 6:
                    return '[v] [soboto] [ob] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[v] dddd [ob] LT';
            }
        },
        lastDay  : '[včeraj ob] LT',
        lastWeek : function () {
            switch (this.day()) {
                case 0:
                    return '[prejšnjo] [nedeljo] [ob] LT';
                case 3:
                    return '[prejšnjo] [sredo] [ob] LT';
                case 6:
                    return '[prejšnjo] [soboto] [ob] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[prejšnji] dddd [ob] LT';
            }
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'čez %s',
        past   : 'pred %s',
        s      : processRelativeTime$6,
        m      : processRelativeTime$6,
        mm     : processRelativeTime$6,
        h      : processRelativeTime$6,
        hh     : processRelativeTime$6,
        d      : processRelativeTime$6,
        dd     : processRelativeTime$6,
        M      : processRelativeTime$6,
        MM     : processRelativeTime$6,
        y      : processRelativeTime$6,
        yy     : processRelativeTime$6
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Albanian [sq]
//! author : Flakërim Ismani : https://github.com/flakerimi
//! author : Menelion Elensúle : https://github.com/Oire
//! author : Oerd Cukalla : https://github.com/oerd

hooks.defineLocale('sq', {
    months : 'Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor'.split('_'),
    monthsShort : 'Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj'.split('_'),
    weekdays : 'E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë'.split('_'),
    weekdaysShort : 'Die_Hën_Mar_Mër_Enj_Pre_Sht'.split('_'),
    weekdaysMin : 'D_H_Ma_Më_E_P_Sh'.split('_'),
    weekdaysParseExact : true,
    meridiemParse: /PD|MD/,
    isPM: function (input) {
        return input.charAt(0) === 'M';
    },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Sot në] LT',
        nextDay : '[Nesër në] LT',
        nextWeek : 'dddd [në] LT',
        lastDay : '[Dje në] LT',
        lastWeek : 'dddd [e kaluar në] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'në %s',
        past : '%s më parë',
        s : 'disa sekonda',
        m : 'një minutë',
        mm : '%d minuta',
        h : 'një orë',
        hh : '%d orë',
        d : 'një ditë',
        dd : '%d ditë',
        M : 'një muaj',
        MM : '%d muaj',
        y : 'një vit',
        yy : '%d vite'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Serbian Cyrillic [sr-cyrl]
//! author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j

var translator$1 = {
    words: { //Different grammatical cases
        m: ['један минут', 'једне минуте'],
        mm: ['минут', 'минуте', 'минута'],
        h: ['један сат', 'једног сата'],
        hh: ['сат', 'сата', 'сати'],
        dd: ['дан', 'дана', 'дана'],
        MM: ['месец', 'месеца', 'месеци'],
        yy: ['година', 'године', 'година']
    },
    correctGrammaticalCase: function (number, wordKey) {
        return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
    },
    translate: function (number, withoutSuffix, key) {
        var wordKey = translator$1.words[key];
        if (key.length === 1) {
            return withoutSuffix ? wordKey[0] : wordKey[1];
        } else {
            return number + ' ' + translator$1.correctGrammaticalCase(number, wordKey);
        }
    }
};

hooks.defineLocale('sr-cyrl', {
    months: 'јануар_фебруар_март_април_мај_јун_јул_август_септембар_октобар_новембар_децембар'.split('_'),
    monthsShort: 'јан._феб._мар._апр._мај_јун_јул_авг._сеп._окт._нов._дец.'.split('_'),
    monthsParseExact: true,
    weekdays: 'недеља_понедељак_уторак_среда_четвртак_петак_субота'.split('_'),
    weekdaysShort: 'нед._пон._уто._сре._чет._пет._суб.'.split('_'),
    weekdaysMin: 'не_по_ут_ср_че_пе_су'.split('_'),
    weekdaysParseExact : true,
    longDateFormat: {
        LT: 'H:mm',
        LTS : 'H:mm:ss',
        L: 'DD.MM.YYYY',
        LL: 'D. MMMM YYYY',
        LLL: 'D. MMMM YYYY H:mm',
        LLLL: 'dddd, D. MMMM YYYY H:mm'
    },
    calendar: {
        sameDay: '[данас у] LT',
        nextDay: '[сутра у] LT',
        nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[у] [недељу] [у] LT';
                case 3:
                    return '[у] [среду] [у] LT';
                case 6:
                    return '[у] [суботу] [у] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[у] dddd [у] LT';
            }
        },
        lastDay  : '[јуче у] LT',
        lastWeek : function () {
            var lastWeekDays = [
                '[прошле] [недеље] [у] LT',
                '[прошлог] [понедељка] [у] LT',
                '[прошлог] [уторка] [у] LT',
                '[прошле] [среде] [у] LT',
                '[прошлог] [четвртка] [у] LT',
                '[прошлог] [петка] [у] LT',
                '[прошле] [суботе] [у] LT'
            ];
            return lastWeekDays[this.day()];
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'за %s',
        past   : 'пре %s',
        s      : 'неколико секунди',
        m      : translator$1.translate,
        mm     : translator$1.translate,
        h      : translator$1.translate,
        hh     : translator$1.translate,
        d      : 'дан',
        dd     : translator$1.translate,
        M      : 'месец',
        MM     : translator$1.translate,
        y      : 'годину',
        yy     : translator$1.translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Serbian [sr]
//! author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j

var translator$2 = {
    words: { //Different grammatical cases
        m: ['jedan minut', 'jedne minute'],
        mm: ['minut', 'minute', 'minuta'],
        h: ['jedan sat', 'jednog sata'],
        hh: ['sat', 'sata', 'sati'],
        dd: ['dan', 'dana', 'dana'],
        MM: ['mesec', 'meseca', 'meseci'],
        yy: ['godina', 'godine', 'godina']
    },
    correctGrammaticalCase: function (number, wordKey) {
        return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
    },
    translate: function (number, withoutSuffix, key) {
        var wordKey = translator$2.words[key];
        if (key.length === 1) {
            return withoutSuffix ? wordKey[0] : wordKey[1];
        } else {
            return number + ' ' + translator$2.correctGrammaticalCase(number, wordKey);
        }
    }
};

hooks.defineLocale('sr', {
    months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
    monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
    monthsParseExact: true,
    weekdays: 'nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota'.split('_'),
    weekdaysShort: 'ned._pon._uto._sre._čet._pet._sub.'.split('_'),
    weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
    weekdaysParseExact : true,
    longDateFormat: {
        LT: 'H:mm',
        LTS : 'H:mm:ss',
        L: 'DD.MM.YYYY',
        LL: 'D. MMMM YYYY',
        LLL: 'D. MMMM YYYY H:mm',
        LLLL: 'dddd, D. MMMM YYYY H:mm'
    },
    calendar: {
        sameDay: '[danas u] LT',
        nextDay: '[sutra u] LT',
        nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[u] [nedelju] [u] LT';
                case 3:
                    return '[u] [sredu] [u] LT';
                case 6:
                    return '[u] [subotu] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[u] dddd [u] LT';
            }
        },
        lastDay  : '[juče u] LT',
        lastWeek : function () {
            var lastWeekDays = [
                '[prošle] [nedelje] [u] LT',
                '[prošlog] [ponedeljka] [u] LT',
                '[prošlog] [utorka] [u] LT',
                '[prošle] [srede] [u] LT',
                '[prošlog] [četvrtka] [u] LT',
                '[prošlog] [petka] [u] LT',
                '[prošle] [subote] [u] LT'
            ];
            return lastWeekDays[this.day()];
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'za %s',
        past   : 'pre %s',
        s      : 'nekoliko sekundi',
        m      : translator$2.translate,
        mm     : translator$2.translate,
        h      : translator$2.translate,
        hh     : translator$2.translate,
        d      : 'dan',
        dd     : translator$2.translate,
        M      : 'mesec',
        MM     : translator$2.translate,
        y      : 'godinu',
        yy     : translator$2.translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : siSwati [ss]
//! author : Nicolai Davies<mail@nicolai.io> : https://github.com/nicolaidavies


hooks.defineLocale('ss', {
    months : "Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split('_'),
    monthsShort : 'Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo'.split('_'),
    weekdays : 'Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo'.split('_'),
    weekdaysShort : 'Lis_Umb_Lsb_Les_Lsi_Lsh_Umg'.split('_'),
    weekdaysMin : 'Li_Us_Lb_Lt_Ls_Lh_Ug'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'h:mm A',
        LTS : 'h:mm:ss A',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY h:mm A',
        LLLL : 'dddd, D MMMM YYYY h:mm A'
    },
    calendar : {
        sameDay : '[Namuhla nga] LT',
        nextDay : '[Kusasa nga] LT',
        nextWeek : 'dddd [nga] LT',
        lastDay : '[Itolo nga] LT',
        lastWeek : 'dddd [leliphelile] [nga] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'nga %s',
        past : 'wenteka nga %s',
        s : 'emizuzwana lomcane',
        m : 'umzuzu',
        mm : '%d emizuzu',
        h : 'lihora',
        hh : '%d emahora',
        d : 'lilanga',
        dd : '%d emalanga',
        M : 'inyanga',
        MM : '%d tinyanga',
        y : 'umnyaka',
        yy : '%d iminyaka'
    },
    meridiemParse: /ekuseni|emini|entsambama|ebusuku/,
    meridiem : function (hours, minutes, isLower) {
        if (hours < 11) {
            return 'ekuseni';
        } else if (hours < 15) {
            return 'emini';
        } else if (hours < 19) {
            return 'entsambama';
        } else {
            return 'ebusuku';
        }
    },
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'ekuseni') {
            return hour;
        } else if (meridiem === 'emini') {
            return hour >= 11 ? hour : hour + 12;
        } else if (meridiem === 'entsambama' || meridiem === 'ebusuku') {
            if (hour === 0) {
                return 0;
            }
            return hour + 12;
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}/,
    ordinal : '%d',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Swedish [sv]
//! author : Jens Alm : https://github.com/ulmus

hooks.defineLocale('sv', {
    months : 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split('_'),
    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
    weekdays : 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag'.split('_'),
    weekdaysShort : 'sön_mån_tis_ons_tor_fre_lör'.split('_'),
    weekdaysMin : 'sö_må_ti_on_to_fr_lö'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY-MM-DD',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY [kl.] HH:mm',
        LLLL : 'dddd D MMMM YYYY [kl.] HH:mm',
        lll : 'D MMM YYYY HH:mm',
        llll : 'ddd D MMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[Idag] LT',
        nextDay: '[Imorgon] LT',
        lastDay: '[Igår] LT',
        nextWeek: '[På] dddd LT',
        lastWeek: '[I] dddd[s] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'om %s',
        past : 'för %s sedan',
        s : 'några sekunder',
        m : 'en minut',
        mm : '%d minuter',
        h : 'en timme',
        hh : '%d timmar',
        d : 'en dag',
        dd : '%d dagar',
        M : 'en månad',
        MM : '%d månader',
        y : 'ett år',
        yy : '%d år'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(e|a)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'e' :
            (b === 1) ? 'a' :
            (b === 2) ? 'a' :
            (b === 3) ? 'e' : 'e';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Swahili [sw]
//! author : Fahad Kassim : https://github.com/fadsel

hooks.defineLocale('sw', {
    months : 'Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba'.split('_'),
    monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des'.split('_'),
    weekdays : 'Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi'.split('_'),
    weekdaysShort : 'Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos'.split('_'),
    weekdaysMin : 'J2_J3_J4_J5_Al_Ij_J1'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[leo saa] LT',
        nextDay : '[kesho saa] LT',
        nextWeek : '[wiki ijayo] dddd [saat] LT',
        lastDay : '[jana] LT',
        lastWeek : '[wiki iliyopita] dddd [saat] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s baadaye',
        past : 'tokea %s',
        s : 'hivi punde',
        m : 'dakika moja',
        mm : 'dakika %d',
        h : 'saa limoja',
        hh : 'masaa %d',
        d : 'siku moja',
        dd : 'masiku %d',
        M : 'mwezi mmoja',
        MM : 'miezi %d',
        y : 'mwaka mmoja',
        yy : 'miaka %d'
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Tamil [ta]
//! author : Arjunkumar Krishnamoorthy : https://github.com/tk120404

var symbolMap$13 = {
    '1': '௧',
    '2': '௨',
    '3': '௩',
    '4': '௪',
    '5': '௫',
    '6': '௬',
    '7': '௭',
    '8': '௮',
    '9': '௯',
    '0': '௦'
};
var numberMap$12 = {
    '௧': '1',
    '௨': '2',
    '௩': '3',
    '௪': '4',
    '௫': '5',
    '௬': '6',
    '௭': '7',
    '௮': '8',
    '௯': '9',
    '௦': '0'
};

hooks.defineLocale('ta', {
    months : 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
    monthsShort : 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
    weekdays : 'ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை'.split('_'),
    weekdaysShort : 'ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி'.split('_'),
    weekdaysMin : 'ஞா_தி_செ_பு_வி_வெ_ச'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, HH:mm',
        LLLL : 'dddd, D MMMM YYYY, HH:mm'
    },
    calendar : {
        sameDay : '[இன்று] LT',
        nextDay : '[நாளை] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[நேற்று] LT',
        lastWeek : '[கடந்த வாரம்] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s இல்',
        past : '%s முன்',
        s : 'ஒரு சில விநாடிகள்',
        m : 'ஒரு நிமிடம்',
        mm : '%d நிமிடங்கள்',
        h : 'ஒரு மணி நேரம்',
        hh : '%d மணி நேரம்',
        d : 'ஒரு நாள்',
        dd : '%d நாட்கள்',
        M : 'ஒரு மாதம்',
        MM : '%d மாதங்கள்',
        y : 'ஒரு வருடம்',
        yy : '%d ஆண்டுகள்'
    },
    dayOfMonthOrdinalParse: /\d{1,2}வது/,
    ordinal : function (number) {
        return number + 'வது';
    },
    preparse: function (string) {
        return string.replace(/[௧௨௩௪௫௬௭௮௯௦]/g, function (match) {
            return numberMap$12[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap$13[match];
        });
    },
    // refer http://ta.wikipedia.org/s/1er1
    meridiemParse: /யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,
    meridiem : function (hour, minute, isLower) {
        if (hour < 2) {
            return ' யாமம்';
        } else if (hour < 6) {
            return ' வைகறை';  // வைகறை
        } else if (hour < 10) {
            return ' காலை'; // காலை
        } else if (hour < 14) {
            return ' நண்பகல்'; // நண்பகல்
        } else if (hour < 18) {
            return ' எற்பாடு'; // எற்பாடு
        } else if (hour < 22) {
            return ' மாலை'; // மாலை
        } else {
            return ' யாமம்';
        }
    },
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'யாமம்') {
            return hour < 2 ? hour : hour + 12;
        } else if (meridiem === 'வைகறை' || meridiem === 'காலை') {
            return hour;
        } else if (meridiem === 'நண்பகல்') {
            return hour >= 10 ? hour : hour + 12;
        } else {
            return hour + 12;
        }
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Telugu [te]
//! author : Krishna Chaitanya Thota : https://github.com/kcthota

hooks.defineLocale('te', {
    months : 'జనవరి_ఫిబ్రవరి_మార్చి_ఏప్రిల్_మే_జూన్_జూలై_ఆగస్టు_సెప్టెంబర్_అక్టోబర్_నవంబర్_డిసెంబర్'.split('_'),
    monthsShort : 'జన._ఫిబ్ర._మార్చి_ఏప్రి._మే_జూన్_జూలై_ఆగ._సెప్._అక్టో._నవ._డిసె.'.split('_'),
    monthsParseExact : true,
    weekdays : 'ఆదివారం_సోమవారం_మంగళవారం_బుధవారం_గురువారం_శుక్రవారం_శనివారం'.split('_'),
    weekdaysShort : 'ఆది_సోమ_మంగళ_బుధ_గురు_శుక్ర_శని'.split('_'),
    weekdaysMin : 'ఆ_సో_మం_బు_గు_శు_శ'.split('_'),
    longDateFormat : {
        LT : 'A h:mm',
        LTS : 'A h:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, A h:mm',
        LLLL : 'dddd, D MMMM YYYY, A h:mm'
    },
    calendar : {
        sameDay : '[నేడు] LT',
        nextDay : '[రేపు] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[నిన్న] LT',
        lastWeek : '[గత] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s లో',
        past : '%s క్రితం',
        s : 'కొన్ని క్షణాలు',
        m : 'ఒక నిమిషం',
        mm : '%d నిమిషాలు',
        h : 'ఒక గంట',
        hh : '%d గంటలు',
        d : 'ఒక రోజు',
        dd : '%d రోజులు',
        M : 'ఒక నెల',
        MM : '%d నెలలు',
        y : 'ఒక సంవత్సరం',
        yy : '%d సంవత్సరాలు'
    },
    dayOfMonthOrdinalParse : /\d{1,2}వ/,
    ordinal : '%dవ',
    meridiemParse: /రాత్రి|ఉదయం|మధ్యాహ్నం|సాయంత్రం/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'రాత్రి') {
            return hour < 4 ? hour : hour + 12;
        } else if (meridiem === 'ఉదయం') {
            return hour;
        } else if (meridiem === 'మధ్యాహ్నం') {
            return hour >= 10 ? hour : hour + 12;
        } else if (meridiem === 'సాయంత్రం') {
            return hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'రాత్రి';
        } else if (hour < 10) {
            return 'ఉదయం';
        } else if (hour < 17) {
            return 'మధ్యాహ్నం';
        } else if (hour < 20) {
            return 'సాయంత్రం';
        } else {
            return 'రాత్రి';
        }
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Tetun Dili (East Timor) [tet]
//! author : Joshua Brooks : https://github.com/joshbrooks
//! author : Onorio De J. Afonso : https://github.com/marobo

hooks.defineLocale('tet', {
    months : 'Janeiru_Fevereiru_Marsu_Abril_Maiu_Juniu_Juliu_Augustu_Setembru_Outubru_Novembru_Dezembru'.split('_'),
    monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Aug_Set_Out_Nov_Dez'.split('_'),
    weekdays : 'Domingu_Segunda_Tersa_Kuarta_Kinta_Sexta_Sabadu'.split('_'),
    weekdaysShort : 'Dom_Seg_Ters_Kua_Kint_Sext_Sab'.split('_'),
    weekdaysMin : 'Do_Seg_Te_Ku_Ki_Sex_Sa'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[Ohin iha] LT',
        nextDay: '[Aban iha] LT',
        nextWeek: 'dddd [iha] LT',
        lastDay: '[Horiseik iha] LT',
        lastWeek: 'dddd [semana kotuk] [iha] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'iha %s',
        past : '%s liuba',
        s : 'minutu balun',
        m : 'minutu ida',
        mm : 'minutus %d',
        h : 'horas ida',
        hh : 'horas %d',
        d : 'loron ida',
        dd : 'loron %d',
        M : 'fulan ida',
        MM : 'fulan %d',
        y : 'tinan ida',
        yy : 'tinan %d'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Thai [th]
//! author : Kridsada Thanabulpong : https://github.com/sirn

hooks.defineLocale('th', {
    months : 'มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม'.split('_'),
    monthsShort : 'ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.'.split('_'),
    monthsParseExact: true,
    weekdays : 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_'),
    weekdaysShort : 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์'.split('_'), // yes, three characters difference
    weekdaysMin : 'อา._จ._อ._พ._พฤ._ศ._ส.'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY เวลา H:mm',
        LLLL : 'วันddddที่ D MMMM YYYY เวลา H:mm'
    },
    meridiemParse: /ก่อนเที่ยง|หลังเที่ยง/,
    isPM: function (input) {
        return input === 'หลังเที่ยง';
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'ก่อนเที่ยง';
        } else {
            return 'หลังเที่ยง';
        }
    },
    calendar : {
        sameDay : '[วันนี้ เวลา] LT',
        nextDay : '[พรุ่งนี้ เวลา] LT',
        nextWeek : 'dddd[หน้า เวลา] LT',
        lastDay : '[เมื่อวานนี้ เวลา] LT',
        lastWeek : '[วัน]dddd[ที่แล้ว เวลา] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'อีก %s',
        past : '%sที่แล้ว',
        s : 'ไม่กี่วินาที',
        m : '1 นาที',
        mm : '%d นาที',
        h : '1 ชั่วโมง',
        hh : '%d ชั่วโมง',
        d : '1 วัน',
        dd : '%d วัน',
        M : '1 เดือน',
        MM : '%d เดือน',
        y : '1 ปี',
        yy : '%d ปี'
    }
});

//! moment.js locale configuration
//! locale : Tagalog (Philippines) [tl-ph]
//! author : Dan Hagman : https://github.com/hagmandan

hooks.defineLocale('tl-ph', {
    months : 'Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre'.split('_'),
    monthsShort : 'Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis'.split('_'),
    weekdays : 'Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado'.split('_'),
    weekdaysShort : 'Lin_Lun_Mar_Miy_Huw_Biy_Sab'.split('_'),
    weekdaysMin : 'Li_Lu_Ma_Mi_Hu_Bi_Sab'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'MM/D/YYYY',
        LL : 'MMMM D, YYYY',
        LLL : 'MMMM D, YYYY HH:mm',
        LLLL : 'dddd, MMMM DD, YYYY HH:mm'
    },
    calendar : {
        sameDay: 'LT [ngayong araw]',
        nextDay: '[Bukas ng] LT',
        nextWeek: 'LT [sa susunod na] dddd',
        lastDay: 'LT [kahapon]',
        lastWeek: 'LT [noong nakaraang] dddd',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'sa loob ng %s',
        past : '%s ang nakalipas',
        s : 'ilang segundo',
        m : 'isang minuto',
        mm : '%d minuto',
        h : 'isang oras',
        hh : '%d oras',
        d : 'isang araw',
        dd : '%d araw',
        M : 'isang buwan',
        MM : '%d buwan',
        y : 'isang taon',
        yy : '%d taon'
    },
    dayOfMonthOrdinalParse: /\d{1,2}/,
    ordinal : function (number) {
        return number;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Klingon [tlh]
//! author : Dominika Kruk : https://github.com/amaranthrose

var numbersNouns = 'pagh_wa’_cha’_wej_loS_vagh_jav_Soch_chorgh_Hut'.split('_');

function translateFuture(output) {
    var time = output;
    time = (output.indexOf('jaj') !== -1) ?
    time.slice(0, -3) + 'leS' :
    (output.indexOf('jar') !== -1) ?
    time.slice(0, -3) + 'waQ' :
    (output.indexOf('DIS') !== -1) ?
    time.slice(0, -3) + 'nem' :
    time + ' pIq';
    return time;
}

function translatePast(output) {
    var time = output;
    time = (output.indexOf('jaj') !== -1) ?
    time.slice(0, -3) + 'Hu’' :
    (output.indexOf('jar') !== -1) ?
    time.slice(0, -3) + 'wen' :
    (output.indexOf('DIS') !== -1) ?
    time.slice(0, -3) + 'ben' :
    time + ' ret';
    return time;
}

function translate$9(number, withoutSuffix, string, isFuture) {
    var numberNoun = numberAsNoun(number);
    switch (string) {
        case 'mm':
            return numberNoun + ' tup';
        case 'hh':
            return numberNoun + ' rep';
        case 'dd':
            return numberNoun + ' jaj';
        case 'MM':
            return numberNoun + ' jar';
        case 'yy':
            return numberNoun + ' DIS';
    }
}

function numberAsNoun(number) {
    var hundred = Math.floor((number % 1000) / 100),
    ten = Math.floor((number % 100) / 10),
    one = number % 10,
    word = '';
    if (hundred > 0) {
        word += numbersNouns[hundred] + 'vatlh';
    }
    if (ten > 0) {
        word += ((word !== '') ? ' ' : '') + numbersNouns[ten] + 'maH';
    }
    if (one > 0) {
        word += ((word !== '') ? ' ' : '') + numbersNouns[one];
    }
    return (word === '') ? 'pagh' : word;
}

hooks.defineLocale('tlh', {
    months : 'tera’ jar wa’_tera’ jar cha’_tera’ jar wej_tera’ jar loS_tera’ jar vagh_tera’ jar jav_tera’ jar Soch_tera’ jar chorgh_tera’ jar Hut_tera’ jar wa’maH_tera’ jar wa’maH wa’_tera’ jar wa’maH cha’'.split('_'),
    monthsShort : 'jar wa’_jar cha’_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar wa’maH_jar wa’maH wa’_jar wa’maH cha’'.split('_'),
    monthsParseExact : true,
    weekdays : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
    weekdaysShort : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
    weekdaysMin : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[DaHjaj] LT',
        nextDay: '[wa’leS] LT',
        nextWeek: 'LLL',
        lastDay: '[wa’Hu’] LT',
        lastWeek: 'LLL',
        sameElse: 'L'
    },
    relativeTime : {
        future : translateFuture,
        past : translatePast,
        s : 'puS lup',
        m : 'wa’ tup',
        mm : translate$9,
        h : 'wa’ rep',
        hh : translate$9,
        d : 'wa’ jaj',
        dd : translate$9,
        M : 'wa’ jar',
        MM : translate$9,
        y : 'wa’ DIS',
        yy : translate$9
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Turkish [tr]
//! authors : Erhan Gundogan : https://github.com/erhangundogan,
//!           Burak Yiğit Kaya: https://github.com/BYK

var suffixes$3 = {
    1: '\'inci',
    5: '\'inci',
    8: '\'inci',
    70: '\'inci',
    80: '\'inci',
    2: '\'nci',
    7: '\'nci',
    20: '\'nci',
    50: '\'nci',
    3: '\'üncü',
    4: '\'üncü',
    100: '\'üncü',
    6: '\'ncı',
    9: '\'uncu',
    10: '\'uncu',
    30: '\'uncu',
    60: '\'ıncı',
    90: '\'ıncı'
};

hooks.defineLocale('tr', {
    months : 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split('_'),
    monthsShort : 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
    weekdays : 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split('_'),
    weekdaysShort : 'Paz_Pts_Sal_Çar_Per_Cum_Cts'.split('_'),
    weekdaysMin : 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[bugün saat] LT',
        nextDay : '[yarın saat] LT',
        nextWeek : '[gelecek] dddd [saat] LT',
        lastDay : '[dün] LT',
        lastWeek : '[geçen] dddd [saat] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s sonra',
        past : '%s önce',
        s : 'birkaç saniye',
        m : 'bir dakika',
        mm : '%d dakika',
        h : 'bir saat',
        hh : '%d saat',
        d : 'bir gün',
        dd : '%d gün',
        M : 'bir ay',
        MM : '%d ay',
        y : 'bir yıl',
        yy : '%d yıl'
    },
    dayOfMonthOrdinalParse: /\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,
    ordinal : function (number) {
        if (number === 0) {  // special case for zero
            return number + '\'ıncı';
        }
        var a = number % 10,
            b = number % 100 - a,
            c = number >= 100 ? 100 : null;
        return number + (suffixes$3[a] || suffixes$3[b] || suffixes$3[c]);
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Talossan [tzl]
//! author : Robin van der Vliet : https://github.com/robin0van0der0v
//! author : Iustì Canun

// After the year there should be a slash and the amount of years since December 26, 1979 in Roman numerals.
// This is currently too difficult (maybe even impossible) to add.
hooks.defineLocale('tzl', {
    months : 'Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar'.split('_'),
    monthsShort : 'Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec'.split('_'),
    weekdays : 'Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi'.split('_'),
    weekdaysShort : 'Súl_Lún_Mai_Már_Xhú_Vié_Sát'.split('_'),
    weekdaysMin : 'Sú_Lú_Ma_Má_Xh_Vi_Sá'.split('_'),
    longDateFormat : {
        LT : 'HH.mm',
        LTS : 'HH.mm.ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM [dallas] YYYY',
        LLL : 'D. MMMM [dallas] YYYY HH.mm',
        LLLL : 'dddd, [li] D. MMMM [dallas] YYYY HH.mm'
    },
    meridiemParse: /d\'o|d\'a/i,
    isPM : function (input) {
        return 'd\'o' === input.toLowerCase();
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'd\'o' : 'D\'O';
        } else {
            return isLower ? 'd\'a' : 'D\'A';
        }
    },
    calendar : {
        sameDay : '[oxhi à] LT',
        nextDay : '[demà à] LT',
        nextWeek : 'dddd [à] LT',
        lastDay : '[ieiri à] LT',
        lastWeek : '[sür el] dddd [lasteu à] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'osprei %s',
        past : 'ja%s',
        s : processRelativeTime$7,
        m : processRelativeTime$7,
        mm : processRelativeTime$7,
        h : processRelativeTime$7,
        hh : processRelativeTime$7,
        d : processRelativeTime$7,
        dd : processRelativeTime$7,
        M : processRelativeTime$7,
        MM : processRelativeTime$7,
        y : processRelativeTime$7,
        yy : processRelativeTime$7
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

function processRelativeTime$7(number, withoutSuffix, key, isFuture) {
    var format = {
        's': ['viensas secunds', '\'iensas secunds'],
        'm': ['\'n míut', '\'iens míut'],
        'mm': [number + ' míuts', '' + number + ' míuts'],
        'h': ['\'n þora', '\'iensa þora'],
        'hh': [number + ' þoras', '' + number + ' þoras'],
        'd': ['\'n ziua', '\'iensa ziua'],
        'dd': [number + ' ziuas', '' + number + ' ziuas'],
        'M': ['\'n mes', '\'iens mes'],
        'MM': [number + ' mesen', '' + number + ' mesen'],
        'y': ['\'n ar', '\'iens ar'],
        'yy': [number + ' ars', '' + number + ' ars']
    };
    return isFuture ? format[key][0] : (withoutSuffix ? format[key][0] : format[key][1]);
}

//! moment.js locale configuration
//! locale : Central Atlas Tamazight Latin [tzm-latn]
//! author : Abdel Said : https://github.com/abdelsaid

hooks.defineLocale('tzm-latn', {
    months : 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
    monthsShort : 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
    weekdays : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
    weekdaysShort : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
    weekdaysMin : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[asdkh g] LT',
        nextDay: '[aska g] LT',
        nextWeek: 'dddd [g] LT',
        lastDay: '[assant g] LT',
        lastWeek: 'dddd [g] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'dadkh s yan %s',
        past : 'yan %s',
        s : 'imik',
        m : 'minuḍ',
        mm : '%d minuḍ',
        h : 'saɛa',
        hh : '%d tassaɛin',
        d : 'ass',
        dd : '%d ossan',
        M : 'ayowr',
        MM : '%d iyyirn',
        y : 'asgas',
        yy : '%d isgasn'
    },
    week : {
        dow : 6, // Saturday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Central Atlas Tamazight [tzm]
//! author : Abdel Said : https://github.com/abdelsaid

hooks.defineLocale('tzm', {
    months : 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
    monthsShort : 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
    weekdays : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
    weekdaysShort : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
    weekdaysMin : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS: 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[ⴰⵙⴷⵅ ⴴ] LT',
        nextDay: '[ⴰⵙⴽⴰ ⴴ] LT',
        nextWeek: 'dddd [ⴴ] LT',
        lastDay: '[ⴰⵚⴰⵏⵜ ⴴ] LT',
        lastWeek: 'dddd [ⴴ] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s',
        past : 'ⵢⴰⵏ %s',
        s : 'ⵉⵎⵉⴽ',
        m : 'ⵎⵉⵏⵓⴺ',
        mm : '%d ⵎⵉⵏⵓⴺ',
        h : 'ⵙⴰⵄⴰ',
        hh : '%d ⵜⴰⵙⵙⴰⵄⵉⵏ',
        d : 'ⴰⵙⵙ',
        dd : '%d oⵙⵙⴰⵏ',
        M : 'ⴰⵢoⵓⵔ',
        MM : '%d ⵉⵢⵢⵉⵔⵏ',
        y : 'ⴰⵙⴳⴰⵙ',
        yy : '%d ⵉⵙⴳⴰⵙⵏ'
    },
    week : {
        dow : 6, // Saturday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Ukrainian [uk]
//! author : zemlanin : https://github.com/zemlanin
//! Author : Menelion Elensúle : https://github.com/Oire

function plural$6(word, num) {
    var forms = word.split('_');
    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
}
function relativeTimeWithPlural$4(number, withoutSuffix, key) {
    var format = {
        'mm': withoutSuffix ? 'хвилина_хвилини_хвилин' : 'хвилину_хвилини_хвилин',
        'hh': withoutSuffix ? 'година_години_годин' : 'годину_години_годин',
        'dd': 'день_дні_днів',
        'MM': 'місяць_місяці_місяців',
        'yy': 'рік_роки_років'
    };
    if (key === 'm') {
        return withoutSuffix ? 'хвилина' : 'хвилину';
    }
    else if (key === 'h') {
        return withoutSuffix ? 'година' : 'годину';
    }
    else {
        return number + ' ' + plural$6(format[key], +number);
    }
}
function weekdaysCaseReplace(m, format) {
    var weekdays = {
        'nominative': 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
        'accusative': 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_'),
        'genitive': 'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split('_')
    };

    if (!m) {
        return weekdays['nominative'];
    }

    var nounCase = (/(\[[ВвУу]\]) ?dddd/).test(format) ?
        'accusative' :
        ((/\[?(?:минулої|наступної)? ?\] ?dddd/).test(format) ?
            'genitive' :
            'nominative');
    return weekdays[nounCase][m.day()];
}
function processHoursFunction(str) {
    return function () {
        return str + 'о' + (this.hours() === 11 ? 'б' : '') + '] LT';
    };
}

hooks.defineLocale('uk', {
    months : {
        'format': 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_'),
        'standalone': 'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_')
    },
    monthsShort : 'січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд'.split('_'),
    weekdays : weekdaysCaseReplace,
    weekdaysShort : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
    weekdaysMin : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY р.',
        LLL : 'D MMMM YYYY р., HH:mm',
        LLLL : 'dddd, D MMMM YYYY р., HH:mm'
    },
    calendar : {
        sameDay: processHoursFunction('[Сьогодні '),
        nextDay: processHoursFunction('[Завтра '),
        lastDay: processHoursFunction('[Вчора '),
        nextWeek: processHoursFunction('[У] dddd ['),
        lastWeek: function () {
            switch (this.day()) {
                case 0:
                case 3:
                case 5:
                case 6:
                    return processHoursFunction('[Минулої] dddd [').call(this);
                case 1:
                case 2:
                case 4:
                    return processHoursFunction('[Минулого] dddd [').call(this);
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'за %s',
        past : '%s тому',
        s : 'декілька секунд',
        m : relativeTimeWithPlural$4,
        mm : relativeTimeWithPlural$4,
        h : 'годину',
        hh : relativeTimeWithPlural$4,
        d : 'день',
        dd : relativeTimeWithPlural$4,
        M : 'місяць',
        MM : relativeTimeWithPlural$4,
        y : 'рік',
        yy : relativeTimeWithPlural$4
    },
    // M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason
    meridiemParse: /ночі|ранку|дня|вечора/,
    isPM: function (input) {
        return /^(дня|вечора)$/.test(input);
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'ночі';
        } else if (hour < 12) {
            return 'ранку';
        } else if (hour < 17) {
            return 'дня';
        } else {
            return 'вечора';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(й|го)/,
    ordinal: function (number, period) {
        switch (period) {
            case 'M':
            case 'd':
            case 'DDD':
            case 'w':
            case 'W':
                return number + '-й';
            case 'D':
                return number + '-го';
            default:
                return number;
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Urdu [ur]
//! author : Sawood Alam : https://github.com/ibnesayeed
//! author : Zack : https://github.com/ZackVision

var months$8 = [
    'جنوری',
    'فروری',
    'مارچ',
    'اپریل',
    'مئی',
    'جون',
    'جولائی',
    'اگست',
    'ستمبر',
    'اکتوبر',
    'نومبر',
    'دسمبر'
];
var days$2 = [
    'اتوار',
    'پیر',
    'منگل',
    'بدھ',
    'جمعرات',
    'جمعہ',
    'ہفتہ'
];

hooks.defineLocale('ur', {
    months : months$8,
    monthsShort : months$8,
    weekdays : days$2,
    weekdaysShort : days$2,
    weekdaysMin : days$2,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd، D MMMM YYYY HH:mm'
    },
    meridiemParse: /صبح|شام/,
    isPM : function (input) {
        return 'شام' === input;
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'صبح';
        }
        return 'شام';
    },
    calendar : {
        sameDay : '[آج بوقت] LT',
        nextDay : '[کل بوقت] LT',
        nextWeek : 'dddd [بوقت] LT',
        lastDay : '[گذشتہ روز بوقت] LT',
        lastWeek : '[گذشتہ] dddd [بوقت] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s بعد',
        past : '%s قبل',
        s : 'چند سیکنڈ',
        m : 'ایک منٹ',
        mm : '%d منٹ',
        h : 'ایک گھنٹہ',
        hh : '%d گھنٹے',
        d : 'ایک دن',
        dd : '%d دن',
        M : 'ایک ماہ',
        MM : '%d ماہ',
        y : 'ایک سال',
        yy : '%d سال'
    },
    preparse: function (string) {
        return string.replace(/،/g, ',');
    },
    postformat: function (string) {
        return string.replace(/,/g, '،');
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Uzbek Latin [uz-latn]
//! author : Rasulbek Mirzayev : github.com/Rasulbeeek

hooks.defineLocale('uz-latn', {
    months : 'Yanvar_Fevral_Mart_Aprel_May_Iyun_Iyul_Avgust_Sentabr_Oktabr_Noyabr_Dekabr'.split('_'),
    monthsShort : 'Yan_Fev_Mar_Apr_May_Iyun_Iyul_Avg_Sen_Okt_Noy_Dek'.split('_'),
    weekdays : 'Yakshanba_Dushanba_Seshanba_Chorshanba_Payshanba_Juma_Shanba'.split('_'),
    weekdaysShort : 'Yak_Dush_Sesh_Chor_Pay_Jum_Shan'.split('_'),
    weekdaysMin : 'Ya_Du_Se_Cho_Pa_Ju_Sha'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'D MMMM YYYY, dddd HH:mm'
    },
    calendar : {
        sameDay : '[Bugun soat] LT [da]',
        nextDay : '[Ertaga] LT [da]',
        nextWeek : 'dddd [kuni soat] LT [da]',
        lastDay : '[Kecha soat] LT [da]',
        lastWeek : '[O\'tgan] dddd [kuni soat] LT [da]',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'Yaqin %s ichida',
        past : 'Bir necha %s oldin',
        s : 'soniya',
        m : 'bir daqiqa',
        mm : '%d daqiqa',
        h : 'bir soat',
        hh : '%d soat',
        d : 'bir kun',
        dd : '%d kun',
        M : 'bir oy',
        MM : '%d oy',
        y : 'bir yil',
        yy : '%d yil'
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Uzbek [uz]
//! author : Sardor Muminov : https://github.com/muminoff

hooks.defineLocale('uz', {
    months : 'январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр'.split('_'),
    monthsShort : 'янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек'.split('_'),
    weekdays : 'Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба'.split('_'),
    weekdaysShort : 'Якш_Душ_Сеш_Чор_Пай_Жум_Шан'.split('_'),
    weekdaysMin : 'Як_Ду_Се_Чо_Па_Жу_Ша'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'D MMMM YYYY, dddd HH:mm'
    },
    calendar : {
        sameDay : '[Бугун соат] LT [да]',
        nextDay : '[Эртага] LT [да]',
        nextWeek : 'dddd [куни соат] LT [да]',
        lastDay : '[Кеча соат] LT [да]',
        lastWeek : '[Утган] dddd [куни соат] LT [да]',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'Якин %s ичида',
        past : 'Бир неча %s олдин',
        s : 'фурсат',
        m : 'бир дакика',
        mm : '%d дакика',
        h : 'бир соат',
        hh : '%d соат',
        d : 'бир кун',
        dd : '%d кун',
        M : 'бир ой',
        MM : '%d ой',
        y : 'бир йил',
        yy : '%d йил'
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Vietnamese [vi]
//! author : Bang Nguyen : https://github.com/bangnk

hooks.defineLocale('vi', {
    months : 'tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12'.split('_'),
    monthsShort : 'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split('_'),
    monthsParseExact : true,
    weekdays : 'chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy'.split('_'),
    weekdaysShort : 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
    weekdaysMin : 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
    weekdaysParseExact : true,
    meridiemParse: /sa|ch/i,
    isPM : function (input) {
        return /^ch$/i.test(input);
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 12) {
            return isLower ? 'sa' : 'SA';
        } else {
            return isLower ? 'ch' : 'CH';
        }
    },
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM [năm] YYYY',
        LLL : 'D MMMM [năm] YYYY HH:mm',
        LLLL : 'dddd, D MMMM [năm] YYYY HH:mm',
        l : 'DD/M/YYYY',
        ll : 'D MMM YYYY',
        lll : 'D MMM YYYY HH:mm',
        llll : 'ddd, D MMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[Hôm nay lúc] LT',
        nextDay: '[Ngày mai lúc] LT',
        nextWeek: 'dddd [tuần tới lúc] LT',
        lastDay: '[Hôm qua lúc] LT',
        lastWeek: 'dddd [tuần rồi lúc] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : '%s tới',
        past : '%s trước',
        s : 'vài giây',
        m : 'một phút',
        mm : '%d phút',
        h : 'một giờ',
        hh : '%d giờ',
        d : 'một ngày',
        dd : '%d ngày',
        M : 'một tháng',
        MM : '%d tháng',
        y : 'một năm',
        yy : '%d năm'
    },
    dayOfMonthOrdinalParse: /\d{1,2}/,
    ordinal : function (number) {
        return number;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Pseudo [x-pseudo]
//! author : Andrew Hood : https://github.com/andrewhood125

hooks.defineLocale('x-pseudo', {
    months : 'J~áñúá~rý_F~ébrú~árý_~Márc~h_Áp~ríl_~Máý_~Júñé~_Júl~ý_Áú~gúst~_Sép~témb~ér_Ó~ctób~ér_Ñ~óvém~bér_~Décé~mbér'.split('_'),
    monthsShort : 'J~áñ_~Féb_~Már_~Ápr_~Máý_~Júñ_~Júl_~Áúg_~Sép_~Óct_~Ñóv_~Déc'.split('_'),
    monthsParseExact : true,
    weekdays : 'S~úñdá~ý_Mó~ñdáý~_Túé~sdáý~_Wéd~ñésd~áý_T~húrs~dáý_~Fríd~áý_S~átúr~dáý'.split('_'),
    weekdaysShort : 'S~úñ_~Móñ_~Túé_~Wéd_~Thú_~Frí_~Sát'.split('_'),
    weekdaysMin : 'S~ú_Mó~_Tú_~Wé_T~h_Fr~_Sá'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[T~ódá~ý át] LT',
        nextDay : '[T~ómó~rró~w át] LT',
        nextWeek : 'dddd [át] LT',
        lastDay : '[Ý~ést~érdá~ý át] LT',
        lastWeek : '[L~ást] dddd [át] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'í~ñ %s',
        past : '%s á~gó',
        s : 'á ~féw ~sécó~ñds',
        m : 'á ~míñ~úté',
        mm : '%d m~íñú~tés',
        h : 'á~ñ hó~úr',
        hh : '%d h~óúrs',
        d : 'á ~dáý',
        dd : '%d d~áýs',
        M : 'á ~móñ~th',
        MM : '%d m~óñt~hs',
        y : 'á ~ýéár',
        yy : '%d ý~éárs'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Yoruba Nigeria [yo]
//! author : Atolagbe Abisoye : https://github.com/andela-batolagbe

hooks.defineLocale('yo', {
    months : 'Sẹ́rẹ́_Èrèlè_Ẹrẹ̀nà_Ìgbé_Èbibi_Òkùdu_Agẹmo_Ògún_Owewe_Ọ̀wàrà_Bélú_Ọ̀pẹ̀̀'.split('_'),
    monthsShort : 'Sẹ́r_Èrl_Ẹrn_Ìgb_Èbi_Òkù_Agẹ_Ògú_Owe_Ọ̀wà_Bél_Ọ̀pẹ̀̀'.split('_'),
    weekdays : 'Àìkú_Ajé_Ìsẹ́gun_Ọjọ́rú_Ọjọ́bọ_Ẹtì_Àbámẹ́ta'.split('_'),
    weekdaysShort : 'Àìk_Ajé_Ìsẹ́_Ọjr_Ọjb_Ẹtì_Àbá'.split('_'),
    weekdaysMin : 'Àì_Aj_Ìs_Ọr_Ọb_Ẹt_Àb'.split('_'),
    longDateFormat : {
        LT : 'h:mm A',
        LTS : 'h:mm:ss A',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY h:mm A',
        LLLL : 'dddd, D MMMM YYYY h:mm A'
    },
    calendar : {
        sameDay : '[Ònì ni] LT',
        nextDay : '[Ọ̀la ni] LT',
        nextWeek : 'dddd [Ọsẹ̀ tón\'bọ] [ni] LT',
        lastDay : '[Àna ni] LT',
        lastWeek : 'dddd [Ọsẹ̀ tólọ́] [ni] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'ní %s',
        past : '%s kọjá',
        s : 'ìsẹjú aayá die',
        m : 'ìsẹjú kan',
        mm : 'ìsẹjú %d',
        h : 'wákati kan',
        hh : 'wákati %d',
        d : 'ọjọ́ kan',
        dd : 'ọjọ́ %d',
        M : 'osù kan',
        MM : 'osù %d',
        y : 'ọdún kan',
        yy : 'ọdún %d'
    },
    dayOfMonthOrdinalParse : /ọjọ́\s\d{1,2}/,
    ordinal : 'ọjọ́ %d',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4 // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Chinese (China) [zh-cn]
//! author : suupic : https://github.com/suupic
//! author : Zeno Zeng : https://github.com/zenozeng

hooks.defineLocale('zh-cn', {
    months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY年MMMD日',
        LL : 'YYYY年MMMD日',
        LLL : 'YYYY年MMMD日Ah点mm分',
        LLLL : 'YYYY年MMMD日ddddAh点mm分',
        l : 'YYYY年MMMD日',
        ll : 'YYYY年MMMD日',
        lll : 'YYYY年MMMD日 HH:mm',
        llll : 'YYYY年MMMD日dddd HH:mm'
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour: function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === '凌晨' || meridiem === '早上' ||
                meridiem === '上午') {
            return hour;
        } else if (meridiem === '下午' || meridiem === '晚上') {
            return hour + 12;
        } else {
            // '中午'
            return hour >= 11 ? hour : hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        var hm = hour * 100 + minute;
        if (hm < 600) {
            return '凌晨';
        } else if (hm < 900) {
            return '早上';
        } else if (hm < 1130) {
            return '上午';
        } else if (hm < 1230) {
            return '中午';
        } else if (hm < 1800) {
            return '下午';
        } else {
            return '晚上';
        }
    },
    calendar : {
        sameDay : '[今天]LT',
        nextDay : '[明天]LT',
        nextWeek : '[下]ddddLT',
        lastDay : '[昨天]LT',
        lastWeek : '[上]ddddLT',
        sameElse : 'L'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
    ordinal : function (number, period) {
        switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return number + '日';
            case 'M':
                return number + '月';
            case 'w':
            case 'W':
                return number + '周';
            default:
                return number;
        }
    },
    relativeTime : {
        future : '%s内',
        past : '%s前',
        s : '几秒',
        m : '1 分钟',
        mm : '%d 分钟',
        h : '1 小时',
        hh : '%d 小时',
        d : '1 天',
        dd : '%d 天',
        M : '1 个月',
        MM : '%d 个月',
        y : '1 年',
        yy : '%d 年'
    },
    week : {
        // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

//! moment.js locale configuration
//! locale : Chinese (Hong Kong) [zh-hk]
//! author : Ben : https://github.com/ben-lin
//! author : Chris Lam : https://github.com/hehachris
//! author : Konstantin : https://github.com/skfd

hooks.defineLocale('zh-hk', {
    months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort : '週日_週一_週二_週三_週四_週五_週六'.split('_'),
    weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY年MMMD日',
        LL : 'YYYY年MMMD日',
        LLL : 'YYYY年MMMD日 HH:mm',
        LLLL : 'YYYY年MMMD日dddd HH:mm',
        l : 'YYYY年MMMD日',
        ll : 'YYYY年MMMD日',
        lll : 'YYYY年MMMD日 HH:mm',
        llll : 'YYYY年MMMD日dddd HH:mm'
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
            return hour;
        } else if (meridiem === '中午') {
            return hour >= 11 ? hour : hour + 12;
        } else if (meridiem === '下午' || meridiem === '晚上') {
            return hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        var hm = hour * 100 + minute;
        if (hm < 600) {
            return '凌晨';
        } else if (hm < 900) {
            return '早上';
        } else if (hm < 1130) {
            return '上午';
        } else if (hm < 1230) {
            return '中午';
        } else if (hm < 1800) {
            return '下午';
        } else {
            return '晚上';
        }
    },
    calendar : {
        sameDay : '[今天]LT',
        nextDay : '[明天]LT',
        nextWeek : '[下]ddddLT',
        lastDay : '[昨天]LT',
        lastWeek : '[上]ddddLT',
        sameElse : 'L'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
    ordinal : function (number, period) {
        switch (period) {
            case 'd' :
            case 'D' :
            case 'DDD' :
                return number + '日';
            case 'M' :
                return number + '月';
            case 'w' :
            case 'W' :
                return number + '週';
            default :
                return number;
        }
    },
    relativeTime : {
        future : '%s內',
        past : '%s前',
        s : '幾秒',
        m : '1 分鐘',
        mm : '%d 分鐘',
        h : '1 小時',
        hh : '%d 小時',
        d : '1 天',
        dd : '%d 天',
        M : '1 個月',
        MM : '%d 個月',
        y : '1 年',
        yy : '%d 年'
    }
});

//! moment.js locale configuration
//! locale : Chinese (Taiwan) [zh-tw]
//! author : Ben : https://github.com/ben-lin
//! author : Chris Lam : https://github.com/hehachris

hooks.defineLocale('zh-tw', {
    months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort : '週日_週一_週二_週三_週四_週五_週六'.split('_'),
    weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY年MMMD日',
        LL : 'YYYY年MMMD日',
        LLL : 'YYYY年MMMD日 HH:mm',
        LLLL : 'YYYY年MMMD日dddd HH:mm',
        l : 'YYYY年MMMD日',
        ll : 'YYYY年MMMD日',
        lll : 'YYYY年MMMD日 HH:mm',
        llll : 'YYYY年MMMD日dddd HH:mm'
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
            return hour;
        } else if (meridiem === '中午') {
            return hour >= 11 ? hour : hour + 12;
        } else if (meridiem === '下午' || meridiem === '晚上') {
            return hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        var hm = hour * 100 + minute;
        if (hm < 600) {
            return '凌晨';
        } else if (hm < 900) {
            return '早上';
        } else if (hm < 1130) {
            return '上午';
        } else if (hm < 1230) {
            return '中午';
        } else if (hm < 1800) {
            return '下午';
        } else {
            return '晚上';
        }
    },
    calendar : {
        sameDay : '[今天]LT',
        nextDay : '[明天]LT',
        nextWeek : '[下]ddddLT',
        lastDay : '[昨天]LT',
        lastWeek : '[上]ddddLT',
        sameElse : 'L'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
    ordinal : function (number, period) {
        switch (period) {
            case 'd' :
            case 'D' :
            case 'DDD' :
                return number + '日';
            case 'M' :
                return number + '月';
            case 'w' :
            case 'W' :
                return number + '週';
            default :
                return number;
        }
    },
    relativeTime : {
        future : '%s內',
        past : '%s前',
        s : '幾秒',
        m : '1 分鐘',
        mm : '%d 分鐘',
        h : '1 小時',
        hh : '%d 小時',
        d : '1 天',
        dd : '%d 天',
        M : '1 個月',
        MM : '%d 個月',
        y : '1 年',
        yy : '%d 年'
    }
});

hooks.locale('en');

return hooks;

})));

},{}]},{},[1])(1)
});;(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.catholicHolidays = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
});;/*!
 * Vue.js v2.3.3
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Vue=t()}(this,function(){"use strict";function e(e){return void 0===e||null===e}function t(e){return void 0!==e&&null!==e}function n(e){return!0===e}function r(e){return!1===e}function i(e){return"string"==typeof e||"number"==typeof e}function o(e){return null!==e&&"object"==typeof e}function a(e){return"[object Object]"===Ti.call(e)}function s(e){return"[object RegExp]"===Ti.call(e)}function c(e){return null==e?"":"object"==typeof e?JSON.stringify(e,null,2):String(e)}function u(e){var t=parseFloat(e);return isNaN(t)?e:t}function l(e,t){for(var n=Object.create(null),r=e.split(","),i=0;i<r.length;i++)n[r[i]]=!0;return t?function(e){return n[e.toLowerCase()]}:function(e){return n[e]}}function f(e,t){if(e.length){var n=e.indexOf(t);if(n>-1)return e.splice(n,1)}}function p(e,t){return ji.call(e,t)}function d(e){var t=Object.create(null);return function(n){return t[n]||(t[n]=e(n))}}function v(e,t){function n(n){var r=arguments.length;return r?r>1?e.apply(t,arguments):e.call(t,n):e.call(t)}return n._length=e.length,n}function h(e,t){t=t||0;for(var n=e.length-t,r=new Array(n);n--;)r[n]=e[n+t];return r}function m(e,t){for(var n in t)e[n]=t[n];return e}function g(e){for(var t={},n=0;n<e.length;n++)e[n]&&m(t,e[n]);return t}function y(){}function _(e,t){var n=o(e),r=o(t);if(!n||!r)return!n&&!r&&String(e)===String(t);try{return JSON.stringify(e)===JSON.stringify(t)}catch(n){return e===t}}function b(e,t){for(var n=0;n<e.length;n++)if(_(e[n],t))return n;return-1}function $(e){var t=!1;return function(){t||(t=!0,e.apply(this,arguments))}}function C(e){var t=(e+"").charCodeAt(0);return 36===t||95===t}function x(e,t,n,r){Object.defineProperty(e,t,{value:n,enumerable:!!r,writable:!0,configurable:!0})}function w(e){if(!Ui.test(e)){var t=e.split(".");return function(e){for(var n=0;n<t.length;n++){if(!e)return;e=e[t[n]]}return e}}}function k(e,t,n){if(Bi.errorHandler)Bi.errorHandler.call(null,e,t,n);else{if(!Ji||"undefined"==typeof console)throw e;console.error(e)}}function A(e){return"function"==typeof e&&/native code/.test(e.toString())}function O(e){co.target&&uo.push(co.target),co.target=e}function S(){co.target=uo.pop()}function T(e,t){e.__proto__=t}function E(e,t,n){for(var r=0,i=n.length;r<i;r++){var o=n[r];x(e,o,t[o])}}function j(e,t){if(o(e)){var n;return p(e,"__ob__")&&e.__ob__ instanceof ho?n=e.__ob__:vo.shouldConvert&&!ro()&&(Array.isArray(e)||a(e))&&Object.isExtensible(e)&&!e._isVue&&(n=new ho(e)),t&&n&&n.vmCount++,n}}function N(e,t,n,r){var i=new co,o=Object.getOwnPropertyDescriptor(e,t);if(!o||!1!==o.configurable){var a=o&&o.get,s=o&&o.set,c=j(n);Object.defineProperty(e,t,{enumerable:!0,configurable:!0,get:function(){var t=a?a.call(e):n;return co.target&&(i.depend(),c&&c.dep.depend(),Array.isArray(t)&&D(t)),t},set:function(t){var r=a?a.call(e):n;t===r||t!==t&&r!==r||(s?s.call(e,t):n=t,c=j(t),i.notify())}})}}function L(e,t,n){if(Array.isArray(e)&&"number"==typeof t)return e.length=Math.max(e.length,t),e.splice(t,1,n),n;if(p(e,t))return e[t]=n,n;var r=e.__ob__;return e._isVue||r&&r.vmCount?n:r?(N(r.value,t,n),r.dep.notify(),n):(e[t]=n,n)}function I(e,t){if(Array.isArray(e)&&"number"==typeof t)return void e.splice(t,1);var n=e.__ob__;e._isVue||n&&n.vmCount||p(e,t)&&(delete e[t],n&&n.dep.notify())}function D(e){for(var t=void 0,n=0,r=e.length;n<r;n++)t=e[n],t&&t.__ob__&&t.__ob__.dep.depend(),Array.isArray(t)&&D(t)}function M(e,t){if(!t)return e;for(var n,r,i,o=Object.keys(t),s=0;s<o.length;s++)n=o[s],r=e[n],i=t[n],p(e,n)?a(r)&&a(i)&&M(r,i):L(e,n,i);return e}function P(e,t){return t?e?e.concat(t):Array.isArray(t)?t:[t]:e}function R(e,t){var n=Object.create(e||null);return t?m(n,t):n}function F(e){var t=e.props;if(t){var n,r,i,o={};if(Array.isArray(t))for(n=t.length;n--;)"string"==typeof(r=t[n])&&(i=Ni(r),o[i]={type:null});else if(a(t))for(var s in t)r=t[s],i=Ni(s),o[i]=a(r)?r:{type:r};e.props=o}}function B(e){var t=e.directives;if(t)for(var n in t){var r=t[n];"function"==typeof r&&(t[n]={bind:r,update:r})}}function H(e,t,n){function r(r){var i=mo[r]||go;c[r]=i(e[r],t[r],n,r)}"function"==typeof t&&(t=t.options),F(t),B(t);var i=t.extends;if(i&&(e=H(e,i,n)),t.mixins)for(var o=0,a=t.mixins.length;o<a;o++)e=H(e,t.mixins[o],n);var s,c={};for(s in e)r(s);for(s in t)p(e,s)||r(s);return c}function U(e,t,n,r){if("string"==typeof n){var i=e[t];if(p(i,n))return i[n];var o=Ni(n);if(p(i,o))return i[o];var a=Li(o);if(p(i,a))return i[a];var s=i[n]||i[o]||i[a];return s}}function V(e,t,n,r){var i=t[e],o=!p(n,e),a=n[e];if(K(Boolean,i.type)&&(o&&!p(i,"default")?a=!1:K(String,i.type)||""!==a&&a!==Ii(e)||(a=!0)),void 0===a){a=z(r,i,e);var s=vo.shouldConvert;vo.shouldConvert=!0,j(a),vo.shouldConvert=s}return a}function z(e,t,n){if(p(t,"default")){var r=t.default;return e&&e.$options.propsData&&void 0===e.$options.propsData[n]&&void 0!==e._props[n]?e._props[n]:"function"==typeof r&&"Function"!==J(t.type)?r.call(e):r}}function J(e){var t=e&&e.toString().match(/^\s*function (\w+)/);return t?t[1]:""}function K(e,t){if(!Array.isArray(t))return J(t)===J(e);for(var n=0,r=t.length;n<r;n++)if(J(t[n])===J(e))return!0;return!1}function q(e){return new yo(void 0,void 0,void 0,String(e))}function W(e){var t=new yo(e.tag,e.data,e.children,e.text,e.elm,e.context,e.componentOptions);return t.ns=e.ns,t.isStatic=e.isStatic,t.key=e.key,t.isComment=e.isComment,t.isCloned=!0,t}function Z(e){for(var t=e.length,n=new Array(t),r=0;r<t;r++)n[r]=W(e[r]);return n}function G(e){function t(){var e=arguments,n=t.fns;if(!Array.isArray(n))return n.apply(null,arguments);for(var r=0;r<n.length;r++)n[r].apply(null,e)}return t.fns=e,t}function Y(t,n,r,i,o){var a,s,c,u;for(a in t)s=t[a],c=n[a],u=Co(a),e(s)||(e(c)?(e(s.fns)&&(s=t[a]=G(s)),r(u.name,s,u.once,u.capture,u.passive)):s!==c&&(c.fns=s,t[a]=c));for(a in n)e(t[a])&&(u=Co(a),i(u.name,n[a],u.capture))}function Q(r,i,o){function a(){o.apply(this,arguments),f(s.fns,a)}var s,c=r[i];e(c)?s=G([a]):t(c.fns)&&n(c.merged)?(s=c,s.fns.push(a)):s=G([c,a]),s.merged=!0,r[i]=s}function X(n,r,i){var o=r.options.props;if(!e(o)){var a={},s=n.attrs,c=n.props;if(t(s)||t(c))for(var u in o){var l=Ii(u);ee(a,c,u,l,!0)||ee(a,s,u,l,!1)}return a}}function ee(e,n,r,i,o){if(t(n)){if(p(n,r))return e[r]=n[r],o||delete n[r],!0;if(p(n,i))return e[r]=n[i],o||delete n[i],!0}return!1}function te(e){for(var t=0;t<e.length;t++)if(Array.isArray(e[t]))return Array.prototype.concat.apply([],e);return e}function ne(e){return i(e)?[q(e)]:Array.isArray(e)?ie(e):void 0}function re(e){return t(e)&&t(e.text)&&r(e.isComment)}function ie(r,o){var a,s,c,u=[];for(a=0;a<r.length;a++)s=r[a],e(s)||"boolean"==typeof s||(c=u[u.length-1],Array.isArray(s)?u.push.apply(u,ie(s,(o||"")+"_"+a)):i(s)?re(c)?c.text+=String(s):""!==s&&u.push(q(s)):re(s)&&re(c)?u[u.length-1]=q(c.text+s.text):(n(r._isVList)&&t(s.tag)&&e(s.key)&&t(o)&&(s.key="__vlist"+o+"_"+a+"__"),u.push(s)));return u}function oe(e,t){return o(e)?t.extend(e):e}function ae(r,i,a){if(n(r.error)&&t(r.errorComp))return r.errorComp;if(t(r.resolved))return r.resolved;if(n(r.loading)&&t(r.loadingComp))return r.loadingComp;if(!t(r.contexts)){var s=r.contexts=[a],c=!0,u=function(){for(var e=0,t=s.length;e<t;e++)s[e].$forceUpdate()},l=$(function(e){r.resolved=oe(e,i),c||u()}),f=$(function(e){t(r.errorComp)&&(r.error=!0,u())}),p=r(l,f);return o(p)&&("function"==typeof p.then?e(r.resolved)&&p.then(l,f):t(p.component)&&"function"==typeof p.component.then&&(p.component.then(l,f),t(p.error)&&(r.errorComp=oe(p.error,i)),t(p.loading)&&(r.loadingComp=oe(p.loading,i),0===p.delay?r.loading=!0:setTimeout(function(){e(r.resolved)&&e(r.error)&&(r.loading=!0,u())},p.delay||200)),t(p.timeout)&&setTimeout(function(){e(r.resolved)&&f(null)},p.timeout))),c=!1,r.loading?r.loadingComp:r.resolved}r.contexts.push(a)}function se(e){if(Array.isArray(e))for(var n=0;n<e.length;n++){var r=e[n];if(t(r)&&t(r.componentOptions))return r}}function ce(e){e._events=Object.create(null),e._hasHookEvent=!1;var t=e.$options._parentListeners;t&&fe(e,t)}function ue(e,t,n){n?bo.$once(e,t):bo.$on(e,t)}function le(e,t){bo.$off(e,t)}function fe(e,t,n){bo=e,Y(t,n||{},ue,le,e)}function pe(e,t){var n={};if(!e)return n;for(var r=[],i=0,o=e.length;i<o;i++){var a=e[i];if(a.context!==t&&a.functionalContext!==t||!a.data||null==a.data.slot)r.push(a);else{var s=a.data.slot,c=n[s]||(n[s]=[]);"template"===a.tag?c.push.apply(c,a.children):c.push(a)}}return r.every(de)||(n.default=r),n}function de(e){return e.isComment||" "===e.text}function ve(e,t){t=t||{};for(var n=0;n<e.length;n++)Array.isArray(e[n])?ve(e[n],t):t[e[n].key]=e[n].fn;return t}function he(e){var t=e.$options,n=t.parent;if(n&&!t.abstract){for(;n.$options.abstract&&n.$parent;)n=n.$parent;n.$children.push(e)}e.$parent=n,e.$root=n?n.$root:e,e.$children=[],e.$refs={},e._watcher=null,e._inactive=null,e._directInactive=!1,e._isMounted=!1,e._isDestroyed=!1,e._isBeingDestroyed=!1}function me(e,t,n){e.$el=t,e.$options.render||(e.$options.render=$o),$e(e,"beforeMount");var r;return r=function(){e._update(e._render(),n)},e._watcher=new jo(e,r,y),n=!1,null==e.$vnode&&(e._isMounted=!0,$e(e,"mounted")),e}function ge(e,t,n,r,i){var o=!!(i||e.$options._renderChildren||r.data.scopedSlots||e.$scopedSlots!==Hi);if(e.$options._parentVnode=r,e.$vnode=r,e._vnode&&(e._vnode.parent=r),e.$options._renderChildren=i,t&&e.$options.props){vo.shouldConvert=!1;for(var a=e._props,s=e.$options._propKeys||[],c=0;c<s.length;c++){var u=s[c];a[u]=V(u,e.$options.props,t,e)}vo.shouldConvert=!0,e.$options.propsData=t}if(n){var l=e.$options._parentListeners;e.$options._parentListeners=n,fe(e,n,l)}o&&(e.$slots=pe(i,r.context),e.$forceUpdate())}function ye(e){for(;e&&(e=e.$parent);)if(e._inactive)return!0;return!1}function _e(e,t){if(t){if(e._directInactive=!1,ye(e))return}else if(e._directInactive)return;if(e._inactive||null===e._inactive){e._inactive=!1;for(var n=0;n<e.$children.length;n++)_e(e.$children[n]);$e(e,"activated")}}function be(e,t){if(!(t&&(e._directInactive=!0,ye(e))||e._inactive)){e._inactive=!0;for(var n=0;n<e.$children.length;n++)be(e.$children[n]);$e(e,"deactivated")}}function $e(e,t){var n=e.$options[t];if(n)for(var r=0,i=n.length;r<i;r++)try{n[r].call(e)}catch(n){k(n,e,t+" hook")}e._hasHookEvent&&e.$emit("hook:"+t)}function Ce(){To=wo.length=ko.length=0,Ao={},Oo=So=!1}function xe(){So=!0;var e,t;for(wo.sort(function(e,t){return e.id-t.id}),To=0;To<wo.length;To++)e=wo[To],t=e.id,Ao[t]=null,e.run();var n=ko.slice(),r=wo.slice();Ce(),Ae(n),we(r),io&&Bi.devtools&&io.emit("flush")}function we(e){for(var t=e.length;t--;){var n=e[t],r=n.vm;r._watcher===n&&r._isMounted&&$e(r,"updated")}}function ke(e){e._inactive=!1,ko.push(e)}function Ae(e){for(var t=0;t<e.length;t++)e[t]._inactive=!0,_e(e[t],!0)}function Oe(e){var t=e.id;if(null==Ao[t]){if(Ao[t]=!0,So){for(var n=wo.length-1;n>To&&wo[n].id>e.id;)n--;wo.splice(n+1,0,e)}else wo.push(e);Oo||(Oo=!0,ao(xe))}}function Se(e){No.clear(),Te(e,No)}function Te(e,t){var n,r,i=Array.isArray(e);if((i||o(e))&&Object.isExtensible(e)){if(e.__ob__){var a=e.__ob__.dep.id;if(t.has(a))return;t.add(a)}if(i)for(n=e.length;n--;)Te(e[n],t);else for(r=Object.keys(e),n=r.length;n--;)Te(e[r[n]],t)}}function Ee(e,t,n){Lo.get=function(){return this[t][n]},Lo.set=function(e){this[t][n]=e},Object.defineProperty(e,n,Lo)}function je(e){e._watchers=[];var t=e.$options;t.props&&Ne(e,t.props),t.methods&&Re(e,t.methods),t.data?Le(e):j(e._data={},!0),t.computed&&De(e,t.computed),t.watch&&Fe(e,t.watch)}function Ne(e,t){var n=e.$options.propsData||{},r=e._props={},i=e.$options._propKeys=[],o=!e.$parent;vo.shouldConvert=o;for(var a in t)!function(o){i.push(o);var a=V(o,t,n,e);N(r,o,a),o in e||Ee(e,"_props",o)}(a);vo.shouldConvert=!0}function Le(e){var t=e.$options.data;t=e._data="function"==typeof t?Ie(t,e):t||{},a(t)||(t={});for(var n=Object.keys(t),r=e.$options.props,i=n.length;i--;)r&&p(r,n[i])||C(n[i])||Ee(e,"_data",n[i]);j(t,!0)}function Ie(e,t){try{return e.call(t)}catch(e){return k(e,t,"data()"),{}}}function De(e,t){var n=e._computedWatchers=Object.create(null);for(var r in t){var i=t[r],o="function"==typeof i?i:i.get;n[r]=new jo(e,o,y,Io),r in e||Me(e,r,i)}}function Me(e,t,n){"function"==typeof n?(Lo.get=Pe(t),Lo.set=y):(Lo.get=n.get?!1!==n.cache?Pe(t):n.get:y,Lo.set=n.set?n.set:y),Object.defineProperty(e,t,Lo)}function Pe(e){return function(){var t=this._computedWatchers&&this._computedWatchers[e];if(t)return t.dirty&&t.evaluate(),co.target&&t.depend(),t.value}}function Re(e,t){e.$options.props;for(var n in t)e[n]=null==t[n]?y:v(t[n],e)}function Fe(e,t){for(var n in t){var r=t[n];if(Array.isArray(r))for(var i=0;i<r.length;i++)Be(e,n,r[i]);else Be(e,n,r)}}function Be(e,t,n){var r;a(n)&&(r=n,n=n.handler),"string"==typeof n&&(n=e[n]),e.$watch(t,n,r)}function He(e){var t=e.$options.provide;t&&(e._provided="function"==typeof t?t.call(e):t)}function Ue(e){var t=Ve(e.$options.inject,e);t&&Object.keys(t).forEach(function(n){N(e,n,t[n])})}function Ve(e,t){if(e){for(var n=Array.isArray(e),r=Object.create(null),i=n?e:oo?Reflect.ownKeys(e):Object.keys(e),o=0;o<i.length;o++)for(var a=i[o],s=n?a:e[a],c=t;c;){if(c._provided&&s in c._provided){r[a]=c._provided[s];break}c=c.$parent}return r}}function ze(e,n,r,i,o){var a={},s=e.options.props;if(t(s))for(var c in s)a[c]=V(c,s,n||{});else t(r.attrs)&&Je(a,r.attrs),t(r.props)&&Je(a,r.props);var u=Object.create(i),l=function(e,t,n,r){return Ye(u,e,t,n,r,!0)},f=e.options.render.call(null,l,{data:r,props:a,children:o,parent:i,listeners:r.on||{},injections:Ve(e.options.inject,i),slots:function(){return pe(o,i)}});return f instanceof yo&&(f.functionalContext=i,f.functionalOptions=e.options,r.slot&&((f.data||(f.data={})).slot=r.slot)),f}function Je(e,t){for(var n in t)e[Ni(n)]=t[n]}function Ke(r,i,a,s,c){if(!e(r)){var u=a.$options._base;if(o(r)&&(r=u.extend(r)),"function"==typeof r&&(!e(r.cid)||void 0!==(r=ae(r,u,a)))){ft(r),i=i||{},t(i.model)&&Ge(r.options,i);var l=X(i,r,c);if(n(r.options.functional))return ze(r,l,i,a,s);var f=i.on;i.on=i.nativeOn,n(r.options.abstract)&&(i={}),We(i);var p=r.options.name||c;return new yo("vue-component-"+r.cid+(p?"-"+p:""),i,void 0,void 0,void 0,a,{Ctor:r,propsData:l,listeners:f,tag:c,children:s})}}}function qe(e,n,r,i){var o=e.componentOptions,a={_isComponent:!0,parent:n,propsData:o.propsData,_componentTag:o.tag,_parentVnode:e,_parentListeners:o.listeners,_renderChildren:o.children,_parentElm:r||null,_refElm:i||null},s=e.data.inlineTemplate;return t(s)&&(a.render=s.render,a.staticRenderFns=s.staticRenderFns),new o.Ctor(a)}function We(e){e.hook||(e.hook={});for(var t=0;t<Mo.length;t++){var n=Mo[t],r=e.hook[n],i=Do[n];e.hook[n]=r?Ze(i,r):i}}function Ze(e,t){return function(n,r,i,o){e(n,r,i,o),t(n,r,i,o)}}function Ge(e,n){var r=e.model&&e.model.prop||"value",i=e.model&&e.model.event||"input";(n.props||(n.props={}))[r]=n.model.value;var o=n.on||(n.on={});t(o[i])?o[i]=[n.model.callback].concat(o[i]):o[i]=n.model.callback}function Ye(e,t,r,o,a,s){return(Array.isArray(r)||i(r))&&(a=o,o=r,r=void 0),n(s)&&(a=Ro),Qe(e,t,r,o,a)}function Qe(e,n,r,i,o){if(t(r)&&t(r.__ob__))return $o();if(!n)return $o();Array.isArray(i)&&"function"==typeof i[0]&&(r=r||{},r.scopedSlots={default:i[0]},i.length=0),o===Ro?i=ne(i):o===Po&&(i=te(i));var a,s;if("string"==typeof n){var c;s=Bi.getTagNamespace(n),a=Bi.isReservedTag(n)?new yo(Bi.parsePlatformTagName(n),r,i,void 0,void 0,e):t(c=U(e.$options,"components",n))?Ke(c,r,e,i,n):new yo(n,r,i,void 0,void 0,e)}else a=Ke(n,r,e,i);return t(a)?(s&&Xe(a,s),a):$o()}function Xe(n,r){if(n.ns=r,"foreignObject"!==n.tag&&t(n.children))for(var i=0,o=n.children.length;i<o;i++){var a=n.children[i];t(a.tag)&&e(a.ns)&&Xe(a,r)}}function et(e,n){var r,i,a,s,c;if(Array.isArray(e)||"string"==typeof e)for(r=new Array(e.length),i=0,a=e.length;i<a;i++)r[i]=n(e[i],i);else if("number"==typeof e)for(r=new Array(e),i=0;i<e;i++)r[i]=n(i+1,i);else if(o(e))for(s=Object.keys(e),r=new Array(s.length),i=0,a=s.length;i<a;i++)c=s[i],r[i]=n(e[c],c,i);return t(r)&&(r._isVList=!0),r}function tt(e,t,n,r){var i=this.$scopedSlots[e];if(i)return n=n||{},r&&m(n,r),i(n)||t;var o=this.$slots[e];return o||t}function nt(e){return U(this.$options,"filters",e,!0)||Mi}function rt(e,t,n){var r=Bi.keyCodes[t]||n;return Array.isArray(r)?-1===r.indexOf(e):r!==e}function it(e,t,n,r){if(n)if(o(n)){Array.isArray(n)&&(n=g(n));var i;for(var a in n){if("class"===a||"style"===a)i=e;else{var s=e.attrs&&e.attrs.type;i=r||Bi.mustUseProp(t,s,a)?e.domProps||(e.domProps={}):e.attrs||(e.attrs={})}a in i||(i[a]=n[a])}}else;return e}function ot(e,t){var n=this._staticTrees[e];return n&&!t?Array.isArray(n)?Z(n):W(n):(n=this._staticTrees[e]=this.$options.staticRenderFns[e].call(this._renderProxy),st(n,"__static__"+e,!1),n)}function at(e,t,n){return st(e,"__once__"+t+(n?"_"+n:""),!0),e}function st(e,t,n){if(Array.isArray(e))for(var r=0;r<e.length;r++)e[r]&&"string"!=typeof e[r]&&ct(e[r],t+"_"+r,n);else ct(e,t,n)}function ct(e,t,n){e.isStatic=!0,e.key=t,e.isOnce=n}function ut(e){e._vnode=null,e._staticTrees=null;var t=e.$vnode=e.$options._parentVnode,n=t&&t.context;e.$slots=pe(e.$options._renderChildren,n),e.$scopedSlots=Hi,e._c=function(t,n,r,i){return Ye(e,t,n,r,i,!1)},e.$createElement=function(t,n,r,i){return Ye(e,t,n,r,i,!0)}}function lt(e,t){var n=e.$options=Object.create(e.constructor.options);n.parent=t.parent,n.propsData=t.propsData,n._parentVnode=t._parentVnode,n._parentListeners=t._parentListeners,n._renderChildren=t._renderChildren,n._componentTag=t._componentTag,n._parentElm=t._parentElm,n._refElm=t._refElm,t.render&&(n.render=t.render,n.staticRenderFns=t.staticRenderFns)}function ft(e){var t=e.options;if(e.super){var n=ft(e.super);if(n!==e.superOptions){e.superOptions=n;var r=pt(e);r&&m(e.extendOptions,r),t=e.options=H(n,e.extendOptions),t.name&&(t.components[t.name]=e)}}return t}function pt(e){var t,n=e.options,r=e.extendOptions,i=e.sealedOptions;for(var o in n)n[o]!==i[o]&&(t||(t={}),t[o]=dt(n[o],r[o],i[o]));return t}function dt(e,t,n){if(Array.isArray(e)){var r=[];n=Array.isArray(n)?n:[n],t=Array.isArray(t)?t:[t];for(var i=0;i<e.length;i++)(t.indexOf(e[i])>=0||n.indexOf(e[i])<0)&&r.push(e[i]);return r}return e}function vt(e){this._init(e)}function ht(e){e.use=function(e){if(e.installed)return this;var t=h(arguments,1);return t.unshift(this),"function"==typeof e.install?e.install.apply(e,t):"function"==typeof e&&e.apply(null,t),e.installed=!0,this}}function mt(e){e.mixin=function(e){return this.options=H(this.options,e),this}}function gt(e){e.cid=0;var t=1;e.extend=function(e){e=e||{};var n=this,r=n.cid,i=e._Ctor||(e._Ctor={});if(i[r])return i[r];var o=e.name||n.options.name,a=function(e){this._init(e)};return a.prototype=Object.create(n.prototype),a.prototype.constructor=a,a.cid=t++,a.options=H(n.options,e),a.super=n,a.options.props&&yt(a),a.options.computed&&_t(a),a.extend=n.extend,a.mixin=n.mixin,a.use=n.use,Ri.forEach(function(e){a[e]=n[e]}),o&&(a.options.components[o]=a),a.superOptions=n.options,a.extendOptions=e,a.sealedOptions=m({},a.options),i[r]=a,a}}function yt(e){var t=e.options.props;for(var n in t)Ee(e.prototype,"_props",n)}function _t(e){var t=e.options.computed;for(var n in t)Me(e.prototype,n,t[n])}function bt(e){Ri.forEach(function(t){e[t]=function(e,n){return n?("component"===t&&a(n)&&(n.name=n.name||e,n=this.options._base.extend(n)),"directive"===t&&"function"==typeof n&&(n={bind:n,update:n}),this.options[t+"s"][e]=n,n):this.options[t+"s"][e]}})}function $t(e){return e&&(e.Ctor.options.name||e.tag)}function Ct(e,t){return"string"==typeof e?e.split(",").indexOf(t)>-1:!!s(e)&&e.test(t)}function xt(e,t,n){for(var r in e){var i=e[r];if(i){var o=$t(i.componentOptions);o&&!n(o)&&(i!==t&&wt(i),e[r]=null)}}}function wt(e){e&&e.componentInstance.$destroy()}function kt(e){for(var n=e.data,r=e,i=e;t(i.componentInstance);)i=i.componentInstance._vnode,i.data&&(n=At(i.data,n));for(;t(r=r.parent);)r.data&&(n=At(n,r.data));return Ot(n)}function At(e,n){return{staticClass:St(e.staticClass,n.staticClass),class:t(e.class)?[e.class,n.class]:n.class}}function Ot(e){var n=e.class,r=e.staticClass;return t(r)||t(n)?St(r,Tt(n)):""}function St(e,t){return e?t?e+" "+t:e:t||""}function Tt(n){if(e(n))return"";if("string"==typeof n)return n;var r="";if(Array.isArray(n)){for(var i,a=0,s=n.length;a<s;a++)t(n[a])&&t(i=Tt(n[a]))&&""!==i&&(r+=i+" ");return r.slice(0,-1)}if(o(n)){for(var c in n)n[c]&&(r+=c+" ");return r.slice(0,-1)}return r}function Et(e){return ua(e)?"svg":"math"===e?"math":void 0}function jt(e){if(!Ji)return!0;if(fa(e))return!1;if(e=e.toLowerCase(),null!=pa[e])return pa[e];var t=document.createElement(e);return e.indexOf("-")>-1?pa[e]=t.constructor===window.HTMLUnknownElement||t.constructor===window.HTMLElement:pa[e]=/HTMLUnknownElement/.test(t.toString())}function Nt(e){if("string"==typeof e){var t=document.querySelector(e);return t||document.createElement("div")}return e}function Lt(e,t){var n=document.createElement(e);return"select"!==e?n:(t.data&&t.data.attrs&&void 0!==t.data.attrs.multiple&&n.setAttribute("multiple","multiple"),n)}function It(e,t){return document.createElementNS(sa[e],t)}function Dt(e){return document.createTextNode(e)}function Mt(e){return document.createComment(e)}function Pt(e,t,n){e.insertBefore(t,n)}function Rt(e,t){e.removeChild(t)}function Ft(e,t){e.appendChild(t)}function Bt(e){return e.parentNode}function Ht(e){return e.nextSibling}function Ut(e){return e.tagName}function Vt(e,t){e.textContent=t}function zt(e,t,n){e.setAttribute(t,n)}function Jt(e,t){var n=e.data.ref;if(n){var r=e.context,i=e.componentInstance||e.elm,o=r.$refs;t?Array.isArray(o[n])?f(o[n],i):o[n]===i&&(o[n]=void 0):e.data.refInFor?Array.isArray(o[n])&&o[n].indexOf(i)<0?o[n].push(i):o[n]=[i]:o[n]=i}}function Kt(e,n){return e.key===n.key&&e.tag===n.tag&&e.isComment===n.isComment&&t(e.data)===t(n.data)&&qt(e,n)}function qt(e,n){if("input"!==e.tag)return!0;var r;return(t(r=e.data)&&t(r=r.attrs)&&r.type)===(t(r=n.data)&&t(r=r.attrs)&&r.type)}function Wt(e,n,r){var i,o,a={};for(i=n;i<=r;++i)o=e[i].key,t(o)&&(a[o]=i);return a}function Zt(e,t){(e.data.directives||t.data.directives)&&Gt(e,t)}function Gt(e,t){var n,r,i,o=e===ha,a=t===ha,s=Yt(e.data.directives,e.context),c=Yt(t.data.directives,t.context),u=[],l=[];for(n in c)r=s[n],i=c[n],r?(i.oldValue=r.value,Xt(i,"update",t,e),i.def&&i.def.componentUpdated&&l.push(i)):(Xt(i,"bind",t,e),i.def&&i.def.inserted&&u.push(i));if(u.length){var f=function(){for(var n=0;n<u.length;n++)Xt(u[n],"inserted",t,e)};o?Q(t.data.hook||(t.data.hook={}),"insert",f):f()}if(l.length&&Q(t.data.hook||(t.data.hook={}),"postpatch",function(){for(var n=0;n<l.length;n++)Xt(l[n],"componentUpdated",t,e)}),!o)for(n in s)c[n]||Xt(s[n],"unbind",e,e,a)}function Yt(e,t){var n=Object.create(null);if(!e)return n;var r,i;for(r=0;r<e.length;r++)i=e[r],i.modifiers||(i.modifiers=ya),n[Qt(i)]=i,i.def=U(t.$options,"directives",i.name,!0);return n}function Qt(e){return e.rawName||e.name+"."+Object.keys(e.modifiers||{}).join(".")}function Xt(e,t,n,r,i){var o=e.def&&e.def[t];if(o)try{o(n.elm,e,n,r,i)}catch(r){k(r,n.context,"directive "+e.name+" "+t+" hook")}}function en(n,r){if(!e(n.data.attrs)||!e(r.data.attrs)){var i,o,a=r.elm,s=n.data.attrs||{},c=r.data.attrs||{};t(c.__ob__)&&(c=r.data.attrs=m({},c));for(i in c)o=c[i],s[i]!==o&&tn(a,i,o);Wi&&c.value!==s.value&&tn(a,"value",c.value);for(i in s)e(c[i])&&(ia(i)?a.removeAttributeNS(ra,oa(i)):ta(i)||a.removeAttribute(i))}}function tn(e,t,n){na(t)?aa(n)?e.removeAttribute(t):e.setAttribute(t,t):ta(t)?e.setAttribute(t,aa(n)||"false"===n?"false":"true"):ia(t)?aa(n)?e.removeAttributeNS(ra,oa(t)):e.setAttributeNS(ra,t,n):aa(n)?e.removeAttribute(t):e.setAttribute(t,n)}function nn(n,r){var i=r.elm,o=r.data,a=n.data;if(!(e(o.staticClass)&&e(o.class)&&(e(a)||e(a.staticClass)&&e(a.class)))){var s=kt(r),c=i._transitionClasses;t(c)&&(s=St(s,Tt(c))),s!==i._prevClass&&(i.setAttribute("class",s),i._prevClass=s)}}function rn(e){function t(){(a||(a=[])).push(e.slice(v,i).trim()),v=i+1}var n,r,i,o,a,s=!1,c=!1,u=!1,l=!1,f=0,p=0,d=0,v=0;for(i=0;i<e.length;i++)if(r=n,n=e.charCodeAt(i),s)39===n&&92!==r&&(s=!1);else if(c)34===n&&92!==r&&(c=!1);else if(u)96===n&&92!==r&&(u=!1);else if(l)47===n&&92!==r&&(l=!1);else if(124!==n||124===e.charCodeAt(i+1)||124===e.charCodeAt(i-1)||f||p||d){switch(n){case 34:c=!0;break;case 39:s=!0;break;case 96:u=!0;break;case 40:d++;break;case 41:d--;break;case 91:p++;break;case 93:p--;break;case 123:f++;break;case 125:f--}if(47===n){for(var h=i-1,m=void 0;h>=0&&" "===(m=e.charAt(h));h--);m&&Ca.test(m)||(l=!0)}}else void 0===o?(v=i+1,o=e.slice(0,i).trim()):t();if(void 0===o?o=e.slice(0,i).trim():0!==v&&t(),a)for(i=0;i<a.length;i++)o=on(o,a[i]);return o}function on(e,t){var n=t.indexOf("(");return n<0?'_f("'+t+'")('+e+")":'_f("'+t.slice(0,n)+'")('+e+","+t.slice(n+1)}function an(e){console.error("[Vue compiler]: "+e)}function sn(e,t){return e?e.map(function(e){return e[t]}).filter(function(e){return e}):[]}function cn(e,t,n){(e.props||(e.props=[])).push({name:t,value:n})}function un(e,t,n){(e.attrs||(e.attrs=[])).push({name:t,value:n})}function ln(e,t,n,r,i,o){(e.directives||(e.directives=[])).push({name:t,rawName:n,value:r,arg:i,modifiers:o})}function fn(e,t,n,r,i,o){r&&r.capture&&(delete r.capture,t="!"+t),r&&r.once&&(delete r.once,t="~"+t),r&&r.passive&&(delete r.passive,t="&"+t);var a;r&&r.native?(delete r.native,a=e.nativeEvents||(e.nativeEvents={})):a=e.events||(e.events={});var s={value:n,modifiers:r},c=a[t];Array.isArray(c)?i?c.unshift(s):c.push(s):a[t]=c?i?[s,c]:[c,s]:s}function pn(e,t,n){var r=dn(e,":"+t)||dn(e,"v-bind:"+t);if(null!=r)return rn(r);if(!1!==n){var i=dn(e,t);if(null!=i)return JSON.stringify(i)}}function dn(e,t){var n;if(null!=(n=e.attrsMap[t]))for(var r=e.attrsList,i=0,o=r.length;i<o;i++)if(r[i].name===t){r.splice(i,1);break}return n}function vn(e,t,n){var r=n||{},i=r.number,o=r.trim,a="$$v";o&&(a="(typeof $$v === 'string'? $$v.trim(): $$v)"),i&&(a="_n("+a+")");var s=hn(t,a);e.model={value:"("+t+")",expression:'"'+t+'"',callback:"function ($$v) {"+s+"}"}}function hn(e,t){var n=mn(e);return null===n.idx?e+"="+t:"var $$exp = "+n.exp+", $$idx = "+n.idx+";if (!Array.isArray($$exp)){"+e+"="+t+"}else{$$exp.splice($$idx, 1, "+t+")}"}function mn(e){if(zo=e,Vo=zo.length,Ko=qo=Wo=0,e.indexOf("[")<0||e.lastIndexOf("]")<Vo-1)return{exp:e,idx:null};for(;!yn();)Jo=gn(),_n(Jo)?$n(Jo):91===Jo&&bn(Jo);return{exp:e.substring(0,qo),idx:e.substring(qo+1,Wo)}}function gn(){return zo.charCodeAt(++Ko)}function yn(){return Ko>=Vo}function _n(e){return 34===e||39===e}function bn(e){var t=1;for(qo=Ko;!yn();)if(e=gn(),_n(e))$n(e);else if(91===e&&t++,93===e&&t--,0===t){Wo=Ko;break}}function $n(e){for(var t=e;!yn()&&(e=gn())!==t;);}function Cn(e,t,n){Zo=n;var r=t.value,i=t.modifiers,o=e.tag,a=e.attrsMap.type;if("select"===o)kn(e,r,i);else if("input"===o&&"checkbox"===a)xn(e,r,i);else if("input"===o&&"radio"===a)wn(e,r,i);else if("input"===o||"textarea"===o)An(e,r,i);else if(!Bi.isReservedTag(o))return vn(e,r,i),!1;return!0}function xn(e,t,n){var r=n&&n.number,i=pn(e,"value")||"null",o=pn(e,"true-value")||"true",a=pn(e,"false-value")||"false";cn(e,"checked","Array.isArray("+t+")?_i("+t+","+i+")>-1"+("true"===o?":("+t+")":":_q("+t+","+o+")")),fn(e,wa,"var $$a="+t+",$$el=$event.target,$$c=$$el.checked?("+o+"):("+a+");if(Array.isArray($$a)){var $$v="+(r?"_n("+i+")":i)+",$$i=_i($$a,$$v);if($$c){$$i<0&&("+t+"=$$a.concat($$v))}else{$$i>-1&&("+t+"=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{"+hn(t,"$$c")+"}",null,!0)}function wn(e,t,n){var r=n&&n.number,i=pn(e,"value")||"null";i=r?"_n("+i+")":i,cn(e,"checked","_q("+t+","+i+")"),fn(e,wa,hn(t,i),null,!0)}function kn(e,t,n){var r=n&&n.number,i='Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return '+(r?"_n(val)":"val")+"})",o="var $$selectedVal = "+i+";";o=o+" "+hn(t,"$event.target.multiple ? $$selectedVal : $$selectedVal[0]"),fn(e,"change",o,null,!0)}function An(e,t,n){var r=e.attrsMap.type,i=n||{},o=i.lazy,a=i.number,s=i.trim,c=!o&&"range"!==r,u=o?"change":"range"===r?xa:"input",l="$event.target.value";s&&(l="$event.target.value.trim()"),a&&(l="_n("+l+")");var f=hn(t,l);c&&(f="if($event.target.composing)return;"+f),cn(e,"value","("+t+")"),fn(e,u,f,null,!0),(s||a||"number"===r)&&fn(e,"blur","$forceUpdate()")}function On(e){var n;t(e[xa])&&(n=qi?"change":"input",e[n]=[].concat(e[xa],e[n]||[]),delete e[xa]),t(e[wa])&&(n=Qi?"click":"change",e[n]=[].concat(e[wa],e[n]||[]),delete e[wa])}function Sn(e,t,n,r,i){if(n){var o=t,a=Go;t=function(n){null!==(1===arguments.length?o(n):o.apply(null,arguments))&&Tn(e,t,r,a)}}Go.addEventListener(e,t,Xi?{capture:r,passive:i}:r)}function Tn(e,t,n,r){(r||Go).removeEventListener(e,t,n)}function En(t,n){if(!e(t.data.on)||!e(n.data.on)){var r=n.data.on||{},i=t.data.on||{};Go=n.elm,On(r),Y(r,i,Sn,Tn,n.context)}}function jn(n,r){if(!e(n.data.domProps)||!e(r.data.domProps)){var i,o,a=r.elm,s=n.data.domProps||{},c=r.data.domProps||{};t(c.__ob__)&&(c=r.data.domProps=m({},c));for(i in s)e(c[i])&&(a[i]="");for(i in c)if(o=c[i],"textContent"!==i&&"innerHTML"!==i||(r.children&&(r.children.length=0),o!==s[i]))if("value"===i){a._value=o;var u=e(o)?"":String(o);Nn(a,r,u)&&(a.value=u)}else a[i]=o}}function Nn(e,t,n){return!e.composing&&("option"===t.tag||Ln(e,n)||In(e,n))}function Ln(e,t){return document.activeElement!==e&&e.value!==t}function In(e,n){var r=e.value,i=e._vModifiers;return t(i)&&i.number||"number"===e.type?u(r)!==u(n):t(i)&&i.trim?r.trim()!==n.trim():r!==n}function Dn(e){var t=Mn(e.style);return e.staticStyle?m(e.staticStyle,t):t}function Mn(e){return Array.isArray(e)?g(e):"string"==typeof e?Oa(e):e}function Pn(e,t){var n,r={};if(t)for(var i=e;i.componentInstance;)i=i.componentInstance._vnode,i.data&&(n=Dn(i.data))&&m(r,n);(n=Dn(e.data))&&m(r,n);for(var o=e;o=o.parent;)o.data&&(n=Dn(o.data))&&m(r,n);return r}function Rn(n,r){var i=r.data,o=n.data;if(!(e(i.staticStyle)&&e(i.style)&&e(o.staticStyle)&&e(o.style))){var a,s,c=r.elm,u=o.staticStyle,l=o.normalizedStyle||o.style||{},f=u||l,p=Mn(r.data.style)||{};r.data.normalizedStyle=t(p.__ob__)?m({},p):p;var d=Pn(r,!0);for(s in f)e(d[s])&&Ea(c,s,"");for(s in d)(a=d[s])!==f[s]&&Ea(c,s,null==a?"":a)}}function Fn(e,t){if(t&&(t=t.trim()))if(e.classList)t.indexOf(" ")>-1?t.split(/\s+/).forEach(function(t){return e.classList.add(t)}):e.classList.add(t);else{var n=" "+(e.getAttribute("class")||"")+" ";n.indexOf(" "+t+" ")<0&&e.setAttribute("class",(n+t).trim())}}function Bn(e,t){if(t&&(t=t.trim()))if(e.classList)t.indexOf(" ")>-1?t.split(/\s+/).forEach(function(t){return e.classList.remove(t)}):e.classList.remove(t);else{for(var n=" "+(e.getAttribute("class")||"")+" ",r=" "+t+" ";n.indexOf(r)>=0;)n=n.replace(r," ");e.setAttribute("class",n.trim())}}function Hn(e){if(e){if("object"==typeof e){var t={};return!1!==e.css&&m(t,Ia(e.name||"v")),m(t,e),t}return"string"==typeof e?Ia(e):void 0}}function Un(e){Ua(function(){Ua(e)})}function Vn(e,t){(e._transitionClasses||(e._transitionClasses=[])).push(t),Fn(e,t)}function zn(e,t){e._transitionClasses&&f(e._transitionClasses,t),Bn(e,t)}function Jn(e,t,n){var r=Kn(e,t),i=r.type,o=r.timeout,a=r.propCount;if(!i)return n();var s=i===Ma?Fa:Ha,c=0,u=function(){e.removeEventListener(s,l),n()},l=function(t){t.target===e&&++c>=a&&u()};setTimeout(function(){c<a&&u()},o+1),e.addEventListener(s,l)}function Kn(e,t){var n,r=window.getComputedStyle(e),i=r[Ra+"Delay"].split(", "),o=r[Ra+"Duration"].split(", "),a=qn(i,o),s=r[Ba+"Delay"].split(", "),c=r[Ba+"Duration"].split(", "),u=qn(s,c),l=0,f=0;return t===Ma?a>0&&(n=Ma,l=a,f=o.length):t===Pa?u>0&&(n=Pa,l=u,f=c.length):(l=Math.max(a,u),n=l>0?a>u?Ma:Pa:null,f=n?n===Ma?o.length:c.length:0),{type:n,timeout:l,propCount:f,hasTransform:n===Ma&&Va.test(r[Ra+"Property"])}}function qn(e,t){for(;e.length<t.length;)e=e.concat(e);return Math.max.apply(null,t.map(function(t,n){return Wn(t)+Wn(e[n])}))}function Wn(e){return 1e3*Number(e.slice(0,-1))}
function Zn(n,r){var i=n.elm;t(i._leaveCb)&&(i._leaveCb.cancelled=!0,i._leaveCb());var a=Hn(n.data.transition);if(!e(a)&&!t(i._enterCb)&&1===i.nodeType){for(var s=a.css,c=a.type,l=a.enterClass,f=a.enterToClass,p=a.enterActiveClass,d=a.appearClass,v=a.appearToClass,h=a.appearActiveClass,m=a.beforeEnter,g=a.enter,y=a.afterEnter,_=a.enterCancelled,b=a.beforeAppear,C=a.appear,x=a.afterAppear,w=a.appearCancelled,k=a.duration,A=xo,O=xo.$vnode;O&&O.parent;)O=O.parent,A=O.context;var S=!A._isMounted||!n.isRootInsert;if(!S||C||""===C){var T=S&&d?d:l,E=S&&h?h:p,j=S&&v?v:f,N=S?b||m:m,L=S&&"function"==typeof C?C:g,I=S?x||y:y,D=S?w||_:_,M=u(o(k)?k.enter:k),P=!1!==s&&!Wi,R=Qn(L),F=i._enterCb=$(function(){P&&(zn(i,j),zn(i,E)),F.cancelled?(P&&zn(i,T),D&&D(i)):I&&I(i),i._enterCb=null});n.data.show||Q(n.data.hook||(n.data.hook={}),"insert",function(){var e=i.parentNode,t=e&&e._pending&&e._pending[n.key];t&&t.tag===n.tag&&t.elm._leaveCb&&t.elm._leaveCb(),L&&L(i,F)}),N&&N(i),P&&(Vn(i,T),Vn(i,E),Un(function(){Vn(i,j),zn(i,T),F.cancelled||R||(Yn(M)?setTimeout(F,M):Jn(i,c,F))})),n.data.show&&(r&&r(),L&&L(i,F)),P||R||F()}}}function Gn(n,r){function i(){w.cancelled||(n.data.show||((a.parentNode._pending||(a.parentNode._pending={}))[n.key]=n),v&&v(a),b&&(Vn(a,f),Vn(a,d),Un(function(){Vn(a,p),zn(a,f),w.cancelled||C||(Yn(x)?setTimeout(w,x):Jn(a,l,w))})),h&&h(a,w),b||C||w())}var a=n.elm;t(a._enterCb)&&(a._enterCb.cancelled=!0,a._enterCb());var s=Hn(n.data.transition);if(e(s))return r();if(!t(a._leaveCb)&&1===a.nodeType){var c=s.css,l=s.type,f=s.leaveClass,p=s.leaveToClass,d=s.leaveActiveClass,v=s.beforeLeave,h=s.leave,m=s.afterLeave,g=s.leaveCancelled,y=s.delayLeave,_=s.duration,b=!1!==c&&!Wi,C=Qn(h),x=u(o(_)?_.leave:_),w=a._leaveCb=$(function(){a.parentNode&&a.parentNode._pending&&(a.parentNode._pending[n.key]=null),b&&(zn(a,p),zn(a,d)),w.cancelled?(b&&zn(a,f),g&&g(a)):(r(),m&&m(a)),a._leaveCb=null});y?y(i):i()}}function Yn(e){return"number"==typeof e&&!isNaN(e)}function Qn(n){if(e(n))return!1;var r=n.fns;return t(r)?Qn(Array.isArray(r)?r[0]:r):(n._length||n.length)>1}function Xn(e,t){!0!==t.data.show&&Zn(t)}function er(e,t,n){var r=t.value,i=e.multiple;if(!i||Array.isArray(r)){for(var o,a,s=0,c=e.options.length;s<c;s++)if(a=e.options[s],i)o=b(r,nr(a))>-1,a.selected!==o&&(a.selected=o);else if(_(nr(a),r))return void(e.selectedIndex!==s&&(e.selectedIndex=s));i||(e.selectedIndex=-1)}}function tr(e,t){for(var n=0,r=t.length;n<r;n++)if(_(nr(t[n]),e))return!1;return!0}function nr(e){return"_value"in e?e._value:e.value}function rr(e){e.target.composing=!0}function ir(e){e.target.composing&&(e.target.composing=!1,or(e.target,"input"))}function or(e,t){var n=document.createEvent("HTMLEvents");n.initEvent(t,!0,!0),e.dispatchEvent(n)}function ar(e){return!e.componentInstance||e.data&&e.data.transition?e:ar(e.componentInstance._vnode)}function sr(e){var t=e&&e.componentOptions;return t&&t.Ctor.options.abstract?sr(se(t.children)):e}function cr(e){var t={},n=e.$options;for(var r in n.propsData)t[r]=e[r];var i=n._parentListeners;for(var o in i)t[Ni(o)]=i[o];return t}function ur(e,t){if(/\d-keep-alive$/.test(t.tag))return e("keep-alive",{props:t.componentOptions.propsData})}function lr(e){for(;e=e.parent;)if(e.data.transition)return!0}function fr(e,t){return t.key===e.key&&t.tag===e.tag}function pr(e){e.elm._moveCb&&e.elm._moveCb(),e.elm._enterCb&&e.elm._enterCb()}function dr(e){e.data.newPos=e.elm.getBoundingClientRect()}function vr(e){var t=e.data.pos,n=e.data.newPos,r=t.left-n.left,i=t.top-n.top;if(r||i){e.data.moved=!0;var o=e.elm.style;o.transform=o.WebkitTransform="translate("+r+"px,"+i+"px)",o.transitionDuration="0s"}}function hr(e){return ns=ns||document.createElement("div"),ns.innerHTML=e,ns.textContent}function mr(e,t){var n=t?Fs:Rs;return e.replace(n,function(e){return Ps[e]})}function gr(e,t){function n(t){l+=t,e=e.substring(t)}function r(e,n,r){var i,s;if(null==n&&(n=l),null==r&&(r=l),e&&(s=e.toLowerCase()),e)for(i=a.length-1;i>=0&&a[i].lowerCasedTag!==s;i--);else i=0;if(i>=0){for(var c=a.length-1;c>=i;c--)t.end&&t.end(a[c].tag,n,r);a.length=i,o=i&&a[i-1].tag}else"br"===s?t.start&&t.start(e,[],!0,n,r):"p"===s&&(t.start&&t.start(e,[],!1,n,r),t.end&&t.end(e,n,r))}for(var i,o,a=[],s=t.expectHTML,c=t.isUnaryTag||Di,u=t.canBeLeftOpenTag||Di,l=0;e;){if(i=e,o&&Ds(o)){var f=o.toLowerCase(),p=Ms[f]||(Ms[f]=new RegExp("([\\s\\S]*?)(</"+f+"[^>]*>)","i")),d=0,v=e.replace(p,function(e,n,r){return d=r.length,Ds(f)||"noscript"===f||(n=n.replace(/<!--([\s\S]*?)-->/g,"$1").replace(/<!\[CDATA\[([\s\S]*?)]]>/g,"$1")),t.chars&&t.chars(n),""});l+=e.length-v.length,e=v,r(f,l-d,l)}else{var h=e.indexOf("<");if(0===h){if(vs.test(e)){var m=e.indexOf("--\x3e");if(m>=0){n(m+3);continue}}if(hs.test(e)){var g=e.indexOf("]>");if(g>=0){n(g+2);continue}}var y=e.match(ds);if(y){n(y[0].length);continue}var _=e.match(ps);if(_){var b=l;n(_[0].length),r(_[1],b,l);continue}var $=function(){var t=e.match(ls);if(t){var r={tagName:t[1],attrs:[],start:l};n(t[0].length);for(var i,o;!(i=e.match(fs))&&(o=e.match(cs));)n(o[0].length),r.attrs.push(o);if(i)return r.unarySlash=i[1],n(i[0].length),r.end=l,r}}();if($){!function(e){var n=e.tagName,i=e.unarySlash;s&&("p"===o&&as(n)&&r(o),u(n)&&o===n&&r(n));for(var l=c(n)||"html"===n&&"head"===o||!!i,f=e.attrs.length,p=new Array(f),d=0;d<f;d++){var v=e.attrs[d];ms&&-1===v[0].indexOf('""')&&(""===v[3]&&delete v[3],""===v[4]&&delete v[4],""===v[5]&&delete v[5]);var h=v[3]||v[4]||v[5]||"";p[d]={name:v[1],value:mr(h,t.shouldDecodeNewlines)}}l||(a.push({tag:n,lowerCasedTag:n.toLowerCase(),attrs:p}),o=n),t.start&&t.start(n,p,l,e.start,e.end)}($);continue}}var C=void 0,x=void 0,w=void 0;if(h>=0){for(x=e.slice(h);!(ps.test(x)||ls.test(x)||vs.test(x)||hs.test(x)||(w=x.indexOf("<",1))<0);)h+=w,x=e.slice(h);C=e.substring(0,h),n(h)}h<0&&(C=e,e=""),t.chars&&C&&t.chars(C)}if(e===i){t.chars&&t.chars(e);break}}r()}function yr(e,t){var n=t?Hs(t):Bs;if(n.test(e)){for(var r,i,o=[],a=n.lastIndex=0;r=n.exec(e);){i=r.index,i>a&&o.push(JSON.stringify(e.slice(a,i)));var s=rn(r[1].trim());o.push("_s("+s+")"),a=i+r[0].length}return a<e.length&&o.push(JSON.stringify(e.slice(a))),o.join("+")}}function _r(e,t){function n(e){e.pre&&(s=!1),Cs(e.tag)&&(c=!1)}gs=t.warn||an,ws=t.getTagNamespace||Di,xs=t.mustUseProp||Di,Cs=t.isPreTag||Di,bs=sn(t.modules,"preTransformNode"),_s=sn(t.modules,"transformNode"),$s=sn(t.modules,"postTransformNode"),ys=t.delimiters;var r,i,o=[],a=!1!==t.preserveWhitespace,s=!1,c=!1;return gr(e,{warn:gs,expectHTML:t.expectHTML,isUnaryTag:t.isUnaryTag,canBeLeftOpenTag:t.canBeLeftOpenTag,shouldDecodeNewlines:t.shouldDecodeNewlines,start:function(e,a,u){var l=i&&i.ns||ws(e);qi&&"svg"===l&&(a=Rr(a));var f={type:1,tag:e,attrsList:a,attrsMap:Dr(a),parent:i,children:[]};l&&(f.ns=l),Pr(f)&&!ro()&&(f.forbidden=!0);for(var p=0;p<bs.length;p++)bs[p](f,t);if(s||(br(f),f.pre&&(s=!0)),Cs(f.tag)&&(c=!0),s)$r(f);else{wr(f),kr(f),Tr(f),Cr(f),f.plain=!f.key&&!a.length,xr(f),Er(f),jr(f);for(var d=0;d<_s.length;d++)_s[d](f,t);Nr(f)}if(r?o.length||r.if&&(f.elseif||f.else)&&Sr(r,{exp:f.elseif,block:f}):r=f,i&&!f.forbidden)if(f.elseif||f.else)Ar(f,i);else if(f.slotScope){i.plain=!1;var v=f.slotTarget||'"default"';(i.scopedSlots||(i.scopedSlots={}))[v]=f}else i.children.push(f),f.parent=i;u?n(f):(i=f,o.push(f));for(var h=0;h<$s.length;h++)$s[h](f,t)},end:function(){var e=o[o.length-1],t=e.children[e.children.length-1];t&&3===t.type&&" "===t.text&&!c&&e.children.pop(),o.length-=1,i=o[o.length-1],n(e)},chars:function(e){if(i&&(!qi||"textarea"!==i.tag||i.attrsMap.placeholder!==e)){var t=i.children;if(e=c||e.trim()?Mr(i)?e:Zs(e):a&&t.length?" ":""){var n;!s&&" "!==e&&(n=yr(e,ys))?t.push({type:2,expression:n,text:e}):" "===e&&t.length&&" "===t[t.length-1].text||t.push({type:3,text:e})}}}}),r}function br(e){null!=dn(e,"v-pre")&&(e.pre=!0)}function $r(e){var t=e.attrsList.length;if(t)for(var n=e.attrs=new Array(t),r=0;r<t;r++)n[r]={name:e.attrsList[r].name,value:JSON.stringify(e.attrsList[r].value)};else e.pre||(e.plain=!0)}function Cr(e){var t=pn(e,"key");t&&(e.key=t)}function xr(e){var t=pn(e,"ref");t&&(e.ref=t,e.refInFor=Lr(e))}function wr(e){var t;if(t=dn(e,"v-for")){var n=t.match(zs);if(!n)return;e.for=n[2].trim();var r=n[1].trim(),i=r.match(Js);i?(e.alias=i[1].trim(),e.iterator1=i[2].trim(),i[3]&&(e.iterator2=i[3].trim())):e.alias=r}}function kr(e){var t=dn(e,"v-if");if(t)e.if=t,Sr(e,{exp:t,block:e});else{null!=dn(e,"v-else")&&(e.else=!0);var n=dn(e,"v-else-if");n&&(e.elseif=n)}}function Ar(e,t){var n=Or(t.children);n&&n.if&&Sr(n,{exp:e.elseif,block:e})}function Or(e){for(var t=e.length;t--;){if(1===e[t].type)return e[t];e.pop()}}function Sr(e,t){e.ifConditions||(e.ifConditions=[]),e.ifConditions.push(t)}function Tr(e){null!=dn(e,"v-once")&&(e.once=!0)}function Er(e){if("slot"===e.tag)e.slotName=pn(e,"name");else{var t=pn(e,"slot");t&&(e.slotTarget='""'===t?'"default"':t),"template"===e.tag&&(e.slotScope=dn(e,"scope"))}}function jr(e){var t;(t=pn(e,"is"))&&(e.component=t),null!=dn(e,"inline-template")&&(e.inlineTemplate=!0)}function Nr(e){var t,n,r,i,o,a,s,c=e.attrsList;for(t=0,n=c.length;t<n;t++)if(r=i=c[t].name,o=c[t].value,Vs.test(r))if(e.hasBindings=!0,a=Ir(r),a&&(r=r.replace(Ws,"")),qs.test(r))r=r.replace(qs,""),o=rn(o),s=!1,a&&(a.prop&&(s=!0,"innerHtml"===(r=Ni(r))&&(r="innerHTML")),a.camel&&(r=Ni(r)),a.sync&&fn(e,"update:"+Ni(r),hn(o,"$event"))),s||xs(e.tag,e.attrsMap.type,r)?cn(e,r,o):un(e,r,o);else if(Us.test(r))r=r.replace(Us,""),fn(e,r,o,a,!1,gs);else{r=r.replace(Vs,"");var u=r.match(Ks),l=u&&u[1];l&&(r=r.slice(0,-(l.length+1))),ln(e,r,i,o,l,a)}else un(e,r,JSON.stringify(o))}function Lr(e){for(var t=e;t;){if(void 0!==t.for)return!0;t=t.parent}return!1}function Ir(e){var t=e.match(Ws);if(t){var n={};return t.forEach(function(e){n[e.slice(1)]=!0}),n}}function Dr(e){for(var t={},n=0,r=e.length;n<r;n++)t[e[n].name]=e[n].value;return t}function Mr(e){return"script"===e.tag||"style"===e.tag}function Pr(e){return"style"===e.tag||"script"===e.tag&&(!e.attrsMap.type||"text/javascript"===e.attrsMap.type)}function Rr(e){for(var t=[],n=0;n<e.length;n++){var r=e[n];Gs.test(r.name)||(r.name=r.name.replace(Ys,""),t.push(r))}return t}function Fr(e,t){e&&(ks=Qs(t.staticKeys||""),As=t.isReservedTag||Di,Hr(e),Ur(e,!1))}function Br(e){return l("type,tag,attrsList,attrsMap,plain,parent,children,attrs"+(e?","+e:""))}function Hr(e){if(e.static=zr(e),1===e.type){if(!As(e.tag)&&"slot"!==e.tag&&null==e.attrsMap["inline-template"])return;for(var t=0,n=e.children.length;t<n;t++){var r=e.children[t];Hr(r),r.static||(e.static=!1)}}}function Ur(e,t){if(1===e.type){if((e.static||e.once)&&(e.staticInFor=t),e.static&&e.children.length&&(1!==e.children.length||3!==e.children[0].type))return void(e.staticRoot=!0);if(e.staticRoot=!1,e.children)for(var n=0,r=e.children.length;n<r;n++)Ur(e.children[n],t||!!e.for);e.ifConditions&&Vr(e.ifConditions,t)}}function Vr(e,t){for(var n=1,r=e.length;n<r;n++)Ur(e[n].block,t)}function zr(e){return 2!==e.type&&(3===e.type||!(!e.pre&&(e.hasBindings||e.if||e.for||Ei(e.tag)||!As(e.tag)||Jr(e)||!Object.keys(e).every(ks))))}function Jr(e){for(;e.parent;){if(e=e.parent,"template"!==e.tag)return!1;if(e.for)return!0}return!1}function Kr(e,t,n){var r=t?"nativeOn:{":"on:{";for(var i in e){var o=e[i];r+='"'+i+'":'+qr(i,o)+","}return r.slice(0,-1)+"}"}function qr(e,t){if(!t)return"function(){}";if(Array.isArray(t))return"["+t.map(function(t){return qr(e,t)}).join(",")+"]";var n=ec.test(t.value),r=Xs.test(t.value);if(t.modifiers){var i="",o="",a=[];for(var s in t.modifiers)rc[s]?(o+=rc[s],tc[s]&&a.push(s)):a.push(s);a.length&&(i+=Wr(a)),o&&(i+=o);return"function($event){"+i+(n?t.value+"($event)":r?"("+t.value+")($event)":t.value)+"}"}return n||r?t.value:"function($event){"+t.value+"}"}function Wr(e){return"if(!('button' in $event)&&"+e.map(Zr).join("&&")+")return null;"}function Zr(e){var t=parseInt(e,10);if(t)return"$event.keyCode!=="+t;var n=tc[e];return"_k($event.keyCode,"+JSON.stringify(e)+(n?","+JSON.stringify(n):"")+")"}function Gr(e,t){e.wrapData=function(n){return"_b("+n+",'"+e.tag+"',"+t.value+(t.modifiers&&t.modifiers.prop?",true":"")+")"}}function Yr(e,t){var n=Ns,r=Ns=[],i=Ls;Ls=0,Is=t,Os=t.warn||an,Ss=sn(t.modules,"transformCode"),Ts=sn(t.modules,"genData"),Es=t.directives||{},js=t.isReservedTag||Di;var o=e?Qr(e):'_c("div")';return Ns=n,Ls=i,{render:"with(this){return "+o+"}",staticRenderFns:r}}function Qr(e){if(e.staticRoot&&!e.staticProcessed)return Xr(e);if(e.once&&!e.onceProcessed)return ei(e);if(e.for&&!e.forProcessed)return ri(e);if(e.if&&!e.ifProcessed)return ti(e);if("template"!==e.tag||e.slotTarget){if("slot"===e.tag)return mi(e);var t;if(e.component)t=gi(e.component,e);else{var n=e.plain?void 0:ii(e),r=e.inlineTemplate?null:li(e,!0);t="_c('"+e.tag+"'"+(n?","+n:"")+(r?","+r:"")+")"}for(var i=0;i<Ss.length;i++)t=Ss[i](e,t);return t}return li(e)||"void 0"}function Xr(e){return e.staticProcessed=!0,Ns.push("with(this){return "+Qr(e)+"}"),"_m("+(Ns.length-1)+(e.staticInFor?",true":"")+")"}function ei(e){if(e.onceProcessed=!0,e.if&&!e.ifProcessed)return ti(e);if(e.staticInFor){for(var t="",n=e.parent;n;){if(n.for){t=n.key;break}n=n.parent}return t?"_o("+Qr(e)+","+Ls+++(t?","+t:"")+")":Qr(e)}return Xr(e)}function ti(e){return e.ifProcessed=!0,ni(e.ifConditions.slice())}function ni(e){function t(e){return e.once?ei(e):Qr(e)}if(!e.length)return"_e()";var n=e.shift();return n.exp?"("+n.exp+")?"+t(n.block)+":"+ni(e):""+t(n.block)}function ri(e){var t=e.for,n=e.alias,r=e.iterator1?","+e.iterator1:"",i=e.iterator2?","+e.iterator2:"";return e.forProcessed=!0,"_l(("+t+"),function("+n+r+i+"){return "+Qr(e)+"})"}function ii(e){var t="{",n=oi(e);n&&(t+=n+","),e.key&&(t+="key:"+e.key+","),e.ref&&(t+="ref:"+e.ref+","),e.refInFor&&(t+="refInFor:true,"),e.pre&&(t+="pre:true,"),e.component&&(t+='tag:"'+e.tag+'",');for(var r=0;r<Ts.length;r++)t+=Ts[r](e);if(e.attrs&&(t+="attrs:{"+yi(e.attrs)+"},"),e.props&&(t+="domProps:{"+yi(e.props)+"},"),e.events&&(t+=Kr(e.events,!1,Os)+","),e.nativeEvents&&(t+=Kr(e.nativeEvents,!0,Os)+","),e.slotTarget&&(t+="slot:"+e.slotTarget+","),e.scopedSlots&&(t+=si(e.scopedSlots)+","),e.model&&(t+="model:{value:"+e.model.value+",callback:"+e.model.callback+",expression:"+e.model.expression+"},"),e.inlineTemplate){var i=ai(e);i&&(t+=i+",")}return t=t.replace(/,$/,"")+"}",e.wrapData&&(t=e.wrapData(t)),t}function oi(e){var t=e.directives;if(t){var n,r,i,o,a="directives:[",s=!1;for(n=0,r=t.length;n<r;n++){i=t[n],o=!0;var c=Es[i.name]||ic[i.name];c&&(o=!!c(e,i,Os)),o&&(s=!0,a+='{name:"'+i.name+'",rawName:"'+i.rawName+'"'+(i.value?",value:("+i.value+"),expression:"+JSON.stringify(i.value):"")+(i.arg?',arg:"'+i.arg+'"':"")+(i.modifiers?",modifiers:"+JSON.stringify(i.modifiers):"")+"},")}return s?a.slice(0,-1)+"]":void 0}}function ai(e){var t=e.children[0];if(1===t.type){var n=Yr(t,Is);return"inlineTemplate:{render:function(){"+n.render+"},staticRenderFns:["+n.staticRenderFns.map(function(e){return"function(){"+e+"}"}).join(",")+"]}"}}function si(e){return"scopedSlots:_u(["+Object.keys(e).map(function(t){return ci(t,e[t])}).join(",")+"])"}function ci(e,t){return t.for&&!t.forProcessed?ui(e,t):"{key:"+e+",fn:function("+String(t.attrsMap.scope)+"){return "+("template"===t.tag?li(t)||"void 0":Qr(t))+"}}"}function ui(e,t){var n=t.for,r=t.alias,i=t.iterator1?","+t.iterator1:"",o=t.iterator2?","+t.iterator2:"";return t.forProcessed=!0,"_l(("+n+"),function("+r+i+o+"){return "+ci(e,t)+"})"}function li(e,t){var n=e.children;if(n.length){var r=n[0];if(1===n.length&&r.for&&"template"!==r.tag&&"slot"!==r.tag)return Qr(r);var i=t?fi(n):0;return"["+n.map(vi).join(",")+"]"+(i?","+i:"")}}function fi(e){for(var t=0,n=0;n<e.length;n++){var r=e[n];if(1===r.type){if(pi(r)||r.ifConditions&&r.ifConditions.some(function(e){return pi(e.block)})){t=2;break}(di(r)||r.ifConditions&&r.ifConditions.some(function(e){return di(e.block)}))&&(t=1)}}return t}function pi(e){return void 0!==e.for||"template"===e.tag||"slot"===e.tag}function di(e){return!js(e.tag)}function vi(e){return 1===e.type?Qr(e):hi(e)}function hi(e){return"_v("+(2===e.type?e.expression:_i(JSON.stringify(e.text)))+")"}function mi(e){var t=e.slotName||'"default"',n=li(e),r="_t("+t+(n?","+n:""),i=e.attrs&&"{"+e.attrs.map(function(e){return Ni(e.name)+":"+e.value}).join(",")+"}",o=e.attrsMap["v-bind"];return!i&&!o||n||(r+=",null"),i&&(r+=","+i),o&&(r+=(i?"":",null")+","+o),r+")"}function gi(e,t){var n=t.inlineTemplate?null:li(t,!0);return"_c("+e+","+ii(t)+(n?","+n:"")+")"}function yi(e){for(var t="",n=0;n<e.length;n++){var r=e[n];t+='"'+r.name+'":'+_i(r.value)+","}return t.slice(0,-1)}function _i(e){return e.replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}function bi(e,t){var n=_r(e.trim(),t);Fr(n,t);var r=Yr(n,t);return{ast:n,render:r.render,staticRenderFns:r.staticRenderFns}}function $i(e,t){try{return new Function(e)}catch(n){return t.push({err:n,code:e}),y}}function Ci(e,t){var n=(t.warn,dn(e,"class"));n&&(e.staticClass=JSON.stringify(n));var r=pn(e,"class",!1);r&&(e.classBinding=r)}function xi(e){var t="";return e.staticClass&&(t+="staticClass:"+e.staticClass+","),e.classBinding&&(t+="class:"+e.classBinding+","),t}function wi(e,t){var n=(t.warn,dn(e,"style"));n&&(e.staticStyle=JSON.stringify(Oa(n)));var r=pn(e,"style",!1);r&&(e.styleBinding=r)}function ki(e){var t="";return e.staticStyle&&(t+="staticStyle:"+e.staticStyle+","),e.styleBinding&&(t+="style:("+e.styleBinding+"),"),t}function Ai(e,t){t.value&&cn(e,"textContent","_s("+t.value+")")}function Oi(e,t){t.value&&cn(e,"innerHTML","_s("+t.value+")")}function Si(e){if(e.outerHTML)return e.outerHTML;var t=document.createElement("div");return t.appendChild(e.cloneNode(!0)),t.innerHTML}var Ti=Object.prototype.toString,Ei=l("slot,component",!0),ji=Object.prototype.hasOwnProperty,Ni=d(function(e){return e.replace(/-(\w)/g,function(e,t){return t?t.toUpperCase():""})}),Li=d(function(e){return e.charAt(0).toUpperCase()+e.slice(1)}),Ii=d(function(e){return e.replace(/([^-])([A-Z])/g,"$1-$2").replace(/([^-])([A-Z])/g,"$1-$2").toLowerCase()}),Di=function(){return!1},Mi=function(e){return e},Pi="data-server-rendered",Ri=["component","directive","filter"],Fi=["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed","activated","deactivated"],Bi={optionMergeStrategies:Object.create(null),silent:!1,productionTip:!1,devtools:!1,performance:!1,errorHandler:null,ignoredElements:[],keyCodes:Object.create(null),isReservedTag:Di,isReservedAttr:Di,isUnknownElement:Di,getTagNamespace:y,parsePlatformTagName:Mi,mustUseProp:Di,_lifecycleHooks:Fi},Hi=Object.freeze({}),Ui=/[^\w.$]/,Vi=y,zi="__proto__"in{},Ji="undefined"!=typeof window,Ki=Ji&&window.navigator.userAgent.toLowerCase(),qi=Ki&&/msie|trident/.test(Ki),Wi=Ki&&Ki.indexOf("msie 9.0")>0,Zi=Ki&&Ki.indexOf("edge/")>0,Gi=Ki&&Ki.indexOf("android")>0,Yi=Ki&&/iphone|ipad|ipod|ios/.test(Ki),Qi=Ki&&/chrome\/\d+/.test(Ki)&&!Zi,Xi=!1;if(Ji)try{var eo={};Object.defineProperty(eo,"passive",{get:function(){Xi=!0}}),window.addEventListener("test-passive",null,eo)}catch(e){}var to,no,ro=function(){return void 0===to&&(to=!Ji&&"undefined"!=typeof global&&"server"===global.process.env.VUE_ENV),to},io=Ji&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__,oo="undefined"!=typeof Symbol&&A(Symbol)&&"undefined"!=typeof Reflect&&A(Reflect.ownKeys),ao=function(){function e(){r=!1;var e=n.slice(0);n.length=0;for(var t=0;t<e.length;t++)e[t]()}var t,n=[],r=!1;if("undefined"!=typeof Promise&&A(Promise)){var i=Promise.resolve(),o=function(e){console.error(e)};t=function(){i.then(e).catch(o),Yi&&setTimeout(y)}}else if("undefined"==typeof MutationObserver||!A(MutationObserver)&&"[object MutationObserverConstructor]"!==MutationObserver.toString())t=function(){setTimeout(e,0)};else{var a=1,s=new MutationObserver(e),c=document.createTextNode(String(a));s.observe(c,{characterData:!0}),t=function(){a=(a+1)%2,c.data=String(a)}}return function(e,i){var o;if(n.push(function(){if(e)try{e.call(i)}catch(e){k(e,i,"nextTick")}else o&&o(i)}),r||(r=!0,t()),!e&&"undefined"!=typeof Promise)return new Promise(function(e,t){o=e})}}();no="undefined"!=typeof Set&&A(Set)?Set:function(){function e(){this.set=Object.create(null)}return e.prototype.has=function(e){return!0===this.set[e]},e.prototype.add=function(e){this.set[e]=!0},e.prototype.clear=function(){this.set=Object.create(null)},e}();var so=0,co=function(){this.id=so++,this.subs=[]};co.prototype.addSub=function(e){this.subs.push(e)},co.prototype.removeSub=function(e){f(this.subs,e)},co.prototype.depend=function(){co.target&&co.target.addDep(this)},co.prototype.notify=function(){for(var e=this.subs.slice(),t=0,n=e.length;t<n;t++)e[t].update()},co.target=null;var uo=[],lo=Array.prototype,fo=Object.create(lo);["push","pop","shift","unshift","splice","sort","reverse"].forEach(function(e){var t=lo[e];x(fo,e,function(){for(var n=arguments,r=arguments.length,i=new Array(r);r--;)i[r]=n[r];var o,a=t.apply(this,i),s=this.__ob__;switch(e){case"push":case"unshift":o=i;break;case"splice":o=i.slice(2)}return o&&s.observeArray(o),s.dep.notify(),a})});var po=Object.getOwnPropertyNames(fo),vo={shouldConvert:!0,isSettingProps:!1},ho=function(e){if(this.value=e,this.dep=new co,this.vmCount=0,x(e,"__ob__",this),Array.isArray(e)){(zi?T:E)(e,fo,po),this.observeArray(e)}else this.walk(e)};ho.prototype.walk=function(e){for(var t=Object.keys(e),n=0;n<t.length;n++)N(e,t[n],e[t[n]])},ho.prototype.observeArray=function(e){for(var t=0,n=e.length;t<n;t++)j(e[t])};var mo=Bi.optionMergeStrategies;mo.data=function(e,t,n){return n?e||t?function(){var r="function"==typeof t?t.call(n):t,i="function"==typeof e?e.call(n):void 0;return r?M(r,i):i}:void 0:t?"function"!=typeof t?e:e?function(){return M(t.call(this),e.call(this))}:t:e},Fi.forEach(function(e){mo[e]=P}),Ri.forEach(function(e){mo[e+"s"]=R}),mo.watch=function(e,t){if(!t)return Object.create(e||null);if(!e)return t;var n={};m(n,e);for(var r in t){var i=n[r],o=t[r];i&&!Array.isArray(i)&&(i=[i]),n[r]=i?i.concat(o):[o]}return n},mo.props=mo.methods=mo.computed=function(e,t){if(!t)return Object.create(e||null);if(!e)return t;var n=Object.create(null);return m(n,e),m(n,t),n};var go=function(e,t){return void 0===t?e:t},yo=function(e,t,n,r,i,o,a){this.tag=e,this.data=t,this.children=n,this.text=r,this.elm=i,this.ns=void 0,this.context=o,this.functionalContext=void 0,this.key=t&&t.key,this.componentOptions=a,this.componentInstance=void 0,this.parent=void 0,this.raw=!1,this.isStatic=!1,this.isRootInsert=!0,this.isComment=!1,this.isCloned=!1,this.isOnce=!1},_o={child:{}};_o.child.get=function(){return this.componentInstance},Object.defineProperties(yo.prototype,_o);var bo,$o=function(){var e=new yo;return e.text="",e.isComment=!0,e},Co=d(function(e){var t="&"===e.charAt(0);e=t?e.slice(1):e;var n="~"===e.charAt(0);e=n?e.slice(1):e;var r="!"===e.charAt(0);return e=r?e.slice(1):e,{name:e,once:n,capture:r,passive:t}}),xo=null,wo=[],ko=[],Ao={},Oo=!1,So=!1,To=0,Eo=0,jo=function(e,t,n,r){this.vm=e,e._watchers.push(this),r?(this.deep=!!r.deep,this.user=!!r.user,this.lazy=!!r.lazy,this.sync=!!r.sync):this.deep=this.user=this.lazy=this.sync=!1,this.cb=n,this.id=++Eo,this.active=!0,this.dirty=this.lazy,this.deps=[],this.newDeps=[],this.depIds=new no,this.newDepIds=new no,this.expression="","function"==typeof t?this.getter=t:(this.getter=w(t),this.getter||(this.getter=function(){})),this.value=this.lazy?void 0:this.get()};jo.prototype.get=function(){O(this);var e,t=this.vm;if(this.user)try{e=this.getter.call(t,t)}catch(e){k(e,t,'getter for watcher "'+this.expression+'"')}else e=this.getter.call(t,t);return this.deep&&Se(e),S(),this.cleanupDeps(),e},jo.prototype.addDep=function(e){var t=e.id;this.newDepIds.has(t)||(this.newDepIds.add(t),this.newDeps.push(e),this.depIds.has(t)||e.addSub(this))},jo.prototype.cleanupDeps=function(){for(var e=this,t=this.deps.length;t--;){var n=e.deps[t];e.newDepIds.has(n.id)||n.removeSub(e)}var r=this.depIds;this.depIds=this.newDepIds,this.newDepIds=r,this.newDepIds.clear(),r=this.deps,this.deps=this.newDeps,this.newDeps=r,this.newDeps.length=0},jo.prototype.update=function(){this.lazy?this.dirty=!0:this.sync?this.run():Oe(this)},jo.prototype.run=function(){if(this.active){var e=this.get();if(e!==this.value||o(e)||this.deep){var t=this.value;if(this.value=e,this.user)try{this.cb.call(this.vm,e,t)}catch(e){k(e,this.vm,'callback for watcher "'+this.expression+'"')}else this.cb.call(this.vm,e,t)}}},jo.prototype.evaluate=function(){this.value=this.get(),this.dirty=!1},jo.prototype.depend=function(){for(var e=this,t=this.deps.length;t--;)e.deps[t].depend()},jo.prototype.teardown=function(){var e=this;if(this.active){this.vm._isBeingDestroyed||f(this.vm._watchers,this);for(var t=this.deps.length;t--;)e.deps[t].removeSub(e);this.active=!1}};var No=new no,Lo={enumerable:!0,configurable:!0,get:y,set:y},Io={lazy:!0},Do={init:function(e,t,n,r){if(!e.componentInstance||e.componentInstance._isDestroyed){(e.componentInstance=qe(e,xo,n,r)).$mount(t?e.elm:void 0,t)}else if(e.data.keepAlive){var i=e;Do.prepatch(i,i)}},prepatch:function(e,t){var n=t.componentOptions;ge(t.componentInstance=e.componentInstance,n.propsData,n.listeners,t,n.children)},insert:function(e){var t=e.context,n=e.componentInstance;n._isMounted||(n._isMounted=!0,$e(n,"mounted")),e.data.keepAlive&&(t._isMounted?ke(n):_e(n,!0))},destroy:function(e){var t=e.componentInstance;t._isDestroyed||(e.data.keepAlive?be(t,!0):t.$destroy())}},Mo=Object.keys(Do),Po=1,Ro=2,Fo=0;!function(e){e.prototype._init=function(e){var t=this;t._uid=Fo++,t._isVue=!0,e&&e._isComponent?lt(t,e):t.$options=H(ft(t.constructor),e||{},t),t._renderProxy=t,t._self=t,he(t),ce(t),ut(t),$e(t,"beforeCreate"),Ue(t),je(t),He(t),$e(t,"created"),t.$options.el&&t.$mount(t.$options.el)}}(vt),function(e){var t={};t.get=function(){return this._data};var n={};n.get=function(){return this._props},Object.defineProperty(e.prototype,"$data",t),Object.defineProperty(e.prototype,"$props",n),e.prototype.$set=L,e.prototype.$delete=I,e.prototype.$watch=function(e,t,n){var r=this;n=n||{},n.user=!0;var i=new jo(r,e,t,n);return n.immediate&&t.call(r,i.value),function(){i.teardown()}}}(vt),function(e){var t=/^hook:/;e.prototype.$on=function(e,n){var r=this,i=this;if(Array.isArray(e))for(var o=0,a=e.length;o<a;o++)r.$on(e[o],n);else(i._events[e]||(i._events[e]=[])).push(n),t.test(e)&&(i._hasHookEvent=!0);return i},e.prototype.$once=function(e,t){function n(){r.$off(e,n),t.apply(r,arguments)}var r=this;return n.fn=t,r.$on(e,n),r},e.prototype.$off=function(e,t){var n=this,r=this;if(!arguments.length)return r._events=Object.create(null),r;if(Array.isArray(e)){for(var i=0,o=e.length;i<o;i++)n.$off(e[i],t);return r}var a=r._events[e];if(!a)return r;if(1===arguments.length)return r._events[e]=null,r;for(var s,c=a.length;c--;)if((s=a[c])===t||s.fn===t){a.splice(c,1);break}return r},e.prototype.$emit=function(e){var t=this,n=t._events[e];if(n){n=n.length>1?h(n):n;for(var r=h(arguments,1),i=0,o=n.length;i<o;i++)n[i].apply(t,r)}return t}}(vt),function(e){e.prototype._update=function(e,t){var n=this;n._isMounted&&$e(n,"beforeUpdate");var r=n.$el,i=n._vnode,o=xo;xo=n,n._vnode=e,n.$el=i?n.__patch__(i,e):n.__patch__(n.$el,e,t,!1,n.$options._parentElm,n.$options._refElm),xo=o,r&&(r.__vue__=null),n.$el&&(n.$el.__vue__=n),n.$vnode&&n.$parent&&n.$vnode===n.$parent._vnode&&(n.$parent.$el=n.$el)},e.prototype.$forceUpdate=function(){var e=this;e._watcher&&e._watcher.update()},e.prototype.$destroy=function(){var e=this;if(!e._isBeingDestroyed){$e(e,"beforeDestroy"),e._isBeingDestroyed=!0;var t=e.$parent;!t||t._isBeingDestroyed||e.$options.abstract||f(t.$children,e),e._watcher&&e._watcher.teardown();for(var n=e._watchers.length;n--;)e._watchers[n].teardown();e._data.__ob__&&e._data.__ob__.vmCount--,e._isDestroyed=!0,e.__patch__(e._vnode,null),$e(e,"destroyed"),e.$off(),e.$el&&(e.$el.__vue__=null),e.$options._parentElm=e.$options._refElm=null}}}(vt),function(e){e.prototype.$nextTick=function(e){return ao(e,this)},e.prototype._render=function(){var e=this,t=e.$options,n=t.render,r=t.staticRenderFns,i=t._parentVnode;if(e._isMounted)for(var o in e.$slots)e.$slots[o]=Z(e.$slots[o]);e.$scopedSlots=i&&i.data.scopedSlots||Hi,r&&!e._staticTrees&&(e._staticTrees=[]),e.$vnode=i;var a;try{a=n.call(e._renderProxy,e.$createElement)}catch(t){k(t,e,"render function"),a=e._vnode}return a instanceof yo||(a=$o()),a.parent=i,a},e.prototype._o=at,e.prototype._n=u,e.prototype._s=c,e.prototype._l=et,e.prototype._t=tt,e.prototype._q=_,e.prototype._i=b,e.prototype._m=ot,e.prototype._f=nt,e.prototype._k=rt,e.prototype._b=it,e.prototype._v=q,e.prototype._e=$o,e.prototype._u=ve}(vt);var Bo=[String,RegExp],Ho={name:"keep-alive",abstract:!0,props:{include:Bo,exclude:Bo},created:function(){this.cache=Object.create(null)},destroyed:function(){var e=this;for(var t in e.cache)wt(e.cache[t])},watch:{include:function(e){xt(this.cache,this._vnode,function(t){return Ct(e,t)})},exclude:function(e){xt(this.cache,this._vnode,function(t){return!Ct(e,t)})}},render:function(){var e=se(this.$slots.default),t=e&&e.componentOptions;if(t){var n=$t(t);if(n&&(this.include&&!Ct(this.include,n)||this.exclude&&Ct(this.exclude,n)))return e;var r=null==e.key?t.Ctor.cid+(t.tag?"::"+t.tag:""):e.key;this.cache[r]?e.componentInstance=this.cache[r].componentInstance:this.cache[r]=e,e.data.keepAlive=!0}return e}},Uo={KeepAlive:Ho};!function(e){var t={};t.get=function(){return Bi},Object.defineProperty(e,"config",t),e.util={warn:Vi,extend:m,mergeOptions:H,defineReactive:N},e.set=L,e.delete=I,e.nextTick=ao,e.options=Object.create(null),Ri.forEach(function(t){e.options[t+"s"]=Object.create(null)}),e.options._base=e,m(e.options.components,Uo),ht(e),mt(e),gt(e),bt(e)}(vt),Object.defineProperty(vt.prototype,"$isServer",{get:ro}),Object.defineProperty(vt.prototype,"$ssrContext",{get:function(){return this.$vnode.ssrContext}}),vt.version="2.3.3";var Vo,zo,Jo,Ko,qo,Wo,Zo,Go,Yo,Qo=l("style,class"),Xo=l("input,textarea,option,select"),ea=function(e,t,n){return"value"===n&&Xo(e)&&"button"!==t||"selected"===n&&"option"===e||"checked"===n&&"input"===e||"muted"===n&&"video"===e},ta=l("contenteditable,draggable,spellcheck"),na=l("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),ra="http://www.w3.org/1999/xlink",ia=function(e){return":"===e.charAt(5)&&"xlink"===e.slice(0,5)},oa=function(e){return ia(e)?e.slice(6,e.length):""},aa=function(e){return null==e||!1===e},sa={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"},ca=l("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template"),ua=l("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",!0),la=function(e){return"pre"===e},fa=function(e){return ca(e)||ua(e)},pa=Object.create(null),da=Object.freeze({createElement:Lt,createElementNS:It,createTextNode:Dt,createComment:Mt,insertBefore:Pt,removeChild:Rt,appendChild:Ft,parentNode:Bt,nextSibling:Ht,tagName:Ut,setTextContent:Vt,setAttribute:zt}),va={create:function(e,t){Jt(t)},update:function(e,t){
e.data.ref!==t.data.ref&&(Jt(e,!0),Jt(t))},destroy:function(e){Jt(e,!0)}},ha=new yo("",{},[]),ma=["create","activate","update","remove","destroy"],ga={create:Zt,update:Zt,destroy:function(e){Zt(e,ha)}},ya=Object.create(null),_a=[va,ga],ba={create:en,update:en},$a={create:nn,update:nn},Ca=/[\w).+\-_$\]]/,xa="__r",wa="__c",ka={create:En,update:En},Aa={create:jn,update:jn},Oa=d(function(e){var t={};return e.split(/;(?![^(]*\))/g).forEach(function(e){if(e){var n=e.split(/:(.+)/);n.length>1&&(t[n[0].trim()]=n[1].trim())}}),t}),Sa=/^--/,Ta=/\s*!important$/,Ea=function(e,t,n){if(Sa.test(t))e.style.setProperty(t,n);else if(Ta.test(n))e.style.setProperty(t,n.replace(Ta,""),"important");else{var r=Na(t);if(Array.isArray(n))for(var i=0,o=n.length;i<o;i++)e.style[r]=n[i];else e.style[r]=n}},ja=["Webkit","Moz","ms"],Na=d(function(e){if(Yo=Yo||document.createElement("div"),"filter"!==(e=Ni(e))&&e in Yo.style)return e;for(var t=e.charAt(0).toUpperCase()+e.slice(1),n=0;n<ja.length;n++){var r=ja[n]+t;if(r in Yo.style)return r}}),La={create:Rn,update:Rn},Ia=d(function(e){return{enterClass:e+"-enter",enterToClass:e+"-enter-to",enterActiveClass:e+"-enter-active",leaveClass:e+"-leave",leaveToClass:e+"-leave-to",leaveActiveClass:e+"-leave-active"}}),Da=Ji&&!Wi,Ma="transition",Pa="animation",Ra="transition",Fa="transitionend",Ba="animation",Ha="animationend";Da&&(void 0===window.ontransitionend&&void 0!==window.onwebkittransitionend&&(Ra="WebkitTransition",Fa="webkitTransitionEnd"),void 0===window.onanimationend&&void 0!==window.onwebkitanimationend&&(Ba="WebkitAnimation",Ha="webkitAnimationEnd"));var Ua=Ji&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):setTimeout,Va=/\b(transform|all)(,|$)/,za=Ji?{create:Xn,activate:Xn,remove:function(e,t){!0!==e.data.show?Gn(e,t):t()}}:{},Ja=[ba,$a,ka,Aa,La,za],Ka=Ja.concat(_a),qa=function(r){function o(e){return new yo(E.tagName(e).toLowerCase(),{},[],void 0,e)}function a(e,t){function n(){0==--n.listeners&&s(e)}return n.listeners=t,n}function s(e){var n=E.parentNode(e);t(n)&&E.removeChild(n,e)}function c(e,r,i,o,a){if(e.isRootInsert=!a,!u(e,r,i,o)){var s=e.data,c=e.children,l=e.tag;t(l)?(e.elm=e.ns?E.createElementNS(e.ns,l):E.createElement(l,e),g(e),v(e,c,r),t(s)&&m(e,r),d(i,e.elm,o)):n(e.isComment)?(e.elm=E.createComment(e.text),d(i,e.elm,o)):(e.elm=E.createTextNode(e.text),d(i,e.elm,o))}}function u(e,r,i,o){var a=e.data;if(t(a)){var s=t(e.componentInstance)&&a.keepAlive;if(t(a=a.hook)&&t(a=a.init)&&a(e,!1,i,o),t(e.componentInstance))return f(e,r),n(s)&&p(e,r,i,o),!0}}function f(e,n){t(e.data.pendingInsert)&&n.push.apply(n,e.data.pendingInsert),e.elm=e.componentInstance.$el,h(e)?(m(e,n),g(e)):(Jt(e),n.push(e))}function p(e,n,r,i){for(var o,a=e;a.componentInstance;)if(a=a.componentInstance._vnode,t(o=a.data)&&t(o=o.transition)){for(o=0;o<S.activate.length;++o)S.activate[o](ha,a);n.push(a);break}d(r,e.elm,i)}function d(e,n,r){t(e)&&(t(r)?r.parentNode===e&&E.insertBefore(e,n,r):E.appendChild(e,n))}function v(e,t,n){if(Array.isArray(t))for(var r=0;r<t.length;++r)c(t[r],n,e.elm,null,!0);else i(e.text)&&E.appendChild(e.elm,E.createTextNode(e.text))}function h(e){for(;e.componentInstance;)e=e.componentInstance._vnode;return t(e.tag)}function m(e,n){for(var r=0;r<S.create.length;++r)S.create[r](ha,e);A=e.data.hook,t(A)&&(t(A.create)&&A.create(ha,e),t(A.insert)&&n.push(e))}function g(e){for(var n,r=e;r;)t(n=r.context)&&t(n=n.$options._scopeId)&&E.setAttribute(e.elm,n,""),r=r.parent;t(n=xo)&&n!==e.context&&t(n=n.$options._scopeId)&&E.setAttribute(e.elm,n,"")}function y(e,t,n,r,i,o){for(;r<=i;++r)c(n[r],o,e,t)}function _(e){var n,r,i=e.data;if(t(i))for(t(n=i.hook)&&t(n=n.destroy)&&n(e),n=0;n<S.destroy.length;++n)S.destroy[n](e);if(t(n=e.children))for(r=0;r<e.children.length;++r)_(e.children[r])}function b(e,n,r,i){for(;r<=i;++r){var o=n[r];t(o)&&(t(o.tag)?($(o),_(o)):s(o.elm))}}function $(e,n){if(t(n)||t(e.data)){var r,i=S.remove.length+1;for(t(n)?n.listeners+=i:n=a(e.elm,i),t(r=e.componentInstance)&&t(r=r._vnode)&&t(r.data)&&$(r,n),r=0;r<S.remove.length;++r)S.remove[r](e,n);t(r=e.data.hook)&&t(r=r.remove)?r(e,n):n()}else s(e.elm)}function C(n,r,i,o,a){for(var s,u,l,f,p=0,d=0,v=r.length-1,h=r[0],m=r[v],g=i.length-1,_=i[0],$=i[g],C=!a;p<=v&&d<=g;)e(h)?h=r[++p]:e(m)?m=r[--v]:Kt(h,_)?(x(h,_,o),h=r[++p],_=i[++d]):Kt(m,$)?(x(m,$,o),m=r[--v],$=i[--g]):Kt(h,$)?(x(h,$,o),C&&E.insertBefore(n,h.elm,E.nextSibling(m.elm)),h=r[++p],$=i[--g]):Kt(m,_)?(x(m,_,o),C&&E.insertBefore(n,m.elm,h.elm),m=r[--v],_=i[++d]):(e(s)&&(s=Wt(r,p,v)),u=t(_.key)?s[_.key]:null,e(u)?(c(_,o,n,h.elm),_=i[++d]):(l=r[u],Kt(l,_)?(x(l,_,o),r[u]=void 0,C&&E.insertBefore(n,_.elm,h.elm),_=i[++d]):(c(_,o,n,h.elm),_=i[++d])));p>v?(f=e(i[g+1])?null:i[g+1].elm,y(n,f,i,d,g,o)):d>g&&b(n,r,p,v)}function x(r,i,o,a){if(r!==i){if(n(i.isStatic)&&n(r.isStatic)&&i.key===r.key&&(n(i.isCloned)||n(i.isOnce)))return i.elm=r.elm,void(i.componentInstance=r.componentInstance);var s,c=i.data;t(c)&&t(s=c.hook)&&t(s=s.prepatch)&&s(r,i);var u=i.elm=r.elm,l=r.children,f=i.children;if(t(c)&&h(i)){for(s=0;s<S.update.length;++s)S.update[s](r,i);t(s=c.hook)&&t(s=s.update)&&s(r,i)}e(i.text)?t(l)&&t(f)?l!==f&&C(u,l,f,o,a):t(f)?(t(r.text)&&E.setTextContent(u,""),y(u,null,f,0,f.length-1,o)):t(l)?b(u,l,0,l.length-1):t(r.text)&&E.setTextContent(u,""):r.text!==i.text&&E.setTextContent(u,i.text),t(c)&&t(s=c.hook)&&t(s=s.postpatch)&&s(r,i)}}function w(e,r,i){if(n(i)&&t(e.parent))e.parent.data.pendingInsert=r;else for(var o=0;o<r.length;++o)r[o].data.hook.insert(r[o])}function k(e,n,r){n.elm=e;var i=n.tag,o=n.data,a=n.children;if(t(o)&&(t(A=o.hook)&&t(A=A.init)&&A(n,!0),t(A=n.componentInstance)))return f(n,r),!0;if(t(i)){if(t(a))if(e.hasChildNodes()){for(var s=!0,c=e.firstChild,u=0;u<a.length;u++){if(!c||!k(c,a[u],r)){s=!1;break}c=c.nextSibling}if(!s||c)return!1}else v(n,a,r);if(t(o))for(var l in o)if(!j(l)){m(n,r);break}}else e.data!==n.text&&(e.data=n.text);return!0}var A,O,S={},T=r.modules,E=r.nodeOps;for(A=0;A<ma.length;++A)for(S[ma[A]]=[],O=0;O<T.length;++O)t(T[O][ma[A]])&&S[ma[A]].push(T[O][ma[A]]);var j=l("attrs,style,class,staticClass,staticStyle,key");return function(r,i,a,s,u,l){if(e(i))return void(t(r)&&_(r));var f=!1,p=[];if(e(r))f=!0,c(i,p,u,l);else{var d=t(r.nodeType);if(!d&&Kt(r,i))x(r,i,p,s);else{if(d){if(1===r.nodeType&&r.hasAttribute(Pi)&&(r.removeAttribute(Pi),a=!0),n(a)&&k(r,i,p))return w(i,p,!0),r;r=o(r)}var v=r.elm,m=E.parentNode(v);if(c(i,p,v._leaveCb?null:m,E.nextSibling(v)),t(i.parent)){for(var g=i.parent;g;)g.elm=i.elm,g=g.parent;if(h(i))for(var y=0;y<S.create.length;++y)S.create[y](ha,i.parent)}t(m)?b(m,[r],0,0):t(r.tag)&&_(r)}}return w(i,p,f),i.elm}}({nodeOps:da,modules:Ka});Wi&&document.addEventListener("selectionchange",function(){var e=document.activeElement;e&&e.vmodel&&or(e,"input")});var Wa={inserted:function(e,t,n){if("select"===n.tag){var r=function(){er(e,t,n.context)};r(),(qi||Zi)&&setTimeout(r,0)}else"textarea"!==n.tag&&"text"!==e.type&&"password"!==e.type||(e._vModifiers=t.modifiers,t.modifiers.lazy||(e.addEventListener("change",ir),Gi||(e.addEventListener("compositionstart",rr),e.addEventListener("compositionend",ir)),Wi&&(e.vmodel=!0)))},componentUpdated:function(e,t,n){if("select"===n.tag){er(e,t,n.context);(e.multiple?t.value.some(function(t){return tr(t,e.options)}):t.value!==t.oldValue&&tr(t.value,e.options))&&or(e,"change")}}},Za={bind:function(e,t,n){var r=t.value;n=ar(n);var i=n.data&&n.data.transition,o=e.__vOriginalDisplay="none"===e.style.display?"":e.style.display;r&&i&&!Wi?(n.data.show=!0,Zn(n,function(){e.style.display=o})):e.style.display=r?o:"none"},update:function(e,t,n){var r=t.value;r!==t.oldValue&&(n=ar(n),n.data&&n.data.transition&&!Wi?(n.data.show=!0,r?Zn(n,function(){e.style.display=e.__vOriginalDisplay}):Gn(n,function(){e.style.display="none"})):e.style.display=r?e.__vOriginalDisplay:"none")},unbind:function(e,t,n,r,i){i||(e.style.display=e.__vOriginalDisplay)}},Ga={model:Wa,show:Za},Ya={name:String,appear:Boolean,css:Boolean,mode:String,type:String,enterClass:String,leaveClass:String,enterToClass:String,leaveToClass:String,enterActiveClass:String,leaveActiveClass:String,appearClass:String,appearActiveClass:String,appearToClass:String,duration:[Number,String,Object]},Qa={name:"transition",props:Ya,abstract:!0,render:function(e){var t=this,n=this.$slots.default;if(n&&(n=n.filter(function(e){return e.tag}),n.length)){var r=this.mode,o=n[0];if(lr(this.$vnode))return o;var a=sr(o);if(!a)return o;if(this._leaving)return ur(e,o);var s="__transition-"+this._uid+"-";a.key=null==a.key?s+a.tag:i(a.key)?0===String(a.key).indexOf(s)?a.key:s+a.key:a.key;var c=(a.data||(a.data={})).transition=cr(this),u=this._vnode,l=sr(u);if(a.data.directives&&a.data.directives.some(function(e){return"show"===e.name})&&(a.data.show=!0),l&&l.data&&!fr(a,l)){var f=l&&(l.data.transition=m({},c));if("out-in"===r)return this._leaving=!0,Q(f,"afterLeave",function(){t._leaving=!1,t.$forceUpdate()}),ur(e,o);if("in-out"===r){var p,d=function(){p()};Q(c,"afterEnter",d),Q(c,"enterCancelled",d),Q(f,"delayLeave",function(e){p=e})}}return o}}},Xa=m({tag:String,moveClass:String},Ya);delete Xa.mode;var es={props:Xa,render:function(e){for(var t=this.tag||this.$vnode.data.tag||"span",n=Object.create(null),r=this.prevChildren=this.children,i=this.$slots.default||[],o=this.children=[],a=cr(this),s=0;s<i.length;s++){var c=i[s];c.tag&&null!=c.key&&0!==String(c.key).indexOf("__vlist")&&(o.push(c),n[c.key]=c,(c.data||(c.data={})).transition=a)}if(r){for(var u=[],l=[],f=0;f<r.length;f++){var p=r[f];p.data.transition=a,p.data.pos=p.elm.getBoundingClientRect(),n[p.key]?u.push(p):l.push(p)}this.kept=e(t,null,u),this.removed=l}return e(t,null,o)},beforeUpdate:function(){this.__patch__(this._vnode,this.kept,!1,!0),this._vnode=this.kept},updated:function(){var e=this.prevChildren,t=this.moveClass||(this.name||"v")+"-move";if(e.length&&this.hasMove(e[0].elm,t)){e.forEach(pr),e.forEach(dr),e.forEach(vr);var n=document.body;n.offsetHeight;e.forEach(function(e){if(e.data.moved){var n=e.elm,r=n.style;Vn(n,t),r.transform=r.WebkitTransform=r.transitionDuration="",n.addEventListener(Fa,n._moveCb=function e(r){r&&!/transform$/.test(r.propertyName)||(n.removeEventListener(Fa,e),n._moveCb=null,zn(n,t))})}})}},methods:{hasMove:function(e,t){if(!Da)return!1;if(null!=this._hasMove)return this._hasMove;var n=e.cloneNode();e._transitionClasses&&e._transitionClasses.forEach(function(e){Bn(n,e)}),Fn(n,t),n.style.display="none",this.$el.appendChild(n);var r=Kn(n);return this.$el.removeChild(n),this._hasMove=r.hasTransform}}},ts={Transition:Qa,TransitionGroup:es};vt.config.mustUseProp=ea,vt.config.isReservedTag=fa,vt.config.isReservedAttr=Qo,vt.config.getTagNamespace=Et,vt.config.isUnknownElement=jt,m(vt.options.directives,Ga),m(vt.options.components,ts),vt.prototype.__patch__=Ji?qa:y,vt.prototype.$mount=function(e,t){return e=e&&Ji?Nt(e):void 0,me(this,e,t)},setTimeout(function(){Bi.devtools&&io&&io.emit("init",vt)},0);var ns,rs=!!Ji&&function(e,t){var n=document.createElement("div");return n.innerHTML='<div a="'+e+'">',n.innerHTML.indexOf(t)>0}("\n","&#10;"),is=l("area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr"),os=l("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source"),as=l("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track"),ss=[/"([^"]*)"+/.source,/'([^']*)'+/.source,/([^\s"'=<>`]+)/.source],cs=new RegExp("^\\s*"+/([^\s"'<>\/=]+)/.source+"(?:\\s*("+/(?:=)/.source+")\\s*(?:"+ss.join("|")+"))?"),us="[a-zA-Z_][\\w\\-\\.]*",ls=new RegExp("^<((?:"+us+"\\:)?"+us+")"),fs=/^\s*(\/?)>/,ps=new RegExp("^<\\/((?:"+us+"\\:)?"+us+")[^>]*>"),ds=/^<!DOCTYPE [^>]+>/i,vs=/^<!--/,hs=/^<!\[/,ms=!1;"x".replace(/x(.)?/g,function(e,t){ms=""===t});var gs,ys,_s,bs,$s,Cs,xs,ws,ks,As,Os,Ss,Ts,Es,js,Ns,Ls,Is,Ds=l("script,style,textarea",!0),Ms={},Ps={"&lt;":"<","&gt;":">","&quot;":'"',"&amp;":"&","&#10;":"\n"},Rs=/&(?:lt|gt|quot|amp);/g,Fs=/&(?:lt|gt|quot|amp|#10);/g,Bs=/\{\{((?:.|\n)+?)\}\}/g,Hs=d(function(e){var t=e[0].replace(/[-.*+?^${}()|[\]\/\\]/g,"\\$&"),n=e[1].replace(/[-.*+?^${}()|[\]\/\\]/g,"\\$&");return new RegExp(t+"((?:.|\\n)+?)"+n,"g")}),Us=/^@|^v-on:/,Vs=/^v-|^@|^:/,zs=/(.*?)\s+(?:in|of)\s+(.*)/,Js=/\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/,Ks=/:(.*)$/,qs=/^:|^v-bind:/,Ws=/\.[^.]+/g,Zs=d(hr),Gs=/^xmlns:NS\d+/,Ys=/^NS\d+:/,Qs=d(Br),Xs=/^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/,ec=/^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/,tc={esc:27,tab:9,enter:13,space:32,up:38,left:37,right:39,down:40,delete:[8,46]},nc=function(e){return"if("+e+")return null;"},rc={stop:"$event.stopPropagation();",prevent:"$event.preventDefault();",self:nc("$event.target !== $event.currentTarget"),ctrl:nc("!$event.ctrlKey"),shift:nc("!$event.shiftKey"),alt:nc("!$event.altKey"),meta:nc("!$event.metaKey"),left:nc("'button' in $event && $event.button !== 0"),middle:nc("'button' in $event && $event.button !== 1"),right:nc("'button' in $event && $event.button !== 2")},ic={bind:Gr,cloak:y},oc={staticKeys:["staticClass"],transformNode:Ci,genData:xi},ac={staticKeys:["staticStyle"],transformNode:wi,genData:ki},sc=[oc,ac],cc={model:Cn,text:Ai,html:Oi},uc={expectHTML:!0,modules:sc,directives:cc,isPreTag:la,isUnaryTag:is,mustUseProp:ea,canBeLeftOpenTag:os,isReservedTag:fa,getTagNamespace:Et,staticKeys:function(e){return e.reduce(function(e,t){return e.concat(t.staticKeys||[])},[]).join(",")}(sc)},lc=function(e){function t(t,n){var r=Object.create(e),i=[],o=[];if(r.warn=function(e,t){(t?o:i).push(e)},n){n.modules&&(r.modules=(e.modules||[]).concat(n.modules)),n.directives&&(r.directives=m(Object.create(e.directives),n.directives));for(var a in n)"modules"!==a&&"directives"!==a&&(r[a]=n[a])}var s=bi(t,r);return s.errors=i,s.tips=o,s}function n(e,n,i){n=n||{};var o=n.delimiters?String(n.delimiters)+e:e;if(r[o])return r[o];var a=t(e,n),s={},c=[];s.render=$i(a.render,c);var u=a.staticRenderFns.length;s.staticRenderFns=new Array(u);for(var l=0;l<u;l++)s.staticRenderFns[l]=$i(a.staticRenderFns[l],c);return r[o]=s}var r=Object.create(null);return{compile:t,compileToFunctions:n}}(uc),fc=lc.compileToFunctions,pc=d(function(e){var t=Nt(e);return t&&t.innerHTML}),dc=vt.prototype.$mount;return vt.prototype.$mount=function(e,t){if((e=e&&Nt(e))===document.body||e===document.documentElement)return this;var n=this.$options;if(!n.render){var r=n.template;if(r)if("string"==typeof r)"#"===r.charAt(0)&&(r=pc(r));else{if(!r.nodeType)return this;r=r.innerHTML}else e&&(r=Si(e));if(r){var i=fc(r,{shouldDecodeNewlines:rs,delimiters:n.delimiters},this),o=i.render,a=i.staticRenderFns;n.render=o,n.staticRenderFns=a}}return dc.call(this,e,t)},vt.compile=fc,vt});;/*!
 * vue-resource v1.2.1
 * https://github.com/pagekit/vue-resource
 * Released under the MIT License.
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.VueResource=e()}(this,function(){"use strict";function t(t){this.state=J,this.value=void 0,this.deferred=[];var e=this;try{t(function(t){e.resolve(t)},function(t){e.reject(t)})}catch(t){e.reject(t)}}function e(t,e){t instanceof Promise?this.promise=t:this.promise=new Promise(t.bind(e)),this.context=e}function n(t){"undefined"!=typeof console&&Q&&console.warn("[VueResource warn]: "+t)}function o(t){"undefined"!=typeof console&&console.error(t)}function r(t,e){return G(t,e)}function i(t){return t?t.replace(/^\s*|\s*$/g,""):""}function u(t){return t?t.toLowerCase():""}function s(t){return t?t.toUpperCase():""}function a(t){return"string"==typeof t}function c(t){return"function"==typeof t}function f(t){return null!==t&&"object"==typeof t}function h(t){return f(t)&&Object.getPrototypeOf(t)==Object.prototype}function p(t){return"undefined"!=typeof Blob&&t instanceof Blob}function d(t){return"undefined"!=typeof FormData&&t instanceof FormData}function l(t,n,o){var r=e.resolve(t);return arguments.length<2?r:r.then(n,o)}function m(t,e,n){return n=n||{},c(n)&&(n=n.call(e)),v(t.bind({$vm:e,$options:n}),t,{$options:n})}function y(t,e){var n,o;if(tt(t))for(n=0;n<t.length;n++)e.call(t[n],t[n],n);else if(f(t))for(o in t)_.call(t,o)&&e.call(t[o],t[o],o);return t}function v(t){var e=K.call(arguments,1);return e.forEach(function(e){w(t,e,!0)}),t}function b(t){var e=K.call(arguments,1);return e.forEach(function(e){for(var n in e)void 0===t[n]&&(t[n]=e[n])}),t}function g(t){var e=K.call(arguments,1);return e.forEach(function(e){w(t,e)}),t}function w(t,e,n){for(var o in e)n&&(h(e[o])||tt(e[o]))?(h(e[o])&&!h(t[o])&&(t[o]={}),tt(e[o])&&!tt(t[o])&&(t[o]=[]),w(t[o],e[o],n)):void 0!==e[o]&&(t[o]=e[o])}function T(t,e,n){var o=x(t),r=o.expand(e);return n&&n.push.apply(n,o.vars),r}function x(t){var e=["+","#",".","/",";","?","&"],n=[];return{vars:n,expand:function(o){return t.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g,function(t,r,i){if(r){var u=null,s=[];if(e.indexOf(r.charAt(0))!==-1&&(u=r.charAt(0),r=r.substr(1)),r.split(/,/g).forEach(function(t){var e=/([^:\*]*)(?::(\d+)|(\*))?/.exec(t);s.push.apply(s,j(o,u,e[1],e[2]||e[3])),n.push(e[1])}),u&&"+"!==u){var a=",";return"?"===u?a="&":"#"!==u&&(a=u),(0!==s.length?u:"")+s.join(a)}return s.join(",")}return C(i)})}}}function j(t,e,n,o){var r=t[n],i=[];if(E(r)&&""!==r)if("string"==typeof r||"number"==typeof r||"boolean"==typeof r)r=r.toString(),o&&"*"!==o&&(r=r.substring(0,parseInt(o,10))),i.push(P(e,r,O(e)?n:null));else if("*"===o)Array.isArray(r)?r.filter(E).forEach(function(t){i.push(P(e,t,O(e)?n:null))}):Object.keys(r).forEach(function(t){E(r[t])&&i.push(P(e,r[t],t))});else{var u=[];Array.isArray(r)?r.filter(E).forEach(function(t){u.push(P(e,t))}):Object.keys(r).forEach(function(t){E(r[t])&&(u.push(encodeURIComponent(t)),u.push(P(e,r[t].toString())))}),O(e)?i.push(encodeURIComponent(n)+"="+u.join(",")):0!==u.length&&i.push(u.join(","))}else";"===e?i.push(encodeURIComponent(n)):""!==r||"&"!==e&&"?"!==e?""===r&&i.push(""):i.push(encodeURIComponent(n)+"=");return i}function E(t){return void 0!==t&&null!==t}function O(t){return";"===t||"&"===t||"?"===t}function P(t,e,n){return e="+"===t||"#"===t?C(e):encodeURIComponent(e),n?encodeURIComponent(n)+"="+e:e}function C(t){return t.split(/(%[0-9A-Fa-f]{2})/g).map(function(t){return/%[0-9A-Fa-f]/.test(t)||(t=encodeURI(t)),t}).join("")}function $(t,e){var n,o=this||{},r=t;return a(t)&&(r={url:t,params:e}),r=v({},$.options,o.$options,r),$.transforms.forEach(function(t){n=U(t,n,o.$vm)}),n(r)}function U(t,e,n){return function(o){return t.call(n,o,e)}}function R(t,e,n){var o,r=tt(e),i=h(e);y(e,function(e,u){o=f(e)||tt(e),n&&(u=n+"["+(i||o?u:"")+"]"),!n&&r?t.add(e.name,e.value):o?R(t,e,u):t.add(u,e)})}function A(t){var e=t.match(/^\[|^\{(?!\{)/),n={"[":/]$/,"{":/}$/};return e&&n[e[0]].test(t)}function S(t,e){var n=t.client||(Y?mt:yt);e(n(t))}function k(t,e){return Object.keys(t).reduce(function(t,n){return u(e)===u(n)?n:t},null)}function I(t){if(/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return i(t)}function H(t){return new e(function(e){var n=new FileReader;n.readAsText(t),n.onload=function(){e(n.result)}})}function B(t){return 0===t.type.indexOf("text")||t.type.indexOf("json")!==-1}function L(t){var n=this||{},r=vt(n.$vm);return b(t||{},n.$options,L.options),L.interceptors.forEach(function(t){r.use(t)}),r(new wt(t)).then(function(t){return t.ok?t:e.reject(t)},function(t){return t instanceof Error&&o(t),e.reject(t)})}function q(t,e,n,o){var r=this||{},i={};return n=et({},q.actions,n),y(n,function(n,u){n=v({url:t,params:et({},e)},o,n),i[u]=function(){return(r.$http||L)(M(n,arguments))}}),i}function M(t,e){var n,o=et({},t),r={};switch(e.length){case 2:r=e[0],n=e[1];break;case 1:/^(POST|PUT|PATCH)$/i.test(o.method)?n=e[0]:r=e[0];break;case 0:break;default:throw"Expected up to 2 arguments [params, body], got "+e.length+" arguments"}return o.body=n,o.params=et({},o.params,r),o}function N(t){N.installed||(Z(t),t.url=$,t.http=L,t.resource=q,t.Promise=e,Object.defineProperties(t.prototype,{$url:{get:function(){return m(t.url,this,this.$options.url)}},$http:{get:function(){return m(t.http,this,this.$options.http)}},$resource:{get:function(){return t.resource.bind(this)}},$promise:{get:function(){var e=this;return function(n){return new t.Promise(n,e)}}}}))}var D=0,F=1,J=2;t.reject=function(e){return new t(function(t,n){n(e)})},t.resolve=function(e){return new t(function(t,n){t(e)})},t.all=function(e){return new t(function(n,o){function r(t){return function(o){u[t]=o,i+=1,i===e.length&&n(u)}}var i=0,u=[];0===e.length&&n(u);for(var s=0;s<e.length;s+=1)t.resolve(e[s]).then(r(s),o)})},t.race=function(e){return new t(function(n,o){for(var r=0;r<e.length;r+=1)t.resolve(e[r]).then(n,o)})};var W=t.prototype;W.resolve=function(t){var e=this;if(e.state===J){if(t===e)throw new TypeError("Promise settled with itself.");var n=!1;try{var o=t&&t.then;if(null!==t&&"object"==typeof t&&"function"==typeof o)return void o.call(t,function(t){n||e.resolve(t),n=!0},function(t){n||e.reject(t),n=!0})}catch(t){return void(n||e.reject(t))}e.state=D,e.value=t,e.notify()}},W.reject=function(t){var e=this;if(e.state===J){if(t===e)throw new TypeError("Promise settled with itself.");e.state=F,e.value=t,e.notify()}},W.notify=function(){var t=this;r(function(){if(t.state!==J)for(;t.deferred.length;){var e=t.deferred.shift(),n=e[0],o=e[1],r=e[2],i=e[3];try{t.state===D?r("function"==typeof n?n.call(void 0,t.value):t.value):t.state===F&&("function"==typeof o?r(o.call(void 0,t.value)):i(t.value))}catch(t){i(t)}}})},W.then=function(e,n){var o=this;return new t(function(t,r){o.deferred.push([e,n,t,r]),o.notify()})},W.catch=function(t){return this.then(void 0,t)},"undefined"==typeof Promise&&(window.Promise=t),e.all=function(t,n){return new e(Promise.all(t),n)},e.resolve=function(t,n){return new e(Promise.resolve(t),n)},e.reject=function(t,n){return new e(Promise.reject(t),n)},e.race=function(t,n){return new e(Promise.race(t),n)};var X=e.prototype;X.bind=function(t){return this.context=t,this},X.then=function(t,n){return t&&t.bind&&this.context&&(t=t.bind(this.context)),n&&n.bind&&this.context&&(n=n.bind(this.context)),new e(this.promise.then(t,n),this.context)},X.catch=function(t){return t&&t.bind&&this.context&&(t=t.bind(this.context)),new e(this.promise.catch(t),this.context)},X.finally=function(t){return this.then(function(e){return t.call(this),e},function(e){return t.call(this),Promise.reject(e)})};var G,V={},_=V.hasOwnProperty,z=[],K=z.slice,Q=!1,Y="undefined"!=typeof window,Z=function(t){var e=t.config,n=t.nextTick;G=n,Q=e.debug||!e.silent},tt=Array.isArray,et=Object.assign||g,nt=function(t,e){var n=e(t);return a(t.root)&&!n.match(/^(https?:)?\//)&&(n=t.root+"/"+n),n},ot=function(t,e){var n=Object.keys($.options.params),o={},r=e(t);return y(t.params,function(t,e){n.indexOf(e)===-1&&(o[e]=t)}),o=$.params(o),o&&(r+=(r.indexOf("?")==-1?"?":"&")+o),r},rt=function(t){var e=[],n=T(t.url,t.params,e);return e.forEach(function(e){delete t.params[e]}),n};$.options={url:"",root:null,params:{}},$.transforms=[rt,ot,nt],$.params=function(t){var e=[],n=encodeURIComponent;return e.add=function(t,e){c(e)&&(e=e()),null===e&&(e=""),this.push(n(t)+"="+n(e))},R(e,t),e.join("&").replace(/%20/g,"+")},$.parse=function(t){var e=document.createElement("a");return document.documentMode&&(e.href=t,t=e.href),e.href=t,{href:e.href,protocol:e.protocol?e.protocol.replace(/:$/,""):"",port:e.port,host:e.host,hostname:e.hostname,pathname:"/"===e.pathname.charAt(0)?e.pathname:"/"+e.pathname,search:e.search?e.search.replace(/^\?/,""):"",hash:e.hash?e.hash.replace(/^#/,""):""}};var it=function(t){return new e(function(e){var n=new XDomainRequest,o=function(o){var r=o.type,i=0;"load"===r?i=200:"error"===r&&(i=500),e(t.respondWith(n.responseText,{status:i}))};t.abort=function(){return n.abort()},n.open(t.method,t.getUrl()),t.timeout&&(n.timeout=t.timeout),n.onload=o,n.onabort=o,n.onerror=o,n.ontimeout=o,n.onprogress=function(){},n.send(t.getBody())})},ut=Y&&"withCredentials"in new XMLHttpRequest,st=function(t,e){if(Y){var n=$.parse(location.href),o=$.parse(t.getUrl());o.protocol===n.protocol&&o.host===n.host||(t.crossOrigin=!0,t.emulateHTTP=!1,ut||(t.client=it))}e()},at=function(t,e){d(t.body)?t.headers.delete("Content-Type"):(f(t.body)||tt(t.body))&&(t.emulateJSON?(t.body=$.params(t.body),t.headers.set("Content-Type","application/x-www-form-urlencoded")):t.body=JSON.stringify(t.body)),e(function(t){return Object.defineProperty(t,"data",{get:function(){return this.body},set:function(t){this.body=t}}),t.bodyText?l(t.text(),function(e){var n=t.headers.get("Content-Type")||"";if(0===n.indexOf("application/json")||A(e))try{t.body=JSON.parse(e)}catch(e){t.body=null}else t.body=e;return t}):t})},ct=function(t){return new e(function(e){var n,o,r=t.jsonp||"callback",i=t.jsonpCallback||"_jsonp"+Math.random().toString(36).substr(2),u=null;n=function(n){var r=n.type,s=0;"load"===r&&null!==u?s=200:"error"===r&&(s=500),s&&window[i]&&(delete window[i],document.body.removeChild(o)),e(t.respondWith(u,{status:s}))},window[i]=function(t){u=JSON.stringify(t)},t.abort=function(){n({type:"abort"})},t.params[r]=i,t.timeout&&setTimeout(t.abort,t.timeout),o=document.createElement("script"),o.src=t.getUrl(),o.type="text/javascript",o.async=!0,o.onload=n,o.onerror=n,document.body.appendChild(o)})},ft=function(t,e){"JSONP"==t.method&&(t.client=ct),e()},ht=function(t,e){c(t.before)&&t.before.call(this,t),e()},pt=function(t,e){t.emulateHTTP&&/^(PUT|PATCH|DELETE)$/i.test(t.method)&&(t.headers.set("X-HTTP-Method-Override",t.method),t.method="POST"),e()},dt=function(t,e){var n=et({},L.headers.common,t.crossOrigin?{}:L.headers.custom,L.headers[u(t.method)]);y(n,function(e,n){t.headers.has(n)||t.headers.set(n,e)}),e()},lt="undefined"!=typeof Blob&&"undefined"!=typeof FileReader,mt=function(t){return new e(function(e){var n=new XMLHttpRequest,o=function(o){var r=t.respondWith("response"in n?n.response:n.responseText,{status:1223===n.status?204:n.status,statusText:1223===n.status?"No Content":i(n.statusText)});y(i(n.getAllResponseHeaders()).split("\n"),function(t){r.headers.append(t.slice(0,t.indexOf(":")),t.slice(t.indexOf(":")+1))}),e(r)};t.abort=function(){return n.abort()},t.progress&&("GET"===t.method?n.addEventListener("progress",t.progress):/^(POST|PUT)$/i.test(t.method)&&n.upload.addEventListener("progress",t.progress)),n.open(t.method,t.getUrl(),!0),t.timeout&&(n.timeout=t.timeout),t.credentials===!0&&(n.withCredentials=!0),t.crossOrigin||t.headers.set("X-Requested-With","XMLHttpRequest"),"responseType"in n&&lt&&(n.responseType="blob"),t.headers.forEach(function(t,e){n.setRequestHeader(e,t)}),n.onload=o,n.onabort=o,n.onerror=o,n.ontimeout=o,n.send(t.getBody())})},yt=function(t){var n=require("got");return new e(function(e){var o,r=t.getUrl(),u=t.getBody(),s=t.method,a={};t.headers.forEach(function(t,e){a[e]=t}),n(r,{body:u,method:s,headers:a}).then(o=function(n){var o=t.respondWith(n.body,{status:n.statusCode,statusText:i(n.statusMessage)});y(n.headers,function(t,e){o.headers.set(e,t)}),e(o)},function(t){return o(t.response)})})},vt=function(t){function o(o){return new e(function(e){function s(){r=i.pop(),c(r)?r.call(t,o,a):(n("Invalid interceptor of type "+typeof r+", must be a function"),a())}function a(n){if(c(n))u.unshift(n);else if(f(n))return u.forEach(function(e){n=l(n,function(n){return e.call(t,n)||n})}),void l(n,e);s()}s()},t)}var r,i=[S],u=[];return f(t)||(t=null),o.use=function(t){i.push(t)},o},bt=function(t){var e=this;this.map={},y(t,function(t,n){return e.append(n,t)})};bt.prototype.has=function(t){return null!==k(this.map,t)},bt.prototype.get=function(t){var e=this.map[k(this.map,t)];return e?e.join():null},bt.prototype.getAll=function(t){return this.map[k(this.map,t)]||[]},bt.prototype.set=function(t,e){this.map[I(k(this.map,t)||t)]=[i(e)]},bt.prototype.append=function(t,e){var n=this.map[k(this.map,t)];n?n.push(i(e)):this.set(t,e)},bt.prototype.delete=function(t){delete this.map[k(this.map,t)]},bt.prototype.deleteAll=function(){this.map={}},bt.prototype.forEach=function(t,e){var n=this;y(this.map,function(o,r){y(o,function(o){return t.call(e,o,r,n)})})};var gt=function(t,e){var n=e.url,o=e.headers,r=e.status,i=e.statusText;this.url=n,this.ok=r>=200&&r<300,this.status=r||0,this.statusText=i||"",this.headers=new bt(o),this.body=t,a(t)?this.bodyText=t:p(t)&&(this.bodyBlob=t,B(t)&&(this.bodyText=H(t)))};gt.prototype.blob=function(){return l(this.bodyBlob)},gt.prototype.text=function(){return l(this.bodyText)},gt.prototype.json=function(){return l(this.text(),function(t){return JSON.parse(t)})};var wt=function(t){this.body=null,this.params={},et(this,t,{method:s(t.method||"GET")}),this.headers instanceof bt||(this.headers=new bt(this.headers))};wt.prototype.getUrl=function(){return $(this)},wt.prototype.getBody=function(){return this.body},wt.prototype.respondWith=function(t,e){return new gt(t,et(e||{},{url:this.getUrl()}))};var Tt={Accept:"application/json, text/plain, */*"},xt={"Content-Type":"application/json;charset=utf-8"};return L.options={},L.headers={put:xt,post:xt,patch:xt,delete:xt,common:Tt,custom:{}},L.interceptors=[ht,pt,at,ft,dt,st],["get","delete","head","jsonp"].forEach(function(t){L[t]=function(e,n){return this(et(n||{},{url:e,method:t}))}}),["post","put","patch"].forEach(function(t){L[t]=function(e,n,o){return this(et(o||{},{url:e,method:t,body:n}))}}),q.actions={get:{method:"GET"},save:{method:"POST"},query:{method:"GET"},update:{method:"PUT"},remove:{method:"DELETE"},delete:{method:"DELETE"}},"undefined"!=typeof window&&window.Vue&&window.Vue.use(N),N});;/*!
 * Keen UI v1.0.0 (https://github.com/JosephusPaye/keen-ui)
 * (c) 2017 Josephus Paye II
 * Released under the MIT License.
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.KeenUI=e():t.KeenUI=e()}(this,function(){return function(t){function e(n){if(i[n])return i[n].exports;var o=i[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var i={};return e.m=t,e.c=i,e.i=function(t){return t},e.d=function(t,i,n){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=256)}([function(t,e){t.exports=function(t,e,i,n){var o,s=t=t||{},a=typeof t.default;"object"!==a&&"function"!==a||(o=t,s=t.default);var r="function"==typeof s?s.options:s;if(e&&(r.render=e.render,r.staticRenderFns=e.staticRenderFns),i&&(r._scopeId=i),n){var l=r.computed||(r.computed={});Object.keys(n).forEach(function(t){var e=n[t];l[t]=function(){return e}})}return{esModule:o,exports:s,options:r}}},function(t,e,i){i(192);var n=i(0)(i(102),i(242),null,null);t.exports=n.exports},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0}),e.KeenUiConfig=void 0;var o=i(129),s=n(o),a=i(130),r=n(a),l=i(164),u=n(l),c={disableRipple:!1,UiAutocomplete:{keys:{label:"label",value:"value",image:"image"}},UiCheckboxGroup:{keys:{id:"id",name:"name",class:"class",label:"label",value:"value",disabled:"disabled"}},UiMenu:{keys:{icon:"icon",type:"type",label:"label",secondaryText:"secondaryText",iconProps:"iconProps",disabled:"disabled"}},UiRadioGroup:{keys:{id:"id",class:"class",label:"label",value:"value",checked:"checked",disabled:"disabled"}},UiSelect:{keys:{label:"label",value:"value",image:"image"}}},d=e.KeenUiConfig=function(){function t(){(0,s.default)(this,t),this.data=(0,u.default)(c,window.KeenUiConfig?window.KeenUiConfig:{})}return(0,r.default)(t,[{key:"set",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.data=(0,u.default)(this.data,t)}}]),t}();e.default=new d},function(t,e,i){i(170);var n=i(0)(i(113),i(220),null,null);t.exports=n.exports},function(t,e){var i=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=i)},function(t,e,i){t.exports=!i(20)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e){var i={}.hasOwnProperty;t.exports=function(t,e){return i.call(t,e)}},function(t,e,i){var n=i(19),o=i(54),s=i(39),a=Object.defineProperty;e.f=i(5)?Object.defineProperty:function(t,e,i){if(n(t),e=s(e,!0),n(i),o)try{return a(t,e,i)}catch(t){}if("get"in i||"set"in i)throw TypeError("Accessors not supported!");return"value"in i&&(t[e]=i.value),t}},function(t,e,i){var n=i(142),o=i(29);t.exports=function(t){return n(o(t))}},function(t,e,i){var n=i(7),o=i(23);t.exports=i(5)?function(t,e,i){return n.f(t,e,o(1,i))}:function(t,e,i){return t[e]=i,t}},function(t,e,i){var n=i(37)("wks"),o=i(24),s=i(4).Symbol,a="function"==typeof s,r=t.exports=function(t){return n[t]||(n[t]=a&&s[t]||(a?s:o)("Symbol."+t))};r.store=n},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function o(t){return"string"==typeof t?t.replace(p,"").split(v):t}function s(t){return c(t)?t.className.replace(p,"").split(v):[]}function a(t,e){c(t)&&(t.className=o(e).join(" "))}function r(t,e){var i=l(t,e),n=o(e);return i.push.apply(i,n),a(t,i),i}function l(t,e){var i=s(t),n=o(e);return n.forEach(function(t){var e=i.indexOf(t);e!==-1&&i.splice(e,1)}),a(t,i),i}function u(t,e){var i=s(t),n=o(e);return n.every(function(t){return i.indexOf(t)!==-1})}function c(t){var e="object"===("undefined"==typeof HTMLElement?"undefined":(0,h.default)(HTMLElement));return e?t instanceof HTMLElement:d(t)}function d(t){return t&&"object"===("undefined"==typeof t?"undefined":(0,h.default)(t))&&"string"==typeof t.nodeName&&1===t.nodeType}Object.defineProperty(e,"__esModule",{value:!0});var f=i(51),h=n(f),p=/^\s+|\s+$/g,v=/\s+/g;e.default={add:r,remove:l,contains:u,has:u,set:a,get:s}},function(t,e,i){"use strict";function n(t,e){for(;t.length<e;)t="0"+t;return t}function o(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:g;return e.days.full[t.getDay()]}function s(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:g;return e.days.initials[t.getDay()]}function a(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:g;return e.days.abbreviated[t.getDay()]}function r(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:g;return e.months.full[t.getMonth()]}function l(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:g;return e.months.abbreviated[t.getMonth()]}function u(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{pad:!0},i=t.getDate().toString();return e.pad?n(i):i}function c(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:g,i=e.days.abbreviated,n=e.months.full;return i[t.getDay()]+", "+n[t.getMonth()]+" "+t.getDate()+", "+t.getFullYear()}function d(t){return new Date(t.getTime())}function f(t,e){for(;t.getDay()!==e;)t.setDate(t.getDate()-1);return t}function h(t,e){return t.getFullYear()===e.getFullYear()&&t.getMonth()===e.getMonth()&&t.getDate()===e.getDate()}function p(t,e){return t.getTime()<e.getTime()}function v(t,e){return t.getTime()>e.getTime()}Object.defineProperty(e,"__esModule",{value:!0}),e.getDayFull=o,e.getDayInitial=s,e.getDayAbbreviated=a,e.getMonthFull=r,e.getMonthAbbreviated=l,e.getDayOfMonth=u,e.humanize=c,e.clone=d,e.moveToDayOfWeek=f,e.isSameDay=h,e.isBefore=p,e.isAfter=v;var g=e.defaultLang={months:{full:["January","February","March","April","May","June","July","August","September","October","November","December"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]},days:{full:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],initials:["S","M","T","W","T","F","S"]}};e.default={defaultLang:g,getDayFull:o,getDayInitial:s,getDayAbbreviated:a,getMonthFull:r,getMonthAbbreviated:l,getDayOfMonth:u,humanize:c,clone:d,moveToDayOfWeek:f,isSameDay:h,isBefore:p,isAfter:v}},function(t,e){var i=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=i)},function(t,e,i){i(202);var n=i(0)(i(89),i(252),null,null);t.exports=n.exports},function(t,e,i){i(204);var n=i(0)(i(107),i(254),null,null);t.exports=n.exports},function(t,e,i){i(174);var n=i(0)(i(109),i(224),null,null);t.exports=n.exports},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function o(t){return null!==t&&"object"===("undefined"==typeof t?"undefined":(0,d.default)(t))}function s(t,e){return t==e||!(!o(t)||!o(e))&&(0,u.default)(t)===(0,u.default)(e)}function a(t,e){for(var i=0;i<t.length;i++)if(s(t[i],e))return i;return-1}function r(t,e){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return t.substr(i,e.length)===e}Object.defineProperty(e,"__esModule",{value:!0});var l=i(18),u=n(l),c=i(51),d=n(c);e.isObject=o,e.looseEqual=s,e.looseIndexOf=a,e.startsWith=r},function(t,e,i){t.exports={default:i(132),__esModule:!0}},function(t,e,i){var n=i(21);t.exports=function(t){if(!n(t))throw TypeError(t+" is not an object!");return t}},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e,i){var n=i(59),o=i(30);t.exports=Object.keys||function(t){return n(t,o)}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e){var i=0,n=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++i+n).toString(36))}},function(t,e,i){i(198);var n=i(0)(i(103),i(248),null,null);t.exports=n.exports},function(t,e,i){i(185);var n=i(0)(i(106),i(235),null,null);t.exports=n.exports},function(t,e,i){i(200);var n=i(0)(i(125),i(250),null,null);t.exports=n.exports},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(206),s=n(o);e.default={data:function(){return{windowResizeListener:null}},mounted:function(){var t=this;this.windowResizeListener=(0,s.default)(function(){t.$emit("window-resize")},200),window.addEventListener("resize",this.windowResizeListener)},beforeDestroy:function(){window.removeEventListener("resize",this.windowResizeListener)}}},function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e,i){var n=i(4),o=i(13),s=i(139),a=i(9),r="prototype",l=function(t,e,i){var u,c,d,f=t&l.F,h=t&l.G,p=t&l.S,v=t&l.P,g=t&l.B,m=t&l.W,b=h?o:o[e]||(o[e]={}),_=b[r],y=h?n:p?n[e]:(n[e]||{})[r];h&&(i=e);for(u in i)c=!f&&y&&void 0!==y[u],c&&u in b||(d=c?y[u]:i[u],b[u]=h&&"function"!=typeof y[u]?i[u]:g&&c?s(d,n):m&&y[u]==d?function(t){var e=function(e,i,n){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,i)}return new t(e,i,n)}return t.apply(this,arguments)};return e[r]=t[r],e}(d):v&&"function"==typeof d?s(Function.call,d):d,v&&((b.virtual||(b.virtual={}))[u]=d,t&l.R&&_&&!_[u]&&a(_,u,d)))};l.F=1,l.G=2,l.S=4,l.P=8,l.B=16,l.W=32,l.U=64,l.R=128,t.exports=l},function(t,e){t.exports={}},function(t,e){t.exports=!0},function(t,e){e.f={}.propertyIsEnumerable},function(t,e,i){var n=i(7).f,o=i(6),s=i(10)("toStringTag");t.exports=function(t,e,i){t&&!o(t=i?t:t.prototype,s)&&n(t,s,{configurable:!0,value:e})}},function(t,e,i){var n=i(37)("keys"),o=i(24);t.exports=function(t){return n[t]||(n[t]=o(t))}},function(t,e,i){var n=i(4),o="__core-js_shared__",s=n[o]||(n[o]={});t.exports=function(t){return s[t]||(s[t]={})}},function(t,e){var i=Math.ceil,n=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?n:i)(t)}},function(t,e,i){var n=i(21);t.exports=function(t,e){if(!n(t))return t;var i,o;if(e&&"function"==typeof(i=t.toString)&&!n(o=i.call(t)))return o;if("function"==typeof(i=t.valueOf)&&!n(o=i.call(t)))return o;if(!e&&"function"==typeof(i=t.toString)&&!n(o=i.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},function(t,e,i){var n=i(4),o=i(13),s=i(33),a=i(41),r=i(7).f;t.exports=function(t){var e=o.Symbol||(o.Symbol=s?{}:n.Symbol||{});"_"==t.charAt(0)||t in e||r(e,t,{value:a.f(t)})}},function(t,e,i){e.f=i(10)},function(t,e,i){i(171);var n=i(0)(i(90),i(221),null,null);t.exports=n.exports},function(t,e,i){i(193);var n=i(0)(i(94),i(243),null,null);t.exports=n.exports},function(t,e,i){i(179);var n=i(0)(i(110),i(229),null,null);t.exports=n.exports},function(t,e,i){i(172);var n=i(0)(i(111),i(222),null,null);t.exports=n.exports},function(t,e,i){i(183);var n=i(0)(i(117),i(233),null,null);t.exports=n.exports},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={inserted:function(t,e){var i=e.value;i&&t.focus()}}},function(t,e,i){"use strict";function n(t,e){if(t){e=e||t.parentElement;var i=t.offsetTop,n=e.scrollTop,o=i+t.offsetHeight,s=e.offsetHeight;return i>=n&&o<=s}}function o(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{container:null,marginTop:0};t&&(e.container=e.container||t.parentElement,n(t,e.container)||(e.container.scrollTop=t.offsetTop-e.marginTop))}function s(t){t&&(t.scrollTop=0)}Object.defineProperty(e,"__esModule",{value:!0}),e.inView=n,e.scrollIntoView=o,e.resetScroll=s,e.default={inView:n,scrollIntoView:o,resetScroll:s}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});for(var n=[],o=0;o<256;o++)n[o]=(o<16?"0":"")+o.toString(16);var s=function(){var t=4294967295*Math.random()|0,e=4294967295*Math.random()|0,i=4294967295*Math.random()|0,o=4294967295*Math.random()|0;return n[255&t]+n[t>>8&255]+n[t>>16&255]+n[t>>24&255]+"-"+n[255&e]+n[e>>8&255]+"-"+n[e>>16&15|64]+n[e>>24&255]+"-"+n[63&i|128]+n[i>>8&255]+"-"+n[i>>16&255]+n[i>>24&255]+n[255&o]+n[o>>8&255]+n[o>>16&255]+n[o>>24&255]},a=function(t){t=t||"";var e=s();return t+e.split("-")[0]};e.default={generate:s,short:a}},function(t,e,i){t.exports={default:i(133),__esModule:!0}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var o=i(128),s=n(o),a=i(127),r=n(a),l="function"==typeof r.default&&"symbol"==typeof s.default?function(t){return typeof t}:function(t){return t&&"function"==typeof r.default&&t.constructor===r.default&&t!==r.default.prototype?"symbol":typeof t};e.default="function"==typeof r.default&&"symbol"===l(s.default)?function(t){return"undefined"==typeof t?"undefined":l(t)}:function(t){return t&&"function"==typeof r.default&&t.constructor===r.default&&t!==r.default.prototype?"symbol":"undefined"==typeof t?"undefined":l(t)}},function(t,e){var i={}.toString;t.exports=function(t){return i.call(t).slice(8,-1)}},function(t,e,i){var n=i(21),o=i(4).document,s=n(o)&&n(o.createElement);t.exports=function(t){return s?o.createElement(t):{}}},function(t,e,i){t.exports=!i(5)&&!i(20)(function(){return 7!=Object.defineProperty(i(53)("div"),"a",{get:function(){return 7}}).a})},function(t,e,i){"use strict";var n=i(33),o=i(31),s=i(60),a=i(9),r=i(6),l=i(32),u=i(144),c=i(35),d=i(151),f=i(10)("iterator"),h=!([].keys&&"next"in[].keys()),p="@@iterator",v="keys",g="values",m=function(){return this};t.exports=function(t,e,i,b,_,y,w){u(i,e,b);var x,k,C,S=function(t){if(!h&&t in E)return E[t];switch(t){case v:return function(){return new i(this,t)};case g:return function(){return new i(this,t)}}return function(){return new i(this,t)}},O=e+" Iterator",D=_==g,T=!1,E=t.prototype,$=E[f]||E[p]||_&&E[_],P=$||S(_),M=_?D?S("entries"):P:void 0,B="Array"==e?E.entries||$:$;if(B&&(C=d(B.call(new t)),C!==Object.prototype&&(c(C,O,!0),n||r(C,f)||a(C,f,m))),D&&$&&$.name!==g&&(T=!0,P=function(){return $.call(this)}),n&&!w||!h&&!T&&E[f]||a(E,f,P),l[e]=P,l[O]=m,_)if(x={values:D?P:S(g),keys:y?P:S(v),entries:M},w)for(k in x)k in E||s(E,k,x[k]);else o(o.P+o.F*(h||T),e,x);return x}},function(t,e,i){var n=i(19),o=i(148),s=i(30),a=i(36)("IE_PROTO"),r=function(){},l="prototype",u=function(){var t,e=i(53)("iframe"),n=s.length,o="<",a=">";for(e.style.display="none",i(141).appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write(o+"script"+a+"document.F=Object"+o+"/script"+a),t.close(),u=t.F;n--;)delete u[l][s[n]];return u()};t.exports=Object.create||function(t,e){var i;return null!==t?(r[l]=n(t),i=new r,r[l]=null,i[a]=t):i=u(),void 0===e?i:o(i,e)}},function(t,e,i){var n=i(59),o=i(30).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return n(t,o)}},function(t,e){e.f=Object.getOwnPropertySymbols},function(t,e,i){var n=i(6),o=i(8),s=i(138)(!1),a=i(36)("IE_PROTO");t.exports=function(t,e){var i,r=o(t),l=0,u=[];for(i in r)i!=a&&n(r,i)&&u.push(i);for(;e.length>l;)n(r,i=e[l++])&&(~s(u,i)||u.push(i));return u}},function(t,e,i){t.exports=i(9)},function(t,e,i){"use strict";function n(t,e){var i=e.length,n=t.length;if(n>i)return!1;if(n===i)return t===e;t:for(var o=0,s=0;o<n;o++){for(var a=t.charCodeAt(o);s<i;)if(e.charCodeAt(s++)===a)continue t;return!1}return!0}t.exports=n},function(t,e,i){var n,o,s;/*! tether-drop 1.4.1 */
!function(a,r){o=[i(63)],n=r,s="function"==typeof n?n.apply(e,o):n,!(void 0!==s&&(t.exports=s))}(this,function(t){"use strict";function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function n(t){var e=t.split(" "),i=r(e,2),n=i[0],o=i[1];if(["left","right"].indexOf(n)>=0){var s=[o,n];n=s[0],o=s[1]}return[n,o].join(" ")}function o(t,e){for(var i=void 0,n=[];(i=t.indexOf(e))!==-1;)n.push(t.splice(i,1));return n}function s(){var r=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],c=function(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];return new(a.apply(_,[null].concat(e)))};d(c,{createContext:s,drops:[],defaults:{}});var m={classPrefix:"drop",defaults:{position:"bottom left",openOn:"click",beforeClose:null,constrainToScrollParent:!0,constrainToWindow:!0,classes:"",remove:!1,openDelay:0,closeDelay:50,focusDelay:null,blurDelay:null,hoverOpenDelay:null,hoverCloseDelay:null,tetherOptions:{}}};d(c,m,r),d(c.defaults,m.defaults,r.defaults),"undefined"==typeof x[c.classPrefix]&&(x[c.classPrefix]=[]),c.updateBodyClasses=function(){for(var t=!1,e=x[c.classPrefix],i=e.length,n=0;n<i;++n)if(e[n].isOpened()){t=!0;break}t?f(document.body,c.classPrefix+"-open"):h(document.body,c.classPrefix+"-open")};var _=function(s){function a(t){if(e(this,a),u(Object.getPrototypeOf(a.prototype),"constructor",this).call(this),this.options=d({},c.defaults,t),this.target=this.options.target,"undefined"==typeof this.target)throw new Error("Drop Error: You must provide a target.");var i="data-"+c.classPrefix,n=this.target.getAttribute(i);n&&null==this.options.content&&(this.options.content=n);for(var o=["position","openOn"],s=0;s<o.length;++s){var r=this.target.getAttribute(i+"-"+o[s]);r&&null==this.options[o[s]]&&(this.options[o[s]]=r)}this.options.classes&&this.options.addTargetClasses!==!1&&f(this.target,this.options.classes),c.drops.push(this),x[c.classPrefix].push(this),this._boundEvents=[],this.bindMethods(),this.setupElements(),this.setupEvents(),this.setupTether()}return i(a,s),l(a,[{key:"_on",value:function(t,e,i){this._boundEvents.push({element:t,event:e,handler:i}),t.addEventListener(e,i)}},{key:"bindMethods",value:function(){this.transitionEndHandler=this._transitionEndHandler.bind(this)}},{key:"setupElements",value:function(){var t=this;if(this.drop=document.createElement("div"),f(this.drop,c.classPrefix),this.options.classes&&f(this.drop,this.options.classes),this.content=document.createElement("div"),f(this.content,c.classPrefix+"-content"),"function"==typeof this.options.content){var e=function(){var e=t.options.content.call(t,t);if("string"==typeof e)t.content.innerHTML=e;else{if("object"!=typeof e)throw new Error("Drop Error: Content function should return a string or HTMLElement.");t.content.innerHTML="",t.content.appendChild(e)}};e(),this.on("open",e.bind(this))}else"object"==typeof this.options.content?this.content.appendChild(this.options.content):this.content.innerHTML=this.options.content;this.drop.appendChild(this.content)}},{key:"setupTether",value:function(){var e=this.options.position.split(" ");e[0]=w[e[0]],e=e.join(" ");var i=[];this.options.constrainToScrollParent?i.push({to:"scrollParent",pin:"top, bottom",attachment:"together none"}):i.push({to:"scrollParent"}),this.options.constrainToWindow!==!1?i.push({to:"window",attachment:"together"}):i.push({to:"window"});var o={element:this.drop,target:this.target,attachment:n(e),targetAttachment:n(this.options.position),classPrefix:c.classPrefix,offset:"0 0",targetOffset:"0 0",enabled:!1,constraints:i,addTargetClasses:this.options.addTargetClasses};this.options.tetherOptions!==!1&&(this.tether=new t(d({},o,this.options.tetherOptions)))}},{key:"setupEvents",value:function(){var t=this;if(this.options.openOn){if("always"===this.options.openOn)return void setTimeout(this.open.bind(this));var e=this.options.openOn.split(" ");if(e.indexOf("click")>=0)for(var i=function(e){t.toggle(e),e.preventDefault()},n=function(e){t.isOpened()&&(e.target===t.drop||t.drop.contains(e.target)||e.target===t.target||t.target.contains(e.target)||t.close(e))},o=0;o<g.length;++o){var s=g[o];this._on(this.target,s,i),this._on(document,s,n)}var a=null,r=null,l=function(e){null!==r?clearTimeout(r):a=setTimeout(function(){t.open(e),a=null},("focus"===e.type?t.options.focusDelay:t.options.hoverOpenDelay)||t.options.openDelay)},u=function(e){null!==a?clearTimeout(a):r=setTimeout(function(){t.close(e),r=null},("blur"===e.type?t.options.blurDelay:t.options.hoverCloseDelay)||t.options.closeDelay)};e.indexOf("hover")>=0&&(this._on(this.target,"mouseover",l),this._on(this.drop,"mouseover",l),this._on(this.target,"mouseout",u),this._on(this.drop,"mouseout",u)),e.indexOf("focus")>=0&&(this._on(this.target,"focus",l),this._on(this.drop,"focus",l),this._on(this.target,"blur",u),this._on(this.drop,"blur",u))}}},{key:"isOpened",value:function(){if(this.drop)return p(this.drop,c.classPrefix+"-open")}},{key:"toggle",value:function(t){this.isOpened()?this.close(t):this.open(t)}},{key:"open",value:function(t){var e=this;this.isOpened()||(this.drop.parentNode||document.body.appendChild(this.drop),"undefined"!=typeof this.tether&&this.tether.enable(),f(this.drop,c.classPrefix+"-open"),f(this.drop,c.classPrefix+"-open-transitionend"),setTimeout(function(){e.drop&&f(e.drop,c.classPrefix+"-after-open")}),"undefined"!=typeof this.tether&&this.tether.position(),this.trigger("open"),c.updateBodyClasses())}},{key:"_transitionEndHandler",value:function(t){t.target===t.currentTarget&&(p(this.drop,c.classPrefix+"-open")||h(this.drop,c.classPrefix+"-open-transitionend"),this.drop.removeEventListener(b,this.transitionEndHandler))}},{key:"beforeCloseHandler",value:function(t){var e=!0;return this.isClosing||"function"!=typeof this.options.beforeClose||(this.isClosing=!0,e=this.options.beforeClose(t,this)!==!1),this.isClosing=!1,e}},{key:"close",value:function(t){this.isOpened()&&this.beforeCloseHandler(t)&&(h(this.drop,c.classPrefix+"-open"),h(this.drop,c.classPrefix+"-after-open"),this.drop.addEventListener(b,this.transitionEndHandler),this.trigger("close"),"undefined"!=typeof this.tether&&this.tether.disable(),c.updateBodyClasses(),this.options.remove&&this.remove(t))}},{key:"remove",value:function(t){this.close(t),this.drop.parentNode&&this.drop.parentNode.removeChild(this.drop)}},{key:"position",value:function(){this.isOpened()&&"undefined"!=typeof this.tether&&this.tether.position()}},{key:"destroy",value:function(){this.remove(),"undefined"!=typeof this.tether&&this.tether.destroy();for(var t=0;t<this._boundEvents.length;++t){var e=this._boundEvents[t],i=e.element,n=e.event,s=e.handler;i.removeEventListener(n,s)}this._boundEvents=[],this.tether=null,this.drop=null,this.content=null,this.target=null,o(x[c.classPrefix],this),o(c.drops,this)}}]),a}(v);return c}var a=Function.prototype.bind,r=function(){function t(t,e){var i=[],n=!0,o=!1,s=void 0;try{for(var a,r=t[Symbol.iterator]();!(n=(a=r.next()).done)&&(i.push(a.value),!e||i.length!==e);n=!0);}catch(t){o=!0,s=t}finally{try{!n&&r.return&&r.return()}finally{if(o)throw s}}return i}return function(e,i){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,i);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),l=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),u=function(t,e,i){for(var n=!0;n;){var o=t,s=e,a=i;n=!1,null===o&&(o=Function.prototype);var r=Object.getOwnPropertyDescriptor(o,s);if(void 0!==r){if("value"in r)return r.value;var l=r.get;if(void 0===l)return;return l.call(a)}var u=Object.getPrototypeOf(o);if(null===u)return;t=u,e=s,i=a,n=!0,r=u=void 0}},c=t.Utils,d=c.extend,f=c.addClass,h=c.removeClass,p=c.hasClass,v=c.Evented,g=["click"];"ontouchstart"in document.documentElement&&g.push("touchstart");var m={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"},b="";for(var _ in m)if({}.hasOwnProperty.call(m,_)){var y=document.createElement("p");"undefined"!=typeof y.style[_]&&(b=m[_])}var w={left:"right",right:"left",top:"bottom",bottom:"top",middle:"middle",center:"center"},x={},k=s();return document.addEventListener("DOMContentLoaded",function(){k.updateBodyClasses()}),k})},function(t,e,i){var n,o;/*! tether 1.4.0 */
!function(s,a){n=a,o="function"==typeof n?n.call(e,i,e,t):n,!(void 0!==o&&(t.exports=o))}(this,function(t,e,i){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t){var e=t.getBoundingClientRect(),i={};for(var n in e)i[n]=e[n];if(t.ownerDocument!==document){var s=t.ownerDocument.defaultView.frameElement;if(s){var a=o(s);i.top+=a.top,i.bottom+=a.top,i.left+=a.left,i.right+=a.left}}return i}function s(t){var e=getComputedStyle(t)||{},i=e.position,n=[];if("fixed"===i)return[t];for(var o=t;(o=o.parentNode)&&o&&1===o.nodeType;){var s=void 0;try{s=getComputedStyle(o)}catch(t){}if("undefined"==typeof s||null===s)return n.push(o),n;var a=s,r=a.overflow,l=a.overflowX,u=a.overflowY;/(auto|scroll)/.test(r+u+l)&&("absolute"!==i||["relative","absolute","fixed"].indexOf(s.position)>=0)&&n.push(o)}return n.push(t.ownerDocument.body),t.ownerDocument!==document&&n.push(t.ownerDocument.defaultView),n}function a(){S&&document.body.removeChild(S),S=null}function r(t){var e=void 0;t===document?(e=document,t=document.documentElement):e=t.ownerDocument;var i=e.documentElement,n=o(t),s=T();return n.top-=s.top,n.left-=s.left,"undefined"==typeof n.width&&(n.width=document.body.scrollWidth-n.left-n.right),"undefined"==typeof n.height&&(n.height=document.body.scrollHeight-n.top-n.bottom),n.top=n.top-i.clientTop,n.left=n.left-i.clientLeft,n.right=e.body.clientWidth-n.width-n.left,n.bottom=e.body.clientHeight-n.height-n.top,n}function l(t){return t.offsetParent||document.documentElement}function u(){if(E)return E;var t=document.createElement("div");t.style.width="100%",t.style.height="200px";var e=document.createElement("div");c(e.style,{position:"absolute",top:0,left:0,pointerEvents:"none",visibility:"hidden",width:"200px",height:"150px",overflow:"hidden"}),e.appendChild(t),document.body.appendChild(e);var i=t.offsetWidth;e.style.overflow="scroll";var n=t.offsetWidth;i===n&&(n=e.clientWidth),document.body.removeChild(e);var o=i-n;return E={width:o,height:o}}function c(){var t=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],e=[];return Array.prototype.push.apply(e,arguments),e.slice(1).forEach(function(e){if(e)for(var i in e)({}).hasOwnProperty.call(e,i)&&(t[i]=e[i])}),t}function d(t,e){if("undefined"!=typeof t.classList)e.split(" ").forEach(function(e){e.trim()&&t.classList.remove(e)});else{var i=new RegExp("(^| )"+e.split(" ").join("|")+"( |$)","gi"),n=p(t).replace(i," ");v(t,n)}}function f(t,e){if("undefined"!=typeof t.classList)e.split(" ").forEach(function(e){e.trim()&&t.classList.add(e)});else{d(t,e);var i=p(t)+(" "+e);v(t,i)}}function h(t,e){if("undefined"!=typeof t.classList)return t.classList.contains(e);var i=p(t);return new RegExp("(^| )"+e+"( |$)","gi").test(i)}function p(t){return t.className instanceof t.ownerDocument.defaultView.SVGAnimatedString?t.className.baseVal:t.className}function v(t,e){t.setAttribute("class",e)}function g(t,e,i){i.forEach(function(i){e.indexOf(i)===-1&&h(t,i)&&d(t,i)}),e.forEach(function(e){h(t,e)||f(t,e)})}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function m(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function b(t,e){var i=arguments.length<=2||void 0===arguments[2]?1:arguments[2];return t+i>=e&&e>=t-i}function _(){return"undefined"!=typeof performance&&"undefined"!=typeof performance.now?performance.now():+new Date}function y(){for(var t={top:0,left:0},e=arguments.length,i=Array(e),n=0;n<e;n++)i[n]=arguments[n];return i.forEach(function(e){var i=e.top,n=e.left;"string"==typeof i&&(i=parseFloat(i,10)),"string"==typeof n&&(n=parseFloat(n,10)),t.top+=i,t.left+=n}),t}function w(t,e){return"string"==typeof t.left&&t.left.indexOf("%")!==-1&&(t.left=parseFloat(t.left,10)/100*e.width),"string"==typeof t.top&&t.top.indexOf("%")!==-1&&(t.top=parseFloat(t.top,10)/100*e.height),t}function x(t,e){return"scrollParent"===e?e=t.scrollParents[0]:"window"===e&&(e=[pageXOffset,pageYOffset,innerWidth+pageXOffset,innerHeight+pageYOffset]),e===document&&(e=e.documentElement),"undefined"!=typeof e.nodeType&&!function(){var t=e,i=r(e),n=i,o=getComputedStyle(e);if(e=[n.left,n.top,i.width+n.left,i.height+n.top],t.ownerDocument!==document){var s=t.ownerDocument.defaultView;e[0]+=s.pageXOffset,e[1]+=s.pageYOffset,e[2]+=s.pageXOffset,e[3]+=s.pageYOffset}K.forEach(function(t,i){t=t[0].toUpperCase()+t.substr(1),"Top"===t||"Left"===t?e[i]+=parseFloat(o["border"+t+"Width"]):e[i]-=parseFloat(o["border"+t+"Width"])})}(),e}var k=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),C=void 0;"undefined"==typeof C&&(C={modules:[]});var S=null,O=function(){var t=0;return function(){return++t}}(),D={},T=function(){var t=S;t&&document.body.contains(t)||(t=document.createElement("div"),t.setAttribute("data-tether-id",O()),c(t.style,{top:0,left:0,position:"absolute"}),document.body.appendChild(t),S=t);var e=t.getAttribute("data-tether-id");return"undefined"==typeof D[e]&&(D[e]=o(t),P(function(){delete D[e]})),D[e]},E=null,$=[],P=function(t){$.push(t)},M=function(){for(var t=void 0;t=$.pop();)t()},B=function(){function t(){n(this,t)}return k(t,[{key:"on",value:function(t,e,i){var n=!(arguments.length<=3||void 0===arguments[3])&&arguments[3];"undefined"==typeof this.bindings&&(this.bindings={}),"undefined"==typeof this.bindings[t]&&(this.bindings[t]=[]),this.bindings[t].push({handler:e,ctx:i,once:n})}},{key:"once",value:function(t,e,i){this.on(t,e,i,!0)}},{key:"off",value:function(t,e){if("undefined"!=typeof this.bindings&&"undefined"!=typeof this.bindings[t])if("undefined"==typeof e)delete this.bindings[t];else for(var i=0;i<this.bindings[t].length;)this.bindings[t][i].handler===e?this.bindings[t].splice(i,1):++i}},{key:"trigger",value:function(t){if("undefined"!=typeof this.bindings&&this.bindings[t]){for(var e=0,i=arguments.length,n=Array(i>1?i-1:0),o=1;o<i;o++)n[o-1]=arguments[o];for(;e<this.bindings[t].length;){var s=this.bindings[t][e],a=s.handler,r=s.ctx,l=s.once,u=r;"undefined"==typeof u&&(u=this),a.apply(u,n),l?this.bindings[t].splice(e,1):++e}}}}]),t}();C.Utils={getActualBoundingClientRect:o,getScrollParents:s,getBounds:r,getOffsetParent:l,extend:c,addClass:f,removeClass:d,hasClass:h,updateClasses:g,defer:P,flush:M,uniqueId:O,Evented:B,getScrollBarSize:u,removeUtilElements:a};var F=function(){function t(t,e){var i=[],n=!0,o=!1,s=void 0;try{for(var a,r=t[Symbol.iterator]();!(n=(a=r.next()).done)&&(i.push(a.value),!e||i.length!==e);n=!0);}catch(t){o=!0,s=t}finally{try{!n&&r.return&&r.return()}finally{if(o)throw s}}return i}return function(e,i){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,i);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),k=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),I=function(t,e,i){for(var n=!0;n;){var o=t,s=e,a=i;n=!1,null===o&&(o=Function.prototype);var r=Object.getOwnPropertyDescriptor(o,s);if(void 0!==r){if("value"in r)return r.value;var l=r.get;if(void 0===l)return;return l.call(a)}var u=Object.getPrototypeOf(o);if(null===u)return;t=u,e=s,i=a,n=!0,r=u=void 0}};if("undefined"==typeof C)throw new Error("You must include the utils.js file before tether.js");var A=C.Utils,s=A.getScrollParents,r=A.getBounds,l=A.getOffsetParent,c=A.extend,f=A.addClass,d=A.removeClass,g=A.updateClasses,P=A.defer,M=A.flush,u=A.getScrollBarSize,a=A.removeUtilElements,L=function(){if("undefined"==typeof document)return"";for(var t=document.createElement("div"),e=["transform","WebkitTransform","OTransform","MozTransform","msTransform"],i=0;i<e.length;++i){var n=e[i];if(void 0!==t.style[n])return n}}(),U=[],j=function(){U.forEach(function(t){t.position(!1)}),M()};!function(){var t=null,e=null,i=null,n=function n(){return"undefined"!=typeof e&&e>16?(e=Math.min(e-16,250),void(i=setTimeout(n,250))):void("undefined"!=typeof t&&_()-t<10||(null!=i&&(clearTimeout(i),i=null),t=_(),j(),e=_()-t))};"undefined"!=typeof window&&"undefined"!=typeof window.addEventListener&&["resize","scroll","touchmove"].forEach(function(t){window.addEventListener(t,n)})}();var R={center:"center",left:"right",right:"left"},V={middle:"middle",top:"bottom",bottom:"top"},z={top:0,left:0,middle:"50%",center:"50%",bottom:"100%",right:"100%"},N=function(t,e){var i=t.left,n=t.top;return"auto"===i&&(i=R[e.left]),"auto"===n&&(n=V[e.top]),{left:i,top:n}},H=function(t){var e=t.left,i=t.top;return"undefined"!=typeof z[t.left]&&(e=z[t.left]),"undefined"!=typeof z[t.top]&&(i=z[t.top]),{left:e,top:i}},W=function(t){var e=t.split(" "),i=F(e,2),n=i[0],o=i[1];return{top:n,left:o}},q=W,Y=function(t){function e(t){var i=this;n(this,e),I(Object.getPrototypeOf(e.prototype),"constructor",this).call(this),this.position=this.position.bind(this),U.push(this),this.history=[],this.setOptions(t,!1),C.modules.forEach(function(t){"undefined"!=typeof t.initialize&&t.initialize.call(i)}),this.position()}return m(e,t),k(e,[{key:"getClass",value:function(){var t=arguments.length<=0||void 0===arguments[0]?"":arguments[0],e=this.options.classes;return"undefined"!=typeof e&&e[t]?this.options.classes[t]:this.options.classPrefix?this.options.classPrefix+"-"+t:t}},{key:"setOptions",value:function(t){var e=this,i=arguments.length<=1||void 0===arguments[1]||arguments[1],n={offset:"0 0",targetOffset:"0 0",targetAttachment:"auto auto",classPrefix:"tether"};this.options=c(n,t);var o=this.options,a=o.element,r=o.target,l=o.targetModifier;if(this.element=a,this.target=r,this.targetModifier=l,"viewport"===this.target?(this.target=document.body,this.targetModifier="visible"):"scroll-handle"===this.target&&(this.target=document.body,this.targetModifier="scroll-handle"),["element","target"].forEach(function(t){if("undefined"==typeof e[t])throw new Error("Tether Error: Both element and target must be defined");"undefined"!=typeof e[t].jquery?e[t]=e[t][0]:"string"==typeof e[t]&&(e[t]=document.querySelector(e[t]))}),f(this.element,this.getClass("element")),this.options.addTargetClasses!==!1&&f(this.target,this.getClass("target")),!this.options.attachment)throw new Error("Tether Error: You must provide an attachment");this.targetAttachment=q(this.options.targetAttachment),this.attachment=q(this.options.attachment),this.offset=W(this.options.offset),this.targetOffset=W(this.options.targetOffset),"undefined"!=typeof this.scrollParents&&this.disable(),"scroll-handle"===this.targetModifier?this.scrollParents=[this.target]:this.scrollParents=s(this.target),this.options.enabled!==!1&&this.enable(i)}},{key:"getTargetBounds",value:function(){if("undefined"==typeof this.targetModifier)return r(this.target);if("visible"===this.targetModifier){if(this.target===document.body)return{top:pageYOffset,left:pageXOffset,height:innerHeight,width:innerWidth};var t=r(this.target),e={height:t.height,width:t.width,top:t.top,left:t.left};return e.height=Math.min(e.height,t.height-(pageYOffset-t.top)),e.height=Math.min(e.height,t.height-(t.top+t.height-(pageYOffset+innerHeight))),e.height=Math.min(innerHeight,e.height),e.height-=2,e.width=Math.min(e.width,t.width-(pageXOffset-t.left)),e.width=Math.min(e.width,t.width-(t.left+t.width-(pageXOffset+innerWidth))),e.width=Math.min(innerWidth,e.width),e.width-=2,e.top<pageYOffset&&(e.top=pageYOffset),e.left<pageXOffset&&(e.left=pageXOffset),e}if("scroll-handle"===this.targetModifier){var t=void 0,i=this.target;i===document.body?(i=document.documentElement,t={left:pageXOffset,top:pageYOffset,height:innerHeight,width:innerWidth}):t=r(i);var n=getComputedStyle(i),o=i.scrollWidth>i.clientWidth||[n.overflow,n.overflowX].indexOf("scroll")>=0||this.target!==document.body,s=0;o&&(s=15);var a=t.height-parseFloat(n.borderTopWidth)-parseFloat(n.borderBottomWidth)-s,e={width:15,height:.975*a*(a/i.scrollHeight),left:t.left+t.width-parseFloat(n.borderLeftWidth)-15},l=0;a<408&&this.target===document.body&&(l=-11e-5*Math.pow(a,2)-.00727*a+22.58),this.target!==document.body&&(e.height=Math.max(e.height,24));var u=this.target.scrollTop/(i.scrollHeight-a);return e.top=u*(a-e.height-l)+t.top+parseFloat(n.borderTopWidth),this.target===document.body&&(e.height=Math.max(e.height,24)),e}}},{key:"clearCache",value:function(){this._cache={}}},{key:"cache",value:function(t,e){return"undefined"==typeof this._cache&&(this._cache={}),"undefined"==typeof this._cache[t]&&(this._cache[t]=e.call(this)),this._cache[t]}},{key:"enable",value:function(){var t=this,e=arguments.length<=0||void 0===arguments[0]||arguments[0];this.options.addTargetClasses!==!1&&f(this.target,this.getClass("enabled")),f(this.element,this.getClass("enabled")),this.enabled=!0,this.scrollParents.forEach(function(e){e!==t.target.ownerDocument&&e.addEventListener("scroll",t.position)}),e&&this.position()}},{key:"disable",value:function(){var t=this;d(this.target,this.getClass("enabled")),d(this.element,this.getClass("enabled")),this.enabled=!1,"undefined"!=typeof this.scrollParents&&this.scrollParents.forEach(function(e){e.removeEventListener("scroll",t.position)})}},{key:"destroy",value:function(){var t=this;this.disable(),U.forEach(function(e,i){e===t&&U.splice(i,1)}),0===U.length&&a()}},{key:"updateAttachClasses",value:function(t,e){var i=this;t=t||this.attachment,e=e||this.targetAttachment;var n=["left","top","bottom","right","middle","center"];"undefined"!=typeof this._addAttachClasses&&this._addAttachClasses.length&&this._addAttachClasses.splice(0,this._addAttachClasses.length),"undefined"==typeof this._addAttachClasses&&(this._addAttachClasses=[]);var o=this._addAttachClasses;t.top&&o.push(this.getClass("element-attached")+"-"+t.top),t.left&&o.push(this.getClass("element-attached")+"-"+t.left),e.top&&o.push(this.getClass("target-attached")+"-"+e.top),e.left&&o.push(this.getClass("target-attached")+"-"+e.left);var s=[];n.forEach(function(t){s.push(i.getClass("element-attached")+"-"+t),s.push(i.getClass("target-attached")+"-"+t)}),P(function(){"undefined"!=typeof i._addAttachClasses&&(g(i.element,i._addAttachClasses,s),i.options.addTargetClasses!==!1&&g(i.target,i._addAttachClasses,s),delete i._addAttachClasses)})}},{key:"position",value:function(){var t=this,e=arguments.length<=0||void 0===arguments[0]||arguments[0];if(this.enabled){this.clearCache();var i=N(this.targetAttachment,this.attachment);this.updateAttachClasses(this.attachment,i);var n=this.cache("element-bounds",function(){return r(t.element)}),o=n.width,s=n.height;if(0===o&&0===s&&"undefined"!=typeof this.lastSize){var a=this.lastSize;o=a.width,s=a.height}else this.lastSize={width:o,height:s};var c=this.cache("target-bounds",function(){return t.getTargetBounds()}),d=c,f=w(H(this.attachment),{width:o,height:s}),h=w(H(i),d),p=w(this.offset,{width:o,height:s}),v=w(this.targetOffset,d);f=y(f,p),h=y(h,v);for(var g=c.left+h.left-f.left,m=c.top+h.top-f.top,b=0;b<C.modules.length;++b){var _=C.modules[b],x=_.position.call(this,{left:g,top:m,targetAttachment:i,targetPos:c,elementPos:n,offset:f,targetOffset:h,manualOffset:p,manualTargetOffset:v,scrollbarSize:D,attachment:this.attachment});if(x===!1)return!1;"undefined"!=typeof x&&"object"==typeof x&&(m=x.top,g=x.left)}var k={page:{top:m,left:g},viewport:{top:m-pageYOffset,bottom:pageYOffset-m-s+innerHeight,left:g-pageXOffset,right:pageXOffset-g-o+innerWidth}},S=this.target.ownerDocument,O=S.defaultView,D=void 0;return O.innerHeight>S.documentElement.clientHeight&&(D=this.cache("scrollbar-size",u),k.viewport.bottom-=D.height),O.innerWidth>S.documentElement.clientWidth&&(D=this.cache("scrollbar-size",u),k.viewport.right-=D.width),["","static"].indexOf(S.body.style.position)!==-1&&["","static"].indexOf(S.body.parentElement.style.position)!==-1||(k.page.bottom=S.body.scrollHeight-m-s,k.page.right=S.body.scrollWidth-g-o),"undefined"!=typeof this.options.optimizations&&this.options.optimizations.moveElement!==!1&&"undefined"==typeof this.targetModifier&&!function(){var e=t.cache("target-offsetparent",function(){return l(t.target)}),i=t.cache("target-offsetparent-bounds",function(){return r(e)}),n=getComputedStyle(e),o=i,s={};if(["Top","Left","Bottom","Right"].forEach(function(t){s[t.toLowerCase()]=parseFloat(n["border"+t+"Width"])}),i.right=S.body.scrollWidth-i.left-o.width+s.right,i.bottom=S.body.scrollHeight-i.top-o.height+s.bottom,k.page.top>=i.top+s.top&&k.page.bottom>=i.bottom&&k.page.left>=i.left+s.left&&k.page.right>=i.right){var a=e.scrollTop,u=e.scrollLeft;k.offset={top:k.page.top-i.top+a-s.top,left:k.page.left-i.left+u-s.left}}}(),this.move(k),this.history.unshift(k),this.history.length>3&&this.history.pop(),e&&M(),!0}}},{key:"move",value:function(t){var e=this;if("undefined"!=typeof this.element.parentNode){var i={};for(var n in t){i[n]={};for(var o in t[n]){for(var s=!1,a=0;a<this.history.length;++a){var r=this.history[a];if("undefined"!=typeof r[n]&&!b(r[n][o],t[n][o])){s=!0;break}}s||(i[n][o]=!0)}}var u={top:"",left:"",right:"",bottom:""},d=function(t,i){var n="undefined"!=typeof e.options.optimizations,o=n?e.options.optimizations.gpu:null;if(o!==!1){var s=void 0,a=void 0;if(t.top?(u.top=0,s=i.top):(u.bottom=0,s=-i.bottom),t.left?(u.left=0,a=i.left):(u.right=0,a=-i.right),window.matchMedia){var r=window.matchMedia("only screen and (min-resolution: 1.3dppx)").matches||window.matchMedia("only screen and (-webkit-min-device-pixel-ratio: 1.3)").matches;r||(a=Math.round(a),s=Math.round(s))}u[L]="translateX("+a+"px) translateY("+s+"px)","msTransform"!==L&&(u[L]+=" translateZ(0)")}else t.top?u.top=i.top+"px":u.bottom=i.bottom+"px",t.left?u.left=i.left+"px":u.right=i.right+"px"},f=!1;if((i.page.top||i.page.bottom)&&(i.page.left||i.page.right)?(u.position="absolute",d(i.page,t.page)):(i.viewport.top||i.viewport.bottom)&&(i.viewport.left||i.viewport.right)?(u.position="fixed",d(i.viewport,t.viewport)):"undefined"!=typeof i.offset&&i.offset.top&&i.offset.left?!function(){u.position="absolute";var n=e.cache("target-offsetparent",function(){return l(e.target)});l(e.element)!==n&&P(function(){e.element.parentNode.removeChild(e.element),n.appendChild(e.element)}),d(i.offset,t.offset),f=!0}():(u.position="absolute",d({top:!0,left:!0},t.page)),!f)if(this.options.bodyElement)this.options.bodyElement.appendChild(this.element);else{for(var h=!0,p=this.element.parentNode;p&&1===p.nodeType&&"BODY"!==p.tagName;){if("static"!==getComputedStyle(p).position){h=!1;break}p=p.parentNode}h||(this.element.parentNode.removeChild(this.element),this.element.ownerDocument.body.appendChild(this.element))}var v={},g=!1;for(var o in u){var m=u[o],_=this.element.style[o];_!==m&&(g=!0,v[o]=m)}g&&P(function(){c(e.element.style,v),e.trigger("repositioned")})}}}]),e}(B);Y.modules=[],C.position=j;var X=c(Y,C),F=function(){function t(t,e){var i=[],n=!0,o=!1,s=void 0;try{for(var a,r=t[Symbol.iterator]();!(n=(a=r.next()).done)&&(i.push(a.value),!e||i.length!==e);n=!0);}catch(t){o=!0,s=t}finally{try{!n&&r.return&&r.return()}finally{if(o)throw s}}return i}return function(e,i){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,i);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),A=C.Utils,r=A.getBounds,c=A.extend,g=A.updateClasses,P=A.defer,K=["left","top","right","bottom"];C.modules.push({position:function(t){var e=this,i=t.top,n=t.left,o=t.targetAttachment;if(!this.options.constraints)return!0;var s=this.cache("element-bounds",function(){return r(e.element)}),a=s.height,l=s.width;if(0===l&&0===a&&"undefined"!=typeof this.lastSize){var u=this.lastSize;l=u.width,a=u.height}var d=this.cache("target-bounds",function(){return e.getTargetBounds()}),f=d.height,h=d.width,p=[this.getClass("pinned"),this.getClass("out-of-bounds")];this.options.constraints.forEach(function(t){var e=t.outOfBoundsClass,i=t.pinnedClass;e&&p.push(e),i&&p.push(i)}),p.forEach(function(t){["left","top","right","bottom"].forEach(function(e){p.push(t+"-"+e)})});var v=[],m=c({},o),b=c({},this.attachment);return this.options.constraints.forEach(function(t){var s=t.to,r=t.attachment,u=t.pin;"undefined"==typeof r&&(r="");var c=void 0,d=void 0;if(r.indexOf(" ")>=0){var p=r.split(" "),g=F(p,2);d=g[0],c=g[1]}else c=d=r;var _=x(e,s);"target"!==d&&"both"!==d||(i<_[1]&&"top"===m.top&&(i+=f,m.top="bottom"),i+a>_[3]&&"bottom"===m.top&&(i-=f,m.top="top")),"together"===d&&("top"===m.top&&("bottom"===b.top&&i<_[1]?(i+=f,m.top="bottom",i+=a,b.top="top"):"top"===b.top&&i+a>_[3]&&i-(a-f)>=_[1]&&(i-=a-f,m.top="bottom",b.top="bottom")),"bottom"===m.top&&("top"===b.top&&i+a>_[3]?(i-=f,m.top="top",i-=a,b.top="bottom"):"bottom"===b.top&&i<_[1]&&i+(2*a-f)<=_[3]&&(i+=a-f,m.top="top",b.top="top")),"middle"===m.top&&(i+a>_[3]&&"top"===b.top?(i-=a,b.top="bottom"):i<_[1]&&"bottom"===b.top&&(i+=a,b.top="top"))),"target"!==c&&"both"!==c||(n<_[0]&&"left"===m.left&&(n+=h,m.left="right"),n+l>_[2]&&"right"===m.left&&(n-=h,m.left="left")),"together"===c&&(n<_[0]&&"left"===m.left?"right"===b.left?(n+=h,m.left="right",n+=l,b.left="left"):"left"===b.left&&(n+=h,m.left="right",n-=l,b.left="right"):n+l>_[2]&&"right"===m.left?"left"===b.left?(n-=h,m.left="left",n-=l,b.left="right"):"right"===b.left&&(n-=h,m.left="left",n+=l,b.left="left"):"center"===m.left&&(n+l>_[2]&&"left"===b.left?(n-=l,b.left="right"):n<_[0]&&"right"===b.left&&(n+=l,b.left="left"))),"element"!==d&&"both"!==d||(i<_[1]&&"bottom"===b.top&&(i+=a,b.top="top"),i+a>_[3]&&"top"===b.top&&(i-=a,b.top="bottom")),"element"!==c&&"both"!==c||(n<_[0]&&("right"===b.left?(n+=l,b.left="left"):"center"===b.left&&(n+=l/2,b.left="left")),n+l>_[2]&&("left"===b.left?(n-=l,b.left="right"):"center"===b.left&&(n-=l/2,b.left="right"))),"string"==typeof u?u=u.split(",").map(function(t){return t.trim()}):u===!0&&(u=["top","left","right","bottom"]),u=u||[];var y=[],w=[];i<_[1]&&(u.indexOf("top")>=0?(i=_[1],y.push("top")):w.push("top")),i+a>_[3]&&(u.indexOf("bottom")>=0?(i=_[3]-a,y.push("bottom")):w.push("bottom")),n<_[0]&&(u.indexOf("left")>=0?(n=_[0],y.push("left")):w.push("left")),n+l>_[2]&&(u.indexOf("right")>=0?(n=_[2]-l,y.push("right")):w.push("right")),y.length&&!function(){var t=void 0;t="undefined"!=typeof e.options.pinnedClass?e.options.pinnedClass:e.getClass("pinned"),v.push(t),y.forEach(function(e){v.push(t+"-"+e)})}(),w.length&&!function(){var t=void 0;t="undefined"!=typeof e.options.outOfBoundsClass?e.options.outOfBoundsClass:e.getClass("out-of-bounds"),v.push(t),w.forEach(function(e){v.push(t+"-"+e)})}(),(y.indexOf("left")>=0||y.indexOf("right")>=0)&&(b.left=m.left=!1),(y.indexOf("top")>=0||y.indexOf("bottom")>=0)&&(b.top=m.top=!1),m.top===o.top&&m.left===o.left&&b.top===e.attachment.top&&b.left===e.attachment.left||(e.updateAttachClasses(b,m),e.trigger("update",{attachment:b,targetAttachment:m}))}),P(function(){e.options.addTargetClasses!==!1&&g(e.target,v,p),g(e.element,v,p)}),{top:i,left:n}}});var A=C.Utils,r=A.getBounds,g=A.updateClasses,P=A.defer;C.modules.push({position:function(t){var e=this,i=t.top,n=t.left,o=this.cache("element-bounds",function(){return r(e.element)}),s=o.height,a=o.width,l=this.getTargetBounds(),u=i+s,c=n+a,d=[];i<=l.bottom&&u>=l.top&&["left","right"].forEach(function(t){var e=l[t];e!==n&&e!==c||d.push(t)}),n<=l.right&&c>=l.left&&["top","bottom"].forEach(function(t){var e=l[t];e!==i&&e!==u||d.push(t)});var f=[],h=[],p=["left","top","right","bottom"];return f.push(this.getClass("abutted")),p.forEach(function(t){f.push(e.getClass("abutted")+"-"+t)}),d.length&&h.push(this.getClass("abutted")),d.forEach(function(t){h.push(e.getClass("abutted")+"-"+t)}),P(function(){e.options.addTargetClasses!==!1&&g(e.target,h,f),g(e.element,h,f)}),!0}});var F=function(){function t(t,e){var i=[],n=!0,o=!1,s=void 0;try{for(var a,r=t[Symbol.iterator]();!(n=(a=r.next()).done)&&(i.push(a.value),!e||i.length!==e);n=!0);}catch(t){o=!0,s=t}finally{try{!n&&r.return&&r.return()}finally{if(o)throw s}}return i}return function(e,i){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,i);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();return C.modules.push({position:function(t){var e=t.top,i=t.left;if(this.options.shift){var n=this.options.shift;"function"==typeof this.options.shift&&(n=this.options.shift.call(this,{top:e,left:i}));var o=void 0,s=void 0;if("string"==typeof n){n=n.split(" "),n[1]=n[1]||n[0];var a=n,r=F(a,2);o=r[0],s=r[1],o=parseFloat(o,10),s=parseFloat(s,10)}else o=n.top,s=n.left;return e+=o,i+=s,{top:e,left:i}}}}),X})},function(t,e,i){i(195);var n=i(0)(i(96),i(245),null,null);t.exports=n.exports},function(t,e,i){"use strict";i(126)},function(t,e,i){i(165);var n=i(0)(i(86),i(215),null,null);t.exports=n.exports},function(t,e,i){i(166);var n=i(0)(i(87),i(216),null,null);t.exports=n.exports},function(t,e,i){i(186);var n=i(0)(i(95),i(236),null,null);t.exports=n.exports},function(t,e,i){i(201);var n=i(0)(i(97),i(251),null,null);t.exports=n.exports},function(t,e,i){i(203);var n=i(0)(i(98),i(253),null,null);t.exports=n.exports},function(t,e,i){i(196);var n=i(0)(i(99),i(246),null,null);t.exports=n.exports},function(t,e,i){i(187);var n=i(0)(i(100),i(237),null,null);t.exports=n.exports},function(t,e,i){i(197);var n=i(0)(i(101),i(247),null,null);t.exports=n.exports},function(t,e,i){i(194);var n=i(0)(i(104),i(244),null,null);t.exports=n.exports},function(t,e,i){i(176);var n=i(0)(i(108),i(226),null,null);t.exports=n.exports},function(t,e,i){i(167);var n=i(0)(i(112),i(217),null,null);t.exports=n.exports},function(t,e,i){i(169);var n=i(0)(i(114),i(219),null,null);t.exports=n.exports},function(t,e,i){i(199);var n=i(0)(i(116),i(249),null,null);t.exports=n.exports},function(t,e,i){i(173);var n=i(0)(i(118),i(223),null,null);t.exports=n.exports},function(t,e,i){i(190);var n=i(0)(i(119),i(240),null,null);t.exports=n.exports},function(t,e,i){i(181);var n=i(0)(i(120),i(231),null,null);t.exports=n.exports},function(t,e,i){i(189);var n=i(0)(i(122),i(239),null,null);t.exports=n.exports},function(t,e,i){i(180);var n=i(0)(i(123),i(230),null,null);t.exports=n.exports},function(t,e,i){i(182);var n=i(0)(i(124),i(232),null,null);t.exports=n.exports},function(t,e,i){var n,o,s;/*!
	Autosize 3.0.20
	license: MIT
	http://www.jacklmoore.com/autosize
*/
!function(i,a){o=[e,t],n=a,s="function"==typeof n?n.apply(e,o):n,!(void 0!==s&&(t.exports=s))}(this,function(t,e){"use strict";function i(t){function e(){var e=window.getComputedStyle(t,null);"vertical"===e.resize?t.style.resize="none":"both"===e.resize&&(t.style.resize="horizontal"),l="content-box"===e.boxSizing?-(parseFloat(e.paddingTop)+parseFloat(e.paddingBottom)):parseFloat(e.borderTopWidth)+parseFloat(e.borderBottomWidth),isNaN(l)&&(l=0),r()}function i(e){var i=t.style.width;t.style.width="0px",t.offsetWidth,t.style.width=i,t.style.overflowY=e}function n(t){for(var e=[];t&&t.parentNode&&t.parentNode instanceof Element;)t.parentNode.scrollTop&&e.push({node:t.parentNode,scrollTop:t.parentNode.scrollTop}),t=t.parentNode;return e}function o(){var e=t.style.height,i=n(t),o=document.documentElement&&document.documentElement.scrollTop;t.style.height="auto";var s=t.scrollHeight+l;return 0===t.scrollHeight?void(t.style.height=e):(t.style.height=s+"px",u=t.clientWidth,i.forEach(function(t){t.node.scrollTop=t.scrollTop}),void(o&&(document.documentElement.scrollTop=o)))}function r(){o();var e=Math.round(parseFloat(t.style.height)),n=window.getComputedStyle(t,null),s=Math.round(parseFloat(n.height));if(s!==e?"visible"!==n.overflowY&&(i("visible"),o(),s=Math.round(parseFloat(window.getComputedStyle(t,null).height))):"hidden"!==n.overflowY&&(i("hidden"),o(),s=Math.round(parseFloat(window.getComputedStyle(t,null).height))),c!==s){c=s;var r=a("autosize:resized");try{t.dispatchEvent(r)}catch(t){}}}if(t&&t.nodeName&&"TEXTAREA"===t.nodeName&&!s.has(t)){var l=null,u=t.clientWidth,c=null,d=function(){t.clientWidth!==u&&r()},f=function(e){window.removeEventListener("resize",d,!1),t.removeEventListener("input",r,!1),t.removeEventListener("keyup",r,!1),t.removeEventListener("autosize:destroy",f,!1),t.removeEventListener("autosize:update",r,!1),Object.keys(e).forEach(function(i){t.style[i]=e[i]}),s.delete(t)}.bind(t,{height:t.style.height,resize:t.style.resize,overflowY:t.style.overflowY,overflowX:t.style.overflowX,wordWrap:t.style.wordWrap});t.addEventListener("autosize:destroy",f,!1),"onpropertychange"in t&&"oninput"in t&&t.addEventListener("keyup",r,!1),window.addEventListener("resize",d,!1),t.addEventListener("input",r,!1),t.addEventListener("autosize:update",r,!1),t.style.overflowX="hidden",t.style.wordWrap="break-word",s.set(t,{destroy:f,update:r}),e()}}function n(t){var e=s.get(t);e&&e.destroy()}function o(t){var e=s.get(t);e&&e.update()}var s="function"==typeof Map?new Map:function(){var t=[],e=[];return{has:function(e){return t.indexOf(e)>-1},get:function(i){return e[t.indexOf(i)]},set:function(i,n){t.indexOf(i)===-1&&(t.push(i),e.push(n))},delete:function(i){var n=t.indexOf(i);n>-1&&(t.splice(n,1),e.splice(n,1))}}}(),a=function(t){return new Event(t,{bubbles:!0})};try{new Event("test")}catch(t){a=function(t){var e=document.createEvent("Event");return e.initEvent(t,!0,!1),e}}var r=null;"undefined"==typeof window||"function"!=typeof window.getComputedStyle?(r=function(t){return t},r.destroy=function(t){return t},r.update=function(t){return t}):(r=function(t,e){return t&&Array.prototype.forEach.call(t.length?t:[t],function(t){return i(t,e)}),t},r.destroy=function(t){return t&&Array.prototype.forEach.call(t.length?t:[t],n),t},r.update=function(t){return t&&Array.prototype.forEach.call(t.length?t:[t],o),t}),e.exports=r})},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(64),s=n(o),a=i(1),r=n(a);e.default={name:"ui-alert",props:{type:{type:String,default:"info"},removeIcon:{type:Boolean,default:!1},dismissible:{type:Boolean,default:!0}},computed:{classes:function(){return["ui-alert--type-"+this.type]}},methods:{dismissAlert:function(){this.$emit("dismiss")}},components:{UiCloseButton:s.default,UiIcon:r.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(47),s=n(o),a=i(208),r=n(a),l=i(1),u=n(l),c=i(2),d=n(c),f=i(61),h=n(f);e.default={name:"ui-autocomplete",props:{name:String,placeholder:String,value:{type:[String,Number],required:!0},icon:String,iconPosition:{type:String,default:"left"},label:String,floatingLabel:{type:Boolean,default:!1},help:String,error:String,readonly:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},type:{type:String,default:"simple"},suggestions:{type:Array,default:function(){return[]}},limit:{type:Number,default:8},append:{type:Boolean,default:!1},appendDelimiter:{type:String,default:", "},minChars:{type:Number,default:2},showOnUpDown:{type:Boolean,default:!0},autofocus:{type:Boolean,default:!1},filter:Function,highlightOnFirstMatch:{type:Boolean,default:!0},cycleHighlight:{type:Boolean,default:!0},keys:{type:Object,default:function(){return d.default.data.UiAutocomplete.keys}},invalid:{type:Boolean,default:!1}},data:function(){return{initialValue:this.value,isActive:!1,isTouched:!1,showDropdown:!1,highlightedIndex:-1}},computed:{classes:function(){return["ui-autocomplete--type-"+this.type,"ui-autocomplete--icon-position-"+this.iconPosition,{"is-active":this.isActive},{"is-invalid":this.invalid},{"is-touched":this.isTouched},{"is-disabled":this.disabled},{"has-label":this.hasLabel},{"has-floating-label":this.hasFloatingLabel}]},labelClasses:function(){return{"is-inline":this.hasFloatingLabel&&this.isLabelInline,"is-floating":this.hasFloatingLabel&&!this.isLabelInline}},hasLabel:function(){return Boolean(this.label)||Boolean(this.$slots.default)},hasFloatingLabel:function(){return this.hasLabel&&this.floatingLabel},isLabelInline:function(){return 0===this.value.length&&!this.isActive},hasFeedback:function(){return Boolean(this.help)||Boolean(this.error)},showError:function(){return this.invalid&&Boolean(this.error)},showHelp:function(){return!this.showError&&Boolean(this.help)},matchingSuggestions:function(){var t=this;return this.suggestions.filter(function(e,i){return t.filter?t.filter(e,t.value):t.defaultFilter(e,i)}).slice(0,this.limit)}},watch:{value:function(){this.isActive&&this.value.length>=this.minChars&&this.openDropdown(),this.highlightedIndex=this.highlightOnFirstMatch?0:-1}},mounted:function(){document.addEventListener("click",this.onExternalClick)},beforeDestroy:function(){document.removeEventListener("click",this.onExternalClick)},methods:{defaultFilter:function(t){var e=t[this.keys.label]||t,i=this.value;return"string"==typeof i&&(i=i.toLowerCase()),(0,h.default)(i,e.toLowerCase())},selectSuggestion:function(t){var e=this,i=void 0;this.append?i+=this.appendDelimiter+(t[this.keys.value]||t):i=t[this.keys.value]||t,this.updateValue(i),this.$emit("select",t),this.$nextTick(function(){e.closeDropdown(),e.$refs.input.focus()})},highlightSuggestion:function(t){var e=0,i=this.$refs.suggestions.length-1;t===-2?t=i:t<e?t=this.cycleHighlight?i:t:t>i&&(t=this.cycleHighlight?e:-1),this.highlightedIndex=t,this.showOnUpDown&&this.openDropdown(),t<e||t>i?this.$emit("highlight-overflow",t):this.$emit("highlight",this.$refs.suggestions[t].suggestion,t)},selectHighlighted:function(t,e){this.showDropdown&&this.$refs.suggestions.length>0&&(e.preventDefault(),this.selectSuggestion(this.$refs.suggestions[t].suggestion))},openDropdown:function(){this.showDropdown||(this.showDropdown=!0,this.$emit("dropdown-open"))},closeDropdown:function(){var t=this;this.showDropdown&&this.$nextTick(function(){t.showDropdown=!1,t.highlightedIndex=-1,t.$emit("dropdown-close")})},updateValue:function(t){this.$emit("input",t)},onFocus:function(t){this.isActive=!0,this.$emit("focus",t)},onChange:function(t){this.$emit("change",this.value,t)},onBlur:function(t){this.isActive=!1,this.$emit("blur",t),this.isTouched||(this.isTouched=!0,this.$emit("touch"))},onExternalClick:function(t){!this.$el.contains(t.target)&&this.showDropdown&&this.closeDropdown()},reset:function(){document.isActiveElement===this.$refs.input&&document.isActiveElement.blur(),this.$emit("input",this.initialValue),this.isTouched=!1}},components:{UiAutocompleteSuggestion:r.default,UiIcon:u.default},directives:{autofocus:s.default}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ui-autocomplete-suggestion",props:{suggestion:{type:[String,Object],required:!0},type:{type:String,default:"simple"},highlighted:{type:Boolean,default:!1},keys:{type:Object,default:function(){return{label:"label",image:"image"}}}},computed:{classes:function(){return["ui-autocomplete-suggestion--type-"+this.type,{"is-highlighted":this.highlighted}]},imageStyle:function(){return{"background-image":"url("+this.suggestion[this.keys.image]+")"}}}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(1),s=n(o),a=i(15),r=n(a),l=i(16),u=n(l),c=i(3),d=n(c),f=i(2),h=n(f);e.default={name:"ui-button",props:{type:{type:String,default:"primary"},buttonType:{type:String,default:"submit"},color:{type:String,default:"default"},size:{type:String,default:"normal"},raised:{type:Boolean,default:!1},icon:String,iconPosition:{type:String,default:"left"},loading:{type:Boolean,default:!1},hasDropdown:{type:Boolean,default:!1},dropdownPosition:{type:String,default:"bottom left"},openDropdownOn:{type:String,default:"click"},disableRipple:{type:Boolean,default:h.default.data.disableRipple},disabled:{type:Boolean,default:!1}},data:function(){return{focusRing:{top:0,left:0,size:0}}},computed:{classes:function(){return["ui-button--type-"+this.type,"ui-button--color-"+this.color,"ui-button--icon-position-"+this.iconPosition,"ui-button--size-"+this.size,{"is-raised":this.raised},{"is-loading":this.loading},{"is-disabled":this.disabled||this.loading},{"has-dropdown":this.hasDropdown}]},focusRingStyle:function(){return{height:this.focusRing.size+"px",width:this.focusRing.size+"px",top:this.focusRing.top+"px",left:this.focusRing.left+"px"}},progressColor:function(){return"default"===this.color||"secondary"===this.type?"black":"white"}},methods:{onClick:function(t){this.$emit("click",t)},onFocus:function(){var t={width:this.$el.clientWidth,height:this.$el.clientHeight};this.focusRing.size=t.width-16,this.focusRing.top=-1*(this.focusRing.size-t.height)/2,this.focusRing.left=(t.width-this.focusRing.size)/2},onDropdownOpen:function(){this.$emit("dropdown-open")},onDropdownClose:function(){this.$emit("dropdown-close")},openDropdown:function(){this.$refs.dropdown&&this.$refs.dropdown.open()},closeDropdown:function(){this.$refs.dropdown&&this.$refs.dropdown.close()},toggleDropdown:function(){this.$refs.dropdown&&this.$refs.dropdown.toggle()}},components:{UiIcon:s.default,UiPopover:r.default,UiProgressCircular:u.default,UiRippleInk:d.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(209),s=n(o),a=i(210),r=n(a),l=i(12),u=n(l),c=i(48);e.default={name:"ui-calendar",props:{value:Date,minDate:Date,maxDate:Date,lang:{type:Object,default:function(){return u.default.defaultLang}},yearRange:{type:Array,default:function(){var t=(new Date).getFullYear();return Array.apply(null,Array(200)).map(function(e,i){return t-100+i})}},dateFilter:Function,color:{type:String,default:"primary"},orientation:{type:String,default:"portrait"}},data:function(){return{today:new Date,dateInView:this.getDateInRange(this.value,new Date),showYearPicker:!1}},computed:{classes:function(){return["ui-calendar--color-"+this.color,"ui-calendar--orientation-"+this.orientation]},headerYear:function(){return this.value?this.value.getFullYear():this.today.getFullYear()},headerDay:function(){return this.value?u.default.getDayAbbreviated(this.value,this.lang):u.default.getDayAbbreviated(this.today,this.lang)},headerDate:function(){var t=this.value?this.value:this.today;return u.default.getMonthAbbreviated(t,this.lang)+" "+u.default.getDayOfMonth(t,this.lang)}},watch:{value:function(){this.value&&(this.dateInView=u.default.clone(this.value))},showYearPicker:function(){var t=this;this.showYearPicker&&this.$nextTick(function(){var e=t.$refs.years.querySelector(".is-selected")||t.$refs.years.querySelector(".is-current-year");(0,c.scrollIntoView)(e,{marginTop:126})})}},methods:{selectYear:function(t){var e=u.default.clone(this.dateInView);e.setFullYear(t),this.dateInView=this.getDateInRange(e),this.showYearPicker=!1},getDateInRange:function(t,e){return t=t||e,this.minDate&&t.getTime()<this.minDate.getTime()?this.minDate:this.maxDate&&t.getTime()>this.maxDate.getTime()?this.maxDate:t},getYearClasses:function(t){return{"is-current-year":this.isYearCurrent(t),"is-selected":this.isYearSelected(t)}},isYearCurrent:function(t){return t===this.today.getFullYear()},isYearSelected:function(t){return this.value&&t===this.value.getFullYear()},isYearOutOfRange:function(t){return!!(this.minDate&&t<this.minDate.getFullYear())||!!(this.maxDate&&t>this.maxDate.getFullYear())},onDateSelect:function(t){this.$emit("input",t),this.$emit("date-select",t)},onGoToDate:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{isForward:!0};this.$refs.month.goToDate(t,e)},onMonthChange:function(t){this.dateInView=t,this.$emit("month-change",t)}},components:{UiCalendarControls:s.default,UiCalendarMonth:r.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(1),s=n(o),a=i(25),r=n(a),l=i(12),u=n(l);e.default={name:"ui-calendar-controls",props:{lang:Object,dateInView:Date,minDate:Date,maxDate:Date},computed:{monthAndYear:function(){return u.default.getMonthFull(this.dateInView,this.lang)+" "+this.dateInView.getFullYear()},previousMonthDisabled:function(){if(!this.minDate)return!1;var t=u.default.clone(this.dateInView);return t.setDate(0),this.minDate.getTime()>t.getTime()},nextMonthDisabled:function(){if(!this.maxDate)return!1;var t=u.default.clone(this.dateInView);return t.setMonth(this.dateInView.getMonth()+1,1),this.maxDate.getTime()<t.getTime()}},methods:{goToPreviousMonth:function(){var t=u.default.clone(this.dateInView);t.setMonth(t.getMonth()-1),this.goToDate(t,{isForward:!1})},goToNextMonth:function(){var t=u.default.clone(this.dateInView);t.setMonth(t.getMonth()+1),this.goToDate(t,{isForward:!0})},goToDate:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{isForward:!0};this.$emit("go-to-date",t,e)}},components:{UiIcon:s.default,UiIconButton:r.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(131),s=n(o),a=i(211),r=n(a),l=i(12),u=n(l);e.default={name:"ui-calendar-month",props:{lang:Object,dateFilter:Function,dateInView:Date,selected:Date,maxDate:Date,minDate:Date},data:function(){return{dateOutOfView:u.default.clone(this.dateInView),isSliding:!1,slideDirection:"",isIE:Boolean(window.MSInputMethodContext)&&Boolean(document.documentMode),ieTimeout:null}},computed:{weekClasses:function(){return[(0,s.default)({},"ui-calendar-month--slide-"+this.slideDirection,this.isSliding),{"is-sliding":this.isSliding}]},currentWeekStartDates:function(){return this.getWeekStartDates(this.dateInView)},otherWeekStartDates:function(){return this.getWeekStartDates(this.dateOutOfView)}},methods:{getWeekStartDates:function(t){var e=u.default.clone(t);e.setDate(1),e=u.default.moveToDayOfWeek(e,0);var i=u.default.clone(e);i.setDate(i.getDate()+7);for(var n=[e],o=i.getMonth();i.getMonth()===o;)n.push(u.default.clone(i)),i.setDate(i.getDate()+7);return n},goToDate:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{isForward:!0};this.isSliding=!0,this.slideDirection=e.isForward?"left":"right",this.dateOutOfView=u.default.clone(t),this.isIE&&(this.ieTimeout=setTimeout(this.onTransitionEnd,300))},onDateSelect:function(t){this.$emit("date-select",t)},onTransitionEnd:function(){this.ieTimeout&&(clearTimeout(this.ieTimeout),this.ieTimeout=null,!this.isSliding)||(this.isSliding=!1,this.slideDirection="",this.$emit("change",u.default.clone(this.dateOutOfView)),this.$emit("transition-end"))}},components:{UiCalendarWeek:r.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(12),s=n(o);e.default={name:"ui-calendar-week",props:{month:Number,weekStart:Date,minDate:Date,maxDate:Date,selected:Date,dateFilter:Function,visible:{type:Boolean,default:!0}},data:function(){return{today:new Date}},computed:{dates:function(){return this.buildDays(this.weekStart)}},methods:{buildDays:function(t){for(var e=[s.default.clone(t)],i=s.default.clone(t),n=1;n<=6;n++)i=s.default.clone(i),i.setDate(i.getDate()+1),e.push(i);return e},getDateClasses:function(t){return[{"is-today":s.default.isSameDay(t,this.today)},{"is-in-other-month":this.isDateInOtherMonth(t)},{"is-selected":this.selected&&s.default.isSameDay(t,this.selected)},{"is-disabled":this.isDateDisabled(t)}]},selectDate:function(t){this.isDateDisabled(t)||this.$emit("date-select",t)},getDayOfMonth:function(t){return s.default.getDayOfMonth(t)},isDateInOtherMonth:function(t){return this.month!==t.getMonth()},isDateDisabled:function(t){var e=this.minDate&&s.default.isBefore(t,this.minDate)||this.maxDate&&s.default.isAfter(t,this.maxDate);return!!e||!!this.dateFilter&&!this.dateFilter(t)}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(17);e.default={name:"ui-checkbox",props:{name:String,label:String,value:{required:!0},trueValue:{default:!0},falseValue:{default:!1},submittedValue:{type:String,default:"on"},checked:{type:Boolean,default:!1},boxPosition:{type:String,default:"left"},color:{type:String,default:"primary"},disabled:{type:Boolean,default:!1}},data:function(){return{isActive:!1,isChecked:(0,n.looseEqual)(this.value,this.trueValue)||this.checked}},computed:{classes:function(){return["ui-checkbox--color-"+this.color,"ui-checkbox--box-position-"+this.boxPosition,{"is-checked":this.isChecked},{"is-active":this.isActive},{"is-disabled":this.disabled}]}},watch:{value:function(){this.isChecked=(0,n.looseEqual)(this.value,this.trueValue)}},created:function(){this.$emit("input",this.isChecked?this.trueValue:this.falseValue)},methods:{onClick:function(t){this.isChecked=t.target.checked,this.$emit("input",t.target.checked?this.trueValue:this.falseValue)},onChange:function(t){this.$emit("change",this.isChecked?this.trueValue:this.falseValue,t)},onFocus:function(t){this.isActive=!0,this.$emit("focus",t)},onBlur:function(t){this.isActive=!1,this.$emit("blur",t)}}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(18),s=n(o),a=i(43),r=n(a),l=i(2),u=n(l),c=i(17);e.default={name:"ui-checkbox-group",props:{name:String,options:{type:Array,required:!0},value:{type:Array,required:!0},keys:{type:Object,default:function(){return u.default.data.UiCheckboxGroup.keys}},label:String,color:{type:String,default:"primary"},boxPosition:{type:String,default:"left"},vertical:{type:Boolean,default:!1},help:String,error:String,invalid:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1}},data:function(){return{isActive:!1,ignoreChange:!1,checkboxValues:[],initialValue:JSON.parse((0,s.default)(this.value))}},computed:{classes:function(){return["ui-checkbox-group--color-"+this.color,"ui-checkbox-group--box-position-"+this.boxPosition,{"is-vertical":this.vertical},{"is-active":this.isActive},{"is-invalid":this.invalid},{"is-disabled":this.disabled}]},hasFeedback:function(){return Boolean(this.help)||this.showError},showError:function(){return this.invalid&&Boolean(this.error)},showHelp:function(){return!this.showError&&Boolean(this.help)}},methods:{reset:function(){var t=this;this.ignoreChange=!0,this.options.forEach(function(e,i){t.checkboxValues[i]=t.isOptionCheckedByDefault(e)}),this.ignoreChange=!1,this.$emit("input",this.initialValue.length>0?[].concat(this.initialValue):[])},isOptionCheckedByDefault:function(t){return(0,c.looseIndexOf)(this.initialValue,t[this.keys.value]||t)>-1},onFocus:function(t){this.isActive=!0,this.$emit("focus",t)},onBlur:function(t){this.isActive=!1,this.$emit("blur",t)},onChange:function(t,e){if(!this.ignoreChange){var i=t[0],n=t[1],o=[],s=e[this.keys.value]||e,a=(0,c.looseIndexOf)(this.value,s);i&&a<0&&(o=this.value.concat(s)),!i&&a>-1&&(o=this.value.slice(0,a).concat(this.value.slice(a+1))),this.$emit("input",o),this.$emit("change",o,n)}}},components:{UiCheckbox:r.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(1),s=n(o),a=i(3),r=n(a),l=i(2),u=n(l);e.default={name:"ui-close-button",props:{size:{type:String,default:"normal"},color:{type:String,default:"black"},disableRipple:{type:Boolean,default:u.default.data.disableRipple},disabled:{type:Boolean,default:!1}},computed:{classes:function(){return["ui-close-button--size-"+this.size,"ui-close-button--color-"+this.color,{"is-disabled":this.disabled||this.loading}]}},methods:{onClick:function(t){this.$emit("click",t)}},components:{UiIcon:s.default,UiRippleInk:r.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(1),s=n(o),a=i(3),r=n(a),l=i(2),u=n(l),c=i(28),d=n(c),f=i(49),h=n(f);e.default={name:"ui-collapsible",props:{open:{type:Boolean,default:!1},title:String,removeIcon:{type:Boolean,default:!1},disableRipple:{type:Boolean,default:u.default.data.disableRipple},disabled:{type:Boolean,default:!1}},data:function(){return{height:0,isReady:!1,isOpen:this.open,useInitialHeight:!1,id:h.default.short("ui-collapsible-")}},computed:{classes:function(){return[{"is-open":this.isOpen},{"is-disabled":this.disabled}]},calculatedHeight:function(){return 0===this.height||this.useInitialHeight?"initial":this.height+"px"}},watch:{open:function(){this.isOpen!==this.open&&(this.isOpen=this.open)}},mounted:function(){var t=this;this.isReady=!0,this.refreshHeight(),this.$on("window-resize",function(){t.refreshHeight()})},methods:{onEnter:function(){this.$emit("open"),this.refreshHeight()},onLeave:function(){this.$emit("close")},toggleCollapsible:function(){this.disabled||(this.isOpen=!this.isOpen)},refreshHeight:function(){var t=this,e=this.$refs.body;this.useInitialHeight=!0,e.style.display="block",this.$nextTick(function(){t.height=e.scrollHeight+1,t.useInitialHeight=!1,t.isOpen||(e.style.display="none")})}},components:{UiIcon:s.default,UiRippleInk:r.default},mixins:[d.default]}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(14),s=n(o),a=i(26),r=n(a),l=i(11),u=n(l);e.default={name:"ui-confirm",props:{title:{type:String,default:"UiConfirm"},type:{type:String,default:"primary"},confirmButtonText:{type:String,default:"OK"},confirmButtonIcon:String,denyButtonText:{type:String,default:"Cancel"},denyButtonIcon:String,autofocus:{type:String,default:"deny-button"},closeOnConfirm:{type:Boolean,default:!0},dismissOn:String,transition:String,loading:{type:Boolean,default:!1}},computed:{confirmButtonColor:function(){var t={default:"default",primary:"primary",accent:"accent",success:"green",warning:"orange",danger:"red"};return t[this.type]}},methods:{open:function(){this.$refs.modal.open()},close:function(){this.$refs.modal.close()},confirm:function(){this.$emit("confirm"),this.closeOnConfirm&&this.$refs.modal.close()},deny:function(){this.$refs.modal.close(),this.$emit("deny")},onModalOpen:function(){var t=void 0;"confirm-button"===this.autofocus?t=this.$refs.confirmButton.$el:"deny-button"===this.autofocus&&(t=this.$refs.denyButton.$el),t&&(u.default.add(t,"has-focus-ring"),t.addEventListener("blur",this.removeAutoFocus),t.focus()),this.$emit("open")},onModalClose:function(){this.$emit("close")},removeAutoFocus:function(){var t=void 0;"confirm-button"===this.autofocus?t=this.$refs.confirmButton.$el:"deny-button"===this.autofocus&&(t=this.$refs.denyButton.$el),t&&(u.default.remove(t,"has-focus-ring"),t.removeEventListener("blur",this.removeAutoFocus))}},components:{UiButton:s.default,UiModal:r.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(18),s=n(o),a=i(14),r=n(a),l=i(42),u=n(l),c=i(1),d=n(c),f=i(26),h=n(f),p=i(15),v=n(p),g=i(12),m=n(g);e.default={name:"ui-datepicker",props:{name:String,value:Date,minDate:Date,maxDate:Date,yearRange:Array,lang:{type:Object,default:function(){return m.default.defaultLang}},customFormatter:Function,dateFilter:Function,color:{type:String,default:"primary"},orientation:{type:String,default:"portrait"},pickerType:{type:String,default:"popover"},okButtonText:{type:String,default:"OK"},cancelButtonText:{type:String,default:"Cancel"},placeholder:String,icon:String,iconPosition:{type:String,default:"left"},label:String,floatingLabel:{type:Boolean,default:!1},invalid:{type:Boolean,default:!1},help:String,error:String,disabled:{type:Boolean,default:!1}},data:function(){return{isActive:!1,isTouched:!1,valueAtModalOpen:null,initialValue:(0,s.default)(this.value)}},computed:{classes:function(){return["ui-datepicker--icon-position-"+this.iconPosition,"ui-datepicker--orientation-"+this.orientation,{"is-active":this.isActive},{"is-invalid":this.invalid},{"is-touched":this.isTouched},{"is-disabled":this.disabled},{"has-label":this.hasLabel},{"has-floating-label":this.hasFloatingLabel}]},labelClasses:function(){return{"is-inline":this.hasFloatingLabel&&this.isLabelInline,"is-floating":this.hasFloatingLabel&&!this.isLabelInline}},hasLabel:function(){return Boolean(this.label)||Boolean(this.$slots.default)},hasFloatingLabel:function(){return this.hasLabel&&this.floatingLabel},isLabelInline:function(){return!this.value&&!this.isActive},hasFeedback:function(){return Boolean(this.help)||Boolean(this.error)},showError:function(){return this.invalid&&Boolean(this.error)},showHelp:function(){return!this.showError&&Boolean(this.help)},displayText:function(){return this.value?this.customFormatter?this.customFormatter(this.value,this.lang):m.default.humanize(this.value,this.lang):""},hasDisplayText:function(){return Boolean(this.displayText.length)},submittedValue:function(){return this.value?this.value.getFullYear()+"-"+this.value.getMonth()+"-"+this.value.getDate():""},usesPopover:function(){return"popover"===this.pickerType},usesModal:function(){return"modal"===this.pickerType}},mounted:function(){document.addEventListener("click",this.onExternalClick)},beforeDestroy:function(){document.removeEventListener("click",this.onExternalClick)},methods:{onDateSelect:function(t){this.$emit("input",t),this.closePicker()},openPicker:function(){this.disabled||this.$refs[this.usesModal?"modal":"popover"].open()},closePicker:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{autoBlur:!1};this.usesPopover&&this.$refs.popover.close(),t.autoBlur?this.isActive=!1:this.$refs.label.focus()},onClick:function(){this.usesModal&&!this.disabled&&this.$refs.modal.open()},onFocus:function(t){this.isActive=!0,this.$emit("focus",t)},onBlur:function(t){this.isActive=!1,this.$emit("blur",t),this.usesPopover&&this.$refs.popover.dropInstance.isOpened()&&this.closePicker({autoBlur:!0})},onPickerOpen:function(){this.usesModal&&(this.valueAtModalOpen=this.value?m.default.clone(this.value):null),this.isActive=!0,this.$emit("open")},onPickerClose:function(){this.$emit("close"),this.isTouched||(this.isTouched=!0,this.$emit("touch"))},onPickerCancel:function(){this.$emit("input",this.valueAtModalOpen),this.$refs.modal.close()},onExternalClick:function(t){if(!this.disabled){var e=this.$el.contains(t.target)||this.$refs[this.usesPopover?"popover":"modal"].$el.contains(t.target);e||this.isActive&&(this.isActive=!1)}},reset:function(){this.$emit("input",JSON.parse(this.initialValue))},resetTouched:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{touched:!1};this.isTouched=t.touched}},components:{UiButton:r.default,UiCalendar:u.default,UiIcon:d.default,UiModal:h.default,UiPopover:v.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(1),s=n(o),a=i(3),r=n(a),l=i(27),u=n(l),c=i(2),d=n(c);e.default={name:"ui-fab",props:{size:{type:String,default:"normal"},color:{type:String,default:"default"},icon:String,ariaLabel:String,tooltip:String,openTooltipOn:String,tooltipPosition:String,disableRipple:{type:Boolean,default:d.default.data.disableRipple}},computed:{classes:function(){return["ui-fab--color-"+this.color,"ui-fab--size-"+this.size]}},methods:{onClick:function(t){this.$emit("click",t)}},components:{UiIcon:s.default,UiRippleInk:r.default,UiTooltip:u.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(1),s=n(o),a=i(3),r=n(a),l=i(2),u=n(l);e.default={name:"ui-fileupload",props:{name:{type:String,required:!0},label:String,accept:String,multiple:{type:Boolean,default:!1},required:{type:Boolean,default:!1},type:{type:String,default:"primary"},color:{type:String,default:"default"},size:{type:String,default:"normal"},raised:{type:Boolean,default:!1},iconPosition:{type:String,default:"left"},disableRipple:{type:Boolean,default:u.default.data.disableRipple},disabled:{type:Boolean,default:!1}},data:function(){return{isActive:!1,hasSelection:!1,hasMultiple:!1,displayText:"",focusRing:{top:0,left:0,size:0,initialized:!1}}},computed:{classes:function(){return["ui-fileupload--type-"+this.type,"ui-fileupload--color-"+this.color,"ui-fileupload--icon-position-"+this.iconPosition,"ui-fileupload--size-"+this.size,{"is-active":this.isActive},{"is-multiple":this.hasMultiple},{"is-raised":this.raised},{"is-disabled":this.disabled}]},placeholder:function(){return this.label?this.label:this.multiple?"Choose files":"Choose a file"},focusRingStyle:function(){return{height:this.focusRing.size+"px",width:this.focusRing.size+"px",top:this.focusRing.top+"px",left:this.focusRing.left+"px"}}},methods:{onFocus:function(t){this.isActive=!0,this.$emit("focus",t),this.focusRing.initialized||this.initializeFocusRing()},onBlur:function(t){this.isActive=!1,this.$emit("blur",t)},onChange:function(t){var e=this,i=void 0,n=this.$refs.input;i=n.files&&n.files.length>1?n.files.length+" files selected":t.target.value.split("\\").pop(),i&&(this.hasSelection=!0,this.displayText=i,this.hasMultiple=n.files.length>1,this.$nextTick(function(){return e.refreshFocusRing()})),this.$emit("change",n.files,t)},initializeFocusRing:function(){this.refreshFocusRing(),this.focusRing.initialized=!0},refreshFocusRing:function(){var t={width:this.$el.clientWidth,height:this.$el.clientHeight};this.focusRing.size=t.width-16,this.focusRing.top=-1*(this.focusRing.size-t.height)/2,this.focusRing.left=(t.width-this.focusRing.size)/2}},components:{UiIcon:s.default,UiRippleInk:r.default}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ui-icon",props:{icon:String,iconSet:{type:String,default:"material-icons"},ariaLabel:String,removeText:{type:Boolean,default:!1},useSvg:{type:Boolean,default:!1}}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(1),s=n(o),a=i(15),r=n(a),l=i(16),u=n(l),c=i(3),d=n(c),f=i(27),h=n(f),p=i(2),v=n(p);e.default={name:"ui-icon-button",props:{type:{type:String,default:"primary"},buttonType:{type:String,default:"button"},color:{type:String,default:"default"},size:{type:String,default:"normal"},icon:String,ariaLabel:String,loading:{type:Boolean,default:!1},hasDropdown:{type:Boolean,default:!1},dropdownPosition:{type:String,default:"bottom left"},openDropdownOn:{type:String,default:"click"},tooltip:String,openTooltipOn:String,
tooltipPosition:String,disableRipple:{type:Boolean,default:v.default.data.disableRipple},disabled:{type:Boolean,default:!1}},computed:{classes:function(){return["ui-icon-button--type-"+this.type,"ui-icon-button--color-"+this.color,"ui-icon-button--size-"+this.size,{"is-loading":this.loading},{"is-disabled":this.disabled||this.loading},{"has-dropdown":this.hasDropdown}]},progressColor:function(){return"primary"===this.type?"default"===this.color||"black"===this.color?"black":"white":"white"===this.color?"white":"black"}},methods:{onClick:function(t){this.$emit("click",t)},onDropdownOpen:function(){this.$emit("dropdown-open")},onDropdownClose:function(){this.$emit("dropdown-close")},openDropdown:function(){this.$refs.dropdown&&this.$refs.dropdown.open()},closeDropdown:function(){this.$refs.dropdown&&this.$refs.dropdown.close()},toggleDropdown:function(){this.$refs.dropdown&&this.$refs.dropdown.toggle()}},components:{UiIcon:s.default,UiPopover:r.default,UiProgressCircular:u.default,UiRippleInk:d.default,UiTooltip:h.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(212),s=n(o),a=i(2),r=n(a);e.default={name:"ui-menu",props:{options:{type:Array,default:function(){return[]}},hasIcons:{type:Boolean,default:!1},iconProps:Object,hasSecondaryText:{type:Boolean,default:!1},containFocus:{type:Boolean,default:!1},keys:{type:Object,default:function(){return r.default.data.UiMenu.keys}},disableRipple:{type:Boolean,default:r.default.data.disableRipple},raised:{type:Boolean,default:!1}},computed:{classes:function(){return{"is-raised":this.raised,"has-icons":this.hasIcons,"has-secondary-text":this.hasSecondaryText}}},methods:{selectOption:function(t){t.disabled||"divider"===t.type||(this.$emit("select",t),this.closeMenu())},closeMenu:function(){this.$emit("close")},redirectFocus:function(t){t.stopPropagation(),this.$el.querySelector(".ui-menu-option").focus()}},components:{UiMenuOption:s.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(1),s=n(o),a=i(3),r=n(a),l=i(2),u=n(l);e.default={name:"ui-menu-option",props:{type:String,label:String,icon:String,iconProps:{type:Object,default:function(){return{}}},secondaryText:String,disableRipple:{type:Boolean,default:u.default.data.disableRipple},disabled:{type:Boolean,default:!1}},computed:{classes:function(){return{"is-divider":this.isDivider,"is-disabled":this.disabled}},isDivider:function(){return"divider"===this.type}},components:{UiIcon:s.default,UiRippleInk:r.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(64),s=n(o),a=i(11),r=n(a);e.default={name:"ui-modal",props:{title:{type:String,default:"UiModal title"},size:{type:String,default:"normal"},role:{type:String,default:"dialog"},transition:{type:String,default:"scale"},removeHeader:{type:Boolean,default:!1},removeCloseButton:{type:Boolean,default:!1},preventShift:{type:Boolean,default:!1},dismissible:{type:Boolean,default:!0},dismissOn:{type:String,default:"backdrop esc close-button"}},data:function(){return{isOpen:!1,lastfocusedElement:null}},computed:{classes:function(){return["ui-modal--size-"+this.size,{"has-footer":this.hasFooter},{"is-open":this.isOpen}]},hasFooter:function(){return Boolean(this.$slots.footer)},toggleTransition:function(){return"ui-modal--transition-"+this.transition},dismissOnBackdrop:function(){return this.dismissOn.indexOf("backdrop")>-1},dismissOnCloseButton:function(){return this.dismissOn.indexOf("close-button")>-1},dismissOnEsc:function(){return this.dismissOn.indexOf("esc")>-1}},watch:{isOpen:function(){var t=this;this.$nextTick(function(){t[t.isOpen?"onOpen":"onClose"]()})}},beforeDestroy:function(){this.isOpen&&this.teardownModal()},methods:{open:function(){this.isOpen=!0},close:function(){this.isOpen=!1},closeModal:function(t){this.dismissible&&(t.currentTarget===this.$refs.backdrop&&t.target!==t.currentTarget||(this.isOpen=!1))},onOpen:function(){this.lastfocusedElement=document.activeElement,this.$refs.container.focus(),r.default.add(document.body,"ui-modal--is-open"),document.addEventListener("focus",this.restrictFocus,!0),this.$emit("open")},onClose:function(){this.teardownModal(),this.$emit("close")},redirectFocus:function(){this.$refs.container.focus()},restrictFocus:function(t){this.$refs.container.contains(t.target)||(t.stopPropagation(),this.$refs.container.focus())},teardownModal:function(){document.removeEventListener("focus",this.restrictFocus,!0),this.lastfocusedElement&&this.lastfocusedElement.focus()},onEnter:function(){this.$emit("reveal")},onLeave:function(){this.$emit("hide"),r.default.remove(document.body,"ui-modal--is-open")}},components:{UiCloseButton:s.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(11),s=n(o),a=i(62),r=n(a);e.default={name:"ui-popover",props:{trigger:{type:String,required:!0},dropdownPosition:{type:String,default:"bottom left"},openOn:{type:String,default:"click"},containFocus:{type:Boolean,default:!1},focusRedirector:Function,raised:{type:Boolean,default:!0}},data:function(){return{dropInstance:null,lastfocusedElement:null}},computed:{triggerEl:function(){return this.$parent.$refs[this.trigger]}},mounted:function(){this.triggerEl&&this.initializeDropdown()},beforeDestroy:function(){this.dropInstance&&this.dropInstance.destroy()},methods:{initializeDropdown:function(){this.dropInstance=new r.default({target:this.triggerEl,content:this.$el,position:this.dropdownPosition,constrainToWindow:!0,openOn:this.openOn}),"bottom left"!==this.dropdownPosition&&(this.dropInstance.open(),this.dropInstance.close(),this.dropInstance.open(),this.dropInstance.close()),this.dropInstance.on("open",this.onOpen),this.dropInstance.on("close",this.onClose)},openDropdown:function(){this.dropInstance&&this.dropInstance.open()},closeDropdown:function(){this.dropInstance&&this.dropInstance.close()},toggleDropdown:function(t){this.dropInstance&&this.dropInstance.toggle(t)},positionDrop:function(){var t=this.dropInstance,e=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,i=t.drop.getBoundingClientRect().width,n=t.target.getBoundingClientRect().left,o=e-n;if(i>o){var s=i>o?"right":"left";t.tether.attachment.left=s,t.tether.targetAttachment.left=s,t.position()}},onOpen:function(){this.positionDrop(),s.default.add(this.triggerEl,"has-dropdown-open"),this.lastfocusedElement=document.activeElement,this.$el.focus(),this.$emit("open")},onClose:function(){s.default.remove(this.triggerEl,"has-dropdown-open"),this.lastfocusedElement&&this.lastfocusedElement.focus(),this.$emit("close")},restrictFocus:function(t){return this.containFocus?(t.stopPropagation(),void(this.focusRedirector?this.focusRedirector(t):this.$el.focus())):void this.closeDropdown()},open:function(){this.openDropdown()},close:function(){this.closeDropdown()},toggle:function(){this.toggleDropdown()}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ui-preloader",props:{show:{type:Boolean,required:!0}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ui-progress-circular",props:{type:{type:String,default:"indeterminate"},color:{type:String,default:"primary"},progress:{type:Number,default:0},size:{type:Number,default:32},stroke:Number,autoStroke:{type:Boolean,default:!0},disableTransition:{type:Boolean,default:!1}},computed:{classes:function(){return["ui-progress-circular--color-"+this.color,"ui-progress-circular--type-"+this.type]},strokeDashArray:function(){var t=2*Math.PI*this.radius;return Math.round(1e3*t)/1e3},strokeDashOffset:function(){var t=this.moderateProgress(this.progress),e=2*Math.PI*this.radius;return(100-t)/100*e},radius:function(){var t=this.stroke?this.stroke:4;return(this.size-t)/2},calculatedStroke:function(){return this.stroke?this.stroke:this.autoStroke?parseInt(this.size/8,10):4}},methods:{moderateProgress:function(t){return isNaN(t)||t<0?0:t>100?100:t}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ui-progress-linear",props:{type:{type:String,default:"indeterminate"},color:{type:String,default:"primary"},progress:{type:Number,default:0}},computed:{classes:function(){return["ui-progress-linear--color-"+this.color,"ui-progress-linear--type-"+this.type]},moderatedProgress:function(){return this.progress<0?0:this.progress>100?100:this.progress}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ui-radio",props:{name:String,label:String,value:{type:[Number,String],required:!0},trueValue:{type:[Number,String],required:!0},checked:{type:Boolean,default:!1},color:{type:String,default:"primary"},buttonPosition:{type:String,default:"left"},disabled:{type:Boolean,default:!1}},data:function(){return{isActive:!1}},computed:{classes:function(){return["ui-radio--color-"+this.color,"ui-radio--button-position-"+this.buttonPosition,{"is-active":this.isActive},{"is-checked":this.isChecked},{"is-disabled":this.disabled}]},isChecked:function(){return String(this.value).length>0&&this.value==this.trueValue}},created:function(){this.checked&&this.$emit("input",this.trueValue)},methods:{toggleCheck:function(){this.disabled||this.$emit("input",this.trueValue)},onFocus:function(t){this.isActive=!0,this.$emit("focus",t)},onBlur:function(t){this.isActive=!1,this.$emit("blur",t)},onChange:function(t){this.$emit("change",this.isChecked,t)}}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(45),s=n(o),a=i(2),r=n(a);e.default={name:"ui-radio-group",props:{name:{type:String,required:!0},label:String,options:{type:Array,required:!0},value:{type:[Number,String],required:!0},keys:{type:Object,default:function(){return r.default.data.UiRadioGroup.keys}},color:{type:String,default:"primary"},buttonPosition:{type:String,default:"left"},vertical:{type:Boolean,default:!1},help:String,error:String,invalid:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1}},data:function(){return{isActive:!1,initialValue:this.value,selectedOptionValue:this.value}},computed:{classes:function(){return["ui-radio-group--color-"+this.color,"ui-radio-group--button-position-"+this.buttonPosition,{"is-vertical":this.vertical},{"is-active":this.isActive},{"is-invalid":this.invalid},{"is-disabled":this.disabled}]},hasFeedback:function(){return Boolean(this.help)||this.showError},showError:function(){return this.invalid&&Boolean(this.error)},showHelp:function(){return!this.showError&&Boolean(this.help)}},watch:{selectedOptionValue:function(){this.$emit("input",this.selectedOptionValue),this.$emit("change",this.selectedOptionValue)},value:function(){this.selectedOptionValue=this.value}},methods:{reset:function(){this.$emit("input",this.initialValue)},isOptionCheckedByDefault:function(t){return this.initialValue==t[this.keys.value]||this.initialValue==t||t[this.keys.checked]},onFocus:function(t){this.isActive=!0,this.$emit("focus",t)},onBlur:function(t){this.isActive=!1,this.$emit("blur",t)}},components:{UiRadio:s.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(11),s=n(o),a=function(t,e){var i=e.currentTarget||e.target;if(i&&!s.default.has(i,"ui-ripple-ink")&&(i=i.querySelector(".ui-ripple-ink")),i){var n=i.getAttribute("data-ui-event");if(!n||n===t){i.setAttribute("data-ui-event",t);var o=i.getBoundingClientRect(),a=e.offsetX,r=void 0;void 0===a?(a=e.clientX-o.left,r=e.clientY-o.top):r=e.offsetY;var l=document.createElement("div"),u=void 0;u=o.width===o.height?1.412*o.width:Math.sqrt(o.width*o.width+o.height*o.height);var c=2*u+"px";l.style.width=c,l.style.height=c,l.style.marginLeft=-u+a+"px",l.style.marginTop=-u+r+"px",l.className="ui-ripple-ink__ink",i.appendChild(l),setTimeout(function(){s.default.add(l,"is-held")},0);var d="mousedown"===t?"mouseup":"touchend",f=function t(){document.removeEventListener(d,t),s.default.add(l,"is-done"),setTimeout(function(){i.removeChild(l),0===i.children.length&&i.removeAttribute("data-ui-event")},650)};document.addEventListener(d,f)}}},r=function(t){0===t.button&&a(t.type,t)},l=function(t){if(t.changedTouches)for(var e=0;e<t.changedTouches.length;++e)a(t.type,t.changedTouches[e])};e.default={name:"ui-ripple-ink",props:{trigger:{type:String,required:!0}},watch:{trigger:function(){this.initialize()}},mounted:function(){var t=this;this.$nextTick(function(){t.initialize()})},beforeDestroy:function(){var t=this.trigger?this.$parent.$refs[this.trigger]:null;t&&(t.removeEventListener("mousedown",r),t.removeEventListener("touchstart",l))},methods:{initialize:function(){var t=this.trigger?this.$parent.$refs[this.trigger]:null;t&&(t.addEventListener("touchstart",l),t.addEventListener("mousedown",r))}}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(18),s=n(o),a=i(1),r=n(a),l=i(16),u=n(l),c=i(213),d=n(c),f=i(2),h=n(f),p=i(61),v=n(p),g=i(17),m=i(48);e.default={name:"ui-select",props:{name:String,value:{type:[String,Number,Object,Array],required:!0},options:{type:Array,default:function(){return[]}},placeholder:String,icon:String,iconPosition:{type:String,default:"left"},label:String,floatingLabel:{type:Boolean,default:!1},type:{type:String,default:"basic"},multiple:{type:Boolean,default:!1},multipleDelimiter:{type:String,default:", "},hasSearch:{type:Boolean,default:!1},searchPlaceholder:{type:String,default:"Search"},filter:Function,disableFilter:{type:Boolean,default:!1},loading:{type:Boolean,default:!1},noResults:{type:Boolean,default:!1},keys:{type:Object,default:function(){return h.default.data.UiSelect.keys}},invalid:{type:Boolean,default:!1},help:String,error:String,disabled:{type:Boolean,default:!1}},data:function(){return{query:"",isActive:!1,isTouched:!1,selectedIndex:-1,highlightedIndex:-1,showDropdown:!1,initialValue:(0,s.default)(this.value)}},computed:{classes:function(){return["ui-select--type-"+this.type,"ui-select--icon-position-"+this.iconPosition,{"is-active":this.isActive},{"is-invalid":this.invalid},{"is-touched":this.isTouched},{"is-disabled":this.disabled},{"is-multiple":this.multiple},{"has-label":this.hasLabel},{"has-floating-label":this.hasFloatingLabel}]},labelClasses:function(){return{"is-inline":this.hasFloatingLabel&&this.isLabelInline,"is-floating":this.hasFloatingLabel&&!this.isLabelInline}},hasLabel:function(){return Boolean(this.label)||Boolean(this.$slots.default)},hasFloatingLabel:function(){return this.hasLabel&&this.floatingLabel},isLabelInline:function(){return 0===this.value.length&&!this.isActive},hasFeedback:function(){return Boolean(this.help)||Boolean(this.error)},showError:function(){return this.invalid&&Boolean(this.error)},showHelp:function(){return!this.showError&&Boolean(this.help)},filteredOptions:function(){var t=this;return this.disableFilter?this.options:this.options.filter(function(e,i){return t.filter?t.filter(e,t.query):t.defaultFilter(e,i)})},displayText:function(){var t=this;return this.multiple?this.value.length>0?this.value.map(function(e){return e[t.keys.label]||e}).join(this.multipleDelimiter):"":this.value?this.value[this.keys.label]||this.value:""},hasDisplayText:function(){return Boolean(this.displayText.length)},hasNoResults:function(){return!this.loading&&0!==this.query.length&&(this.disableFilter?this.noResults:0===this.filteredOptions.length)},submittedValue:function(){var t=this;if(this.name&&this.value)return Array.isArray(this.value)?this.value.map(function(e){return e[t.keys.value]||e}).join(","):this.value[this.keys.value]||this.value}},watch:{filteredOptions:function(){this.highlightedIndex=0,(0,m.resetScroll)(this.$refs.optionsList)},showDropdown:function(){this.showDropdown?(this.onOpen(),this.$emit("dropdown-open")):(this.onClose(),this.$emit("dropdown-close"))},query:function(){this.$emit("query-change",this.query)}},created:function(){this.value&&""!==this.value||this.setValue(null)},mounted:function(){document.addEventListener("click",this.onExternalClick)},beforeDestroy:function(){document.removeEventListener("click",this.onExternalClick)},methods:{setValue:function(t){t=t?t:this.multiple?[]:"",this.$emit("input",t),this.$emit("change",t)},highlightOption:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{autoScroll:!0};if(this.highlightedIndex!==t&&0!==this.$refs.options.length){var i=0,n=this.$refs.options.length-1;t<i?t=n:t>n&&(t=i),this.highlightedIndex=t,e.autoScroll&&this.scrollOptionIntoView(this.$refs.options[t].$el)}},selectHighlighted:function(t,e){this.$refs.options.length>0&&(e.preventDefault(),this.selectOption(this.$refs.options[t].option,t))},selectOption:function(t,e){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{autoClose:!0},n=this.multiple&&!this.isOptionSelected(t);this.multiple?this.updateOption(t,{select:n}):(this.setValue(t),this.selectedIndex=e),this.$emit("select",t,{selected:!this.multiple||n}),this.highlightedIndex=e,this.clearQuery(),!this.multiple&&i.autoClose&&this.closeDropdown()},isOptionSelected:function(t){return this.multiple?(0,g.looseIndexOf)(this.value,t)>-1:(0,g.looseEqual)(this.value,t)},updateOption:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{select:!0},i=[],n=!1,o=(0,g.looseIndexOf)(this.value,t);e.select&&o<0&&(i=this.value.concat(t),n=!0),!e.select&&o>-1&&(i=this.value.slice(0,o).concat(this.value.slice(o+1)),n=!0),n&&this.setValue(i)},defaultFilter:function(t){var e=this.query.toLowerCase(),i=t[this.keys.label]||t;return"string"==typeof i&&(i=i.toLowerCase()),(0,v.default)(e,i)},clearQuery:function(){this.query=""},toggleDropdown:function(){this[this.showDropdown?"closeDropdown":"openDropdown"]()},openDropdown:function(){this.disabled||(this.showDropdown=!0,this.isActive||(this.isActive=!0))},closeDropdown:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{autoBlur:!1};this.showDropdown=!1,this.isTouched||(this.isTouched=!0,this.$emit("touch")),t.autoBlur?this.isActive=!1:this.$refs.label.focus()},onFocus:function(t){this.isActive||(this.isActive=!0,this.$emit("focus",t))},onBlur:function(t){this.isActive=!1,this.$emit("blur",t),this.showDropdown&&this.closeDropdown({autoBlur:!0})},onOpen:function(){var t=this;this.$nextTick(function(){t.$refs[t.hasSearch?"searchInput":"dropdown"].focus(),t.scrollOptionIntoView(t.$refs.optionsList.querySelector(".is-selected"))})},onClose:function(){this.highlightedIndex=this.multiple?-1:this.selectedIndex},onExternalClick:function(t){this.$el.contains(t.target)||(this.showDropdown?this.closeDropdown({autoBlur:!0}):this.isActive&&(this.isActive=!1))},scrollOptionIntoView:function(t){(0,m.scrollIntoView)(t,{container:this.$refs.optionsList,marginTop:180})},reset:function(){this.setValue(JSON.parse(this.initialValue)),this.clearQuery(),this.resetTouched(),this.selectedIndex=-1,this.highlightedIndex=-1},resetTouched:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{touched:!1};this.isTouched=t.touched}},components:{UiIcon:r.default,UiProgressCircular:u.default,UiSelectOption:d.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(1),s=n(o);e.default={name:"ui-select-option",props:{option:{type:[String,Object],required:!0},type:{type:String,default:"basic"},multiple:{type:Boolean,default:!1},highlighted:{type:Boolean,default:!1},selected:{type:Boolean,default:!1},keys:{type:Object,default:function(){return{label:"label",image:"image"}}}},computed:{classes:function(){return["ui-select-option--type-"+this.type,{"is-highlighted":this.highlighted},{"is-selected":this.selected}]},imageStyle:function(){return{"background-image":"url("+this.option[this.keys.image]+")"}}},components:{UiIcon:s.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(1),s=n(o),a=i(11),r=n(a),l=i(28),u=n(l);e.default={name:"ui-slider",props:{name:String,icon:String,value:{type:Number,required:!0},step:{type:Number,default:10},snapToSteps:{type:Boolean,default:!1},showMarker:{type:Boolean,default:!1},markerValue:Number,disabled:{type:Boolean,default:!1}},data:function(){return{initialValue:this.value,isActive:!1,isDragging:!1,thumbSize:0,trackLength:0,trackOffset:0,localValue:this.value}},computed:{classes:function(){return[{"is-dragging":this.isDragging},{"is-disabled":this.disabled},{"is-active":this.isActive},{"has-icon":this.hasIcon},{"has-marker":this.showMarker}]},hasIcon:function(){return Boolean(this.$slots.icon)||Boolean(this.icon)},fillStyle:function(){return{transform:"scaleX("+this.localValue/100+")"}},thumbStyle:function(){return{transform:"translateX("+(this.localValue/100*this.trackLength-this.thumbSize/2)+"px)"}},markerText:function(){return this.markerValue?this.markerValue:this.value},snapPoints:function(){for(var t=[],e=0,i=e*this.step;i<=100;)t.push(i),e++,i=e*this.step;return t}},watch:{value:function(){this.setValue(this.value)},isDragging:function(){var t=this.isDragging?"add":"remove";r.default[t](document.body,"ui-slider--is-dragging")}},mounted:function(){this.initializeSlider()},beforeDestroy:function(){this.teardownSlider()},methods:{reset:function(){this.setValue(this.initialValue)},onFocus:function(){this.isActive=!0,this.$emit("focus")},onBlur:function(){this.isActive=!1,this.$emit("blur")},onExternalClick:function(t){this.$el.contains(t.target)||this.onBlur()},setValue:function(t){t>100?t=100:t<0&&(t=0),t!==this.localValue&&(this.localValue=t,this.$emit("input",t),this.$emit("change",t))},incrementValue:function(){this.setValue(this.localValue+this.step)},decrementValue:function(){this.setValue(this.localValue-this.step)},getTrackOffset:function(){for(var t=this.$refs.track,e=t.offsetLeft;t.offsetParent;)t=t.offsetParent,e+=t.offsetLeft;return e},getPointStyle:function(t){return{left:t+"%"}},refreshSize:function(){this.thumbSize=this.$refs.thumb.offsetWidth,this.trackLength=this.$refs.track.offsetWidth,this.trackOffset=this.getTrackOffset(this.$refs.track)},initializeSlider:function(){var t=this;document.addEventListener("touchend",this.onDragStop),document.addEventListener("mouseup",this.onDragStop),document.addEventListener("click",this.onExternalClick),this.$on("window-resize",function(){t.refreshSize(),t.isDragging=!1}),this.refreshSize(),this.initializeDrag()},teardownSlider:function(){document.removeEventListener("touchend",this.onDragStop),document.removeEventListener("mouseup",this.onDragStop),document.removeEventListener("click",this.onExternalClick)},initializeDrag:function(){var t=this.getEdge(this.localValue?this.localValue:0,0,100);this.setValue(t)},onDragStart:function(t){this.disabled||(this.isActive||this.onFocus(),this.isDragging=!0,this.dragUpdate(t),document.addEventListener("touchmove",this.onDragMove),document.addEventListener("mousemove",this.onDragMove),this.$emit("dragstart",this.localValue,t))},onDragMove:function(t){this.dragUpdate(t)},dragUpdate:function(t){var e=t.touches?t.touches[0].pageX:t.pageX,i=this.getEdge((e-this.trackOffset)/this.trackLength*100,0,100);this.isDragging&&this.setValue(Math.round(i))},onDragStop:function(t){this.isDragging=!1,this.snapToSteps&&this.value%this.step!==0&&this.setValue(this.getNearestSnapPoint()),document.removeEventListener("touchmove",this.onDragMove),document.removeEventListener("mousemove",this.onDragMove),this.$emit("dragend",this.localValue,t)},getNearestSnapPoint:function(){var t=Math.floor(this.value/this.step)*this.step,e=t+this.step,i=(t+e)/2;return this.value>=i?e:t},getEdge:function(t,e,i){return t<e?e:t>i?i:t}},components:{UiIcon:s.default},mixins:[u.default]}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(14),s=n(o);e.default={name:"ui-snackbar",props:{message:String,action:String,actionColor:{type:String,default:"accent"},transition:{type:String,default:"slide"}},computed:{transitionName:function(){return"ui-snackbar--transition-"+this.transition}},methods:{onClick:function(){this.$emit("click")},onActionClick:function(){this.$emit("action-click")},onEnter:function(){this.$emit("show")},onLeave:function(){this.$emit("hide")}},components:{UiButton:s.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(46),s=n(o);e.default={name:"ui-snackbar-container",props:{queueSnackbars:{type:Boolean,default:!1},duration:{type:Number,default:5e3},allowHtml:{type:Boolean,default:!1},position:{type:String,default:"left"},transition:{type:String,default:"slide"}},data:function(){return{queue:[],snackbarTimeout:null}},computed:{classes:function(){return["ui-snackbar-container--position-"+this.position]}},beforeDestroy:function(){this.resetTimeout()},methods:{createSnackbar:function(t){return t.show=!1,t.duration=t.duration||this.duration,this.queue.push(t),1===this.queue.length?this.showNextSnackbar():void(this.queueSnackbars||(this.queue[0].show=!1))},showNextSnackbar:function(){0!==this.queue.length&&(this.queue[0].show=!0)},onShow:function(t){var e=this;0===this.queue.indexOf(t)&&(this.snackbarTimeout=setTimeout(function(){e.queue[0].show=!1},t.duration),this.$emit("snackbar-show",t),this.callHook("onShow",t))},onHide:function(t,e){this.queueSnackbars||1===this.queue.length?this.queue.splice(e,1):this.queue.splice(e,this.queue.length-1),this.$emit("snackbar-hide",t),this.callHook("onHide",t),this.resetTimeout(),this.showNextSnackbar()},onClick:function(t){t.show=!1,this.callHook("onClick",t)},onActionClick:function(t){this.callHook("onActionClick",t)},callHook:function(t,e){"function"==typeof e[t]&&e[t].call(void 0,e)},resetTimeout:function(){clearTimeout(this.snackbarTimeout),this.snackbarTimeout=null}},components:{UiSnackbar:s.default}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(17);e.default={name:"ui-switch",props:{name:String,label:String,value:{required:!0},trueValue:{default:!0},falseValue:{default:!1},submittedValue:{type:String,default:"on"},checked:{type:Boolean,default:!1},color:{type:String,default:"primary"},switchPosition:{type:String,default:"left"},disabled:{type:Boolean,default:!1}},data:function(){return{isActive:!1,isChecked:(0,n.looseEqual)(this.value,this.trueValue)||this.checked,initialValue:this.value}},computed:{classes:function(){return["ui-switch--color-"+this.color,"ui-switch--switch-position-"+this.switchPosition,{"is-active":this.isActive},{"is-checked":this.isChecked},{"is-disabled":this.disabled}]}},watch:{value:function(){this.isChecked=(0,n.looseEqual)(this.value,this.trueValue)}},created:function(){this.$emit("input",this.isChecked?this.trueValue:this.falseValue)},methods:{onClick:function(t){this.isChecked=t.target.checked,this.$emit("input",t.target.checked?this.trueValue:this.falseValue)},onChange:function(t){this.$emit("change",this.isChecked?this.trueValue:this.falseValue,t)},onFocus:function(){this.isActive=!0,this.$emit("focus")},onBlur:function(){this.isActive=!1,this.$emit("blur")}}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(49),s=n(o);e.default={name:"ui-tab",props:{id:{type:String,default:function(){return s.default.short("ui-tab-")}},title:String,icon:String,iconProps:{type:Object,default:function(){return{}}},show:{type:Boolean,default:!0},selected:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1}},data:function(){return{isActive:!1}},watch:{show:function(){this.$parent.handleTabShowChange(this)},disabled:function(){this.$parent.handleTabDisableChange(this)}},created:function(){this.$parent.registerTab(this)},methods:{activate:function(){this.isActive=!0,this.$emit("select",this.id)},deactivate:function(){this.isActive=!1,this.$emit("deselect",this.id)}}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(1),s=n(o),a=i(3),r=n(a),l=i(2),u=n(l);e.default={name:"ui-tab-header-item",props:{id:String,type:{type:String,default:"text"},title:String,icon:String,iconProps:{type:Object,default:function(){return{}}},active:{type:Boolean,default:!1},show:{type:Boolean,default:!0},disableRipple:{type:Boolean,default:u.default.data.disableRipple},disabled:{type:Boolean,default:!1}},computed:{classes:function(){return["ui-tab-header-item--type-"+this.type,{"is-active":this.active},{"is-disabled":this.disabled}]}},components:{UiIcon:s.default,UiRippleInk:r.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(28),s=n(o),a=i(214),r=n(a),l=i(2),u=n(l);e.default={name:"ui-tabs",props:{type:{type:String,default:"text"},backgroundColor:{type:String,default:"default"},textColor:{type:String,default:"black"},textColorActive:{type:String,default:"primary"},indicatorColor:{type:String,default:"primary"},fullwidth:{type:Boolean,default:!1},raised:{type:Boolean,default:!1},disableRipple:{type:Boolean,default:u.default.data.disableRipple}},data:function(){return{tabs:[],activeTabId:null,activeTabIndex:-1,activeTabElement:null,activeTabPosition:{left:0,width:0},tabContainerWidth:0}},computed:{classes:function(){return["ui-tabs--type-"+this.type,"ui-tabs--text-color-"+this.textColor,"ui-tabs--text-color-active-"+this.textColorActive,"ui-tabs--background-color-"+this.backgroundColor,"ui-tabs--indicator-color-"+this.textColorActive,{"is-raised":this.raised},{"is-fullwidth":this.fullwidth}]},indicatorLeft:function(){return this.activeTabPosition.left+"px"},indicatorRight:function(){return this.tabContainerWidth-(this.activeTabPosition.left+this.activeTabPosition.width)+"px"}},watch:{activeTabId:function(){var t=this;this.tabs.forEach(function(e,i){t.activeTabId===e.id?(e.activate(),t.activeTabIndex=i):e.isActive&&e.deactivate()})},activeTabElement:function(){this.refreshIndicator()}},mounted:function(){var t=this;this.$nextTick(function(){t.tabContainerWidth=t.$refs.tabsContainer.offsetWidth,t.activeTabElement=t.$refs.tabsContainer.querySelector(".is-active")}),this.$on("window-resize",function(){t.tabContainerWidth=t.$refs.tabsContainer.offsetWidth,t.refreshIndicator()})},methods:{registerTab:function(t){this.tabs.push(t),(null===this.activeTabId||t.selected)&&(this.activeTabId=t.id)},handleTabShowChange:function(t){if(this.activeTabId===t.id&&!t.show){var e=this.findNearestAvailableTab({preferPrevious:!0});e&&this.selectTab(e.$el,e)}this.refreshIndicator()},handleTabDisableChange:function(t){if(this.activeTabId===t.id&&t.disabled){var e=this.findNearestAvailableTab({preferPrevious:!0});e&&this.selectTab(e.$el,e)}},selectTab:function(t,e){var i=t.currentTarget?t.currentTarget:t;e.disabled||this.activeTabElement===i||(this.activeTabElement=i,this.activeTabId=e.id,this.$emit("tab-change",e.id))},selectPreviousTab:function(){if(0!==this.activeTabIndex){var t=this.findTabByIndex(this.activeTabIndex,{findPrevious:!0});t&&(this.selectTab(t.$el,t),this.activeTabElement.focus())}},selectNextTab:function(){if(this.activeTabIndex!==this.$refs.tabElements.length-1){var t=this.findTabByIndex(this.activeTabIndex);t&&(this.selectTab(t.$el,t),this.activeTabElement.focus())}},findTabByIndex:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{findPrevious:!1},i=null;if(e.findPrevious){for(var n=t-1;n>=0;n--)if(!this.$refs.tabElements[n].disabled&&this.$refs.tabElements[n].show){i=this.$refs.tabElements[n];
break}}else for(var o=t+1;o<this.$refs.tabElements.length;o++)if(!this.$refs.tabElements[o].disabled&&this.$refs.tabElements[o].show){i=this.$refs.tabElements[o];break}return i},findTabById:function(t){for(var e=null,i=this.$refs.tabElements.length,n=0;n<=i;n++)if(t===this.$refs.tabElements[n].id){e=this.$refs.tabElements[n];break}return e},findNearestAvailableTab:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{preferPrevious:!1},e=this.findTabByIndex(this.activeTabIndex,{findPrevious:t.preferPrevious});return e?e:this.findTabByIndex(this.activeTabIndex,{findPrevious:!t.preferPrevious})},setActiveTab:function(t){var e=this.findTabById(t);e&&!e.disabled&&this.selectTab(e.$el,e)},refreshIndicator:function(){this.activeTabPosition={left:this.activeTabElement?this.activeTabElement.offsetLeft:0,width:this.activeTabElement?this.activeTabElement.offsetWidth:0}}},components:{UiTabHeaderItem:r.default,RenderVnodes:{name:"render-vnodes",functional:!0,props:["nodes"],render:function(t,e){return t("div",e.props.nodes)}}},mixins:[s.default]}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(47),s=n(o),a=i(1),r=n(a),l=i(85),u=n(l);e.default={name:"ui-textbox",props:{name:String,placeholder:String,value:{type:[String,Number],required:!0},icon:String,iconPosition:{type:String,default:"left"},label:String,floatingLabel:{type:Boolean,default:!1},type:{type:String,default:"text"},multiLine:{type:Boolean,default:!1},rows:{type:Number,default:2},autocomplete:String,autofocus:{type:Boolean,default:!1},autosize:{type:Boolean,default:!0},min:Number,max:Number,step:{type:String,default:"any"},maxlength:Number,enforceMaxlength:{type:Boolean,default:!1},required:{type:Boolean,default:!1},readonly:{type:Boolean,default:!1},help:String,error:String,invalid:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1}},data:function(){return{isActive:!1,isTouched:!1,initialValue:this.value,autosizeInitialized:!1}},computed:{classes:function(){return["ui-textbox--icon-position-"+this.iconPosition,{"is-active":this.isActive},{"is-invalid":this.invalid},{"is-touched":this.isTouched},{"is-multi-line":this.multiLine},{"has-counter":this.maxlength},{"is-disabled":this.disabled},{"has-label":this.hasLabel},{"has-floating-label":this.hasFloatingLabel}]},labelClasses:function(){return{"is-inline":this.hasFloatingLabel&&this.isLabelInline,"is-floating":this.hasFloatingLabel&&!this.isLabelInline}},hasLabel:function(){return Boolean(this.label)||Boolean(this.$slots.default)},hasFloatingLabel:function(){return this.hasLabel&&this.floatingLabel},isLabelInline:function(){return 0===this.value.length&&!this.isActive},minValue:function(){return"number"===this.type&&void 0!==this.min?this.min:null},maxValue:function(){return"number"===this.type&&void 0!==this.max?this.max:null},stepValue:function(){return"number"===this.type?this.step:null},hasFeedback:function(){return Boolean(this.help)||Boolean(this.error)},showError:function(){return this.invalid&&Boolean(this.error)},showHelp:function(){return!this.showError&&Boolean(this.help)}},mounted:function(){this.multiLine&&this.autosize&&((0,u.default)(this.$refs.textarea),this.autosizeInitialized=!0)},beforeDestroy:function(){this.autosizeInitialized&&u.default.destroy(this.$refs.textarea)},methods:{updateValue:function(t){this.$emit("input",t)},onChange:function(t){this.$emit("change",this.value,t)},onFocus:function(t){this.isActive=!0,this.$emit("focus",t)},onBlur:function(t){this.isActive=!1,this.$emit("blur",t),this.isTouched||(this.isTouched=!0,this.$emit("touch"))},onKeydown:function(t){this.$emit("keydown",t)},onKeydownEnter:function(t){this.$emit("keydown-enter",t)},reset:function(){document.activeElement!==this.$refs.input&&document.activeElement!==this.$refs.textarea||document.activeElement.blur(),this.updateValue(this.initialValue),this.resetTouched()},resetTouched:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{touched:!1};this.isTouched=t.touched},refreshSize:function(){this.autosizeInitialized&&u.default.update(this.$refs.textarea)}},components:{UiIcon:r.default},directives:{autofocus:s.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(25),s=n(o),a=i(44),r=n(a);e.default={name:"ui-toolbar",props:{type:{type:String,default:"default"},textColor:{type:String,default:"black"},title:String,brand:String,removeBrandDivider:{type:Boolean,default:!1},navIcon:{type:String,default:"menu"},removeNavIcon:{type:Boolean,default:!1},raised:{type:Boolean,default:!0},progressPosition:{type:String,default:"bottom"},loading:{type:Boolean,default:!1}},computed:{classes:function(){return["ui-toolbar--type-"+this.type,"ui-toolbar--text-color-"+this.textColor,"ui-toolbar--progress-position-"+this.progressPosition,{"is-raised":this.raised}]},progressColor:function(){return"black"===this.textColor?"primary":"white"},hasBrandDivider:function(){return!this.removeBrandDivider&&(this.brand||this.$slots.brand)}},methods:{navIconClick:function(){this.$emit("nav-icon-click")}},components:{UiIconButton:s.default,UiProgressLinear:r.default}}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=i(207),s=n(o);e.default={name:"ui-tooltip",props:{trigger:{type:String,required:!0},position:{type:String,default:"bottom center"},openOn:{type:String,default:"hover focus"},openDelay:{type:Number,default:0}},data:function(){return{tooltip:null}},watch:{trigger:function(){null===this.tooltip&&this.initialize()}},mounted:function(){null===this.tooltip&&this.initialize()},beforeDestroy:function(){null!==this.tooltip&&this.tooltip.destroy()},methods:{initialize:function(){void 0!==this.trigger&&(this.tooltip=new s.default({target:this.$parent.$refs[this.trigger],content:this.$refs.tooltip,classes:"ui-tooltip--theme-default",position:this.position,openOn:this.openOn,openDelay:this.openDelay}))}}}},function(t,e,i){"use strict";document.addEventListener("DOMContentLoaded",function(){var t=!1,e=["input:not([type])","input[type=text]","input[type=number]","input[type=date]","input[type=time]","input[type=datetime]","textarea","[role=textbox]","[supports-modality=keyboard]"].join(","),i=void 0,n=function(){var t=document.body;return t.matchesSelector?t.matchesSelector:t.webkitMatchesSelector?t.webkitMatchesSelector:t.mozMatchesSelector?t.mozMatchesSelector:t.msMatchesSelector?t.msMatchesSelector:void console.error("Couldn't find any matchesSelector method on document.body.")}(),o=function(){var t="body:not([modality=keyboard]) :focus { outline: none; }",e=document.head||document.getElementsByTagName("head")[0],i=document.createElement("style");i.type="text/css",i.id="disable-focus-ring",i.styleSheet?i.styleSheet.cssText=t:i.appendChild(document.createTextNode(t)),e.insertBefore(i,e.firstChild)},s=function(t){var i=!1;return n&&(i=n.call(t,e)&&n.call(t,":not([readonly])")),i};o(),document.body.addEventListener("keydown",function(){t=!0,i&&clearTimeout(i),i=setTimeout(function(){t=!1},100)},!0),document.body.addEventListener("focus",function(e){(t||s(e.target))&&document.body.setAttribute("modality","keyboard")},!0),document.body.addEventListener("blur",function(){document.body.removeAttribute("modality")},!0)})},function(t,e,i){t.exports={default:i(134),__esModule:!0}},function(t,e,i){t.exports={default:i(135),__esModule:!0}},function(t,e,i){"use strict";e.__esModule=!0,e.default=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var o=i(50),s=n(o);e.default=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,s.default)(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}()},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var o=i(50),s=n(o);e.default=function(t,e,i){return e in t?(0,s.default)(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}},function(t,e,i){var n=i(13),o=n.JSON||(n.JSON={stringify:JSON.stringify});t.exports=function(t){return o.stringify.apply(o,arguments)}},function(t,e,i){i(157);var n=i(13).Object;t.exports=function(t,e,i){return n.defineProperty(t,e,i)}},function(t,e,i){i(160),i(158),i(161),i(162),t.exports=i(13).Symbol},function(t,e,i){i(159),i(163),t.exports=i(41).f("iterator")},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e){t.exports=function(){}},function(t,e,i){var n=i(8),o=i(154),s=i(153);t.exports=function(t){return function(e,i,a){var r,l=n(e),u=o(l.length),c=s(a,u);if(t&&i!=i){for(;u>c;)if(r=l[c++],r!=r)return!0}else for(;u>c;c++)if((t||c in l)&&l[c]===i)return t||c||0;return!t&&-1}}},function(t,e,i){var n=i(136);t.exports=function(t,e,i){if(n(t),void 0===e)return t;switch(i){case 1:return function(i){return t.call(e,i)};case 2:return function(i,n){return t.call(e,i,n)};case 3:return function(i,n,o){return t.call(e,i,n,o)}}return function(){return t.apply(e,arguments)}}},function(t,e,i){var n=i(22),o=i(58),s=i(34);t.exports=function(t){var e=n(t),i=o.f;if(i)for(var a,r=i(t),l=s.f,u=0;r.length>u;)l.call(t,a=r[u++])&&e.push(a);return e}},function(t,e,i){t.exports=i(4).document&&document.documentElement},function(t,e,i){var n=i(52);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==n(t)?t.split(""):Object(t)}},function(t,e,i){var n=i(52);t.exports=Array.isArray||function(t){return"Array"==n(t)}},function(t,e,i){"use strict";var n=i(56),o=i(23),s=i(35),a={};i(9)(a,i(10)("iterator"),function(){return this}),t.exports=function(t,e,i){t.prototype=n(a,{next:o(1,i)}),s(t,e+" Iterator")}},function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},function(t,e,i){var n=i(22),o=i(8);t.exports=function(t,e){for(var i,s=o(t),a=n(s),r=a.length,l=0;r>l;)if(s[i=a[l++]]===e)return i}},function(t,e,i){var n=i(24)("meta"),o=i(21),s=i(6),a=i(7).f,r=0,l=Object.isExtensible||function(){return!0},u=!i(20)(function(){return l(Object.preventExtensions({}))}),c=function(t){a(t,n,{value:{i:"O"+ ++r,w:{}}})},d=function(t,e){if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!s(t,n)){if(!l(t))return"F";if(!e)return"E";c(t)}return t[n].i},f=function(t,e){if(!s(t,n)){if(!l(t))return!0;if(!e)return!1;c(t)}return t[n].w},h=function(t){return u&&p.NEED&&l(t)&&!s(t,n)&&c(t),t},p=t.exports={KEY:n,NEED:!1,fastKey:d,getWeak:f,onFreeze:h}},function(t,e,i){var n=i(7),o=i(19),s=i(22);t.exports=i(5)?Object.defineProperties:function(t,e){o(t);for(var i,a=s(e),r=a.length,l=0;r>l;)n.f(t,i=a[l++],e[i]);return t}},function(t,e,i){var n=i(34),o=i(23),s=i(8),a=i(39),r=i(6),l=i(54),u=Object.getOwnPropertyDescriptor;e.f=i(5)?u:function(t,e){if(t=s(t),e=a(e,!0),l)try{return u(t,e)}catch(t){}if(r(t,e))return o(!n.f.call(t,e),t[e])}},function(t,e,i){var n=i(8),o=i(57).f,s={}.toString,a="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],r=function(t){try{return o(t)}catch(t){return a.slice()}};t.exports.f=function(t){return a&&"[object Window]"==s.call(t)?r(t):o(n(t))}},function(t,e,i){var n=i(6),o=i(155),s=i(36)("IE_PROTO"),a=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),n(t,s)?t[s]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?a:null}},function(t,e,i){var n=i(38),o=i(29);t.exports=function(t){return function(e,i){var s,a,r=String(o(e)),l=n(i),u=r.length;return l<0||l>=u?t?"":void 0:(s=r.charCodeAt(l),s<55296||s>56319||l+1===u||(a=r.charCodeAt(l+1))<56320||a>57343?t?r.charAt(l):s:t?r.slice(l,l+2):(s-55296<<10)+(a-56320)+65536)}}},function(t,e,i){var n=i(38),o=Math.max,s=Math.min;t.exports=function(t,e){return t=n(t),t<0?o(t+e,0):s(t,e)}},function(t,e,i){var n=i(38),o=Math.min;t.exports=function(t){return t>0?o(n(t),9007199254740991):0}},function(t,e,i){var n=i(29);t.exports=function(t){return Object(n(t))}},function(t,e,i){"use strict";var n=i(137),o=i(145),s=i(32),a=i(8);t.exports=i(55)(Array,"Array",function(t,e){this._t=a(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,i=this._i++;return!t||i>=t.length?(this._t=void 0,o(1)):"keys"==e?o(0,i):"values"==e?o(0,t[i]):o(0,[i,t[i]])},"values"),s.Arguments=s.Array,n("keys"),n("values"),n("entries")},function(t,e,i){var n=i(31);n(n.S+n.F*!i(5),"Object",{defineProperty:i(7).f})},function(t,e){},function(t,e,i){"use strict";var n=i(152)(!0);i(55)(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,i=this._i;return i>=e.length?{value:void 0,done:!0}:(t=n(e,i),this._i+=t.length,{value:t,done:!1})})},function(t,e,i){"use strict";var n=i(4),o=i(6),s=i(5),a=i(31),r=i(60),l=i(147).KEY,u=i(20),c=i(37),d=i(35),f=i(24),h=i(10),p=i(41),v=i(40),g=i(146),m=i(140),b=i(143),_=i(19),y=i(8),w=i(39),x=i(23),k=i(56),C=i(150),S=i(149),O=i(7),D=i(22),T=S.f,E=O.f,$=C.f,P=n.Symbol,M=n.JSON,B=M&&M.stringify,F="prototype",I=h("_hidden"),A=h("toPrimitive"),L={}.propertyIsEnumerable,U=c("symbol-registry"),j=c("symbols"),R=c("op-symbols"),V=Object[F],z="function"==typeof P,N=n.QObject,H=!N||!N[F]||!N[F].findChild,W=s&&u(function(){return 7!=k(E({},"a",{get:function(){return E(this,"a",{value:7}).a}})).a})?function(t,e,i){var n=T(V,e);n&&delete V[e],E(t,e,i),n&&t!==V&&E(V,e,n)}:E,q=function(t){var e=j[t]=k(P[F]);return e._k=t,e},Y=z&&"symbol"==typeof P.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof P},X=function(t,e,i){return t===V&&X(R,e,i),_(t),e=w(e,!0),_(i),o(j,e)?(i.enumerable?(o(t,I)&&t[I][e]&&(t[I][e]=!1),i=k(i,{enumerable:x(0,!1)})):(o(t,I)||E(t,I,x(1,{})),t[I][e]=!0),W(t,e,i)):E(t,e,i)},K=function(t,e){_(t);for(var i,n=m(e=y(e)),o=0,s=n.length;s>o;)X(t,i=n[o++],e[i]);return t},G=function(t,e){return void 0===e?k(t):K(k(t),e)},J=function(t){var e=L.call(this,t=w(t,!0));return!(this===V&&o(j,t)&&!o(R,t))&&(!(e||!o(this,t)||!o(j,t)||o(this,I)&&this[I][t])||e)},Q=function(t,e){if(t=y(t),e=w(e,!0),t!==V||!o(j,e)||o(R,e)){var i=T(t,e);return!i||!o(j,e)||o(t,I)&&t[I][e]||(i.enumerable=!0),i}},Z=function(t){for(var e,i=$(y(t)),n=[],s=0;i.length>s;)o(j,e=i[s++])||e==I||e==l||n.push(e);return n},tt=function(t){for(var e,i=t===V,n=$(i?R:y(t)),s=[],a=0;n.length>a;)!o(j,e=n[a++])||i&&!o(V,e)||s.push(j[e]);return s};z||(P=function(){if(this instanceof P)throw TypeError("Symbol is not a constructor!");var t=f(arguments.length>0?arguments[0]:void 0),e=function(i){this===V&&e.call(R,i),o(this,I)&&o(this[I],t)&&(this[I][t]=!1),W(this,t,x(1,i))};return s&&H&&W(V,t,{configurable:!0,set:e}),q(t)},r(P[F],"toString",function(){return this._k}),S.f=Q,O.f=X,i(57).f=C.f=Z,i(34).f=J,i(58).f=tt,s&&!i(33)&&r(V,"propertyIsEnumerable",J,!0),p.f=function(t){return q(h(t))}),a(a.G+a.W+a.F*!z,{Symbol:P});for(var et="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),it=0;et.length>it;)h(et[it++]);for(var et=D(h.store),it=0;et.length>it;)v(et[it++]);a(a.S+a.F*!z,"Symbol",{for:function(t){return o(U,t+="")?U[t]:U[t]=P(t)},keyFor:function(t){if(Y(t))return g(U,t);throw TypeError(t+" is not a symbol!")},useSetter:function(){H=!0},useSimple:function(){H=!1}}),a(a.S+a.F*!z,"Object",{create:G,defineProperty:X,defineProperties:K,getOwnPropertyDescriptor:Q,getOwnPropertyNames:Z,getOwnPropertySymbols:tt}),M&&a(a.S+a.F*(!z||u(function(){var t=P();return"[null]"!=B([t])||"{}"!=B({a:t})||"{}"!=B(Object(t))})),"JSON",{stringify:function(t){if(void 0!==t&&!Y(t)){for(var e,i,n=[t],o=1;arguments.length>o;)n.push(arguments[o++]);return e=n[1],"function"==typeof e&&(i=e),!i&&b(e)||(e=function(t,e){if(i&&(e=i.call(this,t,e)),!Y(e))return e}),n[1]=e,B.apply(M,n)}}}),P[F][A]||i(9)(P[F],A,P[F].valueOf),d(P,"Symbol"),d(Math,"Math",!0),d(n.JSON,"JSON",!0)},function(t,e,i){i(40)("asyncIterator")},function(t,e,i){i(40)("observable")},function(t,e,i){i(156);for(var n=i(4),o=i(9),s=i(32),a=i(10)("toStringTag"),r=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],l=0;l<5;l++){var u=r[l],c=n[u],d=c&&c.prototype;d&&!d[a]&&o(d,a,u),s[u]=s.Array}},function(t,e,i){"use strict";function n(t){if(null===t||void 0===t)throw new TypeError("Sources cannot be null or undefined");return Object(t)}function o(t,e,i){var n=e[i];if(void 0!==n&&null!==n){if(r.call(t,i)&&(void 0===t[i]||null===t[i]))throw new TypeError("Cannot convert undefined or null to object ("+i+")");r.call(t,i)&&a(n)?t[i]=s(Object(t[i]),e[i]):t[i]=n}}function s(t,e){if(t===e)return t;e=Object(e);for(var i in e)r.call(e,i)&&o(t,e,i);if(Object.getOwnPropertySymbols)for(var n=Object.getOwnPropertySymbols(e),s=0;s<n.length;s++)l.call(e,n[s])&&o(t,e,n[s]);return t}var a=i(205),r=Object.prototype.hasOwnProperty,l=Object.prototype.propertyIsEnumerable;t.exports=function(t){t=n(t);for(var e=1;e<arguments.length;e++)s(t,arguments[e]);return t}},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e,i){"use strict";t.exports=function(t){var e=typeof t;return null!==t&&("object"===e||"function"===e)}},function(t,e,i){(function(e){function i(t,e,i){function o(e){var i=v,n=g;return v=g=void 0,C=e,b=t.apply(n,i)}function s(t){return C=t,_=setTimeout(c,e),S?o(t):b}function l(t){var i=t-k,n=t-C,o=e-i;return O?w(o,m-n):o}function u(t){var i=t-k,n=t-C;return void 0===k||i>=e||i<0||O&&n>=m}function c(){var t=x();return u(t)?d(t):void(_=setTimeout(c,l(t)))}function d(t){return _=void 0,D&&v?o(t):(v=g=void 0,b)}function f(){void 0!==_&&clearTimeout(_),C=0,v=k=g=_=void 0}function h(){return void 0===_?b:d(x())}function p(){var t=x(),i=u(t);if(v=arguments,g=this,k=t,i){if(void 0===_)return s(k);if(O)return _=setTimeout(c,e),o(k)}return void 0===_&&(_=setTimeout(c,e)),b}var v,g,m,b,_,k,C=0,S=!1,O=!1,D=!0;if("function"!=typeof t)throw new TypeError(r);return e=a(e)||0,n(i)&&(S=!!i.leading,O="maxWait"in i,m=O?y(a(i.maxWait)||0,e):m,D="trailing"in i?!!i.trailing:D),p.cancel=f,p.flush=h,p}function n(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function o(t){return!!t&&"object"==typeof t}function s(t){return"symbol"==typeof t||o(t)&&_.call(t)==u}function a(t){if("number"==typeof t)return t;if(s(t))return l;if(n(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=n(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(c,"");var i=f.test(t);return i||h.test(t)?p(t.slice(2),i?2:8):d.test(t)?l:+t}var r="Expected a function",l=NaN,u="[object Symbol]",c=/^\s+|\s+$/g,d=/^[-+]0x[0-9a-f]+$/i,f=/^0b[01]+$/i,h=/^0o[0-7]+$/i,p=parseInt,v="object"==typeof e&&e&&e.Object===Object&&e,g="object"==typeof self&&self&&self.Object===Object&&self,m=v||g||Function("return this")(),b=Object.prototype,_=b.toString,y=Math.max,w=Math.min,x=function(){return m.Date.now()};t.exports=i}).call(e,i(255))},function(t,e,i){var n,o,s;/*! tether-tooltip 1.1.0 */
!function(a,r){o=[i(62),i(63)],n=r,s="function"==typeof n?n.apply(e,o):n,!(void 0!==s&&(t.exports=s))}(this,function(t,e){"use strict";function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var n=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),o=e.Utils.extend,s=t.createContext({classPrefix:"tooltip"}),a={position:"top center",openOn:"hover",classes:"tooltip-theme-arrows",constrainToWindow:!0,constrainToScrollParent:!1},r=0,l=function(){function t(e){if(i(this,t),this.options=e,!this.options.target)throw new Error("Tooltip Error: You must provide a target for Tooltip to attach to");var n=this.options.target.getAttribute("data-tooltip-position");n&&"undefined"==typeof this.options.position&&(this.options.position=n);var l=this.options.target.getAttribute("data-tooltip");if(l&&"undefined"==typeof this.options.content){var u=document.createElement("div");u.innerHTML=l,u.setAttribute("role","tooltip"),u.id="drop-tooltip-"+r,this.options.target.setAttribute("aria-describedby",u.id),r+=1,this.options.content=u}if(!this.options.content)throw new Error("Tooltip Error: You must provide content for Tooltip to display");this.options=o({},a,this.options),this.drop=new s(this.options)}return n(t,[{key:"close",value:function(){this.drop.close()}},{key:"open",value:function(){this.drop.open()}},{key:"toggle",value:function(){this.drop.toggle()}},{key:"remove",value:function(){this.drop.remove()}},{key:"destroy",value:function(){this.drop.destroy()}},{key:"position",value:function(){this.drop.position()}}]),t}(),u=[];return l.init=function(){for(var t=document.querySelectorAll("[data-tooltip]"),e=t.length,i=0;i<e;++i){var n=t[i];u.indexOf(n)===-1&&(new l({target:n}),u.push(n))}},document.addEventListener("DOMContentLoaded",function(){l.autoinit!==!1&&l.init()}),l})},function(t,e,i){i(184);var n=i(0)(i(88),i(234),null,null);t.exports=n.exports},function(t,e,i){i(168);var n=i(0)(i(91),i(218),null,null);t.exports=n.exports},function(t,e,i){i(175);var n=i(0)(i(92),i(225),null,null);t.exports=n.exports},function(t,e,i){i(188);var n=i(0)(i(93),i(238),null,null);t.exports=n.exports},function(t,e,i){i(191);var n=i(0)(i(105),i(241),null,null);t.exports=n.exports},function(t,e,i){i(177);var n=i(0)(i(115),i(227),null,null);t.exports=n.exports},function(t,e,i){i(178);var n=i(0)(i(121),i(228),null,null);t.exports=n.exports},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("transition",{attrs:{name:"ui-alert--transition-toggle"}},[t._c("div",{staticClass:"ui-alert",class:t.classes,attrs:{role:"alert"}},[t._c("div",{staticClass:"ui-alert__body"},[t.removeIcon?t._e():t._c("div",{staticClass:"ui-alert__icon"},[t._t("icon",["info"===t.type?t._c("ui-icon",[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[t._c("path",{attrs:{d:"M12.984 9V6.984h-1.97V9h1.97zm0 8.016v-6h-1.97v6h1.97zm-.984-15c5.53 0 9.984 4.453 9.984 9.984S17.53 21.984 12 21.984 2.016 17.53 2.016 12 6.47 2.016 12 2.016z"}})])]):t._e(),t._v(" "),"success"===t.type?t._c("ui-icon",[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[t._c("path",{attrs:{d:"M9.984 17.016l9-9-1.406-1.453-7.594 7.594-3.563-3.563L5.016 12zm2.016-15c5.53 0 9.984 4.453 9.984 9.984S17.53 21.984 12 21.984 2.016 17.53 2.016 12 6.47 2.016 12 2.016z"}})])]):t._e(),t._v(" "),"warning"===t.type?t._c("ui-icon",[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[t._c("path",{attrs:{d:"M12.984 14.016v-4.03h-1.97v4.03h1.97zm0 3.984v-2.016h-1.97V18h1.97zm-12 3L12 2.016 23.016 21H.986z"}})])]):t._e(),t._v(" "),"error"===t.type?t._c("ui-icon",[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[t._c("path",{attrs:{d:"M12.984 12.984v-6h-1.97v6h1.97zm0 4.032V15h-1.97v2.016h1.97zm-.984-15c5.53 0 9.984 4.453 9.984 9.984S17.53 21.984 12 21.984 2.016 17.53 2.016 12 6.47 2.016 12 2.016z"}})])]):t._e()])],2),t._v(" "),t._c("div",{staticClass:"ui-alert__content"},[t._t("default")],2),t._v(" "),t._c("div",{staticClass:"ui-alert__dismiss-button"},[t.dismissible?t._c("ui-close-button",{attrs:{size:"small"},on:{click:t.dismissAlert}}):t._e()],1)])])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-autocomplete",class:t.classes},[t.icon||t.$slots.icon?t._c("div",{staticClass:"ui-autocomplete__icon-wrapper"},[t._t("icon",[t._c("ui-icon",{attrs:{icon:t.icon}})])],2):t._e(),t._v(" "),t._c("div",{staticClass:"ui-autocomplete__content"},[t._c("label",{staticClass:"ui-autocomplete__label"},[t.label||t.$slots.default?t._c("div",{staticClass:"ui-autocomplete__label-text",class:t.labelClasses},[t._t("default",[t._v(t._s(t.label))])],2):t._e(),t._v(" "),t._c("ui-icon",{directives:[{name:"show",rawName:"v-show",value:!t.disabled&&t.value.length,expression:"!disabled && value.length"}],staticClass:"ui-autocomplete__clear-button",attrs:{title:"Clear"},nativeOn:{click:function(e){t.updateValue("")}}},[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[t._c("path",{attrs:{d:"M18.984 6.422L13.406 12l5.578 5.578-1.406 1.406L12 13.406l-5.578 5.578-1.406-1.406L10.594 12 5.016 6.422l1.406-1.406L12 10.594l5.578-5.578z"}})])]),t._v(" "),t._c("input",{directives:[{name:"autofocus",rawName:"v-autofocus",value:t.autofocus,expression:"autofocus"}],ref:"input",staticClass:"ui-autocomplete__input",attrs:{autocomplete:"off",disabled:t.disabled,name:t.name,placeholder:t.hasFloatingLabel?null:t.placeholder,readonly:t.readonly?t.readonly:null},domProps:{value:t.value},on:{blur:t.onBlur,change:t.onChange,focus:t.onFocus,input:function(e){t.updateValue(e.target.value)},keydown:[function(e){t._k(e.keyCode,"down",40)||(e.preventDefault(),t.highlightSuggestion(t.highlightedIndex+1))},function(e){t._k(e.keyCode,"enter",13)||t.selectHighlighted(t.highlightedIndex,e)},function(e){t._k(e.keyCode,"esc",27)||t.closeDropdown(e)},function(e){t._k(e.keyCode,"tab",9)||t.closeDropdown(e)},function(e){t._k(e.keyCode,"up",38)||(e.preventDefault(),t.highlightSuggestion(t.highlightedIndex-1))}]}}),t._v(" "),t._c("ul",{directives:[{name:"show",rawName:"v-show",value:t.showDropdown,expression:"showDropdown"}],staticClass:"ui-autocomplete__suggestions"},t._l(t.matchingSuggestions,function(e,i){return t._c("ui-autocomplete-suggestion",{ref:"suggestions",refInFor:!0,attrs:{highlighted:t.highlightedIndex===i,keys:t.keys,suggestion:e,type:t.type},nativeOn:{click:function(i){t.selectSuggestion(e)}}},[t._t("suggestion",null,{highlighted:t.highlightedIndex===i,index:i,suggestion:e})],2)}))],1),t._v(" "),t.hasFeedback?t._c("div",{staticClass:"ui-autocomplete__feedback"},[t.showError?t._c("div",{staticClass:"ui-autocomplete__feedback-text"},[t._t("error",[t._v(t._s(t.error))])],2):t.showHelp?t._c("div",{staticClass:"ui-autocomplete__feedback-text"},[t._t("help",[t._v(t._s(t.help))])],2):t._e()]):t._e()])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-radio-group",class:t.classes},[t.label||t.$slots.default?t._c("div",{staticClass:"ui-radio-group__label-text"},[t._t("default",[t._v(t._s(t.label))])],2):t._e(),t._v(" "),t._c("div",{staticClass:"ui-radio-group__radios"},t._l(t.options,function(e){return t._c("ui-radio",{directives:[{name:"model",rawName:"v-model",value:t.selectedOptionValue,expression:"selectedOptionValue"}],key:e[t.keys.id],staticClass:"ui-radio-group__radio",class:e[t.keys.class],attrs:{"button-position":t.buttonPosition,checked:t.isOptionCheckedByDefault(e),color:t.color,disabled:t.disabled||e[t.keys.disabled],id:e[t.keys.id],name:t.name,"true-value":e[t.keys.value]||e},domProps:{value:t.selectedOptionValue},on:{blur:t.onBlur,focus:t.onFocus,input:function(e){t.selectedOptionValue=e}}},[t._v(t._s(e[t.keys.label]||e))])})),t._v(" "),t.hasFeedback?t._c("div",{staticClass:"ui-radio-group__feedback"},[t.showError?t._c("div",{staticClass:"ui-radio-group__feedback-text"},[t._t("error",[t._v(t._s(t.error))])],2):t.showHelp?t._c("div",{staticClass:"ui-radio-group__feedback-text"},[t._t("help",[t._v(t._s(t.help))])],2):t._e()]):t._e()])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-calendar-controls"},[t._c("ui-icon-button",{staticClass:"ui-calendar-controls__nav-button",attrs:{icon:"keyboard_arrow_left",type:"secondary",disabled:t.previousMonthDisabled},on:{click:t.goToPreviousMonth}},[t._c("ui-icon",[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[t._c("path",{attrs:{d:"M15.422 16.078l-1.406 1.406-6-6 6-6 1.406 1.406-4.594 4.594z"}})])])],1),t._v(" "),t._c("div",{staticClass:"ui-calendar-controls__month-and-year"},[t._v(t._s(t.monthAndYear))]),t._v(" "),t._c("ui-icon-button",{staticClass:"ui-calendar-controls__nav-button",attrs:{icon:"keyboard_arrow_right",type:"secondary",disabled:t.nextMonthDisabled},on:{click:t.goToNextMonth}},[t._c("ui-icon",[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[t._c("path",{attrs:{d:"M8.578 16.36l4.594-4.595L8.578 7.17l1.406-1.405 6 6-6 6z"}})])])],1)],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-select",class:t.classes},[t.name?t._c("input",{staticClass:"ui-select__hidden-input",attrs:{type:"hidden",name:t.name},domProps:{value:t.submittedValue}}):t._e(),t._v(" "),t.icon||t.$slots.icon?t._c("div",{staticClass:"ui-select__icon-wrapper"},[t._t("icon",[t._c("ui-icon",{attrs:{icon:t.icon}})])],2):t._e(),t._v(" "),t._c("div",{staticClass:"ui-select__content"},[t._c("div",{ref:"label",staticClass:"ui-select__label",attrs:{tabindex:t.disabled?null:"0"},on:{click:t.toggleDropdown,focus:t.onFocus,keydown:[function(e){t._k(e.keyCode,"enter",13)||(e.preventDefault(),t.openDropdown(e))},function(e){t._k(e.keyCode,"space",32)||(e.preventDefault(),t.openDropdown(e))},function(e){t._k(e.keyCode,"tab",9)||t.onBlur(e)}]}},[t.label||t.$slots.default?t._c("div",{staticClass:"ui-select__label-text",class:t.labelClasses},[t._t("default",[t._v(t._s(t.label))])],2):t._e(),t._v(" "),t._c("div",{staticClass:"ui-select__display"},[t._c("div",{staticClass:"ui-select__display-value",class:{"is-placeholder":!t.hasDisplayText}},[t._v("\n                    "+t._s(t.hasDisplayText?t.displayText:t.hasFloatingLabel&&t.isLabelInline?null:t.placeholder)+"\n                ")]),t._v(" "),t._c("ui-icon",{staticClass:"ui-select__dropdown-button"},[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[t._c("path",{attrs:{d:"M6.984 9.984h10.03L12 15z"}})])])],1),t._v(" "),t._c("transition",{attrs:{name:"ui-select--transition-fade"}},[t._c("div",{directives:[{name:"show",rawName:"v-show",value:t.showDropdown,expression:"showDropdown"}],ref:"dropdown",staticClass:"ui-select__dropdown",attrs:{tabindex:"-1"},on:{keydown:[function(e){t._k(e.keyCode,"down",40)||(e.preventDefault(),t.highlightOption(t.highlightedIndex+1))},function(e){t._k(e.keyCode,"enter",13)||(e.preventDefault(),e.stopPropagation(),t.selectHighlighted(t.highlightedIndex,e))},function(e){t._k(e.keyCode,"esc",27)||(e.preventDefault(),t.closeDropdown())},function(e){t._k(e.keyCode,"tab",9)||t.onBlur(e)},function(e){t._k(e.keyCode,"up",38)||(e.preventDefault(),t.highlightOption(t.highlightedIndex-1))}]}},[t.hasSearch?t._c("div",{staticClass:"ui-select__search",on:{click:function(t){t.stopPropagation()},keydown:function(e){t._k(e.keyCode,"space",32)||e.stopPropagation()}}},[t._c("input",{directives:[{name:"model",rawName:"v-model",value:t.query,expression:"query"}],ref:"searchInput",staticClass:"ui-select__search-input",attrs:{autocomplete:"off",type:"text",placeholder:t.searchPlaceholder},domProps:{value:t._s(t.query)},on:{input:function(e){e.target.composing||(t.query=e.target.value)}}}),t._v(" "),t._c("ui-icon",{staticClass:"ui-select__search-icon"},[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[t._c("path",{attrs:{d:"M9.516 14.016c2.484 0 4.5-2.016 4.5-4.5s-2.016-4.5-4.5-4.5-4.5 2.016-4.5 4.5 2.016 4.5 4.5 4.5zm6 0l4.97 4.97-1.5 1.5-4.97-4.97v-.797l-.28-.282c-1.126.984-2.626 1.547-4.22 1.547-3.61 0-6.516-2.86-6.516-6.47S5.906 3 9.516 3s6.47 2.906 6.47 6.516c0 1.594-.564 3.094-1.548 4.22l.28.28h.798z"}})])]),t._v(" "),t._c("ui-progress-circular",{directives:[{name:"show",rawName:"v-show",value:t.loading,expression:"loading"}],staticClass:"ui-select__search-progress",attrs:{size:20,stroke:4}})],1):t._e(),t._v(" "),t._c("ul",{ref:"optionsList",staticClass:"ui-select__options"},[t._l(t.filteredOptions,function(e,i){return t._c("ui-select-option",{ref:"options",refInFor:!0,attrs:{highlighted:t.highlightedIndex===i,keys:t.keys,multiple:t.multiple,option:e,selected:t.isOptionSelected(e),type:t.type},nativeOn:{click:function(n){n.stopPropagation(),t.selectOption(e,i)},mouseover:function(e){e.stopPropagation(),t.highlightOption(i,{autoScroll:!1})}}},[t._t("option",null,{highlighted:t.highlightedIndex===i,index:i,option:e,selected:t.isOptionSelected(e)})],2)}),t._v(" "),t._c("div",{directives:[{name:"show",rawName:"v-show",value:t.hasNoResults,expression:"hasNoResults"}],staticClass:"ui-select__no-results"},[t._t("no-results",[t._v("No results found")])],2)],2)])])],1),t._v(" "),t.hasFeedback?t._c("div",{staticClass:"ui-select__feedback"},[t.showError?t._c("div",{staticClass:"ui-select__feedback-text"},[t._t("error",[t._v(t._s(t.error))])],2):t.showHelp?t._c("div",{staticClass:"ui-select__feedback-text"},[t._t("help",[t._v(t._s(t.help))])],2):t._e()]):t._e()])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-ripple-ink"})},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-calendar",class:t.classes},[t._c("div",{staticClass:"ui-calendar__header"},[t._c("div",{staticClass:"ui-calendar__header-year",class:{"is-active":t.showYearPicker},attrs:{tabindex:"0"},on:{click:function(e){t.showYearPicker=!0},keydown:function(e){t._k(e.keyCode,"enter",13)||(t.showYearPicker=!0)}}},[t._v(t._s(t.headerYear))]),t._v(" "),t._c("div",{staticClass:"ui-calendar__header-details",class:{"is-active":!t.showYearPicker},attrs:{tabindex:"0"},on:{click:function(e){t.showYearPicker=!1},keydown:function(e){t._k(e.keyCode,"enter",13)||(t.showYearPicker=!1)}}},[t._c("span",{staticClass:"ui-calendar__header-day"},[t._v(t._s(t.headerDay)+", ")]),t._v(" "),t._c("span",{staticClass:"ui-calendar__header-date"},[t._v(t._s(t.headerDate))])])]),t._v(" "),t._c("div",{staticClass:"ui-calendar__body"},[t._c("ul",{directives:[{name:"show",rawName:"v-show",value:t.showYearPicker,expression:"showYearPicker"}],ref:"years",staticClass:"ui-calendar__years"},t._l(t.yearRange,function(e){return t.isYearOutOfRange(e)?t._e():t._c("li",{staticClass:"ui-calendar__year",class:t.getYearClasses(e),attrs:{tabindex:"0"},on:{click:function(i){t.selectYear(e)},keydown:function(i){t._k(i.keyCode,"enter",13)||t.selectYear(e)}}},[t._v(t._s(e))])})),t._v(" "),t._c("div",{directives:[{name:"show",rawName:"v-show",value:!t.showYearPicker,expression:"!showYearPicker"}]},[t._c("ui-calendar-controls",{ref:"controls",attrs:{"date-in-view":t.dateInView,lang:t.lang,"max-date":t.maxDate,"min-date":t.minDate},on:{"go-to-date":t.onGoToDate}}),t._v(" "),t._c("ui-calendar-month",{ref:"month",attrs:{"date-filter":t.dateFilter,"date-in-view":t.dateInView,lang:t.lang,"max-date":t.maxDate,"min-date":t.minDate,selected:t.value},on:{change:t.onMonthChange,"date-select":t.onDateSelect}})],1),t._v(" "),t.$slots.footer?t._c("div",{staticClass:"ui-calendar__footer"},[t._t("footer")],2):t._e()])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("label",{staticClass:"ui-radio",class:t.classes,on:{click:t.toggleCheck}},[t._c("div",{staticClass:"ui-radio__input-wrapper"},[t._c("input",{staticClass:"ui-radio__input",attrs:{type:"radio",disabled:t.disabled,name:t.name},domProps:{value:t.trueValue},on:{blur:t.onBlur,change:t.onChange,focus:t.onFocus}}),t._v(" "),t._c("div",{staticClass:"ui-radio__focus-ring"}),t._v(" "),t._c("span",{staticClass:"ui-radio__outer-circle"}),t._v(" "),t._c("span",{staticClass:"ui-radio__inner-circle"})]),t._v(" "),t.label||t.$slots.default?t._c("div",{staticClass:"ui-radio__label-text"},[t._t("default",[t._v(t._s(t.label))])],2):t._e()])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-snackbar-container",class:t.classes},t._l(t.queue,function(e,i){return t._c("ui-snackbar",{directives:[{name:"show",rawName:"v-show",value:e.show,expression:"snackbar.show"}],attrs:{"action-color":e.actionColor,action:e.action,message:e.message,transition:t.transition},on:{"action-click":function(i){t.onActionClick(e)},click:function(i){t.onClick(e)},hide:function(n){t.onHide(e,i)},show:function(i){t.onShow(e)}}},[t.allowHtml?t._c("div",{domProps:{innerHTML:t._s(e.message)}}):t._e()])}))},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("transition",{attrs:{name:t.disableTransition?null:"ui-progress-circular--transition-fade"}},[t._c("div",{staticClass:"ui-progress-circular",class:t.classes,style:{width:t.size+"px",height:t.size+"px"}},["determinate"===t.type?t._c("svg",{staticClass:"ui-progress-circular__determinate",attrs:{role:"progressbar","aria-valuemax":100,"aria-valuemin":0,"aria-valuenow":t.progress,height:t.size,width:t.size}},[t._c("circle",{staticClass:"ui-progress-circular__determinate-path",style:{"stroke-dashoffset":t.strokeDashOffset,"stroke-width":t.calculatedStroke},attrs:{fill:"transparent","stroke-dashoffset":"0",cx:t.size/2,cy:t.size/2,r:t.radius,"stroke-dasharray":t.strokeDashArray}})]):t._c("svg",{staticClass:"ui-progress-circular__indeterminate",attrs:{role:"progressbar",viewBox:"25 25 50 50","aria-valuemax":100,"aria-valuemin":0}},[t._c("circle",{staticClass:"ui-progress-circular__indeterminate-path",attrs:{cx:"50",cy:"50",fill:"none",r:"20","stroke-miterlimit":"10","stroke-width":t.calculatedStroke}})])])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-calendar-month"},[t._c("div",{staticClass:"ui-calendar-month__header"},t._l(t.lang.days.initials,function(e){return t._c("span",[t._v(t._s(e))])})),t._v(" "),t._c("div",{ref:"current",staticClass:"ui-calendar-month__week is-current",class:t.weekClasses,on:{transitionend:t.onTransitionEnd}},t._l(t.currentWeekStartDates,function(e,i){return t._c("ui-calendar-week",{key:i,attrs:{"date-filter":t.dateFilter,"max-date":t.maxDate,"min-date":t.minDate,month:t.currentWeekStartDates[1].getMonth(),selected:t.selected,"week-start":e},on:{"date-select":t.onDateSelect}})})),t._v(" "),t._c("div",{ref:"other",staticClass:"ui-calendar-month__week is-other",class:t.weekClasses},t._l(t.otherWeekStartDates,function(e,i){return t._c("ui-calendar-week",{key:i,attrs:{"max-date":t.maxDate,"min-date":t.minDate,month:t.otherWeekStartDates[1].getMonth(),selected:t.selected,visible:!1,"week-start":e},on:{"date-select":t.onDateSelect}})}))])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-preloader",class:{"is-loading":t.show}},[t._c("div",{staticClass:"ui-preloader__progressbar",attrs:{role:"progressbar","aria-busy":!!t.show&&"true"}})])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("li",{staticClass:"ui-select-option",class:t.classes},[t._t("default",["basic"===t.type?t._c("div",{staticClass:"ui-select-option__basic"},[t._v("\n            "+t._s(t.option[t.keys.label]||t.option)+"\n        ")]):t._e(),t._v(" "),"image"===t.type?t._c("div",{staticClass:"ui-select-option__image"},[t._c("div",{staticClass:"ui-select-option__image-object",style:t.imageStyle}),t._v(" "),t._c("div",{staticClass:"ui-select-option__image-text"},[t._v(t._s(t.option[t.keys.label]))])]):t._e(),t._v(" "),t.multiple?t._c("div",{staticClass:"ui-select-option__checkbox"},[t.selected?t._c("ui-icon",[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[t._c("path",{attrs:{d:"M9.984 17.016l9-9-1.406-1.453-7.594 7.594-3.563-3.563L5.016 12zm9-14.016C20.11 3 21 3.938 21 5.016v13.97C21 20.062 20.11 21 18.984 21H5.014C3.89 21 3 20.064 3 18.986V5.015C3 3.94 3.89 3 5.014 3h13.97z"}})])]):t._c("ui-icon",[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[t._c("path",{attrs:{d:"M18.984 3C20.062 3 21 3.938 21 5.016v13.97C21 20.062 20.062 21 18.984 21H5.014C3.938 21 3 20.064 3 18.986V5.015C3 3.94 3.936 3 5.014 3h13.97zm0 2.016H5.014v13.97h13.97V5.015z"}})])])],1):t._e()])],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("li",{ref:"headerItem",staticClass:"ui-tab-header-item",class:t.classes,attrs:{role:"tab","aria-controls":t.id,"aria-selected":t.active?"true":null,disabled:t.disabled,tabindex:t.active?0:-1}},["icon"===t.type||"icon-and-text"===t.type?t._c("div",{staticClass:"ui-tab-header-item__icon"},[t._t("icon",[t._c("ui-icon",{attrs:{"icon-set":t.iconProps.iconSet,icon:t.icon,"remove-text":t.iconProps.removeText,"use-svg":t.iconProps.useSvg}})])],2):t._e(),t._v(" "),"text"===t.type||"icon-and-text"===t.type?t._c("div",{staticClass:"ui-tab-header-item__text"},[t._v(t._s(t.title))]):t._e(),t._v(" "),t.disableRipple||t.disabled?t._e():t._c("ui-ripple-ink",{attrs:{trigger:"headerItem"}})],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("transition",{attrs:{name:"ui-progress-linear--transition-fade"}},[t._c("div",{staticClass:"ui-progress-linear",class:t.classes},["determinate"===t.type?t._c("div",{staticClass:"ui-progress-linear__progress-bar is-determinate",style:{transform:"scaleX("+t.moderatedProgress/100+")"},attrs:{role:"progressbar","aria-valuemax":100,"aria-valuemin":0,"aria-valuenow":t.moderatedProgress}}):t._c("div",{staticClass:"ui-progress-linear__progress-bar is-indeterminate",attrs:{role:"progressbar","aria-valuemax":100,"aria-valuemin":0}})])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-textbox",class:t.classes},[t.icon||t.$slots.icon?t._c("div",{staticClass:"ui-textbox__icon-wrapper"},[t._t("icon",[t._c("ui-icon",{attrs:{icon:t.icon}})])],2):t._e(),t._v(" "),t._c("div",{staticClass:"ui-textbox__content"},[t._c("label",{staticClass:"ui-textbox__label"},[t.label||t.$slots.default?t._c("div",{staticClass:"ui-textbox__label-text",class:t.labelClasses},[t._t("default",[t._v(t._s(t.label))])],2):t._e(),t._v(" "),t.multiLine?t._c("textarea",{directives:[{name:"autofocus",rawName:"v-autofocus",value:t.autofocus,expression:"autofocus"}],ref:"textarea",staticClass:"ui-textbox__textarea",attrs:{autocomplete:t.autocomplete?t.autocomplete:null,disabled:t.disabled,maxlength:t.enforceMaxlength?t.maxlength:null,name:t.name,placeholder:t.hasFloatingLabel?null:t.placeholder,readonly:t.readonly,required:t.required,rows:t.rows},domProps:{value:t.value},on:{blur:t.onBlur,change:t.onChange,focus:t.onFocus,input:function(e){t.updateValue(e.target.value)},keydown:[function(e){t._k(e.keyCode,"enter",13)||t.onKeydownEnter(e)},t.onKeydown]}},[t._v(t._s(t.value))]):t._c("input",{directives:[{name:"autofocus",rawName:"v-autofocus",value:t.autofocus,expression:"autofocus"}],ref:"input",staticClass:"ui-textbox__input",attrs:{autocomplete:t.autocomplete?t.autocomplete:null,disabled:t.disabled,max:t.maxValue,maxlength:t.enforceMaxlength?t.maxlength:null,min:t.minValue,name:t.name,number:"number"===t.type||null,placeholder:t.hasFloatingLabel?null:t.placeholder,readonly:t.readonly,required:t.required,step:t.stepValue,type:t.type},domProps:{value:t.value},on:{blur:t.onBlur,change:t.onChange,focus:t.onFocus,input:function(e){t.updateValue(e.target.value)},keydown:[function(e){t._k(e.keyCode,"enter",13)||t.onKeydownEnter(e)},t.onKeydown]}})]),t._v(" "),t.hasFeedback||t.maxlength?t._c("div",{staticClass:"ui-textbox__feedback"},[t.showError?t._c("div",{staticClass:"ui-textbox__feedback-text"},[t._t("error",[t._v(t._s(t.error))])],2):t.showHelp?t._c("div",{staticClass:"ui-textbox__feedback-text"},[t._t("help",[t._v(t._s(t.help))])],2):t._e(),t._v(" "),t.maxlength?t._c("div",{staticClass:"ui-textbox__counter"},[t._v("\n                "+t._s(t.value.length+"/"+t.maxlength)+"\n            ")]):t._e()]):t._e()])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{directives:[{name:"show",rawName:"v-show",value:t.show&&t.isActive,expression:"show && isActive"}],staticClass:"ui-tab",attrs:{role:"tabpanel","aria-hidden":t.isActive?null:"true",id:t.id,tabindex:t.isActive?"0":null}},[t._c("div",{staticStyle:{display:"none"}},[t._t("icon")],2),t._v(" "),t._t("default")],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-toolbar",class:t.classes},[t._c("div",{staticClass:"ui-toolbar__left"},[t.removeNavIcon?t._e():t._c("div",{staticClass:"ui-toolbar__nav-icon"},[t._t("icon",[t._c("ui-icon-button",{attrs:{size:"large",type:"secondary",color:t.textColor,icon:t.navIcon},on:{click:t.navIconClick}})])],2),t._v(" "),t.brand||t.$slots.brand?t._c("div",{staticClass:"ui-toolbar__brand"},[t._t("brand",[t._c("div",{staticClass:"ui-toolbar__brand-text"},[t._v(t._s(t.brand))])])],2):t._e()]),t._v(" "),t._c("div",{staticClass:"ui-toolbar__body",class:{"has-brand-divider":t.hasBrandDivider}},[t._t("default",[t.title?t._c("div",{staticClass:"ui-toolbar__title"},[t._v(t._s(t.title))]):t._e()])],2),t._v(" "),t._c("div",{staticClass:"ui-toolbar__right"},[t._t("actions")],2),t._v(" "),t._c("ui-progress-linear",{directives:[{name:"show",rawName:"v-show",value:t.loading,expression:"loading"}],staticClass:"ui-toolbar__progress",attrs:{color:t.progressColor}})],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("transition",{attrs:{name:t.transitionName},on:{"after-enter":t.onEnter,"after-leave":t.onLeave}},[t._c("div",{staticClass:"ui-snackbar",on:{click:t.onClick}},[t._c("div",{staticClass:"ui-snackbar__message"},[t._t("default",[t._v(t._s(t.message))])],2),t._v(" "),t._c("div",{staticClass:"ui-snackbar__action"},[t.action?t._c("ui-button",{staticClass:"ui-snackbar__action-button",attrs:{type:"secondary",color:t.actionColor},on:{click:function(e){e.stopPropagation(),t.onActionClick(e)}}},[t._v(t._s(t.action))]):t._e()],1)])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("li",{staticClass:"ui-autocomplete-suggestion",class:t.classes},[t._t("default",["simple"===t.type?t._c("div",{staticClass:"ui-autocomplete-suggestion__simple"},[t._v("\n            "+t._s(t.suggestion[t.keys.label]||t.suggestion)+"\n        ")]):t._e(),t._v(" "),"image"===t.type?t._c("div",{staticClass:"ui-autocomplete-suggestion__image"},[t._c("div",{staticClass:"ui-autocomplete-suggestion__image-object",style:t.imageStyle}),t._v(" "),t._c("div",{staticClass:"ui-autocomplete-suggestion__image-text"},[t._v(t._s(t.suggestion[t.keys.label]))])]):t._e()])],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("transition",{attrs:{name:t.toggleTransition},on:{"after-enter":t.onEnter,"after-leave":t.onLeave}},[t._c("div",{directives:[{name:"show",rawName:"v-show",value:t.isOpen,expression:"isOpen"}],staticClass:"ui-modal ui-modal__mask",class:t.classes,attrs:{role:t.role}},[t._c("div",{ref:"backdrop",staticClass:"ui-modal__wrapper",class:{"has-dummy-scrollbar":t.preventShift},on:{click:function(e){t.dismissOnBackdrop&&t.closeModal(e)}}},[t._c("div",{ref:"container",staticClass:"ui-modal__container",attrs:{tabindex:"-1"},on:{keydown:function(e){t._k(e.keyCode,"esc",27)||t.dismissOnEsc&&t.closeModal(e)}}},[t.removeHeader?t._e():t._c("div",{staticClass:"ui-modal__header"},[t._t("header",[t._c("h1",{staticClass:"ui-modal__header-text"},[t._v(t._s(t.title))])]),t._v(" "),t._c("div",{staticClass:"ui-modal__close-button"},[t.dismissOnCloseButton&&!t.removeCloseButton&&t.dismissible?t._c("ui-close-button",{on:{click:t.closeModal}}):t._e()],1)],2),t._v(" "),t._c("div",{staticClass:"ui-modal__body"},[t._t("default")],2),t._v(" "),t.hasFooter?t._c("div",{staticClass:"ui-modal__footer"},[t._t("footer")],2):t._e(),t._v(" "),t._c("div",{staticClass:"ui-modal__focus-redirect",attrs:{tabindex:"0"},on:{focus:function(e){e.stopPropagation(),t.redirectFocus(e)}}})])])])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-checkbox-group",class:t.classes},[t.label||t.$slots.default?t._c("div",{staticClass:"ui-checkbox-group__label-text"},[t._t("default",[t._v(t._s(t.label))])],2):t._e(),t._v(" "),t._c("div",{staticClass:"ui-checkbox-group__checkboxes"},t._l(t.options,function(e,i){return t._c("ui-checkbox",{directives:[{name:"model",rawName:"v-model",value:t.checkboxValues[i],expression:"checkboxValues[index]"}],key:e[t.keys.id],staticClass:"ui-checkbox-group__checkbox",class:e[t.keys.class],attrs:{"box-position":t.boxPosition,checked:t.isOptionCheckedByDefault(e),color:t.color,disabled:t.disabled||e[t.keys.disabled],id:e[t.keys.id],name:t.name||e[t.keys.name]},domProps:{value:t.checkboxValues[i]},on:{blur:t.onBlur,change:function(i){t.onChange(arguments,e)},focus:t.onFocus,input:function(e){var n=t.checkboxValues,o=i;Array.isArray(n)?n.splice(o,1,e):t.checkboxValues[i]=e}}},[t._v(t._s(e[t.keys.label]||e))])})),t._v(" "),t.hasFeedback?t._c("div",{staticClass:"ui-checkbox-group__feedback"},[t.showError?t._c("div",{staticClass:"ui-checkbox-group__feedback-text"},[t._t("error",[t._v(t._s(t.error))])],2):t.showHelp?t._c("div",{staticClass:"ui-checkbox-group__feedback-text"},[t._t("help",[t._v(t._s(t.help))])],2):t._e()]):t._e()])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("button",{ref:"button",staticClass:"ui-fab",class:t.classes,attrs:{"aria-label":t.ariaLabel||t.tooltip},on:{click:t.onClick}},[t.icon||t.$slots.default?t._c("div",{staticClass:"ui-fab__icon"},[t._t("default",[t._c("ui-icon",{attrs:{icon:t.icon}})])],2):t._e(),t._v(" "),t._c("span",{staticClass:"ui-fab__focus-ring"}),t._v(" "),t.disableRipple?t._e():t._c("ui-ripple-ink",{attrs:{trigger:"button"}}),t._v(" "),t.tooltip?t._c("ui-tooltip",{attrs:{trigger:"button","open-on":t.openTooltipOn,position:t.tooltipPosition}},[t._v(t._s(t.tooltip))]):t._e()],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-calendar-week"},t._l(t.dates,function(e,i){return t._c("div",{key:i,staticClass:"ui-calendar-week__date",class:t.getDateClasses(e),attrs:{tabindex:t.visible&&!t.isDateDisabled(e)?0:null},on:{click:function(i){t.selectDate(e)},keydown:function(i){t._k(i.keyCode,"enter",13)||t.selectDate(e)}}},[t._v("\n        "+t._s(t.getDayOfMonth(e))+"\n    ")])}))},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-tabs",class:t.classes},[t._c("div",{staticClass:"ui-tabs__header"},[t._c("ul",{
ref:"tabsContainer",staticClass:"ui-tabs__header-items",attrs:{role:"tablist"}},t._l(t.tabs,function(e){return t._c("ui-tab-header-item",{directives:[{name:"show",rawName:"v-show",value:e.show,expression:"tab.show"}],ref:"tabElements",refInFor:!0,attrs:{active:t.activeTabId===e.id,"disable-ripple":t.disableRipple,disabled:e.disabled,"icon-props":e.iconProps,icon:e.icon,id:e.id,show:e.show,title:e.title,type:t.type},nativeOn:{click:function(i){t.selectTab(i,e)},keydown:[function(e){t._k(e.keyCode,"left",37)||t.selectPreviousTab(e)},function(e){t._k(e.keyCode,"right",39)||t.selectNextTab(e)}]}},[e.$slots.icon?t._c("render-vnodes",{attrs:{nodes:e.$slots.icon},slot:"icon"}):t._e()],1)})),t._v(" "),0!=t.tabContainerWidth?t._c("div",{staticClass:"ui-tabs__active-tab-indicator",style:{left:t.indicatorLeft,right:t.indicatorRight}}):t._e()]),t._v(" "),t._c("div",{staticClass:"ui-tabs__body"},[t._t("default")],2)])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("label",{staticClass:"ui-switch",class:t.classes},[t._c("div",{staticClass:"ui-switch__input-wrapper"},[t._c("input",{staticClass:"ui-switch__input",attrs:{type:"checkbox",disabled:t.disabled,name:t.name},domProps:{checked:t.isChecked,value:t.submittedValue},on:{blur:t.onBlur,change:t.onChange,click:t.onClick,focus:t.onFocus}}),t._v(" "),t._m(0),t._v(" "),t._c("div",{staticClass:"ui-switch__track"})]),t._v(" "),t.label||t.$slots.default?t._c("div",{staticClass:"ui-switch__label-text"},[t._t("default",[t._v(t._s(t.label))])],2):t._e()])},staticRenderFns:[function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-switch__thumb"},[t._c("div",{staticClass:"ui-switch__focus-ring"})])}]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("li",{ref:"menuOption",staticClass:"ui-menu-option",class:t.classes,attrs:{role:"menu-item",tabindex:t.isDivider||t.disabled?null:"0"}},[t.isDivider?t._e():t._t("default",[t._c("div",{staticClass:"ui-menu-option__content"},[t.icon?t._c("ui-icon",{staticClass:"ui-menu-option__icon",attrs:{"icon-set":t.iconProps.iconSet,icon:t.icon,"remove-text":t.iconProps.removeText,"use-svg":t.iconProps.useSvg}}):t._e(),t._v(" "),t._c("div",{staticClass:"ui-menu-option__text"},[t._v(t._s(t.label))]),t._v(" "),t.secondaryText?t._c("div",{staticClass:"ui-menu-option__secondary-text"},[t._v("\n                "+t._s(t.secondaryText)+"\n            ")]):t._e()],1)]),t._v(" "),t.disabled||t.isDivider||t.disableRipple?t._e():t._c("ui-ripple-ink",{attrs:{trigger:"menuOption"}})],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("span",{staticClass:"ui-icon",class:[t.iconSet,t.icon],attrs:{"aria-label":t.ariaLabel}},[t.useSvg?t._c("svg",{staticClass:"ui-icon__svg"},[t._c("use",{attrs:{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"#"+t.icon}})]):t._t("default",[t._v(t._s(t.removeText?null:t.icon))])],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("label",{staticClass:"ui-checkbox",class:t.classes},[t._c("input",{staticClass:"ui-checkbox__input",attrs:{type:"checkbox",disabled:t.disabled,name:t.name},domProps:{checked:t.isChecked,value:t.submittedValue},on:{blur:t.onBlur,change:t.onChange,click:t.onClick,focus:t.onFocus}}),t._v(" "),t._m(0),t._v(" "),t.label||t.$slots.default?t._c("div",{staticClass:"ui-checkbox__label-text"},[t._t("default",[t._v(t._s(t.label))])],2):t._e()])},staticRenderFns:[function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-checkbox__checkmark"},[t._c("div",{staticClass:"ui-checkbox__focus-ring"})])}]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("ul",{staticClass:"ui-menu",class:t.classes,attrs:{role:"menu"}},[t._l(t.options,function(e){return t._c("ui-menu-option",{attrs:{"disable-ripple":t.disableRipple,disabled:e[t.keys.disabled],"icon-props":t.iconProps||e[t.keys.iconProps],icon:t.hasIcons?e[t.keys.icon]:null,label:"divider"===e[t.keys.type]?null:e[t.keys.label]||e,"secondary-text":t.hasSecondaryText?e[t.keys.secondaryText]:null,type:e[t.keys.type]},nativeOn:{click:function(i){t.selectOption(e)},keydown:[function(i){t._k(i.keyCode,"enter",13)||(i.preventDefault(),t.selectOption(e))},function(e){t._k(e.keyCode,"esc",27)||t.closeMenu(e)}]}},[t._t("option",null,{option:e})],2)}),t._v(" "),t.containFocus?t._c("div",{staticClass:"ui-menu__focus-redirector",attrs:{tabindex:"0"},on:{focus:t.redirectFocus}}):t._e()],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("button",{ref:"button",staticClass:"ui-close-button",class:t.classes,attrs:{"aria-label":"Close",type:"button",disabled:t.disabled},on:{click:t.onClick}},[t._c("div",{staticClass:"ui-close-button__icon"},[t._c("ui-icon",[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[t._c("path",{attrs:{d:"M18.984 6.422L13.406 12l5.578 5.578-1.406 1.406L12 13.406l-5.578 5.578-1.406-1.406L10.594 12 5.016 6.422l1.406-1.406L12 10.594l5.578-5.578z"}})])])],1),t._v(" "),t._c("span",{staticClass:"ui-close-button__focus-ring"}),t._v(" "),t.disableRipple||t.disabled?t._e():t._c("ui-ripple-ink",{attrs:{trigger:"button"}})],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-datepicker",class:t.classes},[t._c("input",{staticClass:"ui-datepicker__hidden-input",attrs:{type:"hidden",name:t.name},domProps:{value:t.submittedValue}}),t._v(" "),t.icon||t.$slots.icon?t._c("div",{staticClass:"ui-datepicker__icon-wrapper"},[t._t("icon",[t._c("ui-icon",{attrs:{icon:t.icon}})])],2):t._e(),t._v(" "),t._c("div",{staticClass:"ui-datepicker__content"},[t._c("div",{ref:"label",staticClass:"ui-datepicker__label",attrs:{tabindex:t.disabled?null:"0"},on:{click:t.onClick,focus:t.onFocus,keydown:[function(e){t._k(e.keyCode,"enter",13)||(e.preventDefault(),t.openPicker(e))},function(e){t._k(e.keyCode,"space",32)||(e.preventDefault(),t.openPicker(e))},function(e){t._k(e.keyCode,"tab",9)||t.onBlur(e)}]}},[t.label||t.$slots.default?t._c("div",{staticClass:"ui-datepicker__label-text",class:t.labelClasses},[t._t("default",[t._v(t._s(t.label))])],2):t._e(),t._v(" "),t._c("div",{staticClass:"ui-datepicker__display"},[t._c("div",{staticClass:"ui-datepicker__display-value",class:{"is-placeholder":!t.hasDisplayText}},[t._v("\n                    "+t._s(t.hasDisplayText?t.displayText:t.hasFloatingLabel&&t.isLabelInline?null:t.placeholder)+"\n                ")]),t._v(" "),t.usesPopover&&!t.disabled?t._c("ui-icon",{staticClass:"ui-datepicker__dropdown-button"},[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[t._c("path",{attrs:{d:"M6.984 9.984h10.03L12 15z"}})])]):t._e()],1)]),t._v(" "),t.hasFeedback?t._c("div",{staticClass:"ui-datepicker__feedback"},[t.showError?t._c("div",{staticClass:"ui-datepicker__feedback-text"},[t._t("error",[t._v(t._s(t.error))])],2):t.showHelp?t._c("div",{staticClass:"ui-datepicker__feedback-text"},[t._t("help",[t._v(t._s(t.help))])],2):t._e()]):t._e()]),t._v(" "),t.usesModal&&!t.disabled?t._c("ui-modal",{ref:"modal",attrs:{"remove-header":""},on:{close:t.onPickerClose,open:t.onPickerOpen}},[t._c("ui-calendar",{attrs:{color:t.color,"date-filter":t.dateFilter,lang:t.lang,"max-date":t.maxDate,"min-date":t.minDate,orientation:t.orientation,value:t.value},on:{"date-select":t.onDateSelect}},[t._c("div",{staticClass:"ui-datepicker__modal-buttons",slot:"footer"},[t._c("ui-button",{attrs:{type:"secondary",color:t.color},on:{click:function(e){t.$refs.modal.close()}}},[t._v(t._s(t.okButtonText))]),t._v(" "),t._c("ui-button",{attrs:{type:"secondary",color:t.color},on:{click:t.onPickerCancel}},[t._v(t._s(t.cancelButtonText))])],1)])],1):t._e(),t._v(" "),t.usesPopover&&!t.disabled?t._c("ui-popover",{ref:"popover",attrs:{"contain-focus":"",trigger:"label"},on:{close:t.onPickerClose,open:t.onPickerOpen}},[t._c("ui-calendar",{attrs:{color:t.color,"date-filter":t.dateFilter,lang:t.lang,"max-date":t.maxDate,"min-date":t.minDate,orientation:t.orientation,value:t.value},on:{"date-select":t.onDateSelect}})],1):t._e()],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("label",{ref:"label",staticClass:"ui-fileupload",class:t.classes},[t._c("input",{ref:"input",staticClass:"ui-fileupload__input",attrs:{type:"file",accept:t.accept,disabled:t.disabled,multiple:t.multiple,name:t.name,required:t.required},on:{blur:t.onBlur,change:t.onChange,focus:t.onFocus}}),t._v(" "),t._c("div",{staticClass:"ui-fileupload__content"},[t._c("div",{staticClass:"ui-fileupload__icon"},[t._t("icon",[t._c("ui-icon",[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[t._c("path",{attrs:{d:"M5.016 18h13.969v2.016H5.016V18zM9 15.984v-6H5.016L12 3l6.984 6.984H15v6H9z"}})])])])],2),t._v(" "),t.hasSelection?t._c("span",{staticClass:"ui-fileupload__display-text"},[t._v(t._s(t.displayText))]):t._t("default",[t._v(t._s(t.placeholder))])],2),t._v(" "),t._c("div",{staticClass:"ui-fileupload__focus-ring",style:t.focusRingStyle}),t._v(" "),t.disableRipple||t.disabled?t._e():t._c("ui-ripple-ink",{attrs:{trigger:"label"}})],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("button",{ref:"button",staticClass:"ui-icon-button",class:t.classes,attrs:{"aria-label":t.ariaLabel||t.tooltip,disabled:t.disabled||t.loading,type:t.buttonType},on:{click:t.onClick}},[t.icon||t.$slots.default?t._c("div",{staticClass:"ui-icon-button__icon"},[t._t("default",[t._c("ui-icon",{attrs:{icon:t.icon}})])],2):t._e(),t._v(" "),t._c("div",{staticClass:"ui-icon-button__focus-ring"}),t._v(" "),t._c("ui-progress-circular",{directives:[{name:"show",rawName:"v-show",value:t.loading,expression:"loading"}],staticClass:"ui-icon-button__progress",attrs:{color:t.progressColor,size:"large"===t.size?24:18,stroke:4.5}}),t._v(" "),t.disableRipple||t.disabled?t._e():t._c("ui-ripple-ink",{attrs:{trigger:"button"}}),t._v(" "),t.hasDropdown?t._c("ui-popover",{ref:"dropdown",attrs:{trigger:"button","dropdown-position":t.dropdownPosition,"open-on":t.openDropdownOn},on:{close:t.onDropdownClose,open:t.onDropdownOpen}},[t._t("dropdown")],2):t._e(),t._v(" "),t.tooltip?t._c("ui-tooltip",{attrs:{trigger:"button","open-on":t.openTooltipOn,position:t.tooltipPosition}},[t._v(t._s(t.tooltip))]):t._e()],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-slider",class:t.classes,attrs:{role:"slider","aria-valuemax":100,"aria-valuemin":0,"aria-valuenow":t.localValue,tabindex:t.disabled?null:0},on:{blur:t.onBlur,focus:t.onFocus,keydown:[function(e){t._k(e.keyCode,"down",40)||(e.preventDefault(),t.decrementValue(e))},function(e){t._k(e.keyCode,"left",37)||(e.preventDefault(),t.decrementValue(e))},function(e){t._k(e.keyCode,"right",39)||(e.preventDefault(),t.incrementValue(e))},function(e){t._k(e.keyCode,"up",38)||(e.preventDefault(),t.incrementValue(e))}]}},[t.name?t._c("input",{staticClass:"ui-slider__hidden-input",attrs:{type:"hidden",name:t.name},domProps:{value:t.value}}):t._e(),t._v(" "),t.hasIcon?t._c("div",{staticClass:"ui-slider__icon"},[t._t("icon",[t._c("ui-icon",{attrs:{icon:t.icon}})])],2):t._e(),t._v(" "),t._c("div",{ref:"track",staticClass:"ui-slider__track",on:{mousedown:t.onDragStart,touchstart:t.onDragStart}},[t._c("div",{staticClass:"ui-slider__track-background"},t._l(t.snapPoints,function(e){return t.snapToSteps?t._c("span",{staticClass:"ui-slider__snap-point",style:{left:e+"%"}}):t._e()})),t._v(" "),t._c("div",{staticClass:"ui-slider__track-fill",style:t.fillStyle}),t._v(" "),t._c("div",{ref:"thumb",staticClass:"ui-slider__thumb",style:t.thumbStyle},[t.showMarker?t._c("div",{staticClass:"ui-slider__marker"},[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:"36",height:"36"}},[t._c("path",{attrs:{d:"M11 .5c-1.7.2-3.4.9-4.7 2-1.1.9-2 2-2.5 3.2-1.2 2.4-1.2 5.1-.1 7.7 1.1 2.6 2.8 5 5.3 7.5 1.2 1.2 2.8 2.7 3 2.7 0 0 .3-.2.6-.5 3.2-2.7 5.6-5.6 7.1-8.5.8-1.5 1.1-2.6 1.3-3.8.2-1.4 0-2.9-.5-4.3-1.2-3.2-4.1-5.4-7.5-5.8-.5-.2-1.5-.2-2-.2z"}})]),t._v(" "),t._c("span",{staticClass:"ui-slider__marker-text"},[t._v(t._s(t.markerText))])]):t._e()])])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{ref:"tooltip",staticClass:"ui-tooltip"},[t._t("default")],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-collapsible",class:t.classes},[t._c("div",{ref:"header",staticClass:"ui-collapsible__header",attrs:{"aria-controls":t.id,"aria-expanded":t.isOpen?"true":"false",tabindex:t.disabled?null:0},on:{click:t.toggleCollapsible,keydown:[function(e){t._k(e.keyCode,"enter",13)||(e.preventDefault(),t.toggleCollapsible(e))},function(e){t._k(e.keyCode,"space",32)||(e.preventDefault(),t.toggleCollapsible(e))}]}},[t._c("div",{staticClass:"ui-collapsible__header-content"},[t._t("header",[t._v(t._s(t.title))])],2),t._v(" "),t.removeIcon?t._e():t._c("ui-icon",{staticClass:"ui-collapsible__header-icon"},[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[t._c("path",{attrs:{d:"M7.406 7.828L12 12.422l4.594-4.594L18 9.234l-6 6-6-6z"}})])]),t._v(" "),t.disableRipple||t.disabled||!t.isReady?t._e():t._c("ui-ripple-ink",{attrs:{trigger:"header"}})],1),t._v(" "),t._c("transition",{attrs:{name:"ui-collapsible--transition-toggle"},on:{"after-enter":t.onEnter,"after-leave":t.onLeave}},[t._c("div",{directives:[{name:"show",rawName:"v-show",value:t.isOpen,expression:"isOpen"}],ref:"body",staticClass:"ui-collapsible__body-wrapper",style:{height:t.calculatedHeight}},[t._c("div",{staticClass:"ui-collapsible__body",attrs:{"aria-hidden":t.isOpen?null:"true",id:t.id}},[t._t("default")],2)])])],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("button",{ref:"button",staticClass:"ui-button",class:t.classes,attrs:{disabled:t.disabled||t.loading,type:t.buttonType},on:{click:t.onClick,"~focus":function(e){t.onFocus(e)}}},[t._c("div",{staticClass:"ui-button__content"},[t.icon||t.$slots.icon?t._c("div",{staticClass:"ui-button__icon"},[t._t("icon",[t._c("ui-icon",{attrs:{icon:t.icon}})])],2):t._e(),t._v(" "),t._t("default"),t._v(" "),t.hasDropdown&&"right"!==t.iconPosition?t._c("ui-icon",{staticClass:"ui-button__dropdown-icon"},[t._c("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[t._c("path",{attrs:{d:"M6.984 9.984h10.03L12 15z"}})])]):t._e()],2),t._v(" "),t._c("div",{staticClass:"ui-button__focus-ring",style:t.focusRingStyle}),t._v(" "),t._c("ui-progress-circular",{directives:[{name:"show",rawName:"v-show",value:t.loading,expression:"loading"}],staticClass:"ui-button__progress",attrs:{"disable-transition":"",color:t.progressColor,size:18,stroke:4.5}}),t._v(" "),t.disableRipple||t.disabled?t._e():t._c("ui-ripple-ink",{attrs:{trigger:"button"}}),t._v(" "),t.hasDropdown?t._c("ui-popover",{ref:"dropdown",attrs:{trigger:"button","dropdown-position":t.dropdownPosition,"open-on":t.openDropdownOn},on:{close:t.onDropdownClose,open:t.onDropdownOpen}},[t._t("dropdown")],2):t._e()],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-confirm"},[t._c("ui-modal",{ref:"modal",attrs:{role:"alertdialog","dismiss-on":t.dismissOn,dismissible:!t.loading,title:t.title,transition:t.transition},on:{close:t.onModalClose,open:t.onModalOpen}},[t._c("div",{staticClass:"ui-confirm__message"},[t._t("default")],2),t._v(" "),t._c("div",{staticClass:"ui-confirm__footer",slot:"footer"},[t._c("ui-button",{ref:"confirmButton",attrs:{color:t.confirmButtonColor,icon:t.confirmButtonIcon,loading:t.loading},on:{click:t.confirm}},[t._v(t._s(t.confirmButtonText))]),t._v(" "),t._c("ui-button",{ref:"denyButton",attrs:{disabled:t.loading,icon:t.denyButtonIcon},on:{click:t.deny}},[t._v(t._s(t.denyButtonText))])],1)])],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this;t.$createElement;return t._c("div",{staticClass:"ui-popover",class:{"is-raised":t.raised},attrs:{role:"dialog",tabindex:"-1"},on:{keydown:function(e){t._k(e.keyCode,"esc",27)||t.closeDropdown(e)}}},[t._t("default"),t._v(" "),t._c("div",{staticClass:"ui-popover__focus-redirector",attrs:{tabindex:"0"},on:{focus:t.restrictFocus}})],2)},staticRenderFns:[]}},function(t,e){var i;i=function(){return this}();try{i=i||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(i=window)}t.exports=i},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0}),e.UiTooltip=e.UiToolbar=e.UiTextbox=e.UiTabs=e.UiTab=e.UiSwitch=e.UiSnackbarContainer=e.UiSnackbar=e.UiSlider=e.UiSelect=e.UiRippleInk=e.UiRadioGroup=e.UiRadio=e.UiProgressLinear=e.UiProgressCircular=e.UiPreloader=e.UiPopover=e.UiModal=e.UiMenu=e.UiIconButton=e.UiIcon=e.UiFileupload=e.UiFab=e.UiDatepicker=e.UiConfirm=e.UiCollapsible=e.UiCheckboxGroup=e.UiCheckbox=e.UiCalendar=e.UiButton=e.UiAutocomplete=e.UiAlert=void 0,i(65);var o=i(66),s=n(o),a=i(67),r=n(a),l=i(14),u=n(l),c=i(42),d=n(c),f=i(43),h=n(f),p=i(68),v=n(p),g=i(69),m=n(g),b=i(70),_=n(b),y=i(71),w=n(y),x=i(72),k=n(x),C=i(73),S=n(C),O=i(1),D=n(O),T=i(25),E=n(T),$=i(74),P=n($),M=i(26),B=n(M),F=i(15),I=n(F),A=i(75),L=n(A),U=i(16),j=n(U),R=i(44),V=n(R),z=i(45),N=n(z),H=i(76),W=n(H),q=i(3),Y=n(q),X=i(77),K=n(X),G=i(78),J=n(G),Q=i(46),Z=n(Q),tt=i(79),et=n(tt),it=i(80),nt=n(it),ot=i(81),st=n(ot),at=i(82),rt=n(at),lt=i(83),ut=n(lt),ct=i(84),dt=n(ct),ft=i(27),ht=n(ft),pt={UiAlert:s.default,UiAutocomplete:r.default,UiButton:u.default,UiCalendar:d.default,UiCheckbox:h.default,UiCheckboxGroup:v.default,UiCollapsible:m.default,UiConfirm:_.default,UiDatepicker:w.default,UiFab:k.default,UiFileupload:S.default,UiIcon:D.default,UiIconButton:E.default,UiMenu:P.default,UiModal:B.default,UiPopover:I.default,UiPreloader:L.default,UiProgressCircular:j.default,UiProgressLinear:V.default,UiRadio:N.default,UiRadioGroup:W.default,UiRippleInk:Y.default,UiSelect:K.default,UiSlider:J.default,UiSnackbar:Z.default,UiSnackbarContainer:et.default,UiSwitch:nt.default,UiTab:st.default,UiTabs:rt.default,UiTextbox:ut.default,UiToolbar:dt.default,UiTooltip:ht.default,install:function(t){t.component("ui-alert",s.default),t.component("ui-autocomplete",r.default),t.component("ui-button",u.default),t.component("ui-calendar",d.default),t.component("ui-checkbox",h.default),t.component("ui-checkbox-group",v.default),t.component("ui-collapsible",m.default),t.component("ui-confirm",_.default),t.component("ui-datepicker",w.default),t.component("ui-fab",k.default),t.component("ui-fileupload",S.default),t.component("ui-icon",D.default),t.component("ui-icon-button",E.default),t.component("ui-menu",P.default),t.component("ui-modal",B.default),t.component("ui-popover",I.default),t.component("ui-preloader",L.default),t.component("ui-progress-circular",j.default),t.component("ui-progress-linear",V.default),t.component("ui-radio",N.default),t.component("ui-radio-group",W.default),t.component("ui-ripple-ink",Y.default),t.component("ui-select",K.default),t.component("ui-slider",J.default),t.component("ui-snackbar",Z.default),t.component("ui-snackbar-container",et.default),t.component("ui-switch",nt.default),t.component("ui-tab",st.default),t.component("ui-tabs",rt.default),t.component("ui-textbox",ut.default),t.component("ui-toolbar",dt.default),t.component("ui-tooltip",ht.default)}};"undefined"!=typeof window&&window.Vue&&window.Vue.use(pt),e.default=pt,e.UiAlert=s.default,e.UiAutocomplete=r.default,e.UiButton=u.default,e.UiCalendar=d.default,e.UiCheckbox=h.default,e.UiCheckboxGroup=v.default,e.UiCollapsible=m.default,e.UiConfirm=_.default,e.UiDatepicker=w.default,e.UiFab=k.default,e.UiFileupload=S.default,e.UiIcon=D.default,e.UiIconButton=E.default,e.UiMenu=P.default,e.UiModal=B.default,e.UiPopover=I.default,e.UiPreloader=L.default,e.UiProgressCircular=j.default,e.UiProgressLinear=V.default,e.UiRadio=N.default,e.UiRadioGroup=W.default,e.UiRippleInk=Y.default,e.UiSelect=K.default,e.UiSlider=J.default,e.UiSnackbar=Z.default,e.UiSnackbarContainer=et.default,e.UiSwitch=nt.default,e.UiTab=st.default,e.UiTabs=rt.default,e.UiTextbox=ut.default,e.UiToolbar=dt.default,e.UiTooltip=ht.default}])});; var QRCode;!function(){function a(a){this.mode=c.MODE_8BIT_BYTE,this.data=a,this.parsedData=[];for(var b=[],d=0,e=this.data.length;e>d;d++){var f=this.data.charCodeAt(d);f>65536?(b[0]=240|(1835008&f)>>>18,b[1]=128|(258048&f)>>>12,b[2]=128|(4032&f)>>>6,b[3]=128|63&f):f>2048?(b[0]=224|(61440&f)>>>12,b[1]=128|(4032&f)>>>6,b[2]=128|63&f):f>128?(b[0]=192|(1984&f)>>>6,b[1]=128|63&f):b[0]=f,this.parsedData=this.parsedData.concat(b)}this.parsedData.length!=this.data.length&&(this.parsedData.unshift(191),this.parsedData.unshift(187),this.parsedData.unshift(239))}function b(a,b){this.typeNumber=a,this.errorCorrectLevel=b,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}function i(a,b){if(void 0==a.length)throw new Error(a.length+"/"+b);for(var c=0;c<a.length&&0==a[c];)c++;this.num=new Array(a.length-c+b);for(var d=0;d<a.length-c;d++)this.num[d]=a[d+c]}function j(a,b){this.totalCount=a,this.dataCount=b}function k(){this.buffer=[],this.length=0}function m(){return"undefined"!=typeof CanvasRenderingContext2D}function n(){var a=!1,b=navigator.userAgent;return/android/i.test(b)&&(a=!0,aMat=b.toString().match(/android ([0-9]\.[0-9])/i),aMat&&aMat[1]&&(a=parseFloat(aMat[1]))),a}function r(a,b){for(var c=1,e=s(a),f=0,g=l.length;g>=f;f++){var h=0;switch(b){case d.L:h=l[f][0];break;case d.M:h=l[f][1];break;case d.Q:h=l[f][2];break;case d.H:h=l[f][3]}if(h>=e)break;c++}if(c>l.length)throw new Error("Too long data");return c}function s(a){var b=encodeURI(a).toString().replace(/\%[0-9a-fA-F]{2}/g,"a");return b.length+(b.length!=a?3:0)}a.prototype={getLength:function(){return this.parsedData.length},write:function(a){for(var b=0,c=this.parsedData.length;c>b;b++)a.put(this.parsedData[b],8)}},b.prototype={addData:function(b){var c=new a(b);this.dataList.push(c),this.dataCache=null},isDark:function(a,b){if(0>a||this.moduleCount<=a||0>b||this.moduleCount<=b)throw new Error(a+","+b);return this.modules[a][b]},getModuleCount:function(){return this.moduleCount},make:function(){this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(a,c){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var d=0;d<this.moduleCount;d++){this.modules[d]=new Array(this.moduleCount);for(var e=0;e<this.moduleCount;e++)this.modules[d][e]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(a,c),this.typeNumber>=7&&this.setupTypeNumber(a),null==this.dataCache&&(this.dataCache=b.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,c)},setupPositionProbePattern:function(a,b){for(var c=-1;7>=c;c++)if(!(-1>=a+c||this.moduleCount<=a+c))for(var d=-1;7>=d;d++)-1>=b+d||this.moduleCount<=b+d||(this.modules[a+c][b+d]=c>=0&&6>=c&&(0==d||6==d)||d>=0&&6>=d&&(0==c||6==c)||c>=2&&4>=c&&d>=2&&4>=d?!0:!1)},getBestMaskPattern:function(){for(var a=0,b=0,c=0;8>c;c++){this.makeImpl(!0,c);var d=f.getLostPoint(this);(0==c||a>d)&&(a=d,b=c)}return b},createMovieClip:function(a,b,c){var d=a.createEmptyMovieClip(b,c),e=1;this.make();for(var f=0;f<this.modules.length;f++)for(var g=f*e,h=0;h<this.modules[f].length;h++){var i=h*e,j=this.modules[f][h];j&&(d.beginFill(0,100),d.moveTo(i,g),d.lineTo(i+e,g),d.lineTo(i+e,g+e),d.lineTo(i,g+e),d.endFill())}return d},setupTimingPattern:function(){for(var a=8;a<this.moduleCount-8;a++)null==this.modules[a][6]&&(this.modules[a][6]=0==a%2);for(var b=8;b<this.moduleCount-8;b++)null==this.modules[6][b]&&(this.modules[6][b]=0==b%2)},setupPositionAdjustPattern:function(){for(var a=f.getPatternPosition(this.typeNumber),b=0;b<a.length;b++)for(var c=0;c<a.length;c++){var d=a[b],e=a[c];if(null==this.modules[d][e])for(var g=-2;2>=g;g++)for(var h=-2;2>=h;h++)this.modules[d+g][e+h]=-2==g||2==g||-2==h||2==h||0==g&&0==h?!0:!1}},setupTypeNumber:function(a){for(var b=f.getBCHTypeNumber(this.typeNumber),c=0;18>c;c++){var d=!a&&1==(1&b>>c);this.modules[Math.floor(c/3)][c%3+this.moduleCount-8-3]=d}for(var c=0;18>c;c++){var d=!a&&1==(1&b>>c);this.modules[c%3+this.moduleCount-8-3][Math.floor(c/3)]=d}},setupTypeInfo:function(a,b){for(var c=this.errorCorrectLevel<<3|b,d=f.getBCHTypeInfo(c),e=0;15>e;e++){var g=!a&&1==(1&d>>e);6>e?this.modules[e][8]=g:8>e?this.modules[e+1][8]=g:this.modules[this.moduleCount-15+e][8]=g}for(var e=0;15>e;e++){var g=!a&&1==(1&d>>e);8>e?this.modules[8][this.moduleCount-e-1]=g:9>e?this.modules[8][15-e-1+1]=g:this.modules[8][15-e-1]=g}this.modules[this.moduleCount-8][8]=!a},mapData:function(a,b){for(var c=-1,d=this.moduleCount-1,e=7,g=0,h=this.moduleCount-1;h>0;h-=2)for(6==h&&h--;;){for(var i=0;2>i;i++)if(null==this.modules[d][h-i]){var j=!1;g<a.length&&(j=1==(1&a[g]>>>e));var k=f.getMask(b,d,h-i);k&&(j=!j),this.modules[d][h-i]=j,e--,-1==e&&(g++,e=7)}if(d+=c,0>d||this.moduleCount<=d){d-=c,c=-c;break}}}},b.PAD0=236,b.PAD1=17,b.createData=function(a,c,d){for(var e=j.getRSBlocks(a,c),g=new k,h=0;h<d.length;h++){var i=d[h];g.put(i.mode,4),g.put(i.getLength(),f.getLengthInBits(i.mode,a)),i.write(g)}for(var l=0,h=0;h<e.length;h++)l+=e[h].dataCount;if(g.getLengthInBits()>8*l)throw new Error("code length overflow. ("+g.getLengthInBits()+">"+8*l+")");for(g.getLengthInBits()+4<=8*l&&g.put(0,4);0!=g.getLengthInBits()%8;)g.putBit(!1);for(;;){if(g.getLengthInBits()>=8*l)break;if(g.put(b.PAD0,8),g.getLengthInBits()>=8*l)break;g.put(b.PAD1,8)}return b.createBytes(g,e)},b.createBytes=function(a,b){for(var c=0,d=0,e=0,g=new Array(b.length),h=new Array(b.length),j=0;j<b.length;j++){var k=b[j].dataCount,l=b[j].totalCount-k;d=Math.max(d,k),e=Math.max(e,l),g[j]=new Array(k);for(var m=0;m<g[j].length;m++)g[j][m]=255&a.buffer[m+c];c+=k;var n=f.getErrorCorrectPolynomial(l),o=new i(g[j],n.getLength()-1),p=o.mod(n);h[j]=new Array(n.getLength()-1);for(var m=0;m<h[j].length;m++){var q=m+p.getLength()-h[j].length;h[j][m]=q>=0?p.get(q):0}}for(var r=0,m=0;m<b.length;m++)r+=b[m].totalCount;for(var s=new Array(r),t=0,m=0;d>m;m++)for(var j=0;j<b.length;j++)m<g[j].length&&(s[t++]=g[j][m]);for(var m=0;e>m;m++)for(var j=0;j<b.length;j++)m<h[j].length&&(s[t++]=h[j][m]);return s};for(var c={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},d={L:1,M:0,Q:3,H:2},e={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},f={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(a){for(var b=a<<10;f.getBCHDigit(b)-f.getBCHDigit(f.G15)>=0;)b^=f.G15<<f.getBCHDigit(b)-f.getBCHDigit(f.G15);return(a<<10|b)^f.G15_MASK},getBCHTypeNumber:function(a){for(var b=a<<12;f.getBCHDigit(b)-f.getBCHDigit(f.G18)>=0;)b^=f.G18<<f.getBCHDigit(b)-f.getBCHDigit(f.G18);return a<<12|b},getBCHDigit:function(a){for(var b=0;0!=a;)b++,a>>>=1;return b},getPatternPosition:function(a){return f.PATTERN_POSITION_TABLE[a-1]},getMask:function(a,b,c){switch(a){case e.PATTERN000:return 0==(b+c)%2;case e.PATTERN001:return 0==b%2;case e.PATTERN010:return 0==c%3;case e.PATTERN011:return 0==(b+c)%3;case e.PATTERN100:return 0==(Math.floor(b/2)+Math.floor(c/3))%2;case e.PATTERN101:return 0==b*c%2+b*c%3;case e.PATTERN110:return 0==(b*c%2+b*c%3)%2;case e.PATTERN111:return 0==(b*c%3+(b+c)%2)%2;default:throw new Error("bad maskPattern:"+a)}},getErrorCorrectPolynomial:function(a){for(var b=new i([1],0),c=0;a>c;c++)b=b.multiply(new i([1,g.gexp(c)],0));return b},getLengthInBits:function(a,b){if(b>=1&&10>b)switch(a){case c.MODE_NUMBER:return 10;case c.MODE_ALPHA_NUM:return 9;case c.MODE_8BIT_BYTE:return 8;case c.MODE_KANJI:return 8;default:throw new Error("mode:"+a)}else if(27>b)switch(a){case c.MODE_NUMBER:return 12;case c.MODE_ALPHA_NUM:return 11;case c.MODE_8BIT_BYTE:return 16;case c.MODE_KANJI:return 10;default:throw new Error("mode:"+a)}else{if(!(41>b))throw new Error("type:"+b);switch(a){case c.MODE_NUMBER:return 14;case c.MODE_ALPHA_NUM:return 13;case c.MODE_8BIT_BYTE:return 16;case c.MODE_KANJI:return 12;default:throw new Error("mode:"+a)}}},getLostPoint:function(a){for(var b=a.getModuleCount(),c=0,d=0;b>d;d++)for(var e=0;b>e;e++){for(var f=0,g=a.isDark(d,e),h=-1;1>=h;h++)if(!(0>d+h||d+h>=b))for(var i=-1;1>=i;i++)0>e+i||e+i>=b||(0!=h||0!=i)&&g==a.isDark(d+h,e+i)&&f++;f>5&&(c+=3+f-5)}for(var d=0;b-1>d;d++)for(var e=0;b-1>e;e++){var j=0;a.isDark(d,e)&&j++,a.isDark(d+1,e)&&j++,a.isDark(d,e+1)&&j++,a.isDark(d+1,e+1)&&j++,(0==j||4==j)&&(c+=3)}for(var d=0;b>d;d++)for(var e=0;b-6>e;e++)a.isDark(d,e)&&!a.isDark(d,e+1)&&a.isDark(d,e+2)&&a.isDark(d,e+3)&&a.isDark(d,e+4)&&!a.isDark(d,e+5)&&a.isDark(d,e+6)&&(c+=40);for(var e=0;b>e;e++)for(var d=0;b-6>d;d++)a.isDark(d,e)&&!a.isDark(d+1,e)&&a.isDark(d+2,e)&&a.isDark(d+3,e)&&a.isDark(d+4,e)&&!a.isDark(d+5,e)&&a.isDark(d+6,e)&&(c+=40);for(var k=0,e=0;b>e;e++)for(var d=0;b>d;d++)a.isDark(d,e)&&k++;var l=Math.abs(100*k/b/b-50)/5;return c+=10*l}},g={glog:function(a){if(1>a)throw new Error("glog("+a+")");return g.LOG_TABLE[a]},gexp:function(a){for(;0>a;)a+=255;for(;a>=256;)a-=255;return g.EXP_TABLE[a]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},h=0;8>h;h++)g.EXP_TABLE[h]=1<<h;for(var h=8;256>h;h++)g.EXP_TABLE[h]=g.EXP_TABLE[h-4]^g.EXP_TABLE[h-5]^g.EXP_TABLE[h-6]^g.EXP_TABLE[h-8];for(var h=0;255>h;h++)g.LOG_TABLE[g.EXP_TABLE[h]]=h;i.prototype={get:function(a){return this.num[a]},getLength:function(){return this.num.length},multiply:function(a){for(var b=new Array(this.getLength()+a.getLength()-1),c=0;c<this.getLength();c++)for(var d=0;d<a.getLength();d++)b[c+d]^=g.gexp(g.glog(this.get(c))+g.glog(a.get(d)));return new i(b,0)},mod:function(a){if(this.getLength()-a.getLength()<0)return this;for(var b=g.glog(this.get(0))-g.glog(a.get(0)),c=new Array(this.getLength()),d=0;d<this.getLength();d++)c[d]=this.get(d);for(var d=0;d<a.getLength();d++)c[d]^=g.gexp(g.glog(a.get(d))+b);return new i(c,0).mod(a)}},j.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],j.getRSBlocks=function(a,b){var c=j.getRsBlockTable(a,b);if(void 0==c)throw new Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+b);for(var d=c.length/3,e=[],f=0;d>f;f++)for(var g=c[3*f+0],h=c[3*f+1],i=c[3*f+2],k=0;g>k;k++)e.push(new j(h,i));return e},j.getRsBlockTable=function(a,b){switch(b){case d.L:return j.RS_BLOCK_TABLE[4*(a-1)+0];case d.M:return j.RS_BLOCK_TABLE[4*(a-1)+1];case d.Q:return j.RS_BLOCK_TABLE[4*(a-1)+2];case d.H:return j.RS_BLOCK_TABLE[4*(a-1)+3];default:return void 0}},k.prototype={get:function(a){var b=Math.floor(a/8);return 1==(1&this.buffer[b]>>>7-a%8)},put:function(a,b){for(var c=0;b>c;c++)this.putBit(1==(1&a>>>b-c-1))},getLengthInBits:function(){return this.length},putBit:function(a){var b=Math.floor(this.length/8);this.buffer.length<=b&&this.buffer.push(0),a&&(this.buffer[b]|=128>>>this.length%8),this.length++}};var l=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]],o=function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){function g(a,b){var c=document.createElementNS("http://www.w3.org/2000/svg",a);for(var d in b)b.hasOwnProperty(d)&&c.setAttribute(d,b[d]);return c}var b=this._htOption,c=this._el,d=a.getModuleCount();Math.floor(b.width/d),Math.floor(b.height/d),this.clear();var h=g("svg",{viewBox:"0 0 "+String(d)+" "+String(d),width:"100%",height:"100%",fill:b.colorLight});h.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),c.appendChild(h),h.appendChild(g("rect",{fill:b.colorDark,width:"1",height:"1",id:"template"}));for(var i=0;d>i;i++)for(var j=0;d>j;j++)if(a.isDark(i,j)){var k=g("use",{x:String(i),y:String(j)});k.setAttributeNS("http://www.w3.org/1999/xlink","href","#template"),h.appendChild(k)}},a.prototype.clear=function(){for(;this._el.hasChildNodes();)this._el.removeChild(this._el.lastChild)},a}(),p="svg"===document.documentElement.tagName.toLowerCase(),q=p?o:m()?function(){function a(){this._elImage.src=this._elCanvas.toDataURL("image/png"),this._elImage.style.display="block",this._elCanvas.style.display="none"}function d(a,b){var c=this;if(c._fFail=b,c._fSuccess=a,null===c._bSupportDataURI){var d=document.createElement("img"),e=function(){c._bSupportDataURI=!1,c._fFail&&_fFail.call(c)},f=function(){c._bSupportDataURI=!0,c._fSuccess&&c._fSuccess.call(c)};return d.onabort=e,d.onerror=e,d.onload=f,d.src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",void 0}c._bSupportDataURI===!0&&c._fSuccess?c._fSuccess.call(c):c._bSupportDataURI===!1&&c._fFail&&c._fFail.call(c)}if(this._android&&this._android<=2.1){var b=1/window.devicePixelRatio,c=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(a,d,e,f,g,h,i,j){if("nodeName"in a&&/img/i.test(a.nodeName))for(var l=arguments.length-1;l>=1;l--)arguments[l]=arguments[l]*b;else"undefined"==typeof j&&(arguments[1]*=b,arguments[2]*=b,arguments[3]*=b,arguments[4]*=b);c.apply(this,arguments)}}var e=function(a,b){this._bIsPainted=!1,this._android=n(),this._htOption=b,this._elCanvas=document.createElement("canvas"),this._elCanvas.width=b.width,this._elCanvas.height=b.height,a.appendChild(this._elCanvas),this._el=a,this._oContext=this._elCanvas.getContext("2d"),this._bIsPainted=!1,this._elImage=document.createElement("img"),this._elImage.style.display="none",this._el.appendChild(this._elImage),this._bSupportDataURI=null};return e.prototype.draw=function(a){var b=this._elImage,c=this._oContext,d=this._htOption,e=a.getModuleCount(),f=d.width/e,g=d.height/e,h=Math.round(f),i=Math.round(g);b.style.display="none",this.clear();for(var j=0;e>j;j++)for(var k=0;e>k;k++){var l=a.isDark(j,k),m=k*f,n=j*g;c.strokeStyle=l?d.colorDark:d.colorLight,c.lineWidth=1,c.fillStyle=l?d.colorDark:d.colorLight,c.fillRect(m,n,f,g),c.strokeRect(Math.floor(m)+.5,Math.floor(n)+.5,h,i),c.strokeRect(Math.ceil(m)-.5,Math.ceil(n)-.5,h,i)}this._bIsPainted=!0},e.prototype.makeImage=function(){this._bIsPainted&&d.call(this,a)},e.prototype.isPainted=function(){return this._bIsPainted},e.prototype.clear=function(){this._oContext.clearRect(0,0,this._elCanvas.width,this._elCanvas.height),this._bIsPainted=!1},e.prototype.round=function(a){return a?Math.floor(1e3*a)/1e3:a},e}():function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){for(var b=this._htOption,c=this._el,d=a.getModuleCount(),e=Math.floor(b.width/d),f=Math.floor(b.height/d),g=['<table style="border:0;border-collapse:collapse;">'],h=0;d>h;h++){g.push("<tr>");for(var i=0;d>i;i++)g.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+e+"px;height:"+f+"px;background-color:"+(a.isDark(h,i)?b.colorDark:b.colorLight)+';"></td>');g.push("</tr>")}g.push("</table>"),c.innerHTML=g.join("");var j=c.childNodes[0],k=(b.width-j.offsetWidth)/2,l=(b.height-j.offsetHeight)/2;k>0&&l>0&&(j.style.margin=l+"px "+k+"px")},a.prototype.clear=function(){this._el.innerHTML=""},a}();QRCode=function(a,b){if(this._htOption={width:256,height:256,typeNumber:4,colorDark:"#000000",colorLight:"#ffffff",correctLevel:d.H},"string"==typeof b&&(b={text:b}),b)for(var c in b)this._htOption[c]=b[c];"string"==typeof a&&(a=document.getElementById(a)),this._android=n(),this._el=a,this._oQRCode=null,this._oDrawing=new q(this._el,this._htOption),this._htOption.text&&this.makeCode(this._htOption.text)},QRCode.prototype.makeCode=function(a){this._oQRCode=new b(r(a,this._htOption.correctLevel),this._htOption.correctLevel),this._oQRCode.addData(a),this._oQRCode.make(),this._el.title=a,this._oDrawing.draw(this._oQRCode),this.makeImage()},QRCode.prototype.makeImage=function(){"function"==typeof this._oDrawing.makeImage&&(!this._android||this._android>=3)&&this._oDrawing.makeImage()},QRCode.prototype.clear=function(){this._oDrawing.clear()},QRCode.CorrectLevel=d}();
;var S_HEROKU_ENDPOINT = "https://icch-api-icch-api.a3c1.starter-us-west-1.openshiftapps.com/songs";
var I_MAX_SONGS_IN_SEARCH = 80;
var A_MOMENTS = ["entrance", "offertory", "communion", "recession"];

var m = function () { return moment.apply(this, arguments).locale("en-gb"); }

var catholicHolidays = catholicHolidays.createLibrary(m);

var oInitialFestiveDay = catholicHolidays.getNextFestiveDay(m().subtract(14, "hours"));

var qrCodeObj;

var app = new Vue({
    el: "#app",
    data: {
        qrCodeUrl: "",
        currentFeast: oInitialFestiveDay,
        password: "",
        possibleMoments: A_MOMENTS,
        possibleSearchFilterFlags: ["any known songs"].concat(A_MOMENTS),
        searchFilterFlags: [],
        searchText: "",
        recentSongs: [],
        selectedSong: {
            number: "",
            title: ""
        },
        selectedSongs: {
            entrance:  { number: "", title: "" },
            offertory: { number: "", title: "" },
            communion: { number: "", title: "" },
            recession: { number: "", title: "" }
        },
        songs: [],
        stats: {}
    },
    mounted: function () {
        var that = this;

        var sHash = document.URL.split("#")[1];
        var sInitialSongSet = "";
        var sInitialDate = "";
        if (sHash) {
            var aHash = sHash.split("_");
            sInitialDate = aHash[0];
            sInitialSongSet = aHash[1];
        }

        // check the url and log in with the log-in hash
        this.$http.get("songs.json").then(function (oData) {
            oData.body.list.forEach(function(oSong) {
                that.songs.push(oSong);
            });
            that.refreshSelectedState();

            that.setSongsFromString(sInitialSongSet);
        });

        if (sInitialDate) {
            this.setCurrentFeast(m(sInitialDate, "DD-MM-YYYY"));
        } else {
            this.setCurrentFeast(oInitialFestiveDay);
        }
    },
    filters: {
        hasKeys: function (oStats) {
            return Object.keys(oStats).length > 0;
        },
        not: function (bVal) {
            return !bVal;
        },
        formatLimitLabel: function (sCount) {
            if (sCount === "") { return "?"; }
            var iCount = parseInt(sCount, 10);
            if (iCount === I_MAX_SONGS_IN_SEARCH + 1) {
                return I_MAX_SONGS_IN_SEARCH + "+";
            }
            return "" + sCount;
        },
        getSongIcon: function (oSongStats) {
            if (!oSongStats) { return ""; }
            var aMoments = Object.keys(oSongStats.sungFor || {});
            var iNumMoments = aMoments.length;

            if (iNumMoments === 0) { return ""; }
            if (iNumMoments > 1)   { return "music_note"; }

            var sMoment = aMoments.pop();
            switch (sMoment) {
                case "communion":
                    return "lens";
                case "entrance":
                    return "file_download";
                case "recession":
                    return "file_upload";
                case "offertory":
                    return "grain";
                default:
                    return "star";
            }
        },
        joinKeys: function (object) {
            if (!object) {
                return '';
            }
            return Object.keys(object).sort().join(", ");
        }
    },
    methods: {
        setSongsFromString: function(sSongs) {
            var that = this;
            if (!sSongs) {
                return;
            }
            sSongs.split(",").forEach(function (sSongNumber, iIdx) {
                if (/^[0-9]+$/.test(sSongNumber)) {
                    that.setSongByNumber(sSongNumber, that.possibleMoments[iIdx]);
                }
            });
        },
        showQrCode: function () {
            var that = this;

            if (!qrCodeObj) {
                qrCodeObj = new QRCode(
                    document.getElementById("qrcode"), "");
            }

            var sDate = that.currentFeast.format("DD-MM-YYYY");

            var sSongs = A_MOMENTS.map(function (sMoment) {
                return that.selectedSongs[sMoment].number || "x";
            }).join(",");

            var sUrl;
            if (document.URL.indexOf("#") >= 0) {
                sUrl = document.URL.replace(/#.+/, "#" + sDate + "_" + sSongs);
            } else {
                sUrl = document.URL + "#" + sDate + "_" + sSongs;
            }

            this.qrCodeUrl = sUrl;
            qrCodeObj.clear();
            qrCodeObj.makeCode(sUrl);

            this.openModal("qrcode");
        },
        onFilterCheckboxClicked: function () {
            var that = this;
            setTimeout(function () {
                /*
                 * keenui's v-model doesn't work on phones, therefore we need to
                 * keep track of the value manually as this is changed...
                 */
                 var aCheckboxLabels = document.querySelectorAll("#searchFilters label");
                 var i;
                 that.searchFilterFlags = [];
                 for (i = 0; i < aCheckboxLabels.length; i++) {
                    // we have found the index
                    var sLabelValue = that.possibleSearchFilterFlags[i];
                    var bSelected = aCheckboxLabels[i].value === "true";
                    if (bSelected) {
                        that.searchFilterFlags.push(sLabelValue);
                    }
                 }
            }, 0);
        },
        loadStatistics: function (oFestiveDay, iMaxDaysBack) {
            var that = this;

            new Array(iMaxDaysBack).join(",").split(",").reduce(function (oPreviousPromise, oNextIteration) {

                return oPreviousPromise.catch(function (oTryWithThisDate) {

                    return that.loadStatsFrom(oTryWithThisDate.format("DD-MM-YYYY") + ".json")
                        .catch(function () {
                            var oPreviousDate = catholicHolidays.getPreviousFestiveDay(oTryWithThisDate);
                            return Promise.reject(oPreviousDate);
                        });
                });

            }, Promise.reject(catholicHolidays.getPreviousFestiveDay(oFestiveDay)));
        },
        loadCurrentSongSelection: function (oFestiveDay) {
            var that = this;

            // Attempt to load songs
            this.$http.get("save/" + oFestiveDay.format("DD-MM-YYYY") + ".json").then(function (oData) {
                if (oData.status !== 200) {
                    return;
                }
                try {
                    Object.keys(that.selectedSongs)
                        .forEach(function (sMoment) {
                            that.selectedSongs[sMoment].number = oData.body[sMoment].number;
                            that.selectedSongs[sMoment].title = oData.body[sMoment].title;
                        });
                } catch (e) {
                    alert("Unable to load: " + e);
                }
            }, function (oData) {
                if (oData.status === 404) {
                    // nothing saved yet!
                    this.selectedSongs = {
                        entrance:  { number: "", title: "" },
                        offertory: { number: "", title: "" },
                        communion: { number: "", title: "" },
                        recession: { number: "", title: "" }
                    };
                }
            });
        },
        setCurrentFeast: function (oFeastDay) {

            this.currentFeast = oFeastDay;

            this.loadCurrentSongSelection(oFeastDay);

            this.loadStatistics(oFeastDay, 5);
        },
        onPreviousSundayClicked: function () {
            this.setCurrentFeast(catholicHolidays.getPreviousFestiveDay(this.currentFeast));
        },
        onNextSundayClicked: function () {
            this.setCurrentFeast(catholicHolidays.getNextFestiveDay(this.currentFeast));
        },
        loadStatsFrom: function (sFilename) {
            var that = this;
            return this.$http.get("save/" + sFilename).then(function (oData) {
                if (oData.status !== 200) {
                    return;
                }
                try {
                    that.stats = oData.body.stats;
                } catch (e) {
                    alert("Unable to load: " + e);
                }
            });
        },
        clearSongs: function () {
            var that = this;
            Object.keys(this.selectedSongs).forEach(function (sMoment) {
                that.selectedSongs[sMoment].number = "";
                that.selectedSongs[sMoment].title = "";
            });
        },
        closeModal: function (ref) {
            this.$refs[ref].close();
        },
        openModal: function (ref) {
            this.$refs[ref].open();
        },
        openSelectSongModal: function (ref, number, title) {
            this.selectedSong.number = number;
            this.selectedSong.title = title;
            this.$refs[ref].open();
        },
        removeSong: function (sMoment) {
            // add song to the recent

            this.addSongToRecents(this.selectedSongs[sMoment]);

            this.selectedSongs[sMoment].number = "";
            this.selectedSongs[sMoment].title = "";
        },
        setSongByNumber: function (sSongNumber, sMoment) {
            // recover song informations
            var oSong = this.songs.filter(function (oSong) {
                return oSong.number === sSongNumber;
            })[0];

            if (!oSong) {
                console.log("Cannot find song " + sSongNumber);
                return;
            }

            this.setSongByItem(oSong, sMoment);
        },
        setSongByItem: function (oSong, sMoment) {
            if (this.selectedSongs[sMoment].number) {
                this.addSongToRecents(this.selectedSongs[sMoment]);
            }

            this.selectedSongs[sMoment].number = oSong.number;
            this.selectedSongs[sMoment].title = oSong.title;

            this.refreshSelectedState();
        },
        setSong: function (sMoment) {
            var that = this;
            this.$refs.whichSong.close();

            this.setSongByItem(this.selectedSong, sMoment);
        },
        refreshSelectedState: function () {
            var that = this;
            var oSelectedSongs = {};
            Object.keys(that.selectedSongs).forEach(function (sType) {
                oSelectedSongs[that.selectedSongs[sType].number] = true;
            });

            this.songs.forEach(function (oSong) {
                oSong.selected = !!oSelectedSongs[oSong.number];
            });
        },
        addSongToRecents: function (oSong) {
            // unselect song first
            var oOriginalSong = this.songs.filter(function (oOriginalSong) {
                return oSong.number === oOriginalSong.number;
            })[0];
            oOriginalSong.selected = false;

            // remove existing before
            var iExistingPos = this.recentSongs.map(function (oRecentSong) {
                return oRecentSong.number;
            }).indexOf(oSong.number);

            if (iExistingPos >= 0) {
                this.recentSongs.splice(iExistingPos, 1);
            }

            var oSongCopy = {
                number: oSong.number,
                title: oSong.title
            };

            this.recentSongs.unshift(oSongCopy);

            if (this.recentSongs.length > 10) {
                this.recentSongs.pop();
            }
        },
        save: function () {
            var that = this;
            this.$refs.saveDialog.close();

            save(this.password);
        }
    },
    computed: {
        currentFeastDate: function () {
            return m(this.currentFeast, "DD-MM-YYYY").format("DD MMM YYYY");
        },
        currentFeastDateShort: function () {
            return m(this.currentFeast, "DD-MM-YYYY").format("MMDDYY");
        },
        currentFeastName: function () {
            return catholicHolidays.getFeastName(this.currentFeast);
        },
        filteredSongs: function () {
            var that = this;
            var filteredSongs = [];
            var sSearch = this.searchText;
            var bThereAreFilters = that.searchFilterFlags.length > 0;
            var oSongNumberToAge = {
                // 124 --> 20160421
            };

            return this.songs.reduce(function (aFilteredSongs, oSong, iIdx) {
                if (aFilteredSongs.length > I_MAX_SONGS_IN_SEARCH) {
                    return aFilteredSongs;
                }

                var bMatchesSearch = oSong.number === sSearch
                  || oSong.title.toLowerCase().indexOf(sSearch.toLowerCase()) > -1;

                var oSongStats = that.stats[oSong.number] || {
                    count: 0,
                    sungFor: {}
                };
                var bMatchesFilters = that.searchFilterFlags.every(function (sFilter) {
                    switch (sFilter) {
                        case "any known songs":
                            return oSongStats.count > 0;
                        default:  // assume it's a moment: e.g., 'communion'
                            return oSongStats.sungFor[sFilter];
                    }
                });

                if (bMatchesSearch && (!bThereAreFilters || bMatchesFilters)) {
                    // keep date to age
                    var aDateParts = (oSongStats.lastSung || "01-01-1900").split("-");
                    oSongNumberToAge[oSong.number] = parseInt(aDateParts.reverse().join(""));
                    aFilteredSongs.push(oSong);
                }

                return aFilteredSongs;

            }, []).sort(function (oSa, oSb) {
                var iAgeA = oSongNumberToAge[oSa.number];
                var iAgeB = oSongNumberToAge[oSb.number];
                if (iAgeA === iAgeB) { return 0; }
                return iAgeA < iAgeB ? -1 : 1;
            });
        }
    },
});

function save(sPassword) {
    var that = this;
    return new Promise(function (fnDone, fnError) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                try {
                    if (request.responseText === "") {
                        alert("Error: Empty response");
                        return;
                    }

                    var oResponse = JSON.parse(request.responseText);
                    if (!oResponse.success) {
                        alert("Error");
                        return;
                    }

                    alert("Saved");
                    fnDone(oResponse);

                } catch (oError) {
                    alert("Unexpected Error: " + oError);
                    fnError(oError);
                }
            }
        };
        request.open("POST", S_HEROKU_ENDPOINT, true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        var oClone = JSON.parse(JSON.stringify(app.selectedSongs));
        oClone.stats = JSON.parse(JSON.stringify(app.stats));

        // update stats
        Object.keys(app.selectedSongs).forEach(function (sMoment) {
            var sSongNumber = app.selectedSongs[sMoment].number;
            if (!oClone.stats[sSongNumber]) {
                oClone.stats[sSongNumber] = {
                    count: 0,
                    sungFor: {}
                };
            }

            // update sungFor statistics
            var oSongSungMoments = oClone.stats[sSongNumber].sungFor || {};
            var oAllMoments = Object.keys(oSongSungMoments).filter(function (sMoment) {
                return oSongSungMoments[sMoment] === true;
            }).reduce(function (o, sMoment) {
                o[sMoment] = true;
                return o;
            }, {});

            // add current moment
            oAllMoments[sMoment] = true;

            oClone.stats[sSongNumber].count++;
            oClone.stats[sSongNumber].lastSung = app.currentFeast.format("DD-MM-YYYY");
            oClone.stats[sSongNumber].sungFor = oAllMoments;

        });

        oClone.password = sPassword;
        oClone.saveAs = app.currentFeast.format("DD-MM-YYYY") + ".json";
        request.send(JSON.stringify(oClone, null, 3));
    });
}
