<?php

namespace App\Repositories;

use App\Interfaces\SubtaskRepositoryInterface;
use App\Models\Subtask;

class SubtaskRepository implements SubtaskRepositoryInterface
{
    public function allByTask(int $taskId)
    {
        return Subtask::where('task_id', $taskId)
            ->with(['assignee', 'status'])
            ->get();
    }

    public function find(int $id)
    {
        return Subtask::with(['assignee', 'status', 'task'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return Subtask::create($data);
    }

    public function update(int $id, array $data)
    {
        $subtask = $this->find($id);
        $subtask->update($data);
        return $subtask;
    }

    public function toggle(int $id)
    {
        $subtask = $this->find($id);
        $subtask->update(['is_completed' => !$subtask->is_completed]);
        return $subtask;
    }

    public function delete(int $id): void
    {
        $subtask = $this->find($id);
        $subtask->delete();
    }
}
