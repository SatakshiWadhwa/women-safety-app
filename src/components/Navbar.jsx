import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-pink-700">
          SafeCampus
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium items-center">
          <li><Link to="/" className="hover:text-pink-600">Home</Link></li>
          {user ? (
            <>
              <li><Link to="/dashboard" className="hover:text-pink-600">Dashboard</Link></li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="hover:text-pink-600">Login</Link></li>
              <li><Link to="/signup" className="bg-pink-600 text-white px-4 py-1 rounded-lg hover:bg-pink-700 transition">Signup</Link></li>
            </>
          )}
        </ul>

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl font-bold text-pink-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          Menu
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col gap-4 mt-4 text-gray-700">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          {user ? (
            <>
              <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
              <li><button onClick={handleLogout} className="text-red-500">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
              <li><Link to="/signup" onClick={() => setMenuOpen(false)}>Signup</Link></li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
