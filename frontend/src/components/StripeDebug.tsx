import React, { useState, useEffect } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';

const StripeDebug: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    setDebugInfo({
      stripeLoaded: !!stripe,
      elementsLoaded: !!elements,
      timestamp: new Date().toISOString(),
      stripeVersion: stripe ? 'Loaded' : 'Not loaded',
      elementsVersion: elements ? 'Loaded' : 'Not loaded',
    });
  }, [stripe, elements]);

  return (
    <div className="bg-slate-700/30 rounded-lg p-4 mb-4 border border-slate-600">
      <h4 className="text-sm font-semibold text-white mb-2">🔧 Debug Info</h4>
      <div className="text-xs text-gray-300 space-y-1">
        <div>Stripe: <span className={stripe ? 'text-green-400' : 'text-red-400'}>{debugInfo.stripeLoaded ? '✅ Loaded' : '❌ Not loaded'}</span></div>
        <div>Elements: <span className={elements ? 'text-green-400' : 'text-red-400'}>{debugInfo.elementsLoaded ? '✅ Loaded' : '��� Not loaded'}</span></div>
        <div>Timestamp: {debugInfo.timestamp}</div>
        <div>Environment: {import.meta.env.MODE}</div>
        <div>Stripe Key: {import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? '✅ Present' : '❌ Missing'}</div>
      </div>
    </div>
  );
};

export default StripeDebug;