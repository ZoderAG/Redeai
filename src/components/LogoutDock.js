import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/LogoutDock.css";

export default function LogoutDock() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="logout-dock">
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}
