import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';

const DemoNotification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-4 left-4 right-4 z-50 max-w-4xl mx-auto"
      >
        <div className="bg-gradient-to-r from-blue-900/90 to-purple-900/90 backdrop-blur-md border border-blue-500/30 rounded-lg p-4 shadow-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">Demo Mode Active</h3>
              <p className="text-blue-100 text-sm">
                This is a demonstration of Stripe + Firebase integration. No real payments will be processed. 
                To set up for production, follow the instructions in <code className="bg-black/20 px-1 rounded">STRIPE_FIREBASE_SETUP.md</code>
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-blue-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DemoNotification;