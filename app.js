(() => {
  'use strict';
  const C = window.KASOKO_CATALOG || {destinations: [], hotels: [], services: []};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const read = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const state = {lang: read('kt-lang', 'en') === 'sw' ? 'sw' : 'en', theme: read('kt-theme', 'day') === 'night' ? 'night' : 'day', safari: 'all', tour: 'all', hotel: 'all'};
  const text = key => window.KASOKO_TEXT?.[state.lang]?.[key] || window.KASOKO_TEXT?.en?.[key] || key;
  const local = value => value && typeof value === 'object' ? (value[state.lang] || value.en || '') : (value || '');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const overviewPhoto = key => C.overviewPhotos?.[key] || `assets/photos/${key}.webp`;
  const canonicalImage = src => String(src || '').replace('assets/photos/thumbs/', 'assets/photos/');
  let pageImageUsed = new Set();
  function resetPageImageUse() {
    pageImageUsed = new Set($$('img[src]').filter(img => !img.closest('#region-grid,#safari-grid,#tour-grid,#hotel-grid,.detail-photo')).map(img => canonicalImage(img.getAttribute('src'))).filter(src => src && !src.includes('logo-mark.svg')));
  }
  function pickImage(images = []) {
    const unique = [...new Set(images.filter(Boolean).map(canonicalImage))];
    const chosen = unique.find(src => !pageImageUsed.has(src)) || unique[0] || '';
    if (chosen) pageImageUsed.add(chosen);
    return chosen;
  }
  function cardImage(src) {
    if (!src) return '';
    if (src.startsWith('assets/photos/')) return src.replace('assets/photos/', 'assets/photos/thumbs/');
    if (src.includes('images.unsplash.com/')) {
      try { const u = new URL(src); u.searchParams.set('w', '800'); u.searchParams.set('q', '72'); u.searchParams.set('auto', 'format'); u.searchParams.set('fit', 'crop'); return u.toString(); } catch { return src; }
    }
    return src;
  }
  function applyTheme() {
    const root = document.documentElement;
    root.dataset.theme = state.theme;
    root.style.colorScheme = state.theme === 'night' ? 'dark' : 'only light';
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
    meta.content = state.theme === 'night' ? '#07120d' : '#fbfaf6';
  }
  function applyText() {
    document.documentElement.lang = state.lang;
    $$('[data-i18n]').forEach(el => { el.textContent = text(el.dataset.i18n); });
    $$('[data-i18n-placeholder]').forEach(el => { el.placeholder = text(el.dataset.i18nPlaceholder); });
    $$('[data-bilingual]').forEach(el => { el.textContent = el.dataset[state.lang] || el.dataset.en || ''; });
    const lang = $('[data-lang-toggle]'), theme = $('[data-theme-toggle]');
    if (lang) {
      lang.textContent = state.lang === 'en' ? 'SW' : 'EN';
      lang.setAttribute('aria-label', state.lang === 'en' ? 'Switch to Kiswahili' : 'Switch to English');
      lang.setAttribute('title', state.lang === 'en' ? 'Kiswahili' : 'English');
      lang.dataset.currentLanguage = state.lang;
    }
    if (theme) {
      theme.textContent = state.theme === 'night' ? '☀' : '☾';
      theme.setAttribute('aria-label', state.lang === 'en' ? (state.theme === 'night' ? 'Switch to light mode' : 'Switch to dark mode') : (state.theme === 'night' ? 'Badili kwenda mwonekano wa mchana' : 'Badili kwenda mwonekano wa usiku'));
      theme.setAttribute('aria-pressed', String(state.theme === 'night'));
      theme.setAttribute('title', state.theme === 'night' ? 'Light mode' : 'Dark mode');
    }
  }
  function card(item, kind) {
    const hotel = kind === 'hotel', name = local(item.name), copy = local(item.text) || local(item.description);
    const path = (hotel ? 'hotel-' : 'destination-') + item.id + '.html';
    const service = hotel ? 'hotel' : item.service;
    const image = pickImage(item.images || []);
    return `<article class="card"><a class="card-image" href="${path}" aria-label="${esc(name)}"><img loading="lazy" decoding="async" width="900" height="600" src="${esc(cardImage(image))}" alt="${esc(item.photoAlt || name)}"><span class="card-badge">${esc(hotel ? local(item.region) : local(item.badge))}</span></a><div class="card-content"><span class="card-meta">${esc(local(item.location))}</span><h3><a href="${path}">${esc(name)}</a></h3><p>${esc(copy)}</p><div class="card-foot"><strong>${esc(local(item.price))}</strong><a class="text-link" href="booking.html?service=${service}&amp;item=${item.id}">${state.lang === 'sw' ? 'Omba →' : 'Request →'}</a></div></div></article>`;
  }
  const regions = [
    ['arusha', 'Arusha', 'Arusha, Tanzania', 'Our base for city days, Mount Meru, coffee, culture and northern safaris.', 'Msingi wetu kwa ziara za jiji, Mlima Meru, kahawa, utamaduni na safari za kaskazini.'],
    ['manyara', 'Manyara', 'Lake Manyara, Tanzania', 'Lake Manyara, Tarangire, Mto wa Mbu and Rift Valley days from Arusha.', 'Lake Manyara, Tarangire, Mto wa Mbu na Bonde la Ufa kutoka Arusha.'],
    ['tanga', 'Tanga', 'Tanga, Tanzania', 'Explore Pangani, Saadani, Maziwe and Amboni, with a Mkomazi extension.', 'Tembelea Pangani, Saadani, Maziwe na Amboni, pamoja na nyongeza ya Mkomazi.']
  ];
  function renderRegions() {
    const el = $('#region-grid'); if (!el) return;
    el.innerHTML = regions.map(r => {
      const regional = [...C.destinations, ...C.hotels].filter(item => String(item.region || '').includes(r[1])).flatMap(item => item.images || []);
      const image = pickImage([overviewPhoto('region-' + r[0]), ...regional]);
      return `<a class="region-card" href="booking.html?service=custom&amp;region=${encodeURIComponent(r[2])}"><img loading="lazy" decoding="async" width="1200" height="800" src="${esc(cardImage(image))}" alt="${r[1]}"><div><span>${state.lang === 'sw' ? 'Eneo la huduma' : 'Service region'}</span><h3>${r[1]}</h3><p>${r[state.lang === 'sw' ? 4 : 3]}</p><b>${state.lang === 'sw' ? 'Panga safari →' : 'Plan this region →'}</b></div></a>`;
    }).join('');
  }
  function renderServices() {
    const el = $('#service-grid'); if (!el) return;
    el.innerHTML = C.services.map(s => `<a class="service-card" href="booking.html?service=${s.id === 'tickets' ? 'flight' : s.id}"><span aria-hidden="true">${s.icon}</span><div><h3>${esc(local(s.title))}</h3><p>${esc(local(s.text))}</p></div><b aria-hidden="true">→</b></a>`).join('');
  }
  const rank = item => ({'Arusha / Northern Tanzania': 0, Manyara: 1, Tanga: 2, 'Moshi / Kilimanjaro': 3, Zanzibar: 4, 'Dar es Salaam': 5}[item.region] ?? 6);
  function collection(kind) { return (kind === 'hotel' ? C.hotels : C.destinations.filter(item => item.service === kind)).slice().sort((a, b) => rank(a) - rank(b)); }
  function renderCollection(kind) {
    const key = kind === 'safari' ? 'destination' : kind;
    const grid = $('#' + kind + '-grid'), filters = $(`[data-${key}-filters]`); if (!grid) return;
    const items = collection(kind), options = ['all', ...new Set(items.map(item => item.region))];
    if (filters) {
      filters.innerHTML = options.map(region => `<button type="button" class="filter ${state[kind] === region ? 'active' : ''}" aria-pressed="${state[kind] === region}" data-region="${esc(region)}">${esc(region === 'all' ? (state.lang === 'sw' ? 'Zote' : 'All') : region)}</button>`).join('');
      $$('button', filters).forEach(button => button.addEventListener('click', () => { state[kind] = button.dataset.region; renderAll(); }));
    }
    const visible = items.filter(item => state[kind] === 'all' || item.region === state[kind]);
    grid.innerHTML = visible.map(item => card(item, kind === 'hotel' ? 'hotel' : 'destination')).join('');
    const count = $(`[data-${key}-count]`); if (count) count.textContent = state.lang === 'sw' ? `${visible.length} chaguo` : `${visible.length} options`;
  }
  function renderDetail() {
    const id = document.body.dataset.item, kind = document.body.dataset.kind; if (!id || !kind) return;
    const item = (kind === 'hotel' ? C.hotels : C.destinations).find(x => x.id === id); if (!item) return;
    $('[data-detail-name]')?.replaceChildren(document.createTextNode(local(item.name)));
    $('[data-detail-text]')?.replaceChildren(document.createTextNode(local(item.text) || local(item.description)));
    const location = $('.detail-location'); if (location) location.textContent = '📍 ' + local(item.location);
    const badge = $('.detail-copy .kicker'); if (badge) badge.textContent = kind === 'hotel' ? (state.lang === 'sw' ? 'Hoteli na loji' : 'Hotel & lodge') : local(item.badge);
    const facts = $('.fact-row'); if (facts) facts.innerHTML = (local(item.facts) || []).map(f => `<span>✓ ${esc(f)}</span>`).join('');
    const sourceLink = $('.detail-actions a[data-i18n="detail.official"]'); if (sourceLink && kind === 'destination') sourceLink.textContent = state.lang === 'sw' ? 'Fungua chanzo cha eneo' : 'Open destination source';

    const photoBox = $('.detail-photo');
    const images = [...new Set((item.images || []).filter(Boolean))].slice(0, 5);
    if (photoBox && images.length) {
      const alt = esc(local(item.name));
      const thumbs = images.slice(1);
      photoBox.classList.toggle('has-gallery', thumbs.length > 0);
      photoBox.innerHTML = `<img class="detail-main-image" alt="${alt}" fetchpriority="high" decoding="async" src="${esc(images[0])}">${thumbs.length ? `<div class="detail-thumbs">${thumbs.map((src, i) => `<button type="button" data-gallery-src="${esc(src)}" aria-label="${state.lang === 'sw' ? 'Picha' : 'Photo'} ${i+2}"><img alt="" loading="lazy" decoding="async" src="${esc(src)}"></button>`).join('')}</div>` : ''}`;
      const main = $('.detail-main-image', photoBox);
      $$('[data-gallery-src]', photoBox).forEach(btn => btn.addEventListener('click', () => {
        if (!main) return;
        const oldMain = main.getAttribute('src');
        const next = btn.dataset.gallerySrc;
        main.setAttribute('src', next);
        btn.dataset.gallerySrc = oldMain;
        const thumb = $('img', btn); if (thumb) thumb.setAttribute('src', oldMain);
      }));
    }
  }
  function renderAll() {
    resetPageImageUse();
    renderServices(); renderRegions(); ['safari', 'tour', 'hotel'].forEach(renderCollection); renderDetail(); applyText();
    const ticketGrid = $('#ticket-grid');
    if (ticketGrid) ticketGrid.innerHTML = [['flight','✈️','Flights','Ndege'],['bus','🚌','Buses','Mabasi'],['ferry','⛴️','Ferries','Feri'],['train','🚆','Trains','Treni']].map(x => `<a class="ticket-card" href="booking.html?service=${x[0]}"><span aria-hidden="true">${x[1]}</span><b>${x[state.lang === 'sw' ? 3 : 2]}</b><small>${state.lang === 'sw' ? 'Omba njia na tarehe →' : 'Request route and date →'}</small></a>`).join('');
    requestAnimationFrame(() => { protectImages(); });
  }
  function protectImages() {
    $$('img').forEach(img => {
      if (img.dataset.fallbackBound) return;
      img.dataset.fallbackBound = '1';
      img.addEventListener('error', () => {
        img.dataset.fallbackUsed = '1';
        img.style.visibility = 'hidden';
        img.closest('.card-image,.region-card,.detail-photo,.hero-main-photo,.hero-side-photos figure')?.classList.add('image-missing');
      });
    });
  }
  protectImages();
  document.addEventListener('kasoko:rerender', protectImages);

  const menu = $('[data-menu]'), menuToggle = $('[data-menu-toggle]'), header = $('[data-header]');
  const closeMenu = (returnFocus = false) => {
    menu?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (returnFocus) menuToggle?.focus();
  };
  menuToggle?.addEventListener('click', () => {
    const isOpen = !menu?.classList.contains('open');
    menu?.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });
  menu?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.classList.contains('open')) closeMenu(true); });
  document.addEventListener('click', event => { if (!event.target.closest('.nav-wrap') && menu?.classList.contains('open')) closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); }, {passive: true});

  const updateHeader = () => {
    if (!header) return;
    const y = window.scrollY || 0;
    header.classList.toggle('scrolled', y > 10);
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    header.style.setProperty('--scroll-progress', `${Math.min(100, Math.max(0, y / max * 100))}%`);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, {passive: true});

  // Keep the homepage navigation in sync with the section currently on screen.
  if (location.pathname.endsWith('/') || location.pathname.endsWith('/index.html') || !location.pathname.split('/').pop().includes('.')) {
    const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="index.html#"]')];
    const sections = sectionLinks.map(link => document.querySelector(`#${link.getAttribute('href').split('#')[1]}`)).filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
      const observer = new IntersectionObserver(entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        sectionLinks.forEach(link => {
          const active = link.getAttribute('href').endsWith(`#${visible.target.id}`);
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
        });
        $('.nav-links a[href="index.html"]')?.classList.remove('active');
      }, {rootMargin:'-25% 0px -60% 0px', threshold:[0,.15,.4,.7]});
      sections.forEach(section => observer.observe(section));
    }
  }
  $('[data-theme-toggle]')?.addEventListener('click', () => { state.theme = state.theme === 'night' ? 'day' : 'night'; save('kt-theme', state.theme); applyTheme(); applyText(); });
  $('[data-lang-toggle]')?.addEventListener('click', () => { state.lang = state.lang === 'en' ? 'sw' : 'en'; save('kt-lang', state.lang); renderAll(); document.dispatchEvent(new CustomEvent('kasoko:language', {detail: state.lang})); });
  applyTheme();
  renderAll();
})();
