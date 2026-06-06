import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/nearby", protect, async (req, res) => {
  try {
    const { lat, lon, type } = req.query;

    if (!lat || !lon || !type) {
      return res.status(400).json({ message: "lat, lon and type are required" });
    }

    const overpassQuery = `[out:json][timeout:25];(node["amenity"="${type}"](around:5000,${lat},${lon});way["amenity"="${type}"](around:5000,${lat},${lon}););out body;>;out skel qt;`;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: overpassQuery,
    });

    if (!response.ok) {
      throw new Error("Overpass API failed");
    }

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

    res.json(results);
  } catch (error) {
    console.error("Places error:", error.message);
    res.status(500).json({ message: "Failed to fetch places" });
  }
});

export default router;
