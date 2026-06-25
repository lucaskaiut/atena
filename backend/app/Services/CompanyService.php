<?php

namespace App\Services;

use App\Interfaces\CompanyRepositoryInterface;

class CompanyService
{
    public function __construct(
        private CompanyRepositoryInterface $repository
    ) {}

    public function list(array $filters = [])
    {
        return $this->repository->all($filters);
    }

    public function create(array $data)
    {
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
}
