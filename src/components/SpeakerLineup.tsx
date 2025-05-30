import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Twitter, Linkedin } from 'lucide-react';

interface Speaker {
  id: number;
  name: string;
  role: string;
  company: string;
  topic: string;
  bio: string;
  image: string;
  social: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

const SpeakerLineup: React.FC = () => {
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  const speakers: Speaker[] = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'CTO',
      company: 'TechCorp',
      topic: 'The Future of AI in Software Development',
      bio: 'Sarah is a renowned AI researcher and CTO at TechCorp, leading breakthrough innovations in machine learning and software automation.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      social: {
        twitter: 'https://twitter.com/sarahchen',
        linkedin: 'https://linkedin.com/in/sarahchen',
        website: 'https://sarahchen.dev'
      }
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'Founder & CEO',
      company: 'CloudScale',
      topic: 'Building Scalable Cloud Architecture',
      bio: 'Marcus founded CloudScale and has helped hundreds of companies scale their infrastructure to handle millions of users.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      social: {
        twitter: 'https://twitter.com/marcusrod',
        linkedin: 'https://linkedin.com/in/marcusrodriguez'
      }
    },
    {
      id: 3,
      name: 'Dr. Aisha Patel',
      role: 'Head of Research',
      company: 'Quantum Labs',
      topic: 'Quantum Computing: From Theory to Practice',
      bio: 'Dr. Patel leads quantum computing research at Quantum Labs and has published over 50 papers on quantum algorithms.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
      social: {
        linkedin: 'https://linkedin.com/in/aishapatel',
        website: 'https://quantumlabs.com/aisha'
      }
    },
    {
      id: 4,
      name: 'James Kim',
      role: 'VP of Engineering',
      company: 'DataFlow',
      topic: 'Real-time Data Processing at Scale',
      bio: 'James oversees engineering at DataFlow, processing petabytes of data daily for Fortune 500 companies.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      social: {
        twitter: 'https://twitter.com/jameskim',
        linkedin: 'https://linkedin.com/in/jameskim'
      }
    },
    {
      id: 5,
      name: 'Elena Volkov',
      role: 'Security Architect',
      company: 'CyberShield',
      topic: 'Zero Trust Security in Modern Applications',
      bio: 'Elena is a cybersecurity expert specializing in zero trust architectures and has secured systems for major tech companies.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      social: {
        twitter: 'https://twitter.com/elenavolkov',
        linkedin: 'https://linkedin.com/in/elenavolkov',
        website: 'https://cybershield.com/elena'
      }
    },
    {
      id: 6,
      name: 'David Thompson',
      role: 'Principal Engineer',
      company: 'DevTools Inc',
      topic: 'Developer Experience: Tools for Tomorrow',
      bio: 'David creates developer tools used by millions of developers worldwide and is passionate about improving developer productivity.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      social: {
        twitter: 'https://twitter.com/davidthompson',
        linkedin: 'https://linkedin.com/in/davidthompson'
      }
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
    <section id="speakers" className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            World-Class <span className="gradient-text">Speakers</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Learn from industry leaders, innovators, and visionaries who are shaping the future of technology
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {speakers.map((speaker) => (
            <motion.div
              key={speaker.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 cursor-pointer group"
              onClick={() => setSelectedSpeaker(speaker)}
            >
              <div className="relative mb-4">
                <img
                  src={speaker.image}
                  alt={`${speaker.name} - ${speaker.role} at ${speaker.company}`}
                  className="w-24 h-24 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent rounded-full" />
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-1">{speaker.name}</h3>
                <p className="text-purple-400 font-medium">{speaker.role}</p>
                <p className="text-gray-400 text-sm mb-3">{speaker.company}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{speaker.topic}</p>
              </div>

              <div className="flex justify-center space-x-3 mt-4">
                {speaker.social.twitter && (
                  <a
                    href={speaker.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Twitter size={16} />
                  </a>
                )}
                {speaker.social.linkedin && (
                  <a
                    href={speaker.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Linkedin size={16} />
                  </a>
                )}
                {speaker.social.website && (
                  <a
                    href={speaker.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Speaker Modal */}
        {selectedSpeaker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSpeaker(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start space-x-6">
                <img
                  src={selectedSpeaker.image}
                  alt={`${selectedSpeaker.name} - ${selectedSpeaker.role} at ${selectedSpeaker.company}`}
                  className="w-32 h-32 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedSpeaker.name}</h3>
                  <p className="text-purple-400 font-semibold text-lg">{selectedSpeaker.role}</p>
                  <p className="text-gray-400 mb-4">{selectedSpeaker.company}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-2">Session Topic</h4>
                    <p className="text-purple-300 font-medium">{selectedSpeaker.topic}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-2">Biography</h4>
                    <p className="text-gray-300 leading-relaxed">{selectedSpeaker.bio}</p>
                  </div>

                  <div className="flex space-x-4">
                    {selectedSpeaker.social.twitter && (
                      <a
                        href={selectedSpeaker.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Twitter size={20} />
                        <span>Twitter</span>
                      </a>
                    )}
                    {selectedSpeaker.social.linkedin && (
                      <a
                        href={selectedSpeaker.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-500 transition-colors"
                      >
                        <Linkedin size={20} />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {selectedSpeaker.social.website && (
                      <a
                        href={selectedSpeaker.social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <ExternalLink size={20} />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedSpeaker(null)}
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SpeakerLineup;