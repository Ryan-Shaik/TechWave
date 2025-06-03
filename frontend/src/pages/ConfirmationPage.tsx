import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Mail, Calendar, MapPin, ArrowLeft, Share2 } from 'lucide-react';
import { ticketService } from '../services/ticketService';
import type { TicketPurchase } from '../services/ticketService';

const ConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [purchase, setPurchase] = useState<TicketPurchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const purchaseId = searchParams.get('purchase_id');

  useEffect(() => {
    const loadPurchase = async () => {
      if (!purchaseId) {
        setError('No purchase ID provided');
        setLoading(false);
        return;
      }

      try {
        const purchaseData = await ticketService.getTicketPurchase(purchaseId);
        if (purchaseData) {
          setPurchase(purchaseData);
        } else {
          setError('Purchase not found');
        }
      } catch (err) {
        setError('Failed to load purchase details');
      } finally {
        setLoading(false);
      }
    };

    loadPurchase();
  }, [purchaseId]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    alert('Ticket download will be available closer to the event date.');
  };

  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: 'TechWave 2025 - I\'m attending!',
        text: 'Join me at TechWave 2025, the premier tech conference!',
        url: window.location.origin,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin);
      alert('Event link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-md rounded-xl p-8 text-center max-w-md border border-purple-500/20"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-white mb-2">Loading Confirmation</h3>
          <p className="text-gray-300">Retrieving your purchase details...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-md rounded-xl p-8 text-center max-w-md border border-purple-500/20"
        >
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-white mb-2">Error</h3>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={handleBackToHome}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/30 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={handleBackToHome}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">TechWave 2025</h1>
              <p className="text-gray-300">Purchase Confirmation</p>
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          <h2 className="text-4xl font-bold text-white mb-4">
            Payment Successful!
          </h2>
          <p className="text-xl text-gray-300 mb-2">
            Thank you for your purchase, {purchase.customerName}!
          </p>
          <p className="text-gray-400">
            Confirmation ID: <span className="font-mono text-purple-400">#{purchase.id}</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Purchase Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-md rounded-xl p-8 border border-purple-500/20"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Purchase Details</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-600">
                <span className="text-gray-300">Ticket Type</span>
                <span className="text-white font-semibold">{purchase.ticketTierName}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-slate-600">
                <span className="text-gray-300">Quantity</span>
                <span className="text-white font-semibold">{purchase.quantity}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-slate-600">
                <span className="text-gray-300">Price per Ticket</span>
                <span className="text-white font-semibold">${purchase.price}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-slate-600">
                <span className="text-gray-300">Payment Status</span>
                <span className={`font-semibold capitalize ${
                  purchase.paymentStatus === 'succeeded' ? 'text-green-400' : 
                  purchase.paymentStatus === 'pending' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {purchase.paymentStatus}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 pt-6">
                <span className="text-xl font-bold text-white">Total Amount</span>
                <span className="text-2xl font-bold text-purple-400">${purchase.totalAmount}</span>
              </div>
            </div>
          </motion.div>

          {/* Event Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-md rounded-xl p-8 border border-purple-500/20"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Event Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Calendar className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Date & Time</h4>
                  <p className="text-gray-300">September 15-17, 2025</p>
                  <p className="text-gray-400 text-sm">9:00 AM - 6:00 PM daily</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Venue</h4>
                  <p className="text-gray-300">San Francisco Convention Center</p>
                  <p className="text-gray-400 text-sm">747 Howard St, San Francisco, CA 94103</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Contact</h4>
                  <p className="text-gray-300">{purchase.customerEmail}</p>
                  <p className="text-gray-400 text-sm">Confirmation sent to this email</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={handleDownloadTicket}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Ticket
          </motion.button>
          
          <motion.button
            onClick={handleShareEvent}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-purple-500 text-purple-300 px-8 py-4 rounded-lg font-semibold hover:bg-purple-500 hover:text-white transition-all duration-200 flex items-center justify-center"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Event
          </motion.button>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-slate-800/30 rounded-xl p-8 border border-slate-600"
        >
          <h3 className="text-xl font-bold text-white mb-6">What's Next?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-2">Check Your Email</h4>
              <p className="text-gray-400 text-sm">
                You'll receive a confirmation email with all event details and your digital ticket.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-2">Save the Date</h4>
              <p className="text-gray-400 text-sm">
                Add TechWave 2025 to your calendar and start planning your conference experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-2">Get Ready</h4>
              <p className="text-gray-400 text-sm">
                Your mobile ticket will be available for download 2 weeks before the event.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConfirmationPage;