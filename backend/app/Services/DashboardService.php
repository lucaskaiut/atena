<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Task;
use App\Models\TimeEntry;
use App\Models\Sprint;

class DashboardService
{
    public function getIndicators()
    {
        $totalProjects = Project::count();
        $totalTasks = Task::count();
        $workedHours = TimeEntry::whereNotNull('duration_minutes')->sum('duration_minutes');
        $workedHours = round($workedHours / 60, 2);
        $estimatedHours = Task::sum('estimated_hours');
        $activeSprints = Sprint::where('status', 'active')->count();

        return [
            'total_projects' => $totalProjects,
            'total_tasks' => $totalTasks,
            'hours_worked' => (float) $workedHours,
            'hours_estimated' => (float) $estimatedHours,
            'active_sprints' => $activeSprints,
        ];
    }

    public function productivity()
    {
        return \App\Models\User::select('id', 'name')
            ->withCount(['timeEntries as total_minutes' => function($q) {
                $q->selectRaw('SUM(duration_minutes)');
            }])
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'hours_worked' => round(($user->total_minutes ?? 0) / 60, 2),
                ];
            });
    }

    public function tasksByStatus()
    {
        return \App\Models\Status::withCount('tasks')
            ->get()
            ->map(function($status) {
                return [
                    'status' => $status->name,
                    'count' => $status->tasks_count,
                    'color' => $status->color,
                ];
            });
    }

    public function recentTasks()
    {
        return Task::with(['project', 'status'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
    }
}
