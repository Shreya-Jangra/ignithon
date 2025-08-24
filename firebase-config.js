// Firebase configuration
// IMPORTANT: You need to replace these placeholder values with your actual Firebase project credentials
// To get these values:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select an existing one
// 3. Click on the gear icon (⚙️) next to "Project Overview"
// 4. Select "Project settings"
// 5. Scroll down to "Your apps" section
// 6. Click on the web app icon (</>) or create a new web app
// 7. Copy the configuration values

const firebaseConfig = {
    apiKey: "AIzaSyD0tpxt9x874OvuQ_iRP5MZW2alYYjH3Nk",
    authDomain: "ylics-a516e.firebaseapp.com",
    projectId: "ylics-a516e",
    storageBucket: "ylics-a516e.firebasestorage.app",
    messagingSenderId: "298470694527",
    appId: "1:298470694527:web:b7be07b32dce184f65294a",
    measurementId: "G-MC1MQG5ECQ"
};

// Check if Firebase is already initialized
if (!firebase.apps.length) {
    try {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        console.log('✅ Firebase initialized successfully');
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        console.error('💡 Make sure you have valid Firebase credentials in firebase-config.js');
    }
} else {
    console.log('✅ Firebase already initialized');
}

// Initialize Firestore
let db;
try {
    db = firebase.firestore();
    console.log('✅ Firestore initialized successfully');
} catch (error) {
    console.error('❌ Firestore initialization failed:', error);
    console.error('💡 This might be due to invalid Firebase credentials');
}

// Initialize Authentication
let auth;
try {
    auth = firebase.auth();
    console.log('✅ Authentication initialized successfully');
} catch (error) {
    console.error('❌ Authentication initialization failed:', error);
    console.error('💡 This might be due to invalid Firebase credentials');
}

// Export for use in other files
window.db = db;
window.auth = auth;

// Add a function to check Firebase status
window.checkFirebaseStatus = function() {
    console.log('🔍 Checking Firebase status...');
    
    if (firebase.apps.length > 0) {
        console.log('✅ Firebase app is initialized');
        
        if (db) {
            console.log('✅ Firestore is available');
        } else {
            console.log('❌ Firestore is not available');
        }
        
        if (auth) {
            console.log('✅ Authentication is available');
        } else {
            console.log('❌ Authentication is not available');
        }
        
        // Test Firebase connection
        if (db) {
            db.collection('test').doc('test').get()
                .then(() => {
                    console.log('✅ Firestore connection test successful');
                })
                .catch((error) => {
                    console.error('❌ Firestore connection test failed:', error);
                    console.error('💡 This usually means your Firebase credentials are invalid');
                });
        }
    } else {
        console.error('❌ Firebase app is not initialized');
        console.error('💡 Check your Firebase configuration and credentials');
    }
};

// Auto-check status when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.checkFirebaseStatus();
    }, 1000);
});

console.log('📋 Firebase configuration loaded. Use checkFirebaseStatus() to verify setup.');
