/* 奇妙半糖梦境 · 交互逻辑 */
(function () {
  const stage = document.getElementById('stage');
  const buttons = document.querySelectorAll('.nav-item');
  const panels = document.querySelectorAll('.panel');

  const TRACKS = [
    {
      title: '奇妙半糖的少女心事',
      src: 'https://oss.talesofai.cn/sts/96338e15-fff1-4adb-b896-0e5e08ce21a7_output.m3u8',
      poster: 'assets/song1.webp?v=35rk'
    },
    {
      title: '虚幻半糖',
      src: 'https://oss.talesofai.cn/sts/feb35165-43c7-4460-84d3-009f8b2113fe_output.m3u8',
      poster: 'assets/song2.webp?v=35rk'
    },
    {
      title: '果冻之海',
      src: 'https://oss.talesofai.cn/sts/27b33e87-f227-4585-ac83-301453e419a8_output.m3u8',
      poster: 'assets/song3.webp?v=35rk'
    },
    {
      title: 'Tulips Dreamland',
      src: 'https://oss.talesofai.cn/sts/e4ba13b160dc43559e18c64512100520/topic-videos/song-tulips/index.m3u8',
      poster: 'assets/song-tulips.webp?v=35rk'
    },
    {
      title: 'Dark chocolate sweetheart',
      src: 'https://oss.talesofai.cn/sts/e4ba13b160dc43559e18c64512100520/topic-videos/song5/index.m3u8',
      poster: 'assets/song5.webp?v=35rk'
    }
  ];

  const VIDEOS = {
    qixi: 'https://oss.talesofai.cn/sts/bd959137-331e-4cb8-bc2f-5f532c672d41_output.m3u8',
    dessert: 'https://oss.talesofai.cn/sts/af226339-f11b-41cf-b8cb-7c200158b3ee_output.m3u8',
    pudding: 'https://oss.talesofai.cn/sts/f4d04c89-e04f-470c-aa64-c78efac63861_output.m3u8',
    heiqiao: 'https://oss.talesofai.cn/sts/50f4401e-3ae7-4bc7-a619-b78a935d63c4_output.m3u8',
    kutang: 'https://oss.talesofai.cn/sts/a58d84d3-d749-4d3e-9fef-f09c1e14fdfb_output.m3u8',
    heiqiao2: 'https://oss.talesofai.cn/sts/d258c2e9-983c-43a7-bc5c-f7a31804b879_output.m3u8',
    baking: 'https://oss.talesofai.cn/sts/e4ba13b160dc43559e18c64512100520/topic-videos/anime-cc5048f5/index.m3u8',
    wash: 'https://oss.talesofai.cn/sts/e4ba13b160dc43559e18c64512100520/topic-videos/anime-cc5048f5/index.m3u8',
    kitchen: 'https://oss.talesofai.cn/sts/e4ba13b160dc43559e18c64512100520/topic-videos/anime-kitchen/index.m3u8',
    sugarfest: 'https://oss.talesofai.cn/sts/e4ba13b160dc43559e18c64512100520/topic-videos/sugarfest/index.m3u8',
    tart: 'https://oss.talesofai.cn/sts/e4ba13b160dc43559e18c64512100520/topic-videos/tart/index.m3u8',
    past: 'https://oss.talesofai.cn/sts/e4ba13b160dc43559e18c64512100520/topic-videos/past/index.m3u8'
  };

  let hls = null;
  let activePanel = null;

  /* ── 视频弹窗播放（主题曲 + 动画共用）── */
  const modal = document.getElementById('video-modal');
  const modalVideo = document.getElementById('modal-video');
  const modalClose = modal ? modal.querySelector('.video-modal-close') : null;

  function attachAndPlay() {
    if (/\.mp4($|\?)/.test(modalVideo.dataset.vsrc)) {
      modalVideo.src = modalVideo.dataset.vsrc;
      doPlay();
    } else {
      window.__ensureHls(function () {
        if (window.Hls && Hls.isSupported()) {
          if (hls) { hls.destroy(); }
          hls = new Hls();
          hls.loadSource(modalVideo.dataset.vsrc);
          hls.attachMedia(modalVideo);
        } else if (modalVideo.canPlayType('application/vnd.apple.mpegurl')) {
          modalVideo.src = modalVideo.dataset.vsrc;
        }
        doPlay();
      });
    }
  }

  function doPlay() {
    const p = modalVideo.play();
    if (p && p.catch) p.catch(function () {});

    // 视频播放时暂停 BGM
    const bgm = document.getElementById('bgm');
    if (bgm && !bgm.paused) bgm.pause();
  }

  function playInModal(src) {
    if (!modal || !modalVideo) return;
    modal.classList.add('is-open');
    if (window.NetaBackStack) NetaBackStack.push(function(){ closeModal(); }, 'video');
    
    if (hls) { hls.destroy(); hls = null; }
    modalVideo.removeAttribute('src');

    modalVideo.dataset.vsrc = src;
    attachAndPlay();
  }

  function closeModal() {
    if (!modal || !modalVideo) return;
    var wasOpen = modal.classList.contains('is-open');
    modal.classList.remove('is-open');
    modalVideo.pause();
    if (hls) { hls.destroy(); hls = null; }
    var bgm = document.getElementById('bgm');
    if (bgm && bgm.paused) bgm.play().catch(function(){});
    if (wasOpen && window.NetaBackStack) NetaBackStack.consume();
  }

  if (modalClose) {
    modalClose.addEventListener('click', function (e) {
      e.stopPropagation();
      closeModal();
    });
  }
  var modalBack = modal ? modal.querySelector('.video-back') : null;
  if (modalBack) {
    modalBack.addEventListener('click', function (e) {
      e.stopPropagation();
      closeModal();
    });
  }
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  /* ── 宿主物理返回键接管：只针对弹窗（阅读器/视频/人物卡/游戏）。
       弹窗关完后栏目保持打开，返回键交给宿主 ── */
  window.addEventListener('neta:back', function (e) {
    var video = document.getElementById('video-modal');
    var comic = document.getElementById('comic-modal');
    var char = document.getElementById('char-modal');
    var game = document.getElementById('game-fullscreen');
    if (video && video.classList.contains('is-open')) { e.preventDefault(); closeModal(); return; }
    if (comic && !comic.hidden) { e.preventDefault(); comic.querySelector('.reader-back') && comic.querySelector('.reader-back').click(); return; }
    if (char && !char.hidden) { e.preventDefault(); char.querySelector('.modal-close').click(); return; }
    if (game && !game.hidden) { e.preventDefault(); document.getElementById('game-fs-close').click(); return; }
  });

  /* ── 主题曲点卡片播放 ── */
  document.querySelectorAll('.song-item').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const i = parseInt(btn.dataset.track, 10);
      if (TRACKS[i]) playInModal(TRACKS[i].src);
    });
  });

  /* ── 动画栏目：子标签切换 + 点卡片播放 ── */
  document.querySelectorAll('.anime-tab').forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      e.stopPropagation();
      const target = tab.dataset.tab;
      document.querySelectorAll('.anime-tab').forEach(function (t) {
        t.classList.toggle('is-active', t === tab);
      });
      document.getElementById('anime-episodes').hidden = target !== 'episodes';
      document.getElementById('anime-pv').hidden = target !== 'pv';
    });
  });

  document.querySelectorAll('.anime-item').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const key = btn.dataset.video;
      if (VIDEOS[key]) playInModal(VIDEOS[key]);
    });
  });

  /* ── 面板切换 ── */
  function closeAll() {
    var had = activePanel !== null;
    activePanel = null;
    stage.classList.remove('panel-open');
    buttons.forEach(function (b) { b.classList.remove('is-active'); });
    panels.forEach(function (p) { p.classList.remove('is-open'); });
    /* 面板不压历史，关闭时也不消费历史 */
  }

  function open(name, btn) {
    closeAll();
    activePanel = name;
    stage.classList.add('panel-open');
    btn.classList.add('is-active');
    const panel = document.getElementById('panel-' + name);
    if (panel) {
      panel.classList.add('is-open');
      const scroll = panel.querySelector('.panel-scroll');
      if (scroll) scroll.scrollTop = 0;
    }
    /* 注：面板不压历史（2026-08-27 调整）：返回键只针对弹窗（阅读器/视频/人物卡/游戏），
       关掉弹窗后停在当前栏目，而不是收起面板回到首页 */
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const name = btn.dataset.panel;
      if (activePanel === name) {
        closeAll();
      } else {
        open(name, btn);
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!activePanel) return;
    if (e.target.closest('.panel') || e.target.closest('.nav-item')) return;
    closeAll();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && activePanel) closeAll();
  });

  // 读取宿主 iframe URL 上附带的 hashtag / 面板定位（location.search），并兼容 location.hash
  var params = new URLSearchParams(location.search);
  var hash = (params.get('panel') || location.hash.replace('#', '') || '').trim();
  if (hash) {
    buttons.forEach(function (b) {
      if (b.dataset.panel === hash) open(hash, b);
    });
  }
})();

/* ═══════ 封面轮播 ═══════ */
(function () {
  const slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  const dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  if (slides.length < 2) return;

  const INTERVAL = 5200;
  let idx = 0;
  let timer = null;

  function show(n) {
    idx = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('is-on', i === idx); });
    dots.forEach(function (d, i) { d.classList.toggle('is-on', i === idx); });
  }

  function start() {
    stop();
    timer = setInterval(function () { show(idx + 1); }, INTERVAL);
  }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  dots.forEach(function (d, i) {
    d.addEventListener('click', function (e) {
      e.stopPropagation();
      show(i);
      start();
    });
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  start();
})();

/* ═══════ 游戏栏目 ═══════ */
(function () {
  var GAMES = {
    dressup: 'https://public.cohub.run/s/7550e8c5-c255-410b-bfd2-6e4de33db429/works/pudding-dress-up-game-v2/index.html',
    candybounce: 'https://public.cohub.run/s/b10a09a1-9cde-4023-8c0b-c74340b6adcc/games/candy-bounce/index.html'
  };

  var overlay = document.getElementById('game-fullscreen');
  var iframe = document.getElementById('game-iframe');
  var closeBtn = document.getElementById('game-fs-close');
  var sdk = window.NetaTopicSDK;

  function openGame(url) {
    var openInline = function () {
      iframe.src = url;
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      if (window.NetaBackStack) NetaBackStack.push(function(){ closeGame(); }, 'game');
      var bgm = document.getElementById('bgm');
      if (bgm && !bgm.paused) bgm.pause();
    };
    // 嵌入宿主内：外部站 iframe 会被 CSP 拦截，改为交给宿主 nav.external（命中白名单则外起打开）
    if (sdk && sdk.embedded) {
      sdk.navExternal(url).then(function(){ /* 宿主外起打开，无需页面内弹窗 */ })
        .catch(function () {
          // 宿主拒绝 → 降级同源 iframe（独立预览或白名单允许时可用）
          openInline();
        });
      return;
    }
    openInline();
  }

  function closeGame() {
    var wasOpen = !overlay.hidden;
    overlay.hidden = true;
    iframe.src = '';
    document.body.style.overflow = '';
    var bgm = document.getElementById('bgm');
    if (bgm && bgm.paused) bgm.play().catch(function(){});
    if (wasOpen && window.NetaBackStack) NetaBackStack.consume();
  }

  document.querySelectorAll('.game-item').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var key = btn.dataset.game;
      if (GAMES[key]) openGame(GAMES[key]);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    closeGame();
  });

  if (overlay) overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeGame();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && !overlay.hidden) closeGame();
  });
})();

/* ═══════ 世界观子标签切换 ═══════ */
(function () {
  document.querySelectorAll('.world-tab').forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      e.stopPropagation();
      var target = tab.dataset.wtab;
      document.querySelectorAll('.world-tab').forEach(function (t) {
        t.classList.toggle('is-active', t === tab);
      });
      document.querySelectorAll('.world-pane').forEach(function (pane) {
        pane.hidden = pane.dataset.wpane !== target;
      });
    });
  });
})();

/* ═══════ 精选作品（实时抓取 nieta 空间精选标记） ═══════ */
(function () {
  var API = 'https://api.talesofai.cn/v1/activities/a3c71b2b-6a5c-42fb-aca5-89149f98066b/selected-stories/highlights';
  var REFRESH_MS = 60000;
  var FALLBACK_SEED = null; /* 最近一次成功数据，离线时兜底 */

  function fetchAll() {
    var pages = [];
    function page(i) {
      var url = API + '?page_index=' + i + '&page_size=100&sort_by=highlight_mark_time';
      return fetch(url, { credentials: 'omit' }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).then(function (d) {
        var list = (d && d.list) || [];
        if (!list.length) return pages;
        pages = pages.concat(list);
        return list.length < 100 ? pages : page(i + 1);
      });
    }
    return page(0);
  }

  function toItems(list) {
    var seen = {};
    var items = [];
    list.forEach(function (raw) {
      var sid = raw.storyId || raw.id;
      if (!sid || seen[sid]) return;
      seen[sid] = 1;
      var cover = raw.coverUrl || '';
      var share = raw.shareUrl || '';
      var aspect = '';
      try {
        var a = String(raw.aspect || '');
        if (/^\d+(\.\d+)?:\d+(\.\d+)?$/.test(a)) {
          var p = a.split(':');
          var w = parseFloat(p[0]), hh = parseFloat(p[1]);
          if (w > 0 && hh > 0) aspect = (w / hh).toFixed(4);
        }
      } catch (e) {}
      items.push({
        sid: String(sid),
        name: String(raw.name || '未命名作品'),
        user: String(raw.user_nick_name || raw.user_name || '捏Ta用户'),
        likes: Number(raw.likeCount) || 0,
        cover: cover,
        share: share,
        aspect: aspect,
        ctime: String(raw.ctime || ''),
        ts: Date.parse(String(raw.ctime || '').replace(' ', 'T') + (String(raw.ctime||'').length ? '+08:00' : '')) || (raw.highlight_timestamp_ms || 0)
      });
    });
    return items;
  }

  function pickPinned(items) {
    /* 首屏 4 张：优先选封面比例一致 + 近期热度高的——
       1) 取最近 14 天内有赞的作品，按（时间新→点赞高）排；
       2) 从第 1 张的比例出发，只补入比例相同(±2%)的，凑齐 4 张；
       3) 凑不齐则回退：比例一致优先，不够再用全站热作补齐 */
    var DAY = 14 * 24 * 3600 * 1000;
    var now = Date.now();
    function hot(it) { return it.ts >= now - DAY && it.likes > 0; }
    var recent = items.filter(hot).sort(function (x, y) { return (y.ts - x.ts) || (y.likes - x.likes); });
    var fallback = items.slice().sort(function (x, y) { return y.likes - x.likes; });

    function sameRatio(a, b) {
      if (!a || !b) return true;
      var ra = parseFloat(a.aspect), rb = parseFloat(b.aspect);
      if (!ra || !rb) return true;
      return Math.abs(ra - rb) / Math.max(ra, rb) < 0.02;
    }

    var picked = [], base = null, used = {};
    function tryPick(pool) {
      for (var i = 0; i < pool.length && picked.length < 4; i++) {
        var it = pool[i];
        if (used[it.sid]) continue;
        if (picked.length === 0) { base = it; picked.push(it); used[it.sid] = 1; continue; }
        if (sameRatio(base, it)) { picked.push(it); used[it.sid] = 1; }
      }
    }
    tryPick(recent);
    tryPick(fallback); /* 近期凑不齐 → 用全站热作补，仍限同比例 */
    if (picked.length < 4) { /* 还不够 → 放弃比例限制，按热度补齐 */
      for (var j = 0; j < fallback.length && picked.length < 4; j++) {
        if (!used[fallback[j].sid]) { picked.push(fallback[j]); used[fallback[j].sid] = 1; }
      }
    }
    return picked;
  }

  function makeCard(item) {
    var a = document.createElement('a');
    a.className = 'featured-card';
    var href = 'https://app.nieta.art/collection/interaction?uuid=' + encodeURIComponent(item.sid);
    a.href = href;
    a.rel = 'noopener noreferrer';
    var sdk = window.NetaTopicSDK;
    if (sdk && sdk.ready) {
      a.target = '';
      a.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        sdk.navInternal('/collection/interaction', { uuid: item.sid }).catch(function () {
          window.open(href, '_blank', 'noopener');
        });
      });
    } else {
      a.target = '_blank';
    }
    var ratio = item.aspect ? 'aspect-ratio:' + item.aspect : '';
    var img = item.cover
      ? '<img src="' + item.cover.replace(/"/g, '&quot;') + '" alt="' + item.name.replace(/</g, '&lt;') + '" loading="lazy" referrerpolicy="no-referrer">'
      : '<img src="" alt="" loading="lazy">';
    a.innerHTML =
      '<span class="fc-cover"' + (ratio ? ' style="' + ratio + '"' : '') + '>' + img + '</span>' +
      '<span class="fc-info">' +
        '<span class="fc-name">' + item.name.replace(/</g, '&lt;') + '</span>' +
        '<span class="fc-meta">' +
          '<span class="fc-user">' + item.user.replace(/</g, '&lt;') + '</span>' +
          '<span class="fc-likes">♥ ' + item.likes + '</span>' +
        '</span>' +
      '</span>';
    return a;
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  var lastPinned = [], lastRest = [];
  function renderSection(sec, pinned, restItems, expandedState) {
    var topGrid = sec.querySelector('.featured-cards');
    if (!topGrid) return;
    topGrid.innerHTML = '';
    var list = expandedState ? pinned.concat(restItems) : pinned;
    list.forEach(function (it) { topGrid.appendChild(makeCard(it)); });
    var restWrap = sec.querySelector('.featured-more-wrap');
    var toggle = sec.querySelector('.featured-toggle');
    if (restWrap) restWrap.hidden = true;
    if (toggle) {
      toggle.hidden = restItems.length === 0;
      toggle.textContent = expandedState ? '收起 ▲' : '查看更多 ▼';
    }
  }
  function renderAll() {
    document.querySelectorAll('.featured-section').forEach(function (sec, i) {
      renderSection(sec, lastPinned, lastRest, !!expanded[i]);
    });
  }

  function buildSkeleton() {
    var sec = document.createElement('div');
    sec.className = 'featured-section';
    sec.innerHTML =
      '<h2 class="featured-title"><span class="h-orn">★</span> 精选作品 <span class="h-orn">★</span></h2>' +
      '<div class="featured-cards" id="featured-top"></div>' +
      '<div class="featured-more-wrap" id="featured-more-wrap" hidden>' +
        '<div class="featured-grid featured-grid-rest" id="featured-rest"></div>' +
      '</div>' +
      '<button class="featured-toggle" id="featured-toggle" hidden>查看更多 ▼</button>';
    return sec;
  }

  var expanded = {}; /* section index -> bool */

  function injectAll() {
    document.querySelectorAll('.panel').forEach(function (panel, idx) {
      if (panel.querySelector('.featured-section')) return;
      var scroll = panel.querySelector('.panel-scroll');
      if (!scroll) return;
      var sec = buildSkeleton();
      scroll.appendChild(sec);
      var toggle = sec.querySelector('.featured-toggle');
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        expanded[idx] = !expanded[idx];
        renderAll();
      });
    });
  }

  function refresh() {
    return fetchAll().then(function (list) {
      var items = toItems(list);
      if (!items.length) return;
      FALLBACK_SEED = items;
      var pinned = pickPinned(items);
      var pinnedIds = {};
      pinned.forEach(function (p) { pinnedIds[p.sid] = 1; });
      var rest = items.filter(function (it) { return !pinnedIds[it.sid]; })
                      .sort(function (x, y) { return y.likes - x.likes; });
      lastPinned = pinned; lastRest = rest;
      renderAll();
    }).catch(function (err) {
      if (FALLBACK_SEED) {
        var pinned = pickPinned(FALLBACK_SEED);
        var pinnedIds = {};
        pinned.forEach(function (p) { pinnedIds[p.sid] = 1; });
        var rest = FALLBACK_SEED.filter(function (it) { return !pinnedIds[it.sid]; })
                                .sort(function (x, y) { return y.likes - x.likes; });
        lastPinned = pinned; lastRest = rest;
        renderAll();
      }
    });
  }

  function injectPromo() {
    document.querySelectorAll('.panel').forEach(function (panel) {
      if (panel.querySelector('.promo-banner')) return;
      var scroll = panel.querySelector('.panel-scroll');
      if (!scroll) return;
      var promo = document.createElement('div');
      promo.className = 'promo-banner';
      promo.innerHTML =
        '<img class="promo-deco" src="assets/promo-deco.webp" alt="" aria-hidden="true">' +
        '<h2 class="promo-title">奇妙半糖梦境</h2>' +
        '<p class="promo-text">这里的甜度刚好是‘半糖’——甜而不腻，<br>苦而不涩，像一口刚好的生活。</p>' +
        '<button class="promo-btn" type="button">前往梦境画廊</button>';
      scroll.appendChild(promo);
      promo.querySelector('.promo-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        location.href = 'gallery.html';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { injectAll(); injectPromo(); refresh(); });
  } else {
    injectAll(); injectPromo(); refresh();
  }
  setInterval(function () { if (!document.hidden) refresh(); }, REFRESH_MS);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) refresh();
  });
})();

