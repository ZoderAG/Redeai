import { useState, useEffect } from "react";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import LogoutDock from "../components/LogoutDock";
import BackToProfileDock from "../components/BackToProfileDock";
import GameZoneDock from "../components/GameZoneDock";
import Posts from "../components/Posts";
 
export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
 
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("Online");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
 
  const currentUser = auth.currentUser;
 
  useEffect(() => {
  document.body.classList.add('profile-page');
  return () => document.body.classList.remove('profile-page');
}, []);

  // Carrega tema do localStorage e aplica data-theme no <html>
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setDarkMode(false);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);
 
  // Busca dados do utilizador
  useEffect(() => {
    const idToLoad = userId || auth.currentUser?.uid;
    if (!idToLoad) return;
 
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", idToLoad);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser({ uid: idToLoad, ...data });
          setUsername(data.username || "");
          setStatus(data.status || "Online");
 
          const imageRef = ref(storage, `profileImages/${idToLoad}`);
          try {
            const url = await getDownloadURL(imageRef);
            setImageURL(url);
          } catch {
            setImageURL("");
          }
        } else {
          setUser(null);
          setUsername("");
          setStatus("Online");
          setImageURL("");
        }
      } catch (err) {
        console.error("Erro ao buscar utilizador:", err);
      }
    };
 
    fetchUserData();
  }, [userId, currentUser]);
 
  // Upload foto de perfil
  const uploadImage = async () => {
    if (!imageUpload || !auth.currentUser) return;
    const imageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
 
    try {
      await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(imageRef);
      setImageURL(url);
    } catch (err) {
      console.error("Erro ao enviar imagem:", err);
    }
  };
 
  // Atualiza status
  const updateStatus = async (newStatus) => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { status: newStatus });
      setStatus(newStatus);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };
 
  // Atualiza moldura
  const updateFrame = async (newFrame) => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { frame: newFrame });
      setUser((prev) => ({ ...prev, frame: newFrame }));
    } catch (err) {
      console.error("Erro ao atualizar moldura:", err);
    }
  };
 
  // Alternar tema
  const toggleTheme = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };
 
  // Busca utilizadores para pesquisa
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCol = collection(db, "users");
        const snapshot = await getDocs(usersCol);
        const allUsers = snapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
 
        const filtered = allUsers.filter((user) =>
          user.username?.toLowerCase().includes(searchTerm.toLowerCase())
        );
 
        setSearchResults(filtered);
      } catch (error) {
        console.error("Erro a buscar utilizadores:", error);
        setSearchResults([]);
      }
    };
 
    if (searchTerm.trim()) {
      fetchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);
 
  const handleUserClick = (uid) => {
    setSearchTerm("");
    setSearchResults([]);
    navigate(`/profile/${uid}`);
  };
 
  return (
  <div className="profile-container">
    <div className="side-dock">
      {userId && userId !== auth.currentUser?.uid && <BackToProfileDock />}
      <GameZoneDock />
      <LogoutDock />
    </div>
 
    {/* Botão para alternar tema */}
    <button onClick={toggleTheme} className="theme-toggle-btn">
      {darkMode ? "Modo Claro ☀️" : "Modo Escuro 🌙"}
    </button>
 
    <h2>Perfil do Utilizador</h2>
 
    <div className="search-users">
      <input
        type="text"
        placeholder="Procurar utilizadores..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && searchResults.length > 0) {
            handleUserClick(searchResults[0].uid);
          }
        }}
      />
      {searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.map((u) => (
            <li key={u.uid} onClick={() => handleUserClick(u.uid)}>
              @{u.username}
            </li>
          ))}
        </ul>
      )}
    </div>
 
    {user ? (
      <>
        <p><strong>Nome de utilizador:</strong> @{username}</p>
 
        {user.email && <p><strong>Email:</strong> {user.email}</p>}
 
        {user.uid === auth.currentUser?.uid ? (
          <>
            {/* Aplicando classe label-text */}
            <label className="label-text">Status:</label>
            <select value={status} onChange={(e) => updateStatus(e.target.value)}>
              <option value="Online">Online</option>
              <option value="Ocupado">Ocupado</option>
              <option value="Jogando">Jogando</option>
              <option value="Offline">Offline</option>
            </select>
 
            <br />
 
            <label className="label-text" htmlFor="upload-photo">Upload nova foto:</label>
            <input
              id="upload-photo"
              type="file"
              accept="image/*"
              onChange={(e) => setImageUpload(e.target.files[0])}
            />
            <button onClick={uploadImage}>Upload Foto de Perfil</button>
 
            <div>
              <label className="label-text" htmlFor="choose-frame">Escolher moldura:</label>
              <select
                id="choose-frame"
                value={user.frame || "default"}
                onChange={(e) => updateFrame(e.target.value)}
              >
                <option value="default">Nenhuma</option>
                <option value="gold">Dourada</option>
                <option value="silver">Prateada</option>
                <option value="blue">Azul</option>
                <option value="red">Vermelha</option>
                <option value="neon-green">Verde Neon</option>
                <option value="double">Dupla</option>
                <option value="dotted">Pontilhada</option>
                <option value="gradient">Gradiente</option>
              </select>
            </div>
          </>
        ) : (
          <p><strong>Status:</strong> {status}</p>
        )}
 
        {imageURL && (
          <div className={`profile-image frame-${user.frame || "default"}`}>
            <img src={imageURL} alt="Foto de perfil" />
            {user.badges?.length > 0 && (
              <div className="badges">
                {user.badges.map((badge) => (
                  <span key={badge} className={`badge badge-${badge}`}>
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
 
        <Posts onlyOwnPosts={false} profileUserId={user.uid} />
      </>
    ) : (
      <p>A carregar utilizador...</p>
    )}
  </div>
);
}