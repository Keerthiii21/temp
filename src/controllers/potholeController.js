exports.createFromPi = async (req, res) => {
  try {
    const { pothole_id, gps_lat, gps_lon, lidar_cm, image, timestamp } = req.body;

    // ---------- TIMESTAMP FIX ----------
    let finalTimestamp = Date.now();
    if (timestamp) {
      try {
        finalTimestamp = new Date(timestamp);
      } catch {
        finalTimestamp = Date.now();
      }
    }

    // ---------- REVERSE GEOCODING ----------
    let address = null;
    try {
      if (gps_lat && gps_lon) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${gps_lat}&lon=${gps_lon}`;
        const response = await fetch(url, {
          headers: { "User-Agent": "PatchPoint-App" }
        });
        const data = await response.json();
        address = data.display_name || null;
      }
    } catch (err) {
      console.log("Reverse geocoding failed:", err);
    }

    // ---------- PREPARE PAYLOAD ----------
    const payload = {
      gpsLat: gps_lat,
      gpsLon: gps_lon,
      depthCm: lidar_cm,
      timestamp: finalTimestamp,
      address: address
    };

    if (image) payload.imageUrl = image;
    if (pothole_id) payload._id = pothole_id;

    // ---------- SAVE ----------
    const pothole = await Pothole.create(payload);

    return res.json({ success: true, pothole });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
