import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

const FarmerProfile = () => {
  const { t, i18n } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [photoBase64, setPhotoBase64] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    location: "",
    land: "",
    crops: "",
  });

  const [display, setDisplay] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    land: "",
    photo: "/images/farmer-profile.jpg",
  });

  /* ---------- Load Profile ---------- */
  useEffect(() => {
    loadProfile();
  }, []);
  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await fetch("http://localhost:5000/farmer/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      console.log("PROFILE:", data);

      setForm({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
        age: data.age || "",
        location: data.farm_address || "",
        land: data.farm_size || "",
        crops: data.crop_type || "",
      });

      setDisplay({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
        age: data.age || "",
        land: data.farm_size || "",
        photo: data.photo || "/images/farmer-profile.jpg",
      });

      setPhotoBase64(data.photo || "");
      setEditMode(false);

    } catch (err) {
      console.error("LOAD PROFILE ERROR:", err.message);
      alert("Backend reachable issue or token problem");
    }
  };


  /* ---------- Handlers ---------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoBase64(reader.result);
      setDisplay({ ...display, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/farmer/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          age: form.age,
          farm_address: form.location,
          farm_size: form.land,
          crop_type: form.crops,
          photo: photoBase64,
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Update failed");

      alert("Profile updated successfully");
      loadProfile();
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
      <Navbar />

      {/* Page Background */}
      <section className="min-h-screen bg-gradient-to-br from-[#f8fad9] via-[#fbfdec] to-[#e9eedd] px-4 py-12 mt-15">
        <div className="max-w-6xl mx-auto">

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center text-[#132a13] tracking-wide">
            {t("farmerProfile.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* LEFT PROFILE CARD */}
            <div className="bg-white rounded-[28px] shadow-xl p-8 text-center border border-[#ecf39e]">
              <div className="relative inline-block">
                {(!display.photo || display.photo === "/images/farmer-profile.jpg") ? (
                  <div className="w-32 h-32 mx-auto rounded-full 
                           ring-4 ring-[#ecf39e] shadow-md bg-[#ecf39e] text-[#132a13] 
                           flex items-center justify-center font-bold text-5xl">
                    {display.name ? display.name.charAt(0).toUpperCase() : "F"}
                  </div>
                ) : (
                  <img
                    src={display.photo}
                    alt="Profile"
                    className="w-32 h-32 mx-auto rounded-full object-cover
                             ring-4 ring-[#ecf39e] shadow-md"
                  />
                )}
              </div>

              <p className="font-bold mt-5 text-xl text-[#132a13]">
                {display.name}
              </p>

              <div className="mt-6 text-sm space-y-2 text-[#31572c] text-left">
                <p><span className="font-semibold">Email:</span> {display.email}</p>
                <p><span className="font-semibold">Phone:</span> {display.phone}</p>
                <p><span className="font-semibold">Age:</span> {display.age}</p>
                {/* <p><span className="font-semibold">Land:</span> {display.land}</p> */}
              </div>
            </div>

            {/* RIGHT FORM CARD */}
            <div className="md:col-span-2 bg-white rounded-[28px] shadow-xl p-8 border border-[#ecf39e]">
              <h3 className="font-semibold mb-6 text-xl text-[#132a13] border-b pb-3">
                {t("farmerProfile.info")}
              </h3>

              {/* Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {["name", "phone", "email", "age"].map((field) => (
                  <input
                    key={field}
                    disabled={!editMode}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    placeholder={t(`farmerProfile.${field === "name" ? "fullName" : field}`)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm
                    transition-all
                    ${editMode
                        ? "border-[#4f772d] focus:ring-2 focus:ring-[#ecf39e] focus:outline-none"
                        : "bg-gray-100 cursor-not-allowed"
                      }
                  `}
                  />
                ))}
              </div>

              {/* Full-width Inputs */}
              {/* {["location", "land", "crops"].map((field, idx) => (
                <input
                  key={idx}
                  disabled={!editMode}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={t(`farmerProfile.${field}`)}
                  className={`mt-4 w-full px-4 py-3 rounded-xl border text-sm
                  transition-all
                  ${editMode
                      ? "border-[#4f772d] focus:ring-2 focus:ring-[#ecf39e] focus:outline-none"
                      : "bg-gray-100 cursor-not-allowed"
                    }
                `}
                />
              ))} */}

              {/* Photo Upload */}
              {editMode && (
                <div className="mt-5">
                  <label className="text-sm font-medium text-[#31572c] block mb-2">
                    {t("farmerProfile.photo")}
                  </label>
                  <input
                    type="file"
                    onChange={handlePhoto}
                    className="text-sm"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-6 py-2.5 rounded-xl border border-[#31572c]
                           text-[#31572c] font-medium
                           hover:bg-[#ecf39e] transition"
                >
                  {t("farmerProfile.edit")}
                </button>

                <button
                  onClick={handleSave}
                  disabled={!editMode}
                  className="px-6 py-2.5 rounded-xl bg-[#132a13]
                           text-[#ecf39e] font-medium
                           hover:bg-[#31572c] transition
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("farmerProfile.save")}
                </button>

                <button
                  onClick={loadProfile}
                  className="px-6 py-2.5 rounded-xl border
                           hover:bg-gray-100 transition"
                >
                  {t("farmerProfile.reset")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );

};

export default FarmerProfile;