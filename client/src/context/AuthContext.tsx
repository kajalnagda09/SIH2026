import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type Role } from '@/lib/api';
import { DEMO_PROFILES } from '@/lib/mockData';
import { supabaseDb, supabase } from '@/lib/supabase';

export interface User {
  id: string;
  email: string;
  role: Role;
  isVerified: boolean;
  profile: Record<string, unknown>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<User>;
  register: (email: string, password: string, role: Role, profile: any) => Promise<User>;
  loginAsDemo: (role: Role) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'setu_auth_session_v4';

// Convert Supabase DbUser → App User
function mapDbUser(db: { id: string; email: string; role: string; is_verified: boolean; profile: Record<string, unknown> }): User {
  return {
    id: db.id,
    email: db.email,
    role: db.role as Role,
    isVerified: db.is_verified,
    profile: db.profile || {},
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);

  // Seed demo users once on first load
  useEffect(() => {
    if (!seeded) {
      setSeeded(true);
      supabaseDb.seedDemoUsers().catch(() => {
        // Silently ignore if tables don't exist yet
      });
    }
  }, [seeded]);

  const refresh = async () => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        if (parsed?.email) {
          // Re-validate from Supabase
          try {
            const live = await supabaseDb.getUserByEmail(parsed.email);
            if (live) {
              const freshUser = mapDbUser(live);
              setUser(freshUser);
              localStorage.setItem(SESSION_KEY, JSON.stringify(freshUser));
              setLoading(false);
              return;
            }
          } catch {
            // Use cached version
          }
          setUser(parsed);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Corrupt storage
    }
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    refresh();

    // Subscribe to real-time user table changes
    const channel = supabase
      .channel('auth_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'setu_users' }, () => {
        refresh();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const login = async (email: string, password?: string): Promise<User> => {
    const cleanEmail = email.trim().toLowerCase();
    const isDemoEmail = ['student@setu.demo', 'faculty@setu.demo', 'industry@setu.demo', 'admin@setu.demo'].includes(cleanEmail);

    try {
      const dbUser = await supabaseDb.authenticate(cleanEmail, password);
      const u = mapDbUser(dbUser);
      setUser(u);
      localStorage.setItem(SESSION_KEY, JSON.stringify(u));
      return u;
    } catch (err: any) {
      // Auto-provision demo accounts if not yet seeded
      if (isDemoEmail) {
        let role: Role = 'STUDENT';
        if (cleanEmail.includes('faculty')) role = 'FACULTY';
        else if (cleanEmail.includes('industry')) role = 'INDUSTRY';
        else if (cleanEmail.includes('admin')) role = 'ADMIN';

        const demo = DEMO_PROFILES[role];
        try {
          const newUser = await supabaseDb.register({
            email: cleanEmail,
            password: password || 'demo123',
            role,
            profile: demo.profile as unknown as Record<string, unknown>,
          });
          const u = mapDbUser(newUser);
          setUser(u);
          localStorage.setItem(SESSION_KEY, JSON.stringify(u));
          return u;
        } catch {
          // Already exists — try fetching directly
          const existing = await supabaseDb.getUserByEmail(cleanEmail);
          if (existing) {
            const u = mapDbUser(existing);
            setUser(u);
            localStorage.setItem(SESSION_KEY, JSON.stringify(u));
            return u;
          }
        }
      }
      throw new Error(err?.message || `No account found for "${cleanEmail}". Please register first.`);
    }
  };

  const register = async (
    email: string,
    password: string,
    role: Role,
    profile: any
  ): Promise<User> => {
    const dbUser = await supabaseDb.register({
      email: email.trim().toLowerCase(),
      password,
      role,
      profile,
    });

    const u = mapDbUser(dbUser);
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    return u;
  };

  const loginAsDemo = async (role: Role): Promise<void> => {
    const demoEmail =
      role === 'STUDENT' ? 'student@setu.demo' :
      role === 'FACULTY' ? 'faculty@setu.demo' :
      role === 'INDUSTRY' ? 'industry@setu.demo' :
      'admin@setu.demo';

    try {
      const dbUser = await supabaseDb.authenticate(demoEmail);
      const u = mapDbUser(dbUser);
      setUser(u);
      localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    } catch {
      // Fallback: auto-register demo user
      try {
        const demo = DEMO_PROFILES[role];
        const newUser = await supabaseDb.register({
          email: demoEmail,
          password: 'demo123',
          role,
          profile: demo.profile as unknown as Record<string, unknown>,
        });
        const u = mapDbUser(newUser);
        setUser(u);
        localStorage.setItem(SESSION_KEY, JSON.stringify(u));
      } catch {
        // If all else fails, use local mock data
        const fallback = DEMO_PROFILES[role] as unknown as User;
        setUser(fallback);
        localStorage.setItem(SESSION_KEY, JSON.stringify(fallback));
      }
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginAsDemo, logout, refresh }}>
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
