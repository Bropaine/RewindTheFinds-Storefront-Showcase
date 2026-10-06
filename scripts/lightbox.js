document.addEventListener('DOMContentLoaded', function () {
  // Select all images you want to be clickable
  const carouselImages = document.querySelectorAll('.carousel-img');
  const thumbImages = document.querySelectorAll('.carousel-thumbs .thumb');
  const lightbox = document.getElementById('img-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');

  let lastFocusedElement = null; // To restore focus

  // Trap focus within the modal
  function trapFocus(e) {
    if (lightbox.style.display !== 'flex') return;
    const focusable = [closeBtn, lightboxImg];
    const idx = focusable.indexOf(document.activeElement);
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        // Shift+Tab
        focusable[(idx - 1 + focusable.length) % focusable.length].focus();
      } else {
        // Tab
        focusable[(idx + 1) % focusable.length].focus();
      }
    }
  }

  // Helper: Open lightbox with given src/alt, save opener
  function openLightbox(src, alt, opener) {
    lastFocusedElement = opener;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Product Image";
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('role', 'dialog');
    setTimeout(() => {
      lightbox.style.opacity = '1';
      closeBtn.focus();
    }, 0);
    document.body.style.overflow = 'hidden'; // Prevent scroll
    document.addEventListener('keydown', trapFocus);
  }

  // Helper: Close lightbox
  function closeLightbox() {
    lightbox.style.opacity = '0';
    setTimeout(() => {
      lightbox.style.display = 'none';
      lightbox.removeAttribute('aria-modal');
      lightbox.removeAttribute('role');
      if (lastFocusedElement) lastFocusedElement.focus();
    }, 220);
    document.body.style.overflow = '';
    document.removeEventListener('keydown', trapFocus);
  }

  // Open lightbox when carousel image is clicked
  carouselImages.forEach(img => {
    img.style.cursor = "zoom-in";
    img.onclick = () => openLightbox(img.src, img.alt, img);
    img.tabIndex = 0; // Make focusable
    img.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); openLightbox(img.src, img.alt, img);
      }
    });
  });
  // Also open from thumbnails
  thumbImages.forEach(img => {
    img.style.cursor = "zoom-in";
    img.onclick = () => openLightbox(img.src, img.alt, img);
    img.tabIndex = 0; // Make focusable
    img.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); openLightbox(img.src, img.alt, img);
      }
    });
  });

  // Close on X button
  closeBtn.onclick = closeLightbox;

  // Close on click outside image
  lightbox.onclick = function(e) {
    if (e.target === lightbox) closeLightbox();
  };

  // Close on ESC key
  window.addEventListener('keydown', function(e){
    if (e.key === "Escape" && lightbox.style.display === 'flex') closeLightbox();
  });
});
