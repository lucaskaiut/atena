<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'name' => fake()->name(),
            'corporate_name' => fake()->company(),
            'document' => fake()->numerify('###.###.###-##'),
            'email' => fake()->email(),
            'phone' => fake()->phoneNumber(),
            'contact_person' => fake()->name(),
            'notes' => fake()->sentence(),
            'status' => 'active',
        ];
    }
}
