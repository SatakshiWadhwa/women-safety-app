import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await API.post("/auth/login", form);
      login(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-pink-700 mb-6 text-center">Welcome Back</h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-3 rounded-lg">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
            required
          />
          <div className="text-right">
            <Link to="/forgot-password" className="text-pink-600 text-sm hover:underline">
              Forgot Password?
            </Link>
          </div>
          <button type="submit" disabled={loading} className="bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Do not have an account?{" "}
          <Link to="/signup" className="text-pink-600 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
