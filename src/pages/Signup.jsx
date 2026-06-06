import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return strength;
  };

  const strengthLabels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const strengthColors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  const strength = getPasswordStrength(form.password);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await API.post("/auth/register", form);
      login(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-pink-700 mb-6 text-center">Create Account</h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-3 rounded-lg">{error}</p>}
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
            required
          />
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500 w-full"
              required
            />
            {form.password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className={"h-1 flex-1 rounded " + (strength >= i ? strengthColors[strength] : "bg-gray-200")} />
                  ))}
                </div>
                <p className={"text-xs " + (strength >= 4 ? "text-green-600" : "text-orange-500")}>
                  {strengthLabels[strength]}
                </p>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Must have 8+ chars, uppercase, lowercase, number, special char (!@#$%^&*)
            </p>
          </div>
          <button
            type="submit"
            disabled={loading || strength < 5}
            className={"text-white py-2 rounded-lg transition " + (strength === 5 ? "bg-pink-600 hover:bg-pink-700" : "bg-gray-400 cursor-not-allowed")}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
