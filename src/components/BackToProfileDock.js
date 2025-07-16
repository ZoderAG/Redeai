import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "../styles/BackToProfileDock.css";

export default function BackToProfileDock() {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const handleBackToProfile = () => {
    if (currentUser) {
      navigate(`/profile/${currentUser.uid}`);
    }
  };

 return (
    <div className="logout-dock" style={{ top: "calc(50% - 50px)" }}>
      {/* reaproveitando a mesma classe do botão logout */}
      <button className="logout-button" onClick={() => navigate("/profile")}>
        Voltar ao Meu Perfil
      </button>
    </div>
  );
}
