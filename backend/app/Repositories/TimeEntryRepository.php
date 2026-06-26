<?php

namespace App\Repositories;

use App\Interfaces\TimeEntryRepositoryInterface;
use App\Models\TimeEntry;
use Carbon\Carbon;

class TimeEntryRepository implements TimeEntryRepositoryInterface
{
    public function all(array $filters = [])
    {
        $query = TimeEntry::query();
        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }
        if (!empty($filters['task_id'])) {
            $query->where('task_id', $filters['task_id']);
        }
        if (!empty($filters['project_id'])) {
            $query->whereHas('task', function($q) use ($filters) {
                $q->where('project_id', $filters['project_id']);
            });
        }
        if (!empty($filters['sprint_id'])) {
            $query->whereHas('task', function($q) use ($filters) {
                $q->where('sprint_id', $filters['sprint_id']);
            });
        }
        if (!empty($filters['date_from'])) {
            $query->whereDate('start_time', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->whereDate('start_time', '<=', $filters['date_to']);
        }
        return $query->with(['user', 'task'])->paginate($filters['per_page'] ?? 15);
    }

    public function find(int $id)
    {
        return TimeEntry::findOrFail($id);
    }

    public function create(array $data)
    {
        return TimeEntry::create($data);
    }

    public function pause(int $id)
    {
        $entry = $this->find($id);
        $now = Carbon::now();
        $duration = abs($now->diffInMinutes($entry->start_time));
        $entry->update([
            'end_time' => $now,
            'duration_minutes' => $duration,
        ]);
        return $entry;
    }

    public function resume(int $id)
    {
        $entry = $this->find($id);
        // Create a new entry starting from now
        return TimeEntry::create([
            'company_id' => $entry->company_id,
            'task_id' => $entry->task_id,
            'user_id' => $entry->user_id,
            'start_time' => Carbon::now(),
            'is_manual' => false,
            'description' => $entry->description,
        ]);
    }

    public function byTask(int $taskId)
    {
        return TimeEntry::where('task_id', $taskId)
            ->with('user')
            ->orderBy('start_time', 'desc')
            ->get();
    }

    public function getRunning(int $userId)
    {
        return TimeEntry::where('user_id', $userId)
            ->whereNull('end_time')
            ->with(['task.project', 'user'])
            ->first();
    }
}
