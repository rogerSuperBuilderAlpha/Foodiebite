// ===== PORTFOLIO WEBSITE MAIN JAVASCRIPT =====
// Enhanced with advanced features, animations, and performance optimizations

class PortfolioWebsite {
    constructor() {
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
    }

    // ===== EVENT LISTENERS SETUP =====
    setupEventListeners() {
        // Navigation events
        document.addEventListener('DOMContentLoaded', () => {
            this.handleNavbarScroll();
            this.setupActiveNavigation();
        });

        // Scroll events
        window.addEventListener('scroll', this.debounce(() => {
            this.handleNavbarScroll();
            this.handleScrollAnimations();
            this.updateScrollProgress();
        }, 16));

        // Resize events
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Form events
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleFormSubmission(e);
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Mobile navigation
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Scroll to top
        const scrollTopBtn = document.getElementById('scroll-top');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => {
                this.scrollToTop();
            });
        }

        // Project filters
        const filterBtns = document.querySelectorAll('.filter__btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterProjects(e);
            });
        });

        // Smooth scroll for navigation links
        const navLinks = document.querySelectorAll('.nav__link, .hero__scroll-indicator a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleSmoothScroll(e);
            });
        });
    }

    // ===== NAVIGATION FUNCTIONALITY =====
    setupMobileNavigation() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        const navLinks = document.querySelectorAll('.nav__link');

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('show');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        const isExpanded = navMenu.classList.contains('show');

        navMenu.classList.toggle('show');
        navToggle.setAttribute('aria-expanded', !isExpanded);

        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
    }

    handleNavbarScroll() {
        const header = document.getElementById('header');
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav__link');

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50% 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveNavigation(id);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    updateActiveNavigation(activeId) {
        const navLinks = document.querySelectorAll('.nav__link');
        
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active-link');
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    // ===== SMOOTH SCROLLING =====
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ===== ANIMATIONS & EFFECTS =====
    setupScrollEffects() {
        const scrollTopBtn = document.getElementById('scroll-top');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
    }

    setupIntersectionObserver() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    initializeAnimations() {
        // Add animation classes to elements
        const elementsToAnimate = document.querySelectorAll('.hero__title, .hero__description, .hero__actions, .section__title, .card, .skill-item');
        
        elementsToAnimate.forEach((element, index) => {
            element.classList.add('animate-on-scroll');
            element.style.animationDelay = `${index * 0.1}s`;
        });

        // Add specific animation directions
        const leftElements = document.querySelectorAll('.hero__content, .about__content');
        const rightElements = document.querySelectorAll('.hero__image, .about__image');
        
        leftElements.forEach(el => el.classList.add('animate-on-scroll', 'animate--left'));
        rightElements.forEach(el => el.classList.add('animate-on-scroll', 'animate--right'));
    }

    handleScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    }

    // ===== THEME TOGGLE =====
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        // Set initial theme
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(currentTheme);
        
        // Theme toggle functionality
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
        
        // Dispatch custom event for theme change
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
    }

    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
                themeToggle.setAttribute('aria-label', 'Switch to light theme');
            } else {
                icon.className = 'fas fa-moon';
                themeToggle.setAttribute('aria-label', 'Switch to dark theme');
            }
        }
    }

    // ===== PROJECT FILTERING =====
    filterProjects(e) {
        const filterBtn = e.currentTarget;
        const filter = filterBtn.getAttribute('data-filter');
        const projectCards = document.querySelectorAll('.project__card');
        const filterBtns = document.querySelectorAll('.filter__btn');

        // Update active filter button
        filterBtns.forEach(btn => btn.classList.remove('active'));
        filterBtn.classList.add('active');

        // Filter projects
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.classList.add('animate-on-scroll');
                setTimeout(() => {
                    card.classList.add('animate');
                }, 100);
            } else {
                card.style.display = 'none';
                card.classList.remove('animate');
            }
        });
    }

    // ===== FORM HANDLING =====
    setupFormHandling() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
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
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
        field.classList.add('error');
    }

    clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.classList.remove('error');
    }

    async handleFormSubmission(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const submitBtn = form.querySelector('.form__submit');
        const originalText = submitBtn.innerHTML;

        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showNotification('Message sent successfully!', 'success');
            form.reset();
            
        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification__close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // ===== COUNTER ANIMATIONS =====
    initializeCounters() {
        const counters = document.querySelectorAll('.stat__number[data-target]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(counterElement) {
        const target = parseInt(counterElement.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counterElement.textContent = Math.floor(current);
        }, 16);
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====
    setupPerformanceOptimizations() {
        // Lazy loading for images
        this.setupLazyLoading();
        
        // Debounced scroll events
        this.setupDebouncedEvents();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupDebouncedEvents() {
        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const fontLinks = document.querySelectorAll('link[rel="preload"][as="font"]');
        fontLinks.forEach(link => {
            link.rel = 'stylesheet';
        });
    }

    // ===== ACCESSIBILITY FEATURES =====
    setupAccessibilityFeatures() {
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = skipLink.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.focus();
                    targetElement.scrollIntoView();
                }
            });
        }

        // Focus management for mobile menu
        this.setupFocusManagement();
    }

    setupFocusManagement() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navToggle) {
            // Trap focus in mobile menu when open
            navToggle.addEventListener('click', () => {
                if (navMenu.classList.contains('show')) {
                    const firstFocusable = navMenu.querySelector('a, button, input, textarea, select');
                    if (firstFocusable) {
                        firstFocusable.focus();
                    }
                }
            });
        }
    }

    // ===== KEYBOARD NAVIGATION =====
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key closes mobile menu
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('nav-menu');
                if (navMenu && navMenu.classList.contains('show')) {
                    this.toggleMobileMenu();
                }
            }

            // Tab key navigation
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    handleTabNavigation(e) {
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
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

    handleResize() {
        // Handle responsive adjustments
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Mobile-specific adjustments
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Update scroll progress indicator if it exists
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    }

    // ===== INITIALIZATION =====
    static init() {
        return new PortfolioWebsite();
    }
}

// ===== INITIALIZE THE WEBSITE =====
document.addEventListener('DOMContentLoaded', () => {
    PortfolioWebsite.init();
    
    // Add loading animation
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        setTimeout(() => {
            loadingSpinner.style.opacity = '0';
            setTimeout(() => {
                loadingSpinner.style.display = 'none';
            }, 300);
        }, 1000);
    }
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

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioWebsite;
}
