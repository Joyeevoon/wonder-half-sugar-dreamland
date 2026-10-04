/* ═══════ 桌宠 · 霜糖琉璃：可拖动 + 点击说话 ═══════ */
(function () {
  const pet = document.getElementById('pet');
  if (!pet) return;
  const img = document.getElementById('pet-img');
  const bubble = document.getElementById('pet-bubble');

  const STATES = [
    { src: 'assets/pet1.webp?v=35rk', say: '欢迎各位来到奇妙半糖世界！' },
    { src: 'assets/pet2.webp?v=35rk', say: '请你关注霜糖作者大大喵~' },
    { src: 'assets/pet3.webp?v=35rk', say: '霜糖琉璃很高兴认识你！你可以点击角色卡片了解我哟~' }
  ];
  let idx = 0;
  let bubbleTimer = null;
  let userMoved = false;

  // 预加载三张形象
  STATES.forEach(function (s) { const im = new Image(); im.src = s.src; });

  /* ── 初始位置：漫画按钮正上方 ── */
  function placeInitial() {
    if (userMoved) return;
    const anchor = document.querySelector('.nav-item[data-panel="comic"]');
    const w = pet.offsetWidth || 96;
    const h = pet.offsetHeight || Math.round(w * 2.15);
    let x, y;
    if (anchor) {
      const r = anchor.getBoundingClientRect();
      x = r.left + r.width / 2 - w / 2;
      y = r.top - h - 8;
    } else {
      x = window.innerWidth - w - 20;
      y = 80;
    }
    x = Math.max(4, Math.min(x, window.innerWidth - w - 4));
    y = Math.max(4, y);
    pet.style.left = x + 'px';
    pet.style.top = y + 'px';
  }

  /* ── 点击：换形象 + 冒泡说话 ── */
  function speak() {
    const st = STATES[idx];
    img.src = st.src;
    bubble.textContent = st.say;
    bubble.hidden = false;
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () { bubble.hidden = true; }, 3600);
    idx = (idx + 1) % STATES.length;
  }

  /* ── 拖动（pointer events，兼容触屏） ── */
  let dragging = false;
  let moved = false;
  let startX = 0, startY = 0, origX = 0, origY = 0;

  pet.addEventListener('pointerdown', function (e) {
    e.stopPropagation();
    dragging = true;
    moved = false;
    startX = e.clientX;
    startY = e.clientY;
    const rect = pet.getBoundingClientRect();
    origX = rect.left;
    origY = rect.top;
    pet.classList.add('is-dragging');
    pet.setPointerCapture(e.pointerId);
  });

  pet.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) { moved = true; userMoved = true; }
    if (!moved) return;
    const w = pet.offsetWidth, h = pet.offsetHeight;
    let x = origX + dx, y = origY + dy;
    x = Math.max(-w * 0.3, Math.min(x, window.innerWidth - w * 0.7));
    y = Math.max(0, Math.min(y, window.innerHeight - h * 0.5));
    pet.style.left = x + 'px';
    pet.style.top = y + 'px';
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    pet.classList.remove('is-dragging');
    if (!moved) speak();          // 没拖动 → 视为点击
  }
  pet.addEventListener('pointerup', endDrag);
  pet.addEventListener('pointercancel', endDrag);

  // 点桌宠不触发页面其它点击逻辑
  pet.addEventListener('click', function (e) { e.stopPropagation(); });

  // 视口变化时确保不出界
  window.addEventListener('resize', function () {
    const rect = pet.getBoundingClientRect();
    const w = pet.offsetWidth, h = pet.offsetHeight;
    let x = Math.max(-w * 0.3, Math.min(rect.left, window.innerWidth - w * 0.7));
    let y = Math.max(0, Math.min(rect.top, window.innerHeight - h * 0.5));
    pet.style.left = x + 'px';
    pet.style.top = y + 'px';
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', placeInitial);
  } else {
    placeInitial();
  }
  // 字体/图片加载后导航栏位置可能变化，再校一次
  window.addEventListener('load', placeInitial, { once: true });
  if (!img.complete) img.addEventListener('load', placeInitial, { once: true });
})();
