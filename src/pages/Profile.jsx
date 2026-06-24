import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";

function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showSecretCode, setShowSecretCode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    hostelDetails: "",
    collegeDetails: "",
    medicalInfo: "",
    secretCode: "",
  });

  const [contacts, setContacts] = useState([
    { name: "", phone: "", relation: "" },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        const u = res.data;
        setForm({
          name: u.name || "",
          phone: u.phone || "",
          bloodGroup: u.bloodGroup || "",
          hostelDetails: u.hostelDetails || "",
          collegeDetails: u.collegeDetails || "",
          medicalInfo: u.medicalInfo || "",
          secretCode: u.secretCode || "homework",
        });
        if (u.emergencyContacts && u.emergencyContacts.length > 0) {
          setContacts(u.emergencyContacts);
        }
      } catch (err) {
        setError("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContactChange = (index, e) => {
    const updated = [...contacts];
    updated[index][e.target.name] = e.target.value;
    setContacts(updated);
  };

  const addContact = () => {
    setContacts([...contacts, { name: "", phone: "", relation: "" }]);
  };

  const removeContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (form.secretCode.trim().length < 4) {
      setError("Disguise code must be at least 4 characters");
      setLoading(false);
      return;
    }

    try {
      await API.put("/auth/profile", { ...form, emergencyContacts: contacts });
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold text-pink-700 mb-6">My Profile</h1>

        {message && <p className="text-green-600 bg-green-50 p-3 rounded-lg mb-4">{message}</p>}
        {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-pink-600">Basic Information</h2>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
            />
            <input
              type="text"
              name="bloodGroup"
              placeholder="Blood Group (e.g. A+)"
              value={form.bloodGroup}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
            />
            <input
              type="text"
              name="hostelDetails"
              placeholder="Hostel Name / Room Number"
              value={form.hostelDetails}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
            />
            <input
              type="text"
              name="collegeDetails"
              placeholder="College Name"
              value={form.collegeDetails}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
            />
            <textarea
              name="medicalInfo"
              placeholder="Any medical info (allergies, conditions)"
              value={form.medicalInfo}
              onChange={handleFormChange}
              rows={3}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Disguise Code */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-pink-600">AI Assistant Disguise Code</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              In the AI Assistant, tapping "Hide App" disguises the screen as a notes app. Type this code word into that notes box to switch back instantly.
            </p>
            <div className="flex gap-2">
              <input
                type={showSecretCode ? "text" : "password"}
                name="secretCode"
                placeholder="Your disguise code word"
                value={form.secretCode}
                onChange={handleFormChange}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
              />
              <button
                type="button"
                onClick={() => setShowSecretCode(!showSecretCode)}
                className="px-4 border border-gray-300 rounded-lg text-gray-500 text-sm hover:bg-gray-50"
              >
                {showSecretCode ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-gray-400 text-xs">
              Choose something only you would think to type - a default word like "homework" is set until you change it. At least 4 characters.
            </p>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-pink-600">Emergency Contacts</h2>
            {contacts.map((contact, index) => (
              <div key={index} className="flex flex-col gap-2 border border-pink-100 rounded-xl p-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Contact Name"
                  value={contact.name}
                  onChange={(e) => handleContactChange(index, e)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={contact.phone}
                  onChange={(e) => handleContactChange(index, e)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
                />
                <input
                  type="text"
                  name="relation"
                  placeholder="Relation (e.g. Mother, Friend)"
                  value={contact.relation}
                  onChange={(e) => handleContactChange(index, e)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
                />
                {contacts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="text-red-500 text-sm hover:underline text-left"
                  >
                    Remove Contact
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addContact}
              className="text-pink-600 border border-pink-400 rounded-lg px-4 py-2 hover:bg-pink-50 transition"
            >
              + Add Another Contact
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition font-semibold text-lg"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Profile;
