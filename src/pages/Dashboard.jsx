import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import Icon from "../components/Icon";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { subscribe, subscribed, error } = useNotifications();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const features = [
    { label: "Night Walk Buddy", icon: "walk", path: "/buddy" },
    { label: "Safe Places", icon: "pin", path: "/safe-places" },
    { label: "AI Assistant", icon: "chat", path: "/ai-assistant" },
    { label: "Fake Call", icon: "phone", path: "/fake-call" },
    { label: "Self Defense", icon: "fist", path: "/self-defense" },
    { label: "My Profile", icon: "shield", path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-paper pb-10">

      {/* Header */}
      <div className="bg-ink px-4 py-6 mb-5">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-display text-xl text-white">
              Hi, {user?.name}
            </h1>
            <p className="text-white/50 text-xs mt-1">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20 transition text-sm"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">

        {/* Notification Banner */}
        {!subscribed && (
          <div className="bg-dusk/8 border border-dusk/20 rounded-2xl p-4 mb-4 flex justify-between items-center gap-3">
            <div className="flex-1">
              <p className="text-ink font-medium text-sm">Enable push notifications</p>
              <p className="text-slate text-xs mt-1">Get instant alerts for SOS and buddy requests</p>
              {error && <p className="text-beacon text-xs mt-1">{error}</p>}
            </div>
            <button
              onClick={subscribe}
              className="bg-dusk text-white px-4 py-2 rounded-full hover:bg-dusk-light transition text-sm whitespace-nowrap"
            >
              Enable
            </button>
          </div>
        )}

        {subscribed && (
          <div className="bg-signal/10 border border-signal/25 rounded-2xl p-3 mb-4">
            <p className="text-signal font-medium text-sm">Notifications enabled</p>
          </div>
        )}

        {/* SOS Quick Button */}
        <button
          onClick={() => navigate("/sos")}
          className="w-full bg-beacon rounded-2xl p-6 mb-5 text-center hover:bg-beacon-dark transition shadow-lg shadow-beacon/20 flex flex-col items-center"
        >
          <Icon name="siren" className="w-9 h-9 text-white mb-2" strokeWidth={1.7} />
          <p className="text-white text-xl font-display">SOS Emergency</p>
          <p className="text-white/80 text-sm mt-1">Tap for immediate help</p>
        </button>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-3">
          {features.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-2xl shadow-sm border border-slate/10 p-5 text-center hover:shadow-md hover:border-transparent transition active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-dusk/10 text-dusk flex items-center justify-center mx-auto mb-3">
                <Icon name={item.icon} className="w-5 h-5" />
              </div>
              <div className="font-semibold text-ink text-sm">{item.label}</div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
