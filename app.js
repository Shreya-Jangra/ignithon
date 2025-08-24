// DOM elements
const donorForm = document.getElementById('donorForm');
const ngoForm = document.getElementById('ngoForm');
const successModal = document.getElementById('successModal');
const successMessage = document.getElementById('successMessage');
const closeModal = document.querySelector('.close');
const backToLandingBtn = document.getElementById('backToLanding');
const logoutBtn = document.getElementById('logoutBtn');
const rolePrompt = document.getElementById('rolePrompt');
const donorFormSection = document.getElementById('donorFormSection');
const ngoFormSection = document.getElementById('ngoFormSection');
const selectDonorBtn = document.getElementById('selectDonor');
const selectNGOBtn = document.getElementById('selectNGO');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('XYLMCSCICS Food Donation Platform initialized');
    
    // Add event listeners
    donorForm.addEventListener('submit', handleDonorSubmission);
    ngoForm.addEventListener('submit', handleNGOSubmission);
    closeModal.addEventListener('click', closeSuccessModal);
    backToLandingBtn.addEventListener('click', goBackToLanding);
    logoutBtn.addEventListener('click', handleLogout);
    selectDonorBtn.addEventListener('click', () => selectRole('donor'));
    selectNGOBtn.addEventListener('click', () => selectRole('ngo'));
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === successModal) {
            closeSuccessModal();
        }
    });
    
    // Check URL parameters for role
    checkRoleFromURL();
    
    // Check authentication state
    checkAuthState();
});

// Check role from URL parameters
function checkRoleFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');
    
    if (role) {
        selectRole(role);
    }
}

// Check authentication state
function checkAuthState() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('User is signed in:', user.email);
            // User is authenticated, show appropriate content
        } else {
            console.log('User is signed out');
            // Redirect to landing page if not authenticated
            window.location.href = 'landing.html';
        }
    });
}

// Select role and show appropriate form
function selectRole(role) {
    // Hide role prompt
    rolePrompt.style.display = 'none';
    
    if (role === 'donor') {
        donorFormSection.style.display = 'block';
        ngoFormSection.style.display = 'none';
        console.log('Showing donor form');
    } else if (role === 'ngo') {
        ngoFormSection.style.display = 'block';
        donorFormSection.style.display = 'none';
        console.log('Showing NGO form');
    }
    
    // Store role in session storage
    sessionStorage.setItem('userRole', role);
}

// Handle Donor Form Submission
async function handleDonorSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    
    // Get form data
    const formData = new FormData(form);
    const donorData = {
        foodType: formData.get('foodType'),
        quantity: formData.get('quantity'),
        expiryTime: parseInt(formData.get('expiryTime')),
        location: formData.get('donorLocation'),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        type: 'donor',
        userId: firebase.auth().currentUser ? firebase.auth().currentUser.uid : 'guest'
    };
    
    try {
        // Show loading state
        setFormLoading(form, true);
        
        // Save to Firestore
        await db.collection('donations').add(donorData);
        
        // Show success message
        showSuccessMessage(`Thank you for your donation! Your ${donorData.quantity} of ${donorData.foodType} has been recorded.`);
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Error saving donor data:', error);
        showSuccessMessage('Sorry, there was an error saving your donation. Please try again.');
    } finally {
        // Hide loading state
        setFormLoading(form, false);
    }
}

// Handle NGO Form Submission
async function handleNGOSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    
    // Get form data
    const formData = new FormData(form);
    const ngoData = {
        ngoName: formData.get('ngoName'),
        foodNeeded: formData.get('foodNeeded'),
        location: formData.get('ngoLocation'),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        type: 'ngo',
        userId: firebase.auth().currentUser ? firebase.auth().currentUser.uid : 'guest'
    };
    
    try {
        // Show loading state
        setFormLoading(form, true);
        
        // Save to Firestore
        await db.collection('ngoRequests').add(ngoData);
        
        // Show success message
        showSuccessMessage(`Thank you ${ngoData.ngoName}! Your request for ${ngoData.foodNeeded} has been recorded.`);
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Error saving NGO data:', error);
        showSuccessMessage('Sorry, there was an error saving your request. Please try again.');
    } finally {
        // Hide loading state
        setFormLoading(form, false);
    }
}

// Go back to landing page
function goBackToLanding() {
    window.location.href = 'landing.html';
}

// Handle logout
async function handleLogout() {
    try {
        await firebase.auth().signOut();
        console.log('User signed out successfully');
        window.location.href = 'landing.html';
    } catch (error) {
        console.error('Error signing out:', error);
        showSuccessMessage('Error signing out. Please try again.');
    }
}

// Show success message modal
function showSuccessMessage(message) {
    successMessage.textContent = message;
    successModal.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        closeSuccessModal();
    }, 5000);
}

// Close success modal
function closeSuccessModal() {
    successModal.style.display = 'none';
}

// Set form loading state
function setFormLoading(form, isLoading) {
    if (isLoading) {
        form.classList.add('loading');
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
    } else {
        form.classList.remove('loading');
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.textContent.includes('Donate') ? 'Donate Food' : 'Request Food';
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
    
    if (data.expiryTime && (data.expiryTime < 1 || data.expiryTime > 8760)) { // Max 1 year
        errors.push('Expiry time must be between 1 and 8760 hours');
    }
    
    return errors;
}

// Add some basic form validation
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
