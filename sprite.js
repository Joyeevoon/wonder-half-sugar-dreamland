/* ═══════ 通用图集裁剪 ═══════
   用法：给 <img> 加 data-sprite="图片名.webp" 并去掉 src，
   本脚本在加载后把每张替换为图集裁剪背景（百分比定位，自适应缩放）。 */
(function(){
  var MAN = window.SPRITE_MANIFEST || {};
  var AW = window.SPRITE_W || 1200, AH = window.SPRITE_H || 12160;

  function apply(){
    document.querySelectorAll('img[data-sprite]').forEach(function (img) {
      var name = img.getAttribute('data-sprite');
      var e = MAN[name];
      if (!e) return;
      var bw = (AW / e.w * 100), bh = (AH / e.h * 100);
      var px = e.w < AW ? -(e.x / (AW - e.w) * 100) : 0;
      var py = e.h < AH ? -(e.y / (AH - e.h) * 100) : 0;
      img.style.backgroundImage = 'url(assets/atlas-misc.webp)';
      img.style.backgroundSize = bw + '% ' + bh + '%';
      img.style.backgroundPosition = px + '% ' + py + '%';
      /* 保持元素原布局：宽高由 CSS 控制（width:100%/固定等） */
      img.style.aspectRatio = e.w + ' / ' + e.h;
      img.style.objectFit = 'fill';
      img.removeAttribute('data-sprite'); /* 只处理一次 */
      img.classList.add('sprited');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
  window.addEventListener('load', apply);
})();
