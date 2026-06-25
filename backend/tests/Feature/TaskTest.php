<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Client;
use App\Models\Status;
use App\Models\Task;
use App\Models\TaskHistory;
use App\Models\Comment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_tasks(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        $status = Status::create(['company_id' => $user->company_id, 'name' => 'todo', 'position' => 0]);

        Task::create(['company_id' => $user->company_id, 'project_id' => $project->id, 'title' => 'Task 1', 'status_id' => $status->id]);
        Task::create(['company_id' => $user->company_id, 'project_id' => $project->id, 'title' => 'Task 2', 'status_id' => $status->id]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/tasks');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_can_create_task(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        $status = Status::create(['company_id' => $user->company_id, 'name' => 'todo', 'position' => 0]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/tasks', [
            'project_id' => $project->id,
            'title' => 'New Task',
            'description' => 'Task description',
            'priority' => 'high',
            'status_id' => $status->id,
            'user_ids' => [$user->id],
            'estimated_hours' => 10,
        ]);

        $response->assertStatus(201)
            ->assertJson(['data' => ['title' => 'New Task']]);

        $this->assertDatabaseHas('tasks', ['title' => 'New Task']);
    }

    public function test_can_view_task(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        $status = Status::create(['company_id' => $user->company_id, 'name' => 'todo', 'position' => 0]);
        $task = Task::create(['company_id' => $user->company_id, 'project_id' => $project->id, 'title' => 'View Task', 'status_id' => $status->id]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/tasks/' . $task->id);

        $response->assertStatus(200)
            ->assertJson(['data' => ['id' => $task->id, 'title' => 'View Task']]);
    }

    public function test_can_update_task(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        $status = Status::create(['company_id' => $user->company_id, 'name' => 'todo', 'position' => 0]);
        $task = Task::create(['company_id' => $user->company_id, 'project_id' => $project->id, 'title' => 'Old Title', 'status_id' => $status->id]);

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/tasks/' . $task->id, [
            'project_id' => $project->id,
            'title' => 'Updated Title',
        ]);

        $response->assertStatus(200);
    }

    public function test_can_change_task_status(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        $status1 = Status::create(['company_id' => $user->company_id, 'name' => 'todo', 'position' => 0]);
        $status2 = Status::create(['company_id' => $user->company_id, 'name' => 'in_progress', 'position' => 1]);
        $task = Task::create(['company_id' => $user->company_id, 'project_id' => $project->id, 'title' => 'Status Task', 'status_id' => $status1->id]);
        $task->users()->attach($user->id);

        $response = $this->actingAs($user, 'sanctum')->patchJson('/api/tasks/' . $task->id . '/status', [
            'status_id' => $status2->id,
        ]);

        $response->assertStatus(200);

        // Check history was created
        $this->assertDatabaseHas('task_histories', [
            'task_id' => $task->id,
            'field' => 'status_id',
        ]);
    }

    public function test_can_view_task_history(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        $status = Status::create(['company_id' => $user->company_id, 'name' => 'todo', 'position' => 0]);
        $task = Task::create(['company_id' => $user->company_id, 'project_id' => $project->id, 'title' => 'History Task', 'status_id' => $status->id]);

        TaskHistory::create([
            'task_id' => $task->id,
            'user_id' => $user->id,
            'field' => 'status_id',
            'old_value' => '1',
            'new_value' => '2',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/tasks/' . $task->id . '/history');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_can_add_comment(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        $status = Status::create(['company_id' => $user->company_id, 'name' => 'todo', 'position' => 0]);
        $task = Task::create(['company_id' => $user->company_id, 'project_id' => $project->id, 'title' => 'Comment Task', 'status_id' => $status->id]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/tasks/' . $task->id . '/comments', [
            'content' => 'This is a test comment',
        ]);

        $response->assertStatus(201)
            ->assertJson(['data' => ['content' => 'This is a test comment']]);
    }

    public function test_can_delete_task(): void
    {
        $user = $this->createUserWithCompany();
        $client = Client::create(['company_id' => $user->company_id, 'name' => 'Client', 'status' => 'active']);
        $project = Project::create(['company_id' => $user->company_id, 'client_id' => $client->id, 'name' => 'Project', 'priority' => 'medium']);
        $status = Status::create(['company_id' => $user->company_id, 'name' => 'todo', 'position' => 0]);
        $task = Task::create(['company_id' => $user->company_id, 'project_id' => $project->id, 'title' => 'To Delete', 'status_id' => $status->id]);

        $response = $this->actingAs($user, 'sanctum')->deleteJson('/api/tasks/' . $task->id);

        $response->assertStatus(200);
        $this->assertSoftDeleted('tasks', ['id' => $task->id]);
    }
}
