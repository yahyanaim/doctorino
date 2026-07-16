import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { setToken, clearToken } from "../api/client";
import * as authApi from "../api/auth";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (input: authApi.LoginInput) => Promise<void>;
  register: (input: authApi.RegisterInput) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

function storeAuth(token: string, user: User) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function loadUser(): { token: string | null; user: User | null } {
  const token = localStorage.getItem("token");
  const raw = localStorage.getItem("user");
  if (token && raw) {
    try {
      return { token, user: JSON.parse(raw) as User };
    } catch {}
  }
  return { token, user: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadUser().user);
  const [token, setTokenState] = useState<string | null>(() => loadUser().token);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = useCallback(async (input: authApi.LoginInput) => {
    const result = await authApi.login(input);
    const u: User = {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
    };
    storeAuth(result.token, u);
    setTokenState(result.token);
    setUser(u);
  }, []);

  const register = useCallback(async (input: authApi.RegisterInput) => {
    const result = await authApi.register(input);
    const u: User = {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
    };
    storeAuth(result.token, u);
    setTokenState(result.token);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setTokenState(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
