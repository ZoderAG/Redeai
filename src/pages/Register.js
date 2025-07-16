import React, { useState } from "react";
import { db } from "../firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  enableNetwork,
} from "firebase/firestore";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("O nome de utilizador é obrigatório.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

try {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  console.log("✅ Utilizador criado com UID:", user.uid);

  try {
    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
    });
    console.log(" Documento Firestore criado com sucesso");
  } catch (err) {
    console.error(" Erro no setDoc:", err);
    setError("Erro ao guardar dados no Firestore.");
    return;
  }

  setSuccess("Conta criada com sucesso! A redirecionar...");
  console.log(" Mensagem de sucesso definida");

  setTimeout(() => {
    console.log("➡️ A redirecionar para o seu Perfil");
    navigate("/profile");
  }, 2000);

    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Este email já está em uso.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email inválido.");
      } else if (err.code === "auth/weak-password") {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setError("Erro no registo: " + err.message);
      }
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Registar</h2>
      <form onSubmit={handleSubmit}>
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
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit">Registar</button>
      </form>

      <div className="auth-footer">
        Já tens conta? <a href="/login">Entra aqui</a>
      </div>
    </div>
  );
}
