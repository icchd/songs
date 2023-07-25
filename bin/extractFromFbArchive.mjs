import fs from "fs";
import chalk from "chalk";
import moment from "moment";
import catholicHolidays from "../lib/catholicHolidays.js";


const oHolidays = catholicHolidays.createLibrary(moment);
const SONG_INDEX_FILE = "./songs.json";
const FACEBOOK_MESSAGES_FILE = "/home/darksmo/Downloads/message_1.json";
const SONGS_SAVE_DIR = "./save";

function byField (fieldName) {
    return (a, b) => {
        if (a[fieldName] === b[fieldName]) {
            return 0;
        }

        return a[fieldName] < b[fieldName]
            ? -1
            : 1;
    }
}

function discoverSongs (messagesFile, songIndexFile) {
    const reSong = new RegExp("(Entrance|Offertory|Communion|Recession):.*?[1-9][0-9]?[0-9]?", "m");
    const messagesContent = fs.readFileSync(messagesFile, { encoding: "utf8", flag: "r" });
    const songIndexContent = JSON.parse(fs.readFileSync(songIndexFile, { encoding: "utf8", flag: "r" })).list.reduce((o, oSong) => {
        o[oSong.number] = oSong;
        return o;
    }, {});
    const json = JSON.parse(messagesContent);
    const songBuffer = {};
    json.messages.sort(byField("timestamp_ms")).forEach(m => {
        if (!m.content) {
            return;
        }
        if (m.content.match(reSong)) {
            const oMessageDate = moment(m.timestamp_ms)

            const dateParsed = oMessageDate.format("DD-MM-YYYY");

            const [dd,mm,yyy] = dateParsed.split("-");

            let nextFestiveDay = oHolidays.getNextFestiveDay(oMessageDate);
            if (oMessageDate.format("dddd") === "Sunday") {
                nextFestiveDay = oMessageDate;
            }

            const nextFestiveDayFormatted = nextFestiveDay.format("DD-MM-YYYY");
            if (songFileExists(nextFestiveDayFormatted)) {
                console.log(chalk.blue(`skipping ${mkSongFileName(nextFestiveDayFormatted)} (file exists)`));
                return;
            }

            const parsed= parseSongsFromText(m.content);
            if (parsed === null) {
                console.log("Could not detect ", chalk.blue(sSongsJson));
                console.log("Original Message ", m.content.split("\n"));
                return;
            }

            const { songs, momentsOrder } = parsed;

            const sSongsJson = JSON.stringify(songs, null, 3);
            const songContext = {
                sender: m.sender_name,
                message: m.content,
                sunday: nextFestiveDayFormatted,
                detected: songs,
                momentsOrder
            };

            // write in a buffer to handle merge with songs changed in later messages
            bufferSong(songBuffer, songContext);
        }
        else {
            if (m.content.indexOf("Entrance") >= 0) {
                console.log("No moment detected in message:");
                console.log("sender  >>>> " + m.sender_name);
                console.log("content >>>> " + m.content);
                console.log("date    >>>> " + new Date(m.timestamp_ms));
            }
        }
    });

  Object.values(songBuffer).forEach(songContext => {
      writeSongs(songContext, songIndexContent);
  });
}

function parseSongsFromText(text) {
    const songs = {};
    const momentsOrder = [];
    
    text.split("\n").forEach(line => {
        const match = line.match(/([A-Z][a-z]+[^:]*):[^:]*?(\d\d?\d?|---)/);
        if (match) {
            const moment = match[1];
            if (moment.split(" ").length >= 5) {
                // console.log("Not a valid moment: " + moment);
                return;
            }
            const song = match[2];
            songs[moment] = song;
            momentsOrder.push(moment);
        }
    });

    if (Object.keys(songs).length == 0) {
        return null;
    }

    return { songs, momentsOrder };
}

function mkSongFileName(sunday) {
    return `${SONGS_SAVE_DIR}/${sunday}.json`;
}

function songFileExists(sunday) {
    return fs.existsSync(mkSongFileName(sunday));
}

function bufferSong(o, songContext) {
   const { sunday } = songContext;
   //  { sender, message, sunday, detected}) {
   if (!o[sunday]) {
       o[sunday] = songContext;
       return;
   }

   // merge with existing context
   o[sunday].sender = `${o[sunday].sender}, ${songContext.sender}`;
   o[sunday].detected = {...o[sunday].detected, ...songContext.detected};

   // merge moments order: append new ones at the end.
   const momentsOrder = [...o[sunday].momentsOrder];
   songContext.momentsOrder.forEach(m => {
       if (momentsOrder.indexOf(m) === -1) {
           momentsOrder.push(m);
       }
   })
   o[sunday].momentsOrder = momentsOrder;
}

function writeSongs({ sender, message, sunday, detected, momentsOrder}, songIndexContent) {
    const songFileName = mkSongFileName(sunday);

    const output = {
        momentsOrder: []
    };
    momentsOrder.forEach(m => {
        const momentLC = m.toLowerCase();
        output[momentLC] = {
            number: detected[m],
            title: songIndexContent[detected[m]].title
        };
        output.momentsOrder.push(momentLC);
    });

    console.log(`writing ${songFileName} - from ${sender}`);
    fs.writeFileSync(songFileName, JSON.stringify(output, null, 3), { encoding: "utf8"});
}

const songsFound = discoverSongs(FACEBOOK_MESSAGES_FILE, SONG_INDEX_FILE);
