import { loadStripe } from '@stripe/stripe-js';

// Using environment variable for Stripe publishable key
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_fallback';

export const stripePromise = loadStripe(stripePublishableKey);

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