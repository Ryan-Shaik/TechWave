// import React from 'react';
// import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import SpeakerLineup from './components/SpeakerLineup';
import AgendaPreview from './components/AgendaPreview';
import VenueMap from './components/VenueMap';
import TicketSection from './components/TicketSection';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import DemoNotification from './components/DemoNotification';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DemoNotification />
      <Navigation />
      <main>
        <HeroSection />
        <SpeakerLineup />
        <AgendaPreview />
        <VenueMap />
        <TicketSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;