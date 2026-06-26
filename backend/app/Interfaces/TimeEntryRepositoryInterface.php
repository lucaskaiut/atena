<?php

namespace App\Interfaces;

interface TimeEntryRepositoryInterface
{
    public function all(array $filters = []);
    public function find(int $id);
    public function create(array $data);
    public function pause(int $id);
    public function resume(int $id);
    public function byTask(int $taskId);
    public function getRunning(int $userId);
}
