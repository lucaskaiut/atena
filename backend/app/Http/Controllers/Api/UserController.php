<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $users = $this->userService->list($request->all());
        return response()->json(UserResource::collection($users)->response()->getData(true));
    }

    public function store(UserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated());
        return (new UserResource($user))->response()->setStatusCode(201);
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->userService->get($id);
        return (new UserResource($user))->response();
    }

    public function update(UserRequest $request, int $id): JsonResponse
    {
        $user = $this->userService->update($id, $request->validated());
        return (new UserResource($user))->response();
    }

    public function destroy(int $id): JsonResponse
    {
        $this->userService->delete($id);
        return response()->json(['message' => 'User deactivated']);
    }
}
