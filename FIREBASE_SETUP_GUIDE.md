/* Example CSS for resizing the pie chart */
/* filepath: c:\Users\KIIT\hacathon12copy\hakathon12\styles.css */
.pie-chart {
    width: 400px; /* Adjust width */
    height: 400px; /* Adjust height */
    margin: auto; /* Center the chart */
}# 🔥 Firebase Setup Guide for XYLMCSCICS

## 🚨 **Login Issue Identified**

The login is failing because your Firebase configuration contains placeholder values instead of real Firebase project credentials. This guide will help you set up Firebase properly.

## 📋 **Prerequisites**

- A Google account
- Access to the internet
- Basic understanding of web development

## 🚀 **Step-by-Step Firebase Setup**

### **Step 1: Create a Firebase Project**

1. **Go to Firebase Console**: Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. **Sign In**: Use your Google account to sign in
3. **Create Project**: Click "Create a project" or "Add project"
4. **Project Name**: Enter "XYLMCSCICS" or any name you prefer
5. **Google Analytics**: Choose whether to enable Google Analytics (optional)
6. **Create Project**: Click "Create project"

### **Step 2: Enable Authentication**

1. **Project Dashboard**: Once your project is created, you'll see the dashboard
2. **Authentication**: Click on "Authentication" in the left sidebar
3. **Get Started**: Click "Get started"
4. **Sign-in Method**: Click on "Email/Password"
5. **Enable**: Toggle the switch to enable email/password authentication
6. **Save**: Click "Save"

### **Step 3: Enable Firestore Database**

1. **Firestore Database**: Click on "Firestore Database" in the left sidebar
2. **Create Database**: Click "Create database"
3. **Security Rules**: Choose "Start in test mode" (we'll update rules later)
4. **Location**: Select a location close to your users (e.g., "us-central1")
5. **Create**: Click "Create database"

### **Step 4: Get Your Web App Configuration**

1. **Project Settings**: Click the gear icon (⚙️) next to "Project Overview"
2. **General Tab**: Make sure you're on the "General" tab
3. **Your Apps**: Scroll down to "Your apps" section
4. **Web App**: Click on the web app icon (</>) or create a new web app
5. **App Nickname**: Enter "XYLMCSCICS Web App"
6. **Register App**: Click "Register app"
7. **Copy Config**: Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC...",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456"
};
```

### **Step 5: Update Your Configuration File**

1. **Open `firebase-config.js`**: In your project folder
2. **Replace Placeholders**: Replace the placeholder values with your actual config
3. **Save File**: Save the changes

### **Step 6: Update Firestore Security Rules**

1. **Firestore Database**: Go back to Firestore Database in Firebase Console
2. **Rules Tab**: Click on the "Rules" tab
3. **Update Rules**: Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read/write donations and NGO requests
    match /donations/{document} {
      allow read, write: if true;
    }
    
    match /ngoRequests/{document} {
      allow read, write: if true;
    }
  }
}
```

4. **Publish**: Click "Publish"

## 🔧 **Testing Your Setup**

### **1. Check Browser Console**

1. **Open `landing.html`** in your browser
2. **Open Developer Tools**: Press F12 or right-click → Inspect
3. **Console Tab**: Look for Firebase status messages
4. **Expected Output**:
   ```
   ✅ Firebase initialized successfully
   ✅ Firestore initialized successfully
   ✅ Authentication initialized successfully
   📋 Firebase configuration loaded. Use checkFirebaseStatus() to verify setup.
   ```

### **2. Use Test Functions**

The page now includes test buttons:
- **🧪 Test Login**: Tests Firebase authentication
- **🧪 Test Signup**: Tests account creation and Firestore

### **3. Visual Status Indicators**

- **Top Right**: Firebase status indicator (green = ready, red = error)
- **Bottom Right**: Test buttons for debugging

## 🚨 **Common Issues and Solutions**

### **Issue 1: "Firebase is not initialized"**
- **Cause**: Invalid configuration values
- **Solution**: Double-check your `firebase-config.js` file

### **Issue 2: "Invalid API key"**
- **Cause**: Wrong API key or project ID
- **Solution**: Verify you copied the correct config from Firebase Console

### **Issue 3: "App not authorized"**
- **Cause**: Domain not authorized in Firebase
- **Solution**: Add your domain to authorized domains in Firebase Console

### **Issue 4: "Network error"**
- **Cause**: Internet connection or firewall issues
- **Solution**: Check your internet connection and firewall settings

## 📱 **Mobile Testing**

### **Local Development**
- Use `localhost` or `127.0.0.1`
- Firebase automatically allows localhost

### **Production Deployment**
- Add your domain to Firebase Console → Authentication → Settings → Authorized domains

## 🔒 **Security Best Practices**

### **For Development**
- Use test mode Firestore rules
- Keep API keys in your code (they're public anyway)

### **For Production**
- Set up proper Firestore security rules
- Enable Firebase App Check
- Monitor usage in Firebase Console

## 📊 **Monitoring and Debugging**

### **Firebase Console**
- **Authentication**: Monitor user sign-ups and sign-ins
- **Firestore**: View database usage and data
- **Analytics**: Track app performance (if enabled)

### **Browser Console**
- Use `checkFirebaseStatus()` function
- Monitor error messages
- Check network requests

## 🎯 **Next Steps After Setup**

1. **Test Login**: Try creating an account and logging in
2. **Test Guest Mode**: Verify guest mode works without authentication
3. **Test Forms**: Submit donor and NGO forms
4. **Check Data**: Verify data appears in Firestore Database

## 🆘 **Getting Help**

### **Firebase Documentation**
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)

### **Common Resources**
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Database](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

## ✅ **Success Checklist**

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore Database created
- [ ] Configuration copied to `firebase-config.js`
- [ ] Security rules updated
- [ ] Console shows success messages
- [ ] Test functions work
- [ ] Login/signup works
- [ ] Guest mode works
- [ ] Forms submit successfully

Once you complete this setup, your login should work perfectly! 🎉
