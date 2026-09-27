import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, type User, type Role } from '@/lib/api';
import { DEMO_PROFILES } from '@/lib/mockData';
import { realtimeDb, type RealtimeUser } from '@/lib/realtimeDb';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<User>;
  register: (email: string, password: string, role: Role, profile: any) => Promise<User>;
  loginAsDemo: (role: Role) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'setu_auth_user_v3';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    // 1. Check local session
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          // Refresh profile if user exists in realtimeDb
          try {
            const live = realtimeDb.authenticate(parsed.email);
            if (live) {
              const mappedUser: User = {
                id: live.id,
                email: live.email,
                role: live.role,
                isVerified: live.isVerified,
                profile: live.profile,
              };
              setUser(mappedUser);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
              setLoading(false);
              return;
            }
          } catch {
            // User might be locally cached
          }
          setUser(parsed);
          setLoading(false);
          return;
        }
      } catch {
        // Corrupt storage
      }
    }

    // No active user session -> remain unauthenticated
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    refresh();

    // Subscribe to realtime database updates across tabs
    const unsubscribe = realtimeDb.subscribe(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.email) {
            const live = realtimeDb.authenticate(parsed.email);
            if (live) {
              setUser({
                id: live.id,
                email: live.email,
                role: live.role,
                isVerified: live.isVerified,
                profile: live.profile,
              });
            }
          }
        } catch {
          // Keep current
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string): Promise<User> => {
    const cleanEmail = email.trim().toLowerCase();
    const isDemoAccount = ['student@setu.demo', 'faculty@setu.demo', 'industry@setu.demo', 'admin@setu.demo'].includes(cleanEmail);

    try {
      const live = realtimeDb.authenticate(cleanEmail, password);
      const authenticatedUser: User = {
        id: live.id,
        email: live.email,
        role: live.role,
        isVerified: live.isVerified,
        profile: live.profile,
      };
      setUser(authenticatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
      return authenticatedUser;
    } catch (err: any) {
      // If it's explicitly a demo email not yet in DB, provision demo profile
      if (isDemoAccount) {
        let role: Role = 'STUDENT';
        if (cleanEmail.includes('faculty')) role = 'FACULTY';
        else if (cleanEmail.includes('industry')) role = 'INDUSTRY';
        else if (cleanEmail.includes('admin')) role = 'ADMIN';

        const demo = DEMO_PROFILES[role];
        const newUser = realtimeDb.register({
          email: cleanEmail,
          password: password || 'demo123',
          role,
          profile: demo.profile,
        });

        const mappedUser: User = {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          isVerified: newUser.isVerified,
          profile: newUser.profile,
        };
        setUser(mappedUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
        return mappedUser;
      }

      // Real user not found -> throw exact error so user knows to register
      throw new Error(err?.message || `No account found with email "${cleanEmail}". Please register first or use 1-Click Demo Login.`);
    }
  };

  const register = async (
    email: string,
    password: string,
    role: Role,
    profile: any
  ): Promise<User> => {
    const newUser = realtimeDb.register({
      email,
      password,
      role,
      profile,
    });

    const authenticatedUser: User = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      isVerified: newUser.isVerified,
      profile: newUser.profile,
    };

    setUser(authenticatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
    return authenticatedUser;
  };

  const loginAsDemo = (role: Role) => {
    const demoEmail =
      role === 'STUDENT'
        ? 'student@setu.demo'
        : role === 'FACULTY'
        ? 'faculty@setu.demo'
        : role === 'INDUSTRY'
        ? 'industry@setu.demo'
        : 'admin@setu.demo';

    try {
      const live = realtimeDb.authenticate(demoEmail);
      const u: User = {
        id: live.id,
        email: live.email,
        role: live.role,
        isVerified: live.isVerified,
        profile: live.profile,
      };
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      const fallback = DEMO_PROFILES[role] as User;
      setUser(fallback);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    }
  };

  const logout = async () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, loginAsDemo, logout, refresh }}
    >
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
    case 'STUDENT':
      return '/student';
    case 'FACULTY':
      return '/faculty';
    case 'INDUSTRY':
      return '/industry';
    case 'ADMIN':
      return '/admin';
    default:
      return '/';
  }
}

