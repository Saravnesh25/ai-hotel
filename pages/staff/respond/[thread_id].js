import Header from '/components/Header';
import Footer from '/components/Footer';

export default function Respond() {
  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #c7d2fe 100%)'}}>
      <Header />
      <div className="max-w-5xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Staff Response Page</h1>
        <p className="text-gray-700 mb-4">This page is under construction. Please check back later for updates.</p>
      </div>
      <Footer />
    </main>
  );
}