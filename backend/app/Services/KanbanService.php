<?php

namespace App\Services;

use App\Models\Task;
use App\Models\Status;

class KanbanService
{
    public function getColumns(array $filters = [])
    {
        $statuses = Status::where('is_active', true)
            ->orderBy('position')
            ->get();

        $result = [];
        foreach ($statuses as $status) {
            $query = Task::where('status_id', $status->id)
                ->with(['users', 'project', 'sprint']);

            if (!empty($filters['project_id'])) {
                $query->where('project_id', $filters['project_id']);
            }
            if (!empty($filters['sprint_id'])) {
                $query->where('sprint_id', $filters['sprint_id']);
            }
            if (!empty($filters['assignee_id'])) {
                $query->whereHas('users', function($q) use ($filters) {
                    $q->where('user_id', $filters['assignee_id']);
                });
            }

            $result[] = [
                'column' => $status->name,
                'status_id' => $status->id,
                'color' => $status->color,
                'tasks' => $query->get(),
            ];
        }

        return $result;
    }

    public function moveTask(int $taskId, int $statusId)
    {
        $task = Task::findOrFail($taskId);
        $task->update(['status_id' => $statusId]);

        \App\Models\TaskHistory::create([
            'task_id' => $taskId,
            'user_id' => auth()->id(),
            'field' => 'status_id',
            'new_value' => (string) $statusId,
        ]);

        foreach ($task->users as $user) {
            \App\Models\Notification::create([
                'user_id' => $user->id,
                'title' => 'Tarefa movida',
                'message' => "A tarefa '{$task->title}' foi movida no kanban.",
                'type' => 'kanban_move',
                'data' => ['task_id' => $task->id, 'status_id' => $statusId],
            ]);
        }

        return $task->load('status', 'users');
    }
}
