(function () {
  "use strict";

  var SITE = window.SITE;
  var SONGS = window.SONGS;
  var THEMES = window.THEMES;

  var ICON_PLAY = '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg>';
  var ICON_PAUSE = '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg>';

  /* 播放狀態 */
  var ytPlayer = null;
  var apiReady = false;
  var waiting = false;
  var playerReady = false;
  var playing = false;
  var started = false;
  var queue = SONGS.slice();
  var order = [];
  var pos = 0;
  var shuffle = false;
  var repeat = "all";
  var errorStreak = 0;
  var seeking = false;
  var slotVisible = true;
  var listenVisible = true;
  var dismissed = false;
  var theme = "全部";
  var toastTimer = 0;

  function $(id) { return document.getElementById(id); }
  function thumb(id) { return "https://i.ytimg.com/vi/" + encodeURIComponent(id) + "/hqdefault.jpg"; }
  function watchUrl(id) { return "https://www.youtube.com/watch?v=" + encodeURIComponent(id); }
  function clock(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
  function randomInt(n) { return Math.floor(Math.random() * n); }
  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = randomInt(i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function toast(text) {
    var el = $("toast");
    el.textContent = text;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 3500);
  }

  /* 目前歌曲 */
  function currentSong() { return queue[order[pos]] || SONGS[0]; }

  function buildOrder(startIndex) {
    var indices = queue.map(function (_, i) { return i; });
    if (shuffle) {
      indices = shuffled(indices);
      if (startIndex != null) {
        indices.splice(indices.indexOf(startIndex), 1);
        indices.unshift(startIndex);
      }
      pos = 0;
    } else {
      pos = startIndex == null ? 0 : startIndex;
    }
    order = indices;
  }

  function showSong(song) {
    $("now-title").textContent = song.zh;
    $("now-en").textContent = song.en;
    $("now-link").href = watchUrl(song.id);
    $("dock-title").textContent = song.zh;
    $("dock-img").src = thumb(song.id);
    $("time-total").textContent = song.time || "0:00";
    showVerse(song);
    markCurrent();
  }

  /* 經文跟著目前的歌切換：播放區、底部播放列、頁首同步更新 */
  function showVerse(song) {
    var verse = song.verse;
    var box = $("song-verse");
    box.hidden = !verse;
    $("dock-verse").textContent = verse ? verse.ref + "｜" + verse.text : song.en;
    if (!verse) return;
    $("sv-text").textContent = verse.text;
    $("sv-ref").textContent = verse.ref;
    box.classList.remove("verse-in");
    void box.offsetWidth;
    box.classList.add("verse-in");
    if (started) {
      $("verse-text").textContent = verse.text;
      $("verse-ref").textContent = verse.ref;
      $("verse-song").hidden = true;
    }
  }

  function markCurrent() {
    var id = started ? currentSong().id : null;
    var buttons = $("tracks").querySelectorAll(".track");
    buttons.forEach(function (btn) {
      if (btn.dataset.id === id) btn.setAttribute("aria-current", "true");
      else btn.removeAttribute("aria-current");
    });
    var cur = $("tracks").querySelector('.track[aria-current="true"]');
    if (cur) {
      var list = $("tracks");
      var top = cur.offsetTop - list.offsetTop;
      if (top < list.scrollTop || top + cur.offsetHeight > list.scrollTop + list.clientHeight) {
        list.scrollTop = top - 8;
      }
    }
  }

  function setPlayIcons() {
    document.querySelectorAll('[data-act="toggle"]').forEach(function (btn) {
      btn.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
      btn.setAttribute("aria-label", playing ? "暫停" : "播放");
      btn.title = playing ? "暫停" : "播放";
    });
    document.body.classList.toggle("is-playing", playing);
    $("now-label").textContent = !started ? "最新發行" : playing ? "正在播放" : "已暫停";
  }

  /* 影片捲出畫面時，改用小視窗繼續顯示 */
  function updateFloating() {
    var floatIt = started && !slotVisible && !listenVisible && !dismissed;
    $("player").classList.toggle("floating", floatIt);
    $("mini-close").hidden = !floatIt;
    var showDock = started && !slotVisible;
    $("dock").hidden = !showDock;
    document.body.classList.toggle("has-dock", showDock);
  }

  /* YouTube 播放器 */
  window.onYouTubeIframeAPIReady = function () {
    apiReady = true;
    if (waiting) createPlayer();
  };

  function loadApi() {
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.onerror = function () {
      if (waiting) failLoad();
    };
    document.head.append(tag);
  }

  function failLoad() {
    waiting = false;
    toast("播放器載入失敗，請稍後再試，或在 YouTube 開啟這首歌。");
  }

  function createPlayer() {
    waiting = false;
    ytPlayer = new YT.Player("yt-target", {
      host: "https://www.youtube-nocookie.com",
      videoId: currentSong().id,
      playerVars: { autoplay: 1, rel: 0, playsinline: 1, origin: location.origin },
      events: {
        onReady: function (e) {
          playerReady = true;
          $("facade").hidden = true;
          var frame = e.target.getIframe();
          frame.title = "主在身旁 詩歌播放器";
          var loaded = e.target.getVideoData && e.target.getVideoData().video_id;
          if (loaded && loaded !== currentSong().id) e.target.loadVideoById(currentSong().id);
          else e.target.playVideo();
        },
        onStateChange: onState,
        onError: onError
      }
    });
  }

  function onState(e) {
    var S = YT.PlayerState;
    if (e.data === S.PLAYING) {
      playing = true;
      errorStreak = 0;
      dismissed = false;
    } else if (e.data === S.PAUSED || e.data === S.CUED) {
      playing = false;
    } else if (e.data === S.ENDED) {
      playing = false;
      next(true);
    }
    setPlayIcons();
    updateFloating();
  }

  function onError() {
    errorStreak += 1;
    if (errorStreak >= 5) {
      playing = false;
      setPlayIcons();
      toast("連續多首無法播放，請在 YouTube 開啟。");
      return;
    }
    toast("《" + currentSong().zh + "》無法在這裡播放，自動換下一首。");
    setTimeout(function () { next(true); }, 1500);
  }

  function playCurrent() {
    started = true;
    dismissed = false;
    showSong(currentSong());
    setPlayIcons();
    updateFloating();
    if (ytPlayer && playerReady) {
      ytPlayer.loadVideoById(currentSong().id);
    } else if (!ytPlayer) {
      if (apiReady) createPlayer();
      else {
        waiting = true;
        setTimeout(function () { if (waiting) failLoad(); }, 8000);
      }
    }
  }

  function next(auto) {
    if (auto && repeat === "one") {
      playCurrent();
      return;
    }
    if (pos + 1 < order.length) {
      pos += 1;
    } else {
      if (auto && repeat === "off") {
        toast("清單播放完畢。");
        return;
      }
      if (shuffle) order = shuffled(order);
      pos = 0;
    }
    playCurrent();
  }

  function prev() {
    if (ytPlayer && playerReady && ytPlayer.getCurrentTime && ytPlayer.getCurrentTime() > 4) {
      ytPlayer.seekTo(0, true);
      return;
    }
    pos = pos > 0 ? pos - 1 : order.length - 1;
    playCurrent();
  }

  function toggle() {
    if (!started || !ytPlayer) {
      playCurrent();
      return;
    }
    if (!playerReady) return;
    if (playing) ytPlayer.pauseVideo();
    else {
      dismissed = false;
      ytPlayer.playVideo();
    }
  }

  function playFrom(list, song) {
    queue = list.slice();
    buildOrder(song ? queue.indexOf(song) : null);
    playCurrent();
  }

  function goToPlayer() {
    $("listen").scrollIntoView();
  }

  function tick() {
    if (!ytPlayer || !playerReady || !ytPlayer.getDuration) return;
    var dur = ytPlayer.getDuration() || 0;
    var now = ytPlayer.getCurrentTime() || 0;
    var ratio = dur ? now / dur : 0;
    $("dock-bar").style.width = (ratio * 100) + "%";
    if (!seeking) {
      $("seek").value = Math.round(ratio * 1000);
      $("time-now").textContent = clock(now);
    }
    if (dur) $("time-total").textContent = clock(dur);
  }

  /* 清單 */
  function themeSongs() {
    if (theme === "全部") return SONGS;
    return SONGS.filter(function (s) { return s.theme === theme; });
  }

  function visibleSongs() {
    var q = $("q").value.trim().toLowerCase();
    var songs = themeSongs();
    if (!q) return songs;
    return songs.filter(function (s) {
      return s.zh.toLowerCase().indexOf(q) !== -1 || s.en.toLowerCase().indexOf(q) !== -1;
    });
  }

  function renderChips() {
    var frag = document.createDocumentFragment();
    ["全部"].concat(THEMES).forEach(function (name) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = name;
      b.setAttribute("aria-pressed", String(name === theme));
      b.addEventListener("click", function () {
        theme = name;
        renderChips();
        renderTracks();
      });
      frag.append(b);
    });
    $("chips").replaceChildren(frag);
  }

  function renderTracks() {
    var songs = visibleSongs();
    var frag = document.createDocumentFragment();
    songs.forEach(function (song) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "track";
      btn.dataset.id = song.id;
      btn.setAttribute("aria-label", "播放 " + song.zh + " " + song.en);

      var box = document.createElement("span");
      box.className = "t-thumb";
      var img = document.createElement("img");
      img.src = thumb(song.id);
      img.alt = "";
      img.loading = "lazy";
      img.width = 84;
      img.height = 47;
      var eq = document.createElement("span");
      eq.className = "eq";
      eq.innerHTML = "<i></i><i></i><i></i>";
      box.append(img, eq);

      var text = document.createElement("span");
      text.className = "t-text";
      var zh = document.createElement("span");
      zh.className = "t-zh";
      zh.textContent = song.zh;
      var en = document.createElement("span");
      en.className = "t-en";
      en.textContent = song.en;
      text.append(zh, en);

      var time = document.createElement("span");
      time.className = "t-time";
      time.textContent = song.time;

      btn.append(box, text, time);
      btn.addEventListener("click", function () { playFrom(visibleSongs(), song); });
      li.append(btn);
      frag.append(li);
    });
    $("tracks").replaceChildren(frag);
    $("empty").hidden = songs.length !== 0;
    $("play-list").hidden = songs.length === 0;
    $("play-list").textContent = "連續播放這 " + songs.length + " 首";
    markCurrent();
  }

  /* 開站時隨機顯示一首歌的經文，並可直接播放那首歌 */
  function setupVerse() {
    var last = null;
    try { last = localStorage.getItem("lastVerse"); } catch (e) {}
    var pool = SONGS.filter(function (s) { return s.verse && s.verse.ref !== last; });
    if (!pool.length) return;
    var song = pool[randomInt(pool.length)];
    $("verse-text").textContent = song.verse.text;
    $("verse-ref").textContent = song.verse.ref;
    try { localStorage.setItem("lastVerse", song.verse.ref); } catch (e) {}

    var btn = $("verse-song");
    btn.textContent = "聆聽相關詩歌《" + song.zh + "》";
    btn.hidden = false;
    btn.addEventListener("click", function () {
      theme = "全部";
      $("q").value = "";
      renderChips();
      renderTracks();
      playFrom(SONGS, song);
      goToPlayer();
    });
  }

  /* 背景輪播 */
  function setupBackgrounds() {
    var INTERVAL = 10000;
    var list = shuffled(window.BACKGROUNDS);
    var layers = [$("bg-a"), $("bg-b")];
    var front = 0;
    var index = 0;

    function src(item) { return "assets/bg/" + item.file; }
    function credit(item) {
      $("bg-credit").textContent = "背景畫作：《" + item.title + "》" + item.artist + "，" + item.year + "｜" + item.bible;
    }

    layers[0].style.backgroundImage = 'url("' + src(list[0]) + '")';
    layers[0].classList.add("is-on");
    credit(list[0]);

    var conn = navigator.connection;
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches || (conn && conn.saveData);
    if (still) return;

    setInterval(function () {
      if (document.hidden) return;
      var nextItem = list[(index + 1) % list.length];
      var img = new Image();
      img.onload = function () {
        index = (index + 1) % list.length;
        var back = layers[1 - front];
        back.style.backgroundImage = 'url("' + src(nextItem) + '")';
        back.classList.add("is-on");
        layers[front].classList.remove("is-on");
        front = 1 - front;
        credit(nextItem);
      };
      img.src = src(nextItem);
    }, INTERVAL);
  }

  function setupCredits() {
    var frag = document.createDocumentFragment();
    window.BACKGROUNDS.forEach(function (p) {
      var tr = document.createElement("tr");
      function cell(main, sub) {
        var td = document.createElement("td");
        td.append(main);
        if (sub) {
          var s = document.createElement("small");
          s.textContent = sub;
          td.append(s);
        }
        tr.append(td);
      }
      cell("《" + p.title + "》", p.en);
      cell(p.artist, p.year);
      cell(p.bible);
      cell(p.holder);
      cell(p.license);
      var a = document.createElement("a");
      a.href = p.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "來源";
      a.setAttribute("aria-label", "《" + p.title + "》的來源");
      cell(a);
      frag.append(tr);
    });
    $("credit-rows").append(frag);
  }

  function setupSupport() {
    SITE.payMethods.forEach(function (m) {
      var li = document.createElement("li");
      li.textContent = m;
      $("methods").append(li);
    });
    if (/^https:\/\//.test(SITE.donateUrl)) {
      $("donate").href = SITE.donateUrl;
      $("donate").hidden = false;
      $("pending").hidden = true;
      $("give-label").textContent = "贊助方式";
    }
    if (SITE.contactEmail) {
      $("contact").textContent = "聯絡：" + SITE.contactEmail;
      $("contact").hidden = false;
    }
  }

  /* 事件 */
  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest("[data-act]") : null;
    if (!el) return;
    if (el.dataset.act === "toggle") toggle();
    if (el.dataset.act === "next") next(false);
    if (el.dataset.act === "prev") prev();
  });

  $("facade").addEventListener("click", function () { playCurrent(); });
  $("play-all").addEventListener("click", function () {
    theme = "全部";
    $("q").value = "";
    renderChips();
    renderTracks();
    playFrom(SONGS, null);
    goToPlayer();
  });
  $("play-list").addEventListener("click", function () { playFrom(visibleSongs(), null); });
  $("q").addEventListener("input", renderTracks);
  $("dock-song").addEventListener("click", goToPlayer);

  $("shuffle").addEventListener("click", function () {
    var song = currentSong();
    shuffle = !shuffle;
    this.setAttribute("aria-pressed", String(shuffle));
    this.classList.toggle("is-on", shuffle);
    buildOrder(queue.indexOf(song));
    toast(shuffle ? "已開啟隨機播放" : "已關閉隨機播放");
  });

  $("repeat").addEventListener("click", function () {
    var modes = { all: "one", one: "off", off: "all" };
    var labels = { all: "重複播放：整個清單", one: "重複播放：單曲", off: "重複播放：關閉" };
    repeat = modes[repeat];
    this.classList.toggle("is-on", repeat !== "off");
    $("repeat-one").hidden = repeat !== "one";
    this.setAttribute("aria-label", labels[repeat]);
    this.title = labels[repeat];
    toast(labels[repeat]);
  });

  $("seek").addEventListener("input", function () {
    seeking = true;
    if (ytPlayer && playerReady) {
      $("time-now").textContent = clock(ytPlayer.getDuration() * this.value / 1000);
    }
  });
  $("seek").addEventListener("change", function () {
    seeking = false;
    if (ytPlayer && playerReady) ytPlayer.seekTo(ytPlayer.getDuration() * this.value / 1000, true);
    else this.value = 0;
  });

  $("mini-close").addEventListener("click", function () {
    dismissed = true;
    if (ytPlayer && playerReady) ytPlayer.pauseVideo();
    updateFloating();
  });

  /* 初始化 */
  $("subscribe").href = SITE.channelUrl + "?sub_confirmation=1";
  $("all-link").href = SITE.channelUrl + "/videos";
  $("footer-yt").href = SITE.channelUrl;
  $("year").textContent = new Date().getFullYear();

  buildOrder(0);
  $("repeat").classList.add("is-on");
  $("facade-img").src = thumb(SONGS[0].id);
  $("facade-label").textContent = "播放 " + SONGS[0].zh;
  showSong(SONGS[0]);
  setPlayIcons();
  setupVerse();
  setupBackgrounds();
  setupCredits();
  setupSupport();
  renderChips();
  renderTracks();
  loadApi();

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      slotVisible = entries[0].isIntersecting;
      updateFloating();
    }, { threshold: 0.15 }).observe($("player-slot"));
    new IntersectionObserver(function (entries) {
      listenVisible = entries[0].isIntersecting;
      updateFloating();
    }).observe($("listen"));
  }
  setInterval(tick, 500);
})();
