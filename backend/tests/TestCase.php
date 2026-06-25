<?php

namespace Tests;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    protected function createUserWithCompany(array $userData = [], array $companyData = []): User
    {
        $company = Company::create(array_merge([
            'name' => 'Test Company',
            'corporate_name' => 'Test Company Ltda',
            'cnpj' => '00.000.000/0001-00',
            'email' => 'test@company.com',
            'status' => 'active',
        ], $companyData));

        $user = User::create(array_merge([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'company_id' => $company->id,
            'status' => 'active',
        ], $userData));

        return $user;
    }
}
