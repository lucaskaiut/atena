<?php

namespace App\Repositories;

use App\Interfaces\StatusRepositoryInterface;
use App\Models\Status;

class StatusRepository implements StatusRepositoryInterface
{
    public function all(array $filters = [])
    {
        $query = Status::query();
        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }
        return $query->orderBy('position')->get();
    }

    public function find(int $id)
    {
        return Status::findOrFail($id);
    }

    public function create(array $data)
    {
        return Status::create($data);
    }

    public function update(int $id, array $data)
    {
        $status = $this->find($id);
        $status->update($data);
        return $status;
    }

    public function toggle(int $id): void
    {
        $status = $this->find($id);
        $status->update(['is_active' => !$status->is_active]);
    }

    public function reorder(array $positions): void
    {
        foreach ($positions as $item) {
            Status::where('id', $item['id'])->update(['position' => $item['position']]);
        }
    }
}
