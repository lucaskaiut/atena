<?php

namespace App\Interfaces;

interface StatusRepositoryInterface
{
    public function all(array $filters = []);
    public function find(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function toggle(int $id): void;
    public function reorder(array $positions): void;
}
