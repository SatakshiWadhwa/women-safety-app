import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-ink/95 backdrop-blur sticky top-0 z-50 px-6 py-4 border-b border-white/5">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-display text-xl text-white">
          <span className="w-7 h-7 rounded-full bg-beacon flex items-center justify-center">
            <Icon name="shield" className="w-4 h-4 text-white" strokeWidth={2} />
          </span>
          SafeCampus
        </Link>

        <ul className="hidden md:flex gap-8 text-white/70 font-medium items-center text-sm">
          <li><Link to="/" className="hover:text-white transition">Home</Link></li>
          {user ? (
            <>
              <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              <li>
                <button onClick={handleLogout} className="bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20 transition">
                  Log out
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="hover:text-white transition">Log in</Link></li>
              <li><Link to="/signup" className="bg-beacon text-white px-5 py-2 rounded-full hover:bg-beacon-dark transition">Sign up</Link></li>
            </>
          )}
        </ul>

        <button
          className="md:hidden text-white w-9 h-9 flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <Icon name="close" className="w-6 h-6" strokeWidth={2} />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-6 h-6">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <ul className="md:hidden flex flex-col gap-1 mt-4 text-white/80 text-sm font-medium">
          <li><Link to="/" onClick={() => setMenuOpen(false)} className="block py-2.5">Home</Link></li>
          {user ? (
            <>
              <li><Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block py-2.5">Dashboard</Link></li>
              <li><button onClick={handleLogout} className="block py-2.5 text-beacon w-full text-left">Log out</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2.5">Log in</Link></li>
              <li><Link to="/signup" onClick={() => setMenuOpen(false)} className="block py-2.5 text-beacon font-semibold">Sign up</Link></li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
