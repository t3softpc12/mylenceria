import { createContext, useContext, useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import ValidateUser from "../components/ValidateUser";
import AuthModal from "../components/AuthModal";
// import { useCart } from "./CartContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const loginRef = useRef();
  // const { syncGuestCartToDB } = useCart(); 

  // Auto-login on refresh
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        localStorage.removeItem("authToken");
      }
    }
    setLoading(false);
  }, []);

  const openLoginPopup = () => {
    loginRef.current?.openPopup();
  };

  const login = (token) => {
    localStorage.setItem("authToken", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    // syncGuestCartToDB(); 
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, openLoginPopup }}>
      {children}
      {/* <ValidateUser ref={loginRef} /> */}
      <AuthModal ref={loginRef} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

