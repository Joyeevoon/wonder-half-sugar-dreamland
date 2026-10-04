/* ═══════ 漫画阅读器（支持章节） + 背景音乐 ═══════ */
(function () {
  const COMICS = {
    /* 主线漫画 · 4章 */
    maincomic: {
      title: '奇妙半糖梦境主线漫画',
      chapters: [
        {
          title: '第一章 · 裂谷来信',
          pages: [
            'assets/sts/sts_img_12.webp?v=35rk',
            'assets/sts/sts_img_27.png?v=35rk',
            'assets/sts/sts_img_42.jpg?v=35rk',
            'assets/sts/sts_img_43.jpg?v=35rk',
            'assets/sts/sts_img_10.jpg?v=35rk',
            'assets/sts/sts_img_50.jpg?v=35rk',
            'assets/sts/sts_img_19.jpg?v=35rk',
            'assets/sts/sts_img_57.jpg?v=35rk',
            'assets/sts/sts_img_17.jpg?v=35rk',
            'assets/sts/sts_img_25.jpg?v=35rk',
            'assets/sts/sts_img_14.jpg?v=35rk',
            'assets/sts/sts_img_34.jpg?v=35rk',
            'assets/sts/sts_img_31.jpg?v=35rk'
          ]
        },
        {
          title: '第二章 · 深培之下',
          pages: [
            'assets/sts/sts_img_11.jpg?v=35rk',
            'assets/sts/sts_img_46.jpg?v=35rk',
            'assets/sts/sts_img_29.jpg?v=35rk',
            'assets/sts/sts_img_54.jpg?v=35rk',
            'assets/sts/sts_img_15.jpg?v=35rk',
            'assets/sts/sts_img_53.jpg?v=35rk',
            'assets/sts/sts_img_22.jpg?v=35rk',
            'assets/sts/sts_img_30.jpg?v=35rk',
            'assets/sts/sts_img_58.jpg?v=35rk',
            'assets/sts/sts_img_60.png?v=35rk',
            'assets/sts/sts_img_32.jpg?v=35rk',
            'assets/sts/sts_img_56.jpg?v=35rk',
            'assets/sts/sts_img_61.jpg?v=35rk',
            'assets/sts/sts_img_26.jpg?v=35rk',
            'assets/sts/sts_img_9.jpg?v=35rk'
          ]
        },
        {
          title: '第三章 · 各自的准备',
          pages: [
            'assets/sts/sts_img_23.jpeg?v=35rk',
            'assets/sts/sts_img_28.jpeg?v=35rk',
            'assets/sts/sts_img_45.jpeg?v=35rk',
            'assets/sts/sts_img_59.jpg?v=35rk',
            'assets/sts/sts_img_49.jpg?v=35rk',
            'assets/sts/sts_img_41.jpg?v=35rk',
            'assets/sts/sts_img_39.jpg?v=35rk',
            'assets/sts/sts_img_24.webp?v=35rk',
            'assets/sts/sts_img_51.jpg?v=35rk',
            'assets/sts/sts_img_35.jpg?v=35rk',
            'assets/sts/sts_img_13.jpg?v=35rk',
            'assets/sts/sts_img_36.jpg?v=35rk'
          ]
        },
        {
          title: '第四章 · 旧糖纸馆',
          pages: [
            'assets/sts/sts_img_33.webp?v=35rk',
            'assets/sts/sts_img_55.jpg?v=35rk',
            'assets/sts/sts_img_40.webp?v=35rk',
            'assets/sts/sts_img_38.jpeg?v=35rk',
            'assets/sts/sts_img_47.webp?v=35rk',
            'assets/sts/sts_img_44.webp?v=35rk',
            'assets/sts/sts_img_52.webp?v=35rk',
            'assets/sts/sts_img_18.webp?v=35rk',
            'assets/sts/sts_img_20.webp?v=35rk',
            'assets/sts/sts_img_8.webp?v=35rk',
            'assets/sts/sts_img_48.webp?v=35rk',
            'assets/sts/sts_img_16.webp?v=35rk',
            'assets/sts/sts_img_21.jpg?v=35rk',
            'assets/sts/sts_img_37.webp?v=35rk'
          ]
        },
        {
          title: '第五章 · 缺口的弧线',
          pages: [
            'assets/sts/ch5-01.webp?v=35rk',
            'assets/sts/ch5-02.webp?v=35rk',
            'assets/sts/ch5-03.webp?v=35rk',
            'assets/sts/ch5-04.webp?v=35rk',
            'assets/sts/ch5-05.webp?v=35rk',
            'assets/sts/ch5-06.webp?v=35rk',
            'assets/sts/ch5-07.webp?v=35rk',
            'assets/sts/ch5-08.webp?v=35rk',
            'assets/sts/ch5-09.webp?v=35rk',
            'assets/sts/ch5-10.webp?v=35rk',
            'assets/sts/ch5-11.webp?v=35rk',
            'assets/sts/ch5-12.webp?v=35rk',
            'assets/sts/ch5-13.webp?v=35rk',
            'assets/sts/ch5-14.webp?v=35rk'
          ]
        }
      ]
    },
    /* 日常漫画 · 原8集 */
    main: {
      title: '日常故事 · 奇妙半糖梦境成员日常',
      label: '第 {n} 集',
      pages: [
        'assets/m-ep1.webp?v=35rk',
        'assets/m-ep2.webp?v=35rk',
        'assets/m-ep3.webp?v=35rk',
        'assets/m-ep4.webp?v=35rk',
        'assets/m-ep5.webp?v=35rk',
        'assets/m-ep6.webp?v=35rk',
        'assets/m-ep7.webp?v=35rk',
        'assets/m-ep8.webp?v=35rk'
      ]
    }
  };

  const modal = document.getElementById('comic-modal');
  if (modal) {
    const rTitle = document.getElementById('r-title');
    const rImg = document.getElementById('r-img');
    const rInd = document.getElementById('r-ind');
    const rChapters = document.getElementById('r-chapters');
    const btnPrev = document.getElementById('r-prev');
    const btnNext = document.getElementById('r-next');
    let cur = null;
    let page = 0;
    let chapter = 0;

    function getPages() {
      var c = COMICS[cur];
      if (c.chapters) return c.chapters[chapter].pages;
      return c.pages;
    }
    function getTotal() {
      return getPages().length;
    }

    /* 阅读页渲染：优先从图集裁剪（sprite），无图集时回退直链 */
    function showPage(src) {
      var key = String(src).split('/').pop().split('?')[0];
      var info = (window.ATLAS_MAP || {})[key];
      if (!info) {
        rImg.style.backgroundImage = 'none';
        rImg.style.width = rImg.style.height = '';
        rImg.setAttribute('data-fallback', src);
        if (rImg.tagName === 'IMG') rImg.src = src;
        return;
      }
      rImg.removeAttribute('data-fallback');
      var size = (window.ATLAS_SIZE || {})[info[0]] || [1, 1];
      var ax = info[1], ay = info[2], w = info[3], h = info[4];
      var stage = document.getElementById('r-stage');
      var availW = Math.max(80, stage.clientWidth - 24);
      var availH = Math.max(80, stage.clientHeight - 24);
      var k = Math.min(availW / w, availH / h, 1.4);
      rImg.style.backgroundImage = 'url(assets/' + info[0] + ')';
      rImg.style.backgroundRepeat = 'no-repeat';
      rImg.style.backgroundSize = (size[0] * k) + 'px ' + (size[1] * k) + 'px';
      rImg.style.backgroundPosition = (-ax * k) + 'px ' + (-ay * k) + 'px';
      rImg.style.width = (w * k) + 'px';
      rImg.style.height = (h * k) + 'px';
    }

    function render() {
      var pages = getPages();
      showPage(pages[page]);
      rImg.setAttribute('aria-label', rTitle.textContent + ' P' + (page + 1));
      var c = COMICS[cur];
      if (c.chapters) {
        rInd.textContent = c.chapters[chapter].title + ' · P' + (page + 1) + '/' + pages.length;
      } else {
        rInd.textContent = c.label.replace('{n}', page + 1) + ' / 共 ' + pages.length + ' 集';
      }
      btnPrev.disabled = page === 0 && chapter === 0;
      btnNext.disabled = page === pages.length - 1 && chapter === (c.chapters ? c.chapters.length - 1 : 0);
    }

    function buildChapters() {
      var c = COMICS[cur];
      if (!c.chapters || !rChapters) { if (rChapters) rChapters.hidden = true; return; }
      rChapters.hidden = false;
      rChapters.innerHTML = '';
      c.chapters.forEach(function (ch, i) {
        var btn = document.createElement('button');
        btn.className = 'r-chap' + (i === chapter ? ' is-active' : '');
        btn.textContent = ch.title;
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          chapter = i;
          page = 0;
          buildChapters();
          render();
        });
        rChapters.appendChild(btn);
      });
    }

    function openComic(key) {
      if (!COMICS[key]) return;
      cur = key;
      page = 0;
      chapter = 0;
      rTitle.textContent = COMICS[key].title;
      buildChapters();
      render();
      modal.hidden = false;
      if (window.NetaBackStack) NetaBackStack.push(function(){ closeComic(); }, 'comic');
      /* 弹窗布局就绪后重算图集裁剪尺寸 */
      requestAnimationFrame(function(){ try { render(); } catch (e) {} });
      setTimeout(function(){ try { render(); } catch (e) {} }, 120);
      const scroll = modal.querySelector('.reader-stage');
      if (scroll) scroll.scrollTop = 0;
    }

    function closeComic() {
      var wasOpen = !modal.hidden;
      modal.hidden = true;
      if (wasOpen && window.NetaBackStack) NetaBackStack.consume();
    }
    function prev() {
      if (page > 0) { page--; render(); }
      else if (chapter > 0) { chapter--; page = getPages().length - 1; buildChapters(); render(); }
    }
    function next() {
      var c = COMICS[cur];
      if (page < getPages().length - 1) { page++; render(); }
      else if (c.chapters && chapter < c.chapters.length - 1) { chapter++; page = 0; buildChapters(); render(); }
    }

    btnPrev.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
    btnNext.addEventListener('click', function (e) { e.stopPropagation(); next(); });

    document.querySelectorAll('.comic-vol').forEach(function (btn) {
      if (btn.classList.contains('is-locked')) return;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (btn.dataset.comic) openComic(btn.dataset.comic);
      });
    });
    var readerBack = modal.querySelector('.reader-back');
    if (readerBack) readerBack.addEventListener('click', function (e) {
      e.stopPropagation();
      closeComic();
    });
    modal.querySelector('.reader-veil').addEventListener('click', function (e) {
      e.stopPropagation();
      closeComic();
    });
    modal.querySelector('.reader-frame').addEventListener('click', function (e) {
      e.stopPropagation();
    });
    /* 触屏翻页热区：左右点一下翻页，中间不干扰 */
    var stageEl = modal.querySelector('#r-stage');
    if (stageEl) {
      stageEl.addEventListener('click', function (e) {
        if (e.target && (e.target.tagName === 'IMG' || e.target.id === 'r-img')) {
          var rect = stageEl.getBoundingClientRect();
          var x = (e.clientX - rect.left) / rect.width;
          if (x < 0.28) prev();
          else if (x > 0.72) next();
        }
      });
      /* 窗口尺寸变化时重算图集裁剪尺寸 */
      window.addEventListener('resize', function () {
        if (!modal.hidden) { try { render(); } catch (e) {} }
      });
    }
    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') { e.stopPropagation(); closeComic(); }
      else if (e.key === 'ArrowLeft') { e.stopPropagation(); prev(); }
      else if (e.key === 'ArrowRight') { e.stopPropagation(); next(); }
    }, true);
  }

  /* BGM：每次进入网页从头播放 + 自动播放 */
  const bgm = document.getElementById('bgm');
  const toggle = document.getElementById('bgm-toggle');
  if (!bgm || !toggle) return;

  /* 同源 data URI（绕过 publish 的 .mp3 类型限制 + 外链失效） */
  if (window.BGM_DATA_URI) bgm.src = window.BGM_DATA_URI;

  let wantPlay = true;

  function syncUI() {
    toggle.classList.toggle('is-muted', bgm.paused);
  }

  function tryPlay() {
    if (!wantPlay || !bgm.src) return;
    const p = bgm.play();
    if (p && p.catch) p.catch(function () {
      /* 浏览器自动播放策略：首次用户交互后再试 */
      function retryOnce(){ document.removeEventListener('pointerdown',retryOnce,true); document.removeEventListener('keydown',retryOnce,true); document.removeEventListener('touchstart',retryOnce,true); if (!bgm.src && window.BGM_DATA_URI) bgm.src = window.BGM_DATA_URI; tryPlay(); }
      document.addEventListener('pointerdown',retryOnce,true);
      document.addEventListener('keydown',retryOnce,true);
      document.addEventListener('touchstart',retryOnce,{passive:true});
    });
  }

  bgm.addEventListener('play', syncUI);
  bgm.addEventListener('pause', syncUI);

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (bgm.paused) { wantPlay = true; tryPlay(); }
    else { wantPlay = false; bgm.pause(); }
  });

  /* 首次交互：播放（defer 的 BGM 数据未就绪时 src 仍为空，后续 retryOnce 兑现） */
  function onFirstGesture() {
    if (!bgm.src && window.BGM_DATA_URI) bgm.src = window.BGM_DATA_URI;
    tryPlay();
    document.removeEventListener('pointerdown', onFirstGesture, true);
    document.removeEventListener('keydown', onFirstGesture, true);
  }
  document.addEventListener('pointerdown', onFirstGesture, true);
  document.addEventListener('keydown', onFirstGesture, true);

  /* 每次进入网页：从头开始 + 尝试自动播放 */
  if (bgm.src) { try { bgm.currentTime = 0; } catch (e) {} }
  tryPlay();
  syncUI();
})();
