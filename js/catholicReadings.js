(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.catholicReadings = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var XMLHttpRequest = (typeof window !== "undefined" ? window['window'] : typeof global !== "undefined" ? global['window'] : null).XMLHttpRequest;

var API_BASE = "https://www.ewtn.com/se/readings/readingsservice.svc/day";
var LANG = "en";

var _urlCache = {};

function getJson(sUrl, cache) {
    if (cache[sUrl]) {
        return new Promise(function (fnResolve) {
            fnResolve(cache[sUrl]);
        });
    }

    return httpRequest(sUrl).then(function (request) {
        var data = JSON.parse(request.responseText);
        cache[sUrl] = data;
        return data;
    });
}

function httpRequest(sUrl) {
    return new Promise(function (fnResolve, fnReject) {
        var request = new XMLHttpRequest();
        request.open("GET", sUrl, true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                fnResolve(request);
                // var data = JSON.parse(request.responseText);
                // app._urlCache[sUrl] = data;
                // fnResolve(data);
            } else {
                // We reached our target server, but it returned an error
                fnReject(request);
            }
        };

        request.onerror = function () {
            // There was a connection error of some sort
            fnReject();
        };

        request.send();
    });
}

function getReading(oResponse, sType) {
    var oReading = oResponse.ReadingGroups[0].Readings.filter(function (oReading) {
        return oReading.Type === sType;
    })[0];
    if (!oReading) {
        return "";
    }
    return oReading.Citations.map(function (x) {
        return x.Reference;
    });
}

function getReadings(sYYYY, sMM, sDD) {
    var date = sYYYY + "-" + sMM + "-" + sDD;
    return getJson(API_BASE + "/" + date + "/" + LANG, _urlCache).then(function (oResponse) {
        var aReading1 = getReading(oResponse, "Reading 1");
        var aReading2 = getReading(oResponse, "Reading 2");
        var aReading3 = getReading(oResponse, "Gospel");
        var aPsalm = getReading(oResponse, "Psalm");

        return {
            reading1: aReading1,
            reading2: aReading2,
            reading3: aReading3,
            psalm: aPsalm
        };
    });
}

module.exports = {
    getReadings: getReadings
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});