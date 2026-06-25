'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ListTodo,
  Columns3,
  ChartGantt,
  Timer,
  BarChart3,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clientes', icon: Users },
  { href: '/projects', label: 'Projetos', icon: FolderKanban },
  { href: '/tasks', label: 'Tarefas', icon: ListTodo },
  { href: '/kanban', label: 'Kanban', icon: Columns3 },
  { href: '/gantt', label: 'Gantt', icon: ChartGantt },
  { href: '/sprints', label: 'Sprints', icon: Timer },
  { href: '/reports/hours', label: 'Relatórios', icon: BarChart3 },
  { href: '/settings/statuses', label: 'Configurações', icon: Settings },
  { href: '/notifications', label: 'Notificações', icon: Bell },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-sidebar text-white z-30 transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-hover">
        {!collapsed && (
          <Link href="/dashboard" className="text-xl font-bold">
            Atena
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="text-xl font-bold mx-auto">
            A
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-sidebar-hover transition-colors hidden md:block"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors text-sm',
                isActive
                  ? 'bg-sidebar-active text-white'
                  : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-hover">
        {!collapsed && (
          <p className="text-xs text-gray-500">Atena Task Manager v1.0</p>
        )}
      </div>
    </aside>
  );
}
