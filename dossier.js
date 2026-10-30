(() => {
  const motionStyle = document.createElement('link');
  motionStyle.rel = 'stylesheet';
  motionStyle.href = 'dossier-motion.css';
  document.head.append(motionStyle);
  const sections = document.querySelectorAll('.dossier-section,.dossier-download');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    sections.forEach(section => section.classList.add('dossier-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('dossier-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.08 });
  sections.forEach(section => {
    section.classList.add('dossier-reveal');
    observer.observe(section);
  });
})();
