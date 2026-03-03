import { MapContainer, TileLayer, Marker, Polyline, Polygon, useMapEvent, useMap } from "react-leaflet";
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

/* Recenter map when location is fetched */
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 18, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}


export default function Geofencing() {
  const navigate = useNavigate();

  const [points, setPoints] = useState([]);
  const [farmName, setFarmName] = useState("");
  const [farmAddress, setFarmAddress] = useState("");
  const [areaInAcres, setAreaInAcres] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingLand, setCheckingLand] = useState(true); // Check if farmer has land

  const [polygonClosed, setPolygonClosed] = useState(false);
  const [userLocation, setUserLocation] = useState(null);


  /* Check if farmer already has land */
  useEffect(() => {
    const checkFarmerLand = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setCheckingLand(false);
          return;
        }

        const res = await fetch(`${API}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          // If farmer already added land, redirect to dashboard
          if (userData.isFarmLocationAdded) {
            navigate("/farmer/dashboard");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking farmer land:", error);
      } finally {
        setCheckingLand(false);
      }
    };

    checkFarmerLand();
  }, [navigate]);

  /* Get initial location once and center map */
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        console.log("📍 User location fetched:", loc);
        setUserLocation(loc);
      },
      (err) => {
        console.error("📍 Location error:", err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  /* Add point from map click */
  const addPoint = (newPoint) => {
    setPoints((prev) => {
      const updated = [...prev, newPoint];
      return updated;
    });
  };

  /* component to capture clicks on map */
  function ClickHandler() {
    useMapEvent("click", (e) => {
      if (polygonClosed) return;
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      addPoint([lat, lng]);
    });
    return null;
  }

  /* Finish polygon */
  const finishPolygon = (finalPoints) => {
  if (!finalPoints || finalPoints.length < 3) {
    alert("You need at least 3 points to compute area");
    return;
  }

  try {
    const coords = finalPoints.map((p) => {
      if (!p || p.length !== 2) {
        throw new Error("Invalid coordinate format");
      }
      return [p[1], p[0]];
    });

    coords.push(coords[0]); // close polygon

    const polygon = turf.polygon([coords]);
    const areaSqMeters = turf.area(polygon);
    const acres = areaSqMeters * 0.000247105;
    // round to two decimal places for display
    setAreaInAcres(parseFloat(acres.toFixed(2)));
    setPolygonClosed(true);

  } catch (error) {
    console.error("Polygon error:", error);
    alert("Error calculating land area. Please try again.");
  }
};


  /* Save land */
  const handleSubmit = async () => {
    if (points.length < 3) {
      alert("You need at least 3 points to create a boundary");
      return;
    }

    if (!farmName.trim()) {
      alert("Please enter a farm name");
      return;
    }

    if (!farmAddress.trim()) {
      alert("Please enter a farm address");
      return;
    }

    if (!areaInAcres || parseFloat(areaInAcres) <= 0) {
      alert("Please click 'Finish & Calculate' to calculate the land area first");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      // Convert points to GeoJSON format: [longitude, latitude] for each point
      const geoJsonCoordinates = points.map((point) => [
        point[1], // longitude
        point[0], // latitude
      ]);

      // Close the polygon by adding the first point at the end
      geoJsonCoordinates.push(geoJsonCoordinates[0]);

      console.log("Sending coordinates:", geoJsonCoordinates);
      console.log("Farm data:", { farmName, farmAddress, areaInAcres });

      const res = await fetch(`${API}/auth/add-land`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          farmName: farmName.trim(),
          farmAddress: farmAddress.trim(),
          areaInAcres: parseFloat(areaInAcres),
          coordinates: geoJsonCoordinates,
        }),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (!res.ok) {
        alert(`Error: ${data.message || "Failed to save land"}`);
        return;
      }

      alert("Land saved successfully 🌾");
      navigate("/farmer/dashboard");
    } catch (error) {
      console.error("Save land error:", error);
      alert(`Error: ${error.message || "Server error while saving land"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {checkingLand ? (
        <div className="min-h-screen bg-[#f8fad9] py-4 md:py-10 px-2 md:px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-[#132a13]">Checking your farm location...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-[#f8fad9] py-4 md:py-10 px-2 md:px-4">
        <div className="w-full md:max-w-6xl md:mx-auto bg-white rounded-2xl md:mt-10 mt-2 shadow-lg p-4 md:p-6">

          <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#132a13]">
            Map Your Farm 🌍
          </h2>


          {/* Info Display - Mobile optimized */}
          <div className="mb-4 text-center font-semibold text-green-800 space-y-1 text-sm md:text-base">
            <div> Points: {points.length}</div>
            {areaInAcres && <div className="text-base md:text-lg text-blue-700 font-bold">🏞️ Area: {areaInAcres} acres</div>}
          </div>

          {/* Inputs - Stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 md:mb-6">
            <input
              placeholder="Farm Name"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className="border rounded-lg px-3 md:px-4 py-2 text-sm md:text-base"
            />
            <input
              placeholder="Farm Address"
              value={farmAddress}
              onChange={(e) => setFarmAddress(e.target.value)}
              className="border rounded-lg px-3 md:px-4 py-2 text-sm md:text-base"
            />
            <input
              placeholder="Area (Auto)"
              value={areaInAcres}
              readOnly
              className="border rounded-lg px-3 md:px-4 py-2 bg-gray-100 text-sm md:text-base"
            />
          </div>

          {/* Click on the map to drop points, then finish */}
          <div className="flex justify-center gap-2 mb-4 md:mb-6">
            <button
              onClick={() => finishPolygon(points)}
              className="bg-red-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-red-700 transition text-sm md:text-base font-semibold active:scale-95"
            >
              Finish & Calculate 📐
            </button>
          </div>

          {/* MAP - Mobile optimized height */}
          <MapContainer
            center={userLocation || [10.7905, 78.7047]}
            zoom={18}
            maxZoom={22}
            style={{ height: "300px", width: "100%" }}
            className="md:h-modal"
          >
            <ClickHandler />
            <RecenterMap position={userLocation} />

            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" opacity={0.4} />

            
            {/* Render markers for each captured point */}
            {points.map((point, idx) => (
              <Marker key={idx} position={point} title={`Point ${idx + 1}`}>
              </Marker>
            ))}
            {/* a little tooltip marker at cursor would require extra state; not added now */}            
            {/* Draw polyline connecting all points */}
            {points.length >= 2 && <Polyline positions={points} color="blue" weight={3} />}
            
            {/* Draw filled polygon when closed */}
            {polygonClosed && <Polygon positions={points} color="green" fillColor="lightgreen" fillOpacity={0.5} />}

          </MapContainer>

          <div className="text-center mt-4 md:mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#132a13] text-[#ecf39e] px-6 md:px-8 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base active:scale-95 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Land"}
            </button>
          </div>

        </div>
      </div>
      )}

      <Footer />
    </>
  );
}