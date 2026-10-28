// "Get this for my business" form at the foot of every demo page. It files a
// lead in the main site's CRM through /api/leads, tagged with the demo it came
// from, so a lead says which demo sold it. The demo bar's "Get in touch" link
// scrolls here instead of leaving the page.
(function () {
  const LEADS = 'https://carrierpigeonai.dev/api/leads';
  const slug = location.pathname.replace(/^\/demos\//, '').replace(/\.html$/, '') || 'gallery';
  const title = (document.querySelector('.eyebrow')?.textContent.split('/').pop() || document.title.split('—')[0]).trim();

  const css = document.createElement('style');
  css.textContent = `
  .lead-cta { max-width: 1240px; margin: 0 auto; padding: 0 48px 96px; }
  .lead-cta-in { border: 1px solid var(--paper); background: var(--card, #fbfaf7); box-shadow: 5px 5px 0 var(--paper); display: grid; grid-template-columns: 1fr 1.2fr; }
  .lead-cta-copy { padding: 32px; background: var(--paper); color: var(--ink); }
  .lead-cta-copy .k { font: 500 11px var(--font-mono); letter-spacing: .16em; text-transform: uppercase; color: var(--hl); margin-bottom: 14px; }
  .lead-cta-copy h2 { font-family: var(--font-display); font-weight: 600; font-size: clamp(26px, 3vw, 34px); line-height: 1.08; letter-spacing: -0.02em; }
  .lead-cta-copy p { color: #c9c7bf; margin-top: 12px; font-size: 14px; max-width: 40ch; }
  .lead-cta form { padding: 28px 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px 14px; }
  .lead-cta label { display: block; font: 10px var(--font-mono); letter-spacing: .14em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
  .lead-cta input, .lead-cta textarea { width: 100%; font: 14px var(--font-sans); color: var(--paper); background: var(--ink); border: 1px solid var(--ink-3); padding: 10px 12px; border-radius: 0; resize: none; }
  .lead-cta input:focus, .lead-cta textarea:focus { outline: none; border-color: var(--paper); background: #fff; }
  .lead-cta .full { grid-column: 1 / -1; }
  .lead-cta button { grid-column: 1 / -1; font: 12px var(--font-mono); letter-spacing: .12em; text-transform: uppercase; color: var(--on-hl); background: var(--hl); border: 1px solid var(--paper); padding: 14px; cursor: pointer; box-shadow: 3px 3px 0 var(--paper); }
  .lead-cta button:disabled { opacity: .5; cursor: default; }
  .lead-cta .msg { grid-column: 1 / -1; font-size: 13px; min-height: 18px; color: var(--muted); }
  .lead-cta .msg.bad { color: #a33a1c; }
  .lead-cta .done { padding: 40px 32px; display: flex; flex-direction: column; justify-content: center; gap: 8px; }
  .lead-cta .done strong { font-family: var(--font-display); font-size: 24px; letter-spacing: -0.01em; }
  @media (max-width: 960px) { .lead-cta { padding: 0 16px 64px; } .lead-cta-in { grid-template-columns: 1fr; } .lead-cta form { grid-template-columns: 1fr; padding: 22px; } .lead-cta-copy { padding: 24px 22px; } }
  @media print { .lead-cta { display: none; } }`;
  document.head.appendChild(css);

  const sec = document.createElement('section');
  sec.className = 'lead-cta no-print';
  sec.id = 'get-this';
  sec.innerHTML = `
    <div class="lead-cta-in">
      <div class="lead-cta-copy">
        <div class="k"></div>
        <h2></h2>
        <p>Tell Andrew a little about your shop. He builds it on your accounts, with your name, hours and prices, and usually replies the same day.</p>
      </div>
      <form novalidate>
        <div><label for="lc-name">Your name</label><input id="lc-name" autocomplete="given-name" maxlength="60"></div>
        <div><label for="lc-email">Email</label><input id="lc-email" type="email" autocomplete="email" maxlength="120" required></div>
        <div class="full"><label for="lc-biz">Business and what you do</label><input id="lc-biz" maxlength="120" placeholder="Teche Ridge Plumbing, residential plumbing in Lafayette"></div>
        <div class="full"><label for="lc-note">Anything else? (optional)</label><textarea id="lc-note" rows="2" maxlength="600"></textarea></div>
        <button type="submit">Send it to Andrew →</button>
        <div class="msg" aria-live="polite"></div>
      </form>
    </div>`;
  sec.querySelector('.k').textContent = title;
  sec.querySelector('h2').textContent = 'Want this one for your business?';
  const anchor = document.querySelector('.wrap');
  anchor ? anchor.after(sec) : document.body.appendChild(sec);

  document.querySelectorAll('.demo-bar a[href*="/contact"]').forEach(a => {
    a.href = '#get-this';
    a.textContent = 'Get this for my business →';
  });

  const form = sec.querySelector('form');
  const msg = sec.querySelector('.msg');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const v = id => sec.querySelector('#' + id).value.trim();
    const email = v('lc-email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.className = 'msg bad'; msg.textContent = 'Add an email so Andrew can reply.'; return; }
    const btn = form.querySelector('button');
    btn.disabled = true; msg.className = 'msg'; msg.textContent = 'Sending…';
    try {
      const r = await fetch(LEADS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          first_name: v('lc-name') || null,
          source: 'demo_gallery',
          capture_page: 'demos.carrierpigeonai.dev' + location.pathname,
          tags: ['Demo Gallery', 'Demo: ' + slug],
          message: `Wants: ${title} (demo: ${slug})\nBusiness: ${v('lc-biz') || 'not given'}${v('lc-note') ? '\n\n' + v('lc-note') : ''}`,
        }),
      });
      if (!r.ok) throw new Error();
      window.gtag?.('event', 'demo_lead', { demo: slug });
      const done = document.createElement('div');
      done.className = 'done';
      done.innerHTML = '<strong>Got it. Andrew has your note.</strong><span></span>';
      done.querySelector('span').textContent = `He'll reply to ${email}, usually the same day.`;
      form.replaceWith(done);
    } catch {
      btn.disabled = false; msg.className = 'msg bad';
      msg.innerHTML = 'That didn’t go through. Email <a href="mailto:andrew@carrierpigeonai.dev">andrew@carrierpigeonai.dev</a> instead.';
    }
  });
})();
