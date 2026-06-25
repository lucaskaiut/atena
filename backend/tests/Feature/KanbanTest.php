<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Client;
use App\Models\Status;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KanbanTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_view_kanban_columns(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        Status::create(['company_id' => $user->company_id, 'name' => 'todo', 'position' => 0]);
        Status::create(['company_id' => $user->company_id, 'name' => 'in_progress', 'position' => 1]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/kanban');

        $response->assertStatus(200);
        $this->assertIsArray($response->json());
    }

    public function test_can_move_task_in_kanban(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        $status1 = Status::create(['company_id' => $user->company_id, 'name' => 'todo', 'position' => 0]);
        $status2 = Status::create(['company_id' => $user->company_id, 'name' => 'in_progress', 'position' => 1]);
        $task = Task::create(['company_id' => $user->company_id, 'project_id' => $project->id, 'title' => 'Move Task', 'status_id' => $status1->id]);
        $task->users()->attach($user->id);

        $response = $this->actingAs($user, 'sanctum')->patchJson('/api/kanban/move', [
            'task_id' => $task->id,
            'status_id' => $status2->id,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'status_id' => $status2->id]);
    }
}
