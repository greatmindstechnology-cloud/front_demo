import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = sessionStorage.getItem("isAuthenticated") === "true";
    const userRole = sessionStorage.getItem("userRole");

    if (isAuth && userRole) {
      setIsAuthenticated(true);
      setRole(userRole.toLowerCase());
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }

    setLoading(false);
  }, []);

  const logout = () => {
    sessionStorage.clear();
    setRole(null);
    setIsAuthenticated(false);
    navigate("/logout");
  };

  return { role, isAuthenticated, loading, logout };
};

export default useAuth;