import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-2xl font-bold text-pink-400 mb-3">SafeCampus</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            A complete women safety platform for college and hostel students in India.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-gray-400">
            <li><Link to="/" className="hover:text-pink-400 transition">Home</Link></li>
            <li><Link to="/dashboard" className="hover:text-pink-400 transition">Dashboard</Link></li>
            <li><Link to="/sos" className="hover:text-pink-400 transition">SOS Emergency</Link></li>
            <li><Link to="/safe-places" className="hover:text-pink-400 transition">Safe Places</Link></li>
            <li><Link to="/self-defense" className="hover:text-pink-400 transition">Self Defense</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Emergency</h3>
          <ul className="flex flex-col gap-2 text-gray-400">
            <li><a href="tel:112" className="hover:text-pink-400 transition">112 — National Emergency</a></li>
            <li><a href="tel:100" className="hover:text-pink-400 transition">100 — Police</a></li>
            <li><a href="tel:1091" className="hover:text-pink-400 transition">1091 — Women Helpline</a></li>
            <li><a href="tel:108" className="hover:text-pink-400 transition">108 — Ambulance</a></li>
          </ul>
        </div>

      </div>

      <div className="max-w-4xl mx-auto mt-8 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
        SafeCampus — Built for Women Safety
      </div>
    </footer>
  );
}

export default Footer;
