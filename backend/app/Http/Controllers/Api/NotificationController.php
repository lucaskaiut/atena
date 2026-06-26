<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    public function index(): JsonResponse
    {
        $notifications = $this->notificationService->list(auth()->id());
        return response()->json(NotificationResource::collection($notifications)->response()->getData(true));
    }

    public function markAsRead(int $id): JsonResponse
    {
        $notification = $this->notificationService->markAsRead($id);
        return (new NotificationResource($notification))->response();
    }

    public function markAllAsRead(): JsonResponse
    {
        $this->notificationService->markAllAsRead(auth()->id());
        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function unreadCount(): JsonResponse
    {
        $count = $this->notificationService->unreadCount(auth()->id());
        return response()->json(['count' => $count]);
    }
}
