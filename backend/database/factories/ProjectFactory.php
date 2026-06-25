<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\Company;
use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'client_id' => Client::factory(),
            'name' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'manager_id' => User::factory(),
            'start_date' => fake()->date(),
            'expected_end_date' => fake()->dateTimeBetween('+1 month', '+6 months')->format('Y-m-d'),
            'priority' => fake()->randomElement(['low', 'medium', 'high', 'critical']),
            'status_id' => null,
        ];
    }
}
