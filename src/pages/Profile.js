import { useState, useEffect } from "react";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
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
  const [imageUpload, setImageUpload] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    setDarkMode(true);
    document.body.classList.add("dark-mode");
  } else {
    setDarkMode(false);
    document.body.classList.remove("dark-mode");
  }
}, []);


  const currentUser = auth.currentUser;

  useEffect(() => {
    const idToLoad = userId || currentUser?.uid;
    if (!idToLoad) return;

    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", idToLoad);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({ uid: idToLoad, ...docSnap.data() });
          setUsername(docSnap.data().username);

          const imageRef = ref(storage, `profileImages/${idToLoad}`);
          getDownloadURL(imageRef)
            .then((url) => setImageURL(url))
            .catch(() => setImageURL(""));
        } else {
          console.log("Utilizador não encontrado.");
          setUser(null);
          setUsername("");
          setImageURL("");
        }
      } catch (err) {
        console.error("Erro a buscar dados do utilizador:", err);
      }
    };

    fetchUserData();
  }, [userId, currentUser]);

  const uploadImage = async () => {
    if (!imageUpload || !currentUser) return;
    const imageRef = ref(storage, `profileImages/${currentUser.uid}`);
    try {
      await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(imageRef);
      setImageURL(url);
    } catch (err) {
      console.error("Erro ao enviar imagem:", err);
    }
  };

  const toggleTheme = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

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
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
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
  {userId && userId !== currentUser?.uid && <BackToProfileDock />}
  <GameZoneDock />
  <LogoutDock />
</div>

      <button onClick={toggleTheme}>
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
          <p>
            <strong>Nome de utilizador:</strong> @{username}
          </p>
          {user.email && (
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          )}

          {user.uid === currentUser?.uid && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageUpload(e.target.files[0])}
              />
              <br />
              <button onClick={uploadImage}>Upload Foto de Perfil</button>
            </>
          )}

          {imageURL && (
            <div className="profile-image">
              <h3>Foto de Perfil:</h3>
              <img src={imageURL} alt="Foto de perfil" />
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
