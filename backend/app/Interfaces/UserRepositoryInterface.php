<?php

namespace App\Interfaces;

interface UserRepositoryInterface
{
    public function all(array $filters = []);
    public function find(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id): void;
    public function findByEmail(string $email);
}
