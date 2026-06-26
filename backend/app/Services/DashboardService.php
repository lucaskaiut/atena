<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Task;
use App\Models\TimeEntry;
use App\Models\Sprint;
use Carbon\Carbon;

class DashboardService
{
    public function getIndicators()
    {
        $activeProjects = Project::count();

        $pendingStatusNames = ['backlog', 'todo', 'in_progress', 'review', 'approval'];
        $pendingStatusIds = \App\Models\Status::whereIn('name', $pendingStatusNames)->pluck('id');
        $pendingTasks = Task::whereIn('status_id', $pendingStatusIds)->count();

        $doneStatusIds = \App\Models\Status::where('name', 'done')->pluck('id');
        $completedTasks = Task::whereIn('status_id', $doneStatusIds)->count();

        $workedHours = TimeEntry::whereNotNull('duration_minutes')->sum('duration_minutes');
        $workedHours = round($workedHours / 60, 2);

        $estimatedHours = Task::sum('estimated_hours');

        $lateTasks = Task::where('expected_end_date', '<', Carbon::today())
            ->whereNotIn('status_id', $doneStatusIds)
            ->count();

        $activeSprints = Sprint::where('status', 'active')->count();

        return [
            'active_projects' => $activeProjects,
            'pending_tasks' => $pendingTasks,
            'completed_tasks' => $completedTasks,
            'worked_hours' => (float) $workedHours,
            'estimated_hours' => (float) $estimatedHours,
            'late_tasks' => $lateTasks,
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
