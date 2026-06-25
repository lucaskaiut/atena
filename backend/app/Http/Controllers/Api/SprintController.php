<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SprintRequest;
use App\Http\Resources\SprintResource;
use App\Services\SprintService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SprintController extends Controller
{
    public function __construct(
        private SprintService $sprintService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $sprints = $this->sprintService->list($request->all());
        return response()->json(SprintResource::collection($sprints)->response()->getData(true));
    }

    public function store(SprintRequest $request): JsonResponse
    {
        $sprint = $this->sprintService->create($request->validated());
        return (new SprintResource($sprint))->response()->setStatusCode(201);
    }

    public function show(int $id): JsonResponse
    {
        $sprint = $this->sprintService->get($id);
        return (new SprintResource($sprint))->response();
    }

    public function update(SprintRequest $request, int $id): JsonResponse
    {
        $sprint = $this->sprintService->update($id, $request->validated());
        return (new SprintResource($sprint))->response();
    }

    public function close(int $id): JsonResponse
    {
        $sprint = $this->sprintService->close($id);
        return (new SprintResource($sprint))->response();
    }
}
