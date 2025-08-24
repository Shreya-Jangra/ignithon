# XYLMCSCICS - Food Donation Platform

A modern web application that connects food donors with NGOs to reduce food waste. Built with HTML, CSS, and JavaScript, integrated with Firebase Firestore and Authentication.

## 🚀 Features

- **Landing Page**: Beautiful welcome page with login/signup functionality
- **User Authentication**: Secure login and registration system
- **Role-Based Access**: Choose between Food Donor or NGO Representative
- **Donor Form**: Submit food donations with details like food type, quantity, expiry time, and location
- **NGO Form**: Request specific types of food for your organization
- **Firebase Integration**: Stores all data in Firestore for real-time updates
- **Mobile-Friendly**: Responsive design that works on all devices
- **Success Messages**: User feedback after form submission

## 📁 File Structure

```
hakathon12/
├── landing.html          # Landing page with login/signup
├── landing-styles.css    # Styles for landing page
├── landing.js           # Landing page functionality
├── index.html           # Main forms page (donor/ngo)
├── styles.css           # Styles for forms page
├── app.js              # Main application logic
├── firebase-config.js   # Firebase configuration
└── README.md           # This file
```

## 🛠️ Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication in the left sidebar
   - Click "Get started"
   - Enable "Email/Password" sign-in method
4. Enable Firestore Database:
   - Go to Firestore Database in the left sidebar
   - Click "Create Database"
   - Choose "Start in test mode" for development
   - Select a location close to your users
5. Get your Firebase configuration:
   - Click on the gear icon (⚙️) next to "Project Overview"
   - Select "Project settings"
   - Scroll down to "Your apps" section
   - Click on the web app icon (</>)
   - Register your app and copy the config object

### 2. Update Firebase Configuration

Open `firebase-config.js` and replace the placeholder values with your actual Firebase project credentials:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};
```

### 3. Firestore Security Rules

Update your Firestore security rules to allow read/write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For development only
    }
  }
}
```

**Note**: The above rules allow anyone to read/write. For production, implement proper authentication and security rules.

### 4. Run the Application

1. **Start with Landing Page**: Open `landing.html` in a web browser
2. **Or serve the files using a local server**:
   - Using Python: `python -m http.server 8000`
   - Using Node.js: `npx serve .`
   - Using VS Code: Install "Live Server" extension and right-click on `landing.html`

## 🔐 How to Use

### 1. Landing Page (`landing.html`)
- **Welcome**: Beautiful introduction to XYLMCSCICS
- **Login**: Existing users can sign in with email/password
- **Sign Up**: New users can create accounts and choose their role
- **Guest Mode**: Continue without creating an account
- **Role Selection**: Choose between Food Donor or NGO Representative

### 2. Main Application (`index.html`)
- **Role-Based Forms**: Only the relevant form is shown based on user selection
- **Navigation**: Back to landing page or logout options
- **Form Submission**: Submit donations or requests to Firestore
- **Success Feedback**: Confirmation messages after successful submissions

## 📊 Data Structure

### Users Collection
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  role: "donor", // or "ngo"
  createdAt: serverTimestamp()
}
```

### Donations Collection
```javascript
{
  foodType: "Rice",
  quantity: "5kg",
  expiryTime: 24, // hours
  location: "Downtown",
  timestamp: serverTimestamp(),
  type: "donor",
  userId: "user_uid_or_guest"
}
```

### NGO Requests Collection
```javascript
{
  ngoName: "Hope Foundation",
  foodNeeded: "Rice, Vegetables",
  location: "Downtown",
  timestamp: serverTimestamp(),
  type: "ngo",
  userId: "user_uid_or_guest"
}
```

## 🎨 Design Features

- **Modern UI**: Clean, professional design with gradients and shadows
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Color Coding**: Different colors for donor (green) and NGO (orange) roles
- **Loading States**: Visual feedback during form submissions
- **Success Modals**: Beautiful confirmation messages

## 🔒 Security Features

- **User Authentication**: Secure login/signup system
- **Role-Based Access**: Users can only access forms relevant to their role
- **Session Management**: Automatic redirects for unauthenticated users
- **Data Validation**: Client-side form validation
- **Secure Storage**: All data stored securely in Firebase

## 🌐 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🚨 Troubleshooting

1. **Firebase not initialized**: Check your Firebase configuration in `firebase-config.js`
2. **Authentication errors**: Verify Authentication is enabled in Firebase Console
3. **Forms not submitting**: Check browser console for JavaScript errors
4. **Data not saving**: Verify Firestore rules and internet connection
5. **Role selection not working**: Check if all JavaScript files are loaded correctly

## 🚀 Future Enhancements

- User profile management
- Real-time matching between donors and NGOs
- Email notifications
- Food pickup scheduling
- Admin dashboard
- Food quality verification
- Donation history tracking
- Mobile app development
- Payment integration for premium features

## 📱 Mobile Experience

- **Touch-Friendly**: Large buttons and form elements
- **Responsive Design**: Adapts to all screen sizes
- **iOS Optimization**: Prevents zoom on input focus
- **Fast Loading**: Optimized for mobile networks

## 📄 License

This project is open source and available under the MIT License.

---

**XYLMCSCICS** - Connecting Communities Through Food 🍽️
