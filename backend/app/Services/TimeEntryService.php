<?php

namespace App\Services;

use App\Interfaces\TimeEntryRepositoryInterface;
use Carbon\Carbon;

class TimeEntryService
{
    public function __construct(
        private TimeEntryRepositoryInterface $repository
    ) {}

    public function start(int $taskId, int $userId, int $companyId)
    {
        // Pause any running entry
        $running = \App\Models\TimeEntry::where('user_id', $userId)
            ->whereNull('end_time')
            ->first();
        if ($running) {
            $this->repository->pause($running->id);
        }

        return $this->repository->create([
            'company_id' => $companyId,
            'task_id' => $taskId,
            'user_id' => $userId,
            'start_time' => Carbon::now(),
            'is_manual' => false,
        ]);
    }

    public function pause(int $id)
    {
        return $this->repository->pause($id);
    }

    public function resume(int $id)
    {
        return $this->repository->resume($id);
    }

    public function createManual(array $data)
    {
        $data['is_manual'] = true;

        if (!empty($data['start_time']) && !empty($data['end_time']) && empty($data['duration_minutes'])) {
            $start = Carbon::parse($data['start_time']);
            $end = Carbon::parse($data['end_time']);
            $data['duration_minutes'] = abs($end->diffInMinutes($start));
        }

        return $this->repository->create($data);
    }

    public function list(array $filters = [])
    {
        return $this->repository->all($filters);
    }

    public function byTask(int $taskId)
    {
        return $this->repository->byTask($taskId);
    }

    public function stop(int $id)
    {
        return $this->repository->pause($id);
    }

    public function delete(int $id): void
    {
        $entry = $this->repository->find($id);
        $entry->delete();
    }
}
