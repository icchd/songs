(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.catholicReadingsLookup = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var oBooks = {
    abbrev: {
        "1 Chronicles": "1 Chr",
        "1 Corinthians": "1 Cor",
        "1 John": "1 John",
        "1 Kings": "1 Kgs",
        "1 Peter": "1 Pet",
        "1 Samuel": "1 Sam",
        "1 Thessalonians": "1 Thess",
        "1 Timothy": "1 Tm",
        "2 Chronicles": "2 Chr",
        "2 Corinthians": "2 Cor",
        "2 John": "2 John",
        "2 Kings": "2 Kgs",
        "2 Peter": "2 Pet",
        "2 Samuel": "2 Sam",
        "2 Thessalonians": "2 Thess",
        "2 Timothy": "2 Tm",
        "3 John": "3 John",
        "Acts": "Acts",
        "Amos": "Amos",
        "Colossians": "Col",
        "Daniel": "Dan",
        "Deuteronomy": "Deut",
        "Ecclesiastes": "Eccl",
        "Ephesians": "Eph",
        "Esther": "Esth",
        "Exodus": "Exod",
        "Ezekiel": "Ezek",
        "Ezra": "Ezra",
        "Galatians": "Gal",
        "Genesis": "Gn",
        "Habakkuk": "Hab",
        "Haggai": "Hag",
        "Hebrews": "Heb",
        "Hosea": "Hos",
        "Isaiah": "Is",
        "James": "Jas",
        "Jeremiah": "Jer",
        "Job": "Job",
        "Joel": "Joel",
        "John": "John",
        "Jonah": "Jonah",
        "Joshua": "Josh",
        "Jude": "Jude",
        "Judges": "Judg",
        "Lamentations": "Lam",
        "Leviticus": "Lev",
        "Luke": "Lk",
        "Malachi": "Mal",
        "Mark": "Mk",
        "Matthew": "Mt",
        "Micah": "Mic",
        "Nahum": "Nah",
        "Nehemiah": "Neh",
        "Numbers": "Num",
        "Obadiah": "Obad",
        "Philemon": "Phlm",
        "Philippians": "Phil",
        "Proverbs": "Prov",
        "Psalms": ["Ps", "Ps(s)"],
        "Revelation": "Rev",
        "Romans": "Rom",
        "Ruth": "Ruth",
        "Sirach": "Sir",
        "Song of Songs": "Song",
        "Titus": "Titus",
        "Wisdom": "Wis",
        "Zechariah": "Zech",
        "Zephaniah": "Zeph"
    }
};

function addReverseLookupsAndKeywords(Books) {
    if (!oBooks.keywords || !oBooks.abbrev_rev) {
        oBooks.keywords = [];
        oBooks.abbrev_rev = {};
        Object.keys(oBooks.abbrev).forEach(function (sLong) {
            // build reverse list
            var aShort = oBooks.abbrev[sLong];
            if (typeof aShort === "string") {
                aShort = [aShort];
            }

            aShort.forEach(function (sShort) {
                oBooks.abbrev_rev[sShort] = sLong;

                var oValue = {
                    short: sShort,
                    long: sLong,
                    toString: function toString() {
                        return sShort;
                    }
                };

                oBooks.keywords.push({
                    keyword: sLong.toLowerCase(),
                    value: oValue
                });
                oBooks.keywords.push({
                    keyword: sShort.toLowerCase(),
                    value: oValue
                });
            });
        });
    }
}

var oLookup = {
    "A": {
        "Easter Vigil": {
            "Old Testament": [{
                "reading": "Gen 1:1-2:2 or 1:1, 26-31a",
                "note": "1st Reading"
            }, {
                "reading": "Gen 22:1-18 or 22:1-2, 9a, 10-13, 15-18",
                "note": "2nd Reading"
            }, {
                "reading": "Exod 14:15—15:1",
                "note": "3rd Reading"
            }, {
                "reading": "Exod 15:1-2, 3-4, 5-6, 17-18",
                "note": "3rd Response"
            }, {
                "reading": "Isa 12:2-3, 4bcd, 5-6",
                "note": "5th Response"
            }, {
                "reading": "Isa 54:5-14",
                "note": "4th Reading"
            }, {
                "reading": "Isa 55:1-11",
                "note": "5th Reading"
            }, {
                "reading": "Bar 3:9-15, 32—4:4",
                "note": "6th Reading"
            }, {
                "reading": "Ezek 36:16-17a, 18-28",
                "note": "7th Reading"
            }],
            "Gospel": [{
                "reading": "Matt 28:1-10",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 6:3-11",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 16:5+8, 9-10, 11",
                "note": "resp. 2"
            }, {
                "reading": "Ps 19:8, 9, 10, 11",
                "note": "resp. 6"
            }, {
                "reading": "Ps 30:2+4, 5-6, 11-12a+13b",
                "note": "resp. 4"
            }, {
                "reading": "Ps 33:4-5, 6-7, 12-13, 20-22",
                "note": "resp. 1b"
            }, {
                "reading": "Ps 42:3, 5; 43:3, 4",
                "note": "resp. 7a"
            }, {
                "reading": "Ps 51:12-13, 14-15, 18-19",
                "note": "resp. 7b"
            }, {
                "reading": "Ps 104:1-2, 5-6, 10+12, 13-14, 24+35",
                "note": "resp. 1a"
            }, {
                "reading": "Ps 118:1-2, 16-17, 22-23",
                "note": "resp. 8"
            }]
        },
        "1st Sunday of Lent": {
            "Old Testament": [{
                "reading": "Gen 2:7-9; 3:1-7",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 4:1-11",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 5:12-19 or 5:12, 17-19",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 51:3-4, 5-6, 12-13, 14+17",
                "note": null
            }]
        },
        "Pentecost Sunday: Vigil Mass": {
            "Old Testament": [{
                "reading": "Gen 11:1-9",
                "note": "Option 1"
            }, {
                "reading": "Exod 19:3-8a, 16-20b",
                "note": "Option 2"
            }, {
                "reading": "Ezek 37:1-14",
                "note": "Option 3"
            }, {
                "reading": "Joel 3:1-5",
                "note": "Option 4"
            }],
            "Gospel": [{
                "reading": "John 7:37-39",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 8:22-27",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 104:1-2, 24+35, 27-28, 29b-30",
                "note": null
            }]
        },
        "2nd Sunday of Lent": {
            "Old Testament": [{
                "reading": "Gen 12:1-4a",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 17:1-9",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Tim 1:8b-10",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 33:4-5, 18-19, 20+22",
                "note": null
            }]
        },
        "Holy Thursday: Mass of the Lord’s Supper": {
            "Old Testament": [{
                "reading": "Exod 12:1-8, 11-14",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 13:1-15",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 11:23-26",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 116:12-13, 15-16, 17-18",
                "note": null
            }]
        },
        "3rd Sunday of Lent": {
            "Old Testament": [{
                "reading": "Exod 17:3-7",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 4:5-42 or 4:5-15, 19b-26, 39a, 40-42",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 5:1-2, 5-8",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 95:1-2, 6-7b, 7c-9",
                "note": null
            }]
        },
        "11th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Exod 19:2-6a",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 9:36—10:8",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 5:6-11",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 100:1-2, 3, 5",
                "note": null
            }]
        },
        "30th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Exod 22:20-26",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 22:34-40",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Thess 1:5c-10",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 18:2-3a, 3b-4, 47+51",
                "note": null
            }]
        },
        "Sunday after Pentecost: Holy Trinity": {
            "Old Testament": [{
                "reading": "Exod 34:4b-6, 8-9",
                "note": null
            }, {
                "reading": "Dan 3:52, 53, 54, 55",
                "note": "Response"
            }],
            "Gospel": [{
                "reading": "John 3:16-18",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Cor 13:11-13",
                "note": null
            }]
        },
        "7th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Lev 19:1-2, 17-18",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 5:38-48",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 3:16-23",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 103:1-2, 3-4, 8+10, 12-13",
                "note": null
            }]
        },
        "Jan. 1: Mary, Mother of God": {
            "Old Testament": [{
                "reading": "Num 6:22-27",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 2:16-21",
                "note": null
            }],
            "New Testament": [{
                "reading": "Gal 4:4-7",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 67:2-3, 5, 6+8",
                "note": null
            }]
        },
        "Friday after 2nd Sun after Pentecost: Sacred Heart": {
            "Old Testament": [{
                "reading": "Deut 7:6-11",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 11:25-30",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 John 4:7-16",
                "note": null
            }],
            "Psalm": [{
                "note": null
            }]
        },
        "Sunday after Trinity Sun: Body & Blood of Christ": {
            "Old Testament": [{
                "reading": "Deut 8:2-3, 14b-16a",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 6:51-58",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 10:16-17",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 147:12-13, 14-15, 19-20",
                "note": null
            }]
        },
        "9th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Deut 11:18, 26-28, 32",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 7:21-27",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 3:21-25, 28",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 31:2-3a, 3b-4, 17+25",
                "note": null
            }]
        },
        "4th Sunday of Lent": {
            "Old Testament": [{
                "reading": "1 Sam 16:1b, 6-7, 10-13a",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 9:1-41 or 9:1, 6-9, 13-17, 34-38",
                "note": null
            }],
            "New Testament": [{
                "reading": "Eph 5:8-14",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 23:1-3a, 3b-4, 5, 6",
                "note": null
            }]
        },
        "17th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "1 Kgs 3:5, 7-12",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 13:44-52 or 13:44-46",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 8:28-30",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 119:57+72, 76-77, 127-128, 129-130",
                "note": null
            }]
        },
        "19th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "1 Kgs 19:9a, 11-13a",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 14:22-33",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 9:1-5",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 85:9ab+10, 11-12, 13-14",
                "note": null
            }]
        },
        "13th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "2 Kgs 4:8-11, 14-16a",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 10:37-42",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 6:3-4, 8-11",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 89:2-3, 16-17, 18-19",
                "note": null
            }]
        },
        "33rd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Prov 31:10-13, 19-20, 30-31",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 25:14-30 or 25:14-15, 19-21",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Thess 5:1-6",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 128:1-2, 3, 4-5",
                "note": null
            }]
        },
        "32nd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Wis 6:12-16",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 25:1-13",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Thess 4:13-18 or 4:13-14",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 63:2, 3-4, 5-6, 7-8",
                "note": null
            }]
        },
        "16th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Wis 12:13, 16-19",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 13:24-43 or 13:24-30",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 8:26-27",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 86:5-6, 9-10, 15-16",
                "note": null
            }]
        },
        "Sunday in Octave of Christmas: Holy Family": {
            "Old Testament": [{
                "reading": "Sir 3:3-7, 14-17a",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 2:13-15, 19-23",
                "note": null
            }],
            "New Testament": [{
                "reading": "Col 3:12-21 or 3:12-17",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 128:1-2, 3, 4-5",
                "note": null
            }]
        },
        "6th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Sir 15:16-21",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 5:17-37 or 5:20-22a, 27-28, 33-34a, 37",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 2:6-10",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 119:1-2, 4-5, 17-18, 33-34",
                "note": null
            }]
        },
        "2nd Sunday after Christmas": {
            "Old Testament": [{
                "reading": "Sir 24:1-4, 12-16",
                "note": "note"
            }],
            "Gospel": [{
                "reading": "John 1:1-18 or 1:1-5, 9-14",
                "note": "note"
            }],
            "New Testament": [{
                "reading": "Eph 1:3-6, 15-18",
                "note": "note"
            }],
            "Psalm": [{
                "reading": "Ps 147:12-13, 14-15, 19-20",
                "note": "note"
            }]
        },
        "24th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Sir 27:30—28:7",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 18:21-35",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 14:7-9",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 103:1-2, 3-4, 9-10, 11-12",
                "note": null
            }]
        },
        "1st Sunday of Advent": {
            "Old Testament": [{
                "reading": "Isa 2:1-5",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 24:37-44",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 13:11-14",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 122:1-2, 3-4a, 4b-5, 6-7, 8-9",
                "note": null
            }]
        },
        "27th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 5:1-7",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 21:33-43",
                "note": null
            }],
            "New Testament": [{
                "reading": "Phil 4:6-9",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 80:9+12, 13-14, 15-16, 19-20",
                "note": null
            }]
        },
        "4th Sunday of Advent": {
            "Old Testament": [{
                "reading": "Isa 7:10-14",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 1:18-24",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 1:1-7",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 24:1-2, 3-4, 5-6",
                "note": null
            }]
        },
        "3rd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 8:23b—9:3",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 4:12-23 or 4:12-17",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 1:10-13, 17",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 27:1, 4, 13-14",
                "note": null
            }]
        },
        "Christmas: Mass at Midnight": {
            "Old Testament": [{
                "reading": "Isa 9:1-6",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 2:1-14",
                "note": null
            }],
            "New Testament": [{
                "reading": "Titus 2:11-14",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 96:1-2a, 2b-3, 11-12, 13",
                "note": null
            }]
        },
        "2nd Sunday of Advent": {
            "Old Testament": [{
                "reading": "Isa 11:1-10",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 3:1-12",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 15:4-9",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 72:1-2, 7-8, 12-13, 17",
                "note": null
            }]
        },
        "21st Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 22:19-23",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 16:13-20",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 11:33-36",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 138:1-2a, 2b-3, 6+8",
                "note": null
            }]
        },
        "28th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 25:6-10a",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 22:1-14 or 22:1-10",
                "note": null
            }],
            "New Testament": [{
                "reading": "Phil 4:12-14, 19-20",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 23:1-3a, 3b-4, 5, 6",
                "note": null
            }]
        },
        "3rd Sunday of Advent": {
            "Old Testament": [{
                "reading": "Isa 35:1-6a, 10",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 11:2-11",
                "note": null
            }],
            "New Testament": [{
                "reading": "Jas 5:7-10",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 146:6c-7, 8-9a, 9b-10",
                "note": null
            }]
        },
        "Sunday after Epiphany: Baptism of the Lord": {
            "Old Testament": [{
                "reading": "Isa 42:1-4, 6-7",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 3:13-17",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 10:34-38",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 29:1-2, 3-4, 3b+9b-10",
                "note": null
            }]
        },
        "29th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 45:1, 4-6",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 22:15-21",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Thess 1:1-5b",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 96:1+3, 4-5, 7-8, 9-10",
                "note": null
            }]
        },
        "2nd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 49: 3, 5-6",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 1:29-34",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 1:1-3",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 40:2+4, 7-8a, 8b-9, 10",
                "note": null
            }]
        },
        "8th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 49:14-15",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 6:24-34",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 4:1-5",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 62:2-3, 6-7, 8-9",
                "note": null
            }]
        },
        "Palm Sunday Mass": {
            "Old Testament": [{
                "reading": "Isa 50:4-7",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 26:14—27:66 or 27:11-54",
                "note": null
            }],
            "New Testament": [{
                "reading": "Phil 2:6-11",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 22:8-9, 17-18, 19-20, 23-24",
                "note": null
            }]
        },
        "Christmas: Mass during the Day": {
            "Old Testament": [{
                "reading": "Isa 52:7-10",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 1:1-18 or 1:1-5, 9-14",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 1:1-6",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 98:1, 2-3a, 3b-4, 5-6",
                "note": null
            }]
        },
        "Good Friday of the Lord’s Passion": {
            "Old Testament": [{
                "reading": "Isa 52:13—53:12",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 18:1—19:42",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 4:14-16; 5:7-9",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 31:2+6, 12-13, 15-16, 17+25",
                "note": null
            }]
        },
        "18th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 55:1-3",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 14:13-21",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 8:35, 37-39",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 145:8-9, 15-16, 17-18",
                "note": null
            }]
        },
        "25th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 55:6-9",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 20:1-16a",
                "note": null
            }],
            "New Testament": [{
                "reading": "Phil 1:20c-24, 27a",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 145:2-3, 8-9, 17-18",
                "note": null
            }]
        },
        "15th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 55:10-11",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 13:1-23 or 13:1-9",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 8:18-23",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 65:10, 11, 12-13, 14",
                "note": null
            }]
        },
        "20th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 56:1, 6-7",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 15:21-28",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 11:13-15, 29-32",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 67:2-3, 5, 6+8",
                "note": null
            }]
        },
        "5th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 58:7-10",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 5:13-16",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 2:1-5",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 112:4-5, 6-7, 8-9",
                "note": null
            }]
        },
        "The Epiphany of the Lord": {
            "Old Testament": [{
                "reading": "Isa 60:1-6",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 2:1-12",
                "note": null
            }],
            "New Testament": [{
                "reading": "Eph 3:2-3a, 5-6",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 72:1-2, 7-8, 10-11, 12-13",
                "note": null
            }]
        },
        "Christmas: Vigil Mass": {
            "Old Testament": [{
                "reading": "Isa 62:1-5",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 1:1-25 or 1:18-25",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 13:16-17, 22-25",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 89:4-5, 16-17, 27+29",
                "note": null
            }]
        },
        "Christmas: Mass at Dawn": {
            "Old Testament": [{
                "reading": "Isa 62:11-12",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 2:15-20",
                "note": null
            }],
            "New Testament": [{
                "reading": "Titus 3:4-7",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 97:1+6, 11-12",
                "note": null
            }]
        },
        "22nd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Jer 20:7-9",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 16:21-27",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 12:1-2",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 63:2, 3-4, 5-6, 8-9",
                "note": null
            }]
        },
        "12th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Jer 20:10-13",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 10:26-33",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 5:12-15",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 69:8-10, 14+17, 33-35",
                "note": null
            }]
        },
        "26th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Ezek 18:25-28",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 21:28-32",
                "note": null
            }],
            "New Testament": [{
                "reading": "Phil 2:1-11 or 2:1-5",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 25:4-5, 6-7, 8-9",
                "note": null
            }]
        },
        "23rd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Ezek 33:7-9",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 18:15-20",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 13:8-10",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 95:1-2, 6-7b, 7c-9",
                "note": null
            }]
        },
        "34th Sunday in Ord. Time: Christ the King": {
            "Old Testament": [{
                "reading": "Ezek 34:11-12, 15-17",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 25:31-46",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 15:20-26, 28",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 23:1-2a, 2b-3, 5, 6",
                "note": null
            }]
        },
        "5th Sunday of Lent": {
            "Old Testament": [{
                "reading": "Ezek 37:12-14",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 11:1-45 or 11:3-7, 17, 20-27, 33b-45",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 8:8-11",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 130:1-2, 3-4, 5-6, 7-8",
                "note": null
            }]
        },
        "10th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Hos 6:3-6",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 9:9-13",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 4:18-25",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 50:1+8, 12-13, 14-15",
                "note": null
            }]
        },
        "4th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Zeph 2:3; 3:12-13",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 5:1-12a",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 1:26-31",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 146:6c-7, 8-9a, 9b-10",
                "note": null
            }]
        },
        "14th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Zech 9:9-10",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 11:25-30",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 8:9, 11-13",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 145:1-2, 8-9, 10-11, 13-14",
                "note": null
            }]
        },
        "31st Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Mal 1:14b—2:2b, 8-10",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 23:1-12",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Thess 2:7b-9, 13",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 131:1, 2, 3",
                "note": null
            }]
        },
        "Palm Sunday: Procession of Palms": {
            "Gospel": [{
                "reading": "Matt 21:1-11",
                "note": null
            }]
        },
        "Ascension of the Lord": {
            "Gospel": [{
                "reading": "Matt 28:16-20",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 1:1-11",
                "note": null
            }, {
                "reading": "Eph 1:17-23",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 47:2-3, 6-7, 8-9",
                "note": null
            }]
        },
        "Easter Sunday: Resurrection of the Lord": {
            "Gospel": [{
                "reading": "Luke 24:13-35",
                "note": "opt. 2"
            }, {
                "reading": "John 20:1-9",
                "note": "opt. 1"
            }],
            "New Testament": [{
                "reading": "Acts 10:34a, 37-43",
                "note": null
            }, {
                "reading": "1 Cor 5:6b-8",
                "note": "opt. 2"
            }, {
                "reading": "Col 3:1-4",
                "note": "opt. 1"
            }],
            "Psalm": [{
                "reading": "Ps 118:1-2, 16-17, 22-23",
                "note": null
            }]
        },
        "3rd Sunday of Easter": {
            "Gospel": [{
                "reading": "Luke 24:13-35",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 2:14, 22-33",
                "note": null
            }, {
                "reading": "1 Pet 1:17-21",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 16:1-2a+5, 7-8, 9-10, 11",
                "note": null
            }]
        },
        "4th Sunday of Easter": {
            "Gospel": [{
                "reading": "John 10:1-10",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 2:14a, 36-41",
                "note": null
            }, {
                "reading": "1 Pet 2:20b-25",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 23:1-3a, 3b-4, 5, 6",
                "note": null
            }]
        },
        "5th Sunday of Easter": {
            "Gospel": [{
                "reading": "John 14:1-12",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 6:1-7",
                "note": null
            }, {
                "reading": "1 Pet 2:4-9",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 33:1-2, 4-5, 18-19",
                "note": null
            }]
        },
        "6th Sunday of Easter": {
            "Gospel": [{
                "reading": "John 14:15-21",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 8:5-8, 14-17",
                "note": null
            }, {
                "reading": "1 Pet 3:15-18",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 66:1-3, 4-5, 6-7, 16+20",
                "note": null
            }]
        },
        "7th Sunday of Easter": {
            "Gospel": [{
                "reading": "John 17:1-11a",
                "note": "note"
            }],
            "New Testament": [{
                "reading": "Acts 1:12-14",
                "note": "note"
            }, {
                "reading": "1 Pet 4:13-16",
                "note": "note"
            }],
            "Psalm": [{
                "reading": "Ps 27:1, 4, 7-8",
                "note": "note"
            }]
        },
        "Pentecost Sunday": {
            "Gospel": [{
                "reading": "John 20:19-23",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 2:1-11",
                "note": null
            }, {
                "reading": "1 Cor 12:3b-7, 12-13",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 104:1+24, 29-30, 31+34",
                "note": null
            }]
        },
        "2nd Sunday of Easter": {
            "Gospel": [{
                "reading": "John 20:19-31",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 2:42-47",
                "note": null
            }, {
                "reading": "1 Pet 1:3-9",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 118:2-4, 13-15, 22-24",
                "note": null
            }]
        }
    },
    "B": {
        "Easter Vigil": {
            "Old Testament": [{
                "reading": "Gen 1:1—2:2 or 1:1, 26-31a",
                "note": "1st Reading"
            }, {
                "reading": "Gen 22:1-18 or 22:1-2, 9a, 10-13, 15-18",
                "note": "2nd Reading"
            }, {
                "reading": "Exod 14:15—15:1",
                "note": "3rd Reading"
            }, {
                "reading": "Exod 15:1-2, 3-4, 5-6, 17-18",
                "note": "3rd Response"
            }, {
                "reading": "Isa 12:2-3, 4bcd, 5-6",
                "note": "5th Response"
            }, {
                "reading": "Isa 54:5-14",
                "note": "4th Reading"
            }, {
                "reading": "Isa 55:1-11",
                "note": "5th Reading"
            }, {
                "reading": "Bar 3:9-15, 32—4:4",
                "note": "6th Reading"
            }, {
                "reading": "Ezek 36:16-17a, 18-28",
                "note": "7th Reading"
            }],
            "Gospel": [{
                "reading": "Mark 16:1-7",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 6:3-11",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 16:5+8, 9-10, 11",
                "note": "resp. 2"
            }, {
                "reading": "Ps 19:8, 9, 10, 11",
                "note": "resp. 6"
            }, {
                "reading": "Ps 30:2+4, 5-6, 11-12a+13b",
                "note": "resp. 4"
            }, {
                "reading": "Ps 33:4-5, 6-7, 12-13, 20-22",
                "note": "resp. 1b"
            }, {
                "reading": "Ps 42:3, 5; 43:3, 4",
                "note": "resp. 7a"
            }, {
                "reading": "Ps 51:12-13, 14-15, 18-19",
                "note": "resp. 7b"
            }, {
                "reading": "Ps 104:1-2, 5-6, 10+12, 13-14, 24+35",
                "note": "resp. 1a"
            }, {
                "reading": "Ps 118:1-2, 16-17, 22-23",
                "note": "resp. 8"
            }]
        },
        "27th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Gen 2:18-24",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 10:2-16 or 10:2-12",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 2:9-11",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 128:1-2, 3, 4-5, 6",
                "note": null
            }]
        },
        "10th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Gen 3:9-15",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 3:20-35",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Cor 4:13—5:1",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 130:1-2, 3-4, 5-6, 7-8",
                "note": null
            }]
        },
        "1st Sunday of Lent": {
            "Old Testament": [{
                "reading": "Gen 9:8-15",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 1:12-15",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Pet 3:18-22",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 25:4-5, 6-7, 8-9",
                "note": null
            }]
        },
        "Pentecost Sunday: Vigil Mass": {
            "Old Testament": [{
                "reading": "Gen 11:1-9",
                "note": "Option 1"
            }, {
                "reading": "Exod 19:3-8a, 16-20b",
                "note": "Option 2"
            }, {
                "reading": "Ezek 37:1-14",
                "note": "Option 3"
            }, {
                "reading": "Joel 3:1-5",
                "note": "Option 4"
            }],
            "Gospel": [{
                "reading": "John 7:37-39",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 8:22-27",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 104:1-2, 24+35, 27-28, 29b-30",
                "note": null
            }]
        },
        "Sunday in Octave of Christmas: Holy Family": {
            "Old Testament": [{
                "reading": "Gen 15:1-6; 21:1-3",
                "note": "opt. B"
            }, {
                "reading": "Sir 3:3-7, 14-17a",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 2:22-40 or 2:22, 39-40",
                "note": null
            }],
            "New Testament": [{
                "reading": "Col 3:12-21 or 3:12-17",
                "note": null
            }, {
                "reading": "Heb 11:8, 11-12, 17-19",
                "note": "opt. B"
            }],
            "Psalm": [{
                "reading": "Ps 105:1-2, 3-4, 5-6, 8-9",
                "note": "opt. B"
            }, {
                "reading": "Ps 128:1-2, 3, 4-5",
                "note": null
            }]
        },
        "2nd Sunday of Lent": {
            "Old Testament": [{
                "reading": "Gen 22:1-2, 9a, 10-13, 15-18",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 9:2-10",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 8:31b-34",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 116:10+15, 16-17, 18-19",
                "note": null
            }]
        },
        "Holy Thursday: Mass of the Lord’s Supper": {
            "Old Testament": [{
                "reading": "Exod 12:1-8, 11-14",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 13:1-15",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 11:23-26",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 116:12-13, 15-16, 17-18",
                "note": null
            }]
        },
        "18th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Exod 16:2-4, 12-15",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 6:24-35",
                "note": null
            }],
            "New Testament": [{
                "reading": "Eph 4:17, 20-24",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 78:3-4, 23-24, 25+54",
                "note": null
            }]
        },
        "3rd Sunday of Lent": {
            "Old Testament": [{
                "reading": "Exod 20:1-17 or 20:1-3, 7-8, 12-17",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 2:13-25",
                "note": null
            }, {
                "reading": "John 4:5-42 or 4:5-15, 19b-26, 39a, 40-42",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 1:22-25",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 19:8, 9, 10, 11",
                "note": null
            }]
        },
        "Sunday after Trinity Sun: Body & Blood of Christ": {
            "Old Testament": [{
                "reading": "Exod 24:3-8",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 14:12-16, 22-26",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 9:11-15",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 116:12-13, 15-16, 17-18",
                "note": null
            }]
        },
        "6th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Lev 13:1-2, 44-46",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 1:40-45",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 10:31—11:1",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 32:1-2, 5, 11",
                "note": null
            }]
        },
        "Jan. 1: Mary, Mother of God": {
            "Old Testament": [{
                "reading": "Num 6:22-27",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 2:16-21",
                "note": null
            }],
            "New Testament": [{
                "reading": "Gal 4:4-7",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 67:2-3, 5, 6+8",
                "note": null
            }]
        },
        "26th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Num 11:25-29",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 9:38-43, 45, 47-48",
                "note": null
            }],
            "New Testament": [{
                "reading": "Jas 5:1-6",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 19:8, 10, 12-13, 14",
                "note": null
            }]
        },
        "22nd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Deut 4:1-2, 6-8",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 7:1-8, 14-15, 21-23",
                "note": null
            }],
            "New Testament": [{
                "reading": "Jas 1:17-18, 21b-22, 27",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 15:2-3a, 3b-4a, 4b-5",
                "note": null
            }]
        },
        "Sunday after Pentecost: Holy Trinity": {
            "Old Testament": [{
                "reading": "Deut 4:32-34, 39-40",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 28:16-20",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 8:14-17",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 33:4-5, 6+9, 18-19, 20+22",
                "note": null
            }]
        },
        "9th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Deut 5:12-15",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 2:23—3:6 or 2:23-28",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Cor 4:6-11",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 81:3-4, 5-6, 7-8, 10-11",
                "note": null
            }]
        },
        "31st Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Deut 6:2-6",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 12:28b-34",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 7:23-28",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 18:2-3a, 3b-4, 47+51",
                "note": null
            }]
        },
        "4th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Deut 18:15-20",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 1:21-28",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 7:32-35",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 95:1-2, 6-7b, 7c-9",
                "note": null
            }]
        },
        "21st Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Josh 24:1-2a, 15-17, 18b",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 6:60-69",
                "note": null
            }],
            "New Testament": [{
                "reading": "Eph 5:21-32 or 5:2a, 25-32",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 34:2-3, 16-17, 18-19, 20-21",
                "note": null
            }]
        },
        "2nd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "1 Sam 3:3b-10, 19",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 1:35-42",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 6:13c-15a, 17-20",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 40:2+4, 7-8a, 8b-9, 10",
                "note": null
            }]
        },
        "4th Sunday of Advent": {
            "Old Testament": [{
                "reading": "2 Sam 7:1-5, 8b-12, 14a, 16",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 1:26-38",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 16:25-27",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 89:2-3, 4-5, 27+29",
                "note": null
            }]
        },
        "32nd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "1 Kgs 17:10-16",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 12:38-44 or 12:41-44",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 9:24-28",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 146:6c-7, 8-9a, 9b-10",
                "note": null
            }]
        },
        "19th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "1 Kgs 19:4-8",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 6:41-51",
                "note": null
            }],
            "New Testament": [{
                "reading": "Eph 4:30—5:2",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 34:2-3, 4-5, 6-7, 8-9",
                "note": null
            }]
        },
        "17th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "2 Kgs 4:42-44",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 6:1-15",
                "note": null
            }],
            "New Testament": [{
                "reading": "Eph 4:1-6",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 145:10-11, 15-16, 17-18",
                "note": null
            }]
        },
        "4th Sunday of Lent": {
            "Old Testament": [{
                "reading": "2 Chr 36:14-16, 19-23",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 3:14-21",
                "note": null
            }, {
                "reading": "John 9:1-41 or 9:1, 6-9, 13-17, 34-38",
                "note": null
            }],
            "New Testament": [{
                "reading": "Eph 2:4-10",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 137:1-2, 3, 4-5, 6",
                "note": null
            }]
        },
        "5th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Job 7:1-4, 6-7",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 1:29-39",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 9:16-19, 22-23",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 147:1-2, 3-4, 5-6",
                "note": null
            }]
        },
        "12th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Job 38:1, 8-11",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 4:35-41",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Cor 5:14-17",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 107:23-24, 25-26, 28-29, 30-31",
                "note": null
            }]
        },
        "20th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Prov 9:1-6",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 6:51-58",
                "note": null
            }],
            "New Testament": [{
                "reading": "Eph 5:15-20",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 34:2-3, 4-5, 6-7",
                "note": null
            }]
        },
        "13th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Wis 1:13-15, 2:23-24",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 5:21-43 or 5:21-24, 35-43",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Cor 8:7, 9, 13-15",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 30:2+4, 5-6, 11-12a+13b",
                "note": null
            }]
        },
        "25th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Wis 2:12, 17-20",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 9:30-37",
                "note": null
            }],
            "New Testament": [{
                "reading": "Jas 3:16—4:3",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 54:3-4, 5, 6-8",
                "note": null
            }]
        },
        "28th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Wis 7:7-11",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 10:17-30 or 10:17-27",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 4:12-13",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 90:12-13, 14-15, 16-17",
                "note": null
            }]
        },
        "2nd Sunday after Christmas": {
            "Old Testament": [{
                "reading": "Sir 24:1-4, 12-16",
                "note": "note"
            }],
            "Gospel": [{
                "reading": "John 1:1-18 or 1:1-5, 9-14",
                "note": "note"
            }],
            "New Testament": [{
                "reading": "Eph 1:3-6, 15-18",
                "note": "note"
            }],
            "Psalm": [{
                "reading": "Ps 147:12-13, 14-15, 19-20",
                "note": "note"
            }]
        },
        "Christmas: Mass at Midnight": {
            "Old Testament": [{
                "reading": "Isa 9:1-6",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 2:1-14",
                "note": null
            }],
            "New Testament": [{
                "reading": "Titus 2:11-14",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 96:1-2a, 2b-3, 11-12, 13",
                "note": null
            }]
        },
        "Sun after Epiphany: Baptism of the Lord": {
            "Old Testament": [{
                "reading": "Isa 12:2-3, 4bcd, 5-6",
                "note": "opt. B; Response"
            }]
        },
        "Sacred Heart Friday": {
            "Old Testament": [{
                "reading": "Isa 12:2-3, 4bcd, 5-6",
                "note": "Response"
            }]
        },
        "23rd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 35:4-7a",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 7:31-37",
                "note": null
            }],
            "New Testament": [{
                "reading": "Jas 2:1-5",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 146:6c-7, 8-9a, 9b-10",
                "note": null
            }]
        },
        "2nd Sunday of Advent": {
            "Old Testament": [{
                "reading": "Isa 40:1-5, 9-11",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 1:1-8",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Pet 3:8-14",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 85:9ab+10, 11-12, 13-14",
                "note": null
            }]
        },
        "Sunday after Epiphany: Baptism of the Lord": {
            "Old Testament": [{
                "reading": "Isa 42:1-4, 6-7",
                "note": null
            }, {
                "reading": "Isa 55:1-11",
                "note": "opt. B"
            }],
            "Gospel": [{
                "reading": "Mark 1:7-11",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 10:34-38",
                "note": null
            }, {
                "reading": "1 John 5:1-9",
                "note": "opt. B"
            }],
            "Psalm": [{
                "reading": "Ps 29:1-2, 3-4, 3b+9b-10",
                "note": null
            }]
        },
        "7th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 43:18-19, 21-22, 24b-25",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 2:1-12",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Cor 1:18-22",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 41:2-3, 4-5, 13-14",
                "note": null
            }]
        },
        "Palm Sunday Mass": {
            "Old Testament": [{
                "reading": "Isa 50:4-7",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 14:1—15:47 or 15:1-39",
                "note": null
            }],
            "New Testament": [{
                "reading": "Phil 2:6-11",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 22:8-9, 17-18, 19-20, 23-24",
                "note": null
            }]
        },
        "24th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 50:4-9a",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 8:27-35",
                "note": null
            }],
            "New Testament": [{
                "reading": "Jas 2:14-18",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 116:1-2, 3-4, 5-6, 8-9",
                "note": null
            }]
        },
        "Christmas: Mass during the Day": {
            "Old Testament": [{
                "reading": "Isa 52:7-10",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 1:1-18 or 1:1-5, 9-14",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 1:1-6",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 98:1, 2-3a, 3b-4, 5-6",
                "note": null
            }]
        },
        "Good Friday of the Lord’s Passion": {
            "Old Testament": [{
                "reading": "Isa 52:13—53:12",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 18:1—19:42",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 4:14-16; 5:7-9",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 31:2+6, 12-13, 15-16, 17+25",
                "note": null
            }]
        },
        "29th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 53:10-11",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 10:35-45 or 10:42-45",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 4:14-16",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 33:4-5, 18-19, 20+22",
                "note": null
            }]
        },
        "The Epiphany of the Lord": {
            "Old Testament": [{
                "reading": "Isa 60:1-6",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 2:1-12",
                "note": null
            }],
            "New Testament": [{
                "reading": "Eph 3:2-3a, 5-6",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 72:1-2, 7-8, 10-11, 12-13",
                "note": null
            }]
        },
        "3rd Sunday of Advent": {
            "Old Testament": [{
                "reading": "Isa 61:1-2a, 10-11",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 1:46-48, 49-50, 53-54",
                "note": "resp."
            }, {
                "reading": "John 1:6-8, 19-28",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Thess 5:16-24",
                "note": null
            }]
        },
        "Christmas: Vigil Mass": {
            "Old Testament": [{
                "reading": "Isa 62:1-5",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 1:1-25 or 1:18-25",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 13:16-17, 22-25",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 89:4-5, 16-17, 27+29",
                "note": null
            }]
        },
        "Christmas: Mass at Dawn": {
            "Old Testament": [{
                "reading": "Isa 62:11-12",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 2:15-20",
                "note": null
            }],
            "New Testament": [{
                "reading": "Titus 3:4-7",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 97:1+6, 11-12",
                "note": null
            }]
        },
        "1st Sunday of Advent": {
            "Old Testament": [{
                "reading": "Isa 63:16b-17, 19b; 64:2-7",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 13:33-37",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 1:3-9",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 80:2-3, 15-16, 18-19",
                "note": null
            }]
        },
        "16th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Jer 23:1-6",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 6:30-34",
                "note": null
            }],
            "New Testament": [{
                "reading": "Eph 2:13-18",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 23:1-3a, 3b-4, 5, 6",
                "note": null
            }]
        },
        "30th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Jer 31:7-9",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 10:46-52",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 5:1-6",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 126:1-2a, 2b-3, 4-5, 6",
                "note": null
            }]
        },
        "5th Sunday of Lent": {
            "Old Testament": [{
                "reading": "Jer 31:31-34",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 11:1-45 or 11:3-7, 17, 20-27, 33b-45",
                "note": null
            }, {
                "reading": "John 12:20-33",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 5:7-9",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 51:3-4, 12-13, 14-15",
                "note": null
            }]
        },
        "14th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Ezek 2:2-5",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 6:1-6",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Cor 12:7-10",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 123:1-2a, 2bc, 3-4",
                "note": null
            }]
        },
        "11th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Ezek 17:22-24",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 4:26-34",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Cor 5:6-10",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 92:2-3, 13-14, 15-16",
                "note": null
            }]
        },
        "34th Sunday in Ord. Time: Christ the King": {
            "Old Testament": [{
                "reading": "Dan 7:13-14",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 18:33b-37",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rev 1:5-8",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 93:1a, 1b-2, 5",
                "note": null
            }]
        },
        "33rd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Dan 12:1-3",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 13:24-32",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 10:11-14, 18",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 16:5+8, 9-10, 11",
                "note": null
            }]
        },
        "8th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Hos 2:16b, 17b, 21-22",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 2:18-22",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Cor 3:1b-6",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 103:1-2, 3-4, 8+10, 12-13",
                "note": null
            }]
        },
        "Friday after 2nd Sun after Pentecost: Sacred Heart": {
            "Old Testament": [{
                "reading": "Hos 11:1, 3-4, 8c-9",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 19:31-37",
                "note": null
            }],
            "New Testament": [{
                "reading": "Eph 3:8-12, 14-19",
                "note": null
            }]
        },
        "15th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Amos 7:12-15",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 6:7-13",
                "note": null
            }],
            "New Testament": [{
                "reading": "Eph 1:3-14 or 1:3-10",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 85:9ab+10, 11-12, 13-14",
                "note": null
            }]
        },
        "3rd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Jon 3:1-5, 10",
                "note": null
            }],
            "Gospel": [{
                "reading": "Mark 1:14-20",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 7:29-31",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 25:4-5, 6-7, 8-9",
                "note": null
            }]
        },
        "Palm Sunday: Procession of Palms": {
            "Gospel": [{
                "reading": "Mark 11:1-10",
                "note": "opt. 1"
            }, {
                "reading": "John 12:12-16",
                "note": "opt. 2"
            }]
        },
        "Ascension of the Lord": {
            "Gospel": [{
                "reading": "Mark 16:15-20",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 1:1-11",
                "note": null
            }, {
                "reading": "Eph 1:17-23",
                "note": null
            }, {
                "reading": "Eph 4:1-13 or 4:1-7, 11-13",
                "note": "opt. B"
            }],
            "Psalm": [{
                "reading": "Ps 47:2-3, 6-7, 8-9",
                "note": null
            }]
        },
        "Easter Sunday: Resurrection of the Lord": {
            "Gospel": [{
                "reading": "Luke 24:13-35",
                "note": "opt. 2"
            }, {
                "reading": "John 20:1-9",
                "note": "opt. 1"
            }],
            "New Testament": [{
                "reading": "Acts 10:34a, 37-43",
                "note": null
            }, {
                "reading": "1 Cor 5:6b-8",
                "note": "opt. 2"
            }, {
                "reading": "Col 3:1-4",
                "note": "opt. 1"
            }],
            "Psalm": [{
                "reading": "Ps 118:1-2, 16-17, 22-23",
                "note": null
            }]
        },
        "3rd Sunday of Easter": {
            "Gospel": [{
                "reading": "Luke 24:35-48",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 3:13-15, 17-19",
                "note": null
            }, {
                "reading": "1 John 2:1-5a",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 4:2, 4, 7-8, 9",
                "note": null
            }]
        },
        "4th Sunday of Easter": {
            "Gospel": [{
                "reading": "John 10:11-18",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 4:8-12",
                "note": null
            }, {
                "reading": "1 John 3:1-2",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 118:1+8-9, 21-23, 26+21+29",
                "note": null
            }]
        },
        "5th Sunday of Easter": {
            "Gospel": [{
                "reading": "John 15:1-8",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 9:26-31",
                "note": null
            }, {
                "reading": "1 John 3:18-24",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 22:26-27, 28+30, 31-32",
                "note": null
            }]
        },
        "6th Sunday of Easter": {
            "Gospel": [{
                "reading": "John 15:9-17",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 10:25-26, 34-35, 44-48",
                "note": null
            }, {
                "reading": "1 John 4:7-10",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 98:1, 2-3a, 3b-4",
                "note": null
            }]
        },
        "Pentecost Sunday": {
            "Gospel": [{
                "reading": "John 15:26-27; 16:12-15",
                "note": "opt. B"
            }, {
                "reading": "John 20:19-23",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 2:1-11",
                "note": null
            }, {
                "reading": "1 Cor 12:3b-7, 12-13",
                "note": null
            }, {
                "reading": "Gal 5:16-25",
                "note": "opt. B"
            }],
            "Psalm": [{
                "reading": "Ps 104:1+24, 29-30, 31+34",
                "note": null
            }]
        },
        "7th Sunday of Easter": {
            "Gospel": [{
                "reading": "John 17:11b-19",
                "note": "note"
            }],
            "New Testament": [{
                "reading": "Acts 1:15-17, 20a, 20c-26",
                "note": "note"
            }, {
                "reading": "1 John 4:11-16",
                "note": "note"
            }],
            "Psalm": [{
                "reading": "Ps 103:1-2, 11-12, 19-20",
                "note": "note"
            }]
        },
        "2nd Sunday of Easter": {
            "Gospel": [{
                "reading": "John 20:19-31",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 4:32-35",
                "note": null
            }, {
                "reading": "1 John 5:1-6",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 118:2-4, 13-15, 22-24",
                "note": null
            }]
        }
    },
    "C": {
        "Easter Vigil": {
            "Old Testament": [{
                "reading": "Gen 1:1—2:2 or 1:1, 26-31a",
                "note": "1st Reading"
            }, {
                "reading": "Gen 22:1-18 or 22:1-2, 9a, 10-13, 15-18",
                "note": "2nd Reading"
            }, {
                "reading": "Exod 14:15—15:1",
                "note": "3rd Reading"
            }, {
                "reading": "Exod 15:1-2, 3-4, 5-6, 17-18",
                "note": "3rd Response"
            }, {
                "reading": "Isa 12:2-3, 4bcd, 5-6",
                "note": "5th Response"
            }, {
                "reading": "Isa 54:5-14",
                "note": "4th Reading"
            }, {
                "reading": "Isa 55:1-11",
                "note": "5th Reading"
            }, {
                "reading": "Bar 3:9-15, 32—4:4",
                "note": "6th Reading"
            }, {
                "reading": "Ezek 36:16-17a, 18-28",
                "note": "7th Reading"
            }],
            "Gospel": [{
                "reading": "Luke 24:1-12",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 6:3-11",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 16:5+8, 9-10, 11",
                "note": "resp. 2"
            }, {
                "reading": "Ps 19:8, 9, 10, 11",
                "note": "resp. 6"
            }, {
                "reading": "Ps 30:2+4, 5-6, 11-12a+13b",
                "note": "resp. 4"
            }, {
                "reading": "Ps 33:4-5, 6-7, 12-13, 20-22",
                "note": "resp. 1b"
            }, {
                "reading": "Ps 42:3, 5; 43:3, 4",
                "note": "resp. 7a"
            }, {
                "reading": "Ps 51:12-13, 14-15, 18-19",
                "note": "resp. 7b"
            }, {
                "reading": "Ps 104:1-2, 5-6, 10+12, 13-14, 24+35",
                "note": "resp. 1a"
            }, {
                "reading": "Ps 118:1-2, 16-17, 22-23",
                "note": "resp. 8"
            }]
        },
        "Pentecost Sunday: Vigil Mass": {
            "Old Testament": [{
                "reading": "Gen 11:1-9",
                "note": "Option 1"
            }, {
                "reading": "Exod 19:3-8a, 16-20b",
                "note": "Option 2"
            }, {
                "reading": "Ezek 37:1-14",
                "note": "Option 3"
            }, {
                "reading": "Joel 3:1-5",
                "note": "Option 4"
            }],
            "Gospel": [{
                "reading": "John 7:37-39",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 8:22-27",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 104:1-2, 24+35, 27-28, 29b-30",
                "note": null
            }]
        },
        "Sunday after Trinity Sun: Body & Blood of Christ": {
            "Old Testament": [{
                "reading": "Gen 14:18-20",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 9:11b-17",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 11:23-26",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 110:1, 2, 3, 4",
                "note": null
            }]
        },
        "2nd Sunday of Lent": {
            "Old Testament": [{
                "reading": "Gen 15:5-12, 17-18",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 9:28b-36",
                "note": null
            }],
            "New Testament": [{
                "reading": "Phil 3:17—4:1 or 3:20—4:1",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 27:1, 7-8a, 8b-9, 13-14",
                "note": null
            }]
        },
        "16th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Gen 18:1-10a",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 10:38-42",
                "note": null
            }],
            "New Testament": [{
                "reading": "Col 1:24-28",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 15:2-3a, 3b-4, 5",
                "note": null
            }]
        },
        "17th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Gen 18:20-32",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 11:1-13",
                "note": null
            }],
            "New Testament": [{
                "reading": "Col 2:12-14",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 138:1-2a, 2b-3, 6-7a, 7b-8",
                "note": null
            }]
        },
        "3rd Sunday of Lent": {
            "Old Testament": [{
                "reading": "Exod 3:1-8a, 13-15",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 13:1-9",
                "note": null
            }, {
                "reading": "John 4:5-42 or 4:5-15, 19b-26, 39a, 40-42",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 10:1-6, 10-12",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 103:1-2, 3-4, 6-7, 8+11",
                "note": null
            }]
        },
        "Holy Thursday: Mass of the Lord’s Supper": {
            "Old Testament": [{
                "reading": "Exod 12:1-8, 11-14",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 13:1-15",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 11:23-26",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 116:12-13, 15-16, 17-18",
                "note": null
            }]
        },
        "29th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Exod 17:8-13",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 18:1-8",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Tim 3:14—4:2",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 121:1-2, 3-4, 5-6, 7-8",
                "note": null
            }]
        },
        "24th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Exod 32:7-11, 13-14",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 15:1-32 or 15:1-10",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Tim 1:12-17",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 51:3-4, 12-13, 17+19",
                "note": null
            }]
        },
        "Jan. 1: Mary, Mother of God": {
            "Old Testament": [{
                "reading": "Num 6:22-27",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 2:16-21",
                "note": null
            }],
            "New Testament": [{
                "reading": "Gal 4:4-7",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 67:2-3, 5, 6+8",
                "note": null
            }]
        },
        "1st Sunday of Lent": {
            "Old Testament": [{
                "reading": "Deut 26:4-10",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 4:1-13",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 10:8-13",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 91:1-2, 10-11, 12-13, 14-15",
                "note": null
            }]
        },
        "15th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Deut 30:10-14",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 10:25-37",
                "note": null
            }],
            "New Testament": [{
                "reading": "Col 1:15-20",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 19:8, 9, 10, 11",
                "note": "opt. 2"
            }, {
                "reading": "Ps 69:14+17, 30-31, 33-34, 36a+37",
                "note": "opt. 1"
            }]
        },
        "4th Sunday of Lent": {
            "Old Testament": [{
                "reading": "Josh 5:9a, 10-12",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 15:1-3, 11-32",
                "note": null
            }, {
                "reading": "John 9:1-41 or 9:1, 6-9, 13-17, 34-38",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Cor 5:17-21",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 34:2-3, 4-5, 6-7",
                "note": null
            }]
        },
        "Sunday in Octave of Christmas: Holy Family": {
            "Old Testament": [{
                "reading": "1 Sam 1:20-22, 24-28",
                "note": "opt.C"
            }, {
                "reading": "Sir 3:3-7, 14-17a",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 2:41-52",
                "note": null
            }],
            "New Testament": [{
                "reading": "Col 3:12-21 or 3:12-17",
                "note": null
            }, {
                "reading": "1 John 3:1-2, 21-24",
                "note": "opt. C"
            }],
            "Psalm": [{
                "reading": "Ps 84:2-3, 5-6, 9-10",
                "note": "opt. C"
            }, {
                "reading": "Ps 128:1-2, 3, 4-5",
                "note": null
            }]
        },
        "7th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "1 Sam 26:2, 7-9, 12-13, 22-23",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 6:27-38",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 15:45-49",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 103:1-2, 3-4, 8+10, 12-13",
                "note": null
            }]
        },
        "34th Sunday in Ord. Time: Christ the King": {
            "Old Testament": [{
                "reading": "2 Sam 5:1-3",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 23:35-43",
                "note": null
            }],
            "New Testament": [{
                "reading": "Col 1:12-20",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 122:1-2, 3-4a, 4b-5",
                "note": null
            }]
        },
        "11th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "2 Sam 12:7-10, 13",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 7:36—8:3 or 7:36-50",
                "note": null
            }],
            "New Testament": [{
                "reading": "Gal 2:16, 19-21",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 32:1-2, 5, 7, 11",
                "note": null
            }]
        },
        "9th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "1 Kgs 8:41-43",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 7:1-10",
                "note": null
            }],
            "New Testament": [{
                "reading": "Gal 1:1-2, 6-10",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 117:1, 2",
                "note": null
            }]
        },
        "10th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "1 Kgs 17:17-24",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 7:11-17",
                "note": null
            }],
            "New Testament": [{
                "reading": "Gal 1:11-19",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 30:2+4, 5-6, 11-12a+13b",
                "note": null
            }]
        },
        "13th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "1 Kgs 19:16b, 19-21",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 9:51-62",
                "note": null
            }],
            "New Testament": [{
                "reading": "Gal 5:1, 13-18",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 16:1-2a+5, 7-8, 9-10, 11",
                "note": null
            }]
        },
        "28th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "2 Kgs 5:14-17",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 17:11-19",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Tim 2:8-13",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 98:1, 2-3a, 3b-4",
                "note": null
            }]
        },
        "3rd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Neh 8:2-4a, 5-6, 8-10",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 1:1-4; 4:14-21",
                "note": null
            }, {
                "reading": "Luke 4:14-21 (with 1:1-4; see 69-C)",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 12:12-30 or 12:12-14, 27",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 19:8, 9, 10, 15",
                "note": null
            }]
        },
        "32nd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "2 Macc 7:1-2, 9-14",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 20:27-38 or 20:27, 34-38",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Thess 2:16—3:5",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 17:1, 5-6, 8+15",
                "note": null
            }]
        },
        "Sunday after Pentecost: Holy Trinity": {
            "Old Testament": [{
                "reading": "Prov 8:22-31",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 16:12-15",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 5:1-5",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 8:4-5, 6-7, 8-9",
                "note": null
            }]
        },
        "18th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Eccl 1:2, 2:21-23",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 12:13-21",
                "note": null
            }],
            "New Testament": [{
                "reading": "Col 3:1-5, 9-11",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 90:3-4, 5-6, 12-13, 14+17",
                "note": null
            }]
        },
        "23rd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Wis 9:13-18b",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 14:25-33",
                "note": null
            }],
            "New Testament": [{
                "reading": "Phlm 9-10, 12-17",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 90:3-4, 5-6, 12-13, 14+17",
                "note": null
            }]
        },
        "31st Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Wis 11:22-12:2",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 19:1-10",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Thess 1:11—2:2",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 145:1-2, 8-9, 10-11, 13b-14",
                "note": null
            }]
        },
        "19th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Wis 18:6-9",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 12:32-48 or 12:35-40",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 11:1-2, 8-19 or 11:1-2, 8-12",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 33:1+12, 18-19, 20-22",
                "note": null
            }]
        },
        "22nd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Sir 3:17-18, 20, 28-29",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 14:1, 7-14",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 12:18-19, 22-24a",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 68:4-5, 6-7, 10-11",
                "note": null
            }]
        },
        "2nd Sunday after Christmas": {
            "Old Testament": [{
                "reading": "Sir 24:1-4, 12-16",
                "note": "note"
            }],
            "Gospel": [{
                "reading": "John 1:1-18 or 1:1-5, 9-14",
                "note": "note"
            }],
            "New Testament": [{
                "reading": "Eph 1:3-6, 15-18",
                "note": "note"
            }],
            "Psalm": [{
                "reading": "Ps 147:12-13, 14-15, 19-20",
                "note": "note"
            }]
        },
        "8th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Sir 27:5-8",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 6:39-45",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 15:54-58",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 92:2-3, 13-14, 15-16",
                "note": null
            }]
        },
        "30th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Sir 35:12-14, 16-18",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 18:9-14",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Tim 4:6-8, 16-18",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 34:2-3, 17-18, 19+23",
                "note": null
            }]
        },
        "5th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 6:1-2a, 3-8",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 5:1-11",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 15:1-11 or 15:3-8, 11",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 138:1-2a, 2b-3, 4-5, 7-8",
                "note": null
            }]
        },
        "Christmas: Mass at Midnight": {
            "Old Testament": [{
                "reading": "Isa 9:1-6",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 2:1-14",
                "note": null
            }],
            "New Testament": [{
                "reading": "Titus 2:11-14",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 96:1-2a, 2b-3, 11-12, 13",
                "note": null
            }]
        },
        "3rd Sunday of Advent": {
            "Old Testament": [{
                "reading": "Isa 12:2-3, 4bcd, 5-6",
                "note": "Response"
            }, {
                "reading": "Zeph 3:14-18a",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 3:10-18",
                "note": null
            }],
            "New Testament": [{
                "reading": "Phil 4:4-7",
                "note": null
            }]
        },
        "Sunday after Epiphany: Baptism of the Lord": {
            "Old Testament": [{
                "reading": "Isa 40:1-5, 9-11",
                "note": "opt. C"
            }, {
                "reading": "Isa 42:1-4, 6-7",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 3:15-16, 21-22",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 10:34-38",
                "note": null
            }, {
                "reading": "Titus 2:11-14; 3:4-7",
                "note": "opt. C"
            }],
            "Psalm": [{
                "reading": "Ps 29:1-2, 3-4, 3b+9b-10",
                "note": null
            }, {
                "reading": "Ps 104:1b-2, 3-4, 24-25, 27-28, 29b-30",
                "note": "opt. C"
            }]
        },
        "5th Sunday of Lent": {
            "Old Testament": [{
                "reading": "Isa 43:16-21",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 8:1-11",
                "note": null
            }, {
                "reading": "John 11:1-45 or 11:3-7, 17, 20-27, 33b-45",
                "note": null
            }],
            "New Testament": [{
                "reading": "Phil 3:8-14",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 126:1-2a, 2b-3, 4-5, 6",
                "note": null
            }]
        },
        "Palm Sunday Mass": {
            "Old Testament": [{
                "reading": "Isa 50:4-7",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 22:14—23:56 or 23:1-49",
                "note": null
            }],
            "New Testament": [{
                "reading": "Phil 2:6-11",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 22:8-9, 17-18, 19-20, 23-24",
                "note": null
            }]
        },
        "Christmas: Mass during the Day": {
            "Old Testament": [{
                "reading": "Isa 52:7-10",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 1:1-18 or 1:1-5, 9-14",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 1:1-6",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 98:1, 2-3a, 3b-4, 5-6",
                "note": null
            }]
        },
        "Good Friday of the Lord’s Passion": {
            "Old Testament": [{
                "reading": "Isa 52:13—53:12",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 18:1—19:42",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 4:14-16; 5:7-9",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 31:2+6, 12-13, 15-16, 17+25",
                "note": null
            }]
        },
        "The Epiphany of the Lord": {
            "Old Testament": [{
                "reading": "Isa 60:1-6",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 2:1-12",
                "note": null
            }],
            "New Testament": [{
                "reading": "Eph 3:2-3a, 5-6",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 72:1-2, 7-8, 10-11, 12-13",
                "note": null
            }]
        },
        "Christmas: Vigil Mass": {
            "Old Testament": [{
                "reading": "Isa 62:1-5",
                "note": null
            }],
            "Gospel": [{
                "reading": "Matt 1:1-25 or 1:18-25",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 13:16-17, 22-25",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 89:4-5, 16-17, 27+29",
                "note": null
            }]
        },
        "2nd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 62:1-5",
                "note": null
            }],
            "Gospel": [{
                "reading": "John 2:1-11",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 12:4-11",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 96:1-2a, 2b-3, 7-8, 9-10",
                "note": null
            }]
        },
        "Christmas: Mass at Dawn": {
            "Old Testament": [{
                "reading": "Isa 62:11-12",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 2:15-20",
                "note": null
            }],
            "New Testament": [{
                "reading": "Titus 3:4-7",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 97:1+6, 11-12",
                "note": null
            }]
        },
        "14th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 66:10-14c",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 10:1-12, 17-20 or 10:1-9",
                "note": null
            }],
            "New Testament": [{
                "reading": "Gal 6:14-18",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 66:1-3, 4-5, 6-7, 16+20",
                "note": null
            }]
        },
        "21st Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Isa 66:18-21",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 13:22-30",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 12:5-7, 11-13",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 117:1, 2",
                "note": null
            }]
        },
        "4th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Jer 1:4-5, 17-19",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 4:21-30",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 12:31—13:13 or 13:4-13",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 71:1-2, 3-4, 5-6, 15+17",
                "note": null
            }]
        },
        "6th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Jer 17:5-8",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 6:17, 20-26",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Cor 15:12, 16-20",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 1:1-2, 3, 4+6",
                "note": null
            }]
        },
        "1st Sunday of Advent": {
            "Old Testament": [{
                "reading": "Jer 33:14-16",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 21:25-28, 34-36",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Thess 3:12—4:2",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 25:4-5, 8-9, 10+14",
                "note": null
            }]
        },
        "20th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Jer 38:4-6, 8-10",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 12:49-53",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 12:1-4",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 40:2, 3, 4, 18",
                "note": null
            }]
        },
        "2nd Sunday of Advent": {
            "Old Testament": [{
                "reading": "Bar 5:1-9",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 3:1-6",
                "note": null
            }],
            "New Testament": [{
                "reading": "Phil 1:4-6, 8-11",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 126:1-2a, 2b-3, 4-5, 6",
                "note": null
            }]
        },
        "Friday after 2nd Sun after Pentecost: Sacred Heart": {
            "Old Testament": [{
                "reading": "Ezek 34:11-16",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 15:3-7",
                "note": null
            }],
            "New Testament": [{
                "reading": "Rom 5:5b-11",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 23:1-3a, 3b-4, 5, 6",
                "note": null
            }]
        },
        "26th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Amos 6:1a, 4-7",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 16:19-31",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Tim 6:11-16",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 146:6c-7, 8-9a, 9b-10",
                "note": null
            }]
        },
        "25th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Amos 8:4-7",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 16:1-13 or 16:10-13",
                "note": null
            }],
            "New Testament": [{
                "reading": "1 Tim 2:1-8",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 113:1-2, 4-6, 7-8",
                "note": null
            }]
        },
        "4th Sunday of Advent": {
            "Old Testament": [{
                "reading": "Mic 5:1-4a",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 1:39-45",
                "note": null
            }],
            "New Testament": [{
                "reading": "Heb 10:5-10",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 80:2-3, 15-16, 18-19",
                "note": null
            }]
        },
        "27th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Hab 1:2-3; 2:2-4",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 17:5-10",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Tim 1:6-8, 13-14",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 95:1-2, 6-7b, 7c-9",
                "note": null
            }]
        },
        "12th Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Zech 12:10-11; 13:1",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 9:18-24",
                "note": null
            }],
            "New Testament": [{
                "reading": "Gal 3:26-29",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 63:2, 3-4, 5-6, 8-9",
                "note": null
            }]
        },
        "33rd Sunday in Ordinary Time": {
            "Old Testament": [{
                "reading": "Mal 3:19-20a",
                "note": null
            }],
            "Gospel": [{
                "reading": "Luke 21:5-19",
                "note": null
            }],
            "New Testament": [{
                "reading": "2 Thess 3:7-12",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 98:5-6, 7-8, 9",
                "note": null
            }]
        },
        "Palm Sunday: Procession of Palms": {
            "Gospel": [{
                "reading": "Luke 19:28-40",
                "note": null
            }]
        },
        "Easter Sunday: Resurrection of the Lord": {
            "Gospel": [{
                "reading": "Luke 24:13-35",
                "note": "opt. 2"
            }, {
                "reading": "John 20:1-9",
                "note": "opt. 1"
            }],
            "New Testament": [{
                "reading": "Acts 10:34a, 37-43",
                "note": null
            }, {
                "reading": "1 Cor 5:6b-8",
                "note": "opt. 2"
            }, {
                "reading": "Col 3:1-4",
                "note": "opt. 1"
            }],
            "Psalm": [{
                "reading": "Ps 118:1-2, 16-17, 22-23",
                "note": null
            }]
        },
        "Ascension of the Lord": {
            "Gospel": [{
                "reading": "Luke 24:46-53",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 1:1-11",
                "note": null
            }, {
                "reading": "Eph 1:17-23",
                "note": null
            }, {
                "reading": "Heb 9:24-28; 10:19-23",
                "note": "opt. C"
            }],
            "Psalm": [{
                "reading": "Ps 47:2-3, 6-7, 8-9",
                "note": null
            }]
        },
        "4th Sunday of Easter": {
            "Gospel": [{
                "reading": "John 10:27-30",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 13:14, 43-52",
                "note": null
            }, {
                "reading": "Rev 7:9, 14b-17",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 100:1-2, 3, 5",
                "note": null
            }]
        },
        "5th Sunday of Easter": {
            "Gospel": [{
                "reading": "John 13:31-33a, 34-35",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 14:21-27",
                "note": null
            }, {
                "reading": "Rev 21:1-5a",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 145:8-9, 10-11, 12-13",
                "note": null
            }]
        },
        "Pentecost Sunday": {
            "Gospel": [{
                "reading": "John 14:15-16, 23b-26",
                "note": "opt. C"
            }, {
                "reading": "John 20:19-23",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 2:1-11",
                "note": null
            }, {
                "reading": "Rom 8:8-17",
                "note": "opt. C"
            }, {
                "reading": "1 Cor 12:3b-7, 12-13",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 104:1+24, 29-30, 31+34",
                "note": null
            }]
        },
        "6th Sunday of Easter": {
            "Gospel": [{
                "reading": "John 14:23-29",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 15:1-2, 22-29",
                "note": null
            }, {
                "reading": "Rev 21:10-14, 22-23",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 67:2-3, 5, 6+8",
                "note": null
            }]
        },
        "7th Sunday of Easter": {
            "Gospel": [{
                "reading": "John 17:20-26",
                "note": "note"
            }],
            "New Testament": [{
                "reading": "Acts 7:55-60",
                "note": "note"
            }, {
                "reading": "Rev 22:12-14, 16-17, 20",
                "note": "note"
            }],
            "Psalm": [{
                "reading": "Ps 97:1-2, 6-7, 9",
                "note": "note"
            }]
        },
        "2nd Sunday of Easter": {
            "Gospel": [{
                "reading": "John 20:19-31",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 5:12-16",
                "note": null
            }, {
                "reading": "Rev 1:9-11a, 12-13, 17-19",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 118:2-4, 13-15, 22-24",
                "note": null
            }]
        },
        "3rd Sunday of Easter": {
            "Gospel": [{
                "reading": "John 21:1-19 or 21:1-14",
                "note": null
            }],
            "New Testament": [{
                "reading": "Acts 5:27-32, 40b-41",
                "note": null
            }, {
                "reading": "Rev 5:11-14",
                "note": null
            }],
            "Psalm": [{
                "reading": "Ps 30:2+4, 5-6, 11-12a+13b",
                "note": null
            }]
        }
    }
};

addReverseLookupsAndKeywords(oBooks);

function hasReadings(sYear, sFeastName) {
    return !!oLookup[sYear][sFeastName];
}

function getReadings(sYear, sFeastName, bLongReadingNames, bAddNotes) {
    var oReadingData = oLookup[sYear][sFeastName];
    if (bAddNotes) {
        return bLongReadingNames ? expandReadingsAbbreviations(oReadingData) : JSON.parse(JSON.stringify(oReadingData));
    }

    var oReadingInfo = Object.keys(oReadingData).reduce(function (o, sKey) {
        o[sKey] = oReadingData[sKey].map(function (oReading) {
            return oReading.reading;
        });
        return o;
    }, {});

    return bLongReadingNames ? expandReadingsAbbreviations(oReadingInfo) : oReadingInfo;
}

function expandReadingsAbbreviations(oReadingData) {
    return Object.keys(oReadingData).reduce(function (o, sKey) {
        var aReadings = oReadingData[sKey];
        var aMappedReadings = aReadings.map(function (vReading) {
            var sReading = vReading;
            if (vReading.reading) {
                sReading = vReading.reading;
            }

            var sReadingShort = sReading.split(/\s\d/)[0];
            var sReadingLong = oBooks.abbrev_rev[sReadingShort];
            var sReadingMapped = sReadingLong ? sReading.replace(sReadingShort, sReadingLong) : sReading;

            if (vReading.reading) {
                var vReadingClone = JSON.parse(JSON.stringify(vReading));
                vReadingClone.reading = sReadingMapped;
                return vReadingClone;
            }

            return sReadingMapped;
        });

        o[sKey] = aMappedReadings;

        return o;
    }, {});
}

module.exports = {
    hasReadings: hasReadings,
    getReadings: getReadings
};

},{}]},{},[1])(1)
});
