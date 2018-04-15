var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const API_BASE = "https://www.ewtn.com/se/readings/readingsservice.svc/day";
const LANG = "en";

let _urlCache = {};

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

function httpRequest (sUrl) {
    return new Promise(function (fnResolve, fnReject) {
        var request = new XMLHttpRequest();
        request.open("GET", sUrl, true);

        request.onload = function() {
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

        request.onerror = function() {
            // There was a connection error of some sort
            fnReject();
        };

        request.send();

    });
}

function getReading(oResponse, sType) {
    var oReading = oResponse.ReadingGroups[0].Readings.filter(function(oReading) {
        return oReading.Type === sType;
    })[0];
    if (!oReading) {
        return "";
    }
    return oReading.Citations.map(x => x.Reference);
}

function getReadings (sYYYY, sMM, sDD) {
    var date = `${sYYYY}-${sMM}-${sDD}`;
    return getJson(`${API_BASE}/${date}/${LANG}`, _urlCache)
        .then(function (oResponse) {
            var aReading1 = getReading(oResponse, "Reading 1");
            var aReading2 = getReading(oResponse, "Reading 2");
            var aReading3 = getReading(oResponse, "Gospel");
            var aPsalm    = getReading(oResponse, "Psalm");

            return {
                reading1: aReading1,
                reading2: aReading2,
                reading3: aReading3,
                psalm:    aPsalm
            };

        });
}

module.exports = {
    getReadings
};
