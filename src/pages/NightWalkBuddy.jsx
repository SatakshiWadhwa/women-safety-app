import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { io } from "socket.io-client";

const socket = io("https://safecampus-backend-4c6u.onrender.com");

function NightWalkBuddy() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("find");
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeWalk, setActiveWalk] = useState(null);
  const [panicSent, setPanicSent] = useState(false);
  const locationRef = useRef(null);

  const [form, setForm] = useState({
    from: "",
    to: "",
    departureTime: "",
  });

  useEffect(() => {
    if (user) {
      socket.emit("join", user.id);
    }

    fetchRequests();
    fetchMyRequests();

    socket.on("buddy_request_update", () => {
      fetchRequests();
    });

    socket.on("buddy_panic", (data) => {
      alert(`PANIC ALERT from ${data.userName}: ${data.message}`);
    });

    socket.on("buddy_completed", () => {
      fetchMyRequests();
    });

    return () => {
      socket.off("buddy_request_update");
      socket.off("buddy_panic");
      socket.off("buddy_completed");
      if (locationRef.current) {
        clearInterval(locationRef.current);
      }
    };
  }, [user]);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/buddy/requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const res = await API.get("/buddy/my-requests");
      setMyRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await API.post("/buddy/request", {
        ...form,
        userName: user?.name || "Anonymous",
      });
      setMessage("Walk request posted successfully!");
      socket.emit("new_buddy_request", res.data.request);
      fetchMyRequests();
      setForm({ from: "", to: "", departureTime: "" });
      setTab("my");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to post request");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (id) => {
    try {
      const res = await API.put(`/buddy/join/${id}`);
      setActiveWalk(res.data.request);
      setMessage("Buddy matched! Walk together safely.");
      startLocationSharing();
      fetchRequests();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to join");
    }
  };

  const handleComplete = async (id) => {
    try {
      await API.put(`/buddy/complete/${id}`);
      setActiveWalk(null);
      setPanicSent(false);
      if (locationRef.current) clearInterval(locationRef.current);
      socket.emit("walk_completed", { userId: user?.id });
      setMessage("Walk completed safely!");
      fetchMyRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id) => {
    try {
      await API.put(`/buddy/cancel/${id}`);
      setMessage("Request cancelled");
      fetchMyRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePanic = () => {
    socket.emit("panic", {
      userName: user?.name || "Unknown",
      message: "EMERGENCY during Night Walk! Immediate help needed!",
      userId: user?.id,
    });
    setPanicSent(true);
    navigate("/sos");
  };

  const startLocationSharing = () => {
    if (navigator.geolocation) {
      locationRef.current = setInterval(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
          socket.emit("location_update", {
            userId: user?.id,
            userName: user?.name,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        });
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold text-pink-700 mb-2">Night Walk Buddy</h1>
        <p className="text-gray-500 mb-6">Find a verified student to walk with you safely</p>

        {message && (
          <p className="bg-pink-100 text-pink-700 p-3 rounded-lg mb-4">{message}</p>
        )}

        {/* Active Walk Banner */}
        {activeWalk && (
          <div className="bg-green-50 border border-green-300 rounded-2xl p-4 mb-6">
            <h2 className="text-green-700 font-bold text-lg mb-1">Walk in Progress</h2>
            <p className="text-green-600 text-sm">
              {activeWalk.from} ? {activeWalk.to}
            </p>
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleComplete(activeWalk._id)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Mark Safe Arrival
              </button>
              <button
                onClick={handlePanic}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                PANIC
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["find", "post", "my"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                tab === t
                  ? "bg-pink-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-pink-400"
              }`}
            >
              {t === "find" ? "Find Buddy" : t === "post" ? "Post Walk" : "My Requests"}
            </button>
          ))}
        </div>

        {/* FIND BUDDY TAB */}
        {tab === "find" && (
          <div className="flex flex-col gap-3">
            {requests.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-400">
                No walk requests available right now. Check back later or post your own!
              </div>
            ) : (
              requests.map((req) => (
                <div key={req._id} className="bg-white rounded-2xl shadow p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-pink-700 text-lg">{req.userName}</p>
                      <p className="text-gray-600 mt-1">
                        From: <span className="font-medium">{req.from}</span>
                      </p>
                      <p className="text-gray-600">
                        To: <span className="font-medium">{req.to}</span>
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Departure: {req.departureTime}
                      </p>
                    </div>
                    <button
                      onClick={() => handleJoin(req._id)}
                      className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
                    >
                      Join Walk
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* POST WALK TAB */}
        {tab === "post" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold text-pink-600 mb-4">Post a Walk Request</h2>
            <form onSubmit={handlePost} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Starting from (e.g. Hostel Block A)"
                value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
                required
              />
              <input
                type="text"
                placeholder="Going to (e.g. Library, Metro Station)"
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
                required
              />
              <input
                type="time"
                value={form.departureTime}
                onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition font-semibold"
              >
                {loading ? "Posting..." : "Post Walk Request"}
              </button>
            </form>
          </div>
        )}

        {/* MY REQUESTS TAB */}
        {tab === "my" && (
          <div className="flex flex-col gap-3">
            {myRequests.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-400">
                You have not posted any walk requests yet.
              </div>
            ) : (
              myRequests.map((req) => (
                <div key={req._id} className="bg-white rounded-2xl shadow p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-600">
                        From: <span className="font-medium">{req.from}</span>
                      </p>
                      <p className="text-gray-600">
                        To: <span className="font-medium">{req.to}</span>
                      </p>
                      <p className="text-gray-500 text-sm">Departure: {req.departureTime}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      req.status === "open" ? "bg-blue-100 text-blue-600" :
                      req.status === "matched" ? "bg-green-100 text-green-600" :
                      req.status === "completed" ? "bg-gray-100 text-gray-600" :
                      "bg-red-100 text-red-600"
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  {req.status === "open" && (
                    <button
                      onClick={() => handleCancel(req._id)}
                      className="mt-3 text-red-500 text-sm border border-red-300 px-3 py-1 rounded-lg hover:bg-red-50 transition"
                    >
                      Cancel Request
                    </button>
                  )}
                  {req.status === "matched" && (
                    <button
                      onClick={() => handleComplete(req._id)}
                      className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                      Mark Safe Arrival
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default NightWalkBuddy;
