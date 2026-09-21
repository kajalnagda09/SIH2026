import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { PageSkeleton } from '@/components/ui/Skeleton';
import type { Role } from '@/lib/api';

export function ProtectedRoute({ roles, children }: { roles?: Role[]; children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <PageSkeleton />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return <>{children}</>;
}
