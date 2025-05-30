import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const HeroSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Conference date: September 15, 2025
  const conferenceDate = new Date('2025-09-15T09:00:00').getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = conferenceDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [conferenceDate]);

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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(156, 146, 172, 0.1) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl float" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Main Headline */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              <span className="gradient-text">TechWave</span>{' '}
              <span className="text-white">2025</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Shaping the Future of Innovation
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Join the premier tech conference bringing together developers, startup founders, 
              and tech executives to explore cutting-edge innovations and shape tomorrow's technology.
            </p>
          </motion.div>

          {/* Event Details */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-8 text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span>September 15-17, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-400" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span>5000+ Attendees</span>
            </div>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Event Starts In</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map((item,) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.05 }}
                  className="bg-slate-800/50 backdrop-blur-md rounded-lg p-4 border border-purple-500/20"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="#tickets"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 pulse-glow"
            >
              Get Your Tickets
            </motion.a>
            <motion.a
              href="#speakers"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-purple-500 text-purple-300 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-500 hover:text-white transition-all duration-200"
            >
              View Speakers
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-16">
            {[
              { number: '50+', label: 'World-Class Speakers' },
              { number: '100+', label: 'Technical Sessions' },
              { number: '3', label: 'Days of Innovation' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text">
                  {stat.number}
                </div>
                <div className="text-gray-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-purple-400 rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;