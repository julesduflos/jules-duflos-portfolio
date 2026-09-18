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
