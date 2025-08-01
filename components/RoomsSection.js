export default function RoomsSection({ rooms, onBookRoom }) {
  return (
    <section id="rooms" className="max-w-5xl mx-auto px-8 py-12">
      <h2 className="text-3xl font-bold text-blue-800 mb-8">Our Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
            <img src={room.img} alt={room.name} className="w-full h-40 object-cover rounded-xl mb-4" onError={e => e.target.style.display='none'} />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">{room.name}</h3>
            <p className="text-gray-600 mb-2">{room.type}</p>
            <span className="text-blue-600 font-bold mb-2">${room.price}/night</span>
            <span className="text-sm text-gray-500 mb-2">Available: {room.available}</span>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              disabled={room.available === 0}
              onClick={() => onBookRoom(room)}
            >
              {room.available === 0 ? 'Fully Booked' : 'Book Now'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
