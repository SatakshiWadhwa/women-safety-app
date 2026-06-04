import { useState, useEffect } from "react";

const PLACE_TYPES = [
  { id: "hospital", label: "Hospitals", icon: "🏥", query: "hospital" },
  { id: "police", label: "Police Stations", icon: "👮", query: "police" },
  { id: "pharmacy", label: "Pharmacies", icon: "💊", query: "pharmacy" },
  { id: "fire", label: "Fire Stations", icon: "🚒", query: "fire_station" },
];

function SafePlaces() {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeType, setActiveType] = useState("hospital");

  useEffect(() => { getLocation(); }, []);

  useEffect(() => {
    if (location) { fetchPlaces(activeType); }
  }, [location, activeType]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => setError("Location access denied. Please enable location to find nearby places.")
      );
    }
  };

  const fetchPlaces = async (type) => {
    if (!location) return;
    setLoading(true);
    setError("");
    setPlaces([]);
    try {
      const query = PLACE_TYPES.find((t) => t.id === type)?.query || type;
      const overpassQuery = `[out:json][timeout:25];(node["amenity"="${query}"](around:3000,${location.latitude},${location.longitude});way["amenity"="${query}"](around:3000,${location.latitude},${location.longitude}););out body;>;out skel qt;`;
      const response = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: overpassQuery });
      const data = await response.json();
      const results = data.elements
        .filter((el) => el.tags && el.tags.name)
        .slice(0, 10)
        .map((el) => ({
          id: el.id,
          name: el.tags.name,
          address: el.tags["addr:full"] || el.tags["addr:street"] || "Address not available",
          phone: el.tags.phone || el.tags["contact:phone"] || null,
          lat: el.lat || el.center?.lat,
          lon: el.lon || el.center?.lon,
        }));
      setPlaces(results);
      if (results.length === 0) setError("No places found nearby. Try a different category.");
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
    return distance < 1 ? `${Math.round(distance*1000)}m away` : `${distance.toFixed(1)}km away`;
  };

  const openMaps = (lat, lon) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-pink-700 mb-2">Safe Places</h1>
        <p className="text-gray-500 mb-6">Find nearby hospitals, police stations and more</p>

        <div className="bg-white rounded-2xl shadow p-4 mb-6">
          {location ? (
            <p className="text-green-600 font-medium">Location detected. Searching within 3km radius.</p>
          ) : (
            <p className="text-yellow-600 font-medium">Getting your location...</p>
          )}
        </div>

        {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}

        <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
          {PLACE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                activeType === type.id ? "bg-pink-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-pink-400"
              }`}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-pink-600 font-medium">Searching nearby places...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {places.map((place) => (
              <div key={place.id} className="bg-white rounded-2xl shadow p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{place.name}</p>
                    <p className="text-gray-500 text-sm mt-1">{place.address}</p>
                    {place.phone && (
                      <p className="text-pink-600 text-sm mt-1">{place.phone}</p>
                    )}
                    {place.lat && place.lon && (
                      <p className="text-gray-400 text-xs mt-1">{getDistance(place.lat, place.lon)}</p>
                    )}
                  </div>
                  {place.lat && place.lon && (
                    <button
                      onClick={() => openMaps(place.lat, place.lon)}
                      className="bg-pink-600 text-white px-3 py-2 rounded-lg hover:bg-pink-700 transition text-sm ml-3"
                    >
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
