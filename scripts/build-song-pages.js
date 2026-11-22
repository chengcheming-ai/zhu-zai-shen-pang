/* 依 catalog.js 產生每首歌的獨立網頁（songs/<英文歌名>/）、歌曲總覽頁與 sitemap。
   執行：node scripts/build-song-pages.js（GitHub Actions 同步新歌後會自動執行） */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "songs");
const SLUGS = path.join(__dirname, "song-slugs.json");
const SITE = "https://chengcheming-ai.github.io/zhu-zai-shen-pang/";
const CHANNEL = "https://www.youtube.com/channel/UCmoZoat_37Zbqo-Zpnze0TA";
const EXTRA = '<a href="https://chengcheming-ai.github.io/interval-timer/" target="_blank" rel="noopener">間歇計時器</a>、<a href="https://chengcheming-ai.github.io/labor-calculator/" target="_blank" rel="noopener">勞工權益計算機</a>';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ld = (o) => '<script type="application/ld+json">' + JSON.stringify(o).replace(/</g, "\\u003c") + "</script>";

function readSongs() {
  const text = fs.readFileSync(path.join(ROOT, "catalog.js"), "utf8");
  return JSON.parse(text.slice(text.indexOf("["), text.lastIndexOf("]") + 1));
}

/* 網址以中文歌名記錄，換成字幕版（影片 ID 改變）時網址不變 */
function assignSlugs(songs) {
  const map = fs.existsSync(SLUGS) ? JSON.parse(fs.readFileSync(SLUGS, "utf8")) : {};
  const used = new Set(Object.values(map));
  songs.slice().reverse().forEach((s) => {
    if (map[s.zh]) return;
    const base = (s.en || "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "song-" + s.id;
    let slug = base;
    for (let n = 2; used.has(slug); n++) slug = base + "-" + n;
    map[s.zh] = slug;
    used.add(slug);
  });
  fs.writeFileSync(SLUGS, JSON.stringify(map, null, 1) + "\n");
  return map;
}

function isoDuration(time) {
  const p = (time || "").split(":").map(Number);
  return p.length === 2 && p.every((n) => n >= 0) ? "PT" + p[0] + "M" + p[1] + "S" : undefined;
}

function page({ up, url, title, desc, image, data, body }) {
  return `<!doctype html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#101a36">
  <link rel="icon" href="${up}assets/icons/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="${up}assets/icons/apple-touch-icon.png">
  <link rel="stylesheet" href="${up}styles.css">
  <link rel="stylesheet" href="${up}song.css">
  ${data.map(ld).join("\n  ")}
</head>
<body class="song-page">
  <header class="sp-top"><div class="wrap">
    <a class="brand" href="${up}"><img src="${up}assets/icons/icon-192.png" alt="" width="36" height="36"><span>主在身旁</span></a>
    <nav aria-label="主要導覽"><a href="${up}#listen">聽歌</a><a href="${up}songs/">所有詩歌</a><a href="${CHANNEL}" target="_blank" rel="noopener">YouTube</a></nav>
  </div></header>
  <main class="wrap sp-main">
${body}
  </main>
  <footer class="footer"><div class="wrap footer-row">
    <span>© 主在身旁</span><a href="${CHANNEL}" target="_blank" rel="noopener">YouTube 頻道</a><span>其他網站：${EXTRA}</span>
    <span>本站使用 GoatCounter 匿名統計瀏覽次數，統計不使用 Cookie、不收集個人資料。</span>
  </div></footer>
  <script data-goatcounter="https://zhuzaishenpang-tw.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body>
</html>
`;
}

const crumbs = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item }))
});

function songPage(s, i, songs, map) {
  const url = SITE + "songs/" + map[s.zh] + "/";
  const full = s.en ? s.zh + " " + s.en : s.zh;
  const thumb = "https://i.ytimg.com/vi/" + s.id + "/hqdefault.jpg";
  const link = (x) => '<a href="../' + map[x.zh] + '/"><b>' + esc(x.zh) + "</b>" + (x.en ? "<span>" + esc(x.en) + "</span>" : "") + "</a>";
  const same = songs.filter((x) => x !== s && x.theme === s.theme);
  const start = same.length ? i % same.length : 0;
  const related = same.slice(start).concat(same.slice(0, start)).slice(0, 6);
  const prev = songs[i - 1];
  const next = songs[i + 1];
  const body = `    <p class="sp-crumb"><a href="../../">主在身旁</a> › <a href="../">所有詩歌</a> › ${esc(s.zh)}</p>
    <h1>${esc(s.zh)}</h1>
    ${s.en ? '<p class="sp-en" lang="en">' + esc(s.en) + "</p>" : ""}
    <div class="sp-video"><iframe src="https://www.youtube-nocookie.com/embed/${s.id}" title="${esc(full)}｜主在身旁" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
    <p class="sp-actions"><a class="btn btn-sun" href="../../#listen">到網站連續播放全部詩歌</a><a class="sp-yt" href="https://www.youtube.com/watch?v=${s.id}" target="_blank" rel="noopener">在 YouTube 開啟這首歌</a></p>
    <section><h2>這首歌的經文</h2>
      <blockquote class="sp-verse"><p>${esc(s.verse.text)}</p><cite>${esc(s.verse.ref)}（和合本）</cite></blockquote></section>
    <section><h2>關於《${esc(s.zh)}》</h2>
      <p>《${esc(s.zh)}》${s.en ? "（" + esc(s.en) + "）" : ""}是「主在身旁」的華語敬拜詩歌，主題為「${esc(s.theme)}」，以${esc(s.verse.ref)}的經文相伴。歡迎在個人靈修、小組聚會或通勤時聆聽。</p>
      <dl class="sp-facts"><div><dt>主題</dt><dd>${esc(s.theme)}</dd></div>${s.time ? "<div><dt>片長</dt><dd>" + esc(s.time) + "</dd></div>" : ""}<div><dt>語言</dt><dd>華語（國語）</dd></div><div><dt>創作</dt><dd>AI 輔助創作</dd></div></dl></section>
    ${related.length ? "<section><h2>更多「" + esc(s.theme) + "」詩歌</h2><div class=\"sp-list\">" + related.map(link).join("") + "</div></section>" : ""}
    <nav class="sp-pn" aria-label="上一首與下一首">${prev ? '<a href="../' + map[prev.zh] + '/">← ' + esc(prev.zh) + "</a>" : "<span></span>"}${next ? '<a href="../' + map[next.zh] + '/">' + esc(next.zh) + " →</a>" : ""}</nav>`;
  return page({
    up: "../../",
    url,
    image: thumb,
    title: full + "｜華語敬拜詩歌｜主在身旁",
    desc: "線上聆聽華語敬拜詩歌《" + s.zh + "》" + (s.en ? "（" + s.en + "）" : "") + "，主題「" + s.theme + "」，搭配經文" + s.verse.ref + "：" + s.verse.text,
    data: [
      { "@context": "https://schema.org", "@type": "MusicRecording", name: s.zh, alternateName: s.en || undefined, url, image: thumb, duration: isoDuration(s.time), inLanguage: "zh-Hant", genre: "基督教敬拜詩歌", sameAs: "https://www.youtube.com/watch?v=" + s.id, byArtist: { "@type": "MusicGroup", name: "主在身旁", url: SITE, sameAs: CHANNEL } },
      crumbs([["主在身旁", SITE], ["所有詩歌", SITE + "songs/"], [s.zh, url]])
    ],
    body
  });
}

function indexPage(songs, map) {
  const themes = [...new Set(songs.map((s) => s.theme))];
  const url = SITE + "songs/";
  const item = (s) => '<a href="' + map[s.zh] + '/"><b>' + esc(s.zh) + "</b><span>" + (s.en ? esc(s.en) + "・" : "") + esc(s.verse.ref) + "</span></a>";
  const body = `    <p class="sp-crumb"><a href="../">主在身旁</a> › 所有詩歌</p>
    <h1>所有詩歌</h1>
    <p>「主在身旁」目前共有 ${songs.length} 首華語敬拜詩歌，依主題分類，每首都附影片與相伴的經文。</p>
` + themes.map((t) => "    <section><h2>" + esc(t) + '</h2><div class="sp-list">' + songs.filter((s) => s.theme === t).map(item).join("") + "</div></section>").join("\n");
  return page({
    up: "../",
    url,
    image: SITE + "assets/icons/icon-512.png",
    title: "所有詩歌｜華語敬拜詩歌清單｜主在身旁",
    desc: "「主在身旁」華語敬拜詩歌完整清單，共 " + songs.length + " 首，依" + themes.join("、") + "分類，每首附影片與經文，可線上聆聽。",
    data: [crumbs([["主在身旁", SITE], ["所有詩歌", url]])],
    body
  });
}

const songs = readSongs();
const map = assignSlugs(songs);
fs.mkdirSync(OUT, { recursive: true });
/* 清單裡已移除的歌，連同網頁一起移除（songs/ 只放本程式產生的檔案） */
const keep = new Set(songs.map((s) => map[s.zh]));
fs.readdirSync(OUT, { withFileTypes: true }).forEach((d) => {
  if (d.isDirectory() && !keep.has(d.name)) fs.rmSync(path.join(OUT, d.name), { recursive: true });
});
songs.forEach((s, i) => {
  const dir = path.join(OUT, map[s.zh]);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), songPage(s, i, songs, map));
});
fs.writeFileSync(path.join(OUT, "index.html"), indexPage(songs, map));
const urls = [SITE, SITE + "songs/"].concat(songs.map((s) => SITE + "songs/" + map[s.zh] + "/"));
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => "  <url>\n    <loc>" + u + "</loc>\n  </url>\n").join("") + "</urlset>\n";
["sitemap.xml", "sitemap-pages.xml"].forEach((f) => fs.writeFileSync(path.join(ROOT, f), xml));
console.log("產生 " + songs.length + " 首歌曲頁、總覽頁與 sitemap（" + urls.length + " 個網址）");
