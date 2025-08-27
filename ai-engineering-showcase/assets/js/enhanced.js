// ===== ENHANCED PORTFOLIO JAVASCRIPT =====
// Modern animations, performance optimizations, and advanced features

class EnhancedPortfolio {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.animationObserver = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupThemeToggle();
        this.setupMobileNavigation();
        this.setupScrollEffects();
        this.setupFormHandling();
        this.setupPerformanceOptimizations();
        this.initializeCounters();
        this.setupIntersectionObserver();
        this.setupSmoothScrolling();
        this.setupKeyboardNavigation();
        this.setupAccessibilityFeatures();
        this.setupParallaxEffects();
        this.setupTypingAnimation();
        this.setupParticleEffects();
        this.setupLazyLoading();
    }

    // ===== ENHANCED EVENT LISTENERS =====
    setupEventListeners() {
        // DOM Ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }

        // Performance optimized scroll handling
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Resize with debouncing
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));

        // Touch events for mobile
        this.setupTouchEvents();
    }

    onDOMReady() {
        this.handleNavbarScroll();
        this.setupActiveNavigation();
        this.initializeHeroAnimation();
        this.setupFormValidation();
    }

    // ===== ENHANCED ANIMATIONS =====
    initializeAnimations() {
        // Staggered animation for hero elements
        const heroElements = document.querySelectorAll('.hero__greeting, .hero__name, .hero__title, .hero__description, .hero__buttons');
        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Floating animation for bubble site name
        const bubbleName = document.querySelector('.bubble-site-name');
        if (bubbleName) {
            this.setupFloatingAnimation(bubbleName);
        }
    }

    setupFloatingAnimation(element) {
        let start = Date.now();
        const animate = () => {
            const time = Date.now() - start;
            const y = Math.sin(time * 0.003) * 10;
            const rotation = Math.sin(time * 0.002) * 2;
            
            element.style.transform = `rotate(${rotation}deg) translateY(${y}px)`;
            requestAnimationFrame(animate);
        };
        animate();
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====
    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Setup intersection observer for lazy loading
        this.setupLazyLoading();
        
        // Optimize images
        this.optimizeImages();
        
        // Setup service worker if available
        this.setupServiceWorker();
    }

    preloadCriticalResources() {
        const criticalResources = [
            '/assets/css/styles.css',
            '/assets/css/components.css',
            '/assets/js/main.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" for images below the fold
            if (img.offsetTop > window.innerHeight) {
                img.loading = 'lazy';
            }
            
            // Add error handling
            img.addEventListener('error', () => {
                img.src = '/assets/images/placeholder.jpg';
            });
        });
    }

    // ===== ENHANCED SCROLL EFFECTS =====
    setupScrollEffects() {
        // Parallax effect for hero section
        this.setupParallaxEffects();
        
        // Sticky navigation with background change
        this.setupStickyNavigation();
        
        // Scroll-triggered animations
        this.setupScrollAnimations();
        
        // Progress bar
        this.setupScrollProgress();
    }

    setupParallaxEffects() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    setupStickyNavigation() {
        const header = document.querySelector('.header');
        if (!header) return;

        const handleScroll = () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
    }

    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // ===== ENHANCED FORM HANDLING =====
    setupFormHandling() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmission(e));
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Show/hide error
        this.showFieldError(field, errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        if (message) {
            const error = document.createElement('div');
            error.className = 'form-error';
            error.textContent = message;
            field.parentNode.appendChild(error);
            field.classList.add('error');
        }
    }

    clearFieldError(field) {
        const error = field.parentNode.querySelector('.form-error');
        if (error) {
            error.remove();
            field.classList.remove('error');
        }
    }

    async handleFormSubmission(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';

        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showFormSuccess(form);
            form.reset();
            
        } catch (error) {
            this.showFormError(form, 'An error occurred. Please try again.');
        } finally {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    showFormSuccess(form) {
        const success = document.createElement('div');
        success.className = 'form-success';
        success.textContent = 'Message sent successfully!';
        form.appendChild(success);
        
        setTimeout(() => success.remove(), 5000);
    }

    showFormError(form, message) {
        const error = document.createElement('div');
        error.className = 'form-error';
        error.textContent = message;
        form.appendChild(error);
        
        setTimeout(() => error.remove(), 5000);
    }

    // ===== ENHANCED THEME TOGGLE =====
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        // Set initial theme
        this.applyTheme(this.currentTheme);

        themeToggle.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(this.currentTheme);
            localStorage.setItem('theme', this.currentTheme);
        });
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        const icon = document.querySelector('#theme-toggle i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }

        // Animate theme transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }

    // ===== ENHANCED MOBILE NAVIGATION =====
    setupMobileNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
            navToggle.classList.toggle('active');
            
            // Animate toggle button
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('show-menu')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('show-menu');
                navToggle.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });

        // Close menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show-menu');
                navToggle.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            });
        });
    }

    // ===== ENHANCED INTERSECTION OBSERVER =====
    setupIntersectionObserver() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => this.animationObserver.observe(el));
    }

    // ===== ENHANCED SMOOTH SCROLLING =====
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== ENHANCED KEYBOARD NAVIGATION =====
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key closes mobile menu
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('nav-menu');
                if (navMenu && navMenu.classList.contains('show-menu')) {
                    navMenu.classList.remove('show-menu');
                }
            }

            // Tab key navigation
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        // Remove keyboard navigation class on mouse use
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // ===== ENHANCED ACCESSIBILITY FEATURES =====
    setupAccessibilityFeatures() {
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        }

        // Focus management for modals
        this.setupFocusManagement();
        
        // ARIA live regions
        this.setupAriaLiveRegions();
    }

    setupFocusManagement() {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusable = document.querySelectorAll(focusableElements);
                const firstFocusable = focusable[0];
                const lastFocusable = focusable[focusable.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    setupAriaLiveRegions() {
        // Create live region for form messages
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }

    // ===== ENHANCED COUNTERS =====
    initializeCounters() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            // Start counter when element is visible
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        counterObserver.unobserve(entry.target);
                    }
                });
            });

            counterObserver.observe(counter);
        });
    }

    // ===== ENHANCED TOUCH EVENTS =====
    setupTouchEvents() {
        // Touch gestures for mobile
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Swipe left/right for navigation
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - next section
                    this.navigateToNextSection();
                } else {
                    // Swipe right - previous section
                    this.navigateToPreviousSection();
                }
            }
        });
    }

    navigateToNextSection() {
        const sections = document.querySelectorAll('section[id]');
        const currentSection = this.getCurrentSection();
        const currentIndex = Array.from(sections).findIndex(section => section.id === currentSection);
        
        if (currentIndex < sections.length - 1) {
            const nextSection = sections[currentIndex + 1];
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    navigateToPreviousSection() {
        const sections = document.querySelectorAll('section[id]');
        const currentSection = this.getCurrentSection();
        const currentIndex = Array.from(sections).findIndex(section => section.id === currentSection);
        
        if (currentIndex > 0) {
            const prevSection = sections[currentIndex - 1];
            prevSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200 && window.scrollY < sectionTop + sectionHeight - 200) {
                currentSection = section.id;
            }
        });

        return currentSection;
    }

    // ===== ENHANCED TYPING ANIMATION =====
    setupTypingAnimation() {
        const typingElement = document.querySelector('.typing-animation');
        if (!typingElement) return;

        const words = ['Developer', 'Designer', 'Creator', 'Innovator'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = 150;

            if (isDeleting) {
                typeSpeed /= 2;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before next word
            }

            setTimeout(type, typeSpeed);
        };

        type();
    }

    // ===== ENHANCED PARTICLE EFFECTS =====
    setupParticleEffects() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Create particle container
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particles';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 1;
        `;
        hero.appendChild(particleContainer);

        // Generate particles
        for (let i = 0; i < 50; i++) {
            this.createParticle(particleContainer);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(37, 99, 235, 0.3);
            border-radius: 50%;
            animation: float-particle 6s infinite linear;
        `;

        // Random position and animation
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const delay = Math.random() * 6;
        const duration = 6 + Math.random() * 4;

        particle.style.left = x + '%';
        particle.style.top = y + '%';
        particle.style.animationDelay = delay + 's';
        particle.style.animationDuration = duration + 's';

        container.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
                this.createParticle(container);
            }
        }, (delay + duration) * 1000);
    }

    // ===== UTILITY FUNCTIONS =====
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===== PUBLIC METHODS =====
    refresh() {
        this.setupIntersectionObserver();
        this.initializeCounters();
    }

    destroy() {
        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }
        // Clean up event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new EnhancedPortfolio();
});

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
        }, 0);
    });
}
