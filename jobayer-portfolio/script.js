(() => {
  const menuButton = document.querySelector('.menu');
  const nav = document.querySelector('#nav');

  if (menuButton && nav) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      nav.classList.remove('open');
    };
    menuButton.addEventListener('click', () => {
      const opening = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(opening));
      menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('open', opening);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  // The subtle pointer light is desktop-only and disabled for reduced-motion preferences.
  const canFollowPointer = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches;
  const homeHero = document.querySelector('.home-hero');
  if (canFollowPointer && homeHero) {
    homeHero.addEventListener('pointermove', event => {
      const bounds = homeHero.getBoundingClientRect();
      homeHero.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
      homeHero.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    }, { passive: true });
  }

  // Short cross-page fade. Native navigation remains available to keyboard and modifier clicks.
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target) return;
        const target = new URL(link.href, location.href);
        if (target.origin !== location.origin || target.pathname === location.pathname) return;
        event.preventDefault();
        document.body.classList.add('page-leaving');
        setTimeout(() => location.assign(target.href), 130);
      });
    });
  }

  // Instagram embeds are created from this editable URL list. Each keeps a direct fallback link.
  const performanceGrid = document.querySelector('#performance-grid');
  if (performanceGrid) {
    const posts = [
      'https://www.instagram.com/reel/DJte-kwyqhK/',
      'https://www.instagram.com/reel/DIeQtaCSlET/',
      'https://www.instagram.com/reel/DFYKN4BudIn/',
      'https://www.instagram.com/reel/DNqj6ufO34C/',
      'https://www.instagram.com/reel/DPR4D1GjsUo/',
      'https://www.instagram.com/p/DXR_WWoDjQF/',
      'https://www.instagram.com/p/DbLCjIIONE2/'
    ];
    posts.forEach((url, index) => {
      const card = document.createElement('article');
      card.className = 'performance-card';
      card.dataset.entry = String(index + 1).padStart(2, '0');
      const label = document.createElement('span');
      label.className = 'performance-number';
      label.textContent = `PERFORMANCE ${String(index + 1).padStart(2, '0')}`;
      const embed = document.createElement('blockquote');
      embed.className = 'instagram-media';
      embed.dataset.instgrmPermalink = url;
      embed.dataset.instgrmVersion = '14';
      const fallback = document.createElement('a');
      fallback.className = 'embed-fallback';
      fallback.href = url;
      fallback.target = '_blank';
      fallback.rel = 'noopener noreferrer';
      fallback.textContent = 'PREVIEW UNAVAILABLE · WATCH THIS ENTRY ON INSTAGRAM ↗';
      embed.append(fallback);
      const watch = document.createElement('a');
      watch.className = 'watch-link';
      watch.href = url;
      watch.target = '_blank';
      watch.rel = 'noopener noreferrer';
      watch.textContent = 'WATCH ON INSTAGRAM ↗';
      card.append(label, embed, watch);
      performanceGrid.append(card);
    });
    const embedScript = document.createElement('script');
    embedScript.async = true;
    embedScript.src = 'https://www.instagram.com/embed.js';
    document.body.append(embedScript);
  }
})();
