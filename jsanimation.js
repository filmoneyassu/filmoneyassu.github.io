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
    
    // Calculate which project is currently visible based on scroll position
    // Each project takes up roughly 1/3 of the scrollable width
    const totalScrollWidth = projectsContainer.scrollWidth - containerWidth;
    const scrollPercentage = scrollLeft / totalScrollWidth;
    
    let currentIndex = 0;
    if (scrollPercentage < 0.33) {
      currentIndex = 0;
    } else if (scrollPercentage < 0.66) {
      currentIndex = 1;
    } else {
      currentIndex = 2;
    }
    
    // Update dots
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // Update active dot based on scroll position
  projectsContainer.addEventListener('scroll', updateActiveDot);
  
  // Click on dots to scroll to specific project
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      const containerWidth = projectsContainer.offsetWidth;
      const totalScrollWidth = projectsContainer.scrollWidth - containerWidth;
      
      let scrollPosition = 0;
      if (index === 0) {
        scrollPosition = 0;
      } else if (index === 1) {
        scrollPosition = totalScrollWidth / 2;
      } else {
        scrollPosition = totalScrollWidth;
      }
      
      projectsContainer.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      
      // Manually update dots immediately
      dots.forEach((d, i) => {
        if (i === index) {
          d.classList.add('active');
        } else {
          d.classList.remove('active');
        }
      });
    });
  });
  
  // Initialize on page load
  updateActiveDot();
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
  
  navMenu.classList.toggle('active');
  
  if (navMenu.classList.contains('active')) {
    menuToggle.innerHTML = '✕';
  } else {
    menuToggle.innerHTML = '☰';
  }
}

// Close menu when clicking on a link
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      const navMenu = document.getElementById('nav-menu');
      const menuToggle = document.querySelector('.menu-toggle');
      
      if (navMenu && menuToggle) {
        navMenu.classList.remove('active');
        menuToggle.innerHTML = '☰';
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