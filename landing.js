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
    
    console.log('🔐 Attempting login for:', email);
    
    // Check if Firebase is properly initialized
    if (!firebase.apps.length) {
        const errorMessage = 'Firebase is not initialized. Please check your configuration.';
        console.error('❌', errorMessage);
        showSuccessMessage(errorMessage);
        return;
    }
    
    // Check if Firebase Auth is available
    if (!firebase.auth) {
        const errorMessage = 'Firebase Authentication is not available. Please check your configuration.';
        console.error('❌', errorMessage);
        showSuccessMessage(errorMessage);
        return;
    }
    
    try {
        // Show loading state
        setFormLoading(form, true);
        
        console.log('📡 Attempting Firebase authentication...');
        
        // Sign in with Firebase
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        console.log('✅ Login successful for user:', user.email);
        
        // Show success message
        showSuccessMessage('Login successful! Welcome back.');
        
        // Show role selection after a short delay
        setTimeout(() => {
            showRoleSelection();
        }, 1500);
        
    } catch (error) {
        console.error('❌ Login error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
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
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
            case 'auth/internal-error':
                errorMessage = 'Internal error. Please try again later.';
                break;
            case 'auth/invalid-api-key':
                errorMessage = 'Invalid API key. Please check your Firebase configuration.';
                break;
            case 'auth/app-not-authorized':
                errorMessage = 'App not authorized. Please check your Firebase configuration.';
                break;
            default:
                errorMessage = `Login failed: ${error.message}`;
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
    
    console.log('📝 Attempting signup for:', email, 'with role:', role);
    
    // Check if Firebase is properly initialized
    if (!firebase.apps.length) {
        const errorMessage = 'Firebase is not initialized. Please check your configuration.';
        console.error('❌', errorMessage);
        showSuccessMessage(errorMessage);
        return;
    }
    
    // Check if Firebase Auth is available
    if (!firebase.auth) {
        const errorMessage = 'Firebase Authentication is not available. Please check your configuration.';
        console.error('❌', errorMessage);
        showSuccessMessage(errorMessage);
        return;
    }
    
    try {
        // Show loading state
        setFormLoading(form, true);
        
        console.log('📡 Creating Firebase user account...');
        
        // Create user account
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        console.log('✅ User account created successfully:', user.uid);
        
        // Check if Firestore is available
        if (!db) {
            console.warn('⚠️ Firestore not available, skipping user data save');
            showSuccessMessage(`Account created successfully! Welcome to XYLMCSCICS, ${name}!`);
        } else {
            console.log('📡 Saving user data to Firestore...');
            
            // Save additional user data to Firestore
            await db.collection('users').doc(user.uid).set({
                name: name,
                email: email,
                role: role,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('✅ User data saved to Firestore successfully');
            showSuccessMessage(`Account created successfully! Welcome to XYLMCSCICS, ${name}!`);
        }
        
        // Close signup modal and show role selection
        setTimeout(() => {
            signupModal.style.display = 'none';
            showRoleSelection();
        }, 2000);
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('❌ Signup error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
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
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
            case 'auth/internal-error':
                errorMessage = 'Internal error. Please try again later.';
                break;
            case 'auth/invalid-api-key':
                errorMessage = 'Invalid API key. Please check your Firebase configuration.';
                break;
            case 'auth/app-not-authorized':
                errorMessage = 'App not authorized. Please check your Firebase configuration.';
                break;
            default:
                errorMessage = `Account creation failed: ${error.message}`;
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
    
    // Check if user is authenticated
    const user = firebase.auth().currentUser;
    
    if (user) {
        // User is authenticated, redirect to forms page
        if (role === 'donor') {
            window.location.href = 'index.html?role=donor';
        } else if (role === 'ngo') {
            window.location.href = 'index.html?role=ngo';
        }
    } else {
        // User is not authenticated (guest mode), redirect to forms page
        if (role === 'donor') {
            window.location.href = 'index.html?role=donor&guest=true';
        } else if (role === 'ngo') {
            window.location.href = 'index.html?role=ngo&guest=true';
        }
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

// Add Firebase status checker to the page
function addFirebaseStatusChecker() {
    // Create status indicator
    const statusDiv = document.createElement('div');
    statusDiv.id = 'firebaseStatus';
    statusDiv.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 10px;
        border-radius: 5px;
        font-size: 12px;
        font-weight: bold;
        z-index: 1000;
        max-width: 200px;
        text-align: center;
    `;
    
    // Check Firebase status
    function updateStatus() {
        if (firebase.apps.length > 0) {
            statusDiv.style.background = '#d4edda';
            statusDiv.style.color = '#155724';
            statusDiv.style.border = '1px solid #c3e6cb';
            statusDiv.innerHTML = '✅ Firebase Ready';
        } else {
            statusDiv.style.background = '#f8d7da';
            statusDiv.style.color = '#721c24';
            statusDiv.style.border = '1px solid #f5c6cb';
            statusDiv.innerHTML = '❌ Firebase Error';
        }
    }
    
    // Update status every 2 seconds
    updateStatus();
    setInterval(updateStatus, 2000);
    
    // Add click to show detailed status
    statusDiv.addEventListener('click', function() {
        if (window.checkFirebaseStatus) {
            window.checkFirebaseStatus();
        }
    });
    
    // Add to page
    document.body.appendChild(statusDiv);
}

// Add test login function
window.testLogin = function() {
    const testEmail = 'test@example.com';
    const testPassword = 'testpass123';
    
    console.log('🧪 Testing login with:', testEmail);
    
    // Check Firebase status first
    if (!firebase.apps.length) {
        console.error('❌ Firebase not initialized');
        alert('Firebase not initialized. Check your configuration.');
        return;
    }
    
    // Try to sign in
    firebase.auth().signInWithEmailAndPassword(testEmail, testPassword)
        .then((userCredential) => {
            console.log('✅ Test login successful:', userCredential.user.email);
            alert('Test login successful! Firebase is working correctly.');
        })
        .catch((error) => {
            console.log('❌ Test login failed (expected):', error.code);
            if (error.code === 'auth/user-not-found') {
                alert('Test login failed as expected (user not found). Firebase is working correctly.');
            } else {
                alert(`Test login failed: ${error.message}`);
            }
        });
};

// Add test signup function
window.testSignup = function() {
    const testEmail = 'test' + Date.now() + '@example.com';
    const testPassword = 'testpass123';
    const testName = 'Test User';
    const testRole = 'donor';
    
    console.log('🧪 Testing signup with:', testEmail);
    
    // Check Firebase status first
    if (!firebase.apps.length) {
        console.error('❌ Firebase not initialized');
        alert('Firebase not initialized. Check your configuration.');
        return;
    }
    
    // Try to create account
    firebase.auth().createUserWithEmailAndPassword(testEmail, testPassword)
        .then((userCredential) => {
            console.log('✅ Test signup successful:', userCredential.user.uid);
            
            // Try to save to Firestore if available
            if (window.db) {
                return window.db.collection('users').doc(userCredential.user.uid).set({
                    name: testName,
                    email: testEmail,
                    role: testRole,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        })
        .then(() => {
            if (window.db) {
                console.log('✅ Test user data saved to Firestore');
                alert('Test signup and Firestore save successful! Firebase is working correctly.');
            } else {
                alert('Test signup successful! Firebase is working correctly.');
            }
            
            // Clean up test user
            return firebase.auth().currentUser.delete();
        })
        .then(() => {
            console.log('✅ Test user cleaned up');
        })
        .catch((error) => {
            console.error('❌ Test signup failed:', error);
            alert(`Test signup failed: ${error.message}`);
        });
};

// Initialize Firebase status checker when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add status checker after a short delay
    setTimeout(addFirebaseStatusChecker, 1000);
    
    // Add test buttons to the page for debugging
    const testDiv = document.createElement('div');
    testDiv.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        z-index: 1000;
    `;
    
    const testLoginBtn = document.createElement('button');
    testLoginBtn.textContent = '🧪 Test Login';
    testLoginBtn.onclick = window.testLogin;
    testLoginBtn.style.cssText = `
        padding: 5px 10px;
        font-size: 10px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    `;
    
    const testSignupBtn = document.createElement('button');
    testSignupBtn.textContent = '🧪 Test Signup';
    testSignupBtn.onclick = window.testSignup;
    testSignupBtn.style.cssText = `
        padding: 5px 10px;
        font-size: 10px;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    `;
    
    testDiv.appendChild(testLoginBtn);
    testDiv.appendChild(testSignupBtn);
    document.body.appendChild(testDiv);
});
