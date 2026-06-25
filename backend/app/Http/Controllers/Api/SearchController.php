<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Project;
use App\Models\Task;
use App\Models\Subtask;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = $request->get('q', '');

        if (strlen($q) < 2) {
            return response()->json(['data' => []]);
        }

        $clients = Client::where('name', 'like', "%{$q}%")
            ->orWhere('email', 'like', "%{$q}%")
            ->limit(5)
            ->get()
            ->map(fn($c) => ['type' => 'client', 'id' => $c->id, 'name' => $c->name, 'email' => $c->email]);

        $projects = Project::where('name', 'like', "%{$q}%")
            ->limit(5)
            ->get()
            ->map(fn($p) => ['type' => 'project', 'id' => $p->id, 'name' => $p->name]);

        $tasks = Task::where('title', 'like', "%{$q}%")
            ->orWhere('description', 'like', "%{$q}%")
            ->limit(10)
            ->get()
            ->map(fn($t) => ['type' => 'task', 'id' => $t->id, 'name' => $t->title]);

        $subtasks = Subtask::where('title', 'like', "%{$q}%")
            ->limit(5)
            ->get()
            ->map(fn($s) => ['type' => 'subtask', 'id' => $s->id, 'name' => $s->title, 'task_id' => $s->task_id]);

        return response()->json([
            'data' => $clients->concat($projects)->concat($tasks)->concat($subtasks),
        ]);
    }
}
