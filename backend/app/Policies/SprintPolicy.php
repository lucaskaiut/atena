<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Sprint;

class SprintPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Sprint $sprint): bool
    {
        return $user->company_id === $sprint->company_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Sprint $sprint): bool
    {
        return $user->company_id === $sprint->company_id;
    }

    public function delete(User $user, Sprint $sprint): bool
    {
        return $user->company_id === $sprint->company_id;
    }
}
