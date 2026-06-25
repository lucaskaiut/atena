<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StatusRequest;
use App\Http\Resources\StatusResource;
use App\Services\StatusService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    public function __construct(
        private StatusService $statusService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $statuses = $this->statusService->list($request->all());
        return response()->json(StatusResource::collection($statuses)->response()->getData(true));
    }

    public function store(StatusRequest $request): JsonResponse
    {
        $status = $this->statusService->create($request->validated());
        return (new StatusResource($status))->response()->setStatusCode(201);
    }

    public function update(StatusRequest $request, int $id): JsonResponse
    {
        $status = $this->statusService->update($id, $request->validated());
        return (new StatusResource($status))->response();
    }

    public function toggle(int $id): JsonResponse
    {
        $status = $this->statusService->toggle($id);
        return (new StatusResource($status))->response();
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'positions' => 'required|array',
            'positions.*.id' => 'required|exists:statuses,id',
            'positions.*.position' => 'required|integer|min:0',
        ]);

        $statuses = $this->statusService->reorder($request->positions);
        return response()->json(StatusResource::collection($statuses)->response()->getData(true));
    }
}
