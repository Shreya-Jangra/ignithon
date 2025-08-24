// DOM elements
const loginForm = document.getElementById('loginForm');
const signupLink = document.getElementById('signupLink');
const signupModal = document.getElementById('signupModal');
const signupForm = document.getElementById('signupForm');
const guestBtn = document.getElementById('guestBtn');
const roleSelection = document.getElementById('roleSelection');
const successModal = document.getElementById('successModal');
const successMessage = document.getElementById('successMessage');
const closeButtons = document.querySelectorAll('.close');
const roleCards = document.querySelectorAll('.role-card');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('XYLMCSCICS Landing Page initialized');
    
    // Add event listeners
    loginForm.addEventListener('submit', handleLogin);
    signupLink.addEventListener('click', showSignupModal);
    signupForm.addEventListener('submit', handleSignup);
    guestBtn.addEventListener('click', showRoleSelection);
    
    // Close modal events
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Role selection events
    roleCards.forEach(card => {
        const button = card.querySelector('.role-select-btn');
        button.addEventListener('click', function() {
            const role = card.dataset.role;
            handleRoleSelection(role);
        });
    });
    
    // Check if user is already logged in
    checkAuthState();
});

// Check authentication state
function checkAuthState() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            console.log('User is signed in:', user.email);
            showRoleSelection();
        } else {
            // User is signed out
            console.log('User is signed out');
        }
    });
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const loginBtn = form.querySelector('.login-btn');
    
    // Get form data
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        // Show loading state
        setFormLoading(form, true);
        
        // Sign in with Firebase
        await firebase.auth().signInWithEmailAndPassword(email, password);
        
        // Show success message
        showSuccessMessage('Login successful! Welcome back.');
        
        // Show role selection after a short delay
        setTimeout(() => {
            showRoleSelection();
        }, 1500);
        
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. Please try again.';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email address.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Please try again later.';
                break;
        }
        
        showSuccessMessage(errorMessage);
    } finally {
        // Hide loading state
        setFormLoading(form, false);
    }
}

// Handle Signup
async function handleSignup(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.signup-submit-btn');
    
    // Get form data
    const formData = new FormData(form);
    const name = formData.get('signupName');
    const email = formData.get('signupEmail');
    const password = formData.get('signupPassword');
    const role = formData.get('signupRole');
    
    try {
        // Show loading state
        setFormLoading(form, true);
        
        // Create user account
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Save additional user data to Firestore
        await db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            role: role,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Show success message
        showSuccessMessage(`Account created successfully! Welcome to XYLMCSCICS, ${name}!`);
        
        // Close signup modal and show role selection
        setTimeout(() => {
            signupModal.style.display = 'none';
            showRoleSelection();
        }, 2000);
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Signup error:', error);
        let errorMessage = 'Account creation failed. Please try again.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'An account with this email already exists.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password should be at least 6 characters long.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                break;
        }
        
        showSuccessMessage(errorMessage);
    } finally {
        // Hide loading state
        setFormLoading(form, false);
    }
}

// Show signup modal
function showSignupModal(event) {
    event.preventDefault();
    signupModal.style.display = 'block';
}

// Show role selection
function showRoleSelection() {
    // Hide login section
    document.querySelector('.login-section').style.display = 'none';
    document.querySelector('.welcome-section').style.display = 'none';
    
    // Show role selection
    roleSelection.style.display = 'block';
}

// Handle role selection
function handleRoleSelection(role) {
    console.log('Selected role:', role);
    
    // Store role in session storage for the forms page
    sessionStorage.setItem('userRole', role);
    
    // Redirect to the appropriate form page
    if (role === 'donor') {
        window.location.href = 'index.html?role=donor';
    } else if (role === 'ngo') {
        window.location.href = 'index.html?role=ngo';
    }
}

// Show success message modal
function showSuccessMessage(message) {
    successMessage.textContent = message;
    successModal.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successModal.style.display = 'none';
    }, 5000);
}

// Set form loading state
function setFormLoading(form, isLoading) {
    if (isLoading) {
        form.classList.add('loading');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';
        }
    } else {
        form.classList.remove('loading');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            if (submitBtn.classList.contains('login-btn')) {
                submitBtn.textContent = 'Login';
            } else if (submitBtn.classList.contains('signup-submit-btn')) {
                submitBtn.textContent = 'Create Account';
            }
        }
    }
}

// Utility function to validate form data
function validateFormData(data) {
    const errors = [];
    
    for (const [key, value] of Object.entries(data)) {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            errors.push(`${key} is required`);
        }
    }
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Password validation
    if (data.password && data.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    
    return errors;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add form validation
function addFormValidation() {
    const inputs = document.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '#e1e5e9';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#e1e5e9';
            }
        });
    });
}

// Initialize form validation
addFormValidation();
