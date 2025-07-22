import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "../styles/Home.css";
import logo from "../images/logo.png";
 
export default function Home() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
 
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
 
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) navigate("/profile");
    });
 
    return () => unsubscribe();
  }, [navigate]);
 
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle("dark-mode", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };
 
  return (
    <div className="home-container">
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkMode ? "Modo Claro ☀️" : "Modo Escuro 🌙"}
      </button>
 
      <div className="home-card">
        <img src={logo} alt="Logo Redeai" className="inner-logo" />
        <h1 className="main-title">Bem-vindo à Redeai!</h1>
        <p className="slogan">Conecte. Compartilhe. Jogue.</p>
 
        <div className="buttons-container vertical">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Registar</button>
        </div>
      </div>
    </div>
  );
}
 