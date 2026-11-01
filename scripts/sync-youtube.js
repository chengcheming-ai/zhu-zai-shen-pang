/* 讀取 YouTube 頻道的新影片，自動加入 catalog.js 並配上經文。
   不需要 API 金鑰；由 .github/workflows/sync-youtube.yml 定時執行。 */
"use strict";
const fs = require("fs");
const path = require("path");

const CHANNEL = "UCmoZoat_37Zbqo-Zpnze0TA";
const ROOT = path.join(__dirname, "..");
const CATALOG = path.join(ROOT, "catalog.js");
const POOL = path.join(__dirname, "verse-pool.json");
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36",
  "Accept-Language": "zh-TW,zh;q=0.9"
};

/* 依歌名判斷分類，由上往下比對；都沒有就歸「歡呼讚美」 */
const THEME_RULES = [
  ["榮耀敬拜", /榮耀/],
  ["安靜親近", /安靜|等候|靠近|親近|抱|修補|醫治|安息|禱告/],
  ["晨光盼望", /光|晨|盼望|重生|新|夢|起來/],
  ["恩典喜樂", /恩典|喜樂|真好|美好|良善|慈愛|感恩|阿爸/],
  ["歡呼讚美", /./]
];

async function getText(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(res.status + " " + url);
  return res.text();
}

function decodeXml(s) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&amp;/g, "&");
}

/* 主要來源：上傳清單 RSS（最新 15 支，含 Shorts） */
async function fromFeed() {
  const xml = await getText("https://www.youtube.com/feeds/videos.xml?playlist_id=UU" + CHANNEL.slice(2));
  return xml.split("<entry>").slice(1).map((e) => ({
    id: (e.match(/<yt:videoId>([^<]+)/) || [])[1],
    title: decodeXml((e.match(/<media:title>([^<]*)/) || [null, ""])[1]),
    desc: decodeXml((e.match(/<media:description>([^<]*)/) || [null, ""])[1]),
    short: /\/shorts\//.test((e.match(/<link[^>]*>/) || [""])[0])
  })).filter((v) => v.id);
}

/* 備援來源：頻道的「影片」分頁（不含 Shorts） */
async function fromPage() {
  const html = await getText("https://www.youtube.com/channel/" + CHANNEL + "/videos");
  const ids = [...new Set([...html.matchAll(/"videoId":"([\w-]{11})"/g)].map((m) => m[1]))];
  return ids.map((id) => ({ id, title: "", desc: "", short: false }));
}

/* 影片頁可補上片長；讀不到時回傳 null，不影響新增 */
async function details(id) {
  try {
    const html = await getText("https://www.youtube.com/watch?v=" + id);
    const m = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});(?:var|<\/script>)/s);
    if (!m) return null;
    const d = JSON.parse(m[1]).videoDetails;
    if (!d) return null;
    return {
      channelId: d.channelId,
      title: d.title || "",
      desc: d.shortDescription || "",
      seconds: +d.lengthSeconds || 0,
      upcoming: !!d.isUpcoming || d.isLive === true
    };
  } catch (e) {
    console.warn("無法讀取影片頁 " + id + "：" + e.message);
    return null;
  }
}

function clock(sec) {
  if (!sec) return "";
  return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
}

function parseTitle(title) {
  const m = title.match(/【([^】]+)】/);
  if (m) {
    const inner = m[1].trim();
    const at = inner.search(/[A-Za-z]/);
    if (at > 0) return { zh: inner.slice(0, at).trim(), en: inner.slice(at).trim() };
    return { zh: inner, en: "" };
  }
  const plain = title.replace(/#\S+/g, "").replace(/\p{Extended_Pictographic}|️|‍/gu, "").trim();
  return { zh: plain, en: "" };
}

/* 從尚未用過的經文中，挑與歌名、說明最相符的一節；全部用過才重複使用 */
function chooseVerse(pool, songs, zh, desc) {
  const body = desc.split("\n").filter((l) => !/[#📌💬📢]/u.test(l)).join("\n");
  const used = {};
  songs.forEach((s) => { if (s.verse) used[s.verse.ref] = (used[s.verse.ref] || 0) + 1; });
  const fewest = Math.min(...pool.map((p) => used[p.ref] || 0));
  let best = null;
  let bestScore = -1;
  pool.filter((p) => (used[p.ref] || 0) === fewest).forEach((p) => {
    const score = p.keywords.reduce((sum, k) =>
      sum + (zh.includes(k) ? 3 : 0) + (body.includes(k) ? 1 : 0), 0);
    if (score > bestScore) { best = p; bestScore = score; }
  });
  return { text: best.text, ref: best.ref };
}

function readCatalog() {
  const text = fs.readFileSync(CATALOG, "utf8");
  const start = text.indexOf("[");
  return { head: text.slice(0, start), songs: JSON.parse(text.slice(start, text.lastIndexOf("]") + 1)) };
}

function writeCatalog(head, songs) {
  fs.writeFileSync(CATALOG, head + "[\n" + songs.map((s) => JSON.stringify(s)).join(",\n") + "\n];\n");
}

async function main() {
  const { head, songs } = readCatalog();
  const pool = JSON.parse(fs.readFileSync(POOL, "utf8"));
  const known = new Set(songs.map((s) => s.id));

  let videos;
  try {
    videos = await fromFeed();
    if (!videos.length) throw new Error("RSS 沒有內容");
  } catch (e) {
    console.warn("RSS 讀取失敗，改讀頻道頁：" + e.message);
    videos = await fromPage();
    if (!videos.length) throw new Error("頻道頁也沒有影片");
  }

  const fresh = videos.filter((v) => !v.short && !known.has(v.id) && !/#shorts/i.test(v.title));
  const added = [];
  for (const v of fresh.reverse()) {
    const d = await details(v.id);
    if (d && (d.channelId !== CHANNEL || d.upcoming || d.seconds <= 60)) continue;
    const title = v.title || (d && d.title) || "";
    const { zh, en } = parseTitle(title);
    if (!zh) continue;
    const song = {
      id: v.id,
      zh,
      en,
      time: d ? clock(d.seconds) : "",
      theme: THEME_RULES.find(([, re]) => re.test(zh))[0],
      verse: chooseVerse(pool, songs, zh, (d && d.desc) || v.desc || "")
    };
    songs.unshift(song);
    added.push(song);
  }

  console.log("影片 " + videos.length + " 支，新增 " + added.length + " 首");
  if (!added.length) return;
  writeCatalog(head, songs);
  added.forEach((s) => console.log("新增《" + s.zh + "》→ " + s.theme + "｜" + s.verse.ref));
  if (process.env.GITHUB_OUTPUT) {
    const names = added.map((s) => s.zh + "（" + s.verse.ref + "）").join("、");
    fs.appendFileSync(process.env.GITHUB_OUTPUT, "added=" + names + "\n");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
