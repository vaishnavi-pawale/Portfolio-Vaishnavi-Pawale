/* ========================================
   Portfolio — JavaScript
   Scroll animations, navbar, mobile menu
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ── Navbar Scroll Effect ──
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    const handleNavScroll = () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ── Mobile Navigation Toggle ──
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');

            const lines = navToggle.querySelectorAll('.hamburger-line');
            if (navLinks.classList.contains('active')) {
                lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const lines = navToggle.querySelectorAll('.hamburger-line');
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            });
        });
    }

    // ── Active Nav Link Highlight ──
    const sections = document.querySelectorAll('.section, .hero');
    const allNavLinks = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

    const highlightNavLink = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    // ── Intersection Observer for Scroll Animations ──
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, parseInt(delay));
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // ── Smooth Scroll for Anchor Links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ── Interactive Hero Card Tilt ──
    const heroCard = document.querySelector('.hero-card');
    if (heroCard && window.innerWidth > 768) {
        const heroVisual = document.querySelector('.hero-visual');
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            heroCard.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        });

        heroVisual.addEventListener('mouseleave', () => {
            heroCard.style.transform = 'perspective(1000px) rotateY(-3deg) rotateX(2deg)';
        });
    }

    // ── Code Typing Effect ──
    const codeBlock = document.querySelector('.hero-code code');
    if (codeBlock) {
        const originalHTML = codeBlock.innerHTML;
        codeBlock.innerHTML = '';
        codeBlock.style.visibility = 'visible';

        let charIndex = 0;
        const plainText = codeBlock.textContent || originalHTML.replace(/<[^>]*>/g, '');

        // Restore the full code after a short delay to simulate typing
        setTimeout(() => {
            codeBlock.innerHTML = originalHTML;
            codeBlock.style.opacity = '1';
        }, 800);

        codeBlock.style.opacity = '0';
        codeBlock.style.transition = 'opacity 0.6s ease';
        setTimeout(() => {
            codeBlock.style.opacity = '1';
        }, 100);
    }

    // ── Counter Animation for Stats ──
    const statNumbers = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const finalText = el.textContent;
                const numericPart = parseFloat(finalText);
                const suffix = finalText.replace(/[\d.]/g, '');

                if (!isNaN(numericPart)) {
                    let start = 0;
                    const duration = 1500;
                    const startTime = performance.now();
                    const isDecimal = finalText.includes('.');

                    const animate = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = numericPart * eased;

                        if (isDecimal) {
                            el.textContent = current.toFixed(2) + suffix;
                        } else {
                            el.textContent = Math.floor(current) + suffix;
                        }

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            el.textContent = finalText;
                        }
                    };

                    requestAnimationFrame(animate);
                }

                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

});
