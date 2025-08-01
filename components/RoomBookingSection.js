
export default function RoomBookingSection({ showForm, selectedRoom, form, onChange, onSubmit, bookingSuccess, setShowForm, setBookingSuccess }) {
  return (
    <section id="booking">
      {showForm && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button type="button" onClick={() => setShowForm(false)} className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-blue-600">×</button>
            <h3 className="text-2xl font-bold text-blue-700 mb-4">Book {selectedRoom.name}</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Your Name</label>
              <input name="name" value={form.name} onChange={onChange} required className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={onChange} required className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Room Preference</label>
              <select name="preference" value={form.preference} onChange={onChange} className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">No preference</option>
                <option value="high floor">High Floor</option>
                <option value="low floor">Low Floor</option>
                <option value="near elevator">Near Elevator</option>
                <option value="quiet room">Quiet Room</option>
              </select>
            </div>
            <div className="mb-4 flex items-center">
              <input name="breakfast" type="checkbox" checked={form.breakfast} onChange={onChange} className="mr-2" />
              <label className="text-gray-700">Include Breakfast (+$20/night)</label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Additional Requests</label>
              <textarea name="additional" value={form.additional} onChange={onChange} className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" rows={2} placeholder="e.g. Early check-in, baby crib, etc." />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition w-full">Confirm Booking</button>
          </form>
        </div>
      )}
      {bookingSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
            <h3 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h3>
            <p className="mb-4">Thank you for booking with us. We look forward to your stay at Azure Grand Hotel.</p>
            <button onClick={() => setBookingSuccess(false)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Close</button>
          </div>
        </div>
      )}
    </section>
  );
}
