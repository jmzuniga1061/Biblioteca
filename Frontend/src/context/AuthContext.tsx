import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, refreshToken as apiRefreshToken, register as apiRegister } from "../services/api";

type AuthUser = {
  token: string;
  role: string | null;
  name: string | null;
  email: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: string[] | string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      const payload = parseJwt(token);
      return { token, role: payload?.roleName ?? null, name: payload?.name ?? null, email: payload?.email ?? null };
    }
    return null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setUser(null);
      }
    };
    window.addEventListener("storage", handler);

    const refreshAuthToken = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        const response = await apiRefreshToken(token);
        const newToken = response.token;
        const payload = parseJwt(newToken);
        if (!payload) throw new Error("Token inválido");

        localStorage.setItem("auth_token", newToken);
        setUser({
          token: newToken,
          role: payload?.roleName ?? null,
          name: payload?.name ?? null,
          email: payload?.email ?? null,
        });
      } catch {
        localStorage.removeItem("auth_token");
        setUser(null);
      }
    };

    refreshAuthToken();
    return () => window.removeEventListener("storage", handler);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiLogin(email, password);
    const token = response.token;
    const payload = parseJwt(token);
    if (!payload) throw new Error("Token inválido");

    localStorage.setItem("auth_token", token);
    setUser({
      token,
      role: payload?.roleName ?? null,
      name: payload?.name ?? null,
      email: payload?.email ?? null,
    });
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await apiRegister(name, email, password, "cliente");
    const token = response.token;
    const payload = parseJwt(token);
    if (!payload) throw new Error("Token inválido");

    localStorage.setItem("auth_token", token);
    setUser({
      token,
      role: payload?.roleName ?? null,
      name: payload?.name ?? null,
      email: payload?.email ?? null,
    });
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    navigate("/");
  };

  const isAuthenticated = Boolean(user && user.token);

  const hasRole = (roles: string[] | string) => {
    if (!user || !user.role) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(user.role);
  };

  return <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, hasRole }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
