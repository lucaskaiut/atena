<?php

namespace App\Services;

use App\Interfaces\StatusRepositoryInterface;

class StatusService
{
    public function __construct(
        private StatusRepositoryInterface $repository
    ) {}

    public function list(array $filters = [])
    {
        return $this->repository->all($filters);
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
        $this->repository->toggle($id);
        return $this->repository->find($id);
    }

    public function reorder(array $positions)
    {
        $this->repository->reorder($positions);
        return $this->repository->all();
    }
}
