<?php

namespace App\Interfaces;

interface NotificationRepositoryInterface
{
    public function allByUser(int $userId);
    public function markAsRead(int $id);
    public function markAllAsRead(int $userId);
    public function create(array $data);
    public function unreadCount(int $userId): int;
}
