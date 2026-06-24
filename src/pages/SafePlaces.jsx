import { useState, useEffect } from "react";
import API from "../api/api";
import Icon from "../components/Icon";

const PLACE_TYPES = [
  { id: "hospital", label: "Hospitals", icon: "cross", query: "hospital" },
  { id: "police", label: "Police Stations", icon: "shield", query: "police" },
  { id: "pharmacy", label: "Pharmacies", icon: "pill", query: "pharmacy" },
  { id: "fire", label: "Fire Stations", icon: "flame", query: "fire_station" },
];

function SafePlaces() {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeType, setActiveType] = useState("hospital");
  const [locationError, setLocationError] = useState("");

  useEffect(() => { getLocation(); }, []);

  useEffect(() => {
    if (location) { fetchPlaces(activeType); }
  }, [location, activeType]);

  const getLocation = () => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => setLocationError("Location access denied. Please enable location and try again."),
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const fetchPlaces = async (type) => {
    if (!location) return;
    setLoading(true);
    setError("");
    setPlaces([]);
    try {
      const query = PLACE_TYPES.find((t) => t.id === type)?.query || type;
      const res = await API.get("/places/nearby", {
        params: { lat: location.latitude, lon: location.longitude, type: query },
      });
      setPlaces(res.data);
      if (res.data.length === 0) {
        setError("No places found nearby. Try a different category.");
      }
    } catch (err) {
      setError("Failed to fetch nearby places. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getDistance = (lat, lon) => {
    if (!location || !lat || !lon) return null;
    const R = 6371;
    const dLat = ((lat - location.latitude) * Math.PI) / 180;
    const dLon = ((lon - location.longitude) * Math.PI) / 180;
    const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos((location.latitude*Math.PI)/180)*Math.cos((lat*Math.PI)/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return distance < 1 ? Math.round(distance*1000) + "m away" : distance.toFixed(1) + "km away";
  };

  const openMaps = (lat, lon) => {
    window.open("https://www.google.com/maps/dir/?api=1&destination=" + lat + "," + lon, "_blank");
  };

  return (
    <div className="min-h-screen bg-paper p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl text-ink mb-2">Safe Places</h1>
        <p className="text-slate mb-6">Find nearby hospitals, police stations and more</p>

        <div className="bg-white rounded-2xl shadow-sm border border-slate/10 p-4 mb-6">
          {location ? (
            <div className="flex justify-between items-center">
              <p className="text-signal font-medium text-sm">Location detected</p>
              <button onClick={() => fetchPlaces(activeType)} className="text-dusk text-sm border border-dusk/30 px-3 py-1.5 rounded-full hover:bg-dusk/5 transition">
                Refresh
              </button>
            </div>
          ) : locationError ? (
            <div className="flex justify-between items-center">
              <p className="text-beacon text-sm">{locationError}</p>
              <button onClick={getLocation} className="bg-beacon text-white text-sm px-3 py-1.5 rounded-full hover:bg-beacon-dark transition">
                Retry
              </button>
            </div>
          ) : (
            <p className="text-slate font-medium text-sm">Getting your location...</p>
          )}
        </div>

        {error && (
          <div className="bg-dusk/5 border border-dusk/20 p-3 rounded-lg mb-4 flex justify-between items-center gap-3">
            <p className="text-slate text-sm">{error}</p>
            <button onClick={() => fetchPlaces(activeType)} className="text-dusk text-sm border border-dusk/30 px-3 py-1.5 rounded-full whitespace-nowrap">
              Retry
            </button>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
          {PLACE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={"flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap font-medium transition text-sm " + (activeType === type.id ? "bg-ink text-white" : "bg-white text-slate border border-slate/15 hover:border-ink/30")}
            >
              <Icon name={type.icon} className="w-4 h-4" strokeWidth={2} />
              {type.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate/10 p-8 text-center">
            <p className="text-dusk font-medium text-sm">Searching nearby places...</p>
            <p className="text-slate text-xs mt-2">This may take a few seconds</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {places.length === 0 && !error && !loading && location && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate/10 p-6 text-center text-slate text-sm">
                No places found. Try a different category.
              </div>
            )}
            {places.map((place) => (
              <div key={place.id} className="bg-white rounded-2xl shadow-sm border border-slate/10 p-5">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-ink text-sm">{place.name}</p>
                    <p className="text-slate text-xs mt-1">{place.address}</p>
                    {place.phone && <p className="text-dusk text-sm mt-1">{place.phone}</p>}
                    {place.lat && place.lon && (
                      <p className="text-slate text-xs mt-1">{getDistance(place.lat, place.lon)}</p>
                    )}
                  </div>
                  {place.lat && place.lon && (
                    <button onClick={() => openMaps(place.lat, place.lon)} className="bg-dusk text-white px-3 py-2 rounded-full hover:bg-dusk-light transition text-xs font-medium whitespace-nowrap">
                      Directions
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SafePlaces;
