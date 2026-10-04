/*
 * 奇妙半糖梦境 · topic-sdk 适配层（frame-bridge v2 握手）
 * --------------------------------------------------------
 * 宿主 App 在加载本 embed 页的 iframe 时，会监听 window.message，
 * 只认带 { v:2, method:"hello", ... } 的握手；若 8 秒内收不到 hello，
 * 宿主判定"加载失败"并展示错误占位（即 dev32 版"几秒后失败"的根因）。
 *
 * 本文件实现 frame-bridge v2 客户端协议：向 window.parent 发起 hello，
 * 收到宿主回执后进入 ready 态，并暴露 nav / toast / viewport 能力。
 * 在非嵌入环境（独立浏览器预览）下安全降级，不打扰页面。
 */
(function (global) {
  'use strict';

  if (global.NetaTopicSDK) return; // 防重复

  var PARENT = global.parent;
  var HANDSHAKE_TIMEOUT = 4000; // 留足宿主 8s 上限的一半做自检
  var pending = Object.create(null); // id -> {resolve, reject}
  var seq = 0;
  var hostOrigin = null; // 握手回执来源，后续定向 postMessage
  var ready = false;
  var readyCallbacks = [];
  var viewport = { safeTop: 0, safeBottom: 0, keyboardInset: 0,
                   width: global.innerWidth, height: global.innerHeight };

  function isEmbedded() {
    try { return PARENT && PARENT !== global; } catch (e) { return false; }
  }

  function post(msg) {
    if (!PARENT) return;
    // 'null' origin (file:// sandbox / opaque) 不能作为 postMessage target，回退 '*'
    var target = (hostOrigin && hostOrigin !== 'null') ? hostOrigin : '*';
    try { PARENT.postMessage(msg, target); } catch (e) {}
  }

  // 通用 RPC：向宿主发起一次 method 调用，返回 Promise
  function call(method, params) {
    return new Promise(function (resolve, reject) {
      if (!ready) { reject(new Error('sdk-not-ready')); return; }
      var id = ++seq;
      pending[id] = { resolve: resolve, reject: reject };
      post({ v: 2, id: id, method: method, params: params || {} });
      // 超时兜底，避免 pending 永不结算
      setTimeout(function () {
        if (pending[id]) {
          pending[id].reject(new Error('rpc-timeout: ' + method));
          delete pending[id];
        }
      }, 6000);
    });
  }

  function onMessage(ev) {
    var data = ev.data;
    if (!data || data.v !== 2) return;

    // 第一次回执即锁定来源 origin，后续只认该 origin（'null' 保留但不作 target）
    if (hostOrigin === null) hostOrigin = ev.origin;

    // 事件（event 字段，无 id/无 ok）
    if (data.event) {
      handleEvent(data.event, data.data || {});
      return;
    }

    // RPC 回执（id + ok）
    if (data.id && pending[data.id]) {
      var p = pending[data.id];
      delete pending[data.id];
      if (data.ok) p.resolve(data.result);
      else p.reject(Object.assign(new Error((data.error && data.error.message) || 'rpc-error'),
                     { code: data.error && data.error.code }));
    }
  }

  function handleEvent(name, data) {
    if (name === 'tokenChanged') {
      // 宿主下发登录态变更；本页不持久化 token，仅广播
      global.dispatchEvent(new CustomEvent('neta:token', { detail: { token: data.token || null } }));
    } else if (name === 'viewport') {
      viewport = Object.assign({}, viewport, data);
      global.dispatchEvent(new CustomEvent('neta:viewport', { detail: viewport }));
    } else if (name === 'back') {
      // 宿主物理返回键先交页面处理；页面可 preventDefault 拦截
      var e = new CustomEvent('neta:back', { cancelable: true });
      var intercepted = !global.dispatchEvent(e);
      if (intercepted) {
        // 页面拦截了返回键（弹窗已自行关闭）→ 告知宿主已处理，不要退出/重载页面
        post({ v: 2, event: 'backHandled', data: { handled: true } });
      } else {
        // 未拦截 → 交回宿主（真实返回上一层）
        post({ v: 2, event: 'backHandled', data: { handled: false } });
      }
    }
  }

  // 发起 hello 握手；宿主 frame-bridge v2 会以 { v:2, ok:true, result:{client,appVersion,features} } 回执
  function handshake() {
    var helloId = ++seq;
    pending[helloId] = {
      resolve: function (env) {
        ready = true;
        viewport = Object.assign({}, viewport,
          { width: env && env.width, height: env && env.height });
        readyCallbacks.splice(0).forEach(function (cb) {
          try { cb(env); } catch (e) {}
        });
        global.dispatchEvent(new CustomEvent('neta:ready', { detail: env }));
      },
      reject: function () { /* 握手失败保持静默，页面照常渲染 */ }
    };
    post({ v: 2, id: helloId, method: 'hello', params: {} });
    setTimeout(function () {
      if (pending[helloId]) delete pending[helloId];
    }, HANDSHAKE_TIMEOUT);
  }

  // ── 对外 API ──────────────────────────────────────────
  var api = {
    /** 是否运行在宿主 iframe 内 */
    embedded: isEmbedded(),
    /** 是否已完成握手 */
    get ready() { return ready; },
    /** 握手完成后回调一次；已 ready 则同步回调 */
    ready: function (cb) {
      if (ready) { try { cb(); } catch (e) {} return; }
      readyCallbacks.push(cb);
    },
    /** 当前视口信息（safeTop 恒为 0，宿主已占顶部安全区） */
    viewport: function () { return Object.assign({}, viewport); },

    /** 站内导航：route 必须在宿主白名单内（/tag /collection/interaction 等） */
    navInternal: function (route, query) {
      return call('nav.internal', { route: route, query: query || {} });
    },
    /** 站外导航：url 必须命中宿主 outbound 白名单 */
    navExternal: function (url) {
      return call('nav.external', { url: url });
    },
    /** 申请成为宿主话题（若该话题配置了 apply-host 表单） */
    navApplyHost: function () {
      return call('nav.applyHost', {});
    },
    /** 轻提示 */
    toast: function (text, opts) {
      return call('ui.toast', { text: String(text || ''),
        duration: opts && opts.duration, level: opts && opts.level });
    }
  };

  global.addEventListener('message', onMessage);

  if (isEmbedded()) {
    // 嵌入环境：发起握手；同时请求一次最新 viewport
    handshake();
  } else {
    // 独立预览：直接标记 ready，回调照常触发，nav 类调用静默降级
    ready = true;
  }

  global.NetaTopicSDK = api;
})(window);
