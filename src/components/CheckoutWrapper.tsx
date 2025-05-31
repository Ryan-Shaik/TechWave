import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { stripePromise, STRIPE_CONFIG } from '../config/stripe';
import { ticketService } from '../services/ticketService';
import type { TicketPurchase } from '../services/ticketService';
import type { PaymentIntent } from '../services/ticketService';
import CheckoutForm from './CheckoutForm';

interface CheckoutWrapperProps {
  ticketTier: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
  onSuccess: (purchaseId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

const CheckoutWrapper: React.FC<CheckoutWrapperProps> = ({
  ticketTier,
  quantity,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [purchaseId, setPurchaseId] = useState<string>('');
  
  const totalAmount = ticketTier.price * quantity;

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setIsInitializing(true);
        
        // Create payment intent
        const intent = await ticketService.createPaymentIntent(totalAmount);
        setPaymentIntent(intent);
        
        // Create initial purchase record
        const purchaseData: Omit<TicketPurchase, 'id' | 'purchaseDate'> = {
          ticketTierId: ticketTier.id,
          ticketTierName: ticketTier.name,
          price: ticketTier.price,
          quantity,
          totalAmount,
          customerEmail: '',
          customerName: '',
          customerPhone: '',
          paymentIntentId: intent.id,
          paymentStatus: 'pending',
        };

        const id = await ticketService.saveTicketPurchase(purchaseData);
        setPurchaseId(id);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment';
        onError(errorMessage);
      } finally {
        setIsInitializing(false);
      }
    };

    initializePayment();
  }, [ticketTier, quantity, totalAmount, onError]);

  if (isInitializing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="bg-slate-800 rounded-xl p-8 text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-white mb-2">Preparing Checkout</h3>
          <p className="text-gray-300">Setting up secure payment processing...</p>
        </div>
      </motion.div>
    );
  }

  if (!paymentIntent) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="bg-slate-800 rounded-xl p-8 text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-white mb-2">Payment Setup Failed</h3>
          <p className="text-gray-300 mb-6">Unable to initialize payment processing.</p>
          <button
            onClick={onCancel}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    );
  }

  const elementsOptions = {
    ...STRIPE_CONFIG,
    clientSecret: paymentIntent.client_secret,
  };

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <CheckoutForm
          ticketTier={ticketTier}
          quantity={quantity}
          paymentIntent={paymentIntent}
          purchaseId={purchaseId}
          onSuccess={onSuccess}
          onError={onError}
          onCancel={onCancel}
        />
      </div>
    </Elements>
  );
};

export default CheckoutWrapper;