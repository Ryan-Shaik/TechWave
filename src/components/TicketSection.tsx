import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star, Clock, Users, Gift, ShoppingCart, Plus, Minus } from 'lucide-react';

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

const TicketSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string>('standard');
  const [quantity, setQuantity] = useState<number>(1);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const selectedTicketTier = ticketTiers.find(tier => tier.id === selectedTier);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handlePurchaseClick = () => {
    navigate(`/checkout?tier=${selectedTier}&quantity=${quantity}`);
  };

  return (
    <section id="tickets" className="py-20 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Secure Your <span className="gradient-text">Spot</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Choose the perfect ticket tier for your conference experience. Limited seats available!
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 text-red-400">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">Early Bird ends in 15 days</span>
            </div>
            <div className="w-1 h-1 bg-gray-500 rounded-full" />
            <div className="flex items-center space-x-2 text-yellow-400">
              <Gift className="w-4 h-4" />
              <span>Limited seats remaining</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {ticketTiers.map((tier) => (
            <motion.div
              key={tier.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className={`relative bg-slate-800/50 backdrop-blur-md rounded-xl p-8 border transition-all duration-300 cursor-pointer ${
                selectedTier === tier.id
                  ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                  : 'border-purple-500/20 hover:border-purple-500/40'
              } ${tier.popular ? 'ring-2 ring-purple-500/50' : ''}`}
              onClick={() => setSelectedTier(tier.id)}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Limited Badge */}
              {tier.limited && (
                <div className="absolute -top-4 right-4">
                  <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Limited Time
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${tier.color} mb-4`}>
                  {tier.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-gray-300 text-sm mb-6">{tier.description}</p>
                
                <div className="mb-6">
                  {tier.originalPrice && (
                    <div className="text-gray-400 line-through text-lg mb-1">
                      ${tier.originalPrice}
                    </div>
                  )}
                  <div className="text-4xl font-bold text-white">
                    ${tier.price}
                    <span className="text-lg text-gray-400 font-normal">/person</span>
                  </div>
                  {tier.originalPrice && (
                    <div className="text-green-400 text-sm font-semibold">
                      Save ${tier.originalPrice - tier.price}!
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                  selectedTier === tier.id
                    ? `bg-gradient-to-r ${tier.color} text-white shadow-lg`
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {selectedTier === tier.id ? 'Selected' : 'Select Ticket'}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Purchase Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-8 border border-purple-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Join TechWave 2025?</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Secure your spot at the premier tech conference. All tickets include access to sessions, 
              networking events, meals, and exclusive conference materials.
            </p>
            
            {/* Quantity Selector */}
            <div className="flex items-center justify-center mb-6">
              <div className="bg-slate-700/50 rounded-lg p-4 flex items-center space-x-4">
                <span className="text-white font-medium">Quantity:</span>
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="text-white font-bold text-xl w-8 text-center">{quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                <span className="text-gray-400 text-sm">(Max 10 tickets)</span>
              </div>
            </div>

                        
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePurchaseClick}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 pulse-glow flex items-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Purchase {quantity}x {selectedTicketTier?.name} - ${(selectedTicketTier?.price || 0) * quantity}
              </motion.button>
              
              <div className="text-sm text-gray-400">
                <div>🔒 Secure checkout with Stripe</div>
                <div>💳 All major credit cards accepted</div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Instant confirmation</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Mobile tickets available</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Full refund until Aug 15</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Group Discounts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-slate-800/50 backdrop-blur-md rounded-xl p-8 border border-purple-500/20"
        >
          <div className="text-center">
            <h4 className="text-xl font-bold text-white mb-4">Group Discounts Available</h4>
            <p className="text-gray-300 mb-6">
              Bring your team and save! Special pricing for groups of 5 or more attendees.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">5-9</div>
                <div className="text-sm text-gray-300">attendees</div>
                <div className="text-lg font-semibold text-white">10% off</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">10-19</div>
                <div className="text-sm text-gray-300">attendees</div>
                <div className="text-lg font-semibold text-white">15% off</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">20+</div>
                <div className="text-sm text-gray-300">attendees</div>
                <div className="text-lg font-semibold text-white">20% off</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 border-2 border-purple-500 text-purple-300 px-6 py-3 rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-200"
            >
              Contact for Group Pricing
            </motion.button>
          </div>
        </motion.div>
      </div>

          </section>
  );
};

export default TicketSection;

