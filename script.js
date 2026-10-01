// ==========================================
// Menus déroulants (Contact / Social)
// ==========================================
const menuToggles = document.querySelectorAll('.social-toggle');

function closeMenus(except) {
  menuToggles.forEach(t => {
    const d = document.getElementById(t.getAttribute('aria-controls'));
    if (d && d !== except) {
      d.classList.remove('is-open');
      t.setAttribute('aria-expanded', 'false');
    }
  });
}

menuToggles.forEach(t => {
  const d = document.getElementById(t.getAttribute('aria-controls'));
  if (!d) return;
  t.addEventListener('click', e => {
    e.stopPropagation();
    closeMenus(d);
    const open = d.classList.toggle('is-open');
    t.setAttribute('aria-expanded', String(open));
  });
});

document.addEventListener('click', e => {
  if (!e.target.closest('.contact-menu, .social-menu')) closeMenus();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenus();
});

// ==========================================
// Année du footer
// ==========================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ==========================================
// Vidéos : lecture seulement quand visibles
// ==========================================
const videos = document.querySelectorAll('.project-card video');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion) {
  videos.forEach(v => { v.controls = true; });
} else if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.play().catch(() => {});
      else target.pause();
    });
  }, { threshold: 0.25 });
  videos.forEach(v => io.observe(v));
} else {
  videos.forEach(v => v.play().catch(() => {}));
}

// ==========================================
// Lightbox galerie (une seule)
// ==========================================
const modal = document.getElementById('lightboxModal');
const bigImg = document.getElementById('lightboxImg');
const thumbs = Array.from(document.querySelectorAll('.sm-item img'));

if (modal && bigImg && thumbs.length) {
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev = document.getElementById('lightboxPrev');
  const btnNext = document.getElementById('lightboxNext');
  let index = 0;
  let opener = null;
  let touchX = null;

  const show = n => {
    index = (n + thumbs.length) % thumbs.length;
    bigImg.src = thumbs[index].currentSrc || thumbs[index].src;
    bigImg.alt = thumbs[index].alt;
  };

  const open = n => {
    opener = document.activeElement;
    show(n);
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  };

  const close = () => {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
    if (opener) opener.focus();
  };

  thumbs.forEach((img, n) => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.addEventListener('click', () => open(n));
    img.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(n);
      }
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(index - 1));
  btnNext.addEventListener('click', () => show(index + 1));
  modal.addEventListener('click', e => { if (e.target === modal) close(); });

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('is-active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });

  // Swipe tactile
  modal.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  modal.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) show(dx < 0 ? index + 1 : index - 1);
  }, { passive: true });
}
