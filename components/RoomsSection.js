export default function RoomsSection() {
  return (
    <section id="rooms" className="max-w-5xl mx-auto px-8 py-12">
      <h2 className="text-3xl font-bold text-blue-800 mb-8">Our Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <img src="/room1.jpg" alt="Deluxe Room" className="w-full h-40 object-cover rounded-xl mb-4" onError={e => e.target.style.display='none'} />
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Deluxe Room</h3>
          <p className="text-gray-600 mb-2">King bed, city view, free Wi-Fi, breakfast included.</p>
          <span className="text-blue-600 font-bold">$120/night</span>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <img src="/room2.jpg" alt="Suite" className="w-full h-40 object-cover rounded-xl mb-4" onError={e => e.target.style.display='none'} />
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Suite</h3>
          <p className="text-gray-600 mb-2">Spacious suite, living area, luxury bath, free minibar.</p>
          <span className="text-blue-600 font-bold">$220/night</span>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <img src="/room3.jpg" alt="Family Room" className="w-full h-40 object-cover rounded-xl mb-4" onError={e => e.target.style.display='none'} />
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Family Room</h3>
          <p className="text-gray-600 mb-2">Two queen beds, kids amenities, garden view, breakfast.</p>
          <span className="text-blue-600 font-bold">$180/night</span>
        </div>
      </div>
    </section>
  );
}
