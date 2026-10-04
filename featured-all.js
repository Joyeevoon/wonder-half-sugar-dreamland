/* ═══════ 精选作品独立页：拉取全部精选并瀑布流渲染 ═══════ */
(function () {
  var API = 'https://api.talesofai.cn/v1/activities/a3c71b2b-6a5c-42fb-aca5-89149f98066b/selected-stories/highlights';

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

  function makeCard(item) {
    var a = document.createElement('a');
    a.className = 'featured-card';
    var href = 'https://app.nieta.art/collection/interaction?uuid=' + encodeURIComponent(item.sid);
    a.href = href;
    a.rel = 'noopener noreferrer';
    var sdk = window.NetaTopicSDK;
    if (sdk && sdk.ready) {
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

  document.getElementById('back').addEventListener('click', function () {
    /* 回主页（同版本目录），不依赖 history 以免跳出嵌入层 */
    location.href = 'index.html';
  });
  /* 宿主物理返回键：回主页 */
  window.addEventListener('neta:back', function (e) {
    e.preventDefault();
    location.href = 'index.html';
  });

  fetchAll().then(function (list) {
    var seen = {}, items = [];
    list.forEach(function (raw) {
      var sid = raw.storyId || raw.id;
      if (!sid || seen[sid]) return;
      seen[sid] = 1;
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
        cover: raw.coverUrl || '',
        aspect: aspect
      });
    });
    /* 按点赞排序展示全部 */
    items.sort(function (x, y) { return y.likes - x.likes; });
    var wall = document.getElementById('fa-wall');
    wall.innerHTML = '';
    items.forEach(function (it) { wall.appendChild(makeCard(it)); });
  }).catch(function () {
    document.getElementById('fa-loading').textContent = '加载失败，请刷新重试';
  });
})();
