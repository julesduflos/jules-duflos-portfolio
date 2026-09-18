// Social dropdown toggle
const socialToggle = document.getElementById('socialToggle');
const socialDropdown = document.getElementById('socialDropdown');

if (socialToggle && socialDropdown) {
  socialToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = socialDropdown.classList.toggle('is-open');
    socialToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!socialDropdown.contains(e.target) && e.target !== socialToggle) {
      socialDropdown.classList.remove('is-open');
      socialToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      socialDropdown.classList.remove('is-open');
      socialToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
