<?php

namespace Tests\Feature;

use App\Models\Company;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_companies(): void
    {
        $user = $this->createUserWithCompany();
        Company::create(['name' => 'Second Co', 'status' => 'active']);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/companies');

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => [['id', 'name', 'cnpj', 'status']]]);
    }

    public function test_can_create_company(): void
    {
        $user = $this->createUserWithCompany();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/companies', [
            'name' => 'New Company',
            'corporate_name' => 'New Company Ltda',
            'cnpj' => '11.111.111/0001-11',
            'email' => 'new@company.com',
            'status' => 'active',
        ]);

        $response->assertStatus(201)
            ->assertJson(['data' => ['name' => 'New Company']]);
    }

    public function test_can_view_company(): void
    {
        $user = $this->createUserWithCompany();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/companies/' . $user->company_id);

        $response->assertStatus(200)
            ->assertJson(['data' => ['id' => $user->company_id]]);
    }

    public function test_can_update_company(): void
    {
        $user = $this->createUserWithCompany();

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/companies/' . $user->company_id, [
            'name' => 'Updated Company',
            'trade_name' => 'Updated Trade',
        ]);

        $response->assertStatus(200)
            ->assertJson(['data' => ['name' => 'Updated Company']]);
    }
}
