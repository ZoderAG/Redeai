import React, { useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function ChooseUsername() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const snapshot = await getDocs(q);

      if (!auth.currentUser) throw new Error("Sem utilizador autenticado.");

      if (!snapshot.empty) {
        alert("Nome de utilizador já está em uso.");
        setLoading(false);
        return;
      }

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        username: username
      }, { merge: true });

      setLoading(false);
      navigate("/profile");
    } catch (err) {
      console.error("Erro ao definir username:", err);
      alert("Ocorreu um erro.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <h2>Escolhe o teu nome de utilizador</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome de utilizador"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "A guardar..." : "Confirmar"}
        </button>
      </form>
    </div>
  );
}
