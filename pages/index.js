import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import RoomsSection from '../components/RoomsSection';
import AmenitiesSection from '../components/AmenitiesSection';
import ContactSection from '../components/ContactSection';
import ChatBot from '../components/ChatBot';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <HeroSection />
      <RoomsSection />
      <AmenitiesSection />
      <ContactSection />
      <Footer />
      <ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </main>
  );
}
