// src/context/AuthContext.js
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/auth/login",
        { username, password },
        { withCredentials: true }
      );
      const userData = response.data.data;
      setUser(userData);
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid username or password. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      toast.success("Logged out successfully.");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
