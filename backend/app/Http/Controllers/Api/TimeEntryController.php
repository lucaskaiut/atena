<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TimeEntryRequest;
use App\Http\Resources\TimeEntryResource;
use App\Services\TimeEntryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TimeEntryController extends Controller
{
    public function __construct(
        private TimeEntryService $timeEntryService
    ) {}

    public function start(int $taskId): JsonResponse
    {
        $user = auth()->user();
        $entry = $this->timeEntryService->start($taskId, $user->id, $user->company_id);
        return (new TimeEntryResource($entry))->response()->setStatusCode(201);
    }

    public function pause(int $id): JsonResponse
    {
        $entry = $this->timeEntryService->pause($id);
        return (new TimeEntryResource($entry))->response();
    }

    public function resume(int $id): JsonResponse
    {
        $entry = $this->timeEntryService->resume($id);
        return (new TimeEntryResource($entry))->response()->setStatusCode(201);
    }

    public function store(TimeEntryRequest $request, int $taskId): JsonResponse
    {
        $data = $request->validated();
        $data['task_id'] = $taskId;
        $data['user_id'] = auth()->id();
        $data['company_id'] = auth()->user()->company_id;

        $entry = $this->timeEntryService->createManual($data);
        return (new TimeEntryResource($entry))->response()->setStatusCode(201);
    }

    public function index(Request $request): JsonResponse
    {
        $entries = $this->timeEntryService->list($request->all());
        return response()->json(TimeEntryResource::collection($entries)->response()->getData(true));
    }

    public function byTask(int $taskId): JsonResponse
    {
        $entries = $this->timeEntryService->byTask($taskId);
        return response()->json(TimeEntryResource::collection($entries)->response()->getData(true));
    }
}
