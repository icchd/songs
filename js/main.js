var S_HEROKU_ENDPOINT = "http://icch-api.herokuapp.com/songs";

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
        songs: []
    },
    mounted: function () {
        var that = this;

        // check the url and log in with the log-in hash
        this.$http.get("songs.json").then(function (oData) {
            oData.body.list.forEach(function(oSong) {
                oSong.matches = true;
                that.songs.push(oSong);
            });
        });
    },
    methods: {
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
        setSong: function (sMoment) {
            var that = this;
            this.$refs.whichSong.close();

            if (this.selectedSongs[sMoment].number) {

                // remove existing before
                var iExistingPos = this.recentSongs.some(function (oSong) {
                    return oSong.number === that.selectedSongs[sMoment].number;
                });
                if (iExistingPos >= 0) {
                    this.recentSongs.splice(iExistingPos, 1);
                }

                this.recentSongs.unshift({
                    number: this.selectedSongs[sMoment].number,
                    title: this.selectedSongs[sMoment].title
                });

                if (this.recentSongs.length > 10) {
                    this.recentSongs.pop();
                }
            }

            this.selectedSongs[sMoment].number = that.selectedSong.number;
            this.selectedSongs[sMoment].title = that.selectedSong.title;
        },
        saveSongList: function () {
        },
        save: function () {
            var that = this;
            this.$refs.saveDialog.close();

            save(this.password);
        }
    },
    computed: {
        filteredSongs: function () {
            var oSelectedSongs,
                sText,
                that = this;

            sText = this.searchText;
            oSelectedSongs = {};

            Object.keys(this.selectedSongs).forEach(function (sType) {
                oSelectedSongs[that.selectedSongs[sType].number] = true;
            });

            return this.songs.filter(function (oSong) {
                return oSong.title.toLowerCase().indexOf(sText.toLowerCase()) > -1;
            }).map(function (oSong) {
                oSong.selected = oSelectedSongs[oSong.number];
                return oSong;
            });
        },
        nextSunday: function () {
            return getNextSunday("DD MMM YYYY");
        }
    },
});

function getNextSunday(sFormat) {
    var m = function () { return moment.apply(this, arguments).locale("en-gb"); }
    var days = 0;
    while (m().add(days, "days").format("dddd") !== "Sunday") {
        days++;
    }
    return m().add(days, "days").format(sFormat || "LL");
}

function save(sPassword) {
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
        oClone.password = sPassword;
        oClone.saveAs = app.filename;
        debugger;
        request.send(JSON.stringify(oClone));
    });
}
