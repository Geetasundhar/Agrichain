import { GoogleMap, useLoadScript, Marker, Polyline, Polygon } from "@react-google-maps/api";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as turf from "@turf/turf";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Geofencing() {
  const navigate = useNavigate();

  const libraries = useMemo(() => [], []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [points, setPoints] = useState([]);
  const [farmName, setFarmName] = useState("");
  const [farmAddress, setFarmAddress] = useState("");
  const [areaInAcres, setAreaInAcres] = useState("");
  const [distanceWalked, setDistanceWalked] = useState(0);
  const [loading, setLoading] = useState(false);

  const [userLocation, setUserLocation] = useState(null);
  const [center, setCenter] = useState({ lat: 10.7905, lng: 78.7047 });
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [polygonClosed, setPolygonClosed] = useState(false);

  /* Get initial location */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation([lat, lng]);
        setCenter({ lat, lng });
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
        if (accuracy > 20 || polygonClosed) return;

        const newPoint = [lat, lng];
        setUserLocation(newPoint);
        setCenter({ lat, lng });

        setPoints((prev) => {
          if (prev.length === 0) return [newPoint];

          const last = prev[prev.length - 1];

          const from = turf.point([last[1], last[0]]);
          const to = turf.point([lng, lat]);
          const segmentDistance = turf.distance(from, to, { units: "meters" });

          if (segmentDistance > 3) {
            const updated = [...prev, newPoint];

            // Update total distance
            setDistanceWalked((d) => d + segmentDistance);

            // 🔥 Auto close logic
            if (updated.length > 3) {
              const start = updated[0];
              const startPoint = turf.point([start[1], start[0]]);
              const currentPoint = turf.point([lng, lat]);
              const closeDistance = turf.distance(startPoint, currentPoint, { units: "meters" });

              if (closeDistance < 5) {
                finishPolygon(updated);
              }
            }

            return updated;
          }

          return prev;
        });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
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
          <div className="mb-4 text-center font-semibold text-green-800">
            Distance Walked: {distanceWalked.toFixed(1)} meters
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
          {!isLoaded ? (
            <div>Loading map...</div>
          ) : (
            <GoogleMap
              zoom={18}
              center={center}
              mapContainerClassName="map-container"
              mapContainerStyle={{ height: "500px", width: "100%" }}
              mapTypeId="satellite"
              options={{
                maxZoom: 22,
              }}
            >
              {userLocation && <Marker position={{ lat: userLocation[0], lng: userLocation[1] }} />}
              {points.length >= 2 && <Polyline path={points.map(p => ({ lat: p[0], lng: p[1] }))} />}
              {polygonClosed && <Polygon paths={points.map(p => ({ lat: p[0], lng: p[1] }))} />}
            </GoogleMap>
          )}

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