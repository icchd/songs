var S_HEROKU_ENDPOINT = "https://icch-api-icch-api.a3c1.starter-us-west-1.openshiftapps.com/songs";
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
        searchTopics: [],
        recentSongs: [],
        selectedSong: {
            number: "",
            title: "",
            topics: [],
            scriptures: {}
        },
        selectedSongs: {
            entrance:  { number: "", title: "" },
            offertory: { number: "", title: "" },
            communion: { number: "", title: "" },
            recession: { number: "", title: "" }
        },
        songs: [],
        stats: {},
        topics: []
    },
    mounted: function () {
        function createSearachableString (oScriptures) {
            return Object.keys(oScriptures).map(function (sBook) {
                return oScriptures[sBook].map(function (sScripture) {
                    return (sBook + " " + sScripture).toLowerCase();
                }).join(" ");
                return sString;
            }).join(" ");
        }

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
            var oUniqueTopics = {};

            oData.body.list.forEach(function(oSong) {
                that.songs.push(oSong);

                // find unique topics
                oSong.topics.forEach(function (sTopic) {
                    oUniqueTopics[sTopic] = true;
                });

                oSong.scripturesSearchableString = createSearachableString(oSong.scriptures);
            });
            this.topics = Object.keys(oUniqueTopics).sort();

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
        clearTopicSearch: function () {
            this.searchTopics = [];
        },
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
        openSelectSongModal: function (ref, number, title, topics, scriptures) {
            this.selectedSong.number = number;
            this.selectedSong.title = title;
            this.selectedSong.topics = topics;
            this.selectedSong.scriptures = Object.keys(scriptures).map(function (sBook) {
                return sBook + " " + scriptures[sBook].join(", ");
            }).sort();
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
            var sSearch = this.searchText.toLowerCase();
            var bThereAreFilters = that.searchFilterFlags.length > 0 || that.searchTopics.length > 0;
            var oSongNumberToAge = {
                // 124 --> 20160421
            };

            // for quick lookup
            var oSearchedTopics = that.searchTopics.reduce(function (o, sTopic) {
                o[sTopic] = true;
                return o;
            }, {});

            return this.songs.reduce(function (aFilteredSongs, oSong, iIdx) {
                if (aFilteredSongs.length > I_MAX_SONGS_IN_SEARCH) {
                    return aFilteredSongs;
                }

                var bMatchesSearch = oSong.number === sSearch
                  || oSong.title.toLowerCase().indexOf(sSearch) > -1
                  || oSong.scripturesSearchableString.indexOf(sSearch) > -1;

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
                }) && ( that.searchTopics.length === 0 || oSong.topics.some(function (sTopicFromSong) {
                    return !!oSearchedTopics[sTopicFromSong];
                }) );

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
