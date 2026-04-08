import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserRole(parsedUser.role);
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password, fullName, role) => {
    try {
      const response = await authApi.register({ email, password, fullName, role });
      const { token, userId, role: userRoleResponse, fullName: userFullName } = response.data;
      
      const userData = {
        id: userId,
        email,
        fullName: userFullName,
        role: userRoleResponse.toLowerCase()
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      setUserRole(userData.role);
      
      return { error: null };
    } catch (error) {
      return { error: error.response?.data?.message || error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      const { token, userId, role: userRoleResponse, fullName: userFullName } = response.data;
      
      const userData = {
        id: userId,
        email,
        fullName: userFullName,
        role: userRoleResponse.toLowerCase()
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      setUserRole(userData.role);
      
      return { error: null };
    } catch (error) {
      return { error: error.response?.data?.message || error.message };
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};