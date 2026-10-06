// ===== Responsive Carousel/Slider with Snap, Drag, Arrow/Autoplay, and Card Highlight =====
window.initCarousel = function() {
  const carouselTrack = document.querySelector('.carousel-track');
  if (!carouselTrack) return;
  const leftArrow = document.querySelector('.carousel-arrow.left');
  const rightArrow = document.querySelector('.carousel-arrow.right');
  const dragThreshold = 8; // px

  // --- Drag/Touch state ---
  let isDown = false, startX, startY, scrollLeft;
  let wasDragged = false;

  // Mouse Drag (desktop)
  carouselTrack.addEventListener('mousedown', (e) => {
    isDown = true;
    wasDragged = false;
    carouselTrack.classList.add('dragging');
    startX = e.pageX - carouselTrack.offsetLeft;
    scrollLeft = carouselTrack.scrollLeft;
  });
  carouselTrack.addEventListener('mouseleave', () => {
    isDown = false;
    wasDragged = false;
    carouselTrack.classList.remove('dragging');
  });
  carouselTrack.addEventListener('mouseup', () => {
    isDown = false;
    setTimeout(() => { wasDragged = false; }, 100);
    carouselTrack.classList.remove('dragging');
  });
  carouselTrack.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carouselTrack.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > dragThreshold) wasDragged = true;
    carouselTrack.scrollLeft = scrollLeft - walk;
  });

  // Touch Drag (mobile)
  carouselTrack.addEventListener('touchstart', (e) => {
    isDown = true;
    wasDragged = false;
    startX = e.touches[0].pageX - carouselTrack.offsetLeft;
    startY = e.touches[0].pageY;
    scrollLeft = carouselTrack.scrollLeft;
  }, { passive: true });

  carouselTrack.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - carouselTrack.offsetLeft;
    const y = e.touches[0].pageY;
    const dx = Math.abs(x - startX);
    const dy = Math.abs(y - startY);
    if (dx > dy && dx > dragThreshold) {
      e.preventDefault();
      const walk = (x - startX) * 1.4;
      wasDragged = true;
      carouselTrack.scrollLeft = scrollLeft - walk;
    }
  }, { passive: false });

  carouselTrack.addEventListener('touchend', () => {
    isDown = false;
    setTimeout(() => { wasDragged = false; }, 100);
  });

  // --- Card click: highlight selected, block after drag (only on direct card, not children) ---
  document.querySelectorAll('.carousel-card').forEach(card => {
    card.addEventListener('click', e => {
      // Only block if dragged AND the click was directly on the card, not its children
      if (wasDragged && e.target === card) {
        e.preventDefault();
        e.stopImmediatePropagation();
        wasDragged = false;
        return false;
      }
      // Only highlight on true tap/click
      document.querySelectorAll('.carousel-card.selected').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // --- Snap-to-card for arrows and autoplay ---
  function getCards() {
    return Array.from(carouselTrack.querySelectorAll('.carousel-card'));
  }

  function scrollToCard(direction = 1) {
    const cards = getCards();
    if (!cards.length) return;

    // Find the card closest to the left edge of the carousel
    const trackRect = carouselTrack.getBoundingClientRect();
    let targetIndex = 0;
    let minDiff = Infinity;
    cards.forEach((card, i) => {
      const cardRect = card.getBoundingClientRect();
      const diff = Math.abs(cardRect.left - trackRect.left);
      if (diff < minDiff) {
        minDiff = diff;
        targetIndex = i;
      }
    });

    // Next or previous card index (wraps to start)
    let nextIndex = targetIndex + direction;
    if (nextIndex < 0) nextIndex = 0;
    if (nextIndex >= cards.length) nextIndex = 0;

    // Scroll to the next/prev card's left offset
    const nextCard = cards[nextIndex];
    if (nextCard) {
      carouselTrack.scrollTo({ left: nextCard.offsetLeft, behavior: 'smooth' });
    }
  }

  // Arrow click events
  leftArrow.onclick = () => {
    scrollToCard(-1);
    stopAutoPlay();
    setTimeout(startAutoPlay, 3000);
  };
  rightArrow.onclick = () => {
    scrollToCard(1);
    stopAutoPlay();
    setTimeout(startAutoPlay, 3000);
  };

  // --- Carousel Autoplay (snaps to next card) ---
  let autoPlayInterval = null;
  const autoPlayDelay = 3500; // ms

  function scrollNext() { scrollToCard(1); }
  function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(scrollNext, autoPlayDelay);
  }
  function stopAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
  }
  startAutoPlay();

  // Pause autoplay while dragging or hovering
  carouselTrack.addEventListener('mousedown', stopAutoPlay);
  carouselTrack.addEventListener('touchstart', stopAutoPlay);
  carouselTrack.addEventListener('mouseenter', stopAutoPlay);
  carouselTrack.addEventListener('mouseup', startAutoPlay);
  carouselTrack.addEventListener('touchend', startAutoPlay);
  carouselTrack.addEventListener('mouseleave', startAutoPlay);
};
