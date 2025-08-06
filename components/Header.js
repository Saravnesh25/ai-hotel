export default function Header() {
  return (
    <header className="w-full bg-white shadow-md py-4 px-8 flex items-center justify-between">
      <a href="/">
        <div className="flex items-center gap-2 text-blue-700 hover:text-blue-500">
          <img src="/hotel-logo.jpg" alt="Hotel Logo" className="w-8 h-8 rounded" />
          <span className="text-xl font-bold">Azure Hotel</span>
        </div>
      </a>
      <nav className="space-x-6 text-blue-700 font-medium">
        <a href="/#rooms" className="hover:text-blue-500">Rooms</a>
        <a href="/#amenities" className="hover:text-blue-500">Amenities</a>
        <a href="/#contact" className="hover:text-blue-500">Contact</a>
        <span className="mx-2 text-gray-300">|</span>
        <a href="/staff" className="text-gray-500 hover:text-gray-300">Staff</a>
      </nav>
    </header>
  );
}
