export default function ContactSection() {
  return (
    <section id="contact" className="max-w-5xl mx-auto px-8 py-12">
      <h2 className="text-3xl font-bold text-blue-800 mb-8">Contact Us</h2>
      <div className="bg-white rounded-2xl shadow p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Address</h3>
          <p className="text-gray-600 mb-4">123 Azure Hotel, Johor Bahru, 80000, Johor, Malaysia</p>
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Phone</h3>
          <p className="text-gray-600 mb-4">+60 7 555 6666</p>
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Email</h3>
          <p className="text-gray-600">info@azurehotel.com</p>
        </div>
        <form className="flex-1 flex flex-col gap-4">
          <input type="text" placeholder="Your Name" className="px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input type="email" placeholder="Your Email" className="px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <textarea placeholder="Your Message" className="px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400" rows={4}></textarea>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Send Message</button>
        </form>
      </div>
    </section>
  );
}
