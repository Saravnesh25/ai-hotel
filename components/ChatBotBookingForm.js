import { useState } from 'react';

export default function ChatBotBookingForm({ rooms, onSubmit }) {
  const [form, setForm] = useState({
    roomId: rooms[0]?.id || '',
    name: '',
    email: '',
    breakfast: false,
    preference: '',
    additional: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    onSubmit(form);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 p-4 rounded-xl text-center">
        <h4 className="text-green-700 font-bold mb-2">Booking Confirmed!</h4>
        <p className="text-gray-700">Thank you for booking with us. We look forward to your stay!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">Room</label>
        <select name="roomId" value={form.roomId} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-blue-200">
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>{room.name} (${room.price}/night, {room.available} left)</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">Your Name</label>
        <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-blue-200" />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-blue-200" />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">Room Preference</label>
        <select name="preference" value={form.preference} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-blue-200">
          <option value="">No preference</option>
          <option value="high floor">High Floor</option>
          <option value="low floor">Low Floor</option>
          <option value="near elevator">Near Elevator</option>
          <option value="quiet room">Quiet Room</option>
        </select>
      </div>
      <div className="flex items-center">
        <input name="breakfast" type="checkbox" checked={form.breakfast} onChange={handleChange} className="mr-2" />
        <label className="text-gray-700">Include Breakfast (+$20/night)</label>
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">Additional Requests</label>
        <textarea name="additional" value={form.additional} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-blue-200" rows={2} placeholder="e.g. Early check-in, baby crib, etc." />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition w-full">Book Room</button>
    </form>
  );
}
