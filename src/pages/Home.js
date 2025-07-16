import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "../styles/Home.css";
import logo from '../images/logo.png';

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
      if (user) {
        navigate("/profile");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const toggleTheme = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <div className="home-container">
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkMode ? "Modo Claro ☀️" : "Modo Escuro 🌙"}
      </button>
      <h1>Bem-vindo ao Site!</h1>
        <img src={logo} alt="Logo RedEaI" className="logo" />
      <div className="buttons-container">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Registar</button>
      </div>
    </div>
  );
}
