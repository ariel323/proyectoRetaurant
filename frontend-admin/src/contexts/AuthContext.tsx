import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService, Usuario } from "../services/authService";

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar
    const usuarioActual = authService.getUsuario();
    if (usuarioActual && authService.isAuthenticated()) {
      setUsuario(usuarioActual);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ username, password });
      setUsuario(response.usuario);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  const value = {
    usuario,
    isAuthenticated: !!usuario,
    isAdmin: usuario?.rol === "ADMIN",
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
