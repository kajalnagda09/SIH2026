import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, type User, type Role } from '@/lib/api';
import { DEMO_PROFILES } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginAsDemo: (role: Role) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'setu_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const { data } = await api.get<User>('/auth/me');
      if (data && data.email) {
        setUser(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return;
      }
    } catch {
      // Backend not running or unauthenticated; inspect local demo session
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        setUser(null);
      }
    } else {
      // Default to demo student for immediate out-of-the-box rich prototype inspection
      const defaultUser = DEMO_PROFILES.STUDENT as User;
      setUser(defaultUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser));
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const { data } = await api.post<{ user: User }>('/auth/login', { email, password });
      setUser(data.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      return data.user;
    } catch {
      // Offline/Demo fallback matching demo accounts
      const lower = email.toLowerCase();
      let matched: User = DEMO_PROFILES.STUDENT as User;
      if (lower.includes('faculty')) matched = DEMO_PROFILES.FACULTY as User;
      else if (lower.includes('industry')) matched = DEMO_PROFILES.INDUSTRY as User;
      else if (lower.includes('admin')) matched = DEMO_PROFILES.ADMIN as User;
      else if (lower.includes('student')) matched = DEMO_PROFILES.STUDENT as User;
      else {
        matched = {
          id: `usr_${Date.now()}`,
          email,
          role: 'STUDENT',
          isVerified: true,
          profile: DEMO_PROFILES.STUDENT.profile,
        };
      }
      setUser(matched);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(matched));
      return matched;
    }
  };

  const loginAsDemo = (role: Role) => {
    const demoUser = DEMO_PROFILES[role] as User;
    setUser(demoUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAsDemo, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function dashboardPath(role?: string) {
  switch (role) {
    case 'STUDENT': return '/student';
    case 'FACULTY': return '/faculty';
    case 'INDUSTRY': return '/industry';
    case 'ADMIN': return '/admin';
    default: return '/';
  }
}
