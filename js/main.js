var I_MAX_SONGS_IN_SEARCH = 80;
var A_MOMENTS = ["entrance", "offertory", "communion", "recession"];
var O_MOMENT_ICON = {
    entrance: "file_download",
    offertory: "grain",
    communion: "lens",
    recession: "file_upload"
};

var O_APIS = {
    "Cloudno.de": "http://icch-api.cloudno.de/songs",
    "Heroku": "http://icch-api.herokuapp.com/songs"
};

/* global QRCode Vue moment catholicReadings */

var m = function () { return moment.apply(this, arguments).locale("en-gb"); };

var catholicHolidays = catholicHolidays.createLibrary(m);

var oInitialFestiveDay = catholicHolidays.getNextFestiveDay(m().subtract(14, "hours"));

var qrCodeObj;
var app;

init().then(function (oEnv) {
    app = new Vue({
        el: "#app",
        data: {
            possibleApis: Object.keys(O_APIS),
            api: Object.keys(O_APIS)[0],
            newMomentName: "",
            showHangingDisplay: false,
            qrCodeUrl: "",
            currentFeast: oInitialFestiveDay,
            password: "",
            possibleMoments: [],
            possibleSearchFilterFlags: ["any known songs"].concat(A_MOMENTS),
            searchFilterFlags: [],
            searchText: "",
            searchTopics: [],
            recentSongs: [],
            selectedSong: oEnv.defaultSongFields,
            selectedSongs: {},
            songFieldNames: Object.keys(oEnv.defaultSongFields),
            songs: oEnv.songs,
            stats: {},
            topics: oEnv.topics,
            smartSearchMessage: "",
            suggestionLinks: [
                { name: "Music Ministry - Our Lady of Mount Carmel" , url: "https://olmcwentyliturgy.org/welcome/resources-for-liturgical-ministers/liturgical-ministries/music/music-suggestions/" },
                { name: "Liturgytools.net"                          , url: "http://www.liturgytools.net/p/roman-catholic-lectionary-based-hymn.html" },
                { name: "As One Voice"                              , url: "http://www.asonevoice.com.au/liturgical-song-selection" },
                { name: "Hymnary.org"                               , url: "https://hymnary.org/browse/lectionary" },
                { name: "CanticaNOVA"                               , url: "http://www.canticanova.com/pln_main.htm" },
                { name: "Blessed Sacrament Catholic Community"      , url: "http://cc.blessedsacramentnc.org/music" },
                { name: "The Historic Church of Saint Patrick"      , url: "http://www.stpatshistoric.org/index.php/bulletins/" },
                { name: "The Sunday Website at St Louis University" , url: "http://liturgy.slu.edu/" },
                { name: "Canadian Conference of Catholic Bishops (Year A)", url: "http://www.cccb.ca/site/Files/CBW_III_Music_suggestions_YrA.html" },
                { name: "Canadian Conference of Catholic Bishops (Year B)", url: "http://www.cccb.ca/site/Files/CBW_III_Music_suggestions_YrB.html" },
                { name: "Canadian Conference of Catholic Bishops (Year C)", url: "http://www.cccb.ca/site/Files/CBW_III_Music_suggestions_YrC.html" },
                { name: "Catholic Diocese of Wollongong", url: "http://www.liturgydow.org.au/suggestions.html" }
            ],
            automaticSuggestions: {
                sunday: "Last sunday",
                suggestions: {
                }
            }
        },
        mounted: function () {
            var that = this;
            var sHash = document.URL.split("#")[1];
            if (sHash) {
                var aHash = sHash.split("_");
                var sInitialDate = aHash[0];
                var sInitialSongSet = aHash[1];

                this.setCurrentFeast(m(sInitialDate, "DD-MM-YYYY"))
                    .then(function () {
                        that.setSongsFromString(sInitialSongSet);
                    });

                return;
            }

            this.setCurrentFeast(oInitialFestiveDay).then(function () {
                that.refreshSelectedState();
            });
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
                var sMomentIcon = O_MOMENT_ICON[sMoment];

                return sMomentIcon
                    ? sMomentIcon
                    : "star";
            },
            joinKeys: function (object) {
                if (!object) {
                    return "";
                }
                return Object.keys(object).sort().join(", ");
            }
        },
        methods: {
            autoSearch: function () {
                var that = this;
                var sYYYY = this.currentFeast.format("YYYY");
                var sMM = this.currentFeast.format("MM");
                var sDD = this.currentFeast.format("DD");
                catholicReadings.getReadings(sYYYY, sMM, sDD).then(function (oReadings) {
                    var aAllReadings = [];
                    var aSearchTerms = [];

                    Object.keys(oReadings)
                        .forEach(function (sKey) {
                            oReadings[sKey].forEach(function (sReading) {
                                if (sReading) {
                                    aAllReadings.push(sKey + ": " + sReading);

                                    var sBookName = sReading.split(" ")[0];
                                    var aIntervals = sReading.replace(sBookName, "").split(/,\s*/).map(function (s) { return s.trim(); });
                                    aIntervals.forEach(function (sInterval) {
                                        aSearchTerms.push(sBookName + " " + sInterval);
                                    });
                                }
                            });
                        });

                    that.searchText = aSearchTerms.join(" || ");
                    that.smartSearchMessage = "From readings: " + aAllReadings.join(", ");
                });
            },
            formatSongNumber: function (sNumber) {
                if (!sNumber) {
                    return;
                }
                if (sNumber.indexOf("other-") >= 0) {
                    return "---";
                }
                return sNumber;
            },
            toggleHangingDisplay: function () {
                var that = this;
                var bCanToggle = true;
                if (!this.showHangingDisplay) {
                    bCanToggle = this.possibleMoments.every(function (sMoment) {
                        return that.selectedSongs[sMoment].number;
                    });
                }

                if (bCanToggle) {
                    this.showHangingDisplay = !this.showHangingDisplay;
                }
            },
            clearTopicSearch: function () {
                this.searchTopics = [];
            },
            setSongsFromString: function(sSongs) {
                var that = this;
                sSongs.split(",").forEach(function (sSongNumber, iIdx) {
                    if (/^[0-9]+$/.test(sSongNumber)) {
                        that.setSongByNumber(sSongNumber, A_MOMENTS[iIdx]);
                    }
                });
            },
            deleteMoment: function (sMoment) {
                this.removeSong(sMoment);

                var iMomentPosition = this.possibleMoments.indexOf(sMoment);
                this.possibleMoments.splice(iMomentPosition, 1);
                this.$forceUpdate();
            },
            addNewMoment: function () {
                var sMoment = this.newMomentName.toLowerCase().trim();
                if (sMoment === "") {
                    return; // empty moment
                }
                if (this.possibleMoments.indexOf(sMoment) >= 0) {
                    return; // moment already exists
                }
                this.newMomentName = "";
                this.selectedSongs[sMoment] = { number: "", title: "" };
                this.possibleMoments.push(sMoment);
            },
            moveMoment: function (sMoment, iDirection) {
                var iMomentFrom = this.possibleMoments.indexOf(sMoment);
                var iMomentTo = iMomentFrom + iDirection;
                var sTmp = this.possibleMoments[iMomentTo];
                this.possibleMoments[iMomentTo] = this.possibleMoments[iMomentFrom];
                this.possibleMoments[iMomentFrom] = sTmp;
                this.$forceUpdate();
            },
            moveMomentUp: function (sMoment) {
                this.moveMoment(sMoment, -1);
            },
            moveMomentDown: function (sMoment) {
                this.moveMoment(sMoment, +1);
            },
            showQrCode: function () {
                var that = this;

                if (!qrCodeObj) {
                    qrCodeObj = new QRCode(
                        document.getElementById("qrcode"), "");
                }

                var sDate = that.currentFeast.format("DD-MM-YYYY");

                var sSongs = that.possibleMoments.map(function (sMoment) {
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
            loadStatistics: function (oFestiveDay, iMaxDaysBack) {
                var that = this;

                return new Array(iMaxDaysBack).join(",").split(",").reduce(function (oPreviousPromise) {

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

                // delete all entries
                that.possibleMoments.splice(0, that.possibleMoments.length);

                // Attempt to load songs
                return this.$http.get("save/" + oFestiveDay.format("DD-MM-YYYY") + ".json").then(function (oData) {
                    if (oData.status !== 200) {
                        return;
                    }
                    try {
                        var aMoments = oData.body.momentsOrder || A_MOMENTS;
                        aMoments.forEach(function (sMoment) {
                            if (!that.selectedSongs[sMoment]) {
                                that.selectedSongs[sMoment] = {};
                            }
                            that.selectedSongs[sMoment].number = oData.body[sMoment].number;
                            that.selectedSongs[sMoment].title = oData.body[sMoment].title;
                            that.possibleMoments.push(sMoment);
                        });
                    } catch (e) {
                        alert("Unable to load: " + e);
                    }
                }, function (oData) {
                    if (oData.status === 404) {
                        // nothing saved yet!
                        this.selectedSongs = A_MOMENTS.reduce(function (o, sMoment) {
                            o[sMoment] = { number: "", title: "" };

                            that.possibleMoments.push(sMoment);
                            return o;
                        }, {});
                    }
                });
            },
            setCurrentFeast: function (oFeastDay) {

                this.currentFeast = oFeastDay;

                return Promise.all([
                    this.loadCurrentSongSelection(oFeastDay),
                    this.loadStatistics(oFeastDay, 5)
                ]);
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
            clearSong: function (sMoment) {
                var that = this;
                Object.keys(this.selectedSongs[sMoment]).forEach(function (sKey) {
                    that.selectedSongs[sMoment][sKey] = "";
                });
            },
            clearSongs: function () {
                Object.keys(this.selectedSongs).forEach(this.clearSong.bind(this));
            },
            closeModal: function (ref) {
                this.$refs[ref].close();
            },
            openModal: function (ref) {
                this.$refs[ref].open();
            },
            openSelectSongModal: function (ref, sNumber) {
                var that = this;
                var oSong = this.findSong(sNumber);

                // zero all fields first
                that.songFieldNames.forEach(function (sFieldName) {
                    that.selectedSong[sFieldName] = getDefaultFieldValue(that.selectedSong[sFieldName]);
                });
                Object.keys(oSong).forEach(function (sKey) {
                    that.selectedSong[sKey] = oSong[sKey];
                });
                this.$refs[ref].open();
            },
            removeSong: function (sMoment) {
                if (this.selectedSongs[sMoment] && this.selectedSongs[sMoment].number) {
                    this.addSongToRecents(this.selectedSongs[sMoment]);
                }
                this.clearSong(sMoment);
            },
            findSong: function (sSongNumber) {
                var oSong = this.songs.filter(function (oSong) {
                    return oSong.number === sSongNumber;
                })[0];

                return oSong;
            },
            setSongByNumber: function (sSongNumber, sMoment) {
                // recover song informations
                var oSong = this.findSong(sSongNumber);

                if (!oSong) {
                    console.log("Cannot find song " + sSongNumber);
                    return;
                }

                this.setSongByItem(oSong, sMoment);
            },
            isSongSelected: function (sNumber) {
                var that = this;
                return Object.keys(this.selectedSongs).some(function (sMoment) {
                    return that.selectedSongs[sMoment] && that.selectedSongs[sMoment].number === sNumber;
                });
            },
            setSongByItem: function (oSong, sMoment) {
                var that = this;

                if (!this.selectedSongs[sMoment]) {
                    this.selectedSongs[sMoment] = {};
                }

                if (this.selectedSongs[sMoment].number) {
                    this.addSongToRecents(this.selectedSongs[sMoment]);  // TODO
                }

                that.selectedSongs[sMoment].number = oSong.number;
                that.selectedSongs[sMoment].title = oSong.title;

                this.refreshSelectedState();
            },
            setSong: function (sMoment) {
                this.setSongByItem(this.selectedSong, sMoment);
                this.$refs.whichSong.close();
                this.$forceUpdate();
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

                var oSongCopy = Object.keys(oSong).reduce(function (oCopy, sKey) {
                    oCopy[sKey] = oSong[sKey];
                    return oCopy;
                }, {});

                this.recentSongs.unshift(oSongCopy);

                if (this.recentSongs.length > 10) {
                    this.recentSongs.pop();
                }
            },
            save: function () {
                this.$refs.saveDialog.close();
                save(this.password);
            },
            suggest: function () {
                this.$refs.suggestionDialog.close();
                suggest(this.password);
            }
        },
        computed: {
            currentLiturgicalYear: function () {
                var mFeast = m(this.currentFeast, "DD-MM-YYYY");
                return catholicHolidays.getLiturgicalYear(mFeast);
            },
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

                var bThereAreFilters = that.searchFilterFlags.length > 0 || that.searchTopics.length > 0;
                var oSongNumberToAge = {
                    // 124 --> 20160421
                };

                // for quick lookup
                var oSearchedTopics = that.searchTopics.reduce(function (o, sTopic) {
                    o[sTopic] = true;
                    return o;
                }, {});

                // -------

                var sSearchText = this.searchText;
                var aSearches = sSearchText.toLowerCase().split("||").map(function (x) { return x.trim(); });

                return this.songs.reduce(function (aFilteredSongs, oSong, iIdx) {
                    if (aFilteredSongs.length > I_MAX_SONGS_IN_SEARCH) {
                        return aFilteredSongs;
                    }

                    var sLowerCaseSongTitle = oSong.title.toLowerCase();
                    var bAtLeastOneTermContainedInTitle = aSearches.some(function (sSearch) {
                        return sLowerCaseSongTitle.indexOf(sSearch) > -1;
                    });

                    var bAtLeastOneTermContainedInScripturesSearchableString = aSearches.some(function (sSearch) {
                        return oSong.scripturesSearchableString.indexOf(sSearch) > -1;
                    });

                    var bMatchesSearch = oSong.number === sSearchText
                      || bAtLeastOneTermContainedInTitle
                      || bAtLeastOneTermContainedInScripturesSearchableString;

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

    function suggest(sPassword) {
        return sendPostRequest({
            type: "suggestions",
            password: sPassword
        }).then(function (oResponse) {
            app.automaticSuggestions.sunday = oResponse.result.sunday;
            app.automaticSuggestions.suggestions = oResponse.result.suggestions;
        });
    }

    function sendPostRequest (oBody) {
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

                        fnDone(oResponse);

                    } catch (oError) {
                        alert("Unexpected Error: " + oError);
                        fnError(oError);
                    }
                }
            };

            var sApiEndpoint = O_APIS[app.api];
            request.open("POST", sApiEndpoint, true);
            request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            request.send(JSON.stringify(oBody, null, 3));
        });
    }

    function save(sPassword) {
        var oClone = JSON.parse(JSON.stringify(app.selectedSongs));
        oClone.stats = JSON.parse(JSON.stringify(app.stats));

        oClone.momentsOrder = JSON.parse(JSON.stringify(app.possibleMoments));

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
        oClone.type = "save";

        return sendPostRequest(oClone).then(function () {
            alert("Saved");
        });
    }
});


function getDefaultFieldValue(vValue) {
    var sFieldType = typeof vValue;
    var sFieldObjectType = Object.prototype.toString.apply(vValue);

    if (sFieldType === "string") { return ""; }
    if (sFieldObjectType === "[object Array]") { return []; }
    if (sFieldObjectType === "[object Object]") { return {}; }

    throw new Error("Unknown type: " + sFieldType);
}

function init() {

    function collectDefaultSongFieldsFromSong(oSong, oDefaultSongFields) {
        Object.keys(oSong).forEach(function (sKey) {
            if (!oDefaultSongFields[sKey]) {
                var vValue = oSong[sKey];

                oDefaultSongFields[sKey] = getDefaultFieldValue(vValue);
            }
        });
    }

    function createSearachableString (oScriptures) {
        return Object.keys(oScriptures).map(function (sBook) {
            return oScriptures[sBook].map(function (sScripture) {
                return (sBook + " " + sScripture).toLowerCase();
            }).join(" ");
        }).join(" ");
    }

    function collectUniqueTopics (oSong, oUniqueTopics) {
        oSong.topics.forEach(function (sTopic) {
            oUniqueTopics[sTopic] = true;
        });
    }

    return new Promise(function (fnInitDone) {

        // check the url and log in with the log-in hash
        Vue.http.get("songs.json").then(function (oData) {
            var aSongs = oData.body.list;
            var aTopics = [];
            var oDefaultSongFields = {}; // discover song fields
            var oUniqueTopics = {};

            var iLastOtherSongId = 0;

            aSongs.forEach(function(oSong) {
                if (!oSong.hasOwnProperty("number")) {
                    oSong.number = "other-" + (++iLastOtherSongId);
                }
                oSong.scripturesSearchableString = createSearachableString(oSong.scriptures);
                collectDefaultSongFieldsFromSong(oSong, oDefaultSongFields);
                collectUniqueTopics(oSong, oUniqueTopics);
            });

            aTopics = Object.keys(oUniqueTopics).sort();

            fnInitDone({
                songs: aSongs,
                topics: aTopics,
                defaultSongFields: oDefaultSongFields
            });
        });
    });
}
