<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class McpController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        $body = $request->json()->all();

        if (($body['jsonrpc'] ?? '') !== '2.0') {
            return $this->error(-32600, 'Invalid Request', $body['id'] ?? null);
        }

        $method = $body['method'] ?? '';
        $id = $body['id'] ?? null;

        return match ($method) {
            'tools/list' => $this->toolsList($id),
            'tools/call' => $this->toolsCall($body['params'] ?? [], $id),
            'initialize' => $this->initialize($id),
            'notifications/initialized' => response()->json(['jsonrpc' => '2.0', 'id' => $id]),
            default => $this->error(-32601, "Method not found: {$method}", $id),
        };
    }

    private function initialize($id): JsonResponse
    {
        return response()->json([
            'jsonrpc' => '2.0',
            'id' => $id,
            'result' => [
                'protocolVersion' => '2024-11-05',
                'capabilities' => ['tools' => new \stdClass()],
                'serverInfo' => [
                    'name' => 'atena-mcp',
                    'version' => '1.0.0',
                ],
            ],
        ]);
    }

    private function toolsList($id): JsonResponse
    {
        return response()->json([
            'jsonrpc' => '2.0',
            'id' => $id,
            'result' => [
                'tools' => $this->toolDefinitions(),
            ],
        ]);
    }

    private function toolsCall(array $params, $id): JsonResponse
    {
        $name = $params['name'] ?? '';
        $arguments = $params['arguments'] ?? [];

        try {
            $result = $this->dispatchTool($name, $arguments);
            return response()->json([
                'jsonrpc' => '2.0',
                'id' => $id,
                'result' => [
                    'content' => [
                        ['type' => 'text', 'text' => json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)],
                    ],
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'jsonrpc' => '2.0',
                'id' => $id,
                'result' => [
                    'content' => [
                        ['type' => 'text', 'text' => 'Error: ' . $e->getMessage()],
                    ],
                    'isError' => true,
                ],
            ]);
        }
    }

    private function dispatchTool(string $name, array $arguments): mixed
    {
        return match ($name) {
            'dashboard_stats' => $this->dashboardStats(),
            'list_projects' => $this->listProjects($arguments),
            'get_project' => $this->getProject($arguments),
            'list_tasks' => $this->listTasks($arguments),
            'get_task' => $this->getTask($arguments),
            'create_task' => $this->createTask($arguments),
            'update_task_status' => $this->updateTaskStatus($arguments),
            'list_statuses' => $this->listStatuses($arguments),
            'list_sprints' => $this->listSprints($arguments),
            'get_sprint' => $this->getSprint($arguments),
            'create_time_entry' => $this->createTimeEntry($arguments),
            'get_time_entries' => $this->getTimeEntries($arguments),
            'get_kanban' => $this->getKanban($arguments),
            'list_clients' => $this->listClients($arguments),
            'list_users' => $this->listUsers($arguments),
            default => throw new \InvalidArgumentException("Unknown tool: {$name}"),
        };
    }

    // ── Tool implementations ──

    private function dashboardStats(): array
    {
        return app(\App\Services\DashboardService::class)->getIndicators();
    }

    private function listProjects(array $args): array
    {
        return app(\App\Services\ProjectService::class)->list($args)->toArray();
    }

    private function getProject(array $args): array
    {
        $project = app(\App\Services\ProjectService::class)->get($args['id']);
        return (new \App\Http\Resources\ProjectResource($project))->toArray(request());
    }

    private function listTasks(array $args): array
    {
        return app(\App\Services\TaskService::class)->list($args)->toArray();
    }

    private function getTask(array $args): array
    {
        $task = app(\App\Services\TaskService::class)->get($args['id']);
        return (new \App\Http\Resources\TaskResource($task))->toArray(request());
    }

    private function createTask(array $args): array
    {
        $task = app(\App\Services\TaskService::class)->create($args);
        return (new \App\Http\Resources\TaskResource($task))->toArray(request());
    }

    private function updateTaskStatus(array $args): array
    {
        $task = app(\App\Services\KanbanService::class)->moveTask($args['id'], $args['status_id']);
        return (new \App\Http\Resources\TaskResource($task))->toArray(request());
    }

    private function listStatuses(array $args): array
    {
        $filters = [];
        if (isset($args['type'])) {
            $filters['type'] = $args['type'];
        }
        $statuses = app(\App\Services\StatusService::class)->list($filters);
        return \App\Http\Resources\StatusResource::collection($statuses)->toArray(request());
    }

    private function listSprints(array $args): array
    {
        return app(\App\Services\SprintService::class)->list($args)->toArray();
    }

    private function getSprint(array $args): array
    {
        $sprint = app(\App\Services\SprintService::class)->get($args['id']);
        return (new \App\Http\Resources\SprintResource($sprint))->toArray(request());
    }

    private function createTimeEntry(array $args): array
    {
        $entry = app(\App\Services\TimeEntryService::class)->createManual([
            'task_id' => $args['task_id'],
            'user_id' => auth()->id(),
            'company_id' => auth()->user()->company_id,
            'start_time' => $args['start_time'],
            'end_time' => $args['end_time'],
            'description' => $args['description'] ?? null,
        ]);
        return (new \App\Http\Resources\TimeEntryResource($entry))->toArray(request());
    }

    private function getTimeEntries(array $args): array
    {
        $entries = app(\App\Services\TimeEntryService::class)->byTask($args['task_id']);
        return \App\Http\Resources\TimeEntryResource::collection($entries)->toArray(request());
    }

    private function getKanban(array $args): array
    {
        return app(\App\Services\KanbanService::class)->getColumns($args);
    }

    private function listClients(array $args): array
    {
        $filters = array_intersect_key($args, array_flip(['search', 'page', 'per_page']));
        return app(\App\Services\ClientService::class)->list($filters)->toArray();
    }

    private function listUsers(array $args): array
    {
        $filters = array_intersect_key($args, array_flip(['search', 'page', 'per_page']));
        return app(\App\Services\UserService::class)->list($filters)->toArray();
    }

    // ── Tool definitions ──

    private function toolDefinitions(): array
    {
        return [
            [
                'name' => 'dashboard_stats',
                'description' => 'Get dashboard statistics: total projects, total tasks, hours worked, hours estimated, active sprints',
                'inputSchema' => ['type' => 'object', 'properties' => new \stdClass()],
            ],
            [
                'name' => 'list_projects',
                'description' => 'List all projects with search and pagination',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'search' => ['type' => 'string'],
                        'page' => ['type' => 'integer', 'default' => 1],
                        'client_id' => ['type' => 'integer'],
                        'status_id' => ['type' => 'integer'],
                    ],
                ],
            ],
            [
                'name' => 'get_project',
                'description' => 'Get a project by ID with details',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => ['id' => ['type' => 'integer']],
                    'required' => ['id'],
                ],
            ],
            [
                'name' => 'list_tasks',
                'description' => 'List tasks with filters: project, status, priority, sprint, search',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'search' => ['type' => 'string'],
                        'page' => ['type' => 'integer', 'default' => 1],
                        'project_id' => ['type' => 'integer'],
                        'status_id' => ['type' => 'integer'],
                        'priority' => ['type' => 'string', 'enum' => ['low', 'medium', 'high', 'critical']],
                        'sprint_id' => ['type' => 'integer'],
                        'per_page' => ['type' => 'integer', 'default' => 15],
                    ],
                ],
            ],
            [
                'name' => 'get_task',
                'description' => 'Get task details by ID, including subtasks, comments, time entries',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => ['id' => ['type' => 'integer']],
                    'required' => ['id'],
                ],
            ],
            [
                'name' => 'create_task',
                'description' => 'Create a new task',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'title' => ['type' => 'string'],
                        'description' => ['type' => 'string'],
                        'project_id' => ['type' => 'integer'],
                        'priority' => ['type' => 'string', 'enum' => ['low', 'medium', 'high', 'critical'], 'default' => 'medium'],
                        'status_id' => ['type' => 'integer'],
                        'estimated_hours' => ['type' => 'number'],
                        'sprint_id' => ['type' => 'integer'],
                    ],
                    'required' => ['title', 'project_id'],
                ],
            ],
            [
                'name' => 'update_task_status',
                'description' => 'Move a task to a different status column',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => ['type' => 'integer'],
                        'status_id' => ['type' => 'integer'],
                    ],
                    'required' => ['id', 'status_id'],
                ],
            ],
            [
                'name' => 'list_statuses',
                'description' => 'List available statuses for tasks or projects',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => ['type' => ['type' => 'string', 'enum' => ['task', 'project']]],
                ],
            ],
            [
                'name' => 'list_sprints',
                'description' => 'List all sprints with search and pagination',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'search' => ['type' => 'string'],
                        'page' => ['type' => 'integer', 'default' => 1],
                        'project_id' => ['type' => 'integer'],
                        'status' => ['type' => 'string'],
                    ],
                ],
            ],
            [
                'name' => 'get_sprint',
                'description' => 'Get sprint details by ID with tasks and indicators',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => ['id' => ['type' => 'integer']],
                    'required' => ['id'],
                ],
            ],
            [
                'name' => 'create_time_entry',
                'description' => 'Create a manual time entry on a task (retroactive). Provide task_id, start_time, end_time and optional description.',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'task_id' => ['type' => 'integer'],
                        'start_time' => ['type' => 'string', 'description' => 'ISO datetime'],
                        'end_time' => ['type' => 'string', 'description' => 'ISO datetime'],
                        'description' => ['type' => 'string'],
                    ],
                    'required' => ['task_id', 'start_time', 'end_time'],
                ],
            ],
            [
                'name' => 'get_time_entries',
                'description' => 'Get all time entries for a task',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => ['task_id' => ['type' => 'integer']],
                    'required' => ['task_id'],
                ],
            ],
            [
                'name' => 'get_kanban',
                'description' => 'Get full kanban board: all columns with their tasks',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'project_id' => ['type' => 'integer'],
                        'sprint_id' => ['type' => 'integer'],
                    ],
                ],
            ],
            [
                'name' => 'list_clients',
                'description' => 'List all clients',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'search' => ['type' => 'string'],
                        'page' => ['type' => 'integer', 'default' => 1],
                    ],
                ],
            ],
            [
                'name' => 'list_users',
                'description' => 'List all users in the company',
                'inputSchema' => [
                    'type' => 'object',
                    'properties' => [
                        'search' => ['type' => 'string'],
                        'page' => ['type' => 'integer', 'default' => 1],
                    ],
                ],
            ],
        ];
    }

    private function error(int $code, string $message, $id = null): JsonResponse
    {
        return response()->json([
            'jsonrpc' => '2.0',
            'id' => $id,
            'error' => ['code' => $code, 'message' => $message],
        ]);
    }
}
