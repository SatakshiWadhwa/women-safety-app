import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/nearby", protect, async (req, res) => {
  try {
    const { lat, lon, type } = req.query;

    if (!lat || !lon || !type) {
      return res.status(400).json({ message: "lat, lon and type are required" });
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${type}&lat=${lat}&lon=${lon}&format=json&limit=10&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "SafeCampus/1.0 safecampus@gmail.com",
      },
    });

    if (!response.ok) {
      throw new Error("Nominatim API failed");
    }

    const data = await response.json();

    const results = data.map((place) => ({
      id: place.place_id,
      name: place.display_name.split(",")[0],
      address: place.display_name,
      phone: null,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
    }));

    res.json(results);
  } catch (error) {
    console.error("Places error:", error.message);
    res.status(500).json({ message: "Failed to fetch places" });
  }
});

export default router;
