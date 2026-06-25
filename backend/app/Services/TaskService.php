<?php

namespace App\Services;

use App\Interfaces\TaskRepositoryInterface;
use App\Interfaces\NotificationRepositoryInterface;
use App\Models\TaskHistory;

class TaskService
{
    public function __construct(
        private TaskRepositoryInterface $repository,
        private NotificationRepositoryInterface $notificationRepository
    ) {}

    public function list(array $filters = [])
    {
        return $this->repository->all($filters);
    }

    public function create(array $data)
    {
        $task = $this->repository->create($data);

        // Record history
        TaskHistory::create([
            'task_id' => $task->id,
            'user_id' => auth()->id(),
            'field' => 'created',
            'new_value' => 'Tarefa criada',
        ]);

        // Notify assignees
        if (!empty($data['user_ids'])) {
            foreach ($data['user_ids'] as $userId) {
                $this->notificationRepository->create([
                    'user_id' => $userId,
                    'title' => 'Nova tarefa',
                    'message' => "Você foi atribuído à tarefa '{$task->title}'.",
                    'type' => 'task_assigned',
                    'data' => ['task_id' => $task->id],
                ]);
            }
        }

        return $task->load('status', 'users', 'project');
    }

    public function get(int $id)
    {
        return $this->repository->find($id);
    }

    public function update(int $id, array $data)
    {
        $task = $this->repository->find($id);
        $oldStatusId = $task->status_id;

        $updated = $this->repository->update($id, $data);

        // Record history for changed fields
        foreach (['title', 'description', 'priority', 'status_id', 'sprint_id', 'start_date', 'expected_end_date', 'estimated_hours'] as $field) {
            if (array_key_exists($field, $data) && $task->$field != $data[$field]) {
                TaskHistory::create([
                    'task_id' => $id,
                    'user_id' => auth()->id(),
                    'field' => $field,
                    'old_value' => (string) $task->$field,
                    'new_value' => (string) $data[$field],
                ]);
            }
        }

        // Notify on status change
        if ($oldStatusId != ($data['status_id'] ?? $oldStatusId)) {
            foreach ($task->users as $user) {
                $this->notificationRepository->create([
                    'user_id' => $user->id,
                    'title' => 'Status alterado',
                    'message' => "A tarefa '{$task->title}' teve seu status alterado.",
                    'type' => 'status_change',
                    'data' => ['task_id' => $task->id, 'old_status' => $oldStatusId, 'new_status' => $data['status_id']],
                ]);
            }
        }

        return $updated;
    }

    public function delete(int $id): void
    {
        $this->repository->delete($id);
    }

    public function updateStatus(int $id, int $statusId)
    {
        $task = $this->repository->find($id);
        $oldStatusId = $task->status_id;

        $updated = $this->repository->updateStatus($id, $statusId);

        TaskHistory::create([
            'task_id' => $id,
            'user_id' => auth()->id(),
            'field' => 'status_id',
            'old_value' => (string) $oldStatusId,
            'new_value' => (string) $statusId,
        ]);

        foreach ($task->users as $user) {
            $this->notificationRepository->create([
                'user_id' => $user->id,
                'title' => 'Status alterado',
                'message' => "A tarefa '{$task->title}' foi movida no kanban.",
                'type' => 'status_change',
                'data' => ['task_id' => $task->id, 'old_status' => $oldStatusId, 'new_status' => $statusId],
            ]);
        }

        return $updated;
    }

    public function history(int $id)
    {
        return $this->repository->history($id);
    }
}
