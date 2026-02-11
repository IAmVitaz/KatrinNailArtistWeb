/**
 * Katrin Nail Artist - Main JavaScript
 * Mobile menu toggle and smooth scroll functionality
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
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/**
 * Reviews Section - Fetch and render course reviews
 */
(function() {
    'use strict';

    var REVIEWS_DATA_URL = 'data/reviews.json';
    var SCROLL_AMOUNT = 360;

    function createReviewCard(review) {
        var article = document.createElement('article');
        article.className = 'review-card';
        article.innerHTML =
            '<div class="review-card__stars">' +
                '<svg viewBox="0 0 12 12" fill="currentColor"><path d="M6 0l1.85 3.75L12 4.35 9 7.3l.7 4.1L6 9.45 2.3 11.4 3 7.3 0 4.35l4.15-.6z"/></svg>' +
                '<svg viewBox="0 0 12 12" fill="currentColor"><path d="M6 0l1.85 3.75L12 4.35 9 7.3l.7 4.1L6 9.45 2.3 11.4 3 7.3 0 4.35l4.15-.6z"/></svg>' +
                '<svg viewBox="0 0 12 12" fill="currentColor"><path d="M6 0l1.85 3.75L12 4.35 9 7.3l.7 4.1L6 9.45 2.3 11.4 3 7.3 0 4.35l4.15-.6z"/></svg>' +
                '<svg viewBox="0 0 12 12" fill="currentColor"><path d="M6 0l1.85 3.75L12 4.35 9 7.3l.7 4.1L6 9.45 2.3 11.4 3 7.3 0 4.35l4.15-.6z"/></svg>' +
                '<svg viewBox="0 0 12 12" fill="currentColor"><path d="M6 0l1.85 3.75L12 4.35 9 7.3l.7 4.1L6 9.45 2.3 11.4 3 7.3 0 4.35l4.15-.6z"/></svg>' +
            '</div>' +
            '<div class="review-card__header">' +
                '<span class="review-card__name">' + review.name + '</span>' +
                '<a href="' + review.courseUrl + '" class="review-card__course">' + review.course + '</a>' +
            '</div>' +
            '<blockquote class="review-card__text">' +
                '<p>' + review.text + '</p>' +
            '</blockquote>';
        return article;
    }

    function addToggleButtons(track) {
        var cards = track.querySelectorAll('.review-card');
        cards.forEach(function(card) {
            var p = card.querySelector('.review-card__text p');
            if (p.scrollHeight > p.clientHeight) {
                var btn = document.createElement('button');
                btn.className = 'review-card__toggle';
                btn.textContent = '... more';
                btn.addEventListener('click', function() {
                    var expanded = p.classList.toggle('is-expanded');
                    btn.textContent = expanded ? '... less' : '... more';
                });
                card.appendChild(btn);
            }
        });
    }

    function renderReviews(reviews, track) {
        var fragment = document.createDocumentFragment();
        reviews.forEach(function(review) {
            fragment.appendChild(createReviewCard(review));
        });
        track.appendChild(fragment);
        addToggleButtons(track);
    }

    function updateArrowStates(track, prevBtn, nextBtn) {
        var scrollLeft = Math.round(track.scrollLeft);
        var maxScroll = track.scrollWidth - track.clientWidth;

        prevBtn.disabled = scrollLeft <= 0;
        nextBtn.disabled = scrollLeft >= maxScroll - 1;
    }

    function initReviews() {
        var track = document.getElementById('reviewsTrack');
        var prevBtn = document.getElementById('reviewsPrev');
        var nextBtn = document.getElementById('reviewsNext');

        if (!track) return;

        fetch(REVIEWS_DATA_URL)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Failed to load reviews');
                }
                return response.json();
            })
            .then(function(data) {
                if (!data.reviews || data.reviews.length === 0) return;

                renderReviews(data.reviews, track);

                if (prevBtn && nextBtn) {
                    prevBtn.addEventListener('click', function() {
                        track.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
                    });

                    nextBtn.addEventListener('click', function() {
                        track.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
                    });

                    track.addEventListener('scroll', function() {
                        updateArrowStates(track, prevBtn, nextBtn);
                    }, { passive: true });

                    updateArrowStates(track, prevBtn, nextBtn);
                }

                track.scrollLeft = 0;
            })
            .catch(function(error) {
                console.warn('Reviews could not be loaded:', error.message);
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initReviews);
    } else {
        initReviews();
    }
})();
