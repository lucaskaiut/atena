<?php

namespace App\Repositories;

use App\Interfaces\TaskRepositoryInterface;
use App\Models\Task;
use App\Models\TaskHistory;

class TaskRepository implements TaskRepositoryInterface
{
    public function all(array $filters = [])
    {
        $query = Task::query();
        if (!empty($filters['project_id'])) {
            $query->where('project_id', $filters['project_id']);
        }
        if (!empty($filters['status_id'])) {
            $query->where('status_id', $filters['status_id']);
        }
        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }
        if (!empty($filters['sprint_id'])) {
            $query->where('sprint_id', $filters['sprint_id']);
        }
        if (!empty($filters['assignee_id'])) {
            $query->whereHas('users', function($q) use ($filters) {
                $q->where('user_id', $filters['assignee_id']);
            });
        }
        if (!empty($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('title', 'like', '%'.$filters['search'].'%')
                  ->orWhere('description', 'like', '%'.$filters['search'].'%');
            });
        }
        return $query->with(['status', 'users', 'project', 'sprint'])
            ->paginate($filters['per_page'] ?? 15);
    }

    public function find(int $id)
    {
        return Task::with(['status', 'users', 'project', 'sprint', 'subtasks', 'comments', 'histories'])
            ->findOrFail($id);
    }

    public function create(array $data)
    {
        $task = Task::create($data);
        if (!empty($data['user_ids'])) {
            $task->users()->sync($data['user_ids']);
        }
        return $task;
    }

    public function update(int $id, array $data)
    {
        $task = $this->find($id);

        // Track changes for history
        $changedFields = [];
        foreach (['title', 'description', 'priority', 'status_id', 'sprint_id', 'start_date', 'expected_end_date', 'estimated_hours'] as $field) {
            if (array_key_exists($field, $data) && $task->$field != $data[$field]) {
                $changedFields[] = $field;
            }
        }

        $task->update($data);

        if (!empty($data['user_ids'])) {
            $task->users()->sync($data['user_ids']);
        }

        return $task;
    }

    public function delete(int $id): void
    {
        $task = $this->find($id);
        $task->delete();
    }

    public function updateStatus(int $id, int $statusId)
    {
        $task = $this->find($id);
        $oldStatusId = $task->status_id;
        $task->update(['status_id' => $statusId]);
        return $task;
    }

    public function history(int $id)
    {
        return TaskHistory::where('task_id', $id)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
