import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SOS from "./pages/SOS";
import AIAssistant from "./pages/AIAssistant";
import FakeCall from "./pages/FakeCall";
import SelfDefense from "./pages/SelfDefense";
import NightWalkBuddy from "./pages/NightWalkBuddy";
import SafePlaces from "./pages/SafePlaces";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/sos" element={<ProtectedRoute><SOS /></ProtectedRoute>} />
          <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
          <Route path="/fake-call" element={<ProtectedRoute><FakeCall /></ProtectedRoute>} />
          <Route path="/self-defense" element={<ProtectedRoute><SelfDefense /></ProtectedRoute>} />
          <Route path="/buddy" element={<ProtectedRoute><NightWalkBuddy /></ProtectedRoute>} />
          <Route path="/safe-places" element={<ProtectedRoute><SafePlaces /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
