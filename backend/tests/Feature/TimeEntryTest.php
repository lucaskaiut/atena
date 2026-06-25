<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Client;
use App\Models\Status;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TimeEntryTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_start_time_entry(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        $status = Status::create(['company_id' => $user->company_id, 'name' => 'todo', 'position' => 0]);
        $task = Task::create(['company_id' => $user->company_id, 'project_id' => $project->id, 'title' => 'Task', 'status_id' => $status->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/tasks/' . $task->id . '/time-entries/start');

        $response->assertStatus(201)
            ->assertJson(['data' => ['task_id' => $task->id, 'user_id' => $user->id]]);
    }

    public function test_can_pause_time_entry(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        $status = Status::create(['company_id' => $user->company_id, 'name' => 'todo', 'position' => 0]);
        $task = Task::create(['company_id' => $user->company_id, 'project_id' => $project->id, 'title' => 'Task', 'status_id' => $status->id]);

        // Start
        $startResp = $this->actingAs($user, 'sanctum')
            ->postJson('/api/tasks/' . $task->id . '/time-entries/start');
        $entryId = $startResp->json('data.id');

        // Pause
        $response = $this->actingAs($user, 'sanctum')
            ->patchJson('/api/time-entries/' . $entryId . '/pause');

        $response->assertStatus(200);
        $this->assertNotNull($response->json('data.end_time'));
    }

    public function test_can_create_manual_time_entry(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        $status = Status::create(['company_id' => $user->company_id, 'name' => 'todo', 'position' => 0]);
        $task = Task::create(['company_id' => $user->company_id, 'project_id' => $project->id, 'title' => 'Task', 'status_id' => $status->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/tasks/' . $task->id . '/time-entries', [
                'start_time' => '2025-01-01 08:00:00',
                'end_time' => '2025-01-01 12:00:00',
                'duration_minutes' => 240,
                'description' => 'Manual entry',
            ]);

        $response->assertStatus(201);
        $this->assertEquals(240, $response->json('data.duration_minutes'));
    }

    public function test_can_list_time_entries(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        $status = Status::create(['company_id' => $user->company_id, 'name' => 'todo', 'position' => 0]);
        $task = Task::create(['company_id' => $user->company_id, 'project_id' => $project->id, 'title' => 'Task', 'status_id' => $status->id]);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/tasks/' . $task->id . '/time-entries', [
                'start_time' => '2025-01-01 08:00:00',
                'duration_minutes' => 120,
            ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/time-entries');

        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data'));
    }
}
