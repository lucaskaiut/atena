<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Client;
use App\Models\Status;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_view_dashboard_indicators(): void
    {
        $user = $this->createUserWithCompany();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'active_projects',
                'pending_tasks',
                'completed_tasks',
                'worked_hours',
                'estimated_hours',
                'late_tasks',
                'active_sprints',
            ]);
    }

    public function test_can_view_productivity(): void
    {
        $user = $this->createUserWithCompany();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/dashboard/productivity');

        $response->assertStatus(200);
    }
}
