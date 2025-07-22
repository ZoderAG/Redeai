import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import logo from "../images/logo.png";
import "../styles/Auth.css";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";


 
export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();
 
  const handleRegister = async (e) => {
    e.preventDefault();
 
    if (password !== confirm) {
      alert("As senhas não coincidem!");
      return;
    }
 
    try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert("Este nome de utilizador já está em uso.");
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: username });

    await setDoc(doc(db, "users", userCredential.user.uid), {
      username: username,
      email: email,
      createdAt: new Date()
    });

    navigate("/profile");
  } catch (error) {
    alert("Erro ao registar: " + error.message);
  }
};
 
  return (
    <div className="auth-container fade-in">
      <img src={logo} alt="Logo Redeai" />
      <h2>Registar</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nome de utilizador"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="Confirmar Senha"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button type="submit">Registar</button>
      </form>
 
      <p>
        Já tens conta? <a href="/login">Entra aqui</a>
      </p>
    </div>
  );
}
 