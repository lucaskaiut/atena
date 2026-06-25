<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Services\CompanyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function __construct(
        private CompanyService $companyService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $companies = $this->companyService->list($request->all());
        return response()->json(CompanyResource::collection($companies)->response()->getData(true));
    }

    public function store(CompanyRequest $request): JsonResponse
    {
        $company = $this->companyService->create($request->validated());
        return (new CompanyResource($company))->response()->setStatusCode(201);
    }

    public function show(int $id): JsonResponse
    {
        $company = $this->companyService->get($id);
        return (new CompanyResource($company))->response();
    }

    public function update(CompanyRequest $request, int $id): JsonResponse
    {
        $company = $this->companyService->update($id, $request->validated());
        return (new CompanyResource($company))->response();
    }
}
