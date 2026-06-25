<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClientRequest;
use App\Http\Resources\ClientResource;
use App\Services\ClientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function __construct(
        private ClientService $clientService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $clients = $this->clientService->list($request->all());
        return response()->json(ClientResource::collection($clients)->response()->getData(true));
    }

    public function store(ClientRequest $request): JsonResponse
    {
        $client = $this->clientService->create($request->validated());
        return (new ClientResource($client))->response()->setStatusCode(201);
    }

    public function show(int $id): JsonResponse
    {
        $client = $this->clientService->get($id);
        return (new ClientResource($client))->response();
    }

    public function update(ClientRequest $request, int $id): JsonResponse
    {
        $client = $this->clientService->update($id, $request->validated());
        return (new ClientResource($client))->response();
    }

    public function destroy(int $id): JsonResponse
    {
        $this->clientService->delete($id);
        return response()->json(['message' => 'Client deleted']);
    }
}
