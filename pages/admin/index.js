import { useEffect, useState } from 'react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoreLoading, setRestoreLoading] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
    fetchRooms();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/bookings');
      const data = await res.json();
      setBookings(data);
    } catch {
      setError('Failed to fetch bookings');
    }
    setLoading(false);
  }

  async function fetchRooms() {
    try {
      const res = await fetch('http://localhost:8000/rooms');
      const data = await res.json();
      setRooms(data);
    } catch {
      setError('Failed to fetch rooms');
    }
  }

  async function handleRestore(roomId) {
    setRestoreLoading(roomId);
    try {
      const res = await fetch(`http://localhost:8000/rooms/${roomId}/restore`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Restore failed');
      await fetchRooms();
    } catch {
      setError('Failed to restore room');
    }
    setRestoreLoading(null);
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">Admin: Bookings & Room Management</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
      <h2 className="text-xl font-semibold mb-2">Bookings</h2>
      {loading ? (
        <div>Loading...</div>
      ) : bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <table className="w-full mb-8 border text-sm">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Room</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Breakfast</th>
              <th className="p-2 border">Preference</th>
              <th className="p-2 border">Additional</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td className="p-2 border">{b.name}</td>
                <td className="p-2 border">{b.email}</td>
                <td className="p-2 border">{b.roomName}</td>
                <td className="p-2 border">{new Date(b.createdAt).toLocaleString()}</td>
                <td className="p-2 border">{b.breakfast ? 'Yes' : 'No'}</td>
                <td className="p-2 border">{b.preference}</td>
                <td className="p-2 border">{b.additional}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h2 className="text-xl font-semibold mb-2">Rooms</h2>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2 border">Room</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Available</th>
            <th className="p-2 border">Restore</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(r => (
            <tr key={r.id}>
              <td className="p-2 border">{r.name}</td>
              <td className="p-2 border">{r.type}</td>
              <td className="p-2 border">{r.available}</td>
              <td className="p-2 border">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                  onClick={() => handleRestore(r.id)}
                  disabled={restoreLoading === r.id}
                >
                  {restoreLoading === r.id ? 'Restoring...' : 'Add Back'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
