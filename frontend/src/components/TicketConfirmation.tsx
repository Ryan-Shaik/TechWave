import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Mail, Calendar, MapPin, Share2 } from 'lucide-react';
import { ticketService } from '../services/ticketService';
import type { TicketPurchase } from '../services/ticketService';

interface TicketConfirmationProps {
  purchaseId: string;
  onClose: () => void;
}

export const TicketConfirmation: React.FC<TicketConfirmationProps> = ({
  purchaseId,
  onClose,
}) => {
  const [purchase, setPurchase] = useState<TicketPurchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchase = async () => {
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

    fetchPurchase();
  }, [purchaseId]);

  const handleDownloadTicket = () => {
    // In a real application, this would generate and download a PDF ticket
    const ticketData = {
      confirmationId: purchase?.id,
      customerName: purchase?.customerName,
      ticketType: purchase?.ticketTierName,
      quantity: purchase?.quantity,
      eventDate: 'September 15-17, 2025',
      venue: 'San Francisco Convention Center',
    };

    const dataStr = JSON.stringify(ticketData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `techwave-2025-ticket-${purchase?.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShareTicket = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TechWave 2025 - I\'m attending!',
          text: `I just got my ticket for TechWave 2025! Join me at the premier tech conference.`,
          url: window.location.origin,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `I just got my ticket for TechWave 2025! Join me at the premier tech conference. ${window.location.origin}`
      );
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="bg-slate-800 rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading your ticket details...</p>
        </div>
      </motion.div>
    );
  }

  if (error || !purchase) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="bg-slate-800 rounded-xl p-8 text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={onClose}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-t-xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-green-100">Your TechWave 2025 ticket has been confirmed</p>
        </div>

        {/* Ticket Details */}
        <div className="p-8">
          <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Ticket Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Confirmation ID:</span>
                <p className="text-white font-mono">{purchase.id}</p>
              </div>
              <div>
                <span className="text-gray-400">Ticket Type:</span>
                <p className="text-white">{purchase.ticketTierName}</p>
              </div>
              <div>
                <span className="text-gray-400">Quantity:</span>
                <p className="text-white">{purchase.quantity} ticket{purchase.quantity > 1 ? 's' : ''}</p>
              </div>
              <div>
                <span className="text-gray-400">Total Paid:</span>
                <p className="text-white font-bold">${purchase.totalAmount}</p>
              </div>
              <div>
                <span className="text-gray-400">Customer:</span>
                <p className="text-white">{purchase.customerName}</p>
              </div>
              <div>
                <span className="text-gray-400">Email:</span>
                <p className="text-white">{purchase.customerEmail}</p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Event Information</h2>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Calendar className="w-5 h-5 mr-3 text-purple-400" />
                <span>September 15-17, 2025</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 mr-3 text-purple-400" />
                <span>San Francisco Convention Center, CA</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-5 h-5 mr-3 text-purple-400" />
                <span>Confirmation email sent to {purchase.customerEmail}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-6 mb-6 border border-purple-500/20">
            <h2 className="text-xl font-bold text-white mb-4">What's Next?</h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>You'll receive a confirmation email with your ticket details</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>Digital tickets will be available 2 weeks before the event</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>Event updates and agenda will be sent via email</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>Join our community Discord for networking opportunities</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              onClick={handleDownloadTicket}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Ticket
            </motion.button>
            
            <motion.button
              onClick={handleShareTicket}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-slate-700 text-white py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </motion.button>
            
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 border-2 border-gray-600 text-gray-300 py-3 px-6 rounded-lg hover:bg-gray-600 hover:text-white transition-all"
            >
              Close
            </motion.button>
          </div>

          {/* Support Info */}
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Need help? Contact us at support@techwave2025.com</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TicketConfirmation;