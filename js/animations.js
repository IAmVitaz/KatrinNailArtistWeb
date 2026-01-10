/**
 * Katrin Nail Artist - Bold Design Animations
 * Enhanced scroll animations, button effects, and interactions
 */

(function() {
    'use strict';

    // Advanced scroll animations with stagger
    function initAdvancedScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Keep observing for better UX
                }
            });
        }, observerOptions);

        // Apply to all animated elements
        const animatedElements = document.querySelectorAll('.fade-in, .scale-in, .slide-left, .slide-right');
        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });

        // Stagger children animations
        const staggerContainers = document.querySelectorAll('.courses__grid, .pricing__features, .curriculum__grid');
        staggerContainers.forEach(container => {
            const children = container.children;
            Array.from(children).forEach((child, index) => {
                // Add fade-in class if not already present
                if (!child.classList.contains('fade-in')) {
                    child.classList.add('fade-in');
                }
                // Set stagger delay
                child.style.transitionDelay = `${index * 0.1}s`;
                // Observe for animation
                animationObserver.observe(child);
            });
        });
    }

    // Card tilt effect (optional - subtle 3D effect)
    function initCardTilt() {
        const cards = document.querySelectorAll('.course-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // Parallax hero effect (subtle)
    function initParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const heroContent = hero.querySelector('.hero__content');
                    const heroImage = hero.querySelector('.hero__image');

                    if (heroContent) {
                        heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
                        heroContent.style.opacity = `${1 - scrolled * 0.001}`;
                    }

                    if (heroImage) {
                        heroImage.style.transform = `translateY(${scrolled * 0.15}px)`;
                    }

                    ticking = false;
                });

                ticking = true;
            }
        }, { passive: true });
    }

    // Number counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Initialize counter animations when visible
    function initCounters() {
        const counters = document.querySelectorAll('.hero__badge-number, .instructor-stat__number');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    const text = entry.target.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));
                    const suffix = text.replace(/\d/g, '');

                    if (number && !isNaN(number)) {
                        entry.target.dataset.counted = 'true';
                        let current = 0;
                        const increment = number / 60;

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= number) {
                                entry.target.textContent = number + suffix;
                                clearInterval(timer);
                            } else {
                                entry.target.textContent = Math.floor(current) + suffix;
                            }
                        }, 16);
                    }
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Add smooth reveal to images
    function initImageReveal() {
        const images = document.querySelectorAll('.hero__img, .about__img, .course-card__img, .course-hero__img');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'scale(0.95)';

                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1)';
                    }, 100);

                    imageObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add loading class removal for smoother initial render
    function removeLoadingState() {
        document.body.classList.add('loaded');
    }

    // Initialize all animations
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initAdvancedScrollAnimations();
                initCardTilt();
                initParallax();
                initCounters();
                initImageReveal();

                // Remove loading state after short delay
                setTimeout(removeLoadingState, 100);
            });
        } else {
            initAdvancedScrollAnimations();
            initCardTilt();
            initParallax();
            initCounters();
            initImageReveal();
            setTimeout(removeLoadingState, 100);
        }
    }

    // Run initialization
    init();
})();
