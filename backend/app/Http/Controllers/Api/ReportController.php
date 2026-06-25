<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(
        private ReportService $reportService
    ) {}

    public function hours(Request $request): JsonResponse
    {
        $report = $this->reportService->hoursReport($request->all());
        return response()->json($report);
    }

    public function tasks(): JsonResponse
    {
        $report = $this->reportService->tasksReport();
        return response()->json($report);
    }

    public function estimates(): JsonResponse
    {
        $report = $this->reportService->estimatesReport();
        return response()->json($report);
    }
}
