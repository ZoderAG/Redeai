import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BackToProfileDock.css"; // usa o mesmo estilo

export default function GameZoneDock() {
  const navigate = useNavigate();

  const handleGoToGameZone = () => {
    navigate("/gamezone");
  };

  return (
    <div className="logout-dock" style={{ top: "calc(50% + 10px)" }}>
      {/* reaproveita o estilo do botão logout */}
      <button className="logout-button" onClick={handleGoToGameZone}>
        🎮 Ir para GameZone
      </button>
    </div>
  );
}
