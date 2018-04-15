/* global describe it */
var chai = require("chai");
var m = require("moment");
var expect = chai.expect;

var oReadings = require("../lib/catholicReadings.js");

describe("getEasterSunday", function () {
    it("works as expected", function (done) {
        oReadings.getReadings("2018", "04", "15")
            .then(function (oReadings) {
                try {
                    expect(oReadings).to.deep.equal({
                        "psalm": [ "Psalms 4:2, 4, 7-9" ],
                        "reading1": [ "Acts 3:13-15, 17-19" ],
                        "reading2": [ "1 John 2:1-5" ],
                        "reading3": [ "Luke 24:35-48" ]
                    });
                } catch (e) {
                    return Promise.reject(e);
                }
            })
            .then(done, done);
    });
});

