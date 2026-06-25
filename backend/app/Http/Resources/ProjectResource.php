<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'client_id' => $this->client_id,
            'name' => $this->name,
            'description' => $this->description,
            'manager_id' => $this->manager_id,
            'start_date' => $this->start_date,
            'expected_end_date' => $this->expected_end_date,
            'priority' => $this->priority,
            'status_id' => $this->status_id,
            'sprint_id' => $this->sprint_id,
            'client' => new ClientResource($this->whenLoaded('client')),
            'manager' => new UserResource($this->whenLoaded('manager')),
            'status' => new StatusResource($this->whenLoaded('status')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
