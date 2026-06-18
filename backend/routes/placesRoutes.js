import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/nearby", protect, async (req, res) => {
  try {
    const { lat, lon, type } = req.query;

    if (!lat || !lon || !type) {
      return res.status(400).json({ message: "lat, lon and type are required" });
    }

    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    // Build a tight bounding box (~6km) around the user so results stay local
    const delta = 0.06;
    const viewbox = `${lonNum - delta},${latNum + delta},${lonNum + delta},${latNum - delta}`;

    const url = `https://nominatim.openstreetmap.org/search?q=${type}&format=json&limit=15&addressdetails=1&bounded=1&viewbox=${viewbox}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "SafeCampus/1.0 safecampus@gmail.com",
      },
    });

    if (!response.ok) {
      throw new Error("Nominatim API failed");
    }

    const data = await response.json();

    // Safety net: drop anything outside a ~10km straight-line radius
    const toRad = (v) => (v * Math.PI) / 180;
    const distanceKm = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const results = data
      .map((place) => ({
        id: place.place_id,
        name: place.display_name.split(",")[0],
        address: place.display_name,
        phone: null,
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lon),
      }))
      .filter((place) => distanceKm(latNum, lonNum, place.lat, place.lon) <= 10)
      .sort((a, b) => distanceKm(latNum, lonNum, a.lat, a.lon) - distanceKm(latNum, lonNum, b.lat, b.lon));

    res.json(results);
  } catch (error) {
    console.error("Places error:", error.message);
    res.status(500).json({ message: "Failed to fetch places" });
  }
});

export default router;
