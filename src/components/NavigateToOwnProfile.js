import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function NavigateToOwnProfile() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      navigate(`/profile/${user.uid}`);
    } else {
      navigate("/login");
    }
  }, []);

  return null; // não precisa renderizar nada
}
