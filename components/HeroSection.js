export default function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-gradient-to-r from-blue-100 to-blue-300 rounded-3xl shadow-lg mt-8 mb-8 mx-auto max-w-5xl">
      <div className="flex-1 mb-8 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">Welcome to Azure Hotel</h1>
        <p className="text-lg text-blue-900 mb-6">Experience luxury, comfort, and world-class service in the heart of the city. Book your stay with us and enjoy exclusive amenities and personalized hospitality.</p>
        <a href="#rooms" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition">Book Now</a>
      </div>
      <img src="/hotel-hero.jpg" alt="Hotel Lobby" className="w-full md:w-96 rounded-2xl shadow-xl object-cover" style={{maxHeight:'320px'}} onError={e => e.target.style.display='none'} />
    </section>
  );
}
