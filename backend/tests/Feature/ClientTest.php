<?php

namespace Tests\Feature;

use App\Models\Client;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_clients(): void
    {
        $user = $this->createUserWithCompany();
        Client::create(['company_id' => $user->company_id, 'name' => 'Client 1', 'status' => 'active']);
        Client::create(['company_id' => $user->company_id, 'name' => 'Client 2', 'status' => 'active']);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/clients');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_can_filter_clients_by_status(): void
    {
        $user = $this->createUserWithCompany();
        Client::create(['company_id' => $user->company_id, 'name' => 'Active Client', 'status' => 'active']);
        Client::create(['company_id' => $user->company_id, 'name' => 'Inactive Client', 'status' => 'inactive']);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/clients?status=active');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_can_create_client(): void
    {
        $user = $this->createUserWithCompany();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/clients', [
            'name' => 'New Client',
            'email' => 'client@example.com',
            'document' => '123.456.789-00',
            'phone' => '(11) 99999-9999',
            'status' => 'active',
        ]);

        $response->assertStatus(201)
            ->assertJson(['data' => ['name' => 'New Client']]);

        $this->assertDatabaseHas('clients', ['name' => 'New Client', 'company_id' => $user->company_id]);
    }

    public function test_can_view_client(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'View Client', 'status' => 'active']);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/clients/' . $client->id);

        $response->assertStatus(200)
            ->assertJson(['data' => ['id' => $client->id, 'name' => 'View Client']]);
    }

    public function test_can_update_client(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Old Name', 'status' => 'active']);

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/clients/' . $client->id, [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(200)
            ->assertJson(['data' => ['name' => 'Updated Name']]);
    }

    public function test_can_delete_client(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'To Delete', 'status' => 'active']);

        $response = $this->actingAs($user, 'sanctum')->deleteJson('/api/clients/' . $client->id);

        $response->assertStatus(200);
        $this->assertSoftDeleted('clients', ['id' => $client->id]);
    }
}
