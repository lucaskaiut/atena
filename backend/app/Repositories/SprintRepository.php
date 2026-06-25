<?php

namespace App\Repositories;

use App\Interfaces\SprintRepositoryInterface;
use App\Models\Sprint;

class SprintRepository implements SprintRepositoryInterface
{
    public function all(array $filters = [])
    {
        $query = Sprint::query();
        if (!empty($filters['project_id'])) {
            $query->where('project_id', $filters['project_id']);
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        return $query->with(['project'])->paginate($filters['per_page'] ?? 15);
    }

    public function find(int $id)
    {
        return Sprint::with(['project', 'tasks'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return Sprint::create($data);
    }

    public function update(int $id, array $data)
    {
        $sprint = $this->find($id);
        $sprint->update($data);
        return $sprint;
    }

    public function close(int $id)
    {
        $sprint = $this->find($id);
        $sprint->update(['status' => 'completed']);
        return $sprint;
    }
}
