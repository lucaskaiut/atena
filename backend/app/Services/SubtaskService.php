<?php

namespace App\Services;

use App\Interfaces\SubtaskRepositoryInterface;

class SubtaskService
{
    public function __construct(
        private SubtaskRepositoryInterface $repository
    ) {}

    public function listByTask(int $taskId)
    {
        return $this->repository->allByTask($taskId);
    }

    public function create(array $data)
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function toggle(int $id)
    {
        return $this->repository->toggle($id);
    }

    public function delete(int $id): void
    {
        $this->repository->delete($id);
    }
}
