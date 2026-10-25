// Site nav dropdowns for the demo gallery, mirroring the main site's Nav in
// digital-home-frontend-starter/src/components/legacy/site.jsx. Keep the two
// menus below in sync with NAV_SERVICES and NAV_LAB there.
// Pages ship plain fallback links; this swaps in the dropdowns and the mobile menu.
(function () {
  const HOME = 'https://carrierpigeonai.dev';
  const SOLUTIONS = [
    { name: 'The Loft', sub: 'Your whole lead operation, run for you', href: HOME + '/services/the-loft', flagship: true, img: '/nav/the-loft.jpg' },
    { name: 'Web Design', sub: 'Fast, modern sites built to convert', href: HOME + '/services/web-design', img: '/nav/web-design.jpg' },
    { name: 'AI Agents', sub: '24/7 voice & chat — trained on your content', href: HOME + '/services/ai-agents', img: '/nav/ai-agents.jpg' },
    { name: 'Business Automation', sub: 'Cut busywork, free your team', href: HOME + '/services/business-automation', img: '/nav/business-automation.jpg' },
    { name: 'Knowledge Base', sub: 'Private AI trained on your own documents', href: HOME + '/services/knowledge-base', img: '/nav/knowledge-base.jpg' },
  ];
  const LAB = [
    { name: 'AI Automations', sub: 'Live demos of small-business tools', href: '/', here: true, img: '/nav/ai-automations.jpg' },
    { name: 'Web Design Gallery', sub: 'Client sites and concept builds', href: HOME + '/services/web-design#gallery', img: '/nav/gallery.jpg' },
    { name: 'Free SEO Check', sub: 'See what Google sees — no signup', href: HOME + '/tools/seo-check', img: '/nav/seo-check.jpg' },
    { name: 'What Would AI Do?', sub: 'Ideas for your business — no signup', href: HOME + '/tools/ai-ideas', img: '/nav/ai-ideas.jpg' },
  ];
  const MENUS = [['Solutions', SOLUTIONS], ['The Lab', LAB]];
  const CHEVRON = '<svg class="sn-chev" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="square"/></svg>';

  const nav = document.querySelector('nav');
  const links = nav && nav.querySelector('.nav-links');
  if (!links) return;
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };

  function item(s, mobile) {
    const a = el('a', mobile ? 'sn-mitem' : 'sn-item');
    a.href = s.href;
    if (s.flagship) a.classList.add('flagship');
    if (s.here) a.setAttribute('aria-current', 'page');
    const text = el('span', 'sn-text');
    const name = el('span', 'sn-name'); name.textContent = s.name;
    text.appendChild(name);
    if (s.flagship && !mobile) text.appendChild(el('span', 'sn-flag', 'Flagship'));
    if (!mobile) { const sub = el('span', 'sn-sub'); sub.textContent = s.sub; text.appendChild(sub); }
    a.appendChild(text);
    const thumb = el('span', 'sn-thumb');
    const img = el('img'); img.src = HOME + s.img; img.alt = ''; img.width = 324; img.height = 216; img.decoding = 'async'; img.loading = 'lazy';
    thumb.appendChild(img); a.appendChild(thumb);
    return a;
  }

  // ── Desktop dropdowns ──
  // The close delay keeps a menu from flickering while the pointer crosses the gap.
  const closers = [];
  function dropdown(label, items, id) {
    const wrap = el('div', 'sn-drop');
    const btn = el('button', 'sn-trigger', label + CHEVRON);
    btn.type = 'button'; btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', id);
    const panel = el('div', 'sn-panel'); panel.id = id; panel.hidden = true;
    panel.appendChild(el('span', 'sn-caret'));
    items.forEach(s => panel.appendChild(item(s, false)));
    let timer;
    const set = open => { clearTimeout(timer); panel.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
    const show = () => { closers.forEach(c => c !== close && c()); set(true); };
    const close = () => set(false);
    const hide = () => { clearTimeout(timer); timer = setTimeout(close, 120); };
    closers.push(close);
    wrap.addEventListener('mouseenter', show);
    wrap.addEventListener('mouseleave', hide);
    btn.addEventListener('click', () => (panel.hidden ? show() : close()));
    wrap.addEventListener('focusout', e => { if (!wrap.contains(e.relatedTarget)) hide(); });
    wrap.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { close(); btn.focus(); } });
    wrap.append(btn, panel);
    return wrap;
  }
  document.addEventListener('click', e => { if (!nav.contains(e.target)) closers.forEach(c => c()); });

  const fieldNotes = HOME + '/field-notes';
  links.innerHTML = '';
  MENUS.forEach(([label, items], i) => links.appendChild(dropdown(label, items, 'sn-menu-' + i)));
  const fn = el('a'); fn.href = fieldNotes; fn.textContent = 'Field Notes'; links.appendChild(fn);

  // ── Mobile menu ──
  const burger = el('button', 'sn-burger');
  burger.type = 'button'; burger.setAttribute('aria-label', 'Open menu'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-controls', 'sn-mobile');
  const ICON_OPEN = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>';
  const ICON_CLOSE = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" aria-hidden="true"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';
  burger.innerHTML = ICON_OPEN;
  nav.appendChild(burger);

  const mobile = el('div', 'sn-mobile'); mobile.id = 'sn-mobile'; mobile.hidden = true;
  MENUS.forEach(([label, items], i) => {
    const btn = el('button', 'sn-mtrigger', label + CHEVRON);
    btn.type = 'button'; btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'sn-acc-' + i);
    const list = el('div', 'sn-acc'); list.id = 'sn-acc-' + i; list.hidden = true;
    items.forEach(s => list.appendChild(item(s, true)));
    btn.addEventListener('click', () => { list.hidden = !list.hidden; btn.setAttribute('aria-expanded', String(!list.hidden)); });
    mobile.append(btn, list);
  });
  const mfn = el('a', 'sn-mlink'); mfn.href = fieldNotes; mfn.textContent = 'Field Notes'; mobile.appendChild(mfn);
  const cta = nav.querySelector('.nav-cta');
  if (cta) { const mcta = cta.cloneNode(true); mcta.classList.add('sn-mcta'); mobile.appendChild(mcta); }
  nav.after(mobile);

  function setMobile(open) {
    mobile.hidden = !open;
    burger.innerHTML = open ? ICON_CLOSE : ICON_OPEN;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobile.style.top = nav.getBoundingClientRect().bottom + 'px';
  }
  burger.addEventListener('click', () => setMobile(mobile.hidden));
  // The nav is sticky under the demo bar, so its bottom edge moves as the page scrolls.
  addEventListener('scroll', () => { if (!mobile.hidden) mobile.style.top = nav.getBoundingClientRect().bottom + 'px'; }, { passive: true });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mobile.hidden) { setMobile(false); burger.focus(); } });
  matchMedia('(min-width: 861px)').addEventListener('change', e => { if (e.matches) setMobile(false); });
})();
