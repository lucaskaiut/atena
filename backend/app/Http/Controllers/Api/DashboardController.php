<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    public function index(): JsonResponse
    {
        $indicators = $this->dashboardService->getIndicators();
        return response()->json(['data' => $indicators]);
    }

    public function productivity(): JsonResponse
    {
        $productivity = $this->dashboardService->productivity();
        return response()->json(['data' => $productivity]);
    }

    public function tasksByStatus(): JsonResponse
    {
        $data = $this->dashboardService->tasksByStatus();
        return response()->json(['data' => $data]);
    }

    public function recentTasks(): JsonResponse
    {
        $tasks = $this->dashboardService->recentTasks();
        return response()->json(['data' => $tasks]);
    }
}
