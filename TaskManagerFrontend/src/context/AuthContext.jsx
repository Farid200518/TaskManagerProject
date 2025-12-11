import React, { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, signupRequest } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, fullName, email, role }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const load = async () => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch {
        setUser(null);
      }
    }

    // 🚀 IMPORTANT: Only set loading = false AFTER user is restored
    setLoading(false);
  };

  load();
}, []);


  const handleAuthResponse = (data) => {
    const { token } = data;
    // backend might return { user: {...} } or { userInfo: {...} }
    const rawUser = data.user || data.userInfo;
    if (!rawUser) {
      throw new Error("Auth response missing user information");
    }
    const authUser = {
      id: rawUser.id,
      fullName: rawUser.fullName,
      email: rawUser.email,
      role: rawUser.role,
    };
    setToken(token);
    setUser(authUser);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(authUser));
  };

  const login = async (email, password) => {
    const res = await loginRequest(email, password);
    handleAuthResponse(res.data);
  };

  const signup = async (payload) => {
    const res = await signupRequest(payload);
    handleAuthResponse(res.data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
