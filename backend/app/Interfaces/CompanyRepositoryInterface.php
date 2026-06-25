<?php

namespace App\Interfaces;

interface CompanyRepositoryInterface
{
    public function all(array $filters = []);
    public function find(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
}
