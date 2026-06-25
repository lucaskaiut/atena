<?php

namespace App\Services;

use App\Interfaces\NotificationRepositoryInterface;

class NotificationService
{
    public function __construct(
        private NotificationRepositoryInterface $repository
    ) {}

    public function list(int $userId)
    {
        return $this->repository->allByUser($userId);
    }

    public function markAsRead(int $id)
    {
        return $this->repository->markAsRead($id);
    }

    public function markAllAsRead(int $userId)
    {
        $this->repository->markAllAsRead($userId);
    }
}
