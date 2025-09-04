import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- Fetch current user ----------------
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUser(null);
        return;
      }

      // Axios in api.js automatically attaches token
      const response = await api.get("current-user/");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      setUser(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ---------------- Login ----------------
  const login = async (accessToken, refreshToken) => {
    try {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // Set default Authorization header
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // Fetch user info
      const userRes = await api.get("current-user/");
      setUser(userRes.data);
    } catch (error) {
      console.error("Login failed:", error);
      setUser(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  };

  // ---------------- Logout ----------------
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
