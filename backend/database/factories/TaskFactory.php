<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\Company;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'project_id' => Project::factory(),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'priority' => fake()->randomElement(['low', 'medium', 'high', 'critical']),
            'status_id' => null,
            'start_date' => fake()->date(),
            'expected_end_date' => fake()->dateTimeBetween('+1 week', '+3 months')->format('Y-m-d'),
            'estimated_hours' => fake()->randomFloat(2, 1, 100),
        ];
    }
}
