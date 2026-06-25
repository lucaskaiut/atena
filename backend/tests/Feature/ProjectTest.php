<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Project;
use App\Models\Status;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_projects(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);

        Project::create([
            'company_id' => $user->company_id,
            'client_id' => $client->id,
            'name' => 'Project 1',
            'priority' => 'high',
        ]);
        Project::create([
            'company_id' => $user->company_id,
            'client_id' => $client->id,
            'name' => 'Project 2',
            'priority' => 'medium',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/projects');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_can_create_project(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $status = Status::create(['company_id' => $user->company_id, 'name' => 'todo', 'position' => 0]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/projects', [
            'name' => 'New Project',
            'client_id' => $client->id,
            'priority' => 'high',
            'status_id' => $status->id,
            'start_date' => '2025-01-01',
            'expected_end_date' => '2025-12-31',
        ]);

        $response->assertStatus(201)
            ->assertJson(['data' => ['name' => 'New Project']]);
    }

    public function test_can_view_project(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create([
            'company_id' => $user->company_id,
            'client_id' => $client->id,
            'name' => 'View Project',
            'priority' => 'medium',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/projects/' . $project->id);

        $response->assertStatus(200)
            ->assertJson(['data' => ['id' => $project->id, 'name' => 'View Project']]);
    }

    public function test_can_update_project(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create([
            'company_id' => $user->company_id,
            'client_id' => $client->id,
            'name' => 'Old Name',
            'priority' => 'low',
        ]);

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/projects/' . $project->id, [
            'name' => 'Updated Name',
            'client_id' => $client->id,
        ]);

        $response->assertStatus(200);
    }

    public function test_can_close_project(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create([
            'company_id' => $user->company_id,
            'client_id' => $client->id,
            'name' => 'To Close',
            'priority' => 'medium',
            'manager_id' => $user->id,
        ]);

        $response = $this->actingAs($user, 'sanctum')->patchJson('/api/projects/' . $project->id . '/close');

        $response->assertStatus(200);
    }

    public function test_can_delete_project(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create([
            'company_id' => $user->company_id,
            'client_id' => $client->id,
            'name' => 'To Delete',
            'priority' => 'low',
        ]);

        $response = $this->actingAs($user, 'sanctum')->deleteJson('/api/projects/' . $project->id);

        $response->assertStatus(200);
        $this->assertSoftDeleted('projects', ['id' => $project->id]);
    }
}
