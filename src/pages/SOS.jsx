import { useState, useEffect, useRef } from "react";
import API from "../api/api";
import Icon from "../components/Icon";

function SOS() {
  const [loading, setLoading] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [location, setLocation] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);
  const [shakeActive, setShakeActive] = useState(() => localStorage.getItem("shakeActive") === "true");
  const [voiceStatus, setVoiceStatus] = useState("");
  const [liveTracking, setLiveTracking] = useState(false);
  const [currentSosId, setCurrentSosId] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [userName, setUserName] = useState("");
  const recognitionRef = useRef(null);
  const lastShakeRef = useRef(0);
  const trackingRef = useRef(null);

  const VOICE_TRIGGERS = ["help", "help me", "emergency", "save me", "bachao", "help karo"];

  useEffect(() => {
    fetchHistory();
    getLocation();
    return () => { stopVoice(); stopLiveTracking(); };
  }, []);

  useEffect(() => {
    if (!shakeActive) return;
    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const total = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
      const now = Date.now();
      if (total > 30 && now - lastShakeRef.current > 3000) {
        lastShakeRef.current = now;
        handleSOS();
      }
    };
    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [shakeActive, location]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => setError("Location access denied. SOS will trigger without location.")
      );
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await API.get("/sos/history");
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const playAlarm = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    gainNode.gain.setValueAtTime(1, context.currentTime);
    oscillator.start();
    oscillator.stop(context.currentTime + 3);
  };

  const startLiveTracking = (sosId) => {
    setLiveTracking(true);
    trackingRef.current = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const newLocation = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setLocation(newLocation);
          API.put("/sos/update-location/" + sosId, newLocation).catch(console.error);
        });
      }
    }, 5000);
  };

  const stopLiveTracking = () => {
    if (trackingRef.current) { clearInterval(trackingRef.current); trackingRef.current = null; }
    setLiveTracking(false);
  };

  const handleSOS = async () => {
    setLoading(true);
    setError("");
    try {
      playAlarm();
      const res = await API.post("/sos/trigger", {
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
        address: location ? location.latitude.toFixed(4) + ", " + location.longitude.toFixed(4) : "Unknown",
      });
      setTriggered(true);
      setCurrentSosId(res.data.sos._id);
      setEmergencyContacts(res.data.emergencyContacts || []);
      setUserName(res.data.userName || "");
      startLiveTracking(res.data.sos._id);
      fetchHistory();
    } catch (err) {
      setError("Failed to trigger SOS. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await API.put("/sos/resolve/" + id);
      stopLiveTracking();
      fetchHistory();
      setTriggered(false);
      setCurrentSosId(null);
      setEmergencyContacts([]);
    } catch (err) {
      console.error(err);
    }
  };

  const sendWhatsApp = (phone) => {
    const mapsLink = location
      ? "https://maps.google.com/?q=" + location.latitude + "," + location.longitude
      : "Location unavailable";
    const message = "EMERGENCY ALERT! " + userName + " needs immediate help! Live Location: " + mapsLink + " Please call or go to their location immediately!";
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    window.open("https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent(message), "_blank");
  };

  const openLiveLocation = () => {
    if (location) {
      window.open("https://www.google.com/maps?q=" + location.latitude + "," + location.longitude, "_blank");
    }
  };

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setError("Voice recognition not supported. Use Chrome."); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = "en-IN";
    recognition.onstart = () => { setVoiceActive(true); setVoiceStatus("Listening..."); };
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map((r) => r[0].transcript.toLowerCase()).join(" ");
      const interimTranscript = e.results[e.results.length - 1][0].transcript.toLowerCase();
      setVoiceStatus("Heard: " + interimTranscript);
      const triggered = VOICE_TRIGGERS.some((t) => transcript.includes(t) || interimTranscript.includes(t));
      if (triggered) { setVoiceStatus("Voice SOS triggered!"); handleSOS(); recognition.stop(); setVoiceActive(false); }
    };
    recognition.onerror = () => { setVoiceActive(false); setVoiceStatus("Voice error. Try again."); };
    recognition.onend = () => { setVoiceActive(false); setVoiceStatus(""); };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoice = () => {
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
    setVoiceActive(false);
    setVoiceStatus("");
  };

  const toggleShake = () => {
    if (!shakeActive) {
      if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission().then((res) => { if (res === "granted") { setShakeActive(true); localStorage.setItem("shakeActive", "true"); } }).catch(() => setError("Motion permission denied."));
      } else { setShakeActive(true); localStorage.setItem("shakeActive", "true"); }
    } else { setShakeActive(false); localStorage.setItem("shakeActive", "false"); }
  };

  return (
    <div className="min-h-screen bg-paper p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl text-ink mb-2">SOS Emergency</h1>
        <p className="text-slate mb-6">Multiple ways to raise an alert</p>

        {error && <p className="text-beacon bg-beacon/10 p-3 rounded-lg mb-4 text-sm">{error}</p>}

        <div className="bg-white rounded-2xl shadow-sm border border-slate/10 p-4 mb-6 flex justify-between items-center">
          <div>
            {location ? (
              <p className="text-signal font-medium text-sm">Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
            ) : (
              <p className="text-slate font-medium text-sm">Getting your location...</p>
            )}
            {liveTracking && <p className="text-dusk text-xs mt-1 font-medium">Live tracking active</p>}
          </div>
          {location && (
            <button onClick={openLiveLocation} className="bg-dusk/10 text-dusk px-3 py-2 rounded-lg hover:bg-dusk/15 transition text-sm font-medium">
              View on map
            </button>
          )}
        </div>

        <div className="flex flex-col items-center mb-8">
          {!triggered ? (
            <button
              onClick={handleSOS}
              disabled={loading}
              className="relative w-44 h-44 rounded-full bg-beacon text-white shadow-2xl shadow-beacon/30 hover:bg-beacon-dark active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
            >
              <span className="beacon-ring"></span>
              <Icon name="siren" className="w-9 h-9 relative z-10" strokeWidth={1.6} />
              <span className="font-display text-lg relative z-10">{loading ? "Sending..." : "SOS"}</span>
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="w-44 h-44 rounded-full bg-beacon/10 border-4 border-beacon/30 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-beacon font-display text-xl">Alert sent</p>
                  {liveTracking && <p className="text-dusk text-xs mt-1">Tracking live</p>}
                </div>
              </div>

              {emergencyContacts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate/10 p-4 w-full">
                  <p className="font-semibold text-ink mb-3 text-sm">Alert emergency contacts</p>
                  <div className="flex flex-col gap-2">
                    {emergencyContacts.map((contact, index) => (
                      <button
                        key={index}
                        onClick={() => sendWhatsApp(contact.phone)}
                        className="flex justify-between items-center bg-signal/10 text-signal px-4 py-3 rounded-xl hover:bg-signal/15 transition"
                      >
                        <div className="text-left">
                          <p className="font-semibold text-ink">{contact.name}</p>
                          <p className="text-slate text-xs">{contact.relation} — {contact.phone}</p>
                        </div>
                        <Icon name="chat" className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {emergencyContacts.length === 0 && (
                <div className="bg-dusk/5 border border-dusk/15 rounded-xl p-3 w-full">
                  <p className="text-slate text-sm">No emergency contacts saved. Go to Profile to add contacts.</p>
                </div>
              )}

              <div className="flex gap-3 w-full">
                <button onClick={openLiveLocation} className="flex-1 bg-dusk text-white py-2.5 rounded-full hover:bg-dusk-light transition text-sm font-medium">
                  My location
                </button>
                <button onClick={() => handleResolve(currentSosId || history[0]?._id)} className="flex-1 bg-signal text-white py-2.5 rounded-full hover:opacity-90 transition text-sm font-medium">
                  Mark safe
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate/10 p-5 mb-4">
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-dusk/10 text-dusk flex items-center justify-center shrink-0">
                <Icon name="chat" className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-ink font-semibold text-sm">Voice SOS</h2>
                <p className="text-slate text-xs mt-1">Say "help", "emergency" or "bachao"</p>
                {voiceStatus && <p className="text-dusk text-xs mt-1 font-medium">{voiceStatus}</p>}
              </div>
            </div>
            <button
              onClick={voiceActive ? stopVoice : startVoice}
              className={"px-4 py-2 rounded-full font-medium transition text-sm whitespace-nowrap " + (voiceActive ? "bg-beacon text-white" : "bg-ink text-white")}
            >
              {voiceActive ? "Stop" : "Start"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate/10 p-5 mb-6">
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-dusk/10 text-dusk flex items-center justify-center shrink-0">
                <Icon name="siren" className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-ink font-semibold text-sm">Shake detection</h2>
                <p className="text-slate text-xs mt-1">Shake your phone to trigger SOS</p>
                {shakeActive && <p className="text-signal text-xs mt-1 font-medium">Active</p>}
              </div>
            </div>
            <button
              onClick={toggleShake}
              className={"px-4 py-2 rounded-full font-medium transition text-sm whitespace-nowrap " + (shakeActive ? "bg-beacon text-white" : "bg-ink text-white")}
            >
              {shakeActive ? "Stop" : "Enable"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate/10 p-6">
          <h2 className="font-display text-lg text-ink mb-4">SOS history</h2>
          {history.length === 0 ? (
            <p className="text-slate text-sm">No SOS alerts triggered yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((item) => (
                <div key={item._id} className="border border-slate/10 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-ink text-sm">{item.message}</p>
                    <p className="text-xs text-slate mt-0.5">{new Date(item.createdAt).toLocaleString()}</p>
                    <p className="text-xs text-slate">Location: {item.location.address}</p>
                  </div>
                  <span className={"px-3 py-1 rounded-full text-xs font-medium " + (item.status === "active" ? "bg-beacon/10 text-beacon" : "bg-signal/10 text-signal")}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default SOS;
