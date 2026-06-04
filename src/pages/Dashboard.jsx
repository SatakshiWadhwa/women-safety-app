import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { subscribe, subscribed, error } = useNotifications();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const features = [
    { label: "SOS Emergency", icon: "🆘", path: "/sos" },
    { label: "Night Walk Buddy", icon: "🚶", path: "/buddy" },
    { label: "Safe Places", icon: "📍", path: "/safe-places" },
    { label: "AI Assistant", icon: "🤖", path: "/ai-assistant" },
    { label: "Fake Call", icon: "📞", path: "/fake-call" },
    { label: "Self Defense", icon: "🥋", path: "/self-defense" },
    { label: "My Profile", icon: "👤", path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-pink-50 pb-10">

      {/* Header */}
      <div className="bg-white shadow-md px-4 py-4 mb-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-pink-700">
              Hi, {user?.name} 👋
            </h1>
            <p className="text-gray-400 text-xs mt-1">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">

        {/* Notification Banner */}
        {!subscribed && (
          <div className="bg-pink-100 border border-pink-300 rounded-2xl p-4 mb-4 flex justify-between items-center gap-3">
            <div className="flex-1">
              <p className="text-pink-700 font-medium text-sm">Enable Push Notifications</p>
              <p className="text-pink-600 text-xs mt-1">Get instant alerts for SOS and buddy requests</p>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <button
              onClick={subscribe}
              className="bg-pink-600 text-white px-3 py-2 rounded-lg hover:bg-pink-700 transition text-sm whitespace-nowrap"
            >
              Enable
            </button>
          </div>
        )}

        {subscribed && (
          <div className="bg-green-50 border border-green-300 rounded-2xl p-3 mb-4">
            <p className="text-green-700 font-medium text-sm">Notifications enabled!</p>
          </div>
        )}

        {/* SOS Quick Button */}
        <div
          onClick={() => navigate("/sos")}
          className="bg-red-600 rounded-2xl p-5 mb-4 text-center cursor-pointer hover:bg-red-700 transition shadow-lg"
        >
          <p className="text-white text-4xl mb-1">🆘</p>
          <p className="text-white text-xl font-bold">SOS Emergency</p>
          <p className="text-red-200 text-sm mt-1">Tap for immediate help</p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-3">
          {features.slice(1).map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-2xl shadow p-4 text-center hover:bg-pink-50 transition active:scale-95"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="font-semibold text-pink-700 text-sm">{item.label}</div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
