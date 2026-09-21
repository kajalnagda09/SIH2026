import { cn } from '@/lib/utils';

const colors: Record<string, string> = {
  APPLIED: 'bg-blue-100 text-blue-800',
  SHORTLISTED: 'bg-purple-100 text-purple-800',
  INTERVIEW: 'bg-amber-100 text-amber-800',
  OFFERED: 'bg-green-100 text-green-800',
  JOINED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
  EASY: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-amber-100 text-amber-800',
  HARD: 'bg-red-100 text-red-800',
};

export function Badge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', colors[status] || 'bg-muted text-muted-foreground', className)}>
      {status}
    </span>
  );
}
