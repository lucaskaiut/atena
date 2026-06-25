<?php

namespace App\Interfaces;

interface SubtaskRepositoryInterface
{
    public function allByTask(int $taskId);
    public function find(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function toggle(int $id);
    public function delete(int $id): void;
}
