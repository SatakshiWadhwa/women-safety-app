import { useState, useEffect, useRef } from "react";
import API from "../api/api";

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
        DeviceMotionEvent.requestPermission().then((res) => { if (res === "granted") setShakeActive(true); localStorage.setItem("shakeActive", "true"); }).catch(() => setError("Motion permission denied."));
      } else { setShakeActive(true); localStorage.setItem("shakeActive", "true"); }
    } else { setShakeActive(false); localStorage.setItem("shakeActive", "false"); }
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-pink-700 mb-2">SOS Emergency</h1>
        <p className="text-gray-500 mb-6">Multiple ways to trigger emergency alert</p>

        {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}

        <div className="bg-white rounded-2xl shadow p-4 mb-6 flex justify-between items-center">
          <div>
            {location ? (
              <p className="text-green-600 font-medium">Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
            ) : (
              <p className="text-yellow-600 font-medium">Getting your location...</p>
            )}
            {liveTracking && <p className="text-blue-600 text-sm mt-1 font-medium">Live tracking active</p>}
          </div>
          {location && (
            <button onClick={openLiveLocation} className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition text-sm">
              View on Map
            </button>
          )}
        </div>

        <div className="flex flex-col items-center mb-8">
          {!triggered ? (
            <button
              onClick={handleSOS}
              disabled={loading}
              className="w-48 h-48 rounded-full bg-red-600 text-white text-2xl font-bold shadow-2xl hover:bg-red-700 active:scale-95 transition-all border-8 border-red-300"
            >
              {loading ? "Sending..." : "SOS"}
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="w-48 h-48 rounded-full bg-red-100 border-8 border-red-400 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-600 font-bold text-xl">Alert Sent!</p>
                  {liveTracking && <p className="text-blue-600 text-xs mt-1">Tracking live</p>}
                </div>
              </div>

              {/* Emergency Contacts WhatsApp */}
              {emergencyContacts.length > 0 && (
                <div className="bg-white rounded-2xl shadow p-4 w-full">
                  <p className="font-bold text-gray-700 mb-3">Alert Emergency Contacts:</p>
                  <div className="flex flex-col gap-2">
                    {emergencyContacts.map((contact, index) => (
                      <button
                        key={index}
                        onClick={() => sendWhatsApp(contact.phone)}
                        className="flex justify-between items-center bg-green-500 text-white px-4 py-3 rounded-xl hover:bg-green-600 transition"
                      >
                        <div className="text-left">
                          <p className="font-semibold">{contact.name}</p>
                          <p className="text-green-100 text-sm">{contact.relation} — {contact.phone}</p>
                        </div>
                        <span className="text-2xl">??</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {emergencyContacts.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3 w-full">
                  <p className="text-yellow-700 text-sm">No emergency contacts saved. Go to Profile to add contacts.</p>
                </div>
              )}

              <div className="flex gap-3 w-full">
                <button
                  onClick={openLiveLocation}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  My Location
                </button>
                <button
                  onClick={() => handleResolve(currentSosId || history[0]?._id)}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Mark Safe
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-800">?? Voice SOS</h2>
              <p className="text-gray-500 text-sm mt-1">Say "help", "emergency" or "bachao"</p>
              {voiceStatus && <p className="text-pink-600 text-sm mt-2 font-medium">{voiceStatus}</p>}
            </div>
            <button
              onClick={voiceActive ? stopVoice : startVoice}
              className={"px-4 py-2 rounded-lg font-medium transition " + (voiceActive ? "bg-red-500 text-white" : "bg-pink-600 text-white")}
            >
              {voiceActive ? "Stop" : "Start"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-800">?? Shake Detection</h2>
              <p className="text-gray-500 text-sm mt-1">Shake your phone to trigger SOS</p>
              {shakeActive && <p className="text-green-600 text-sm mt-2 font-medium">Shake detection active!</p>}
            </div>
            <button
              onClick={toggleShake}
              className={"px-4 py-2 rounded-lg font-medium transition " + (shakeActive ? "bg-red-500 text-white" : "bg-pink-600 text-white")}
            >
              {shakeActive ? "Stop" : "Enable"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-pink-600 mb-4">SOS History</h2>
          {history.length === 0 ? (
            <p className="text-gray-400">No SOS alerts triggered yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((item) => (
                <div key={item._id} className="border border-pink-100 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-700">{item.message}</p>
                    <p className="text-sm text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Location: {item.location.address}</p>
                  </div>
                  <span className={"px-3 py-1 rounded-full text-sm font-medium " + (item.status === "active" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600")}>
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
