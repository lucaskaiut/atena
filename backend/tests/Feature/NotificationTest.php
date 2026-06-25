<?php

namespace Tests\Feature;

use App\Models\Notification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_notifications(): void
    {
        $user = $this->createUserWithCompany();
        Notification::create([
            'user_id' => $user->id,
            'title' => 'Test Notification',
            'message' => 'You have a new task',
            'type' => 'info',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/notifications');

        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data'));
    }

    public function test_can_mark_notification_as_read(): void
    {
        $user = $this->createUserWithCompany();
        $notification = Notification::create([
            'user_id' => $user->id,
            'title' => 'Read Me',
            'message' => 'Mark as read',
            'type' => 'info',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->patchJson('/api/notifications/' . $notification->id . '/read');

        $response->assertStatus(200);

        $this->assertNotNull($notification->fresh()->read_at);
    }

    public function test_can_mark_all_notifications_as_read(): void
    {
        $user = $this->createUserWithCompany();
        Notification::create(['user_id' => $user->id, 'title' => 'N1', 'type' => 'info']);
        Notification::create(['user_id' => $user->id, 'title' => 'N2', 'type' => 'info']);

        $response = $this->actingAs($user, 'sanctum')->patchJson('/api/notifications/read-all');

        $response->assertStatus(200);
        $this->assertEquals(0, Notification::where('user_id', $user->id)->whereNull('read_at')->count());
    }
}
