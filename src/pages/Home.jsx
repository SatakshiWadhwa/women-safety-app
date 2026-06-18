import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";

const FEATURES = [
  { icon: "siren", title: "SOS Emergency", desc: "One tap sends your live location and sounds an alarm.", path: "/sos", accent: "beacon" },
  { icon: "walk", title: "Night Walk Buddy", desc: "Match with a verified student walking your route.", path: "/buddy", accent: "dusk" },
  { icon: "chat", title: "AI Assistant", desc: "Calm, private guidance for unsafe moments, day or night.", path: "/ai-assistant", accent: "dusk" },
  { icon: "pin", title: "Safe Places", desc: "Hospitals, police stations and pharmacies near you.", path: "/safe-places", accent: "signal" },
  { icon: "phone", title: "Fake Call", desc: "A believable incoming call to exit a situation fast.", path: "/fake-call", accent: "beacon" },
  { icon: "fist", title: "Self Defense", desc: "Techniques, legal rights and numbers worth knowing.", path: "/self-defense", accent: "signal" },
];

const STATS = [
  { number: "24/7", label: "Always on" },
  { number: "<2s", label: "To raise an alert" },
  { number: "5km", label: "Safe-place radius" },
  { number: "Free", label: "For every student" },
];

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFeatureClick = (path) => {
    if (user) { navigate(path); } else { navigate("/login"); }
  };

  return (
    <div className="min-h-screen bg-paper">

      {/* HERO */}
      <div className="relative bg-ink text-white overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-dusk/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-beacon/10 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="flex flex-col items-center text-center">

            <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
              <span className="beacon-ring"></span>
              <span className="beacon-ring delay"></span>
              <div className="relative w-16 h-16 rounded-full bg-beacon flex items-center justify-center shadow-lg shadow-beacon/30">
                <Icon name="shield" className="w-8 h-8 text-white" strokeWidth={1.6} />
              </div>
            </div>

            <p className="text-dusk-light text-sm font-semibold tracking-wide uppercase mb-4">
              Built for college &amp; hostel students
            </p>

            <h1 className="font-display text-5xl md:text-6xl font-medium leading-[1.05] mb-6 max-w-3xl">
              A companion that stays alert<br className="hidden md:block" /> so you do not have to.
            </h1>

            <p className="text-white/70 text-lg max-w-xl mb-10 leading-relaxed">
              SafeCampus puts an SOS signal, a verified walking buddy, and a calm AI guide in one place — ready before you ever need them.
            </p>

            <div className="flex gap-4 flex-wrap justify-center">
              {user ? (
                <button onClick={() => navigate("/dashboard")} className="bg-beacon text-white px-8 py-3.5 rounded-full font-semibold hover:bg-beacon-dark transition shadow-lg shadow-beacon/20">
                  Open Dashboard
                </button>
              ) : (
                <>
                  <button onClick={() => navigate("/signup")} className="bg-beacon text-white px-8 py-3.5 rounded-full font-semibold hover:bg-beacon-dark transition shadow-lg shadow-beacon/20">
                    Create free account
                  </button>
                  <button onClick={() => navigate("/login")} className="border border-white/30 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 transition">
                    Log in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-ink/5 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate/10 overflow-hidden">
          {STATS.map((stat, index) => (
            <div key={index} className="p-6 text-center">
              <p className="font-display text-3xl text-ink">{stat.number}</p>
              <p className="text-slate text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-14">
            <p className="text-beacon text-sm font-semibold tracking-wide uppercase mb-3">What is inside</p>
            <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">Every feature answers one question: what do I do right now?</h2>
            <p className="text-slate leading-relaxed">Tap any card to open it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, index) => (
              <button
                key={index}
                onClick={() => handleFeatureClick(feature.path)}
                className="group bg-white border border-slate/10 rounded-2xl p-7 text-left hover:border-transparent hover:shadow-xl hover:shadow-ink/5 transition-all duration-200"
              >
                <div className={"w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors " + (feature.accent === "beacon" ? "bg-beacon/10 text-beacon group-hover:bg-beacon/15" : feature.accent === "dusk" ? "bg-dusk/10 text-dusk group-hover:bg-dusk/15" : "bg-signal/10 text-signal group-hover:bg-signal/15")}>
                  <Icon name={feature.icon} className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl text-ink mb-2">{feature.title}</h3>
                <p className="text-slate text-sm leading-relaxed mb-4">{feature.desc}</p>
                <p className="text-sm font-semibold text-ink/40 group-hover:text-beacon transition-colors flex items-center gap-1.5">
                  Open <Icon name="arrow" className="w-4 h-4" strokeWidth={2} />
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="bg-ink text-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-14">
            <p className="text-dusk-light text-sm font-semibold tracking-wide uppercase mb-3">Getting started</p>
            <h2 className="font-display text-3xl md:text-4xl mb-4">Three steps, about two minutes.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Create your account", desc: "Sign up with your email and a strong password — takes under a minute." },
              { title: "Add who to alert", desc: "Save emergency contacts so help knows exactly where to go." },
              { title: "Carry it with you", desc: "SOS, Buddy and the AI guide are one tap away whenever you need them." },
            ].map((item, index) => (
              <div key={index} className="border-t border-white/15 pt-6">
                <p className="font-display text-2xl text-dusk-light mb-3">0{index + 1}</p>
                <h3 className="font-display text-xl mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EMERGENCY NUMBERS */}
      <div className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl text-ink mb-1">Numbers worth saving right now</h2>
          <p className="text-slate text-sm mb-8">Tap any number to call it directly. Works on mobile.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="tel:112" className="bg-beacon/5 border border-beacon/20 rounded-2xl p-5 text-center hover:bg-beacon/10 transition block">
              <p className="font-display text-2xl text-beacon">112</p>
              <p className="text-slate text-sm mt-1">National Emergency</p>
            </a>
            <a href="tel:100" className="bg-beacon/5 border border-beacon/20 rounded-2xl p-5 text-center hover:bg-beacon/10 transition block">
              <p className="font-display text-2xl text-beacon">100</p>
              <p className="text-slate text-sm mt-1">Police</p>
            </a>
            <a href="tel:1091" className="bg-beacon/5 border border-beacon/20 rounded-2xl p-5 text-center hover:bg-beacon/10 transition block">
              <p className="font-display text-2xl text-beacon">1091</p>
              <p className="text-slate text-sm mt-1">Women Helpline</p>
            </a>
            <a href="tel:108" className="bg-beacon/5 border border-beacon/20 rounded-2xl p-5 text-center hover:bg-beacon/10 transition block">
              <p className="font-display text-2xl text-beacon">108</p>
              <p className="text-slate text-sm mt-1">Ambulance</p>
            </a>
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      {!user && (
        <div className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center bg-dusk/5 border border-dusk/15 rounded-3xl p-12">
            <h2 className="font-display text-3xl text-ink mb-3">Set it up before you need it.</h2>
            <p className="text-slate mb-8">It takes two minutes today. It could save you twenty tomorrow.</p>
            <button onClick={() => navigate("/signup")} className="bg-beacon text-white px-10 py-4 rounded-full font-semibold hover:bg-beacon-dark transition shadow-lg shadow-beacon/20">
              Create your account
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;
