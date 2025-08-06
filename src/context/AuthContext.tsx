"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getCookie("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (token: string, userData: User) => {
    setCookie("token", token, { path: "/" });
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    deleteCookie("token", { path: "/" });
    localStorage.removeItem("user");
    setUser(null);
    // Arahkan ke halaman login
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
