import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  { icon: "🆘", title: "SOS Emergency", desc: "One tap emergency alert with live GPS location sharing", path: "/sos" },
  { icon: "🚶", title: "Night Walk Buddy", desc: "Find verified students to walk with you safely at night", path: "/buddy" },
  { icon: "🤖", title: "AI Safety Assistant", desc: "24x7 AI guidance for unsafe situations with secret mode", path: "/ai-assistant" },
  { icon: "📍", title: "Safe Places", desc: "Find nearby hospitals, police stations and pharmacies", path: "/safe-places" },
  { icon: "📞", title: "Fake Call", desc: "Schedule a fake call to escape uncomfortable situations", path: "/fake-call" },
  { icon: "🥋", title: "Self Defense", desc: "Learn techniques, legal rights and emergency numbers", path: "/self-defense" },
];

const STATS = [
  { number: "24/7", label: "AI Support" },
  { number: "1-tap", label: "SOS Alert" },
  { number: "3km", label: "Safe Places Radius" },
  { number: "100%", label: "Free to Use" },
];

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFeatureClick = (path) => {
    if (user) { navigate(path); } else { navigate("/login"); }
  };

  return (
    <div className="min-h-screen bg-white">

      <div className="bg-gradient-to-br from-pink-600 to-pink-400 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🛡️</div>
          <h1 className="text-5xl font-bold mb-4 leading-tight">Your Safety is Our Priority</h1>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            SafeCampus is a complete women safety platform designed for college and hostel students. Stay safe, stay connected, stay empowered.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {user ? (
              <button onClick={() => navigate("/dashboard")} className="bg-white text-pink-600 px-8 py-3 rounded-xl font-bold hover:bg-pink-50 transition text-lg shadow-lg">
                Go to Dashboard
              </button>
            ) : (
              <>
                <button onClick={() => navigate("/signup")} className="bg-white text-pink-600 px-8 py-3 rounded-xl font-bold hover:bg-pink-50 transition text-lg shadow-lg">
                  Get Started Free
                </button>
                <button onClick={() => navigate("/login")} className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-500 transition text-lg">
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-pink-50 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow p-6 text-center">
              <p className="text-3xl font-bold text-pink-600">{stat.number}</p>
              <p className="text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Everything You Need to Stay Safe</h2>
          <p className="text-center text-gray-500 mb-12">Click any feature to get started</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <button
                key={index}
                onClick={() => handleFeatureClick(feature.path)}
                className="bg-white border border-pink-100 rounded-2xl p-6 text-left hover:shadow-lg transition hover:border-pink-400 hover:bg-pink-50 cursor-pointer"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                <p className="text-pink-500 text-sm mt-3 font-medium">Tap to open</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-pink-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Create Account", desc: "Sign up with your college email and set up your profile with emergency contacts" },
              { step: "2", title: "Set Up Safety", desc: "Add emergency contacts, enable location and explore all safety features" },
              { step: "3", title: "Stay Protected", desc: "Use SOS, Night Walk Buddy, AI Assistant whenever you need help" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-pink-600 text-white text-2xl font-bold flex items-center justify-center mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-red-600 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white text-2xl font-bold text-center mb-6">Emergency Numbers India</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="tel:112" className="bg-red-500 rounded-xl p-4 text-center hover:bg-red-400 transition block">
              <p className="text-white text-2xl font-bold">112</p>
              <p className="text-red-100 text-sm">Emergency</p>
            </a>
            <a href="tel:100" className="bg-red-500 rounded-xl p-4 text-center hover:bg-red-400 transition block">
              <p className="text-white text-2xl font-bold">100</p>
              <p className="text-red-100 text-sm">Police</p>
            </a>
            <a href="tel:1091" className="bg-red-500 rounded-xl p-4 text-center hover:bg-red-400 transition block">
              <p className="text-white text-2xl font-bold">1091</p>
              <p className="text-red-100 text-sm">Women Helpline</p>
            </a>
            <a href="tel:108" className="bg-red-500 rounded-xl p-4 text-center hover:bg-red-400 transition block">
              <p className="text-white text-2xl font-bold">108</p>
              <p className="text-red-100 text-sm">Ambulance</p>
            </a>
          </div>
        </div>
      </div>

      {!user && (
        <div className="py-16 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Stay Safe?</h2>
            <p className="text-gray-500 mb-8">Join thousands of students who trust SafeCampus for their safety</p>
            <button onClick={() => navigate("/signup")} className="bg-pink-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-pink-700 transition text-lg shadow-lg">
              Create Free Account
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;
