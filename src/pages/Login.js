import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../styles/Auth.css";

export default function Login() {
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let emailToUse = loginInput;

      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginInput);

      if (!isEmail) {
        const q = query(collection(db, "users"), where("username", "==", loginInput));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("Nome de utilizador não encontrado.");
          return;
        }

        emailToUse = querySnapshot.docs[0].data().email;
      }
      await signInWithEmailAndPassword(auth, emailToUse, password);
      navigate("/profile");
    } catch (err) {
      setError("Email, utilizador ou senha inválidos.");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email ou Nome de utilizador"
          value={loginInput}
          onChange={(e) => setLoginInput(e.target.value)}
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error && <p style={{ color: "var(--error-color)" }}>{error}</p>}
        <button type="submit">Entrar</button>
      </form>
      <div className="auth-footer">
        Ainda não tens conta? <a href="/register">Regista-te aqui</a>
      </div>
    </div>
  );
}
