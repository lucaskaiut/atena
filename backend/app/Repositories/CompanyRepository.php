<?php

namespace App\Repositories;

use App\Interfaces\CompanyRepositoryInterface;
use App\Models\Company;

class CompanyRepository implements CompanyRepositoryInterface
{
    public function all(array $filters = [])
    {
        $query = Company::query();
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('name', 'like', '%'.$filters['search'].'%')
                  ->orWhere('cnpj', 'like', '%'.$filters['search'].'%');
            });
        }
        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function find(int $id)
    {
        return Company::findOrFail($id);
    }

    public function create(array $data)
    {
        return Company::create($data);
    }

    public function update(int $id, array $data)
    {
        $company = $this->find($id);
        $company->update($data);
        return $company;
    }
}
