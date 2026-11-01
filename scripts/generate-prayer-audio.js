/* 用 edge-tts 把 prayers.js 生成音檔，存到 audio/prayers/。只在本機執行。
   先安裝：python -m pip install edge-tts
   修改禱告文後請重新執行：node scripts/generate-prayer-audio.js
   edge-tts 不是微軟官方工具，服務可能變動；已生成的音檔不受影響。 */
"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const TOOL = process.env.EDGE_TTS || "edge-tts";
const VOICE = "zh-TW-HsiaoChenNeural";
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "audio", "prayers");

function spokenRef(ref) {
  const m = ref.match(/^(\S+) (\d+):(\d+)(?:-(\d+))?$/);
  if (!m) throw new Error("無法解析經文出處：" + ref);
  return m[1] + "第" + m[2] + (m[1] === "詩篇" ? "篇" : "章") + "第" + m[3] + (m[4] ? "到第" + m[4] : "") + "節";
}

global.window = {};
new Function(fs.readFileSync(path.join(ROOT, "prayers.js"), "utf8"))();
const list = window.PRAYERS;
fs.mkdirSync(OUT, { recursive: true });

let bytes = 0;
list.forEach((item, i) => {
  const file = path.join(OUT, String(i + 1).padStart(2, "0") + ".mp3");
  const text = "今日經文，" + spokenRef(item.ref) + "。" + item.text + "。" + item.prayer;
  execFileSync(TOOL, ["--voice", VOICE, "--rate=-10%", "--text", text, "--write-media", file], { stdio: "pipe" });
  const size = fs.statSync(file).size;
  if (!size) throw new Error("第 " + (i + 1) + " 則沒有收到音檔");
  bytes += size;
  console.log((i + 1) + "/" + list.length + " " + item.ref + " " + size);
});
console.log("完成：" + list.length + " 個音檔，共 " + (bytes / 1048576).toFixed(1) + " MB");
