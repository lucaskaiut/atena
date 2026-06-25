'use client';

import { NotificationList } from '@/components/notifications/NotificationList';
import { Button } from '@/components/ui/Button';
import { useMarkAllAsRead, useUnreadCount } from '@/hooks/useNotifications';
import { CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const markAllAsRead = useMarkAllAsRead();
  const { data: unreadCount = 0 } = useUnreadCount();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsRead.mutate()}
            isLoading={markAllAsRead.isPending}
          >
            <CheckCheck className="h-4 w-4" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      <NotificationList />
    </div>
  );
}
