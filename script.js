// Fonction générique pour gérer un menu déroulant
function setupDropdown(toggleId, dropdownId) {
  const toggle = document.getElementById(toggleId);
  const dropdown = document.getElementById(dropdownId);

  if (toggle && dropdown) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      // Ferme l'autre menu s'il est ouvert
      document.querySelectorAll('.social-dropdown').forEach(d => {
        if (d !== dropdown) d.classList.remove('is-open');
      });
      document.querySelectorAll('.social-toggle').forEach(t => {
        if (t !== toggle) t.setAttribute('aria-expanded', 'false');
      });

      const isOpen = dropdown.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== toggle) {
        dropdown.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdown.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// Initialisation des deux menus
setupDropdown('socialToggle', 'socialDropdown');
setupDropdown('contactToggle', 'contactDropdown');

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
// ==========================================
// Lightbox Galerie Photos Sous-Marines
// ==========================================
const photoItems = document.querySelectorAll('.sous-marine-grid .sm-item img');
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentIndex = 0;
const photosSrc = Array.from(photoItems).map(img => img.src);

if (lightboxModal && photoItems.length > 0) {
  // Ouvrir au clic sur une photo
  photoItems.forEach((img, index) => {
    img.style.cursor = 'pointer'; // Indique qu'on peut cliquer
    img.addEventListener('click', () => {
      currentIndex = index;
      lightboxImg.src = photosSrc[currentIndex];
      lightboxModal.classList.add('is-active');
    });
  });

  // Fermer la lightbox
  const closeLightbox = () => {
    lightboxModal.classList.remove('is-active');
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  // Photo suivante / précédente
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % photosSrc.length;
    lightboxImg.src = photosSrc[currentIndex];
  });

  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + photosSrc.length) % photosSrc.length;
    lightboxImg.src = photosSrc[currentIndex];
  });

  // Navigation au clavier (Flèches gauche/droite et Échap)
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lightboxNext.click();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
  });
}
// ==========================================
// Lightbox ultra-simple et directe
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.sous-marine img');
  
  if (images.length === 0) return;

  // Création automatique de la modale dans la page si elle n'y est pas
  const modal = document.createElement('div');
  modal.id = 'customLightbox';
  modal.style.cssText = 'display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.9); justify-content:center; align-items:center; cursor:pointer;';
  
  const imgElement = document.createElement('img');
  imgElement.style.cssText = 'max-width:90vw; max-height:90vh; object-fit:contain; border-radius:4px;';
  modal.appendChild(imgElement);
  document.body.appendChild(modal);

  let currentIndex = 0;
  const imageSources = Array.from(images).map(img => img.src);

  images.forEach((img, index) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      e.preventDefault();
      currentIndex = index;
      imgElement.src = imageSources[currentIndex];
      modal.style.display = 'flex';
    });
  });

  // Fermer au clic sur le fond noir
  modal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Navigation avec les flèches du clavier ou Échap
  document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'flex') {
      if (e.key === 'Escape') {
        modal.style.display = 'none';
      } else if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % imageSources.length;
        imgElement.src = imageSources[currentIndex];
      } else if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
        imgElement.src = imageSources[currentIndex];
      }
    }
  });
});
