import { MapContainer, TileLayer, Marker, Polyline, Polygon, useMap } from "react-leaflet";
import L from "leaflet";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as turf from "@turf/turf";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API = import.meta.env.VITE_API_BASE_URL;

/* Fix default marker icon */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* Auto zoom */
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 20, { animate: true });
  }, [position]);
  return null;
}

export default function Geofencing() {
  const navigate = useNavigate();

  const [points, setPoints] = useState([]);
  const [farmName, setFarmName] = useState("");
  const [farmAddress, setFarmAddress] = useState("");
  const [areaInAcres, setAreaInAcres] = useState("");
  const [distanceWalked, setDistanceWalked] = useState(0);
  const [loading, setLoading] = useState(false);

  const [userLocation, setUserLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [polygonClosed, setPolygonClosed] = useState(false);
  const [accuracy, setAccuracy] = useState(null);

  /* Get initial location */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => alert("Enable location access"),
      { enableHighAccuracy: true }
    );
  }, []);

  /* Start walking */
  const startTracking = () => {
    setPoints([]);
    setAreaInAcres("");
    setDistanceWalked(0);
    setPolygonClosed(false);

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        setAccuracy(accuracy.toFixed(1));

        // More lenient accuracy threshold (50m instead of 20m)
        if (accuracy > 50 || polygonClosed) return;

        const newPoint = [lat, lng];
        setUserLocation(newPoint);

        setPoints((prev) => {
          if (prev.length === 0) return [newPoint];

          const last = prev[prev.length - 1];

          const from = turf.point([last[1], last[0]]);
          const to = turf.point([lng, lat]);
          const segmentDistance = turf.distance(from, to, { units: "meters" });

          // Lower minimum distance threshold (2m instead of 3m) for better boundary capture
          if (segmentDistance > 2) {
            const updated = [...prev, newPoint];

            // Update total distance
            setDistanceWalked((d) => d + segmentDistance);

            // 🔥 Auto close logic
            if (updated.length > 3) {
              const start = updated[0];
              const startPoint = turf.point([start[1], start[0]]);
              const currentPoint = turf.point([lng, lat]);
              const closeDistance = turf.distance(startPoint, currentPoint, { units: "meters" });

              if (closeDistance < 8) {
                finishPolygon(updated);
              }
            }

            return updated;
          }

          return prev;
        });
      },
      (err) => console.error("Geolocation error:", err),
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      }
    );

    setWatchId(id);
    setIsTracking(true);
  };

  /* Finish polygon */
  const finishPolygon = (finalPoints) => {
    navigator.geolocation.clearWatch(watchId);
    setIsTracking(false);
    setPolygonClosed(true);

    const coords = finalPoints.map((p) => [p[1], p[0]]);
    const polygon = turf.polygon([[...coords, coords[0]]]);
    const areaSqMeters = turf.area(polygon);
    const acres = areaSqMeters * 0.000247105;

    setAreaInAcres(acres.toFixed(2));
  };

  /* Manual stop */
  const stopTracking = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    setIsTracking(false);

    if (points.length < 3) {
      alert("Walk full boundary first");
      return;
    }

    finishPolygon(points);
  };

  /* Save land */
  const handleSubmit = async () => {
    if (points.length < 3) {
      alert("Walk boundary first");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await fetch(`${API}/auth/add-land`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          farmName,
          farmAddress,
          areaInAcres,
          coordinates: [...points, points[0]],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Land saved successfully 🌾");
      navigate("/farmer/dashboard");
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f8fad9] py-10 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl mt-10 shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-4 text-[#132a13]">
            Map Your Farm (Satellite - Free) 🌍
          </h2>

          {/* Info Display */}
          <div className="mb-4 text-center font-semibold text-green-800 space-y-2">
            <div>Distance Walked: {distanceWalked.toFixed(1)} meters</div>
            {accuracy && <div>GPS Accuracy: ±{accuracy} meters (Good: &lt;15m)</div>}
            <div>Points Captured: {points.length}</div>
          </div>

          {/* Inputs */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <input
              placeholder="Farm Name"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />
            <input
              placeholder="Farm Address"
              value={farmAddress}
              onChange={(e) => setFarmAddress(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />
            <input
              placeholder="Area (Auto)"
              value={areaInAcres}
              readOnly
              className="border rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            {!isTracking ? (
              <button
                onClick={startTracking}
                className="bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                Start Walking 🚶
              </button>
            ) : (
              <button
                onClick={stopTracking}
                className="bg-red-600 text-white px-6 py-2 rounded-lg"
              >
                Stop & Calculate 📐
              </button>
            )}
          </div>

          {/* MAP */}
          <MapContainer
            center={userLocation || [10.7905, 78.7047]}
            zoom={18}
            maxZoom={22}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" opacity={0.4} />

            {userLocation && <Marker position={userLocation} />}
            {points.length >= 2 && <Polyline positions={points} />}
            {polygonClosed && <Polygon positions={points} />}

            <RecenterMap position={userLocation} />
          </MapContainer>

          <div className="text-center mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#132a13] text-[#ecf39e] px-8 py-3 rounded-xl font-semibold"
            >
              {loading ? "Saving..." : "Save Land"}
            </button>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}