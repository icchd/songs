var S_HEROKU_ENDPOINT = "https://icch-api-icch-api.a3c1.starter-us-west-1.openshiftapps.com/songs";
var I_MAX_SONGS_IN_SEARCH = 80;

var m = function () { return moment.apply(this, arguments).locale("en-gb"); }

var app = new Vue({
    el: "#app",
    data: {
        currentDate: getNextSunday(),
        password: "",
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

        // check the url and log in with the log-in hash
        this.$http.get("songs.json").then(function (oData) {
            oData.body.list.forEach(function(oSong) {
                that.songs.push(oSong);
            });
            that.refreshSelectedState();
        });

        var sCurrentSunday = getNextSunday("DD-MM-YYYY");
        this.onCurrentSundayChanged(sCurrentSunday);
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
        onCurrentSundayChanged: function (sDate) {
            var that = this;

            this.currentDate = sDate;

            // get previous sundays stats
            if (m(sDate, "DD-MM-YYYY").isSameOrBefore(m())) {
                var sPrevSunday = getSundayBeforeSunday(sDate);
                var sPrevPrevSunday = getSundayBeforeSunday(sPrevSunday);
                var sPrevPrevPrevSunday = getSundayBeforeSunday(sPrevPrevSunday);
                this.getStatsFrom(
                    sPrevSunday + ".json"
                ).catch(function () {
                    return that.getStatsFrom(sPrevPrevSunday + ".json");
                }).catch(function () {
                    return that.getStatsFrom(sPrevPrevPrevSunday + ".json");
                });
            }

            this.$http.get("save/" + sDate + ".json").then(function (oData) {
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
        onPreviousSundayClicked: function () {
            var sPrevSunday = getSundayBeforeSunday(this.currentDate);
            this.onCurrentSundayChanged(sPrevSunday);
        },
        onNextSundayClicked: function () {
            var sNextSunday = getSundayAfterSunday(this.currentDate);
            this.onCurrentSundayChanged(sNextSunday);
        },
        getStatsFrom: function (sFilename) {
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
        setSong: function (sMoment) {
            var that = this;
            this.$refs.whichSong.close();

            if (this.selectedSongs[sMoment].number) {
                this.addSongToRecents(this.selectedSongs[sMoment]);
            }

            this.selectedSongs[sMoment].number = that.selectedSong.number;
            this.selectedSongs[sMoment].title = that.selectedSong.title;

            this.refreshSelectedState();

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
        nextSunday: function () {
            return m(this.currentDate, "DD-MM-YYYY").format("DD MMM YYYY");
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

function getSundayBeforeSunday(sSunday) {
    var oDate = m(sSunday, "DD-MM-YYYY");

    return oDate.add(-7, "days").format("DD-MM-YYYY");
}
function getSundayAfterSunday(sSunday) {
    var oDate = m(sSunday, "DD-MM-YYYY");

    return oDate.add(7, "days").format("DD-MM-YYYY");
}

function getPreviousSunday(sFormat, iDayOffset) {
    var days = iDayOffset;
    while (m().add(days, "days").format("dddd") !== "Sunday") {
        days--;
    }
    return m().add(days, "days").format(sFormat || "LL");
}

function getNextSunday(sFormat) {
    var days = 0;
    while (m().add(days, "days").format("dddd") !== "Sunday") {
        days++;
    }
    return m().add(days, "days").format(sFormat || "LL");
}

function save(sPassword) {
    var that = this;
    return new Promise(function (fnDone, fnError) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                try {
                    var oResponse = JSON.parse(request.responseText);
                    if (!oResponse.success) {
                        alert("Error");
                        return;
                    }

                    alert("Saved");
                    fnDone(oResponse);

                } catch (oError) {
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
            oClone.stats[sSongNumber].lastSung = that.currentDate;
            oClone.stats[sSongNumber].sungFor = oAllMoments;

        });

        oClone.password = sPassword;
        oClone.saveAs = app.currentDate + ".json";
        request.send(JSON.stringify(oClone, null, 3));
    });
}
