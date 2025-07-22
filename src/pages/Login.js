import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "../firebase";
import "../styles/Auth.css";
import logo from "../images/logo.png";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
 
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
 
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (error) {
      alert("Erro ao entrar: " + error.message);
    }
  };
 
const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists() || !userDoc.data().username) {
      // Cria documento básico se ainda não existir
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: user.email,
          createdAt: new Date()
        });
      }
      // Redireciona para página onde escolhe o username
      navigate("/choose-username");
    } else {
      navigate("/profile");
    }
  } catch (error) {
    alert("Erro com login do Google: " + error.message);
  }
};
 
  const handlePasswordReset = async () => {
    if (!email) {
      alert("Por favor, insira seu email para redefinir a senha.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Um email de redefinição de senha foi enviado.");
    } catch (error) {
      alert("Erro ao enviar email: " + error.message);
    }
  };
 
  return (
    <div className="auth-container fade-in">
      <img src={logo} alt="Logo Redeai" />
      <h2>Entrar</h2>
 
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
 
      <button className="google-btn" onClick={handleGoogleLogin}>
        <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3">
          <path fill="#4285f4" d="M533.5 278.4c0-17.4-1.5-34.1-4.4-50.2H272v95.1h146.7c-6.3 33.9-25.1 62.5-53.6 81.7v67h86.7c50.8-46.8 81.7-115.8 81.7-193.6z"/>
          <path fill="#34a853" d="M272 544.3c72.7 0 133.8-24.1 178.5-65.6l-86.7-67c-24.1 16.2-55 25.8-91.8 25.8-70.6 0-130.5-47.7-151.9-111.6h-89.2v70.3c44.6 88.4 136.6 148.1 241.1 148.1z"/>
          <path fill="#fbbc04" d="M120.1 325.9c-10.7-31.9-10.7-66.5 0-98.4V157.2H30.9c-36.4 71.9-36.4 157.2 0 229.1l89.2-70.4z"/>
          <path fill="#ea4335" d="M272 107.1c39.6 0 75.2 13.7 103.3 40.5l77.4-77.4C405.8 25.3 344.7 0 272 0 167.5 0 75.5 59.7 30.9 157.2l89.2 70.3c21.4-63.9 81.3-111.6 151.9-111.6z"/>
        </svg>
        Entrar com Google
      </button>
 
      <p>
        <a href="#" onClick={(e) => { e.preventDefault(); handlePasswordReset(); }}>
          Esqueci minha senha
        </a>
      </p>
      <p>
        Não tens conta? <a href="/register">Regista-te aqui</a>
      </p>
      <p>
        <a href="/">Voltar ao início</a>
      </p>
    </div>
  );
}