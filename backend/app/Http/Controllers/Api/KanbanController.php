<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\KanbanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KanbanController extends Controller
{
    public function __construct(
        private KanbanService $kanbanService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $columns = $this->kanbanService->getColumns($request->all());
        return response()->json(['data' => $columns]);
    }

    public function move(Request $request): JsonResponse
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'status_id' => 'required|exists:statuses,id',
        ]);

        $task = $this->kanbanService->moveTask($request->task_id, $request->status_id);
        return response()->json($task);
    }
}
