import { useState, useEffect, useRef } from "react";

function FakeCall() {
  const [callerName, setCallerName] = useState("Mom");
  const [delay, setDelay] = useState(5);
  const [status, setStatus] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef(null);
  const callTimerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const ringIntervalRef = useRef(null);

  const playRingtone = () => {
    const playBeepCycle = () => {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 480;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.4, ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0, ctx.currentTime + 1.0);
      osc.start();
      osc.stop(ctx.currentTime + 1.0);
    };
    playBeepCycle();
    ringIntervalRef.current = setInterval(playBeepCycle, 2000);
  };

  const stopRingtone = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  const startCountdown = () => {
    setStatus("waiting");
    setTimeLeft(delay);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setStatus("ringing");
          playRingtone();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const answerCall = () => {
    stopRingtone();
    setStatus("ongoing");
    setCallDuration(0);
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const endCall = () => {
    stopRingtone();
    clearInterval(callTimerRef.current);
    setStatus("idle");
    setCallDuration(0);
  };

  const cancelCountdown = () => {
    clearInterval(timerRef.current);
    stopRingtone();
    setStatus("idle");
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(callTimerRef.current);
      stopRingtone();
    };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (status === "ringing") {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-between py-16 px-6">
        <div className="flex flex-col items-center gap-4 mt-10">
          <div className="w-24 h-24 rounded-full bg-pink-500 flex items-center justify-center text-4xl text-white font-bold shadow-lg animate-pulse">
            {callerName.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-white text-3xl font-bold">{callerName}</h2>
          <p className="text-gray-400 text-lg">Incoming Call...</p>
        </div>
        <div className="flex gap-16 mb-10">
          <button onClick={endCall} className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl shadow-lg hover:bg-red-600">
            ✕
          </button>
          <button onClick={answerCall} className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl shadow-lg hover:bg-green-600">
            ✆
          </button>
        </div>
      </div>
    );
  }

  if (status === "ongoing") {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-between py-16 px-6">
        <div className="flex flex-col items-center gap-4 mt-10">
          <div className="w-24 h-24 rounded-full bg-pink-500 flex items-center justify-center text-4xl text-white font-bold shadow-lg">
            {callerName.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-white text-3xl font-bold">{callerName}</h2>
          <p className="text-green-400 text-lg">{formatTime(callDuration)}</p>
          <p className="text-gray-400 text-sm">Ongoing call...</p>
        </div>
        <button onClick={endCall} className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl shadow-lg hover:bg-red-600 mb-10">
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-pink-700 mb-2">Fake Call</h1>
        <p className="text-gray-500 mb-6">Schedule a fake incoming call to escape unsafe situations</p>

        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-5">
          <div>
            <label className="text-gray-600 font-medium block mb-2">Caller Name</label>
            <input
              type="text"
              value={callerName}
              onChange={(e) => setCallerName(e.target.value)}
              placeholder="e.g. Mom, Friend, Boss"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="text-gray-600 font-medium block mb-2">Call me in</label>
            <div className="flex gap-3">
              {[5, 10, 30, 60].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setDelay(sec)}
                  className={"flex-1 py-2 rounded-lg border font-medium transition " + (delay === sec ? "bg-pink-600 text-white border-pink-600" : "bg-white text-gray-600 border-gray-300 hover:border-pink-400")}
                >
                  {sec < 60 ? sec + "s" : "1m"}
                </button>
              ))}
            </div>
          </div>

          {status === "idle" && (
            <button
              onClick={startCountdown}
              className="bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition font-semibold text-lg"
            >
              Schedule Fake Call
            </button>
          )}

          {status === "waiting" && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-pink-600 font-semibold text-xl">Call coming in {timeLeft}s...</p>
              <button onClick={cancelCountdown} className="text-red-500 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-50 transition">
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="bg-pink-100 rounded-2xl p-4 mt-6">
          <p className="text-pink-700 font-medium mb-1">How to use:</p>
          <p className="text-pink-600 text-sm">Set a caller name and delay, then press Schedule. When the call comes in, answer it to pretend you are on a real call and escape safely.</p>
        </div>
      </div>
    </div>
  );
}

export default FakeCall;
