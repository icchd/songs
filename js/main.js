var S_HEROKU_ENDPOINT = "http://icch-api.herokuapp.com/songs";
var I_MAX_SONGS_IN_SEARCH = 50;

var app = new Vue({
    el: "#app",
    data: {
        filename: getNextSunday("DD-MM-YYYY") + ".json",
        password: "",
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

        // get previous sundays stats
        this.getStatsFrom(
            getPreviousSunday("DD-MM-YYYY", -1) + ".json"
        ).catch(function () {
            return that.getStatsFrom(getPreviousSunday("DD-MM-YYYY", -8) + ".json");
        }).catch(function () {
            return that.getStatsFrom(getPreviousSunday("DD-MM-YYYY", -15) + ".json");
        });

        this.$http.get("save/" + this.filename).then(function (oData) {
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
        }, function () {
            // nothing saved yet!
        });
    },
    methods: {
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
            return getNextSunday("DD MMM YYYY");
        },
        filteredSongs: function () {
            var filteredSongs = [];
            var sSearch = this.searchText;
            var iFound = 0;
            this.songs.forEach(function (oSong, iIdx) {
                if (iFound === I_MAX_SONGS_IN_SEARCH) {
                    return;
                }
                if (oSong.number === sSearch || oSong.title.toLowerCase().indexOf(sSearch.toLowerCase()) > -1) {
                    filteredSongs.push(oSong);
                    iFound++;
                }
            });
            return filteredSongs;
        }
    },
});

function getPreviousSunday(sFormat, iDayOffset) {
    var m = function () { return moment.apply(this, arguments).locale("en-gb"); }
    var days = iDayOffset;
    while (m().add(days, "days").format("dddd") !== "Sunday") {
        days--;
    }
    return m().add(days, "days").format(sFormat || "LL");
}

function getNextSunday(sFormat) {
    var m = function () { return moment.apply(this, arguments).locale("en-gb"); }
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
        oClone.stats = app.stats;

        // update stats
        Object.keys(app.selectedSongs).forEach(function (sMoment) {
            var sSongNumber = app.selectedSongs[sMoment].number;
            if (!oClone.stats[sSongNumber]) {
                oClone.stats[sSongNumber] = {
                    count: 0
                };
            }
            oClone.stats[sSongNumber].count++;
            oClone.stats[sSongNumber].lastSung = getNextSunday("DD-MM-YYYY");
        });

        oClone.password = sPassword;
        oClone.saveAs = app.filename;
        request.send(JSON.stringify(oClone, null, 3));
    });
}
