import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Mail, User,  } from 'lucide-react';
import { ticketService } from '../services/ticketService';
import type { PaymentIntent } from '../services/ticketService';

interface CheckoutFormProps {
  ticketTier: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
  paymentIntent: PaymentIntent;
  purchaseId: string;
  onSuccess: (purchaseId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  ticketTier,
  quantity,
  paymentIntent,
  purchaseId,
  onSuccess,
  onError,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const totalAmount = ticketTier.price * quantity;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      // Validate customer information
      if (!customerInfo.name || !customerInfo.email) {
        throw new Error('Please fill in all required fields');
      }

      // Update purchase record with customer information
      await ticketService.updatePurchaseCustomerInfo(purchaseId, {
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
      });

      // Confirm payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/ticket-confirmation?purchase_id=${purchaseId}`,
          receipt_email: customerInfo.email,
        },
        redirect: 'if_required',
      });

      if (error) {
        // Update payment status to failed
        await ticketService.updatePaymentStatus(purchaseId, 'failed');
        throw new Error(error.message || 'Payment failed');
      } else {
        // Payment succeeded
        await ticketService.updatePaymentStatus(purchaseId, 'succeeded');
        onSuccess(purchaseId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof customerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-md rounded-xl p-8 border border-purple-500/20"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Payment Details</h2>
        <p className="text-gray-300">
          Complete your purchase securely below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <User className="w-5 h-5 mr-2" />
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={customerInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={customerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Billing Address */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Billing Address
          </h3>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country
                </label>
                <select className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter ZIP/Postal code"
                />
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Note: For demo purposes, billing address collection is simplified. In production, use Stripe's AddressElement for complete address collection.
            </p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Information
          </h3>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <PaymentElement
              options={{
                layout: 'tabs',
                paymentMethodOrder: ['card'],
                // Disable payment request button (Apple Pay/Google Pay) for development
                wallets: {
                  applePay: 'never',
                  googlePay: 'never',
                },
              }}
            />
          </div>
        </div>

        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 px-6 border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-all duration-200"
          >
            Cancel
          </motion.button>
          
          <motion.button
            type="submit"
            disabled={!stripe || isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Pay ${totalAmount}
              </div>
            )}
          </motion.button>
        </div>

        {/* Security Notice */}
        <div className="text-center text-sm text-gray-400">
          <div className="flex items-center justify-center mb-2">
            <Lock className="w-4 h-4 mr-1" />
            <span>Secured by Stripe</span>
          </div>
          <p>Your payment information is encrypted and secure.</p>
        </div>
      </form>
    </motion.div>
  );
};

export default CheckoutForm;