<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskRequest;
use App\Http\Resources\TaskResource;
use App\Http\Resources\TaskHistoryResource;
use App\Http\Resources\CommentResource;
use App\Services\TaskService;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(
        private TaskService $taskService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tasks = $this->taskService->list($request->all());
        return response()->json(TaskResource::collection($tasks)->response()->getData(true));
    }

    public function store(TaskRequest $request): JsonResponse
    {
        $task = $this->taskService->create($request->validated());
        return (new TaskResource($task))->response()->setStatusCode(201);
    }

    public function show(int $id): JsonResponse
    {
        $task = $this->taskService->get($id);
        return (new TaskResource($task))->response();
    }

    public function update(TaskRequest $request, int $id): JsonResponse
    {
        $task = $this->taskService->update($id, $request->validated());
        return (new TaskResource($task))->response();
    }

    public function destroy(int $id): JsonResponse
    {
        $this->taskService->delete($id);
        return response()->json(['message' => 'Task deleted']);
    }

    public function history(int $id): JsonResponse
    {
        $history = $this->taskService->history($id);
        return response()->json(TaskHistoryResource::collection($history)->response()->getData(true));
    }

    public function storeComment(Request $request, int $id): JsonResponse
    {
        $request->validate(['content' => 'required|string']);

        $comment = Comment::create([
            'user_id' => auth()->id(),
            'task_id' => $id,
            'content' => $request->content,
        ]);

        return (new CommentResource($comment))->response()->setStatusCode(201);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate(['status_id' => 'required|exists:statuses,id']);

        $task = $this->taskService->updateStatus($id, $request->status_id);
        return (new TaskResource($task))->response();
    }
}
