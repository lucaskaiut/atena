<?php

namespace Database\Factories;

use App\Models\Status;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

class StatusFactory extends Factory
{
    protected $model = Status::class;

    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'name' => fake()->unique()->word(),
            'color' => fake()->hexColor(),
            'position' => fake()->numberBetween(0, 10),
            'is_active' => true,
        ];
    }
}
