<?php

namespace App\Services;

use App\Interfaces\SprintRepositoryInterface;
use App\Models\Task;
use App\Models\TimeEntry;
use Carbon\Carbon;

class SprintService
{
    public function __construct(
        private SprintRepositoryInterface $repository
    ) {}

    public function list(array $filters = [])
    {
        return $this->repository->all($filters);
    }

    public function create(array $data)
    {
        return $this->repository->create($data);
    }

    public function get(int $id)
    {
        $sprint = $this->repository->find($id);

        $sprint->indicators = $this->calculateIndicators($sprint);

        return $sprint;
    }

    public function update(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function close(int $id)
    {
        return $this->repository->close($id);
    }

    private function calculateIndicators($sprint)
    {
        $tasks = Task::where('sprint_id', $sprint->id)->get();
        $totalTasks = $tasks->count();

        $doneStatusIds = \App\Models\Status::where('name', 'done')->pluck('id');
        $doneTasks = $tasks->whereIn('status_id', $doneStatusIds)->count();

        $pendingTasks = $totalTasks - $doneTasks;

        $estimatedHours = $tasks->sum('estimated_hours');

        $realHours = TimeEntry::whereIn('task_id', $tasks->pluck('id'))
            ->whereNotNull('duration_minutes')
            ->sum('duration_minutes');
        $realHours = round($realHours / 60, 2);

        return [
            'total_tasks' => $totalTasks,
            'done_tasks' => $doneTasks,
            'pending_tasks' => $pendingTasks,
            'estimated_hours' => (float) $estimatedHours,
            'real_hours' => $realHours,
        ];
    }
}
