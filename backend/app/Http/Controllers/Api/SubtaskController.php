<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubtaskRequest;
use App\Http\Resources\SubtaskResource;
use App\Services\SubtaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubtaskController extends Controller
{
    public function __construct(
        private SubtaskService $subtaskService
    ) {}

    public function index(int $taskId): JsonResponse
    {
        $subtasks = $this->subtaskService->listByTask($taskId);
        return response()->json(SubtaskResource::collection($subtasks)->response()->getData(true));
    }

    public function store(SubtaskRequest $request, int $taskId): JsonResponse
    {
        $data = $request->validated();
        $data['task_id'] = $taskId;
        $data['company_id'] = auth()->user()->company_id;

        $subtask = $this->subtaskService->create($data);
        return (new SubtaskResource($subtask))->response()->setStatusCode(201);
    }

    public function update(SubtaskRequest $request, int $id): JsonResponse
    {
        $subtask = $this->subtaskService->update($id, $request->validated());
        return (new SubtaskResource($subtask))->response();
    }

    public function toggle(int $id): JsonResponse
    {
        $subtask = $this->subtaskService->toggle($id);
        return (new SubtaskResource($subtask))->response();
    }

    public function destroy(int $id): JsonResponse
    {
        $this->subtaskService->delete($id);
        return response()->json(['message' => 'Subtask deleted']);
    }
}
