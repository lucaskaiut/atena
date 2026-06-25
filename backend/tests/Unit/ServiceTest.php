<?php

namespace Tests\Unit;

use App\Models\Company;
use App\Models\User;
use App\Models\Client;
use App\Models\Project;
use App\Models\Status;
use App\Models\Task;
use App\Services\DashboardService;
use App\Services\ReportService;
use App\Services\KanbanService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_service_returns_indicators(): void
    {
        $company = Company::create(['name' => 'Test Co', 'status' => 'active']);
        $user = User::create([
            'name' => 'Test', 'email' => 't@t.com', 'password' => bcrypt('pass'),
            'company_id' => $company->id, 'status' => 'active',
        ]);
        $this->actingAs($user, 'sanctum');

        $service = app(DashboardService::class);
        $indicators = $service->getIndicators();

        $this->assertIsArray($indicators);
        $this->assertArrayHasKey('active_projects', $indicators);
        $this->assertArrayHasKey('pending_tasks', $indicators);
        $this->assertArrayHasKey('completed_tasks', $indicators);
    }

    public function test_report_service_hours(): void
    {
        $company = Company::create(['name' => 'Test Co', 'status' => 'active']);
        $user = User::create([
            'name' => 'Test', 'email' => 't@t.com', 'password' => bcrypt('pass'),
            'company_id' => $company->id, 'status' => 'active',
        ]);
        $this->actingAs($user, 'sanctum');

        $service = app(ReportService::class);
        $report = $service->hoursReport();

        $this->assertIsArray($report);
        $this->assertArrayHasKey('data', $report);
        $this->assertArrayHasKey('total_hours', $report);
        $this->assertEquals(0, $report['total_hours']);
    }

    public function test_report_service_tasks(): void
    {
        $company = Company::create(['name' => 'Test Co', 'status' => 'active']);
        $user = User::create([
            'name' => 'Test', 'email' => 't@t.com', 'password' => bcrypt('pass'),
            'company_id' => $company->id, 'status' => 'active',
        ]);
        $this->actingAs($user, 'sanctum');

        $service = app(ReportService::class);
        $report = $service->tasksReport();

        $this->assertArrayHasKey('open_tasks', $report);
        $this->assertArrayHasKey('completed_tasks', $report);
        $this->assertArrayHasKey('late_tasks', $report);
    }

    public function test_report_service_estimates(): void
    {
        $company = Company::create(['name' => 'Test Co', 'status' => 'active']);
        $user = User::create([
            'name' => 'Test', 'email' => 't@t.com', 'password' => bcrypt('pass'),
            'company_id' => $company->id, 'status' => 'active',
        ]);
        $this->actingAs($user, 'sanctum');

        $service = app(ReportService::class);
        $report = $service->estimatesReport();

        $this->assertArrayHasKey('planned_hours', $report);
        $this->assertArrayHasKey('realized_hours', $report);
        $this->assertArrayHasKey('difference', $report);
    }

    public function test_kanban_service_returns_columns(): void
    {
        $company = Company::create(['name' => 'Test Co', 'status' => 'active']);
        $user = User::create([
            'name' => 'Test', 'email' => 't@t.com', 'password' => bcrypt('pass'),
            'company_id' => $company->id, 'status' => 'active',
        ]);
        $this->actingAs($user, 'sanctum');

        Status::create(['company_id' => $company->id, 'name' => 'todo', 'position' => 0]);
        Status::create(['company_id' => $company->id, 'name' => 'done', 'position' => 1]);

        $service = app(KanbanService::class);
        $columns = $service->getColumns();

        $this->assertIsArray($columns);
        $this->assertCount(2, $columns);
    }
}
