import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { setToken, clearToken } from "../api/client";
import * as authApi from "../api/auth";

interface User {
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          role: payload.role ?? "",
        });
      } catch {
        clearToken();
        setTokenState(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = useCallback(async (input: authApi.LoginInput) => {
    const result = await authApi.login(input);
    setTokenState(result.token);
    setToken(result.token);
  }, []);

  const register = useCallback(async (input: authApi.RegisterInput) => {
    const result = await authApi.register(input);
    setTokenState(result.token);
    setToken(result.token);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
