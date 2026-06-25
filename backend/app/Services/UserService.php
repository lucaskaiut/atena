<?php

namespace App\Services;

use App\Interfaces\UserRepositoryInterface;
use App\Interfaces\NotificationRepositoryInterface;

class UserService
{
    public function __construct(
        private UserRepositoryInterface $repository,
        private NotificationRepositoryInterface $notificationRepository
    ) {}

    public function list(array $filters = [])
    {
        return $this->repository->all($filters);
    }

    public function create(array $data)
    {
        $data['password'] = bcrypt($data['password'] ?? 'password');
        return $this->repository->create($data);
    }

    public function get(int $id)
    {
        return $this->repository->find($id);
    }

    public function update(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): void
    {
        $this->repository->delete($id);
    }
}
