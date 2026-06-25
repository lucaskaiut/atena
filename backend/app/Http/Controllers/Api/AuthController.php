<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AuthLoginRequest;
use App\Http\Requests\AuthRegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    public function register(AuthRegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return response()->json([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ], 201)->withCookie($this->authCookie($result['token']));
    }

    public function login(AuthLoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated());

        return response()->json([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ])->withCookie($this->authCookie($result['token']));
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json(['message' => 'Logged out'])
            ->withCookie(cookie('auth_token', '', -1));
    }

    public function me(Request $request): JsonResponse
    {
        $user = $this->authService->me($request->user());

        return (new UserResource($user))->response();
    }

    private function authCookie(string $token): \Symfony\Component\HttpFoundation\Cookie
    {
        $secure = app()->environment('local') ? false : true;
        return cookie('auth_token', $token, 60 * 24, '/', null, $secure, true, false, 'Lax');
    }
}
