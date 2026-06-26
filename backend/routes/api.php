<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\GanttController;
use App\Http\Controllers\Api\KanbanController;
use App\Http\Controllers\Api\McpController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\SprintController;
use App\Http\Controllers\Api\StatusController;
use App\Http\Controllers\Api\SubtaskController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TimeEntryController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/auth/me', [AuthController::class, 'me'])->middleware('auth.cookie');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/stats', [DashboardController::class, 'index']);
    Route::get('/dashboard/productivity', [DashboardController::class, 'productivity']);
    Route::get('/dashboard/tasks-by-status', [DashboardController::class, 'tasksByStatus']);
    Route::get('/dashboard/recent-tasks', [DashboardController::class, 'recentTasks']);

    Route::get('/search', [SearchController::class, 'index']);

    Route::apiResource('companies', CompanyController::class)->only(['index', 'store', 'show', 'update']);
    Route::apiResource('users', UserController::class);
    Route::apiResource('clients', ClientController::class);

    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
    Route::patch('/projects/{id}/close', [ProjectController::class, 'close']);

    Route::get('/statuses', [StatusController::class, 'index']);
    Route::post('/statuses', [StatusController::class, 'store']);
    Route::put('/statuses/{id}', [StatusController::class, 'update']);
    Route::patch('/statuses/{id}/toggle', [StatusController::class, 'toggle']);
    Route::patch('/statuses/reorder', [StatusController::class, 'reorder']);

    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::get('/tasks/{id}', [TaskController::class, 'show']);
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
    Route::get('/tasks/{id}/history', [TaskController::class, 'history']);
    Route::post('/tasks/{id}/comments', [TaskController::class, 'storeComment']);
    Route::patch('/tasks/{id}/status', [TaskController::class, 'updateStatus']);

    Route::get('/tasks/{taskId}/subtasks', [SubtaskController::class, 'index']);
    Route::post('/tasks/{taskId}/subtasks', [SubtaskController::class, 'store']);
    Route::put('/subtasks/{id}', [SubtaskController::class, 'update']);
    Route::patch('/subtasks/{id}/toggle', [SubtaskController::class, 'toggle']);
    Route::delete('/subtasks/{id}', [SubtaskController::class, 'destroy']);

    Route::post('/tasks/{taskId}/time-entries/start', [TimeEntryController::class, 'start']);
    Route::patch('/time-entries/{id}/pause', [TimeEntryController::class, 'pause']);
    Route::patch('/time-entries/{id}/resume', [TimeEntryController::class, 'resume']);
    Route::patch('/time-entries/{id}/stop', [TimeEntryController::class, 'stop']);
    Route::post('/tasks/{taskId}/time-entries', [TimeEntryController::class, 'store']);
    Route::get('/time-entries', [TimeEntryController::class, 'index']);
    Route::get('/tasks/{taskId}/time-entries', [TimeEntryController::class, 'byTask']);
    Route::delete('/time-entries/{id}', [TimeEntryController::class, 'destroy']);

    Route::get('/sprints', [SprintController::class, 'index']);
    Route::post('/sprints', [SprintController::class, 'store']);
    Route::get('/sprints/{id}', [SprintController::class, 'show']);
    Route::put('/sprints/{id}', [SprintController::class, 'update']);
    Route::patch('/sprints/{id}/close', [SprintController::class, 'close']);

    Route::get('/kanban', [KanbanController::class, 'index']);
    Route::patch('/kanban/move', [KanbanController::class, 'move']);

    Route::get('/gantt', [GanttController::class, 'index']);

    Route::get('/reports/hours', [ReportController::class, 'hours']);
    Route::get('/reports/tasks', [ReportController::class, 'tasks']);
    Route::get('/reports/estimates', [ReportController::class, 'estimates']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    Route::post('/mcp', [McpController::class, 'handle']);
});
