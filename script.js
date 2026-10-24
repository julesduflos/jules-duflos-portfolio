const root = 'https://pub-d598919c97b34fd5850a4a1b05d93234.r2.dev/';

const films = [
  {
    role: '1er AC',
    camera: 'Alexa 35 · Hi-5',
    file: 'VID_20250613_030058_039.mp4'
  },
  {
    role: 'Cadreur',
    camera: 'FX3 · A7S III · FX6',
    file: 'TTB montage.mp4'
  },
  {
    role: 'Cadreur',
    camera: 'FX3',
    file: 'VID_20250612_140637_022.mp4'
  },
  {
    role: 'Cadreur',
    camera: 'Alexa 35',
    file: 'VID_20250604_072546_499.mp4'
  },
  {
    role: '1er AC',
    camera: 'Alexa 35 · Nucleus-M',
    file: 'Timeline-1.mp4'
  },
  {
    role: 'Kinect',
    camera: '3D',
    file: 'kinect-porte-follio-_1_.mp4'
  }
];

const photoUrls = [
  root + 'Still%202026-09-09%20134125_1.1.1.jpg',
  root + 'Still%202026-09-09%20134224_1.4.1.jpg',
  root + 'Still%202026-09-09%20134240_1.6.1.jpg',
  root + 'Still%202026-09-09%20142249_1.10.1.jpg',
  root + 'Still%202026-09-09%20142257_1.11.1.jpg'
];

const reduced = matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

/* Nom avec flou sur les côtés */

const nameText = 'Jules Duflos';
const name = document.querySelector('.focus-name');

[...nameText].forEach((letter, i) => {
  const el = document.createElement('span');

  el.textContent = letter === ' ' ? '\u00a0' : letter;

  const distance = Math.min(i, nameText.length - 1 - i);

  el.style.setProperty(
    '--blur',
    `${[2.4, 1.35, 0.65, 0.15, 0, 0][Math.min(distance, 5)]}px`
  );

  name.append(el);
});

/* Vidéos */

films.forEach((film, i) => {
  const figure = document.createElement('figure');
  figure.className = 'project';

  figure.innerHTML = `
    <button
      class="project-media"
      data-film="${i}"
      aria-label="Voir le film : ${film.role}, ${film.camera}"
    >
      <video
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        aria-hidden="true"
      >
        <source
          src="${root + encodeURIComponent(film.file)}"
          type="video/mp4"
        >
      </video>
    </button>
    <figcaption>
      <span>${film.role}</span><span>${film.camera}</span>
    </figcaption>
  `;

  document.querySelector('#projects').append(figure);
});

/* Photos */

for (let i = 0; i < photoUrls.length; i++) {
  const button = document.createElement('button');

  button.className = 'photo';
  button.dataset.photo = i;

  button.setAttribute(
    'aria-label',
    `Voir la photographie sous-marine ${i + 1}`
  );

  button.innerHTML = `
    <img
      src="${photoUrls[i]}"
      alt="Photographie argentique sous-marine ${i + 1}"
      loading="lazy"
    >
  `;

  document.querySelector('#photos').append(button);
}

/* Menus Contact et Social */

const menus = [...document.querySelectorAll('.menu')];

function menuState(menu, open) {
  menu.classList.toggle('open', open);

  menu.querySelector('button').setAttribute(
    'aria-expanded',
    String(open)
  );

  menu.querySelector('.menu-links').inert = !open;
}

menus.forEach(menu => {
  menu.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') {
      menus.forEach(item => menuState(item, item === menu));
    }
  });

  menu.addEventListener('pointerleave', event => {
    if (
      event.pointerType === 'mouse' &&
      !menu.contains(document.activeElement)
    ) {
      menuState(menu, false);
    }
  });

  menu.querySelector('button').addEventListener('click', event => {
    const mouseClick =
      event.detail > 0 &&
      matchMedia('(hover:hover) and (pointer:fine)').matches;

    const open = mouseClick
      ? true
      : !menu.classList.contains('open');

    menus.forEach(item => {
      menuState(item, item === menu && open);
    });
  });

  menu.addEventListener('focusout', event => {
    if (!menu.contains(event.relatedTarget)) {
      menuState(menu, false);
    }
  });
});

document.addEventListener('pointerdown', event => {
  if (!event.target.closest('.menu')) {
    menus.forEach(menu => menuState(menu, false));
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    menus.forEach(menu => menuState(menu, false));
  }
});

/* Visionneuse */

const viewer = document.querySelector('#viewer');
const content = document.querySelector('#viewerContent');
const caption = document.querySelector('#viewerCaption');

let mode;
let index;
let opener;

function render() {
  content.replaceChildren();

  if (mode === 'film') {
    const film = films[index];
    const video = document.createElement('video');

    video.src = root + encodeURIComponent(film.file);
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;

    content.append(video);
    caption.textContent = `${film.role} — ${film.camera}`;
  } else {
    const image = document.createElement('img');

    image.src = photoUrls[index];
    image.alt = `Photographie argentique sous-marine ${index + 1}`;

    content.append(image);
    caption.textContent = `${index + 1} / 5`;

    image.addEventListener('load', updateCursor, { once: true });
  }

  requestAnimationFrame(updateCursor);
}

function open(type, i, button) {
  mode = type;
  index = i;
  opener = button;

  render();
  viewer.showModal();

  viewer.append(cursor);
  updateCursor();

  document.body.style.overflow = 'hidden';
}

document.querySelectorAll('[data-film]').forEach(button => {
  button.addEventListener('click', () => {
    open('film', Number(button.dataset.film), button);
  });
});

document.querySelectorAll('[data-photo]').forEach(button => {
  button.addEventListener('click', () => {
    open('photo', Number(button.dataset.photo), button);
  });
});

function step(direction) {
  const count = mode === 'film' ? films.length : photoUrls.length;

  index = (index + direction + count) % count;
  render();
}

document.querySelector('#previous').onclick = () => step(-1);
document.querySelector('#next').onclick = () => step(1);

document.querySelector('.close').onclick = () => {
  viewer.close();
};

viewer.addEventListener('close', () => {
  content.replaceChildren();

  document.body.append(cursor);
  updateCursor();

  document.body.style.overflow = '';
  opener?.focus();
});

viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') step(-1);
  if (event.key === 'ArrowRight') step(1);
});

/* Lecture continue des vidéos */

const previews = [...document.querySelectorAll('.project video')];

function playPreviews() {
  previews.forEach(video => {
    video.play().catch(() => {});
  });
}

playPreviews();

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) playPreviews();
});

document.addEventListener('pointerdown', playPreviews, {
  once: true
});

/* Curseur noir et texte blanc à l'intérieur */

const cursor = document.querySelector('#cursor');

let pointerX = 0;
let pointerY = 0;
let pointerPresent = false;

const textSelector = [
  '.secret-message',
  '.footer-credit',
  'a',
  '.menu-toggle',
  '.focus-name',
  '.hero p',
  '.location',
  'figcaption',
  'h2',
  'footer',
  '#viewerCaption',
  '.close',
  '.viewer-nav button'
].join(',');

const textProperties = [
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'line-height',
  'letter-spacing',
  'text-transform',
  'text-align',
  'white-space',
  'display',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-width',
  'border-style',
  'box-sizing',
  'filter',
  'vertical-align',
  'word-spacing'
];

function copyTextStyle(original, copy) {
  const style = getComputedStyle(original);

  for (const property of textProperties) {
    copy.style.setProperty(
      property,
      style.getPropertyValue(property)
    );
  }

  copy.removeAttribute('id');
  copy.removeAttribute('tabindex');

  for (let i = 0; i < original.children.length; i++) {
    copyTextStyle(original.children[i], copy.children[i]);
  }
}

function updateCursor() {
  const target = document.elementFromPoint(pointerX, pointerY);

  const overPhoto = target?.matches(
    '.photo img, #viewerContent img'
  );

  cursor.classList.toggle(
    'is-secret',
    pointerPresent && Boolean(target?.closest('.secret-message'))
  );

  cursor.style.opacity = pointerPresent && !overPhoto ? '1' : '0';
  cursor.replaceChildren();

  if (!pointerPresent || overPhoto) return;

  const text = target?.closest(textSelector);
  if (!text) return;

  const rect = text.getBoundingClientRect();
  const copy = text.cloneNode(true);

  copyTextStyle(text, copy);

  copy.classList.add('cursor-text');
  copy.setAttribute('aria-hidden', 'true');
  copy.inert = true;

  Object.assign(copy.style, {
    position: 'absolute',
    left: `calc(50% + ${rect.left - pointerX}px)`,
    top: `calc(50% + ${rect.top - pointerY}px)`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: '0',
    transform: 'none'
  });

  cursor.append(copy);
}

/* Légère inertie du curseur */

if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
  let targetX = 0;
  let targetY = 0;
  let velocityX = 0;
  let velocityY = 0;
  let cursorFrame = 0;
  let cursorTime = 0;

  function paintCursor() {
    cursor.style.left = `${pointerX}px`;
    cursor.style.top = `${pointerY}px`;

    updateCursor();
  }

  function followCursor(now) {
    cursorFrame = 0;

    if (!pointerPresent) return;

    const dt = Math.min((now - cursorTime) / 1000, 0.05);
    cursorTime = now;

    const spring = 30;
    const decay = Math.exp(-spring * dt);

    const dx = pointerX - targetX;
    const dy = pointerY - targetY;

    const forceX = (velocityX + spring * dx) * dt;
    const forceY = (velocityY + spring * dy) * dt;

    pointerX = targetX + (dx + forceX) * decay;
    pointerY = targetY + (dy + forceY) * decay;

    velocityX = (velocityX - spring * forceX) * decay;
    velocityY = (velocityY - spring * forceY) * decay;

    const settled =
      Math.hypot(pointerX - targetX, pointerY - targetY) < 0.05 &&
      Math.hypot(velocityX, velocityY) < 0.5;

    if (settled) {
      pointerX = targetX;
      pointerY = targetY;
      velocityX = 0;
      velocityY = 0;
    }

    paintCursor();

    if (!settled) {
      cursorFrame = requestAnimationFrame(followCursor);
    }
  }

  function hideCursor() {
    pointerPresent = false;

    cancelAnimationFrame(cursorFrame);
    cursorFrame = 0;

    velocityX = 0;
    velocityY = 0;

    updateCursor();
    document.body.classList.remove('has-cursor');
  }

  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;

    targetX = event.clientX;
    targetY = event.clientY;

    if (!pointerPresent || reduced) {
      pointerX = targetX;
      pointerY = targetY;
      velocityX = 0;
      velocityY = 0;
    }

    pointerPresent = true;
    document.body.classList.add('has-cursor');

    if (reduced) {
      paintCursor();
      return;
    }

    if (!cursorFrame) {
      cursorTime = performance.now();
      cursorFrame = requestAnimationFrame(followCursor);
    }
  }, { passive: true });

  document.documentElement.addEventListener(
    'pointerleave',
    hideCursor
  );

  window.addEventListener('blur', hideCursor);

  document.addEventListener('scroll', updateCursor, {
    passive: true,
    capture: true
  });
}

document.querySelector('#year').textContent =
  new Date().getFullYear();

/* Bulles derrière les photos */

const bubbleScene = document.querySelector('.underwater-scene');
const bubbleCanvas = document.querySelector('#bubbles');
const bubbleContext = bubbleCanvas.getContext('2d');

if (bubbleContext && !reduced) {
  let sceneWidth = 0;
  let sceneHeight = 0;
  let burstTop = 0;
  let burstBottom = 0;

  let bubbles = [];
  let bursts = [];

  let frame = 0;
  let lastTime = 0;
  let inView = false;

  const random = (min, max) => {
    return min + Math.random() * (max - min);
  };

  function makeBubble(initial = false) {
    const radius = 3 + 15 * Math.pow(Math.random(), 2.2);
    const burstY = random(burstTop, burstBottom);

    return {
      burstY,
      x: random(
        radius + 6,
        Math.max(radius + 6, sceneWidth - radius - 6)
      ),
      y: initial
        ? random(burstY + radius + 20, sceneHeight + radius)
        : sceneHeight + radius + random(0, 180),
      radius,
      speed: random(28, 46),
      phase: random(0, Math.PI * 2),
      age: 0,
      sway: random(12, 34),
      frequency: random(0.7, 1.6),
      solid: true
    };
  }

  function resizeBubbles() {
    const bounds = bubbleScene.getBoundingClientRect();

    const heading = document
      .querySelector('#photoTitle')
      .getBoundingClientRect();

    const photos = document
      .querySelector('#photos')
      .getBoundingClientRect();

    sceneWidth = bounds.width;
    sceneHeight = bounds.height;

    burstTop = heading.top - bounds.top + 3;
    burstBottom = photos.top - bounds.top - 4;

    const dpr = Math.min(devicePixelRatio || 1, 2);

    bubbleCanvas.width = Math.round(sceneWidth * dpr);
    bubbleCanvas.height = Math.round(sceneHeight * dpr);

    bubbleContext.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(
      16,
      Math.min(40, Math.round(sceneWidth / random(32, 44)))
    );

    bubbles = Array.from(
      { length: count },
      () => makeBubble(true)
    );

    bursts = [];
  }

  function bubbleX(bubble) {
    const horizontal =
      bubble.x +
      Math.sin(
        bubble.age * bubble.frequency + bubble.phase
      ) * bubble.sway +
      Math.sin(
        bubble.age * bubble.frequency * 1.9 + bubble.phase
      ) * bubble.sway * 0.25;

    return Math.max(
      bubble.radius,
      Math.min(sceneWidth - bubble.radius, horizontal)
    );
  }

  function burst(bubble, x, y = bubble.burstY) {
    bursts.push({
      x,
      y,
      radius: bubble.radius,
      age: 0,
      phase: bubble.phase
    });
  }

  function drawBubbles(now) {
    frame = 0;

    if (!inView || document.hidden) return;

    const dt = Math.min(
      (now - lastTime) / 1000 || 0,
      0.05
    );

    lastTime = now;

    bubbleContext.clearRect(
      0,
      0,
      sceneWidth,
      sceneHeight
    );

    bubbleContext.save();
    bubbleContext.beginPath();
    bubbleContext.rect(0, 0, sceneWidth, sceneHeight);
    bubbleContext.clip();

    bubbles.forEach((bubble, i) => {
      bubble.age += dt;
      bubble.y -= bubble.speed * dt;

      const x = bubbleX(bubble);

      if (bubble.y <= bubble.burstY) {
        burst(bubble, x);
        bubbles[i] = makeBubble();
        return;
      }

      const alpha = Math.min(
        1,
        Math.max(
          0,
          (sceneHeight - bubble.y + bubble.radius) / 35
        )
      );

      bubbleContext.globalAlpha = alpha;
      bubbleContext.lineWidth = 0.9;
      bubbleContext.strokeStyle = '#000';
      bubbleContext.fillStyle = '#000';

      bubbleContext.beginPath();
      bubbleContext.arc(
        x,
        bubble.y,
        bubble.radius,
        0,
        Math.PI * 2
      );

      if (bubble.solid) {
        bubbleContext.fill();
      } else {
        bubbleContext.stroke();
      }
    });

    bursts = bursts.filter(item => item.age < 0.55);

    bursts.forEach(item => {
      item.age += dt;

      const progress = Math.min(1, item.age / 0.55);

      bubbleContext.globalAlpha = 1 - progress;

      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3 + item.phase;
        const distance = item.radius + progress * 11;

        const x = item.x + Math.cos(angle) * distance;
        const y = item.y + Math.sin(angle) * distance * 0.4;

        bubbleContext.beginPath();
        bubbleContext.arc(
          x,
          y,
          (1 - progress) * 1.3,
          0,
          Math.PI * 2
        );
        bubbleContext.fill();
      }
    });

    bubbleContext.restore();
    bubbleContext.globalAlpha = 1;

    frame = requestAnimationFrame(drawBubbles);
  }

  /* Faire éclater une bulle au clic */

  bubbleScene.addEventListener('click', event => {
    if (event.target.closest('.photo')) return;

    const bounds = bubbleScene.getBoundingClientRect();

    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    for (let i = bubbles.length - 1; i >= 0; i--) {
      const bubble = bubbles[i];
      const bx = bubbleX(bubble);

      if (
        bubble.y - bubble.radius > sceneHeight ||
        bubble.y + bubble.radius < 0
      ) {
        continue;
      }

      if (
        Math.hypot(x - bx, y - bubble.y) <=
        bubble.radius + 3
      ) {
        burst(bubble, bx, bubble.y);
        bubbles[i] = makeBubble();

        event.preventDefault();
        event.stopImmediatePropagation();

        startBubbles();
        break;
      }
    }
  }, true);

  function startBubbles() {
    if (inView && !document.hidden && !frame) {
      lastTime = performance.now();
      frame = requestAnimationFrame(drawBubbles);
    }
  }

  new ResizeObserver(resizeBubbles).observe(bubbleScene);

  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;

    if (inView) {
      startBubbles();
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }, {
    rootMargin: '150px'
  }).observe(bubbleScene);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else {
      startBubbles();
    }
  });

  resizeBubbles();
  document.fonts.ready.then(resizeBubbles);
}
