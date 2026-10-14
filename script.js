// ניווט בין שקפים במקלדת: חצים, PageUp/PageDown, רווח, Home/End
(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  if (!slides.length) return;

  function currentIndex() {
    const mid = window.scrollY + window.innerHeight / 3;
    let idx = 0;
    slides.forEach((s, i) => { if (s.offsetTop <= mid) idx = i; });
    return idx;
  }

  function go(i) {
    const target = slides[Math.max(0, Math.min(slides.length - 1, i))];
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, [contenteditable]')) return;
    const i = currentIndex();
    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
      case 'ArrowLeft':   // באתר RTL — שמאלה = קדימה
        e.preventDefault(); go(i + 1); break;
      case 'ArrowUp':
      case 'PageUp':
      case 'ArrowRight':
        e.preventDefault(); go(i - 1); break;
      case 'Home':
        e.preventDefault(); go(0); break;
      case 'End':
        e.preventDefault(); go(slides.length - 1); break;
    }
  });
})();
