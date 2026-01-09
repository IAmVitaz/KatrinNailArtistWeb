/**
 * Katrin Nail Artist - Main JavaScript
 * Mobile menu toggle, smooth scroll, and animations
 */

(function() {
    'use strict';

    // DOM Elements
    const menuBtn = document.querySelector('.header__menu-btn');
    const nav = document.querySelector('.header__nav');
    const navLinks = document.querySelectorAll('.header__nav-link');
    const header = document.querySelector('.header');

    // Toggle mobile menu
    function toggleMenu() {
        const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isOpen);
        nav.classList.toggle('is-open');
        document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    // Close mobile menu
    function closeMenu() {
        menuBtn.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    // Handle nav link clicks (close menu on mobile)
    function handleNavClick() {
        if (window.innerWidth < 1024) {
            closeMenu();
        }
    }

    // Handle scroll for header styling
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    // Handle window resize
    function handleResize() {
        if (window.innerWidth >= 1024) {
            closeMenu();
        }
    }

    // Close menu when clicking outside
    function handleOutsideClick(event) {
        if (nav.classList.contains('is-open') &&
            !nav.contains(event.target) &&
            !menuBtn.contains(event.target)) {
            closeMenu();
        }
    }

    // Scroll animations using Intersection Observer
    function initScrollAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in');

        if (fadeElements.length === 0) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Once visible, stop observing for better performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => observer.observe(el));
    }

    // Initialize
    function init() {
        // Menu toggle
        if (menuBtn) {
            menuBtn.addEventListener('click', toggleMenu);
        }

        // Nav links
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });

        // Scroll handling
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Resize handling
        window.addEventListener('resize', handleResize);

        // Outside click handling
        document.addEventListener('click', handleOutsideClick);

        // Handle escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && nav.classList.contains('is-open')) {
                closeMenu();
            }
        });

        // Initial scroll check
        handleScroll();

        // Initialize scroll animations
        initScrollAnimations();
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
