window.initNavScripts = function() {
  // Track last input method to avoid mouse interfering with keyboard nav
  let lastInputWasMouse = false;
  let touchStartInsideNav = false;

  document.addEventListener('keydown', function() { lastInputWasMouse = false; });
  document.addEventListener('mousedown', function() { lastInputWasMouse = true; });

  const hamburger = document.querySelector('.hamburger');
  const nav = document.getElementById('mobile-nav');
  if (!hamburger || !nav) return;

  // Hamburger toggle (mobile)
  hamburger.addEventListener('click', function () {
    nav.classList.toggle('show');
    hamburger.setAttribute('aria-expanded', nav.classList.contains('show') ? 'true' : 'false');
    document.body.classList.toggle('nav-open', nav.classList.contains('show'));
    if (nav.classList.contains('show')) {
      addNavAutoCloseListeners();
    } else if (window.removeNavAutoCloseListeners) {
      window.removeNavAutoCloseListeners();
    }
  });

  // Expose closeMobileNav globally so other scripts can call it
  window.closeMobileNav = function() {
    if (!nav || !hamburger) return;
    nav.classList.remove('show');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    nav.querySelectorAll('li.open').forEach(function (li) { li.classList.remove('open'); });
    if (window.removeNavAutoCloseListeners) window.removeNavAutoCloseListeners();
  };

  // Helper: close all sibling menus at current depth, except optional "exceptLi"
  function closeSiblingMenus(li) {
    Array.from(li.parentNode.children).forEach(function (sibling) {
      if (sibling !== li) {
        sibling.classList.remove('open');
        const btn = sibling.querySelector('.submenu-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        sibling.querySelectorAll('li.open').forEach(function (child) {
          child.classList.remove('open');
          const childBtn = child.querySelector('.submenu-toggle');
          if (childBtn) childBtn.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // Handle all .submenu-toggle (any depth!)
  document.querySelectorAll('.submenu-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
    const parentLi = btn.closest('li');
    if (window.innerWidth < 900) {
      // Mobile: toggle open on click
      closeSiblingMenus(parentLi);
      parentLi.classList.toggle('open');
      btn.setAttribute('aria-expanded', parentLi.classList.contains('open') ? 'true' : 'false');
    } else {
      // Desktop: allow click to open/close
      e.preventDefault();
      const isOpen = parentLi.classList.contains('open');
      closeSiblingMenus(parentLi);
      parentLi.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    }
  });


    // Focus/blur to open/close submenu on desktop
    btn.addEventListener('focus', function(e) {
      if (window.innerWidth >= 900) {
        const parentLi = btn.closest('li');
        closeSiblingMenus(parentLi);
        parentLi.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
    btn.addEventListener('blur', function(e) {
      if (window.innerWidth >= 900) {
        const parentLi = btn.closest('li');
        setTimeout(() => {
          if (!parentLi.contains(document.activeElement)) {
            parentLi.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
          }
        }, 10);
      }
    });

    // Keyboard nav for toggles
    btn.addEventListener('keydown', function(e) {
      const parentLi = btn.closest('li');
      if (window.innerWidth >= 900) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          closeSiblingMenus(parentLi);
          parentLi.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          const submenu = parentLi.querySelector('.submenu');
          if (submenu) {
            const firstLink = submenu.querySelector('a, button');
            if (firstLink) firstLink.focus();
          }
        } else if (e.key === 'Escape') {
          parentLi.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          const parentSubmenu = parentLi.parentElement.closest('ul.submenu');
          if (parentSubmenu) {
            const upLi = parentSubmenu.closest('li');
            if (upLi) {
              const upBtn = upLi.querySelector('.submenu-toggle');
              if (upBtn) upBtn.focus();
            }
          } else {
            btn.focus();
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const submenu = parentLi.querySelector('.submenu');
          if (submenu) {
            closeSiblingMenus(parentLi);
            parentLi.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
            const items = Array.from(submenu.querySelectorAll('a, button'));
            if (items.length > 0) items[0].focus();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const submenu = parentLi.querySelector('.submenu');
          if (submenu) {
            closeSiblingMenus(parentLi);
            parentLi.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
            const items = Array.from(submenu.querySelectorAll('a, button'));
            if (items.length > 0) items[items.length - 1].focus();
          }
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          let nextLi = parentLi.nextElementSibling;
          while (nextLi && !nextLi.querySelector('.submenu-toggle')) nextLi = nextLi.nextElementSibling;
          if (nextLi) {
            const nextBtn = nextLi.querySelector('.submenu-toggle');
            if (nextBtn) nextBtn.focus();
          }
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          let prevLi = parentLi.previousElementSibling;
          while (prevLi && !prevLi.querySelector('.submenu-toggle')) prevLi = prevLi.previousElementSibling;
          if (prevLi) {
            const prevBtn = prevLi.querySelector('.submenu-toggle');
            if (prevBtn) prevBtn.focus();
          }
        }
      }
    });
  });

  // Submenu links: arrow nav and Esc
  nav.querySelectorAll('.submenu a, .submenu button').forEach(function (link) {
    link.addEventListener('keydown', function(e) {
      if (window.innerWidth >= 900) {
        const items = Array.from(link.closest('.submenu').querySelectorAll('a, button'));
        const idx = items.indexOf(link);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (idx < items.length - 1) {
            items[idx + 1].focus();
          } else {
            items[0].focus();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (idx > 0) {
            items[idx - 1].focus();
          } else {
            items[items.length - 1].focus();
          }
        } else if (e.key === 'Escape') {
          const parentLi = link.closest('li');
          const toggleBtn = parentLi.querySelector('.submenu-toggle');
          if (toggleBtn) {
            parentLi.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.focus();
          }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          const li = link.closest('li');
          let sibling;
          if (e.key === 'ArrowRight') sibling = li.nextElementSibling;
          if (e.key === 'ArrowLeft') sibling = li.previousElementSibling;
          while (sibling && !sibling.querySelector('.submenu-toggle')) sibling = (e.key === 'ArrowRight') ? sibling.nextElementSibling : sibling.previousElementSibling;
          if (sibling) {
            const siblingBtn = sibling.querySelector('.submenu-toggle');
            if (siblingBtn) siblingBtn.focus();
          }
        }
      }
    });
  });

  // Mouse hover: open/close, at any depth (only if mouse is last used)
  document.querySelectorAll('#mobile-nav li').forEach(function (li) {
    li.addEventListener('mouseenter', function(e) {
      if (window.innerWidth >= 900 && lastInputWasMouse) {
        closeSiblingMenus(li);
        li.classList.add('open');
        const btn = li.querySelector('.submenu-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'true');
      }
    });
    li.addEventListener('mouseleave', function(e) {
      if (window.innerWidth >= 900 && lastInputWasMouse) {
        li.classList.remove('open');
        const btn = li.querySelector('.submenu-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        li.querySelectorAll('li.open').forEach(function (child) {
          child.classList.remove('open');
          const childBtn = child.querySelector('.submenu-toggle');
          if (childBtn) childBtn.setAttribute('aria-expanded', 'false');
        });
      }
    });
  });

  // Mobile: close all open menus when a link is clicked
  nav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      window.closeMobileNav();
    });
  });

  // Responsive: close all menus on resize to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 900) {
      nav.querySelectorAll('li.open').forEach(function (li) {
        li.classList.remove('open');
        const btn = li.querySelector('.submenu-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      window.closeMobileNav();
    }
  });

  // Close mobile nav if click/tap is outside nav or hamburger
  document.addEventListener('click', function (e) {
    if (
      window.innerWidth < 900 &&
      nav.classList.contains('show') &&
      !nav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      window.closeMobileNav();
    }
  });

  // NEW: Add nav auto-close listeners for any touch, drag, scroll, pointermove outside nav/hamburger
  function addNavAutoCloseListeners() {
    function handleInteraction(e) {
      if (
        window.innerWidth < 900 &&
        nav.classList.contains('show') &&
        !nav.contains(e.target) &&
        !hamburger.contains(e.target) &&
        !touchStartInsideNav // NEW: only close if touch didn't start inside menu
      ) {
        window.closeMobileNav();
      }
    }
    document.addEventListener('touchstart', function(e) {
    touchStartInsideNav = nav.contains(e.target) || hamburger.contains(e.target);
    }, { passive: true, capture: true });
    document.addEventListener('mousedown', handleInteraction, { capture: true });
    document.addEventListener('wheel', handleInteraction, { passive: true, capture: true });
    document.addEventListener('scroll', handleInteraction, true);
    document.addEventListener('pointermove', handleInteraction, { passive: true, capture: true });
    document.addEventListener('pointerdown', function(e) {
    touchStartInsideNav = nav.contains(e.target) || hamburger.contains(e.target);
    }, { passive: true, capture: true });

    window.removeNavAutoCloseListeners = function() {
      document.removeEventListener('touchstart', handleInteraction, { capture: true });
      document.removeEventListener('mousedown', handleInteraction, { capture: true });
      document.removeEventListener('wheel', handleInteraction, { capture: true });
      document.removeEventListener('scroll', handleInteraction, true);
      document.removeEventListener('pointermove', handleInteraction, { capture: true });
    };
  }

  // THEME TOGGLE
  document.getElementById('theme-toggle').addEventListener('click', function() {
    document.documentElement.classList.toggle('light');
    this.classList.toggle('active');
    if (document.documentElement.classList.contains('light')) {
      localStorage.setItem('theme', 'light');
      document.body.style.display = 'none';
      document.body.offsetHeight; // Force reflow
      document.body.style.display = '';
    } else {
      localStorage.setItem('theme', 'dark');
    }
  });

  // On page load, restore saved preference:
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.classList.toggle('light', savedTheme === 'light');
  }

  updateCartCountDisplay();

  function filterNavByProducts() {
    if (!window.products) return;

    // Map of paths => array of products in that path
    const pathProductMap = {};

    window.products.forEach(prod => {
      let cat = prod.category, sub1 = prod.subcategory1, sub2 = prod.subcategory2, sub3 = prod.subcategory3, sub4 = prod.subcategory4;
      function addPath(levels) {
        const path = levels.filter(Boolean).join('|');
        if (!path) return;
        if (!pathProductMap[path]) pathProductMap[path] = [];
        pathProductMap[path].push(prod);
      }
      addPath([cat]);
      addPath([cat, sub1]);
      addPath([cat, sub1, sub2]);
      addPath([cat, sub1, sub2, sub3]);
      addPath([cat, sub1, sub2, sub3, sub4]);
    });

    // Collect only the paths that have at least one product not sold
    const visiblePaths = new Set();
    for (const path in pathProductMap) {
      if (pathProductMap[path].some(prod => prod.status !== "sold")) {
        visiblePaths.add(path);
      }
    }

    // Show/hide nav items based on visiblePaths, with special logic for "Shop All [Subcategory]" links
    document.querySelectorAll('#mobile-nav li[data-category]').forEach(li => {
      const cat = li.getAttribute('data-category');
      const sub1 = li.getAttribute('data-subcategory1');
      const sub2 = li.getAttribute('data-subcategory2');
      const sub3 = li.getAttribute('data-subcategory3');
      const sub4 = li.getAttribute('data-subcategory4');
      let path = cat;
      if (sub1) path += '|' + sub1;
      if (sub2) path += '|' + sub2;
      if (sub3) path += '|' + sub3;
      if (sub4) path += '|' + sub4;

      // SPECIAL: "Shop All [Subcategory]" = where sub2 == sub1 and sub1 exists
      if (sub1 && sub2 && sub1 === sub2 && !sub3 && !sub4) {
        // Show if any product in this category & subcategory1 (not sold)
        const show = window.products.some(
          prod => prod.category === cat && prod.subcategory1 === sub1 && prod.status !== "sold"
        );
        li.style.display = show ? '' : 'none';
        return;
      }

      // Regular logic for other nav items
      if (!visiblePaths.has(path)) {
        li.style.display = 'none';
      } else {
        li.style.display = '';
      }
    });
  }

  filterNavByProducts();
};
