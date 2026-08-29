// ===========================
// PAGINATION DOTS FUNCTIONALITY
// ===========================

document.addEventListener('DOMContentLoaded', function() {
  const projectsContainer = document.getElementById('projectsContainer');
  const dots = document.querySelectorAll('.pagination-dots .dot');

  if (!projectsContainer || dots.length === 0) return;

  function updateActiveDot() {
    const scrollLeft = projectsContainer.scrollLeft;
    const containerWidth = projectsContainer.offsetWidth;
    const totalScrollWidth = projectsContainer.scrollWidth - containerWidth;

    // Works for any number of dots/projects
    const steps = dots.length - 1;
    const scrollPercentage = totalScrollWidth > 0 ? scrollLeft / totalScrollWidth : 0;
    const currentIndex = steps > 0 ? Math.round(scrollPercentage * steps) : 0;

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // Update active dot based on scroll position
  projectsContainer.addEventListener('scroll', updateActiveDot);

  // Click on dots to scroll to specific project
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      const containerWidth = projectsContainer.offsetWidth;
      const totalScrollWidth = projectsContainer.scrollWidth - containerWidth;
      const steps = dots.length - 1;

      const scrollPosition = steps > 0 ? (totalScrollWidth / steps) * index : 0;

      projectsContainer.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });

      dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
    });
  });

  // Initialize on page load
  updateActiveDot();

  // Let vertical mouse-wheel scroll the carousel horizontally
  projectsContainer.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const maxScrollLeft = projectsContainer.scrollWidth - projectsContainer.clientWidth;
    if (maxScrollLeft <= 0) return;
    e.preventDefault();
    projectsContainer.scrollLeft += e.deltaY;
  }, { passive: false });

  // Click-and-drag to scroll on desktop
  let isDragging = false;
  let dragMoved = false;
  let dragStartX = 0;
  let dragStartScrollLeft = 0;

  projectsContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragMoved = false;
    projectsContainer.classList.add('dragging');
    dragStartX = e.pageX;
    dragStartScrollLeft = projectsContainer.scrollLeft;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const delta = e.pageX - dragStartX;
    if (Math.abs(delta) > 5) dragMoved = true;
    projectsContainer.scrollLeft = dragStartScrollLeft - delta;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    projectsContainer.classList.remove('dragging');
  });

  // Suppress the click-through navigation that would otherwise fire
  // on the project card link at the end of a drag
  projectsContainer.addEventListener('click', (e) => {
    if (dragMoved) {
      e.preventDefault();
      e.stopPropagation();
      dragMoved = false;
    }
  }, true);
});

// ===========================
// SHAPE PROXIMITY ANIMATION
// ===========================
function checkShapeProximity() {
  const shapes = document.querySelectorAll('.shape');
  const proximityThreshold = 80;

  shapes.forEach((shape1, index1) => {
    let isNear = false;
    const rect1 = shape1.getBoundingClientRect();
    const center1 = {
      x: rect1.left + rect1.width / 2,
      y: rect1.top + rect1.height / 2
    };

    shapes.forEach((shape2, index2) => {
      if (index1 !== index2) {
        const rect2 = shape2.getBoundingClientRect();
        const center2 = {
          x: rect2.left + rect2.width / 2,
          y: rect2.top + rect2.height / 2
        };

        const distance = Math.sqrt(
          Math.pow(center2.x - center1.x, 2) +
          Math.pow(center2.y - center1.y, 2)
        );

        if (distance < proximityThreshold) {
          isNear = true;
        }
      }
    });

    if (isNear) {
      shape1.classList.add('near');
    } else {
      shape1.classList.remove('near');
    }
  });
}

// Run proximity check every 100ms
setInterval(checkShapeProximity, 100);

// ===========================
// TEXT SIZE TOGGLE
// ===========================
function toggleTextSize() {
  const body = document.body;
  const accessToggleBtn = document.getElementById('accessToggleBtn');
  const floatingToggle = document.getElementById('floatingToggle');

  body.classList.toggle('large-text');

  // Update both toggles
  if (body.classList.contains('large-text')) {
    if (accessToggleBtn) accessToggleBtn.classList.add('active');
    if (floatingToggle) floatingToggle.classList.add('active');
    localStorage.setItem('textSize', 'large');
  } else {
    if (accessToggleBtn) accessToggleBtn.classList.remove('active');
    if (floatingToggle) floatingToggle.classList.remove('active');
    localStorage.setItem('textSize', 'default');
  }
}

// Load saved text size preference
window.addEventListener('load', () => {
  const savedSize = localStorage.getItem('textSize');
  if (savedSize === 'large') {
    document.body.classList.add('large-text');
    const accessToggleBtn = document.getElementById('accessToggleBtn');
    const floatingToggle = document.getElementById('floatingToggle');
    if (accessToggleBtn) accessToggleBtn.classList.add('active');
    if (floatingToggle) floatingToggle.classList.add('active');
  }
});

// ===========================
// PERSONAL TABLE - OPEN IMAGE
// ===========================
function openImage(src) {
  window.open(src, '_blank');
}

// ===========================
// MOBILE MENU TOGGLE
// ===========================
function toggleMenu() {
  const navMenu = document.getElementById('nav-menu');
  const menuToggle = document.querySelector('.menu-toggle');
  const isOpen = navMenu.classList.toggle('active');

  menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  menuToggle.innerHTML = isOpen
    ? '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4l14 14M18 4L4 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    : '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
}

// Close mobile menu when a nav link is clicked
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      const navMenu = document.getElementById('nav-menu');
      const menuToggle = document.querySelector('.menu-toggle');
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      }
    });
  });
});

// ===========================
// SCROLL SPY - ACTIVE NAV LINK
// ===========================
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.pageYOffset >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ===========================
// IMAGE MODAL FOR PERSONAL TABLE
// ===========================
document.addEventListener('DOMContentLoaded', function() {
  const tableImages = document.querySelectorAll('#personalTable img');

  tableImages.forEach(img => {
    img.addEventListener('click', function() {
      // Create modal
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
      `;

      const modalImg = document.createElement('img');
      modalImg.src = this.src;
      modalImg.alt = this.alt;
      modalImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 10px;
        box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
      `;

      modal.appendChild(modalImg);
      document.body.appendChild(modal);

      // Close modal on click
      modal.addEventListener('click', function() {
        document.body.removeChild(modal);
      });
    });
  });
});

// ===========================
// HEADER SHADOW ON SCROLL
// ===========================
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (header) {
    if (window.scrollY > 0) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
  }
});

// ===========================
// HEADER NAV COLOR — switches to light text once the dark
// "My Projects" section actually scrolls in behind the translucent header
// ===========================
(function() {
  const header = document.querySelector('header');
  const darkSection = document.querySelector('.dark-section-wrapper');
  if (!header || !darkSection) return;

  const headerHeight = header.offsetHeight;

  function updateHeaderTheme() {
    const top = darkSection.getBoundingClientRect().top;
    header.classList.toggle('header-on-dark', top <= headerHeight);
  }

  window.addEventListener('scroll', updateHeaderTheme, { passive: true });
  updateHeaderTheme();
})();

