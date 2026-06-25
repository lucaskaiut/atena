<?php

namespace App\Services;

use App\Interfaces\ProjectRepositoryInterface;
use App\Interfaces\NotificationRepositoryInterface;

class ProjectService
{
    public function __construct(
        private ProjectRepositoryInterface $repository,
        private NotificationRepositoryInterface $notificationRepository
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
        return $this->repository->find($id);
    }

    public function update(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): void
    {
        $this->repository->delete($id);
    }

    public function close(int $id)
    {
        $project = $this->repository->find($id);
        // Find a "completed" status or use the current one
        $project->update(['status_id' => $project->status_id]);

        // Notify manager
        if ($project->manager_id) {
            $this->notificationRepository->create([
                'user_id' => $project->manager_id,
                'title' => 'Projeto fechado',
                'message' => "O projeto '{$project->name}' foi fechado.",
                'type' => 'info',
                'data' => ['project_id' => $project->id],
            ]);
        }

        return $project;
    }
}
