<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use App\Models\Subtask;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GanttController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $projects = Project::select('id', 'name', 'start_date', 'expected_end_date')
            ->whereNotNull('start_date')
            ->get()
            ->map(fn($p) => [
                'type' => 'project',
                'id' => $p->id,
                'name' => $p->name,
                'start_date' => $p->start_date,
                'end_date' => $p->expected_end_date,
            ]);

        $tasks = Task::select('id', 'title', 'project_id', 'start_date', 'expected_end_date', 'status_id')
            ->whereNotNull('start_date')
            ->with('status')
            ->get()
            ->map(fn($t) => [
                'type' => 'task',
                'id' => $t->id,
                'name' => $t->title,
                'project_id' => $t->project_id,
                'start_date' => $t->start_date,
                'end_date' => $t->expected_end_date,
                'status' => $t->status?->name,
            ]);

        $subtasks = Subtask::select('id', 'title', 'task_id', 'created_at', 'updated_at')
            ->with('task')
            ->get()
            ->map(fn($s) => [
                'type' => 'subtask',
                'id' => $s->id,
                'name' => $s->title,
                'task_id' => $s->task_id,
                'project_id' => $s->task?->project_id,
                'start_date' => $s->created_at?->toDateString(),
                'end_date' => $s->updated_at?->toDateString(),
            ]);

        return response()->json([
            'projects' => $projects,
            'tasks' => $tasks,
            'subtasks' => $subtasks,
        ]);
    }
}
