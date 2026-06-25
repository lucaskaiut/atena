<?php

namespace App\Services;

use App\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    public function register(array $data): array
    {
        if (!isset($data['company_id'])) {
            $company = (new \App\Repositories\CompanyRepository())->create([
                'name' => $data['company_name'] ?? $data['name'] . ' Company',
                'corporate_name' => $data['corporate_name'] ?? null,
                'cnpj' => $data['cnpj'] ?? null,
                'email' => $data['email'],
                'status' => 'active',
            ]);
            $data['company_id'] = $company->id;
        }

        $data['password'] = Hash::make($data['password']);
        $data['status'] = 'active';

        $user = $this->userRepository->create($data);
        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function login(array $credentials): array
    {
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciais inválidas.'],
            ]);
        }

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }

    public function me(User $user): User
    {
        return $user->load('company');
    }
}
