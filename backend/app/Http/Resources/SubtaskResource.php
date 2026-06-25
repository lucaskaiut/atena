<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubtaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'task_id' => $this->task_id,
            'title' => $this->title,
            'assignee_id' => $this->assignee_id,
            'status_id' => $this->status_id,
            'estimated_hours' => $this->estimated_hours,
            'is_completed' => $this->is_completed,
            'assignee' => new UserResource($this->whenLoaded('assignee')),
            'status' => new StatusResource($this->whenLoaded('status')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
