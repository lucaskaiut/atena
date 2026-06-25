<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(
        private ProjectService $projectService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $projects = $this->projectService->list($request->all());
        return response()->json(ProjectResource::collection($projects)->response()->getData(true));
    }

    public function store(ProjectRequest $request): JsonResponse
    {
        $project = $this->projectService->create($request->validated());
        return (new ProjectResource($project))->response()->setStatusCode(201);
    }

    public function show(int $id): JsonResponse
    {
        $project = $this->projectService->get($id);
        return (new ProjectResource($project))->response();
    }

    public function update(ProjectRequest $request, int $id): JsonResponse
    {
        $project = $this->projectService->update($id, $request->validated());
        return (new ProjectResource($project))->response();
    }

    public function destroy(int $id): JsonResponse
    {
        $this->projectService->delete($id);
        return response()->json(['message' => 'Project deleted']);
    }

    public function close(int $id): JsonResponse
    {
        $project = $this->projectService->close($id);
        return (new ProjectResource($project))->response();
    }
}
