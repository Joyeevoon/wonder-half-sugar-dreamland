/* ═══════ 弹窗返回栈管理 ═══════
   原理：打开弹窗时 pushState 压入历史，宿主返回键触发 popstate →
   只关闭顶层弹窗，不退出嵌入层（与梦境画廊的页面跳转同一机制）。

   历史结构：[..., 页面(无state), 哨兵, 弹窗1, 弹窗2...]
   - 返回落在哨兵/弹窗层 → 关弹窗，停留在页面（栏目保持）
   - 主动点 ✕ 关闭 → consume() 自己 back() 消费条目（consuming 标记防误判）
   - 返回落在页面底层(无state) 且没有弹窗 → 帮用户再退一步 → 宿主正常退出
*/
(function () {
  var stack = [];            // [{ close: fn, name: string }]
  var consuming = false;     // 正在通过 consume() 主动消费，防止误触发退出

  function isOpen(target) {
    if (!target) return false;
    if (typeof target.classList !== 'undefined' && target.classList.contains('is-open')) return true;
    return target.hidden === false;
  }

  /* 打开弹窗时调用 */
  function push(closer, name) {
    stack.push({ close: closer, name: name || 'overlay' });
    try { history.pushState({ netaOverlay: stack.length }, '', location.href); } catch (e) {}
  }

  /* 主动关闭（用户点 ✕ / 返回按钮后调用）：消费一个历史条目 */
  function consume() {
    if (consuming) return;
    if (!stack.length) return;
    stack.pop();
    consuming = true;
    try { history.back(); } catch (e) { consuming = false; }
  }

  window.addEventListener('popstate', function (ev) {
    /* 自己 consume() 触发的回退：仅复位标记，不动作 */
    if (consuming) { consuming = false; return; }

    /* 有弹窗打开：返回键 = 关闭顶层弹窗，停留在页面 */
    if (stack.length) {
      var top = stack[stack.length - 1];
      stack.pop();
      try { top.close(); } catch (e) {}
      return;
    }

    /* 无弹窗时的返回：已落到页面底层（state 为空）→ 帮用户再退一步，
       让宿主 WebView 正常离开（退出嵌入层），绝不锁死 */
    var s = ev.state;
    if (!s || (!s.netaSentinel && !s.netaOverlay)) {
      try { history.back(); } catch (e) {}
    }
    /* 落在哨兵上且无弹窗：什么都不做（刚关完弹窗的落点），下次返回自然退出 */
  });

  /* SDK 返回事件（宿主走 frame-bridge v2 时）：同样只关顶层；
     栈空不拦截 → 宿主自行退出 */
  window.addEventListener('neta:back', function (e) {
    if (stack.length) {
      e.preventDefault();
      var top = stack[stack.length - 1];
      stack.pop();
      try { top.close(); } catch (e2) {}
      consuming = true;
      try { history.back(); } catch (e2) { consuming = false; }
    }
  });

  window.NetaBackStack = {
    push: push,
    consume: consume,
    get depth() { return stack.length; },
    isOpen: isOpen
  };

  /* 页面加载时压入哨兵：保证弹窗历史条目下方永远是本页面，
     而不是宿主加载 iframe 时残留的跳转条目（否则首次返回会整页重载丢面板状态） */
  try { history.pushState({ netaSentinel: 1 }, '', location.href); } catch (e) {}
})();
