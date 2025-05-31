// Mock backend API for demonstration purposes
// In a real application, these would be actual backend endpoints

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
}

export interface CreatePaymentIntentResponse {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

// Mock Stripe payment intent creation
export const createPaymentIntent = async (
  request: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Generate properly formatted mock IDs that match Stripe's actual format
  // Stripe payment intent IDs are typically 27 characters long after 'pi_'
  const generateRandomString = (length: number) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const paymentIntentId = generateRandomString(27);
  const secretPart = generateRandomString(24);
  
  // Mock response with proper Stripe-like format
  return {
    id: `pi_${paymentIntentId}`,
    client_secret: `pi_${paymentIntentId}_secret_${secretPart}`,
    amount: request.amount,
    currency: request.currency,
    status: 'requires_payment_method',
  };
};

// Mock webhook handler for payment confirmation
export const handlePaymentWebhook = async (paymentIntentId: string) => {
  // In a real application, this would be handled by your backend
  // when Stripe sends webhook events
  console.log(`Payment webhook received for: ${paymentIntentId}`);
  
  // Update payment status in your database
  // Send confirmation emails
  // Generate tickets
  // etc.
};

// Example backend setup instructions
export const BACKEND_SETUP_INSTRUCTIONS = `
To set up a real backend for this application:

1. Create a backend server (Node.js/Express, Python/Django, etc.)

2. Install Stripe SDK:
   npm install stripe

3. Create payment intent endpoint:
   POST /api/create-payment-intent
   - Validate request
   - Create Stripe payment intent
   - Return client_secret

4. Set up Stripe webhooks:
   POST /api/webhooks/stripe
   - Verify webhook signature
   - Handle payment events
   - Update database
   - Send confirmation emails

5. Environment variables:
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   FIREBASE_SERVICE_ACCOUNT_KEY=...

6. Deploy to production:
   - Use HTTPS
   - Set up proper CORS
   - Configure environment variables
   - Test webhook endpoints
`;