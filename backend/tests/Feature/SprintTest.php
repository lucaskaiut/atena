<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Client;
use App\Models\Sprint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SprintTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_sprints(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);

        Sprint::create([
            'company_id' => $user->company_id,
            'project_id' => $project->id,
            'name' => 'Sprint 1',
            'start_date' => '2025-01-01',
            'end_date' => '2025-01-15',
            'status' => 'planning',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/sprints');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_can_create_sprint(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/sprints', [
            'project_id' => $project->id,
            'name' => 'New Sprint',
            'start_date' => '2025-03-01',
            'end_date' => '2025-03-15',
        ]);

        $response->assertStatus(201)
            ->assertJson(['data' => ['name' => 'New Sprint']]);
    }

    public function test_can_view_sprint_with_indicators(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        $sprint = Sprint::create([
            'company_id' => $user->company_id,
            'project_id' => $project->id,
            'name' => 'Sprint Indicators',
            'start_date' => '2025-01-01',
            'end_date' => '2025-01-15',
            'status' => 'active',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/sprints/' . $sprint->id);

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['indicators']]);
    }

    public function test_can_update_sprint(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        $sprint = Sprint::create([
            'company_id' => $user->company_id,
            'project_id' => $project->id,
            'name' => 'Old Name',
            'start_date' => '2025-01-01',
            'end_date' => '2025-01-15',
            'status' => 'planning',
        ]);

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/sprints/' . $sprint->id, [
            'project_id' => $project->id,
            'name' => 'Updated Name',
            'start_date' => '2025-01-01',
            'end_date' => '2025-01-15',
        ]);

        $response->assertStatus(200);
    }

    public function test_can_close_sprint(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        $sprint = Sprint::create([
            'company_id' => $user->company_id,
            'project_id' => $project->id,
            'name' => 'To Close',
            'start_date' => '2025-01-01',
            'end_date' => '2025-01-15',
            'status' => 'active',
        ]);

        $response = $this->actingAs($user, 'sanctum')->patchJson('/api/sprints/' . $sprint->id . '/close');

        $response->assertStatus(200);
        $this->assertDatabaseHas('sprints', ['id' => $sprint->id, 'status' => 'completed']);
    }
}
