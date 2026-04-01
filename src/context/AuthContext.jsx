import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    const { data } = await apiClient.post("/auth/login", credentials);
    const token = data.data.token;

    localStorage.setItem("ims_token", token);
    setUser(data.data.user);
  };

  const signup = async (payload) => {
    const { data } = await apiClient.post("/auth/signup", payload);
    const token = data.data.token;

    localStorage.setItem("ims_token", token);
    setUser(data.data.user);
  };

  const logout = () => {
    localStorage.removeItem("ims_token");
    setUser(null);
  };

  const fetchMe = async () => {
    const token = localStorage.getItem("ims_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await apiClient.get("/auth/me");
      setUser(data.data);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      isAuthenticated: Boolean(user)
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
