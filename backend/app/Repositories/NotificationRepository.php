<?php

namespace App\Repositories;

use App\Interfaces\NotificationRepositoryInterface;
use App\Models\Notification;
use Carbon\Carbon;

class NotificationRepository implements NotificationRepositoryInterface
{
    public function allByUser(int $userId)
    {
        return Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate(20);
    }

    public function markAsRead(int $id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['read_at' => Carbon::now()]);
        return $notification->fresh();
    }

    public function markAllAsRead(int $userId)
    {
        Notification::where('user_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => Carbon::now()]);
    }

    public function create(array $data)
    {
        return Notification::create($data);
    }

    public function unreadCount(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->whereNull('read_at')
            ->count();
    }
}
