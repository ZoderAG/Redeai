import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GameZone from "./pages/GameZone";
import ProtectedRoute from "./components/ProtectedRoute";
import NavigateToOwnProfile from "./components/NavigateToOwnProfile";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <NavigateToOwnProfile />
            </ProtectedRoute>
          }
        />
          <Route path="/gamezone" element={<GameZone />} />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
