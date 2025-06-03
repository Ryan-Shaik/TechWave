import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Car, Hotel, Coffee, Utensils, Plane, Train } from 'lucide-react';

const VenueMap: React.FC = () => {
  const amenities = [
    {
      icon: Car,
      title: 'Parking',
      description: 'Multiple parking garages within 2 blocks',
      details: ['Moscone Garage - $25/day', 'Fifth & Mission Garage - $20/day', 'Valet parking available']
    },
    {
      icon: Hotel,
      title: 'Hotels',
      description: 'Premium accommodations nearby',
      details: ['Marriott Marquis - 0.2 miles', 'W San Francisco - 0.3 miles', 'Hotel Zephyr - 1.2 miles']
    },
    {
      icon: Coffee,
      title: 'Coffee & Cafes',
      description: 'Fuel up before sessions',
      details: ['Blue Bottle Coffee - 0.1 miles', 'Philz Coffee - 0.2 miles', 'Starbucks - 0.1 miles']
    },
    {
      icon: Utensils,
      title: 'Dining',
      description: 'World-class restaurants',
      details: ['The French Laundry - 0.3 miles', 'Chinatown - 0.5 miles', 'Ferry Building - 0.8 miles']
    },
    {
      icon: Plane,
      title: 'Airport',
      description: 'Easy access from SFO',
      details: ['SFO Airport - 30 min by BART', 'Oakland Airport - 45 min by car', 'San Jose Airport - 1 hour by car']
    },
    {
      icon: Train,
      title: 'Public Transit',
      description: 'Excellent connectivity',
      details: ['Powell St BART - 0.2 miles', 'Montgomery St BART - 0.3 miles', 'Multiple Muni lines']
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
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

  return (
    <section id="venue" className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Venue & <span className="gradient-text">Location</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join us at the iconic San Francisco Convention Center in the heart of downtown San Francisco
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Venue Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-8 border border-purple-500/20">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-purple-600/20 p-3 rounded-lg">
                  <MapPin className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">San Francisco Convention Center</h3>
                  <p className="text-gray-300 mb-4">
                    747 Howard Street<br />
                    San Francisco, CA 94103<br />
                    United States
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Get Directions
                  </motion.button>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Venue Highlights</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• 2.1 million square feet of event space</li>
                  <li>• State-of-the-art audio/visual equipment</li>
                  <li>• High-speed WiFi throughout the venue</li>
                  <li>• Accessible facilities and services</li>
                  <li>• Climate-controlled environment</li>
                  <li>• On-site catering and dining options</li>
                </ul>
              </div>
            </div>

            {/* Interactive Map Placeholder */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-8 border border-purple-500/20">
              <h4 className="text-lg font-semibold text-white mb-4">Interactive Map</h4>
              <div className="relative bg-slate-700 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-4">Interactive Google Maps integration</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    View Full Map
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Amenities */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Nearby Amenities</h3>
            
            {amenities.map((amenity, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all group"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-600/20 p-3 rounded-lg group-hover:bg-purple-600/30 transition-colors">
                    <amenity.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">{amenity.title}</h4>
                    <p className="text-gray-300 mb-3">{amenity.description}</p>
                    <ul className="space-y-1">
                      {amenity.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-sm text-gray-400">
                          • {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Transportation Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-8 border border-purple-500/20"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Getting There</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-600/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Plane className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">By Air</h4>
              <p className="text-gray-300 text-sm">
                Fly into SFO, Oakland, or San Jose airports. 
                BART provides direct access from SFO to downtown.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Train className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">By Train</h4>
              <p className="text-gray-300 text-sm">
                BART and Muni provide excellent public transit. 
                Powell St and Montgomery stations are nearby.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Car className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">By Car</h4>
              <p className="text-gray-300 text-sm">
                Multiple parking options available. 
                Valet service and nearby garages for convenience.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VenueMap;