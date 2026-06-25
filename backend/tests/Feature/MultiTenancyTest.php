<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MultiTenancyTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_cannot_see_other_company_data(): void
    {
        $company1 = Company::create(['name' => 'Company 1', 'status' => 'active']);
        $company2 = Company::create(['name' => 'Company 2', 'status' => 'active']);

        $user1 = User::create([
            'name' => 'User 1',
            'email' => 'user1@example.com',
            'password' => bcrypt('password'),
            'company_id' => $company1->id,
            'status' => 'active',
        ]);

        $user2 = User::create([
            'name' => 'User 2',
            'email' => 'user2@example.com',
            'password' => bcrypt('password'),
            'company_id' => $company2->id,
            'status' => 'active',
        ]);

        // User 1 creates a client
        $client1 = Client::create(['company_id' => $company1->id, 'name' => 'C1 Client', 'status' => 'active']);

        // User 2 creates a client
        $client2 = Client::create(['company_id' => $company2->id, 'name' => 'C2 Client', 'status' => 'active']);

        // User 1 should only see their own client
        $this->actingAs($user1, 'sanctum');
        $response = $this->getJson('/api/clients');
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('C1 Client', $data[0]['name']);

        // User 2 should only see their own client
        $this->actingAs($user2, 'sanctum');
        $response2 = $this->getJson('/api/clients');
        $response2->assertStatus(200);
        $data2 = $response2->json('data');
        $this->assertCount(1, $data2);
        $this->assertEquals('C2 Client', $data2[0]['name']);
    }

    public function test_tenant_isolation_for_tasks(): void
    {
        $company1 = Company::create(['name' => 'Company 1', 'status' => 'active']);
        $company2 = Company::create(['name' => 'Company 2', 'status' => 'active']);

        $user1 = User::create([
            'name' => 'User 1', 'email' => 'u1@test.com', 'password' => bcrypt('password'),
            'company_id' => $company1->id, 'status' => 'active',
        ]);

        $user2 = User::create([
            'name' => 'User 2', 'email' => 'u2@test.com', 'password' => bcrypt('password'),
            'company_id' => $company2->id, 'status' => 'active',
        ]);

        $client1 = Client::create(['company_id' => $company1->id, 'name' => 'C1', 'status' => 'active']);
        $client2 = Client::create(['company_id' => $company2->id, 'name' => 'C2', 'status' => 'active']);

        $project1 = \App\Models\Project::create(['company_id' => $company1->id, 'client_id' => $client1->id, 'name' => 'P1', 'priority' => 'low']);
        $project2 = \App\Models\Project::create(['company_id' => $company2->id, 'client_id' => $client2->id, 'name' => 'P2', 'priority' => 'low']);

        $status1 = \App\Models\Status::create(['company_id' => $company1->id, 'name' => 'todo', 'position' => 0]);
        $status2 = \App\Models\Status::create(['company_id' => $company2->id, 'name' => 'todo', 'position' => 0]);

        \App\Models\Task::create(['company_id' => $company1->id, 'project_id' => $project1->id, 'title' => 'C1 Task', 'status_id' => $status1->id]);
        \App\Models\Task::create(['company_id' => $company2->id, 'project_id' => $project2->id, 'title' => 'C2 Task', 'status_id' => $status2->id]);

        $this->actingAs($user1, 'sanctum');
        $response = $this->getJson('/api/tasks');
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('C1 Task', $response->json('data.0.title'));

        $this->actingAs($user2, 'sanctum');
        $response2 = $this->getJson('/api/tasks');
        $this->assertCount(1, $response2->json('data'));
        $this->assertEquals('C2 Task', $response2->json('data.0.title'));
    }
}
