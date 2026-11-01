/* 把本機影片檔的聲音轉成 MP3，供網站「背景播放」使用。只在本機執行，不會更動來源影片。
   用法：node scripts/build-song-audio.js "C:\Users\cheng\Desktop\Youtube"
   已轉過的歌會跳過，所以有新歌時重跑同一行即可，然後 commit 並 push。
   需要 ffmpeg：npm install --prefix .tools ffmpeg-static（裝在 repo 內，git 會忽略）。 */
"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const LOCAL_FFMPEG = path.join(ROOT, ".tools", "node_modules", "ffmpeg-static", "ffmpeg.exe");
const FFMPEG = process.env.FFMPEG || (fs.existsSync(LOCAL_FFMPEG) ? LOCAL_FFMPEG : "ffmpeg");
const OUT = path.join(ROOT, "audio", "songs");
const MANIFEST = path.join(ROOT, "song-audio.js");
const SOURCE = process.argv[2];

if (!SOURCE) {
  console.error("請指定影片資料夾，例如：node scripts/build-song-audio.js \"C:\\Users\\cheng\\Desktop\\Youtube\"");
  process.exit(1);
}

global.window = {};
new Function(fs.readFileSync(path.join(ROOT, "catalog.js"), "utf8"))();
const songs = window.SONGS;

const videos = fs.readdirSync(SOURCE).filter((f) => /\.mp4$/i.test(f));
const baseName = (f) => f.replace(/\.mp4$/i, "");
const loose = (s) => s.replace(/祢/g, "你");

/* ffmpeg 沒有輸出檔時會結束並報錯，這裡只取它印出的片長 */
function secondsOf(file) {
  const out = spawnSync(FFMPEG, ["-hide_banner", "-i", file], { encoding: "utf8" }).stderr || "";
  const m = out.match(/Duration: (\d+):(\d+):([\d.]+)/);
  return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : null;
}
function listedSeconds(time) {
  const m = /^(\d+):(\d+)$/.exec(time || "");
  return m ? +m[1] * 60 + +m[2] : null;
}

/* 先找完全同名的檔案，都配完後才允許「祢／你」不同字，避免搶走別首歌的檔案 */
const taken = new Set();
const found = new Map();
songs.forEach((song) => {
  const file = videos.find((f) => baseName(f) === song.zh);
  if (file) { found.set(song.id, file); taken.add(file); }
});
songs.forEach((song) => {
  if (found.has(song.id)) return;
  const file = videos.find((f) => !taken.has(f) && loose(baseName(f)) === loose(song.zh));
  if (file) {
    found.set(song.id, file);
    taken.add(file);
    console.log("歌名用字不同，請確認：《" + song.zh + "》使用 " + file);
  }
});

fs.mkdirSync(OUT, { recursive: true });
const missing = [];
const mismatched = [];
let done = 0;
songs.forEach((song) => {
  const target = path.join(OUT, song.id + ".mp3");
  if (fs.existsSync(target)) return;
  const file = found.get(song.id);
  if (!file) { missing.push(song.zh); return; }
  const partial = target + ".tmp.mp3";
  execFileSync(FFMPEG, ["-v", "error", "-y", "-i", path.join(SOURCE, file), "-map", "0:a:0", "-vn", "-map_metadata", "-1", "-c:a", "libmp3lame", "-b:a", "128k", partial], { stdio: "pipe" });
  const actual = secondsOf(partial);
  const listed = listedSeconds(song.time);
  if (actual != null && listed != null && Math.abs(actual - listed) > 3) {
    fs.unlinkSync(partial);
    mismatched.push("《" + song.zh + "》網站 " + song.time + "，檔案 " + file + " 為 " + Math.round(actual) + " 秒");
    return;
  }
  fs.renameSync(partial, target);
  done += 1;
  console.log("已轉檔：" + song.zh);
});

const ready = songs.filter((song) => fs.existsSync(path.join(OUT, song.id + ".mp3")));
const lines = ready.map((song) => JSON.stringify(song.id) + ":1").join(",");
fs.writeFileSync(MANIFEST, "/* 由 scripts/build-song-audio.js 產生：有音檔的歌曲，請勿手動修改。 */\nwindow.SONG_AUDIO = {" + lines + "};\n");

const bytes = ready.reduce((sum, song) => sum + fs.statSync(path.join(OUT, song.id + ".mp3")).size, 0);
console.log("本次轉檔 " + done + " 首；共 " + ready.length + "/" + songs.length + " 首有音檔，" + (bytes / 1048576).toFixed(1) + " MB");
if (missing.length) console.log("找不到影片檔：" + missing.join("、"));
if (mismatched.length) console.log("片長不符，未產生音檔：" + mismatched.join("；"));
