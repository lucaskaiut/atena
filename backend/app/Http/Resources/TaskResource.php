<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'project_id' => $this->project_id,
            'title' => $this->title,
            'description' => $this->description,
            'priority' => $this->priority,
            'status_id' => $this->status_id,
            'sprint_id' => $this->sprint_id,
            'start_date' => $this->start_date,
            'expected_end_date' => $this->expected_end_date,
            'estimated_hours' => $this->estimated_hours,
            'progress' => $this->whenAppended('progress'),
            'project' => new ProjectResource($this->whenLoaded('project')),
            'status' => new StatusResource($this->whenLoaded('status')),
            'sprint' => new SprintResource($this->whenLoaded('sprint')),
            'users' => UserResource::collection($this->whenLoaded('users')),
            'subtasks' => SubtaskResource::collection($this->whenLoaded('subtasks')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
