/* ==========================================================================
   Sierra & Sea Suite — Main JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------------------------------------
     Mobile Navigation Toggle
     -------------------------------------------------------------------- */
  const navButton = document.querySelector('.menu-button');
  const navMenu = document.querySelector('.nav-menu');

  if (navButton && navMenu) {
    navButton.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navButton.classList.toggle('open');
    });

    // Close menu when a nav link is clicked (mobile UX)
    const navLinks = navMenu.querySelectorAll('.navlink, .dropdown-link, .call-us');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navButton.classList.remove('open');
      });
    });
  }

  /* --------------------------------------------------------------------
     Smooth Scroll for Anchor Links
     -------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navbarHeight = 80; // Fixed navbar height
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --------------------------------------------------------------------
     FAQ Accordion Toggle
     -------------------------------------------------------------------- */
  document.querySelectorAll('.accordion-wrapper').forEach((accordion) => {
    accordion.addEventListener('click', () => {
      const content = accordion.querySelector('.open-close-box');
      const arrow = accordion.querySelector('.faq-arrow');

      if (content) {
        const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

        // Close all other accordions
        document.querySelectorAll('.accordion-wrapper .open-close-box').forEach((box) => {
          box.style.maxHeight = '0px';
          box.style.overflow = 'hidden';
        });
        document.querySelectorAll('.accordion-wrapper .faq-arrow').forEach((arr) => {
          arr.style.transform = 'rotate(0deg)';
        });

        // Toggle current
        if (!isOpen) {
          content.style.maxHeight = content.scrollHeight + 'px';
          content.style.overflow = 'visible';
          if (arrow) arrow.style.transform = 'rotate(180deg)';
        }
      }
    });
  });

  /* --------------------------------------------------------------------
     Go Up Button Visibility
     -------------------------------------------------------------------- */
  const goUpButton = document.querySelector('.go-up-button');
  if (goUpButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
        goUpButton.style.opacity = '1';
        goUpButton.style.pointerEvents = 'auto';
      } else {
        goUpButton.style.opacity = '0';
        goUpButton.style.pointerEvents = 'none';
      }
    });
  }
});
