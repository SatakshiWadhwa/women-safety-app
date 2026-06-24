import { useState, useEffect, useRef } from "react";
import Icon from "../components/Icon";

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
      <div className="min-h-screen bg-ink flex flex-col items-center justify-between py-16 px-6">
        <div className="flex flex-col items-center gap-4 mt-10">
          <div className="w-24 h-24 rounded-full bg-beacon flex items-center justify-center text-4xl text-white font-display shadow-lg animate-pulse">
            {callerName.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-display text-white text-3xl">{callerName}</h2>
          <p className="text-white/50 text-lg">Incoming call...</p>
        </div>
        <div className="flex gap-16 mb-10">
          <button onClick={endCall} className="w-16 h-16 rounded-full bg-beacon flex items-center justify-center text-white shadow-lg hover:bg-beacon-dark transition">
            <Icon name="close" className="w-6 h-6" strokeWidth={2.2} />
          </button>
          <button onClick={answerCall} className="w-16 h-16 rounded-full bg-signal flex items-center justify-center text-white shadow-lg hover:opacity-90 transition">
            <Icon name="phone" className="w-6 h-6" strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  if (status === "ongoing") {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-between py-16 px-6">
        <div className="flex flex-col items-center gap-4 mt-10">
          <div className="w-24 h-24 rounded-full bg-beacon flex items-center justify-center text-4xl text-white font-display shadow-lg">
            {callerName.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-display text-white text-3xl">{callerName}</h2>
          <p className="text-signal text-lg">{formatTime(callDuration)}</p>
          <p className="text-white/50 text-sm">Ongoing call...</p>
        </div>
        <button onClick={endCall} className="w-16 h-16 rounded-full bg-beacon flex items-center justify-center text-white shadow-lg hover:bg-beacon-dark transition mb-10">
          <Icon name="close" className="w-6 h-6" strokeWidth={2.2} />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper p-6">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-3xl text-ink mb-2">Fake Call</h1>
        <p className="text-slate mb-6">Schedule a believable incoming call to exit a situation fast</p>

        <div className="bg-white rounded-2xl shadow-sm border border-slate/10 p-6 flex flex-col gap-5">
          <div>
            <label className="text-slate text-sm font-medium block mb-2">Caller name</label>
            <input
              type="text"
              value={callerName}
              onChange={(e) => setCallerName(e.target.value)}
              placeholder="e.g. Mom, Friend, Boss"
              className="w-full border border-slate/20 rounded-lg px-4 py-2.5 focus:outline-none focus:border-dusk transition"
            />
          </div>

          <div>
            <label className="text-slate text-sm font-medium block mb-2">Call me in</label>
            <div className="flex gap-3">
              {[5, 10, 30, 60].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setDelay(sec)}
                  className={"flex-1 py-2 rounded-lg border font-medium transition text-sm " + (delay === sec ? "bg-ink text-white border-ink" : "bg-white text-slate border-slate/20 hover:border-ink/30")}
                >
                  {sec < 60 ? sec + "s" : "1m"}
                </button>
              ))}
            </div>
          </div>

          {status === "idle" && (
            <button
              onClick={startCountdown}
              className="bg-beacon text-white py-3.5 rounded-full hover:bg-beacon-dark transition font-semibold shadow-lg shadow-beacon/20"
            >
              Schedule fake call
            </button>
          )}

          {status === "waiting" && (
            <div className="flex flex-col items-center gap-3">
              <p className="font-display text-dusk text-xl">Call coming in {timeLeft}s...</p>
              <button onClick={cancelCountdown} className="text-beacon border border-beacon/30 px-4 py-2 rounded-full hover:bg-beacon/5 transition text-sm">
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="bg-dusk/5 border border-dusk/15 rounded-2xl p-4 mt-6">
          <p className="text-ink font-medium text-sm mb-1">How to use</p>
          <p className="text-slate text-sm leading-relaxed">Set a caller name and delay, then press Schedule. When the call comes in, answer it to pretend you are on a real call and exit safely.</p>
        </div>
      </div>
    </div>
  );
}

export default FakeCall;
