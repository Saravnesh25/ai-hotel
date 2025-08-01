import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import RoomsSection from '../components/RoomsSection';
const initialRooms = [
  { id: 1, name: 'Deluxe Room', type: 'King bed, city view', price: 120, available: 3, img: '/room1.jpg' },
  { id: 2, name: 'Suite', type: 'Luxury suite, living area', price: 220, available: 2, img: '/room2.jpg' },
  { id: 3, name: 'Family Room', type: 'Two queen beds, garden view', price: 180, available: 1, img: '/room3.jpg' },
];
import RoomBookingSection from '../components/RoomBookingSection';
import AmenitiesSection from '../components/AmenitiesSection';
import ContactSection from '../components/ContactSection';
import ChatBot from '../components/ChatBot';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [rooms, setRooms] = useState(initialRooms);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    breakfast: false,
    preference: '',
    additional: '',
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBook = (room) => {
    setSelectedRoom(room);
    setShowForm(true);
    setBookingSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRooms((rs) =>
      rs.map((r) =>
        r.id === selectedRoom.id ? { ...r, available: r.available - 1 } : r
      )
    );
    setShowForm(false);
    setBookingSuccess(true);
    setForm({ name: '', email: '', breakfast: false, preference: '', additional: '' });
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #c7d2fe 100%)'}}>
      <div className="decorative-wave">
        <svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: '100vw', height: '120px', display: 'block'}}>
          <path fill="#6366f1" fillOpacity="0.15" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
        </svg>
      </div>
      <Header />
      <HeroSection />
      <RoomsSection rooms={rooms} onBookRoom={handleBook} />
      <RoomBookingSection
        showForm={showForm}
        selectedRoom={selectedRoom}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        bookingSuccess={bookingSuccess}
        setShowForm={setShowForm}
        setBookingSuccess={setBookingSuccess}
      />
      <AmenitiesSection />
      <ContactSection />
      <Footer />
      <ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </main>
  );
}
