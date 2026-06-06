import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/verify-otp", { email, otp });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/auth/reset-password", { email, otp, newPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-pink-700 mb-2 text-center">Forgot Password</h1>

        {/* Steps indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className={"w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold " + (step >= s ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-500")}>
              {s}
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-3 rounded-lg">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-4 text-center bg-green-50 p-3 rounded-lg">{message}</p>}

        {/* Step 1 - Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
            <p className="text-gray-500 text-sm text-center">Enter your registered email to receive OTP</p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
              required
            />
            <button type="submit" disabled={loading} className="bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition">
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2 - Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
            <p className="text-gray-500 text-sm text-center">Enter the 6-digit OTP sent to {email}</p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500 text-center text-2xl tracking-widest"
              required
            />
            <button type="submit" disabled={loading} className="bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button type="button" onClick={() => { setStep(1); setError(""); setMessage(""); }} className="text-pink-600 text-sm hover:underline">
              Resend OTP
            </button>
          </form>
        )}

        {/* Step 3 - New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <p className="text-gray-500 text-sm text-center">Create a strong new password</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-700">
              Password must have: 8+ characters, uppercase, lowercase, number, special character (!@#$%^&*)
            </div>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
              required
            />
            <button type="submit" disabled={loading} className="bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-4">
          Remember your password?{" "}
          <Link to="/login" className="text-pink-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
