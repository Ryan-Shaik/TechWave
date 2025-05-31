# Firebase Setup Guide

## Current Status
Your Firebase project is configured with the following details:
- **Project ID**: techwave-81034
- **Auth Domain**: techwave-81034.firebaseapp.com
- **App ID**: 1:1058350341266:web:a11fd488f30de608d71a4b

## Required Setup Steps

### 1. Firestore Database Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `techwave-81034`
3. Navigate to **Firestore Database**
4. If not already created, click **Create database**
5. Choose **Start in test mode** (for development)

### 2. Firestore Security Rules

For development/demo purposes, use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to ticketPurchases collection
    match /ticketPurchases/{document} {
      allow read, write: if true;
    }
    
    // Allow read/write access to connectionTest collection (for testing)
    match /connectionTest/{document} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Important**: These rules allow public access. For production, implement proper authentication and authorization.

### 3. Production Security Rules (Recommended)

For production, use more restrictive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Ticket purchases - allow creation and reading own purchases
    match /ticketPurchases/{purchaseId} {
      allow create: if true; // Allow anyone to create purchases
      allow read: if resource.data.customerEmail == request.auth.token.email;
      allow update: if resource.data.customerEmail == request.auth.token.email;
    }
    
    // Connection tests - only for development
    match /connectionTest/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Enable Authentication (Optional)

If you want to add user authentication:

1. Go to **Authentication** in Firebase Console
2. Click **Get started**
3. Enable **Email/Password** provider
4. Configure sign-in methods as needed

### 5. Testing Firebase Connection

The app includes built-in Firebase testing:

1. **Automatic Status**: Check the top-right corner for Firebase connection status
2. **Manual Test**: Click the "Test Firebase" button on the checkout page
3. **Console Logs**: Check browser console for detailed Firebase operation logs

## Troubleshooting

### Common Issues:

1. **Permission Denied**
   - Check Firestore security rules
   - Ensure rules allow public access for demo mode

2. **Service Unavailable**
   - Check internet connection
   - Verify Firebase project is active

3. **Unauthenticated**
   - Enable Authentication in Firebase Console
   - Or adjust security rules for public access

### Debug Information:

The app provides detailed logging:
- 🔥 Firebase operations
- ✅ Successful operations
- ⚠️ Warnings and fallbacks
- 🚫 Permission errors
- 📡 Connection issues

## Current Fallback Behavior

If Firebase is unavailable, the app will:
1. Log the error with specific details
2. Fall back to localStorage for demo purposes
3. Continue functioning normally
4. Display appropriate status indicators

## Verification Steps

1. Open the checkout page
2. Check the Firebase status indicator (top-right)
3. Click "Test Firebase" button
4. Complete a test purchase
5. Check browser console for logs

The app should work seamlessly whether Firebase is connected or not!