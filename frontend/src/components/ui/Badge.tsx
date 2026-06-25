import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: string;
  className?: string;
  color?: string;
}

export function Badge({ children, variant, className, color }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant || 'bg-gray-100 text-gray-800',
        className
      )}
      style={color ? { backgroundColor: color + '20', color } : undefined}
    >
      {children}
    </span>
  );
}
