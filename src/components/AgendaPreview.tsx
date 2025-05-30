import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Download, Calendar } from 'lucide-react';

interface Session {
  id: number;
  time: string;
  title: string;
  speaker: string;
  type: 'keynote' | 'workshop' | 'panel' | 'break';
  duration: string;
  attendees?: number;
  description: string;
}

interface DaySchedule {
  date: string;
  day: string;
  sessions: Session[];
}

const AgendaPreview: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const schedule: DaySchedule[] = [
    {
      date: 'September 15',
      day: 'Day 1',
      sessions: [
        {
          id: 1,
          time: '09:00',
          title: 'Opening Keynote: The Future of Technology',
          speaker: 'Sarah Chen',
          type: 'keynote',
          duration: '60 min',
          attendees: 5000,
          description: 'Join us for an inspiring opening keynote exploring the technological trends that will shape the next decade.'
        },
        {
          id: 2,
          time: '10:30',
          title: 'Coffee Break & Networking',
          speaker: '',
          type: 'break',
          duration: '30 min',
          description: 'Connect with fellow attendees and speakers over coffee and refreshments.'
        },
        {
          id: 3,
          time: '11:00',
          title: 'AI in Software Development',
          speaker: 'Marcus Rodriguez',
          type: 'workshop',
          duration: '90 min',
          attendees: 200,
          description: 'Hands-on workshop exploring how AI is revolutionizing the software development lifecycle.'
        },
        {
          id: 4,
          time: '13:00',
          title: 'Lunch & Expo Hall',
          speaker: '',
          type: 'break',
          duration: '90 min',
          description: 'Enjoy lunch while exploring our expo hall featuring the latest tech innovations.'
        },
        {
          id: 5,
          time: '14:30',
          title: 'Panel: The Future of Work in Tech',
          speaker: 'Multiple Speakers',
          type: 'panel',
          duration: '75 min',
          attendees: 1000,
          description: 'Industry leaders discuss how remote work, AI, and automation are changing the tech workplace.'
        }
      ]
    },
    {
      date: 'September 16',
      day: 'Day 2',
      sessions: [
        {
          id: 6,
          time: '09:00',
          title: 'Quantum Computing Breakthrough',
          speaker: 'Dr. Aisha Patel',
          type: 'keynote',
          duration: '60 min',
          attendees: 5000,
          description: 'Discover the latest breakthroughs in quantum computing and their practical applications.'
        },
        {
          id: 7,
          time: '10:30',
          title: 'Networking Break',
          speaker: '',
          type: 'break',
          duration: '30 min',
          description: 'Continue building valuable connections with industry professionals.'
        },
        {
          id: 8,
          time: '11:00',
          title: 'Building Scalable Cloud Architecture',
          speaker: 'James Kim',
          type: 'workshop',
          duration: '90 min',
          attendees: 150,
          description: 'Learn best practices for designing and implementing scalable cloud solutions.'
        },
        {
          id: 9,
          time: '13:00',
          title: 'Lunch & Startup Showcase',
          speaker: '',
          type: 'break',
          duration: '90 min',
          description: 'Discover innovative startups while enjoying lunch in our showcase area.'
        },
        {
          id: 10,
          time: '14:30',
          title: 'Cybersecurity in the Modern Era',
          speaker: 'Elena Volkov',
          type: 'workshop',
          duration: '75 min',
          attendees: 300,
          description: 'Essential cybersecurity strategies for protecting modern applications and infrastructure.'
        }
      ]
    },
    {
      date: 'September 17',
      day: 'Day 3',
      sessions: [
        {
          id: 11,
          time: '09:00',
          title: 'Developer Tools Revolution',
          speaker: 'David Thompson',
          type: 'keynote',
          duration: '60 min',
          attendees: 5000,
          description: 'Explore the next generation of developer tools that will transform how we build software.'
        },
        {
          id: 12,
          time: '10:30',
          title: 'Final Networking Session',
          speaker: '',
          type: 'break',
          duration: '30 min',
          description: 'Last chance to connect and exchange contacts with fellow attendees.'
        },
        {
          id: 13,
          time: '11:00',
          title: 'Panel: Building the Next Unicorn',
          speaker: 'Startup Founders',
          type: 'panel',
          duration: '90 min',
          attendees: 800,
          description: 'Successful startup founders share insights on building and scaling tech companies.'
        },
        {
          id: 14,
          time: '13:00',
          title: 'Closing Lunch & Awards',
          speaker: '',
          type: 'break',
          duration: '90 min',
          description: 'Celebrate the conference with lunch and our innovation awards ceremony.'
        },
        {
          id: 15,
          time: '15:00',
          title: 'Closing Keynote: What\'s Next?',
          speaker: 'All Speakers',
          type: 'keynote',
          duration: '60 min',
          attendees: 5000,
          description: 'A collaborative closing session looking ahead to the future of technology and innovation.'
        }
      ]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Sessions' },
    { id: 'keynote', label: 'Keynotes' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'panel', label: 'Panels' },
  ];

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'keynote':
        return 'bg-purple-600/20 text-purple-300 border-purple-500/30';
      case 'workshop':
        return 'bg-blue-600/20 text-blue-300 border-blue-500/30';
      case 'panel':
        return 'bg-green-600/20 text-green-300 border-green-500/30';
      case 'break':
        return 'bg-gray-600/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-600/20 text-gray-300 border-gray-500/30';
    }
  };

  const filteredSessions = selectedCategory === 'all' 
    ? schedule[selectedDay].sessions 
    : schedule[selectedDay].sessions.filter(session => session.type === selectedCategory);

  return (
    <section id="agenda" className="py-20 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Conference <span className="gradient-text">Agenda</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Three days packed with keynotes, workshops, panels, and networking opportunities
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Download size={20} />
            <span>Download Full Agenda</span>
          </motion.button>
        </motion.div>

        {/* Day Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {schedule.map((day, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDay(index)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedDay === index
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar size={18} />
                <div>
                  <div className="text-sm">{day.day}</div>
                  <div className="text-xs opacity-75">{day.date}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* Sessions */}
        <motion.div
          key={`${selectedDay}-${selectedCategory}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <div className="flex items-center space-x-2 text-purple-400">
                      <Clock size={18} />
                      <span className="font-semibold">{session.time}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSessionTypeColor(session.type)}`}>
                      {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-400 text-sm">
                      <Clock size={14} />
                      <span>{session.duration}</span>
                    </div>
                    {session.attendees && (
                      <div className="flex items-center space-x-1 text-gray-400 text-sm">
                        <Users size={14} />
                        <span>{session.attendees.toLocaleString()} attendees</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">{session.title}</h3>
                  {session.speaker && (
                    <p className="text-purple-300 font-medium mb-2">{session.speaker}</p>
                  )}
                  <p className="text-gray-300 leading-relaxed">{session.description}</p>
                </div>
                
                {session.type !== 'break' && (
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Add to Calendar
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No sessions found for the selected category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AgendaPreview;