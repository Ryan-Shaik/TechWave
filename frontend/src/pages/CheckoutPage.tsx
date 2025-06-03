import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Star, Clock, Users } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise, STRIPE_CONFIG } from '../config/stripe';
import { ticketService } from '../services/ticketService';
import type { TicketPurchase, PaymentIntent } from '../services/ticketService';
import CheckoutForm from '../components/CheckoutForm';
import FirebaseStatus from '../components/FirebaseStatus';

interface TicketTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  popular?: boolean;
  limited?: boolean;
  color: string;
  icon: React.ReactNode;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [isInitializing, setIsInitializing] = useState(true);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [purchaseId, setPurchaseId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const initializationRef = useRef(false);

  // Get parameters from URL
  const ticketTierId = searchParams.get('tier') || 'standard';
  const quantity = parseInt(searchParams.get('quantity') || '1');

  const ticketTiers: TicketTier[] = [
    {
      id: 'early-bird',
      name: 'Early Bird',
      price: 199,
      originalPrice: 299,
      description: 'Perfect for individual developers and tech enthusiasts',
      features: [
        'Access to all sessions and keynotes',
        'Conference materials and swag bag',
        'Networking breaks and lunch',
        'Access to expo hall',
        'Digital agenda and session recordings',
        'Certificate of attendance'
      ],
      limited: true,
      color: 'from-green-600 to-emerald-600',
      icon: <Clock className="w-6 h-6" />
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 299,
      description: 'Great value for professionals looking to expand their knowledge',
      features: [
        'Everything in Early Bird',
        'Priority seating in sessions',
        'Access to speaker meet & greets',
        'Exclusive networking events',
        'Premium conference materials',
        'One-on-one mentorship session'
      ],
      popular: true,
      color: 'from-purple-600 to-blue-600',
      icon: <Users className="w-6 h-6" />
    },
    {
      id: 'vip',
      name: 'VIP Experience',
      price: 599,
      description: 'Ultimate conference experience for executives and team leads',
      features: [
        'Everything in Standard',
        'VIP lounge access',
        'Private dinner with speakers',
        'Front-row seating at all events',
        'Exclusive workshop sessions',
        'Personal conference concierge',
        'Premium gift package',
        'Post-conference video library access'
      ],
      color: 'from-yellow-600 to-orange-600',
      icon: <Star className="w-6 h-6" />
    }
  ];

  const selectedTicketTier = ticketTiers.find(tier => tier.id === ticketTierId) || ticketTiers[1];
  const totalAmount = selectedTicketTier.price * quantity;

  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current) return;

    const initializePayment = async () => {
      try {
        console.log('Initializing payment for:', { ticketTierId, quantity, totalAmount });
        initializationRef.current = true;
        setIsInitializing(true);
        setError('');
        
        // Create payment intent
        const intent = await ticketService.createPaymentIntent(totalAmount);
        console.log('Payment intent created:', intent.id);
        setPaymentIntent(intent);
        
        // Create initial purchase record
        const purchaseData: Omit<TicketPurchase, 'id' | 'purchaseDate'> = {
          ticketTierId: selectedTicketTier.id,
          ticketTierName: selectedTicketTier.name,
          price: selectedTicketTier.price,
          quantity,
          totalAmount,
          customerEmail: '',
          customerName: '',
          customerPhone: '',
          paymentIntentId: intent.id,
          paymentStatus: 'pending',
        };

        const id = await ticketService.saveTicketPurchase(purchaseData);
        console.log('Purchase record created:', id);
        setPurchaseId(id);
        
      } catch (error) {
        console.error('Payment initialization failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment';
        setError(errorMessage);
        initializationRef.current = false; // Allow retry on error
      } finally {
        setIsInitializing(false);
      }
    };

    initializePayment();
  }, []); // Empty dependency array - run only once on mount

  const handleSuccess = (purchaseId: string) => {
    navigate(`/confirmation?purchase_id=${purchaseId}`);
  };

  const handleError = (error: string) => {
    setError(error);
  };

  const handleBack = () => {
    navigate('/#tickets');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-md rounded-xl p-8 text-center max-w-md border border-purple-500/20"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-white mb-2">Preparing Checkout</h3>
          <p className="text-gray-300">Setting up secure payment processing...</p>
        </motion.div>
      </div>
    );
  }

  if (error && !paymentIntent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-md rounded-xl p-8 text-center max-w-md border border-purple-500/20"
        >
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-white mb-2">Payment Setup Failed</h3>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  if (!paymentIntent) {
    return null;
  }

  const elementsOptions = {
    ...STRIPE_CONFIG,
    clientSecret: paymentIntent.client_secret,
    // Disable payment request button (Apple Pay/Google Pay) for development
    paymentMethodCreation: 'manual' as const,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <FirebaseStatus />
      
      {/* Header */}
      <div className="bg-slate-800/30 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={handleBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Tickets</span>
            </motion.button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">TechWave 2025</h1>
              <p className="text-gray-300">Secure Checkout</p>
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Demo Notice */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-blue-900/20 border border-blue-500/20 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">ℹ</span>
              </div>
              <div>
                <h4 className="text-blue-300 font-semibold">Demo Mode</h4>
                <p className="text-blue-200 text-sm">
                  This is a demonstration checkout. No real payments will be processed. Use test card: 4242 4242 4242 4242
                </p>
              </div>
            </div>
            <button
              onClick={async () => {
                const result = await ticketService.testFirebaseConnection();
                alert(`Firebase Test:\nConnected: ${result.isConnected}\nCan Write: ${result.canWrite}\nLatency: ${result.latency}ms\n${result.error || 'All good!'}`);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Test Firebase
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Order Summary</h2>
              
              {/* Selected Ticket */}
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r ${selectedTicketTier.color} flex items-center justify-center`}>
                    {selectedTicketTier.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-bold text-white">{selectedTicketTier.name}</h3>
                      {selectedTicketTier.popular && (
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Most Popular
                        </span>
                      )}
                      {selectedTicketTier.limited && (
                        <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Limited Time
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4">{selectedTicketTier.description}</p>
                    
                    <div className="space-y-2">
                      {selectedTicketTier.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                      {selectedTicketTier.features.length > 4 && (
                        <div className="text-gray-400 text-sm">
                          +{selectedTicketTier.features.length - 4} more features
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Pricing Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>{selectedTicketTier.name} Ticket</span>
                  <span>${selectedTicketTier.price}</span>
                </div>
                
                <div className="flex justify-between text-gray-300">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>
                
                {selectedTicketTier.originalPrice && (
                  <div className="flex justify-between text-green-400">
                    <span>Early Bird Discount</span>
                    <span>-${(selectedTicketTier.originalPrice - selectedTicketTier.price) * quantity}</span>
                  </div>
                )}
                
                <div className="border-t border-slate-600 pt-3">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span>${totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-600">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white">Secure Payment</h4>
              </div>
              
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• SSL encrypted payment processing</li>
                <li>• PCI DSS compliant security standards</li>
                <li>• Instant email confirmation</li>
                <li>• Full refund available until Aug 15</li>
              </ul>
            </div>
          </motion.div>

          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Elements stripe={stripePromise} options={elementsOptions}>
              <CheckoutForm
                ticketTier={selectedTicketTier}
                quantity={quantity}
                paymentIntent={paymentIntent}
                purchaseId={purchaseId}
                onSuccess={handleSuccess}
                onError={handleError}
                onCancel={handleBack}
              />
            </Elements>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;