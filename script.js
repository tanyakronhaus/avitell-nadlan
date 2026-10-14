// כותרת קבועה + ניווט בין שקפים
// - הכותרת (.topbar) נשארת למעלה, והטקסט שלה מתחלף לפי השקף שמתחתיה
// - חצי למעלה/למטה בכותרת, ומקלדת: חצים, PageUp/PageDown, רווח, Home/End
(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  if (!slides.length) return;

  const root = document.documentElement;
  const topbar = document.getElementById('topbar');
  const pill = topbar.querySelector('.pill');
  const titleEl = document.getElementById('pill-title');
  const countEl = document.getElementById('nav-count');
  const prevBtn = document.getElementById('nav-prev');
  const nextBtn = document.getElementById('nav-next');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // הטקסט של כל שקף נלקח מה-.pill שלו ב-HTML
  const titles = slides.map((s) => {
    const t = s.querySelector('.pill-title');
    return { text: t ? t.textContent.trim() : '', isNew: !!(t && t.classList.contains('is-new')) };
  });

  root.classList.add('fixed-pill');
  topbar.hidden = false;

  // גובה הכותרת הקבועה — כדי שתוכן השקף יתחיל מתחתיה
  let headH = 0;
  function measure() {
    headH = Math.ceil(pill.getBoundingClientRect().bottom);
    root.style.setProperty('--head-h', headH + 'px');
  }
  measure();
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(pill);
  window.addEventListener('resize', measure);

  function currentIndex() {
    const line = window.scrollY + headH + 2;
    let idx = 0;
    slides.forEach((s, i) => { if (s.offsetTop <= line) idx = i; });
    // בסוף העמוד — השקף האחרון
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) idx = slides.length - 1;
    return idx;
  }

  // ---------- החלפת הכותרת ----------
  let shown = -1;
  let wanted = -1;
  let animating = false;

  function applyTitle(i) {
    titleEl.textContent = titles[i].text;
    titleEl.classList.toggle('is-new', titles[i].isNew);
  }

  function setTitle(i, dir) {
    wanted = i;
    if (animating) return;
    if (shown === -1 || reduceMotion.matches || !titleEl.animate) {
      applyTitle(i); shown = i; return;
    }
    animating = true;
    const out = titleEl.animate(
      [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateY(${-dir * 45}%)` }],
      { duration: 150, easing: 'ease-in', fill: 'forwards' }
    );
    out.onfinish = () => {
      const target = wanted;
      applyTitle(target); shown = target;
      const inn = titleEl.animate(
        [{ opacity: 0, transform: `translateY(${dir * 45}%)` }, { opacity: 1, transform: 'none' }],
        { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' }
      );
      out.cancel();
      inn.onfinish = () => {
        animating = false;
        if (wanted !== shown) setTitle(wanted, wanted > shown ? 1 : -1);
      };
    };
  }

  function update() {
    const i = currentIndex();
    if (i !== wanted) setTitle(i, i > wanted ? 1 : -1);
    countEl.textContent = String(i + 1).padStart(2, '0') + ' / ' + slides.length;
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === slides.length - 1;
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  }, { passive: true });
  window.addEventListener('resize', update);

  // ---------- ניווט ----------
  // בזמן גלילה חלקה זוכרים את היעד, כדי שלחיצות מהירות יתקדמו שקף אחרי שקף
  let pending = null;
  let pendingTimer = null;

  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    pending = i;
    clearTimeout(pendingTimer);
    pendingTimer = setTimeout(() => { pending = null; }, 900);
    slides[i].scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
  }
  window.addEventListener('scrollend', () => { pending = null; });

  function base() { return pending !== null ? pending : currentIndex(); }

  prevBtn.addEventListener('click', () => go(base() - 1));
  nextBtn.addEventListener('click', () => go(base() + 1));

  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select, [contenteditable]')) return;
    if ((e.key === ' ' || e.key === 'Enter') && e.target.closest('button, a')) return;
    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
      case 'ArrowLeft':   // באתר RTL — שמאלה = קדימה
        e.preventDefault(); go(base() + 1); break;
      case 'ArrowUp':
      case 'PageUp':
      case 'ArrowRight':
        e.preventDefault(); go(base() - 1); break;
      case 'Home':
        e.preventDefault(); go(0); break;
      case 'End':
        e.preventDefault(); go(slides.length - 1); break;
    }
  });

  update();
})();
