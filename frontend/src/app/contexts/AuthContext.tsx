import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { getProfile, loginUser, registerUser } from '../../lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_USER_KEY = 'conectamed_user';
const STORAGE_TOKEN_KEY = 'conectamed_token';

function getDefaultNameFromEmail(email: string) {
  const localPart = email.split('@')[0] ?? '';
  if (!localPart) {
    return 'Usuário ConectaMed';
  }

  return localPart
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
      const storedUser = localStorage.getItem(STORAGE_USER_KEY);

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getProfile(storedToken);
        const fallbackUser = storedUser ? (JSON.parse(storedUser) as User) : null;

        const restoredUser: User = {
          id: profile.seu_id_no_banco_de_dados,
          name: fallbackUser?.name ?? 'Usuário ConectaMed',
          email: fallbackUser?.email ?? '',
          role: fallbackUser?.role ?? 'MEMBRO',
          avatar: fallbackUser?.avatar,
        };

        setUser(restoredUser);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(restoredUser));
      } catch {
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_USER_KEY);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const loginResponse = await loginUser({ email, password });
      const profile = await getProfile(loginResponse.token);

      const loggedUser: User = {
        id: profile.seu_id_no_banco_de_dados,
        name: getDefaultNameFromEmail(email),
        email,
        role: 'MEMBRO',
      };

      setUser(loggedUser);
      localStorage.setItem(STORAGE_TOKEN_KEY, loginResponse.token);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(loggedUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);

    try {
      const registerResponse = await registerUser({ name, email, password });
      const loginResponse = await loginUser({ email, password });

      const newUser: User = {
        id: registerResponse.user.id,
        name: registerResponse.user.name,
        email: registerResponse.user.email,
        role: 'MEMBRO',
      };

      setUser(newUser);
      localStorage.setItem(STORAGE_TOKEN_KEY, loginResponse.token);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
