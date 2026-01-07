import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth data from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("labtrack_user");
    const storedToken = localStorage.getItem("labtrack_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);

    localStorage.setItem("labtrack_user", JSON.stringify(userData));
    localStorage.setItem("labtrack_token", jwtToken);
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("labtrack_user");
    localStorage.removeItem("labtrack_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
