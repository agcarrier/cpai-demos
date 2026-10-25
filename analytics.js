// GA4 for the demo gallery, same property as carrierpigeonai.dev.
// Every AI demo posts to /api/chat, so wrapping fetch here logs `demo_used`
// with the same { mode, turn } shape the main site's callDemoAPI sends, and
// no demo page needs its own tracking code. Fired before the request so a
// failed call still counts as a try.
(function () {
  const ID = 'G-C7TSQF0ECD';
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', ID);

  const realFetch = window.fetch;
  window.fetch = function (url, opts) {
    if (String(url).endsWith('/api/chat') && opts && typeof opts.body === 'string') {
      try {
        const b = JSON.parse(opts.body);
        gtag('event', 'demo_used', {
          mode: b.mode,
          turn: Array.isArray(b.messages) ? b.messages.length : 1,
        });
      } catch (e) {}
    }
    return realFetch.apply(this, arguments);
  };
})();
