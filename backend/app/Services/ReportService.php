<?php

namespace App\Services;

use App\Models\Task;
use App\Models\TimeEntry;
use Carbon\Carbon;

class ReportService
{
    public function hoursReport(array $filters = [])
    {
        $query = TimeEntry::query()->with(['user', 'task.project.client']);

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }
        if (!empty($filters['project_id'])) {
            $query->whereHas('task', function($q) use ($filters) {
                $q->where('project_id', $filters['project_id']);
            });
        }
        if (!empty($filters['client_id'])) {
            $query->whereHas('task.project', function($q) use ($filters) {
                $q->where('client_id', $filters['client_id']);
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

        $totalMinutes = $query->sum('duration_minutes');

        return [
            'data' => $query->paginate($filters['per_page'] ?? 15),
            'total_hours' => round($totalMinutes / 60, 2),
        ];
    }

    public function tasksReport()
    {
        $doneStatusIds = \App\Models\Status::where('name', 'done')->pluck('id');

        $open = Task::whereNotIn('status_id', $doneStatusIds)
            ->count();

        $completed = Task::whereIn('status_id', $doneStatusIds)
            ->count();

        $late = Task::where('expected_end_date', '<', Carbon::today())
            ->whereNotIn('status_id', $doneStatusIds)
            ->get();

        return [
            'open_tasks' => $open,
            'completed_tasks' => $completed,
            'late_tasks' => $late,
        ];
    }

    public function estimatesReport()
    {
        $tasks = Task::with(['timeEntries'])->get();

        $planned = $tasks->sum('estimated_hours');
        $realized = TimeEntry::whereNotNull('duration_minutes')->sum('duration_minutes');
        $realized = round($realized / 60, 2);

        return [
            'planned_hours' => (float) $planned,
            'realized_hours' => (float) $realized,
            'difference' => round((float) $realized - (float) $planned, 2),
        ];
    }
}
