require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Initialize Firebase Admin (optional - comment out if no Firebase service account)
try {
  admin.initializeApp({
    credential: admin.credential.cert(require('./firebase-service-account.json'))
  });
  console.log('Firebase Admin initialized');
} catch (error) {
  console.warn('Firebase Admin initialization failed:', error.message);
  console.log('Continuing without Firebase Admin...');
}

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    stripe: !!process.env.STRIPE_SECRET_KEY,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Stripe configured: ${!!process.env.STRIPE_SECRET_KEY}`);
  console.log(`Environment loaded: ${!!process.env.STRIPE_SECRET_KEY ? 'Yes' : 'No'}`);
});