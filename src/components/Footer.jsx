import { Link } from "react-router-dom";
import Icon from "./Icon";

function Footer() {
  return (
    <footer className="bg-ink text-white pt-16 pb-8 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

        <div>
          <p className="font-display text-xl mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-beacon flex items-center justify-center text-xs">???</span>
            SafeCampus
          </p>
          <p className="text-white/50 text-sm leading-relaxed">
            A safety companion built for college and hostel students across India.
          </p>
        </div>

        <div>
          <p className="text-white/40 text-xs font-semibold tracking-wide uppercase mb-4">Quick links</p>
          <ul className="flex flex-col gap-2.5 text-white/70 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
            <li><Link to="/sos" className="hover:text-white transition">SOS Emergency</Link></li>
            <li><Link to="/safe-places" className="hover:text-white transition">Safe Places</Link></li>
            <li><Link to="/self-defense" className="hover:text-white transition">Self Defense</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-white/40 text-xs font-semibold tracking-wide uppercase mb-4">In an emergency</p>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li><a href="tel:112" className="text-beacon hover:text-beacon-dark transition font-medium">112 — National Emergency</a></li>
            <li><a href="tel:100" className="text-white/70 hover:text-white transition">100 — Police</a></li>
            <li><a href="tel:1091" className="text-white/70 hover:text-white transition">1091 — Women Helpline</a></li>
            <li><a href="tel:108" className="text-white/70 hover:text-white transition">108 — Ambulance</a></li>
          </ul>
        </div>

      </div>

      <div className="max-w-5xl mx-auto pt-6 border-t border-white/10 text-center text-white/30 text-xs">
        SafeCampus — built for women`s safety
      </div>
    </footer>
  );
}

export default Footer;
