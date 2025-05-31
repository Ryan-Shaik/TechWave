# TechWave 2025 - Stripe & Firebase Integration Setup

This guide will help you set up Stripe payments and Firebase backend for the TechWave 2025 conference ticket system.

## 🔧 Prerequisites

- Node.js 18+ installed
- A Stripe account (free)
- A Firebase project
- Basic knowledge of React and TypeScript

## 🚀 Quick Start

### 1. Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Follow the setup wizard

2. **Enable Firestore Database**
   - In your Firebase project, go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode" for development

3. **Get Firebase Configuration**
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click "Web" icon to add a web app
   - Copy the configuration object

4. **Update Firebase Config**
   ```typescript
   // src/config/firebase.ts
   const firebaseConfig = {
     apiKey: "your-actual-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-actual-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-actual-app-id"
   };
   ```

### 2. Stripe Setup

1. **Create a Stripe Account**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Sign up for a free account

2. **Get API Keys**
   - In Stripe Dashboard, go to "Developers" > "API keys"
   - Copy your "Publishable key" (starts with `pk_test_`)

3. **Update Stripe Config**
   ```typescript
   // src/config/stripe.ts
   const stripePublishableKey = 'pk_test_your_actual_publishable_key_here';
   ```

### 3. Environment Variables (Optional)

Create a `.env` file in the project root:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

Then update your config files to use environment variables:

```typescript
// src/config/stripe.ts
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_fallback';

// src/config/firebase.ts
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... other config
};
```

## 🏗�� Backend Setup (Production)

For production, you'll need a backend server to handle Stripe payments securely:

### 1. Create Backend Server

```bash
mkdir techwave-backend
cd techwave-backend
npm init -y
npm install express stripe firebase-admin cors dotenv
npm install -D @types/node @types/express typescript ts-node
```

### 2. Basic Express Server

```javascript
// server.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

const app = express();
app.use(express.json());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-service-account.json'))
});

// Create payment intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        conference: 'TechWave 2025'
      }
    });

    res.json({
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook
app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed.`);
  }

  if (event.type === 'payment_intent.succeeded') {
    // Handle successful payment
    console.log('Payment succeeded:', event.data.object.id);
  }

  res.json({received: true});
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

### 3. Environment Variables

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 🧪 Testing

### Test Mode

The current implementation includes test/demo functionality:

1. **Mock Payments**: Payments are simulated for demonstration
2. **Local Storage**: Data is stored locally for testing
3. **No Real Charges**: No actual money is processed

### Test with Real Stripe

1. Use Stripe test card numbers:
   - `4242424242424242` (Visa)
   - `4000000000003220` (3D Secure)
   - `4000000000000002` (Declined)

2. Use any future expiry date and any 3-digit CVC

## 📊 Database Structure

The Firebase Firestore database will store:

```javascript
// Collection: ticketPurchases
{
  id: "auto-generated",
  ticketTierId: "standard",
  ticketTierName: "Standard",
  price: 299,
  quantity: 2,
  totalAmount: 598,
  customerEmail: "user@example.com",
  customerName: "John Doe",
  customerPhone: "+1234567890",
  paymentIntentId: "pi_stripe_payment_intent_id",
  paymentStatus: "succeeded",
  purchaseDate: "2025-01-XX",
  attendeeInfo: [
    {
      name: "John Doe",
      email: "john@example.com",
      company: "Tech Corp"
    }
  ]
}
```

## 🔒 Security Considerations

1. **Never expose secret keys** in frontend code
2. **Validate all payments** on the backend
3. **Use HTTPS** in production
4. **Verify webhook signatures** from Stripe
5. **Sanitize user inputs** before storing in database

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist folder
```

### Backend (Railway/Heroku/AWS)
```bash
# Set environment variables
# Deploy backend server
# Configure webhook endpoints in Stripe
```

## 📞 Support

For issues with this implementation:
1. Check the browser console for errors
2. Verify API keys are correct
3. Ensure Firebase rules allow read/write
4. Test with Stripe test cards

## 🎯 Next Steps

1. Set up your Firebase project
2. Get your Stripe API keys
3. Update the configuration files
4. Test the payment flow
5. Deploy to production with a backend server

---

**Note**: This is a demonstration implementation. For production use, implement proper error handling, validation, security measures, and backend infrastructure.