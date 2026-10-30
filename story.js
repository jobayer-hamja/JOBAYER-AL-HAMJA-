(() => {
  const stage = document.querySelector('#opening-stage');
  const start = document.querySelector('#opening-start');
  const skip = document.querySelector('#opening-skip');
  const progress = document.querySelector('#reading-progress-bar');
  if (!stage || !start || !skip) return;

  const scenes = [
    { element: document.querySelector('#opening-hinglish'), delay: 850 },
    { element: document.querySelector('#opening-question'), delay: 850 },
    { element: document.querySelector('#opening-reveal'), delay: 1100 }
  ];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timers = [];
  let running = false;

  function stopTimers() {
    timers.forEach(clearTimeout);
    timers = [];
    running = false;
  }

  function showScene(index) {
    stage.querySelectorAll('.opening-line,.opening-hinglish,.opening-question,.opening-reveal').forEach(item => { item.hidden = true; });
    const scene = scenes[index];
    if (!scene) {
      start.textContent = 'REPLAY OPENING SEQUENCE ↗';
      return;
    }
    scene.element.hidden = false;
    scene.element.style.animation = 'none';
    requestAnimationFrame(() => { scene.element.style.animation = ''; });
    if (index + 1 < scenes.length) timers.push(setTimeout(() => showScene(index + 1), scene.delay));
    else timers.push(setTimeout(() => {
      running = false;
      start.textContent = 'REPLAY OPENING SEQUENCE ↗';
      document.querySelector('#chapter-01')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }, scene.delay));
  }

  start.addEventListener('click', () => {
    if (running) stopTimers();
    running = true;
    start.textContent = 'OPENING SEQUENCE PLAYING…';
    if (reducedMotion) {
      stopTimers();
      stage.querySelectorAll('.opening-line,.opening-hinglish,.opening-question,.opening-reveal').forEach(item => { item.hidden = true; });
      document.querySelector('#opening-reveal').hidden = false;
      start.textContent = 'REPLAY OPENING SEQUENCE ↗';
      return;
    }
    showScene(0);
  });

  skip.addEventListener('click', () => {
    stopTimers();
    document.querySelector('#chapter-01')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  });

  if (progress) {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const amount = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;
      progress.style.width = `${amount}%`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  const chapters = document.querySelectorAll('.story-chapter,.final-scene');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    document.body.classList.add('story-motion');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    chapters.forEach(chapter => observer.observe(chapter));
  } else {
    chapters.forEach(chapter => chapter.classList.add('is-visible'));
  }

  const ambientToggle = document.querySelector('#ambient-toggle');
  if (ambientToggle) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    let audioContext;
    let oscillators = [];
    let masterGain;
    if (!AudioContextClass) {
      ambientToggle.disabled = true;
      ambientToggle.textContent = 'AMBIENCE UNAVAILABLE';
    } else {
      const stopAmbient = async () => {
        oscillators.forEach(oscillator => { try { oscillator.stop(); } catch {} });
        oscillators = [];
        if (audioContext && audioContext.state !== 'closed') await audioContext.close();
        audioContext = undefined;
        ambientToggle.setAttribute('aria-pressed', 'false');
        ambientToggle.textContent = 'AMBIENCE OFF ♪';
      };
      ambientToggle.addEventListener('click', async () => {
        if (ambientToggle.getAttribute('aria-pressed') === 'true') {
          await stopAmbient();
          return;
        }
        audioContext = new AudioContextClass();
        await audioContext.resume();
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.0001;
        masterGain.connect(audioContext.destination);
        [[55, 0.012], [82.4, 0.006]].forEach(([frequency, volume]) => {
          const oscillator = audioContext.createOscillator();
          const gain = audioContext.createGain();
          oscillator.type = 'sine';
          oscillator.frequency.value = frequency;
          gain.gain.value = volume;
          oscillator.connect(gain);
          gain.connect(masterGain);
          oscillator.start();
          oscillators.push(oscillator);
        });
        masterGain.gain.setTargetAtTime(0.42, audioContext.currentTime, 0.8);
        ambientToggle.setAttribute('aria-pressed', 'true');
        ambientToggle.textContent = 'AMBIENCE ON ♪';
      });
    }
  }
})();
