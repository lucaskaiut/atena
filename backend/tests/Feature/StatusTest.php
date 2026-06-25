<?php

namespace Tests\Feature;

use App\Models\Status;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_statuses(): void
    {
        $user = $this->createUserWithCompany();
        Status::create(['company_id' => $user->company_id, 'name' => 'backlog', 'color' => '#000', 'position' => 0]);
        Status::create(['company_id' => $user->company_id, 'name' => 'todo', 'color' => '#111', 'position' => 1]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/statuses');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_can_create_status(): void
    {
        $user = $this->createUserWithCompany();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/statuses', [
            'name' => 'New Status',
            'color' => '#FF0000',
            'position' => 5,
        ]);

        $response->assertStatus(201)
            ->assertJson(['data' => ['name' => 'New Status', 'color' => '#FF0000']]);
    }

    public function test_can_update_status(): void
    {
        $user = $this->createUserWithCompany();
        $status = Status::create(['company_id' => $user->company_id, 'name' => 'old', 'color' => '#000', 'position' => 0]);

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/statuses/' . $status->id, [
            'name' => 'updated',
        ]);

        $response->assertStatus(200);
    }

    public function test_can_toggle_status(): void
    {
        $user = $this->createUserWithCompany();
        $status = Status::create(['company_id' => $user->company_id, 'name' => 'toggle', 'color' => '#000', 'position' => 0, 'is_active' => true]);

        $response = $this->actingAs($user, 'sanctum')->patchJson('/api/statuses/' . $status->id . '/toggle');

        $response->assertStatus(200);
        $this->assertFalse($response->json('data.is_active'));
    }

    public function test_can_reorder_statuses(): void
    {
        $user = $this->createUserWithCompany();
        $status1 = Status::create(['company_id' => $user->company_id, 'name' => 'first', 'color' => '#000', 'position' => 0]);
        $status2 = Status::create(['company_id' => $user->company_id, 'name' => 'second', 'color' => '#111', 'position' => 1]);

        $response = $this->actingAs($user, 'sanctum')->patchJson('/api/statuses/reorder', [
            'positions' => [
                ['id' => $status1->id, 'position' => 1],
                ['id' => $status2->id, 'position' => 0],
            ],
        ]);

        $response->assertStatus(200);
    }
}
