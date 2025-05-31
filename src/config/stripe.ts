import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePublishableKey = 'pk_test_51RUhIz2ZEqbw8uHwBs3U94ICQn849vOCVTdwlEAD8u1es9u2IGgnxghwWYdIoiaqUWsNEzQAfccemOpZL8LsLhtQ00HUb7HhNV';

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