export default function AmenitiesSection() {
  return (
    <section id="amenities" className="max-w-5xl mx-auto px-8 py-12">
      <h2 className="text-3xl font-bold text-blue-800 mb-8">Amenities</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-blue-50 rounded-2xl shadow p-6 flex flex-col items-center">
          <span className="text-4xl mb-2">🏊‍♂️</span>
          <h3 className="text-lg font-semibold text-blue-700 mb-1">Swimming Pool</h3>
          <p className="text-gray-600 text-center">Outdoor pool with city view, open 6am-10pm.</p>
        </div>
        <div className="bg-blue-50 rounded-2xl shadow p-6 flex flex-col items-center">
          <span className="text-4xl mb-2">🍽️</span>
          <h3 className="text-lg font-semibold text-blue-700 mb-1">Restaurant & Bar</h3>
          <p className="text-gray-600 text-center">Fine dining, international cuisine, rooftop bar.</p>
        </div>
        <div className="bg-blue-50 rounded-2xl shadow p-6 flex flex-col items-center">
          <span className="text-4xl mb-2">💻</span>
          <h3 className="text-lg font-semibold text-blue-700 mb-1">Business Center</h3>
          <p className="text-gray-600 text-center">Meeting rooms, high-speed Wi-Fi, printing services.</p>
        </div>
      </div>
    </section>
  );
}
