export default function Header() {
  return (
    <header className="w-full bg-white shadow-md py-4 px-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src="/favicon.ico" alt="Hotel Logo" className="w-8 h-8 rounded" />
        <span className="text-xl font-bold text-blue-700">Azure Hotel</span>
      </div>
      <nav className="space-x-6 text-blue-700 font-medium">
        <a href="#rooms" className="hover:text-blue-500">Rooms</a>
        <a href="#amenities" className="hover:text-blue-500">Amenities</a>
        <a href="#contact" className="hover:text-blue-500">Contact</a>
      </nav>
    </header>
  );
}
