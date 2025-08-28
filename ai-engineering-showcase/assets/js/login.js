// ===== ENHANCED LOGIN SYSTEM =====
// Modern, secure login with social authentication and enhanced UX

class EnhancedLogin {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.loginModal = null;
        this.init();
    }

    init() {
        this.createLoginModal();
        this.setupEventListeners();
        this.checkAuthStatus();
        this.setupSocialLogin();
    }

    // ===== CREATE LOGIN MODAL =====
    createLoginModal() {
        const modalHTML = `
            <div id="login-modal" class="login-modal" aria-hidden="true">
                <div class="login-modal__overlay" tabindex="-1" data-micromodal-close>
                    <div class="login-modal__container" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
                        <header class="login-modal__header">
                            <h2 id="login-modal-title" class="login-modal__title">Welcome Back</h2>
                            <button class="login-modal__close" aria-label="Close modal" data-micromodal-close>
                                <i class="fas fa-times"></i>
                            </button>
                        </header>
                        
                        <main class="login-modal__content">
                            <!-- Login Form -->
                            <form id="login-form" class="login-form" novalidate>
                                <div class="form-group">
                                    <label for="login-email" class="form-label">Email</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-envelope input-icon"></i>
                                        <input 
                                            type="email" 
                                            id="login-email" 
                                            name="email" 
                                            class="form-input" 
                                            required 
                                            autocomplete="email"
                                            placeholder="Enter your email"
                                        >
                                    </div>
                                    <div class="form-error" id="email-error"></div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="login-password" class="form-label">Password</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-lock input-icon"></i>
                                        <input 
                                            type="password" 
                                            id="login-password" 
                                            name="password" 
                                            class="form-input" 
                                            required 
                                            autocomplete="current-password"
                                            placeholder="Enter your password"
                                        >
                                        <button type="button" class="password-toggle" aria-label="Toggle password visibility">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </div>
                                    <div class="form-error" id="password-error"></div>
                                </div>
                                
                                <div class="form-options">
                                    <label class="checkbox-wrapper">
                                        <input type="checkbox" id="remember-me" name="remember">
                                        <span class="checkmark"></span>
                                        Remember me
                                    </label>
                                    <a href="#" class="forgot-password">Forgot password?</a>
                                </div>
                                
                                <button type="submit" class="btn btn--primary btn--full-width">
                                    <span class="btn-text">Sign In</span>
                                    <span class="btn-loading" style="display: none;">
                                        <i class="fas fa-spinner fa-spin"></i>
                                    </span>
                                </button>
                            </form>
                            
                            <!-- Social Login -->
                            <div class="social-login">
                                <div class="divider">
                                    <span>or continue with</span>
                                </div>
                                
                                <div class="social-buttons">
                                    <button type="button" class="btn btn--social btn--google" data-provider="google">
                                        <i class="fab fa-google"></i>
                                        <span>Google</span>
                                    </button>
                                    <button type="button" class="btn btn--social btn--github" data-provider="github">
                                        <i class="fab fa-github"></i>
                                        <span>GitHub</span>
                                    </button>
                                    <button type="button" class="btn btn--social btn--linkedin" data-provider="linkedin">
                                        <i class="fab fa-linkedin"></i>
                                        <span>LinkedIn</span>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Sign Up Link -->
                            <div class="signup-prompt">
                                <p>Don't have an account? <a href="#" class="switch-to-signup">Sign up</a></p>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.loginModal = document.getElementById('login-modal');
    }

    // ===== SETUP EVENT LISTENERS =====
    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Password visibility toggle
        const passwordToggle = document.querySelector('.password-toggle');
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());
        }

        // Social login buttons
        const socialButtons = document.querySelectorAll('.btn--social');
        socialButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleSocialLogin(e));
        });

        // Switch to signup
        const signupLink = document.querySelector('.switch-to-signup');
        if (signupLink) {
            signupLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToSignup();
            });
        }

        // Forgot password
        const forgotPassword = document.querySelector('.forgot-password');
        if (forgotPassword) {
            forgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPassword();
            });
        }

        // Form validation
        this.setupFormValidation();
    }

    // ===== FORM VALIDATION =====
    setupFormValidation() {
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');

        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail(emailInput));
            emailInput.addEventListener('input', () => this.clearError(emailInput, 'email-error'));
        }

        if (passwordInput) {
            passwordInput.addEventListener('blur', () => this.validatePassword(passwordInput));
            passwordInput.addEventListener('input', () => this.clearError(passwordInput, 'password-error'));
        }
    }

    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError(input, 'email-error', 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError(input, 'email-error', 'Please enter a valid email address');
            return false;
        }
        
        return true;
    }

    validatePassword(input) {
        const password = input.value;
        
        if (!password) {
            this.showError(input, 'password-error', 'Password is required');
            return false;
        }
        
        if (password.length < 6) {
            this.showError(input, 'password-error', 'Password must be at least 6 characters');
            return false;
        }
        
        return true;
    }

    showError(input, errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        input.classList.add('error');
    }

    clearError(input, errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        input.classList.remove('error');
    }

    // ===== LOGIN HANDLING =====
    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Validate form
        const isEmailValid = this.validateEmail(emailInput);
        const isPasswordValid = this.validatePassword(passwordInput);
        
        if (!isEmailValid || !isPasswordValid) {
            return;
        }
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(form);
            const loginData = {
                email: formData.get('email'),
                password: formData.get('password'),
                remember: formData.get('remember') === 'on'
            };
            
            // Simulate API call (replace with actual endpoint)
            const response = await this.authenticateUser(loginData);
            
            if (response.success) {
                this.loginSuccess(response.user);
                this.closeModal();
                this.showSuccessMessage('Welcome back!');
            } else {
                this.showErrorMessage(response.message || 'Login failed');
            }
            
        } catch (error) {
            this.showErrorMessage('An error occurred. Please try again.');
            console.error('Login error:', error);
        } finally {
            // Restore button state
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    }

    async authenticateUser(loginData) {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock authentication (replace with actual API)
        if (loginData.email === 'demo@example.com' && loginData.password === 'password123') {
            return {
                success: true,
                user: {
                    id: '1',
                    email: loginData.email,
                    name: 'Demo User',
                    avatar: '/assets/images/avatar.jpg'
                }
            };
        }
        
        return {
            success: false,
            message: 'Invalid email or password'
        };
    }

    // ===== SOCIAL LOGIN =====
    setupSocialLogin() {
        // Initialize social login providers
        if (typeof gapi !== 'undefined') {
            gapi.load('auth2', () => {
                gapi.auth2.init({
                    client_id: 'YOUR_GOOGLE_CLIENT_ID'
                });
            });
        }
    }

    async handleSocialLogin(e) {
        const provider = e.currentTarget.dataset.provider;
        const button = e.currentTarget;
        const originalText = button.innerHTML;
        
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        button.disabled = true;
        
        try {
            let userData;
            
            switch (provider) {
                case 'google':
                    userData = await this.googleLogin();
                    break;
                case 'github':
                    userData = await this.githubLogin();
                    break;
                case 'linkedin':
                    userData = await this.linkedinLogin();
                    break;
                default:
                    throw new Error('Unsupported provider');
            }
            
            if (userData) {
                this.loginSuccess(userData);
                this.closeModal();
                this.showSuccessMessage(`Welcome! You've signed in with ${provider}.`);
            }
            
        } catch (error) {
            this.showErrorMessage(`Failed to sign in with ${provider}. Please try again.`);
            console.error(`${provider} login error:`, error);
        } finally {
            // Restore button state
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }

    async googleLogin() {
        // Implement Google OAuth
        return new Promise((resolve, reject) => {
            // Mock implementation
            setTimeout(() => {
                resolve({
                    id: 'google_123',
                    email: 'user@gmail.com',
                    name: 'Google User',
                    avatar: '/assets/images/google-avatar.jpg'
                });
            }, 1000);
        });
    }

    async githubLogin() {
        // Implement GitHub OAuth
        return new Promise((resolve, reject) => {
            // Mock implementation
            setTimeout(() => {
                resolve({
                    id: 'github_456',
                    email: 'user@github.com',
                    name: 'GitHub User',
                    avatar: '/assets/images/github-avatar.jpg'
                });
            }, 1000);
        });
    }

    async linkedinLogin() {
        // Implement LinkedIn OAuth
        return new Promise((resolve, reject) => {
            // Mock implementation
            setTimeout(() => {
                resolve({
                    id: 'linkedin_789',
                    email: 'user@linkedin.com',
                    name: 'LinkedIn User',
                    avatar: '/assets/images/linkedin-avatar.jpg'
                });
            }, 1000);
        });
    }

    // ===== PASSWORD VISIBILITY =====
    togglePasswordVisibility() {
        const passwordInput = document.getElementById('login-password');
        const toggleButton = document.querySelector('.password-toggle');
        const icon = toggleButton.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
            toggleButton.setAttribute('aria-label', 'Hide password');
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
            toggleButton.setAttribute('aria-label', 'Show password');
        }
    }

    // ===== MODAL CONTROLS =====
    openModal() {
        if (this.loginModal) {
            this.loginModal.setAttribute('aria-hidden', 'false');
            this.loginModal.classList.add('is-open');
            document.body.classList.add('modal-open');
            
            // Focus first input
            const firstInput = this.loginModal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
            
            // Trap focus
            this.trapFocus();
        }
    }

    closeModal() {
        if (this.loginModal) {
            this.loginModal.setAttribute('aria-hidden', 'true');
            this.loginModal.classList.remove('is-open');
            document.body.classList.remove('modal-open');
            
            // Reset form
            const form = document.getElementById('login-form');
            if (form) {
                form.reset();
                this.clearAllErrors();
            }
        }
    }

    // ===== FOCUS TRAPPING =====
    trapFocus() {
        const focusableElements = this.loginModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        this.loginModal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
            
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    // ===== AUTHENTICATION STATUS =====
    checkAuthStatus() {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.isAuthenticated = true;
                this.updateUIForAuthenticatedUser();
            } catch (error) {
                this.logout();
            }
        }
    }

    loginSuccess(user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        
        // Store user data
        localStorage.setItem('auth_token', 'mock_token_' + Date.now());
        localStorage.setItem('user_data', JSON.stringify(user));
        
        // Update UI
        this.updateUIForAuthenticatedUser();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Clear storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        
        // Update UI
        this.updateUIForLoggedOutUser();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
    }

    // ===== UI UPDATES =====
    updateUIForAuthenticatedUser() {
        // Update navigation
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
        
        // Add user menu
        this.addUserMenu();
    }

    updateUIForLoggedOutUser() {
        // Show login button
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.style.display = 'inline-block';
        }
        
        // Remove user menu
        this.removeUserMenu();
    }

    addUserMenu() {
        const navActions = document.querySelector('.nav__actions');
        if (navActions && this.currentUser) {
            const userMenu = document.createElement('div');
            userMenu.className = 'user-menu';
            userMenu.innerHTML = `
                <button class="user-menu__toggle" aria-label="User menu">
                    <img src="${this.currentUser.avatar || '/assets/images/default-avatar.jpg'}" 
                         alt="${this.currentUser.name}" 
                         class="user-avatar">
                    <span class="user-name">${this.currentUser.name}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="user-menu__dropdown">
                    <a href="#profile" class="user-menu__item">
                        <i class="fas fa-user"></i>
                        Profile
                    </a>
                    <a href="#settings" class="user-menu__item">
                        <i class="fas fa-cog"></i>
                        Settings
                    </a>
                    <div class="user-menu__divider"></div>
                    <button class="user-menu__item logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        Sign Out
                    </button>
                </div>
            `;
            
            navActions.appendChild(userMenu);
            
            // Add event listeners
            const toggle = userMenu.querySelector('.user-menu__toggle');
            const dropdown = userMenu.querySelector('.user-menu__dropdown');
            const logoutBtn = userMenu.querySelector('.logout-btn');
            
            toggle.addEventListener('click', () => {
                dropdown.classList.toggle('show');
            });
            
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenu.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            });
        }
    }

    removeUserMenu() {
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.remove();
        }
    }

    // ===== UTILITY METHODS =====
    clearAllErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        errorElements.forEach(error => {
            error.style.display = 'none';
        });
        
        const errorInputs = document.querySelectorAll('.form-input.error');
        errorInputs.forEach(input => {
            input.classList.remove('error');
        });
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification__close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button
        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    // ===== PUBLIC METHODS =====
    open() {
        this.openModal();
    }

    close() {
        this.closeModal();
    }

    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.loginSystem = new EnhancedLogin();
});

// ===== GLOBAL LOGIN TRIGGER =====
// Add this to your navigation to trigger login
document.addEventListener('click', (e) => {
    if (e.target.matches('.login-btn') || e.target.closest('.login-btn')) {
        e.preventDefault();
        if (window.loginSystem) {
            window.loginSystem.open();
        }
    }
});
