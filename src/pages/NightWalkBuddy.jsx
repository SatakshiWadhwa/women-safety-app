import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { io } from "socket.io-client";
import Icon from "../components/Icon";

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
      alert("PANIC ALERT from " + data.userName + ": " + data.message);
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
      const res = await API.put("/buddy/join/" + id);
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
      await API.put("/buddy/complete/" + id);
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
      await API.put("/buddy/cancel/" + id);
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

  const statusStyle = {
    open: "bg-dusk/10 text-dusk",
    matched: "bg-signal/10 text-signal",
    completed: "bg-slate/10 text-slate",
    cancelled: "bg-beacon/10 text-beacon",
  };

  return (
    <div className="min-h-screen bg-paper p-6">
      <div className="max-w-2xl mx-auto">

        <h1 className="font-display text-3xl text-ink mb-2">Night Walk Buddy</h1>
        <p className="text-slate mb-6">Find a verified student to walk with you safely</p>

        {message && (
          <p className="bg-dusk/8 text-dusk p-3 rounded-lg mb-4 text-sm">{message}</p>
        )}

        {activeWalk && (
          <div className="bg-signal/8 border border-signal/25 rounded-2xl p-5 mb-6">
            <h2 className="text-signal font-display text-lg mb-1">Walk in progress</h2>
            <p className="text-slate text-sm flex items-center gap-1.5">
              {activeWalk.from} <Icon name="arrow" className="w-3.5 h-3.5" strokeWidth={2} /> {activeWalk.to}
            </p>
            <div className="flex gap-3 mt-3">
              <button onClick={() => handleComplete(activeWalk._id)} className="bg-signal text-white px-4 py-2 rounded-full hover:opacity-90 transition text-sm font-medium">
                Mark safe arrival
              </button>
              <button onClick={handlePanic} className="bg-beacon text-white px-4 py-2 rounded-full hover:bg-beacon-dark transition text-sm font-medium">
                Panic
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {["find", "post", "my"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={"px-4 py-2.5 rounded-full font-medium transition text-sm " + (tab === t ? "bg-ink text-white" : "bg-white text-slate border border-slate/15 hover:border-ink/30")}
            >
              {t === "find" ? "Find buddy" : t === "post" ? "Post walk" : "My requests"}
            </button>
          ))}
        </div>

        {tab === "find" && (
          <div className="flex flex-col gap-3">
            {requests.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate/10 p-6 text-center text-slate text-sm">
                No walk requests available right now. Check back later or post your own.
              </div>
            ) : (
              requests.map((req) => (
                <div key={req._id} className="bg-white rounded-2xl shadow-sm border border-slate/10 p-5">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="font-display text-lg text-ink">{req.userName}</p>
                      <p className="text-slate text-sm mt-1 flex items-center gap-1.5">
                        {req.from} <Icon name="arrow" className="w-3.5 h-3.5" strokeWidth={2} /> {req.to}
                      </p>
                      <p className="text-slate text-xs mt-1">Departure: {req.departureTime}</p>
                    </div>
                    <button onClick={() => handleJoin(req._id)} className="bg-dusk text-white px-4 py-2 rounded-full hover:bg-dusk-light transition text-sm font-medium whitespace-nowrap">
                      Join walk
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "post" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate/10 p-6">
            <h2 className="font-display text-lg text-ink mb-4">Post a walk request</h2>
            <form onSubmit={handlePost} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Starting from (e.g. Hostel Block A)"
                value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                className="border border-slate/20 rounded-lg px-4 py-2.5 focus:outline-none focus:border-dusk transition"
                required
              />
              <input
                type="text"
                placeholder="Going to (e.g. Library, Metro Station)"
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className="border border-slate/20 rounded-lg px-4 py-2.5 focus:outline-none focus:border-dusk transition"
                required
              />
              <input
                type="time"
                value={form.departureTime}
                onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                className="border border-slate/20 rounded-lg px-4 py-2.5 focus:outline-none focus:border-dusk transition"
                required
              />
              <button type="submit" disabled={loading} className="bg-dusk text-white py-3 rounded-full hover:bg-dusk-light transition font-semibold">
                {loading ? "Posting..." : "Post walk request"}
              </button>
            </form>
          </div>
        )}

        {tab === "my" && (
          <div className="flex flex-col gap-3">
            {myRequests.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate/10 p-6 text-center text-slate text-sm">
                You have not posted any walk requests yet.
              </div>
            ) : (
              myRequests.map((req) => (
                <div key={req._id} className="bg-white rounded-2xl shadow-sm border border-slate/10 p-5">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="text-slate text-sm flex items-center gap-1.5">
                        {req.from} <Icon name="arrow" className="w-3.5 h-3.5" strokeWidth={2} /> {req.to}
                      </p>
                      <p className="text-slate text-xs mt-1">Departure: {req.departureTime}</p>
                    </div>
                    <span className={"px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap " + (statusStyle[req.status] || statusStyle.open)}>
                      {req.status}
                    </span>
                  </div>
                  {req.status === "open" && (
                    <button onClick={() => handleCancel(req._id)} className="mt-3 text-beacon text-sm border border-beacon/30 px-3 py-1.5 rounded-full hover:bg-beacon/5 transition">
                      Cancel request
                    </button>
                  )}
                  {req.status === "matched" && (
                    <button onClick={() => handleComplete(req._id)} className="mt-3 bg-signal text-white px-4 py-2 rounded-full hover:opacity-90 transition text-sm font-medium">
                      Mark safe arrival
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
