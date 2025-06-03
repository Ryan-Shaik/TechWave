import { loadStripe } from '@stripe/stripe-js';

// Using environment variable for Stripe publishable key
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_fallback';

console.log('Stripe key loaded:', stripePublishableKey ? 'Key present' : 'No key found');

export const stripePromise = loadStripe(stripePublishableKey).then((stripe) => {
  if (!stripe) {
    console.error('Failed to load Stripe');
  } else {
    console.log('Stripe loaded successfully');
  }
  return stripe;
});

export const STRIPE_CONFIG = {
  // Stripe Elements configuration options
  appearance: {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#8b5cf6',
      colorBackground: '#1e293b',
      colorText: '#ffffff',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  },
};